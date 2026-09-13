import logging
from typing import List, Dict, Any, Optional, Set
from sqlalchemy.orm import Session
from sqlalchemy import text, or_

from app.models.database_models import EntityRelationship, Entity, Person, Phone, SIM, Device, Vehicle, BankAccount, Location, FIR, Crime, Event
from app.models.schemas import FocalGraphResponse, NodeSchema, EdgeSchema, GraphMetricsSchema

logger = logging.getLogger("nexus.services.graph")

class PostgresGraphService:
    def __init__(self):
        pass

    def get_focal_graph(
        self,
        db: Session,
        identifier: str,
        entity_type: Optional[str] = None,
        depth: int = 1,
        relationship_type: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None
    ) -> FocalGraphResponse:
        """
        Retrieve dynamic focal graph centered around a searched entity using PostgreSQL Graph Layer.
        Supports 1-hop, 2-hop, and multi-hop recursive expansion with cycle protection and optional filtering.
        Calculates graph metrics and central entity highlights using NetworkX.
        """
        depth = max(1, min(depth, 5))

        # Perform Graph Traversal (Attempt Recursive SQL CTE first, fallback to BFS if needed)
        relationships = self._traverse_graph_cte(db, identifier, depth, relationship_type, start_time, end_time)
        if not relationships:
            relationships = self._traverse_graph_bfs(db, identifier, depth, relationship_type, start_time, end_time)

        # Collect unique node IDs from relationships
        node_ids: Set[str] = {identifier}
        edge_schemas: List[EdgeSchema] = []

        for rel in relationships:
            node_ids.add(rel.source_entity_id)
            node_ids.add(rel.target_entity_id)

            metadata = rel.metadata_json or {}
            edge_schemas.append(
                EdgeSchema(
                    id=rel.id,
                    source=rel.source_entity_id,
                    target=rel.target_entity_id,
                    type=rel.relationship_type,
                    properties=metadata,
                    timestamp=rel.event_timestamp,
                    confidence=rel.confidence or 1.0,
                    evidence_id=metadata.get("evidence_id")
                )
            )

        # Resolve Node details from entities table or fallback heuristics
        nodes_dict = self._resolve_nodes_metadata(db, node_ids)
        node_schemas: List[NodeSchema] = [nodes_dict[nid] for nid in node_ids if nid in nodes_dict]

        # Determine focal entity type if not explicitly supplied
        focal_type = entity_type or (nodes_dict[identifier].type if identifier in nodes_dict else "Unknown")

        # Calculate Graph Metrics using NetworkX
        metrics = self._calculate_graph_metrics(node_schemas, edge_schemas)

        return FocalGraphResponse(
            focal_entity_id=identifier,
            focal_entity_type=focal_type,
            depth=depth,
            nodes=node_schemas,
            relationships=edge_schemas,
            metrics=metrics
        )

    def _traverse_graph_cte(
        self,
        db: Session,
        start_id: str,
        max_depth: int,
        rel_type_filter: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None
    ) -> List[EntityRelationship]:
        """Recursive SQL Common Table Expression for graph traversal."""
        try:
            sql = text("""
                WITH RECURSIVE graph_cte AS (
                    SELECT 
                        id, source_entity_type, source_entity_id, target_entity_type, target_entity_id,
                        relationship_type, confidence, event_timestamp, metadata_json,
                        1 AS current_depth,
                        ARRAY[source_entity_id::text, target_entity_id::text] AS path
                    FROM entity_relationships
                    WHERE source_entity_id = :start_id OR target_entity_id = :start_id

                    UNION ALL

                    SELECT 
                        r.id, r.source_entity_type, r.source_entity_id, r.target_entity_type, r.target_entity_id,
                        r.relationship_type, r.confidence, r.event_timestamp, r.metadata_json,
                        g.current_depth + 1,
                        g.path || (CASE 
                            WHEN g.target_entity_id = r.source_entity_id THEN r.target_entity_id
                            WHEN g.source_entity_id = r.source_entity_id THEN r.target_entity_id
                            WHEN g.target_entity_id = r.target_entity_id THEN r.source_entity_id
                            ELSE r.source_entity_id
                        END)::text
                    FROM entity_relationships r
                    INNER JOIN graph_cte g ON (
                        g.target_entity_id = r.source_entity_id OR
                        g.source_entity_id = r.source_entity_id OR
                        g.target_entity_id = r.target_entity_id OR
                        g.source_entity_id = r.target_entity_id
                    )
                    WHERE g.current_depth < :max_depth
                      AND NOT (
                        (CASE 
                            WHEN g.target_entity_id = r.source_entity_id THEN r.target_entity_id
                            WHEN g.source_entity_id = r.source_entity_id THEN r.target_entity_id
                            WHEN g.target_entity_id = r.target_entity_id THEN r.source_entity_id
                            ELSE r.source_entity_id
                        END)::text = ANY(g.path)
                      )
                )
                SELECT DISTINCT id, source_entity_type, source_entity_id, target_entity_type, target_entity_id, relationship_type, confidence, event_timestamp, metadata_json FROM graph_cte;
            """)

            result = db.execute(sql, {"start_id": start_id, "max_depth": max_depth}).fetchall()
            
            relationships = []
            seen_ids = set()

            for row in result:
                rel_id = row.id
                if rel_id in seen_ids:
                    continue
                seen_ids.add(rel_id)

                if rel_type_filter and row.relationship_type != rel_type_filter:
                    continue
                if start_time and row.event_timestamp and row.event_timestamp < start_time:
                    continue
                if end_time and row.event_timestamp and row.event_timestamp > end_time:
                    continue

                relationships.append(
                    EntityRelationship(
                        id=row.id,
                        source_entity_type=row.source_entity_type,
                        source_entity_id=row.source_entity_id,
                        target_entity_type=row.target_entity_type,
                        target_entity_id=row.target_entity_id,
                        relationship_type=row.relationship_type,
                        confidence=row.confidence,
                        event_timestamp=row.event_timestamp,
                        metadata_json=row.metadata_json
                    )
                )
            return relationships

        except Exception as e:
            db.rollback()
            logger.debug(f"Recursive CTE execution note: {e}")
            return []

    def _traverse_graph_bfs(
        self,
        db: Session,
        start_id: str,
        max_depth: int,
        rel_type_filter: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None
    ) -> List[EntityRelationship]:
        """Breadth-first search traversal fallback for non-PostgreSQL / SQLite in-memory tests."""
        visited_nodes: Set[str] = {start_id}
        frontier: Set[str] = {start_id}
        collected_rels: Dict[str, EntityRelationship] = {}

        for _ in range(max_depth):
            if not frontier:
                break
            next_frontier: Set[str] = set()

            query = db.query(EntityRelationship).filter(
                or_(
                    EntityRelationship.source_entity_id.in_(frontier),
                    EntityRelationship.target_entity_id.in_(frontier)
                )
            )

            if rel_type_filter:
                query = query.filter(EntityRelationship.relationship_type == rel_type_filter)
            if start_time:
                query = query.filter(
                    or_(EntityRelationship.event_timestamp == None, EntityRelationship.event_timestamp >= start_time)
                )
            if end_time:
                query = query.filter(
                    or_(EntityRelationship.event_timestamp == None, EntityRelationship.event_timestamp <= end_time)
                )

            records = query.all()
            for r in records:
                collected_rels[r.id] = r
                if r.source_entity_id not in visited_nodes:
                    visited_nodes.add(r.source_entity_id)
                    next_frontier.add(r.source_entity_id)
                if r.target_entity_id not in visited_nodes:
                    visited_nodes.add(r.target_entity_id)
                    next_frontier.add(r.target_entity_id)

            frontier = next_frontier

        return list(collected_rels.values())

    def _resolve_nodes_metadata(self, db: Session, node_ids: Set[str]) -> Dict[str, NodeSchema]:
        """Fetch metadata and labels for node IDs."""
        nodes_dict: Dict[str, NodeSchema] = {}

        entities = db.query(Entity).filter(Entity.id.in_(node_ids)).all()
        for e in entities:
            props = e.metadata_json or {}
            nodes_dict[e.id] = NodeSchema(
                id=e.id,
                type=e.entity_type,
                label=e.primary_identifier,
                properties=props
            )

        missing_ids = node_ids - set(nodes_dict.keys())
        for nid in missing_ids:
            entity_type = "Unknown"
            if nid.startswith("P") and nid[1:].isdigit():
                entity_type = "Person"
            elif nid.startswith("PH"):
                entity_type = "Phone"
            elif nid.startswith("SIM"):
                entity_type = "SIM"
            elif nid.startswith("DEV"):
                entity_type = "Device"
            elif nid.startswith("V"):
                entity_type = "Vehicle"
            elif nid.startswith("ACC"):
                entity_type = "BankAccount"
            elif nid.startswith("LOC"):
                entity_type = "Location"
            elif nid.startswith("FIR"):
                entity_type = "FIR"

            nodes_dict[nid] = NodeSchema(
                id=nid,
                type=entity_type,
                label=nid,
                properties={}
            )

        return nodes_dict

    def _calculate_graph_metrics(self, nodes: List[NodeSchema], edges: List[EdgeSchema]) -> GraphMetricsSchema:
        """Calculate graph-level metrics and central entities with non-accusatory terminology."""
        rel_dist: Dict[str, int] = {}
        for e in edges:
            rel_dist[e.type] = rel_dist.get(e.type, 0) + 1

        if not nodes:
            return GraphMetricsSchema(total_nodes=0, total_edges=0, relationship_distribution={}, central_entities=[])

        degrees: Dict[str, int] = {n.id: 0 for n in nodes}
        for e in edges:
            if e.source in degrees:
                degrees[e.source] += 1
            if e.target in degrees:
                degrees[e.target] += 1

        sorted_nodes = sorted(degrees.items(), key=lambda item: item[1], reverse=True)

        node_lookup = {n.id: n for n in nodes}
        central_entities = []
        for nid, deg in sorted_nodes[:5]:
            n_info = node_lookup.get(nid)
            role = "central entity" if deg > 4 else "highly connected entity" if deg > 2 else "notable connection"
            central_entities.append({
                "entity_id": nid,
                "label": n_info.label if n_info else nid,
                "entity_type": n_info.type if n_info else "Unknown",
                "degree": deg,
                "investigation_role": role
            })

        return GraphMetricsSchema(
            total_nodes=len(nodes),
            total_edges=len(edges),
            relationship_distribution=rel_dist,
            central_entities=central_entities
        )

graph_service = PostgresGraphService()
