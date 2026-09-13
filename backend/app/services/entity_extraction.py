import re
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.database_models import Entity, Person, Phone, SIM, Device, Vehicle, BankAccount, Location, FIR
from app.services.entity_resolution import entity_resolution_service

logger = logging.getLogger("nexus.services.entity_extraction")

class EntityExtractionService:
    def normalize_phone(self, phone_str: str) -> Optional[str]:
        """Normalize Indian phone numbers to canonical +9198XXXXXXXX format."""
        digits = re.sub(r"\D", "", phone_str)
        if len(digits) == 10 and digits[0] in "6789":
            return f"+91{digits}"
        elif len(digits) == 12 and digits.startswith("91"):
            return f"+{digits}"
        return None

    def normalize_vehicle_reg(self, reg_str: str) -> Optional[str]:
        """Normalize Indian vehicle registration numbers (e.g., DL 01 CA 1234 -> DL01CA1234)."""
        clean = re.sub(r"[\s\-_]", "", reg_str.upper())
        pattern = r"^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$"
        if re.match(pattern, clean):
            return clean
        return None

    def extract_entities_from_text(self, db: Session, text_content: str) -> Dict[str, Any]:
        """
        NLP / RegEx Entity Extraction pipeline for raw FIR text or intelligence reports.
        Extracts Person, Phone, Vehicle, Location, FIR, Account, SIM, Device entities with confidence scores.
        Runs non-destructive entity resolution for matching candidates.
        """
        extracted_entities: List[Dict[str, Any]] = []
        warnings: List[str] = []
        seen_identifiers = set()

        def add_entity(etype: str, primary_id: str, label: str, raw_val: str, conf: float, extra_meta: dict = None):
            if primary_id in seen_identifiers:
                return
            seen_identifiers.add(primary_id)
            
            # Check existing entity in database
            existing_db_entity = db.query(Entity).filter(Entity.id == primary_id).first()
            is_new = existing_db_entity is None

            candidates = []
            if etype == "Person" and not is_new:
                er_res = entity_resolution_service.resolve_candidates(db, query_entity_id=primary_id)
                candidates = [c.dict() for c in er_res.candidates[:3]]

            extracted_entities.append({
                "entity_type": etype,
                "id": primary_id,
                "label": label,
                "raw_text": raw_val,
                "normalized_value": primary_id,
                "confidence": conf,
                "is_new": is_new,
                "resolution_candidates": candidates,
                "metadata": extra_meta or {}
            })

        # 1. Extract Explicit Entity IDs (P001, PH001, SIM001, DEV001, V001, ACC001, LOC001, FIR001)
        id_patterns = [
            ("Person", r"\b(P\d{3})\b"),
            ("Phone", r"\b(PH\d{3})\b"),
            ("SIM", r"\b(SIM\d{3})\b"),
            ("Device", r"\b(DEV\d{3})\b"),
            ("Vehicle", r"\b(V\d{3})\b"),
            ("BankAccount", r"\b(ACC\d{3})\b"),
            ("Location", r"\b(LOC\d{3})\b"),
            ("FIR", r"\b(FIR\d{3})\b")
        ]

        for etype, pat in id_patterns:
            matches = re.findall(pat, text_content)
            for m in matches:
                add_entity(etype, m, m, m, 0.98)

        # 2. Extract Phone Numbers (+919810012345 or 9810012345)
        raw_phones = re.findall(r"(\+?91[\s\-]?[6-9]\d{9}|\b[6-9]\d{9}\b)", text_content)
        for rp in raw_phones:
            norm_ph = self.normalize_phone(rp)
            if norm_ph:
                # Find matching phone entity in DB
                existing_ph = db.query(Phone).filter(Phone.msisdn == norm_ph).first()
                ph_id = existing_ph.id if existing_ph else f"PH_EXT_{hash(norm_ph) % 10000:04d}"
                add_entity("Phone", ph_id, norm_ph, rp, 0.95, {"msisdn": norm_ph})

        # 3. Extract Vehicle Registration Numbers (DL01CA1234, MH02CB5678, etc.)
        raw_vehicles = re.findall(r"\b[A-Z]{2}[\s\-_]?\d{1,2}[\s\-_]?[A-Z]{1,3}[\s\-_]?\d{4}\b", text_content, re.IGNORECASE)
        for rv in raw_vehicles:
            norm_v = self.normalize_vehicle_reg(rv)
            if norm_v:
                existing_v = db.query(Vehicle).filter(Vehicle.registration_number == norm_v).first()
                v_id = existing_v.id if existing_v else f"V_EXT_{hash(norm_v) % 10000:04d}"
                add_entity("Vehicle", v_id, norm_v, rv, 0.92, {"registration_number": norm_v})

        # 4. Extract Persons by Name Context (e.g. subject Aarav Sharma, Vikram Patel)
        db_persons = db.query(Person).all()
        for p in db_persons:
            if p.name and p.name.lower() in text_content.lower():
                add_entity("Person", p.id, p.name, p.name, 0.90, {"state": p.state, "district": p.district})

        # 5. Extract Locations by Name Context
        db_locs = db.query(Location).all()
        for loc in db_locs:
            if loc.name and loc.name.lower() in text_content.lower():
                add_entity("Location", loc.id, loc.name, loc.name, 0.90, {"state": loc.state, "police_station": loc.police_station})

        if not extracted_entities:
            warnings.append("No structured entities detected in raw text content.")

        overall_confidence = round(sum(e["confidence"] for e in extracted_entities) / len(extracted_entities), 2) if extracted_entities else 0.0

        return {
            "entities": extracted_entities,
            "total_extracted": len(extracted_entities),
            "overall_confidence": overall_confidence,
            "warnings": warnings
        }

entity_extraction_service = EntityExtractionService()
