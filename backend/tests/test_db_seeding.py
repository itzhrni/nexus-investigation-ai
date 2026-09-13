from pathlib import Path
from unittest.mock import patch

BASE_DIR = Path(__file__).resolve().parent.parent

def test_supabase_schema_sql_exists():
    sql_path = BASE_DIR / "scripts" / "supabase_schema.sql"
    assert sql_path.exists(), "Supabase DDL schema SQL file must exist"
    content = sql_path.read_text(encoding="utf-8")
    assert "CREATE TABLE IF NOT EXISTS entities" in content
    assert "CREATE TABLE IF NOT EXISTS persons" in content
    assert "CREATE TABLE IF NOT EXISTS cdr_records" in content
    assert "CREATE TABLE IF NOT EXISTS entity_relationships" in content

def test_seeding_graceful_offline_handling():
    # Verify that when PostgreSQL returns offline, seeding functions handle it gracefully
    with patch("scripts.seed_database.check_postgres_connection", return_value={"status": "offline", "error": "mock_offline"}):
        from scripts.seed_database import seed_supabase_postgresql
        pg_res = seed_supabase_postgresql()
        assert pg_res is False
