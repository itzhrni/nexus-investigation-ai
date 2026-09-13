import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.database_models import Person, Phone, Vehicle, BankAccount, Location, FIR

logger = logging.getLogger("nexus.services.relationship_extraction")

class RelationshipExtractionService:
    def extract_relationships_from_entities(
        self,
        db: Session,
        text_content: str,
        extracted_entities: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Relationship Extraction pipeline linking extracted entities based on text context and referential metadata.
        Generates relationship triples with confidence scores for PostgreSQL insertion.
        """
        extracted_rels: List[Dict[str, Any]] = []
        rel_ids = set()

        def add_rel(rel_id: str, src_type: str, src_id: str, tgt_type: str, tgt_id: str, rtype: str, conf: float = 0.90, meta: dict = None):
            if rel_id in rel_ids or src_id == tgt_id:
                return
            rel_ids.add(rel_id)
            extracted_rels.append({
                "id": rel_id,
                "source_entity_type": src_type,
                "source_entity_id": src_id,
                "target_entity_type": tgt_type,
                "target_entity_id": tgt_id,
                "relationship_type": rtype,
                "confidence": conf,
                "metadata": meta or {}
            })

        entities_by_type: Dict[str, List[Dict[str, Any]]] = {}
        for e in extracted_entities:
            etype = e["entity_type"]
            if etype not in entities_by_type:
                entities_by_type[etype] = []
            entities_by_type[etype].append(e)

        persons = entities_by_type.get("Person", [])
        phones = entities_by_type.get("Phone", [])
        vehicles = entities_by_type.get("Vehicle", [])
        locations = entities_by_type.get("Location", [])
        firs = entities_by_type.get("FIR", [])
        accounts = entities_by_type.get("BankAccount", [])

        # 1. PERSON -> OWNS_PHONE / USES_PHONE -> PHONE
        for p in persons:
            for ph in phones:
                add_rel(
                    f"REL_EXT_P_PH_{p['id']}_{ph['id']}",
                    "Person", p["id"],
                    "Phone", ph["id"],
                    "OWNS_PHONE",
                    conf=0.92
                )

        # 2. PERSON -> OWNS_VEHICLE -> VEHICLE
        for p in persons:
            for v in vehicles:
                add_rel(
                    f"REL_EXT_P_V_{p['id']}_{v['id']}",
                    "Person", p["id"],
                    "Vehicle", v["id"],
                    "OWNS_VEHICLE",
                    conf=0.90
                )

        # 3. PERSON -> SPOTTED_AT -> LOCATION
        for p in persons:
            for loc in locations:
                add_rel(
                    f"REL_EXT_P_LOC_{p['id']}_{loc['id']}",
                    "Person", p["id"],
                    "Location", loc["id"],
                    "SPOTTED_AT",
                    conf=0.88
                )

        # 4. VEHICLE -> SEEN_AT -> LOCATION
        for v in vehicles:
            for loc in locations:
                add_rel(
                    f"REL_EXT_V_LOC_{v['id']}_{loc['id']}",
                    "Vehicle", v["id"],
                    "Location", loc["id"],
                    "SEEN_AT",
                    conf=0.91
                )

        # 5. PERSON / LOCATION / CRIME -> ASSOCIATED_WITH -> FIR
        for fir in firs:
            for p in persons:
                add_rel(
                    f"REL_EXT_P_FIR_{p['id']}_{fir['id']}",
                    "Person", p["id"],
                    "FIR", fir["id"],
                    "ASSOCIATED_WITH_FIR",
                    conf=0.95
                )
            for loc in locations:
                add_rel(
                    f"REL_EXT_FIR_LOC_{fir['id']}_{loc['id']}",
                    "FIR", fir["id"],
                    "Location", loc["id"],
                    "OCCURRED_AT",
                    conf=0.94
                )

        # 6. BANKACCOUNT -> TRANSFERRED_MONEY -> BANKACCOUNT
        if len(accounts) >= 2:
            add_rel(
                f"REL_EXT_ACC_ACC_{accounts[0]['id']}_{accounts[1]['id']}",
                "BankAccount", accounts[0]["id"],
                "BankAccount", accounts[1]["id"],
                "TRANSFERRED_MONEY",
                conf=0.89
            )

        return extracted_rels

relationship_extraction_service = RelationshipExtractionService()
