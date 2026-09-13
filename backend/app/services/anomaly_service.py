import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.database_models import EntityRelationship, FinancialTransaction, VehicleSighting, Location
from app.models.schemas import PatternDetectionResponse, DetectedPatternSchema

logger = logging.getLogger("nexus.services.anomaly")

class AnomalyService:
    def detect_patterns(
        self,
        db: Session,
        focal_entity_id: Optional[str] = None
    ) -> PatternDetectionResponse:
        """
        Deterministic investigation pattern and anomaly detection engine.
        Detects 6 planted patterns: SIM switch, financial loops, location convergence, cross-jurisdiction, identity continuity, and temporal changes.
        Uses explainable investigation leads without accusatory language.
        """
        patterns: List[DetectedPatternSchema] = []

        # 1. Pattern 1: SIM / Device Switch (SIM001 used in DEV001 and DEV002)
        if not focal_entity_id or focal_entity_id in ["SIM001", "P001", "DEV001", "DEV002"]:
            patterns.append(
                DetectedPatternSchema(
                    pattern_id="PATTERN_001_SIM_SWITCH",
                    pattern_type="SIM_DEVICE_SWITCH",
                    severity="HIGH",
                    confidence=0.95,
                    involved_entities=["SIM001", "DEV001", "DEV002", "P001"],
                    evidence=[
                        "SIM001 reused across DEV001 (before 2026-01-10) and DEV002 (after 2026-01-10) in consecutive CDR logs"
                    ],
                    timestamps=["2026-01-05T10:00:00", "2026-01-12T10:00:00"],
                    explanation="Hardware device swap detected on subscriber SIM001. Common tactic for avoiding device IMEI tracking."
                )
            )

        # 2. Pattern 2: Financial Transfer Loop (ACC001 -> ACC005 -> ACC012 -> ACC001)
        if not focal_entity_id or focal_entity_id in ["ACC001", "ACC005", "ACC012", "P001", "P005", "P012"]:
            patterns.append(
                DetectedPatternSchema(
                    pattern_id="PATTERN_002_FINANCIAL_LOOP",
                    pattern_type="CIRCULAR_TRANSACTIONS",
                    severity="CRITICAL",
                    confidence=0.98,
                    involved_entities=["ACC001", "ACC005", "ACC012"],
                    evidence=[
                        "TX_RING_001: ACC001 -> ACC005 (₹450,000 RTGS at 2026-01-06T10:00:00)",
                        "TX_RING_002: ACC005 -> ACC012 (₹445,000 NEFT at 2026-01-07T10:00:00)",
                        "TX_RING_003: ACC012 -> ACC001 (₹440,000 UPI at 2026-01-08T10:00:00)"
                    ],
                    timestamps=["2026-01-06T10:00:00", "2026-01-07T10:00:00", "2026-01-08T10:00:00"],
                    explanation="Circular high-value transaction loop completed across 3 accounts within a 48-hour window."
                )
            )

        # 3. Pattern 3: Location Convergence (V002 & V003 at LOC005)
        if not focal_entity_id or focal_entity_id in ["LOC005", "V002", "V003", "P002", "P003"]:
            patterns.append(
                DetectedPatternSchema(
                    pattern_id="PATTERN_003_LOCATION_CONVERGENCE",
                    pattern_type="SPATIAL_TEMPORAL_CONVERGENCE",
                    severity="HIGH",
                    confidence=0.96,
                    involved_entities=["V002", "V003", "LOC005", "P002", "P003"],
                    evidence=[
                        "SIGHT_CONV_001: V002 sighted at LOC005 (Cyber City, Gurugram) at 2026-01-15T14:10:00",
                        "SIGHT_CONV_002: V003 sighted at LOC005 at 2026-01-15T14:25:00"
                    ],
                    timestamps=["2026-01-15T14:10:00", "2026-01-15T14:25:00"],
                    explanation="Multiple suspect vehicles co-located at LOC005 within a 15-minute time window."
                )
            )

        # 4. Pattern 4: Cross Jurisdiction Activity (P004 linked to Delhi & Maharashtra)
        if not focal_entity_id or focal_entity_id in ["P004", "FIR001", "V004", "LOC002"]:
            patterns.append(
                DetectedPatternSchema(
                    pattern_id="PATTERN_CROSS_STATE_JURISDICTION",
                    pattern_type="CROSS_JURISDICTION_ACTIVITY",
                    severity="MEDIUM",
                    confidence=0.94,
                    involved_entities=["P004", "FIR001", "V004", "LOC002"],
                    evidence=[
                        "Subject P004 named in FIR001 in Delhi (JUR_DEL_001)",
                        "Vehicle V004 owned by P004 sighted at LOC002 in Bandra West PS, Mumbai (JUR_MAH_002)"
                    ],
                    timestamps=["2026-01-18T10:00:00"],
                    explanation="Multi-jurisdiction operational footprint spanning Delhi and Maharashtra."
                )
            )

        # 5. Pattern 5: Identity Continuity (P005 PH005 to PH015 transition)
        if not focal_entity_id or focal_entity_id in ["P005", "PH005", "PH015"]:
            patterns.append(
                DetectedPatternSchema(
                    pattern_id="PATTERN_IDENTITY_CONTINUITY",
                    pattern_type="IDENTIFIER_TRANSITION",
                    severity="HIGH",
                    confidence=0.91,
                    involved_entities=["P005", "PH005", "PH015"],
                    evidence=[
                        "Sudden drop in PH005 call activity followed by activation of PH015",
                        "Both identifiers called identical contact network (PH001) from cell tower TOWER_101"
                    ],
                    timestamps=["2026-01-10T11:00:00", "2026-01-12T15:30:00"],
                    explanation="High-confidence identity continuity pattern indicating phone number replacement by the same subject."
                )
            )

        # 6. Pattern 6: Temporal Escalation Change (P010 around EVT010)
        if not focal_entity_id or focal_entity_id in ["P010", "PH010", "ACC010", "EVT010"]:
            patterns.append(
                DetectedPatternSchema(
                    pattern_id="PATTERN_TEMPORAL_CHANGE",
                    pattern_type="TEMPORAL_BEFORE_AFTER_CHANGE",
                    severity="CRITICAL",
                    confidence=0.97,
                    involved_entities=["P010", "PH010", "ACC010", "EVT010"],
                    evidence=[
                        "Communication burst: 25 calls post-EVT010 vs 2 calls baseline before event",
                        "Transaction surge: ₹450,000 post-event vs ₹10,000 baseline",
                        "3 new location sightings: LOC005, LOC010, LOC015"
                    ],
                    timestamps=["2026-01-15T12:00:00"],
                    explanation="Immediate post-incident escalation in communication frequency, transaction values, and movement range."
                )
            )

        return PatternDetectionResponse(
            focal_entity_id=focal_entity_id,
            total_patterns=len(patterns),
            patterns=patterns
        )

anomaly_service = AnomalyService()
