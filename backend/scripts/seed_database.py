import json
import logging
import sys
from pathlib import Path

# Add backend directory to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db.postgres import check_postgres_connection, engine, SessionLocal, Base
from app.db.neo4j import neo4j_client
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

def seed_supabase_postgresql():
    logger.info("=== Starting Supabase PostgreSQL Seeding ===")
    pg_status = check_postgres_connection()
    if pg_status.get("status") != "online":
        logger.warning(f"Supabase PostgreSQL is offline or unreachable: {pg_status.get('error')}")
        logger.warning("Skipping Supabase PostgreSQL seeding. (Local synthetic datasets remain intact).")
        return False

    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

        # Seed Entities Registry
        persons_data = load_json("persons.json") or []
        phones_data = load_json("phones.json") or []
        sims_data = load_json("sims.json") or []
        devices_data = load_json("devices.json") or []
        vehicles_data = load_json("vehicles.json") or []
        accounts_data = load_json("accounts.json") or []
        locations_data = load_json("locations.json") or []

        # Populate Entities Table
        for p in persons_data:
            db.merge(database_models.Entity(id=p["id"], entity_type="Person", primary_identifier=p["name"], metadata_json=p))
            db.merge(database_models.Person(**p))
        for ph in phones_data:
            db.merge(database_models.Entity(id=ph["id"], entity_type="Phone", primary_identifier=ph["msisdn"], metadata_json=ph))
            db.merge(database_models.Phone(**ph))
        for s in sims_data:
            db.merge(database_models.Entity(id=s["id"], entity_type="SIM", primary_identifier=s["iccid"], metadata_json=s))
            db.merge(database_models.SIM(**s))
        for d in devices_data:
            db.merge(database_models.Entity(id=d["id"], entity_type="Device", primary_identifier=d["imei"], metadata_json=d))
            db.merge(database_models.Device(**d))
        for v in vehicles_data:
            db.merge(database_models.Entity(id=v["id"], entity_type="Vehicle", primary_identifier=v["registration_number"], metadata_json=v))
            db.merge(database_models.Vehicle(**v))
        for a in accounts_data:
            db.merge(database_models.Entity(id=a["id"], entity_type="BankAccount", primary_identifier=a["account_number"], metadata_json=a))
            db.merge(database_models.BankAccount(**a))
        for loc in locations_data:
            db.merge(database_models.Entity(id=loc["id"], entity_type="Location", primary_identifier=loc["name"], metadata_json=loc))
            db.merge(database_models.Location(**loc))

        # Seed CDRs
        cdr_data = load_json("cdr.json") or []
        for cdr in cdr_data:
            db.merge(database_models.CDRRecord(**cdr))

        # Seed Transactions
        tx_data = load_json("transactions.json") or []
        for tx in tx_data:
            db.merge(database_models.FinancialTransaction(**tx))

        # Seed Sightings
        sightings_data = load_json("sightings.json") or []
        for sgt in sightings_data:
            db.merge(database_models.VehicleSighting(**sgt))

        # Seed Reports
        reports_data = load_json("reports.json") or []
        for rep in reports_data:
            db.merge(database_models.IntelligenceReport(**rep))

        db.commit()
        db.close()
        logger.info("Supabase PostgreSQL seeding successfully completed!")
        return True

    except Exception as e:
        logger.error(f"Error during Supabase PostgreSQL seeding: {e}")
        return False

