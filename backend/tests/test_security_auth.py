import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.postgres import Base, get_db
from app.models import database_models

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

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    database_models.Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    db = TestingSessionLocal()
    yield db
    db.close()
    database_models.Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


# Helper function to obtain access token
def get_auth_token(email: str = "investigator@nexus.gov.in", password: str = "demo1234") -> str:
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed for {email}: {res.json()}"
    return res.json()["access_token"]


def test_login_success():
    response = client.post("/api/auth/login", json={
        "email": "investigator@nexus.gov.in",
        "password": "demo1234"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "investigator@nexus.gov.in"
    assert data["user"]["role"] == "INVESTIGATOR"


def test_login_invalid_password():
    response = client.post("/api/auth/login", json={
        "email": "investigator@nexus.gov.in",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_missing_or_short_password():
    # Missing password -> 422 Unprocessable Entity
    missing_pwd_res = client.post("/api/auth/login", json={"email": "investigator@nexus.gov.in"})
    assert missing_pwd_res.status_code == 422

    # Short/invalid password -> 401 Unauthorized
    short_pwd_res = client.post("/api/auth/login", json={"email": "investigator@nexus.gov.in", "password": "123"})
    assert short_pwd_res.status_code == 401


def test_role_escalation_prevention():
    # Attempt client role injection in login body
    response = client.post("/api/auth/login", json={
        "email": "user@nexus.gov.in",
        "password": "demo1234",
        "role": "ADMIN"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "INVESTIGATOR"


def test_admin_login_role_resolution():
    response = client.post("/api/auth/login", json={
        "email": "admin@nexus.gov.in",
        "password": "demo1234"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "ADMIN"


def test_rbac_admin_endpoint_forbidden():
    inv_token = get_auth_token("investigator@nexus.gov.in", "demo1234")
    response = client.get("/api/admin/audit-logs", headers={"Authorization": f"Bearer {inv_token}"})
    assert response.status_code == 403
    assert "Required role: ADMIN" in response.json()["detail"]


def test_rbac_admin_endpoint_allowed():
    admin_token = get_auth_token("admin@nexus.gov.in", "demo1234")
    response = client.get("/api/admin/audit-logs", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    logs = response.json()
    assert isinstance(logs, list)


def test_auth_invalid_token():
    unauth_res = client.get("/api/auth/me")
    assert unauth_res.status_code == 401

    invalid_res = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid_forged_token"})
    assert invalid_res.status_code == 401


def test_entities_protection_unauthenticated():
    response = client.get("/api/entities")
    assert response.status_code == 401


def test_entities_protection_authenticated():
    inv_token = get_auth_token("investigator@nexus.gov.in", "demo1234")
    response = client.get("/api/entities", headers={"Authorization": f"Bearer {inv_token}"})
    assert response.status_code == 200
    res_data = response.json()
    assert isinstance(res_data, dict)
    assert res_data.get("status") == "ok"


def test_audit_log_failed_login():
    bad_email = "audit_test_user@nexus.gov.in"
    # Trigger failed login
    client.post("/api/auth/login", json={"email": bad_email, "password": "wrong_password_xyz"})
    
    # Check audit log as admin
    admin_token = get_auth_token("admin@nexus.gov.in", "demo1234")
    log_res = client.get("/api/admin/audit-logs", headers={"Authorization": f"Bearer {admin_token}"})
    assert log_res.status_code == 200
    logs = log_res.json()
    failed_log = next((l for l in logs if l.get("action") == "AUTH_LOGIN_FAILED" and l.get("user_email") == bad_email), None)
    assert failed_log is not None


def test_ingestion_payload_size_limits():
    token = get_auth_token("investigator@nexus.gov.in", "demo1234")
    headers = {"Authorization": f"Bearer {token}"}

    # Test FIR payload > 1MB
    large_fir_text = "A" * (1 * 1024 * 1024 + 100)
    fir_res = client.post("/api/ingest/fir", json={"text_content": large_fir_text}, headers=headers)
    assert fir_res.status_code == 413

    # Test CSV MIME check
    files = {"file": ("test.txt", b"column1,column2\nval1,val2", "text/plain")}
    csv_mime_res = client.post("/api/ingest/csv", files=files, headers=headers)
    assert csv_mime_res.status_code == 400

    # Test Vision MIME check
    vision_files = {"file": ("script.sh", b"#!/bin/bash\necho hello", "application/x-sh")}
    vision_res = client.post("/api/vision/analyze", files=vision_files, headers=headers)
    assert vision_res.status_code == 415


def test_security_response_headers():
    response = client.get("/health")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert "strict-origin-when-cross-origin" in response.headers.get("Referrer-Policy", "")
