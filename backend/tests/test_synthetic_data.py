import json
import csv
from pathlib import Path
import pytest

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "synthetic"

EXPECTED_FILES = [
    "persons.json", "phones.json", "sims.json", "devices.json",
    "vehicles.json", "accounts.json", "locations.json", "organizations.json",
    "firs.json", "crimes.json", "events.json", "cdr.json",
    "transactions.json", "sightings.json", "reports.json", "ground_truth.json",
    "sample_fir_ingestion.csv"
]

def load_dataset(filename: str):
    filepath = DATA_DIR / filename
    assert filepath.exists(), f"File {filename} does not exist in {DATA_DIR}"
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def test_synthetic_files_exist():
    for filename in EXPECTED_FILES:
        filepath = DATA_DIR / filename
        assert filepath.exists(), f"Missing synthetic file: {filename}"

def test_dataset_counts_and_structure():
    persons = load_dataset("persons.json")
    phones = load_dataset("phones.json")
    sims = load_dataset("sims.json")
    devices = load_dataset("devices.json")
    vehicles = load_dataset("vehicles.json")
    accounts = load_dataset("accounts.json")
    locations = load_dataset("locations.json")
    firs = load_dataset("firs.json")
    cdr = load_dataset("cdr.json")
    transactions = load_dataset("transactions.json")
    sightings = load_dataset("sightings.json")
    reports = load_dataset("reports.json")

    assert len(persons) >= 30, f"Expected >= 30 persons, got {len(persons)}"
    assert len(phones) >= 40, f"Expected >= 40 phones, got {len(phones)}"
    assert len(sims) >= 30, f"Expected >= 30 SIMs, got {len(sims)}"
    assert len(devices) >= 30, f"Expected >= 30 devices, got {len(devices)}"
    assert len(vehicles) >= 15, f"Expected >= 15 vehicles, got {len(vehicles)}"
    assert len(accounts) >= 30, f"Expected >= 30 accounts, got {len(accounts)}"
    assert len(locations) >= 20, f"Expected >= 20 locations, got {len(locations)}"
    assert len(firs) >= 15, f"Expected >= 15 FIRs, got {len(firs)}"
    assert len(cdr) >= 200, f"Expected >= 200 CDRs, got {len(cdr)}"
    assert len(transactions) >= 150, f"Expected >= 150 transactions, got {len(transactions)}"
    assert len(sightings) >= 50, f"Expected >= 50 sightings, got {len(sightings)}"
    assert len(reports) >= 20, f"Expected >= 20 reports, got {len(reports)}"

def test_bharat_aware_person_enrichment():
    persons = load_dataset("persons.json")
    for p in persons:
        assert "canonical_name" in p
        assert "name_variants" in p
        assert "language" in p
        assert "state" in p
        assert "district" in p
        assert "phonetic_key" in p
        assert isinstance(p["name_variants"], list)

def test_jurisdiction_metadata_enrichment():
    locations = load_dataset("locations.json")
    firs = load_dataset("firs.json")
    
    for loc in locations:
        assert "state" in loc
        assert "district" in loc
        assert "police_station" in loc
        assert "jurisdiction_id" in loc

    for fir in firs:
        assert "police_station" in fir
        assert "district" in fir
        assert "state" in fir
        assert "jurisdiction_id" in fir

def test_referential_integrity():
    persons = {p["id"] for p in load_dataset("persons.json")}
    phones = {ph["id"] for ph in load_dataset("phones.json")}
    sims = load_dataset("sims.json")
    vehicles = load_dataset("vehicles.json")
    accounts = load_dataset("accounts.json")
    cdr = load_dataset("cdr.json")

    for s in sims:
        if s.get("registered_to_person_id"):
            assert s["registered_to_person_id"] in persons, f"Invalid person ID {s['registered_to_person_id']} in SIM {s['id']}"

    for v in vehicles:
        if v.get("owner_person_id"):
            assert v["owner_person_id"] in persons, f"Invalid person ID {v['owner_person_id']} in vehicle {v['id']}"

    for a in accounts:
        if a.get("holder_person_id"):
            assert a["holder_person_id"] in persons, f"Invalid person ID {a['holder_person_id']} in account {a['id']}"

    for c in cdr:
        assert c["caller_phone_id"] in phones, f"Invalid caller phone {c['caller_phone_id']} in CDR {c['id']}"
        assert c["receiver_phone_id"] in phones, f"Invalid receiver phone {c['receiver_phone_id']} in CDR {c['id']}"

def test_ground_truth_structure_and_patterns():
    gt = load_dataset("ground_truth.json")
    assert "hidden_patterns" in gt
    assert len(gt["hidden_patterns"]) >= 6, f"Expected at least 6 planted hidden patterns, got {len(gt['hidden_patterns'])}"
    
    pattern_types = {p["pattern_type"] for p in gt["hidden_patterns"]}
    assert "SIM_DEVICE_SWITCH" in pattern_types
    assert "CIRCULAR_TRANSACTIONS" in pattern_types
    assert "SPATIAL_TEMPORAL_CONVERGENCE" in pattern_types
    assert "CROSS_JURISDICTION_ACTIVITY" in pattern_types
    assert "IDENTIFIER_TRANSITION" in pattern_types
    assert "TEMPORAL_BEFORE_AFTER_CHANGE" in pattern_types

def test_canonical_fir_csv_structure():
    csv_path = DATA_DIR / "sample_fir_ingestion.csv"
    assert csv_path.exists()
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        expected_cols = ["record_id", "date", "time", "person_name", "phone", "vehicle", "location", "district", "state", "police_station", "description"]
        assert header == expected_cols
