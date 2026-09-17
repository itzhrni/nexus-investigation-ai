import pytest
from app.db.postgres import SessionLocal
from app.services.aadhaar_service import aadhaar_service
from app.services.search_service import search_service

def test_verhoeff_checksum_validation():
    # 1. Known valid Aadhaar format numbers
    # Generate valid 12th digit for 11 digits
    base11 = "54890011001"
    chk = aadhaar_service.generate_checksum_digit(base11)
    valid_aadhaar = f"{base11}{chk}"
    assert aadhaar_service.validate_verhoeff(valid_aadhaar) is True

    # 2. Fabricated / Tampered number (single digit alteration)
    tampered_digit = (chk + 1) % 10
    tampered_aadhaar = f"{base11}{tampered_digit}"
    assert aadhaar_service.validate_verhoeff(tampered_aadhaar) is False

    # 3. Transposition error (adjacent digits swapped - key Verhoeff strength)
    transposed = list(valid_aadhaar)
    transposed[3], transposed[4] = transposed[4], transposed[3]
    assert aadhaar_service.validate_verhoeff("".join(transposed)) is False

def test_aadhaar_masking_and_hashing():
    raw = "5489 1234 9015"
    masked = aadhaar_service.mask_aadhaar(raw)
    assert masked == "XXXX-XXXX-9015"

    h1 = aadhaar_service.hash_aadhaar("548912349015")
    h2 = aadhaar_service.hash_aadhaar("5489 1234 9015")
    assert h1 == h2
    assert len(h1) == 64

def test_aadhaar_collision_detection():
    db = SessionLocal()
    try:
        # P005 and P015 share the same synthetic Aadhaar (stolen identity test fixture)
        res_p005 = aadhaar_service.analyze_person_aadhaar(db, "P005")
        assert res_p005["has_aadhaar"] is True
        assert res_p005["collision_detected"] is True
        assert "P015" in res_p005["colliding_person_ids"]
        assert "CRITICAL AADHAAR COLLISION" in res_p005["collision_details"]

        # P001 has unique valid Aadhaar
        res_p001 = aadhaar_service.analyze_person_aadhaar(db, "P001")
        assert res_p001["has_aadhaar"] is True
        assert res_p001["collision_detected"] is False
    finally:
        db.close()

def test_aadhaar_search():
    db = SessionLocal()
    try:
        # Search by masked format
        search_res = search_service.search(db, "XXXX-XXXX-9015")
        matched_ids = [r.entity_id for r in search_res.results]
        assert "P005" in matched_ids
        assert "P015" in matched_ids
    finally:
        db.close()
