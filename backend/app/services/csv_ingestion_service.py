import csv
import io
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models import database_models
from app.services.entity_extraction import entity_extraction_service
from app.services.relationship_extraction import relationship_extraction_service
from scripts.seed_database import bulk_seed_table

logger = logging.getLogger("nexus.services.csv_ingestion")

class CSVIngestionService:
    def ingest_csv(self, db: Session, csv_content: str) -> Dict[str, Any]:
        """
        Robust CSV Ingestion pipeline.
        Parses investigation CSVs, normalizes identifiers, populates PostgreSQL entities and entity_relationships,
        and returns detailed ingestion metrics.
        """
        records_processed = 0
        entities_created = 0
        relationships_created = 0
        duplicates_resolved = 0
        warnings: List[str] = []

        try:
            reader = csv.DictReader(io.StringIO(csv_content))
            if not reader.fieldnames:
                return {
                    "records_processed": 0,
                    "entities_created": 0,
                    "relationships_created": 0,
                    "duplicates_resolved": 0,
                    "warnings": ["Malformed or empty CSV file"]
                }

            entity_records = []
            person_records = []
            phone_records = []
            vehicle_records = []
            location_records = []
            rel_records = []

            seen_entity_ids = set(r[0] for r in db.query(database_models.Entity.id).all())
            seen_rel_ids = set(r[0] for r in db.query(database_models.EntityRelationship.id).all())

            for idx, row in enumerate(reader, start=1):
                records_processed += 1
                rec_id = row.get("record_id", f"REC_{idx:03d}")
                p_name = row.get("person_name", "").strip()
                raw_phone = row.get("phone", "").strip()
                raw_vehicle = row.get("vehicle", "").strip()
                loc_name = row.get("location", "").strip()
                district = row.get("district", "").strip()
                state = row.get("state", "").strip()
                ps = row.get("police_station", "").strip()
                desc = row.get("description", "").strip()

                p_id = f"P_CSV_{hash(p_name) % 10000:04d}" if p_name else None
                ph_id = None
                v_id = None
                loc_id = f"LOC_CSV_{hash(loc_name) % 10000:04d}" if loc_name else None

                # Process Person
                if p_name and p_id:
                    if p_id not in seen_entity_ids:
                        seen_entity_ids.add(p_id)
                        entities_created += 1
                        entity_records.append({"id": p_id, "entity_type": "Person", "primary_identifier": p_name, "metadata_json": {"state": state, "district": district}})
                        person_records.append({"id": p_id, "name": p_name, "canonical_name": p_name, "state": state, "district": district, "notes": desc})
                    else:
                        duplicates_resolved += 1

                # Process Phone
                if raw_phone:
                    norm_ph = entity_extraction_service.normalize_phone(raw_phone) or raw_phone
                    ph_id = f"PH_CSV_{hash(norm_ph) % 10000:04d}"
                    if ph_id not in seen_entity_ids:
                        seen_entity_ids.add(ph_id)
                        entities_created += 1
                        entity_records.append({"id": ph_id, "entity_type": "Phone", "primary_identifier": norm_ph, "metadata_json": {"carrier": "Cellular"}})
                        phone_records.append({"id": ph_id, "msisdn": norm_ph, "registered_name": p_name})
                    else:
                        duplicates_resolved += 1

                # Process Vehicle
                if raw_vehicle:
                    norm_v = entity_extraction_service.normalize_vehicle_reg(raw_vehicle) or raw_vehicle
                    v_id = f"V_CSV_{hash(norm_v) % 10000:04d}"
                    if v_id not in seen_entity_ids:
                        seen_entity_ids.add(v_id)
                        entities_created += 1
                        entity_records.append({"id": v_id, "entity_type": "Vehicle", "primary_identifier": norm_v, "metadata_json": {"registration_number": norm_v}})
                        vehicle_records.append({"id": v_id, "registration_number": norm_v, "owner_person_id": p_id})
                    else:
                        duplicates_resolved += 1

                # Process Location
                if loc_name and loc_id:
                    if loc_id not in seen_entity_ids:
                        seen_entity_ids.add(loc_id)
                        entities_created += 1
                        entity_records.append({"id": loc_id, "entity_type": "Location", "primary_identifier": loc_name, "metadata_json": {"state": state, "district": district, "police_station": ps}})
                        location_records.append({"id": loc_id, "name": loc_name, "state": state, "district": district, "police_station": ps, "latitude": 28.61, "longitude": 77.23})
                    else:
                        duplicates_resolved += 1

                # Create Relationships
                timestamp = f"{row.get('date', '2026-01-10')}T{row.get('time', '12:00:00')}"
                if p_id and ph_id:
                    rel_id = f"REL_CSV_P_PH_{rec_id}"
                    if rel_id not in seen_rel_ids:
                        seen_rel_ids.add(rel_id)
                        relationships_created += 1
                        rel_records.append({"id": rel_id, "source_entity_type": "Person", "source_entity_id": p_id, "target_entity_type": "Phone", "target_entity_id": ph_id, "relationship_type": "OWNS_PHONE", "confidence": 0.95, "event_timestamp": timestamp})

                if p_id and v_id:
                    rel_id = f"REL_CSV_P_V_{rec_id}"
                    if rel_id not in seen_rel_ids:
                        seen_rel_ids.add(rel_id)
                        relationships_created += 1
                        rel_records.append({"id": rel_id, "source_entity_type": "Person", "source_entity_id": p_id, "target_entity_type": "Vehicle", "target_entity_id": v_id, "relationship_type": "OWNS_VEHICLE", "confidence": 0.95, "event_timestamp": timestamp})

                if v_id and loc_id:
                    rel_id = f"REL_CSV_V_LOC_{rec_id}"
                    if rel_id not in seen_rel_ids:
                        seen_rel_ids.add(rel_id)
                        relationships_created += 1
                        rel_records.append({"id": rel_id, "source_entity_type": "Vehicle", "source_entity_id": v_id, "target_entity_type": "Location", "target_entity_id": loc_id, "relationship_type": "SEEN_AT", "confidence": 0.92, "event_timestamp": timestamp})

                if p_id and loc_id:
                    rel_id = f"REL_CSV_P_LOC_{rec_id}"
                    if rel_id not in seen_rel_ids:
                        seen_rel_ids.add(rel_id)
                        relationships_created += 1
                        rel_records.append({"id": rel_id, "source_entity_type": "Person", "source_entity_id": p_id, "target_entity_type": "Location", "target_entity_id": loc_id, "relationship_type": "SPOTTED_AT", "confidence": 0.90, "event_timestamp": timestamp})

            # Bulk insert into PostgreSQL
            bulk_seed_table(db, database_models.Entity, entity_records)
            bulk_seed_table(db, database_models.Person, person_records)
            bulk_seed_table(db, database_models.Phone, phone_records)
            bulk_seed_table(db, database_models.Vehicle, vehicle_records)
            bulk_seed_table(db, database_models.Location, location_records)
            bulk_seed_table(db, database_models.EntityRelationship, rel_records)

        except Exception as e:
            logger.error(f"Error in CSV Ingestion: {e}")
            warnings.append(str(e))

        return {
            "records_processed": records_processed,
            "entities_created": entities_created,
            "relationships_created": relationships_created,
            "duplicates_resolved": duplicates_resolved,
            "warnings": warnings
        }

csv_ingestion_service = CSVIngestionService()