def seed_neo4j_knowledge_graph():
    logger.info("=== Starting Neo4j Knowledge Graph Seeding ===")
    neo4j_client.connect()
    n_status = neo4j_client.check_connection()
    if n_status.get("status") != "online":
        logger.warning(f"Neo4j database is offline or unreachable: {n_status.get('error')}")
        logger.warning("Skipping Neo4j seeding. (Local synthetic datasets remain intact).")
        return False

    try:
        neo4j_client.init_constraints()

        # Seed Person Nodes
        persons_data = load_json("persons.json") or []
        for p in persons_data:
            query = """
            MERGE (n:Person {id: $id})
            SET n.name = $name, n.gender = $gender, n.dob = $dob, n.nationality = $nationality, n.address = $address
            """
            neo4j_client.execute_query(query, p)

        # Seed Phone Nodes
        phones_data = load_json("phones.json") or []
        for ph in phones_data:
            query = """
            MERGE (n:Phone {id: $id})
            SET n.msisdn = $msisdn, n.carrier = $carrier, n.status = $status
            """
            neo4j_client.execute_query(query, ph)

        # Seed SIM Nodes
        sims_data = load_json("sims.json") or []
        for s in sims_data:
            query = """
            MERGE (n:SIM {id: $id})
            SET n.iccid = $iccid, n.imsi = $imsi, n.operator = $operator
            """
            neo4j_client.execute_query(query, s)
            if s.get("registered_to_person_id"):
                rel_query = """
                MATCH (p:Person {id: $pid}), (s:SIM {id: $simid})
                MERGE (p)-[r:OWNS]->(s)
                """
                neo4j_client.execute_query(rel_query, {"pid": s["registered_to_person_id"], "simid": s["id"]})

        # Seed Device Nodes
        devices_data = load_json("devices.json") or []
        for d in devices_data:
            query = """
            MERGE (n:Device {id: $id})
            SET n.imei = $imei, n.brand = $brand, n.model = $model, n.os = $os
            """
            neo4j_client.execute_query(query, d)

        # Seed Vehicle Nodes
        vehicles_data = load_json("vehicles.json") or []
        for v in vehicles_data:
            query = """
            MERGE (n:Vehicle {id: $id})
            SET n.registration_number = $registration_number, n.make = $make, n.model = $model, n.color = $color
            """
            neo4j_client.execute_query(query, v)
            if v.get("owner_person_id"):
                rel_query = """
                MATCH (p:Person {id: $pid}), (v:Vehicle {id: $vid})
                MERGE (p)-[r:OWNS]->(v)
                """
                neo4j_client.execute_query(rel_query, {"pid": v["owner_person_id"], "vid": v["id"]})

        # Seed BankAccount Nodes
        accounts_data = load_json("accounts.json") or []
        for a in accounts_data:
            query = """
            MERGE (n:BankAccount {id: $id})
            SET n.account_number = $account_number, n.bank_name = $bank_name, n.ifsc = $ifsc
            """
            neo4j_client.execute_query(query, a)
            if a.get("holder_person_id"):
                rel_query = """
                MATCH (p:Person {id: $pid}), (b:BankAccount {id: $accid})
                MERGE (p)-[r:OWNS]->(b)
                """
                neo4j_client.execute_query(rel_query, {"pid": a["holder_person_id"], "accid": a["id"]})

        # Seed Location Nodes
        locations_data = load_json("locations.json") or []
        for loc in locations_data:
            query = """
            MERGE (n:Location {id: $id})
            SET n.name = $name, n.location_type = $location_type, n.latitude = $latitude, n.longitude = $longitude
            """
            neo4j_client.execute_query(query, loc)

        # Seed CDR Relationships
        cdr_data = load_json("cdr.json") or []
        for cdr in cdr_data:
            rel_type = "CALLED" if cdr["call_type"] == "CALL" else "MESSAGED"
            query = f"""
            MATCH (p1:Phone {{id: $caller}}), (p2:Phone {{id: $receiver}})
            MERGE (p1)-[r:{rel_type} {{id: $id}}]->(p2)
            SET r.timestamp = $timestamp, r.duration_seconds = $duration_seconds
            """
            neo4j_client.execute_query(query, {
                "caller": cdr["caller_phone_id"],
                "receiver": cdr["receiver_phone_id"],
                "id": cdr["id"],
                "timestamp": cdr["timestamp"],
                "duration_seconds": cdr["duration_seconds"]
            })

        # Seed Financial Transaction Relationships
        tx_data = load_json("transactions.json") or []
        for tx in tx_data:
            query = """
            MATCH (a1:BankAccount {id: $sender}), (a2:BankAccount {id: $receiver})
            MERGE (a1)-[r:TRANSFERRED_MONEY {id: $id}]->(a2)
            SET r.amount = $amount, r.timestamp = $timestamp, r.transaction_type = $transaction_type
            """
            neo4j_client.execute_query(query, {
                "sender": tx["sender_account_id"],
                "receiver": tx["receiver_account_id"],
                "id": tx["id"],
                "amount": tx["amount"],
                "timestamp": tx["timestamp"],
                "transaction_type": tx["transaction_type"]
            })

        # Seed Sightings
        sightings_data = load_json("sightings.json") or []
        for sgt in sightings_data:
            query = """
            MATCH (v:Vehicle {id: $vehicle}), (l:Location {id: $location})
            MERGE (v)-[r:SEEN_AT {id: $id}]->(l)
            SET r.timestamp = $timestamp, r.confidence = $confidence
            """
            neo4j_client.execute_query(query, {
                "vehicle": sgt["vehicle_id"],
                "location": sgt["location_id"],
                "id": sgt["id"],
                "timestamp": sgt["sighting_timestamp"],
                "confidence": sgt["confidence"]
            })

        logger.info("Neo4j Knowledge Graph seeding successfully completed!")
        neo4j_client.close()
        return True

    except Exception as e:
        logger.error(f"Error during Neo4j seeding: {e}")
        neo4j_client.close()
        return False

def main():
    logger.info("Starting NEXUS Database Seeding Pipeline...")
    seed_supabase_postgresql()
    seed_neo4j_knowledge_graph()
    logger.info("NEXUS Seeding Pipeline Completed.")

if __name__ == "__main__":
    main()
