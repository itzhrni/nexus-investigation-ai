from pathlib import Path
from scripts.seed_database import seed_supabase_postgresql, seed_neo4j_knowledge_graph

BASE_DIR = Path(__file__).resolve().parent.parent

def test_supabase_schema_sql_exists():
    sql_path = BASE_DIR / "scripts" / "supabase_schema.sql"
    assert sql_path.exists(), "Supabase DDL schema SQL file must exist"
    content = sql_path.read_text(encoding="utf-8")
    assert "CREATE TABLE IF NOT EXISTS entities" in content
    assert "CREATE TABLE IF NOT EXISTS persons" in content
    assert "CREATE TABLE IF NOT EXISTS cdr_records" in content

def test_seeding_graceful_offline_handling():
    # Should complete without throwing unhandled exception even if databases are offline
    pg_result = seed_supabase_postgresql()
    neo4j_result = seed_neo4j_knowledge_graph()
    
    assert isinstance(pg_result, bool)
    assert isinstance(neo4j_result, bool)
