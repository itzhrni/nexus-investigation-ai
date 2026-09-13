import json
import logging
import sys
from pathlib import Path

# Add backend directory to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.postgres import check_postgres_connection, engine, SessionLocal, Base
from app.models import database_models

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("nexus.seeder")

DATA_DIR = BASE_DIR / "data" / "synthetic"

def load_json(filename: str):
    filepath = DATA_DIR / filename
    if not filepath.exists():
        logger.warning(f"Synthetic data file missing: {filename}. Run generate_data.py first.")
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def bulk_seed_table(db, model_class, records: list, id_field="id"):
    """Helper to bulk insert records idempotently using batch queries."""
    if not records:
        return
    existing_ids = set(r[0] for r in db.query(getattr(model_class, id_field)).all())
    new_records = [r for r in records if r[id_field] not in existing_ids]
    if new_records:
        db.bulk_insert_mappings(model_class, new_records)
        db.commit()
        logger.info(f"Seeded {len(new_records)} new records into {model_class.__tablename__}")
    else:
        logger.info(f"No new records to seed for {model_class.__tablename__} (already up to date)")

def extract_entity_relationships():
    persons = load_json("persons.json") or []
    phones = load_json("phones.json") or []
    sims = load_json("sims.json") or []
    devices = load_json("devices.json") or []
    vehicles = load_json("vehicles.json") or []
    accounts = load_json("accounts.json") or []
    locations = load_json("locations.json") or []
    firs = load_json("firs.json") or []
    crimes = load_json("crimes.json") or []
    events = load_json("events.json") or []
    cdr_data = load_json("cdr.json") or []
    tx_data = load_json("transactions.json") or []
    sightings_data = load_json("sightings.json") or []

    rel_records = []
    rel_ids = set()

    def add_rel(rel_id, src_type, src_id, tgt_type, tgt_id, rel_type, confidence=1.0, timestamp=None, metadata=None):
        if rel_id in rel_ids:
            return
        rel_ids.add(rel_id)
        rel_records.append({
            "id": rel_id,
            "source_entity_type": src_type,
            "source_entity_id": src_id,
            "target_entity_type": tgt_type,
            "target_entity_id": tgt_id,
            "relationship_type": rel_type,
            "confidence": float(confidence),
            "event_timestamp": timestamp,
            "metadata_json": metadata or {}
        })

    # Lookup maps
    person_by_name = {p["name"]: p["id"] for p in persons}
    phone_to_person = {}
    for ph in phones:
        if ph.get("registered_name") and ph["registered_name"] in person_by_name:
            phone_to_person[ph["id"]] = person_by_name[ph["registered_name"]]

    sim_to_person = {s["id"]: s["registered_to_person_id"] for s in sims if s.get("registered_to_person_id")}
    vehicle_to_person = {v["id"]: v["owner_person_id"] for v in vehicles if v.get("owner_person_id")}
    account_to_person = {a["id"]: a["holder_person_id"] for a in accounts if a.get("holder_person_id")}

    # 1. Person -> Phone (OWNS_PHONE)
    for ph in phones:
        if ph.get("registered_name") and ph["registered_name"] in person_by_name:
            pid = person_by_name[ph["registered_name"]]
            add_rel(f"REL_P_PH_{pid}_{ph['id']}", "Person", pid, "Phone", ph["id"], "OWNS_PHONE")

    # 2. Person -> SIM (OWNS_SIM)
    for s in sims:
        if s.get("registered_to_person_id"):
            pid = s["registered_to_person_id"]
            add_rel(f"REL_P_SIM_{pid}_{s['id']}", "Person", pid, "SIM", s["id"], "OWNS_SIM")

    # 3. Person -> Vehicle (OWNS_VEHICLE)
    for v in vehicles:
        if v.get("owner_person_id"):
            pid = v["owner_person_id"]
            add_rel(f"REL_P_VEH_{pid}_{v['id']}", "Person", pid, "Vehicle", v["id"], "OWNS_VEHICLE")

    # 4. Person -> BankAccount (HOLDS_ACCOUNT)
    for a in accounts:
        if a.get("holder_person_id"):
            pid = a["holder_person_id"]
            add_rel(f"REL_P_ACC_{pid}_{a['id']}", "Person", pid, "BankAccount", a["id"], "HOLDS_ACCOUNT")

    # 5. CDR Records
    for cdr in cdr_data:
        call_rel = "CALLED" if cdr.get("call_type") == "CALL" else "MESSAGED"
        add_rel(
            f"REL_CDR_{cdr['id']}",
            "Phone", cdr["caller_phone_id"],
            "Phone", cdr["receiver_phone_id"],
            call_rel,
            timestamp=cdr.get("timestamp"),
            metadata={"duration_seconds": cdr.get("duration_seconds"), "cell_tower_id": cdr.get("cell_tower_id")}
        )
        if cdr.get("sim_id") and cdr.get("device_id"):
            add_rel(
                f"REL_SIM_DEV_{cdr['id']}",
                "SIM", cdr["sim_id"],
                "Device", cdr["device_id"],
                "USED_IN_DEVICE",
                timestamp=cdr.get("timestamp")
            )
        p1 = phone_to_person.get(cdr["caller_phone_id"])
        p2 = phone_to_person.get(cdr["receiver_phone_id"])
        if p1 and p2 and p1 != p2:
            add_rel(
                f"REL_P_P_COMM_{cdr['id']}",
                "Person", p1,
                "Person", p2,
                "COMMUNICATED_WITH",
                timestamp=cdr.get("timestamp"),
                metadata={"call_type": cdr.get("call_type"), "duration": cdr.get("duration_seconds")}
            )

    # 6. Financial Transactions
    for tx in tx_data:
        add_rel(
            f"REL_TX_{tx['id']}",
            "BankAccount", tx["sender_account_id"],
            "BankAccount", tx["receiver_account_id"],
            "TRANSFERRED_MONEY",
            timestamp=tx.get("timestamp"),
            metadata={"amount": tx.get("amount"), "transaction_type": tx.get("transaction_type")}
        )
        p1 = account_to_person.get(tx["sender_account_id"])
        p2 = account_to_person.get(tx["receiver_account_id"])
        if p1 and p2 and p1 != p2:
            add_rel(
                f"REL_P_P_TX_{tx['id']}",
                "Person", p1,
                "Person", p2,
                "TRANSFERRED_FUNDS",
                timestamp=tx.get("timestamp"),
                metadata={"amount": tx.get("amount"), "transaction_type": tx.get("transaction_type")}
            )

    # 7. Vehicle Sightings
    for sgt in sightings_data:
        add_rel(
            f"REL_SIGHT_{sgt['id']}",
            "Vehicle", sgt["vehicle_id"],
            "Location", sgt["location_id"],
            "SEEN_AT",
            confidence=sgt.get("confidence", 0.95),
            timestamp=sgt.get("sighting_timestamp"),
            metadata={"camera_id": sgt.get("camera_id")}
        )
        pid = vehicle_to_person.get(sgt["vehicle_id"])
        if pid:
            add_rel(
                f"REL_P_SIGHT_{sgt['id']}",
                "Person", pid,
                "Location", sgt["location_id"],
                "SPOTTED_AT",
                confidence=sgt.get("confidence", 0.95),
                timestamp=sgt.get("sighting_timestamp"),
                metadata={"vehicle_id": sgt["vehicle_id"], "camera_id": sgt.get("camera_id")}
            )

    # 8. FIRs, Crimes, Events
    for fir in firs:
        if fir.get("summary") and "P004" in fir["summary"]:
            add_rel(f"REL_FIR_P_P004_{fir['id']}", "FIR", fir["id"], "Person", "P004", "NAMES_PERSON")
            add_rel(f"REL_P_FIR_P004_{fir['id']}", "Person", "P004", "FIR", fir["id"], "ASSOCIATED_WITH_FIR")

    for crm in crimes:
        if crm.get("location_id"):
            add_rel(f"REL_CRM_LOC_{crm['id']}", "Crime", crm["id"], "Location", crm["location_id"], "OCCURRED_AT")

    for evt in events:
        if evt.get("location_id"):
            add_rel(f"REL_EVT_LOC_{evt['id']}", "Event", evt["id"], "Location", evt["location_id"], "OCCURRED_AT", timestamp=evt.get("timestamp"))

    # 9. Explicit Ground Truth Patterns Support
    add_rel("REL_GT_P001_SIM001", "Person", "P001", "SIM", "SIM001", "OWNS_SIM")
    add_rel("REL_GT_SIM001_DEV001", "SIM", "SIM001", "Device", "DEV001", "USED_IN_DEVICE", timestamp="2026-01-05T10:00:00")
    add_rel("REL_GT_SIM001_DEV002", "SIM", "SIM001", "Device", "DEV002", "USED_IN_DEVICE", timestamp="2026-01-12T10:00:00")

    add_rel("REL_GT_P004_FIR001", "Person", "P004", "FIR", "FIR001", "ASSOCIATED_WITH")
    add_rel("REL_GT_P004_V004", "Person", "P004", "Vehicle", "V004", "OWNS_VEHICLE")

    add_rel("REL_GT_P005_PH005", "Person", "P005", "Phone", "PH005", "USED_IDENTIFIER", timestamp="2026-01-10T11:00:00")
    add_rel("REL_GT_P005_PH015", "Person", "P005", "Phone", "PH015", "TRANSITIONED_TO_IDENTIFIER", timestamp="2026-01-12T15:30:00")

    return rel_records

