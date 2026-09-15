import pytest
import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy.pool import StaticPool
from app.main import app
from app.db.postgres import Base, get_db
from app.models import database_models
from app.services.entity_extraction import entity_extraction_service
from app.services.relationship_extraction import relationship_extraction_service
from app.services.csv_ingestion_service import csv_ingestion_service
from app.services.vision_service import vision_service
from app.services.auth_service import auth_service
from scripts.seed_database import extract_entity_relationships, bulk_seed_table, load_json


SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    database_models.Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    database_models.Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    db = TestingSessionLocal()

    persons = load_json("persons.json") or []
    phones = load_json("phones.json") or []
    vehicles = load_json("vehicles.json") or []
    locations = load_json("locations.json") or []

    bulk_seed_table(db, database_models.Person, persons)
    bulk_seed_table(db, database_models.Phone, phones)
    bulk_seed_table(db, database_models.Vehicle, vehicles)
    bulk_seed_table(db, database_models.Location, locations)

    rels = extract_entity_relationships()
    bulk_seed_table(db, database_models.EntityRelationship, rels)
    db.commit()

    yield db

    db.close()
    database_models.Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()

client = TestClient(app)


# ==================== NLP INGESTION TESTS ====================
def test_nlp_entity_normalization():
    norm_ph = entity_extraction_service.normalize_phone("9810012345")
    assert norm_ph == "+919810012345"
    
    norm_v = entity_extraction_service.normalize_vehicle_reg("DL 01 CA 1234")
    assert norm_v == "DL01CA1234"

def test_fir_text_extraction(setup_test_db):
    sample_text = "Police report detailing subject Aarav Sharma using phone +919810012345 and vehicle DL01CA1234 in Connaught Place, New Delhi under FIR001."
    res = entity_extraction_service.extract_entities_from_text(setup_test_db, sample_text)
    assert res["total_extracted"] >= 3
    etypes = [e["entity_type"] for e in res["entities"]]
    assert "Person" in etypes or "Phone" in etypes or "Vehicle" in etypes

def test_relationship_extraction(setup_test_db):
    sample_text = "Subject P001 using phone PH001 and vehicle V001."
    entities = entity_extraction_service.extract_entities_from_text(setup_test_db, sample_text)["entities"]
    rels = relationship_extraction_service.extract_relationships_from_entities(setup_test_db, sample_text, entities)
    assert len(rels) >= 1

# ==================== CSV INGESTION TESTS ====================
def test_csv_ingestion_valid(setup_test_db):
    csv_data = "record_id,date,time,person_name,phone,vehicle,location,district,state,police_station,description\nREC_TEST_01,2026-01-10,14:30:00,Rohan Mehta,+919899887766,MH01AB9999,FC Road Pune,Pune,Maharashtra,Deccan Gymkhana PS,Test incident\n"
    stats = csv_ingestion_service.ingest_csv(setup_test_db, csv_data)
    assert stats["records_processed"] == 1
    assert stats["entities_created"] >= 1
    assert stats["relationships_created"] >= 1

def test_csv_ingestion_malformed(setup_test_db):
    stats = csv_ingestion_service.ingest_csv(setup_test_db, "")
    assert stats["records_processed"] == 0
    assert len(stats["warnings"]) >= 1

# ==================== SURVEILLANCE OCR TESTS ====================
def test_vision_ocr_vehicle_lookup(setup_test_db):
    # Dummy image bytes containing text DL01CA1234
    dummy_bytes = b"IMAGE_DATA_WITH_TEXT_DL01CA1234"
    res = vision_service.analyze_surveillance_image(setup_test_db, image_bytes=dummy_bytes)
    assert res["detected_plate"] == "DL01CA1234"
    assert res["confidence"] > 0.0

def test_vision_invalid_image(setup_test_db):
    res = vision_service.analyze_surveillance_image(setup_test_db, image_bytes=b"NO_PLATE_HERE")
    assert res["detected_plate"] is None
    assert len(res["warnings"]) >= 1

# ==================== API & GRAPH INTEGRATION TESTS ====================
def test_fir_ingest_api():
    token = auth_service.create_access_token({"sub": "USR-TEST", "email": "test@nexus.gov.in", "role": "INVESTIGATOR", "unit": "Central PS"})
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "text_content": "Reported case involving Aarav Sharma using phone +919810012345 in Connaught Place PS under FIR001.",
        "report_title": "Test FIR Ingest"
    }
    response = client.post("/api/ingest/fir", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["extracted_entities"]) >= 1
    assert len(data["extracted_relationships"]) >= 1

def test_csv_ingest_api():
    token = auth_service.create_access_token({"sub": "USR-TEST", "email": "test@nexus.gov.in", "role": "INVESTIGATOR", "unit": "Central PS"})
    headers = {"Authorization": f"Bearer {token}"}

    csv_content = b"record_id,date,time,person_name,phone,vehicle,location,district,state,police_station,description\nREC_API_01,2026-01-12,10:00:00,Karan Gupta,+919876543210,DL02CB8888,Connaught Place,New Delhi,Delhi,Connaught Place PS,API test\n"
    files = {"file": ("test.csv", csv_content, "text/csv")}
    response = client.post("/api/ingest/csv", files=files, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["records_processed"] == 1

def test_vision_analyze_api():
    token = auth_service.create_access_token({"sub": "USR-TEST", "email": "test@nexus.gov.in", "role": "INVESTIGATOR", "unit": "Central PS"})
    headers = {"Authorization": f"Bearer {token}"}

    files = {"file": ("cctv.jpg", b"CCTV_FRAME_DL01CA1234", "image/jpeg")}
    response = client.post("/api/vision/analyze", files=files, data={"location_id": "LOC005"}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["detected_plate"] == "DL01CA1234"




