import logging
import difflib
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.database_models import Person, Phone, SIM, Vehicle, BankAccount
from app.models.schemas import EntityResolutionCandidate, EntityResolutionResponse

logger = logging.getLogger("nexus.services.entity_resolution")

class EntityResolutionService:
    def resolve_candidates(
        self,
        db: Session,
        query_entity_id: str
    ) -> EntityResolutionResponse:
        """
        Bharat-aware entity resolution pipeline.
        Analyzes phonetic keys, transliteration variants, criminal aliases, location context (state/district),
        and shared identifiers to suggest candidate matching profiles with explainable confidence.
        Does NOT automatically merge or alter database records.
        """
        focal_person = db.query(Person).filter(Person.id == query_entity_id).first()
        if not focal_person:
            return EntityResolutionResponse(query_entity_id=query_entity_id, total_candidates=0, candidates=[])

        all_persons = db.query(Person).filter(Person.id != query_entity_id).all()
        candidates: List[EntityResolutionCandidate] = []

        # Find phones owned/registered to focal person
        focal_phones = set()
        for ph in db.query(Phone).filter(Phone.registered_name == focal_person.name).all():
            focal_phones.add(ph.id)

        for p in all_persons:
            signals: List[str] = []
            score = 0.0

            # 1. Exact canonical name match
            if focal_person.canonical_name and p.canonical_name:
                if focal_person.canonical_name.strip().lower() == p.canonical_name.strip().lower():
                    signals.append("exact_canonical_name_match")
                    score += 0.45

            # 2. Name variant or alias match
            if focal_person.aliases and p.name in focal_person.aliases:
                signals.append("alias_match")
                score += 0.35
            elif p.aliases and focal_person.name in p.aliases:
                signals.append("alias_match")
                score += 0.35

            if focal_person.name_variants and p.name in focal_person.name_variants:
                signals.append("transliteration_variant_match")
                score += 0.30

            # 3. Phonetic key match
            if focal_person.phonetic_key and p.phonetic_key:
                if focal_person.phonetic_key == p.phonetic_key:
                    signals.append("phonetic_key_match")
                    score += 0.25

            # 4. Fuzzy string similarity
            ratio = difflib.SequenceMatcher(None, focal_person.name.lower(), p.name.lower()).ratio()
            if ratio > 0.82 and "exact_canonical_name_match" not in signals:
                signals.append("high_fuzzy_name_similarity")
                score += (ratio * 0.20)

            # 5. Shared location / district context
            if focal_person.district and p.district and focal_person.district == p.district:
                signals.append("shared_district_context")
                score += 0.10

            # 6. Shared phone registration
            other_phones = set(ph.id for ph in db.query(Phone).filter(Phone.registered_name == p.name).all())
            if focal_phones and (focal_phones & other_phones):
                signals.append("shared_phone_registration")
                score += 0.30

            if signals and score >= 0.30:
                confidence = min(0.98, round(score, 2))
                candidates.append(
                    EntityResolutionCandidate(
                        candidate_id=p.id,
                        candidate_name=p.name,
                        entity_type="Person",
                        confidence=confidence,
                        signals=signals,
                        matched_properties={
                            "canonical_name": p.canonical_name,
                            "district": p.district,
                            "state": p.state,
                            "phonetic_key": p.phonetic_key
                        }
                    )
                )

        candidates.sort(key=lambda c: c.confidence, reverse=True)
        return EntityResolutionResponse(
            query_entity_id=query_entity_id,
            total_candidates=len(candidates),
            candidates=candidates
        )

entity_resolution_service = EntityResolutionService()
