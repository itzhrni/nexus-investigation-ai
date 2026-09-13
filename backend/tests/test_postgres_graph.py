import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.postgres import Base
from app.models import database_models
from app.services.graph_service import PostgresGraphService, graph_service
from scripts.seed_database import extract_entity_relationships, bulk_seed_table

# In-memory SQLite DB for graph tests
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="module")
def test_db():
    engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    
    # Seed Entity Relationships in-memory
    rels = extract_entity_relationships()
    bulk_seed_table(db, database_models.EntityRelationship, rels)
    
    yield db
    
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_relationship_insertion(test_db):
    count = test_db.query(database_models.EntityRelationship).count()
    assert count >= 100, f"Expected >= 100 entity relationships inserted, got {count}"

def test_1_hop_traversal(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P001", depth=1)
    assert res.focal_entity_id == "P001"
    assert res.depth == 1
    assert len(res.nodes) > 1
    assert len(res.relationships) >= 1

def test_2_hop_traversal(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P001", depth=2)
    assert res.depth == 2
    assert len(res.nodes) >= len(graph_service.get_focal_graph(test_db, identifier="P001", depth=1).nodes)
    assert len(res.relationships) >= 1

def test_multi_hop_traversal(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P001", depth=3)
    assert res.depth == 3
    assert len(res.nodes) >= 1
    assert len(res.relationships) >= 1

def test_cycle_protection(test_db):
    # ACC001 -> ACC005 -> ACC012 -> ACC001 forms a financial transaction loop cycle
    res = graph_service.get_focal_graph(test_db, identifier="ACC001", depth=3, relationship_type="TRANSFERRED_MONEY")
    acc_nodes = [n.id for n in res.nodes]
    assert "ACC001" in acc_nodes
    assert "ACC005" in acc_nodes
    assert "ACC012" in acc_nodes
    # Verify graph traversal completes cleanly with finite deduplicated relationships
    assert len(res.relationships) >= 3
    assert len(res.relationships) == len(set(r.id for r in res.relationships))


def test_relationship_filtering(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P001", depth=2, relationship_type="OWNS_SIM")
    for rel in res.relationships:
        assert rel.type == "OWNS_SIM"

def test_timestamp_preservation(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P001", depth=2)
    timestamps = [r.timestamp for r in res.relationships if r.timestamp]
    assert len(timestamps) > 0, "Graph relationships must preserve event timestamps"

def test_ground_truth_pattern_1_sim_switch(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="SIM001", depth=2)
    devices = [r.target for r in res.relationships if r.source == "SIM001" and r.type == "USED_IN_DEVICE"]
    assert "DEV001" in devices
    assert "DEV002" in devices

def test_ground_truth_pattern_2_financial_loop(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="ACC001", depth=3, relationship_type="TRANSFERRED_MONEY")
    targets = {r.target for r in res.relationships}
    assert "ACC005" in targets

def test_ground_truth_pattern_3_location_convergence(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="LOC005", depth=2, relationship_type="SEEN_AT")
    vehicles = {r.source for r in res.relationships}
    assert "V002" in vehicles
    assert "V003" in vehicles

def test_ground_truth_pattern_4_cross_jurisdiction(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P004", depth=2)
    targets = {r.target for r in res.relationships}
    assert "FIR001" in targets or "V004" in targets

def test_ground_truth_pattern_5_identity_continuity(test_db):
    res = graph_service.get_focal_graph(test_db, identifier="P005", depth=2)
    targets = {r.target for r in res.relationships}
    assert "PH005" in targets or "PH015" in targets

def test_ground_truth_pattern_6_temporal_change(test_db):
    # Query P010 before and after EVT010 timestamp (2026-01-15T12:00:00)
    res_before = graph_service.get_focal_graph(test_db, identifier="P010", depth=2, end_time="2026-01-15T11:59:59")
    res_after = graph_service.get_focal_graph(test_db, identifier="P010", depth=2, start_time="2026-01-15T12:00:00")
    
    assert len(res_after.relationships) > len(res_before.relationships), "AFTER relationships must reflect communication/transaction burst"
