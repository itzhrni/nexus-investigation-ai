import logging
from typing import Optional
from sqlalchemy.orm import Session

from app.models.database_models import Entity, Person, Phone, SIM, Device, Vehicle, BankAccount, Location, FIR
from app.models.schemas import InvestigationSummaryResponse
from app.services.graph_service import graph_service
from app.services.anomaly_service import anomaly_service
from app.services.continuity_service import continuity_service
from app.services.jurisdiction_service import jurisdiction_service
from app.services.timeline_service import timeline_service
from app.services.evidence_service import evidence_service

logger = logging.getLogger("nexus.services.summary")

class SummaryService:
    def get_investigation_summary(
        self,
        db: Session,
        entity_type: str,
        identifier: str
    ) -> InvestigationSummaryResponse:
        """
        Synthesizes a comprehensive, multi-dimensional investigation dashboard summary payload
        combining graph metrics, detected patterns, identity transitions, cross-jurisdiction insights,
        temporal changes, and 6-W explainable evidence items.
        """
        # 1. Fetch focal entity properties & label
        label = identifier
        properties = {}
        
        entity = db.query(Entity).filter(Entity.id == identifier).first()
        if entity:
            label = entity.primary_identifier
            properties = entity.metadata_json or {}
        else:
            # Fallback to model table lookup
            if identifier.startswith("P") and identifier[1:].isdigit():
                p = db.query(Person).filter(Person.id == identifier).first()
                if p:
                    label = p.name
                    properties = {"state": p.state, "district": p.district, "canonical_name": p.canonical_name}

        # 2. Get Focal Graph & Graph Metrics
        graph_resp = graph_service.get_focal_graph(db, identifier=identifier, entity_type=entity_type, depth=2)

        # 3. Get Detected Patterns
        pattern_resp = anomaly_service.detect_patterns(db, focal_entity_id=identifier)

        # 4. Get Identity Continuity
        continuity_resp = continuity_service.detect_transitions(db, entity_id=identifier)

        # 5. Get Cross-Jurisdiction Insights
        jurisdiction_resp = jurisdiction_service.detect_cross_jurisdiction(db, entity_id=identifier)

        # 6. Get Temporal Baseline Comparison
        timeline_resp = timeline_service.compare_before_after(db, focal_entity_id=identifier)

        # 7. Get Explainable Evidence
        evidence_resp = evidence_service.get_explainable_evidence(db, focal_entity_id=identifier)

        return InvestigationSummaryResponse(
            focal_entity_id=identifier,
            focal_entity_type=entity_type,
            label=label,
            properties=properties,
            graph_metrics=graph_resp.metrics,
            detected_patterns=pattern_resp.patterns,
            identity_transitions=continuity_resp.transitions,
            cross_jurisdiction_insights=jurisdiction_resp.insights,
            temporal_summary=timeline_resp,
            explainable_evidence=evidence_resp.findings
        )

summary_service = SummaryService()
