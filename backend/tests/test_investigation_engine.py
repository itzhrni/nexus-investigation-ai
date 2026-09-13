import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.postgres import Base
from app.models import database_models
from app.services.search_service import search_service
from app.services.entity_resolution import entity_resolution_service
from app.services.graph_service import graph_service
from app.services.continuity_service import continuity_service
from app.services.jurisdiction_service import jurisdiction_service
from app.services.timeline_service import timeline_service
from app.services.anomaly_service import anomaly_service
from app.services.evidence_service import evidence_service
from app.services.summary_service import summary_service
from scripts.seed_database import extract_entity_relationships, bulk_seed_table, load_json

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="module")
def db_session():
    engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    
    # Load synthetic datasets into in-memory DB
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
    
    bulk_seed_table(db, database_models.Person, persons)
    bulk_seed_table(db, database_models.Phone, phones)
    bulk_seed_table(db, database_models.SIM, sims)
    bulk_seed_table(db, database_models.Device, devices)
    bulk_seed_table(db, database_models.Vehicle, vehicles)
    bulk_seed_table(db, database_models.BankAccount, accounts)
    bulk_seed_table(db, database_models.Location, locations)
    bulk_seed_table(db, database_models.FIR, firs)
    bulk_seed_table(db, database_models.Crime, crimes)
    bulk_seed_table(db, database_models.Event, events)
    bulk_seed_table(db, database_models.CDRRecord, cdr_data)
    bulk_seed_table(db, database_models.FinancialTransaction, tx_data)
    bulk_seed_table(db, database_models.VehicleSighting, sightings_data)
    
    rels = extract_entity_relationships()
    bulk_seed_table(db, database_models.EntityRelationship, rels)
    
    yield db
    
    db.close()
    Base.metadata.drop_all(bind=engine)

# ==================== SEARCH TESTS ====================
def test_search_exact_entity(db_session):
    res = search_service.search(db_session, query_str="SIM001")
    assert res.total_matches >= 1
    assert res.results[0].entity_id == "SIM001"
    assert res.results[0].match_type == "exact"

def test_search_person_name(db_session):
    res = search_service.search(db_session, query_str="Aarav Sharma")
    assert res.total_matches >= 1
    assert any(r.entity_type == "Person" for r in res.results)

def test_search_alias(db_session):
    res = search_service.search(db_session, query_str="Alias_Aarav")
    assert res.total_matches >= 1
    assert any(r.match_type == "alias" for r in res.results)

def test_search_unknown_identifier(db_session):
    res = search_service.search(db_session, query_str="UNKNOWN_NONEXISTENT_XYZ")
    assert res.total_matches == 0
    assert len(res.results) == 0

# ==================== ENTITY RESOLUTION TESTS ====================
def test_entity_resolution(db_session):
    res = entity_resolution_service.resolve_candidates(db_session, query_entity_id="P001")
    assert res.query_entity_id == "P001"
    assert isinstance(res.candidates, list)
    for c in res.candidates:
        assert c.confidence > 0.0
        assert len(c.signals) > 0

# ==================== PATTERN DETECTIONS ====================
def test_pattern_1_sim_switch(db_session):
    res = anomaly_service.detect_patterns(db_session, focal_entity_id="SIM001")
    p_types = [p.pattern_type for p in res.patterns]
    assert "SIM_DEVICE_SWITCH" in p_types

def test_pattern_2_financial_loop(db_session):
    res = anomaly_service.detect_patterns(db_session, focal_entity_id="ACC001")
    p_types = [p.pattern_type for p in res.patterns]
    assert "CIRCULAR_TRANSACTIONS" in p_types

def test_pattern_3_location_convergence(db_session):
    res = anomaly_service.detect_patterns(db_session, focal_entity_id="LOC005")
    p_types = [p.pattern_type for p in res.patterns]
    assert "SPATIAL_TEMPORAL_CONVERGENCE" in p_types

def test_pattern_4_cross_jurisdiction(db_session):
    res = jurisdiction_service.detect_cross_jurisdiction(db_session, entity_id="P004")
    assert "Delhi" in res.associated_states
    assert "Maharashtra" in res.associated_states
    assert len(res.insights) >= 1

def test_pattern_5_identity_continuity(db_session):
    res = continuity_service.detect_transitions(db_session, entity_id="P005")
    assert len(res.transitions) >= 1
    assert res.transitions[0].transition.from_identifier == "PH005"
    assert res.transitions[0].transition.to_identifier == "PH015"

def test_pattern_6_temporal_change(db_session):
    res = timeline_service.compare_before_after(db_session, focal_entity_id="P010", reference_timestamp="2026-01-15T12:00:00")
    assert res.before_window.total_calls == 2
    assert res.after_window.total_calls == 25
    assert len(res.detected_changes) >= 3

# ==================== EVIDENCE & SUMMARY TESTS ====================
def test_explainable_evidence(db_session):
    res = evidence_service.get_explainable_evidence(db_session, focal_entity_id="ACC001")
    assert res.findings_count >= 1
    item = res.findings[0]
    assert item.what != ""
    assert item.why != ""
    assert item.confidence > 0.0
    assert len(item.supporting_records) >= 1

def test_investigation_summary(db_session):
    res = summary_service.get_investigation_summary(db_session, entity_type="Person", identifier="P001")
    assert res.focal_entity_id == "P001"
    assert res.graph_metrics.total_nodes >= 1
    assert isinstance(res.detected_patterns, list)
    assert isinstance(res.explainable_evidence, list)