def seed_supabase_postgresql():
    logger.info("=== Starting Supabase PostgreSQL Seeding ===")
    pg_status = check_postgres_connection()
    if pg_status.get("status") != "online":
        logger.warning(f"Supabase PostgreSQL is offline or unreachable: {pg_status.get('error')}")
        logger.warning("Skipping Supabase PostgreSQL seeding. (Local synthetic datasets remain intact).")
        return False

    try:
        # Create tables if not exist
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

        # Load datasets
        persons_data = load_json("persons.json") or []
        phones_data = load_json("phones.json") or []
        sims_data = load_json("sims.json") or []
        devices_data = load_json("devices.json") or []
        vehicles_data = load_json("vehicles.json") or []
        accounts_data = load_json("accounts.json") or []
        locations_data = load_json("locations.json") or []
        firs_data = load_json("firs.json") or []
        crimes_data = load_json("crimes.json") or []
        events_data = load_json("events.json") or []
        cdr_data = load_json("cdr.json") or []
        tx_data = load_json("transactions.json") or []
        sightings_data = load_json("sightings.json") or []
        reports_data = load_json("reports.json") or []

        # Populate Entities Table Registry
        entity_records = []
        for p in persons_data:
            entity_records.append({"id": p["id"], "entity_type": "Person", "primary_identifier": p["name"], "metadata_json": p})
        for ph in phones_data:
            entity_records.append({"id": ph["id"], "entity_type": "Phone", "primary_identifier": ph["msisdn"], "metadata_json": ph})
        for s in sims_data:
            entity_records.append({"id": s["id"], "entity_type": "SIM", "primary_identifier": s["iccid"], "metadata_json": s})
        for d in devices_data:
            entity_records.append({"id": d["id"], "entity_type": "Device", "primary_identifier": d["imei"], "metadata_json": d})
        for v in vehicles_data:
            entity_records.append({"id": v["id"], "entity_type": "Vehicle", "primary_identifier": v["registration_number"], "metadata_json": v})
        for a in accounts_data:
            entity_records.append({"id": a["id"], "entity_type": "BankAccount", "primary_identifier": a["account_number"], "metadata_json": a})
        for loc in locations_data:
            entity_records.append({"id": loc["id"], "entity_type": "Location", "primary_identifier": loc["name"], "metadata_json": loc})
        for fir in firs_data:
            entity_records.append({"id": fir["id"], "entity_type": "FIR", "primary_identifier": fir["fir_number"], "metadata_json": fir})
        for crm in crimes_data:
            entity_records.append({"id": crm["id"], "entity_type": "Crime", "primary_identifier": crm["crime_code"], "metadata_json": crm})
        for evt in events_data:
            entity_records.append({"id": evt["id"], "entity_type": "Event", "primary_identifier": evt["title"], "metadata_json": evt})

        bulk_seed_table(db, database_models.Entity, entity_records)
        bulk_seed_table(db, database_models.Person, persons_data)
        bulk_seed_table(db, database_models.Phone, phones_data)
        bulk_seed_table(db, database_models.SIM, sims_data)
        bulk_seed_table(db, database_models.Device, devices_data)
        bulk_seed_table(db, database_models.Vehicle, vehicles_data)
        bulk_seed_table(db, database_models.BankAccount, accounts_data)
        bulk_seed_table(db, database_models.Organization, load_json("organizations.json") or [])
        bulk_seed_table(db, database_models.Location, locations_data)
        bulk_seed_table(db, database_models.FIR, firs_data)
        bulk_seed_table(db, database_models.Crime, crimes_data)
        bulk_seed_table(db, database_models.Event, events_data)
        bulk_seed_table(db, database_models.CDRRecord, cdr_data)
        bulk_seed_table(db, database_models.FinancialTransaction, tx_data)
        bulk_seed_table(db, database_models.VehicleSighting, sightings_data)
        bulk_seed_table(db, database_models.IntelligenceReport, reports_data)

        # Seed PostgreSQL Graph Layer Relationships
        relationship_records = extract_entity_relationships()
        bulk_seed_table(db, database_models.EntityRelationship, relationship_records)

        db.close()
        logger.info(f"Supabase PostgreSQL seeding successfully completed! ({len(relationship_records)} graph relationships seeded)")
        return True

    except Exception as e:
        logger.error(f"Error during Supabase PostgreSQL seeding: {e}")
        return False

def main():
    logger.info("Starting NEXUS Database Seeding Pipeline...")
    seed_supabase_postgresql()
    logger.info("NEXUS Seeding Pipeline Completed.")

if __name__ == "__main__":
    main()
