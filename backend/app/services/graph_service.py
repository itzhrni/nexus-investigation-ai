import logging
from typing import List, Dict, Any, Optional, Set
from sqlalchemy.orm import Session
from sqlalchemy import text, or_
import networkx as nx

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

        # Enrich Location nodes with DB coordinates and jurisdiction metadata
        loc_ids = [nid for nid, node in nodes_dict.items() if node.type.lower() == "location" or nid.startswith("LOC")]
        if loc_ids:
            locations = db.query(Location).filter(Location.id.in_(loc_ids)).all()
            for loc in locations:
                if loc.id in nodes_dict:
                    if loc.name:
                        nodes_dict[loc.id].label = loc.name
                    nodes_dict[loc.id].properties.update({
                        "name": loc.name,
                        "state": loc.state,
                        "district": loc.district,
                        "police_station": loc.police_station,
                        "jurisdiction_id": loc.jurisdiction_id,
                        "latitude": loc.latitude,
                        "longitude": loc.longitude,
                        "address": loc.address,
                        "location_type": loc.location_type
                    })

        return nodes_dict

    def _calculate_graph_metrics(self, nodes: List[NodeSchema], edges: List[EdgeSchema]) -> GraphMetricsSchema:
        """
        Calculate graph-level metrics, Louvain communities, and Betweenness Centrality bridge nodes
        for the focal investigation subgraph using NetworkX.
        """
        rel_dist: Dict[str, int] = {}
        for e in edges:
            rel_dist[e.type] = rel_dist.get(e.type, 0) + 1

        if not nodes:
            return GraphMetricsSchema(
                total_nodes=0,
                total_edges=0,
                relationship_distribution={},
                central_entities=[],
                total_communities=0,
                bridge_nodes=[]
            )

        # Build NetworkX undirected graph for structural analysis
        G = nx.Graph()
        for n in nodes:
            G.add_node(n.id)
        for e in edges:
            if e.source != e.target:  # Ignore self-loops for community/betweenness calculations
                G.add_edge(e.source, e.target)

        # 1. Louvain Community Detection
        community_map: Dict[str, int] = {}
        total_communities = 0
        if G.number_of_nodes() > 0:
            try:
                # Use built-in NetworkX Louvain algorithm
                communities_list = list(nx.community.louvain_communities(G, seed=42))
                total_communities = len(communities_list)
                for comm_idx, comm_set in enumerate(communities_list):
                    for nid in comm_set:
                        community_map[nid] = comm_idx
            except Exception as err:
                logger.debug(f"Louvain community detection fallback: {err}")
                # Fallback to connected components if Louvain fails
                components = list(nx.connected_components(G))
                total_communities = len(components)
                for comm_idx, comp_set in enumerate(components):
                    for nid in comp_set:
                        community_map[nid] = comm_idx

        # 2. Betweenness Centrality & Bridge / Connector Node Identification
        betweenness_map: Dict[str, float] = {}
        if G.number_of_nodes() > 0:
            try:
                betweenness_map = nx.betweenness_centrality(G)
            except Exception as err:
                logger.debug(f"Betweenness calculation note: {err}")
                betweenness_map = {n.id: 0.0 for n in nodes}

        # Determine dynamic bridge threshold based on graph size and community structure
        is_bridge_map: Dict[str, bool] = {}
        all_bc_scores = [score for score in betweenness_map.values() if score > 0.0]
        bc_threshold = 0.10
        if all_bc_scores:
            all_bc_scores.sort(reverse=True)
            # Threshold at 75th percentile or 0.08
            p75_idx = max(0, len(all_bc_scores) // 4)
            bc_threshold = max(0.08, all_bc_scores[p75_idx])

        for nid in G.nodes():
            score = betweenness_map.get(nid, 0.0)
            is_br = False
            if score > 0.0:
                # Node connects neighbors in 2 or more distinct communities
                neighbor_comms = {community_map.get(nbr) for nbr in G.neighbors(nid) if nbr in community_map}
                if total_communities > 1 and len(neighbor_comms) > 1 and score >= 0.03:
                    is_br = True
                elif score >= bc_threshold:
                    is_br = True
            is_bridge_map[nid] = is_br

        # 3. Populate fields on NodeSchema objects
        for n in nodes:
            n.community_id = community_map.get(n.id, 0)
            n.betweenness_centrality = round(betweenness_map.get(n.id, 0.0), 4)
            n.is_bridge = is_bridge_map.get(n.id, False)

        # 4. Degree centrality highlights
        degrees: Dict[str, int] = {n.id: G.degree(n.id) if n.id in G else 0 for n in nodes}
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

        # 5. Collect bridge nodes details
        bridge_nodes_summary = []
        for n in nodes:
            if n.is_bridge:
                bridge_nodes_summary.append({
                    "entity_id": n.id,
                    "label": n.label,
                    "entity_type": n.type,
                    "betweenness_centrality": n.betweenness_centrality,
                    "community_id": n.community_id,
                    "investigation_role": "High-connectivity bridge intermediary"
                })

        return GraphMetricsSchema(
            total_nodes=len(nodes),
            total_edges=len(edges),
            relationship_distribution=rel_dist,
            central_entities=central_entities,
            total_communities=total_communities,
            bridge_nodes=bridge_nodes_summary
        )

graph_service = PostgresGraphService()
