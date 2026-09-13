import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("nexus.db.postgres")

Base = declarative_base()

try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=settings.DEBUG
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.warning(f"Failed to initialize PostgreSQL engine: {e}")
    engine = None
    SessionLocal = None

def get_db():
    """Dependency for obtaining database sessions."""
    if SessionLocal is None:
        raise RuntimeError("PostgreSQL engine is not initialized.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_postgres_connection() -> dict:
    """Check connectivity to PostgreSQL database."""
    if not engine:
        return {"status": "offline", "error": "Engine not configured"}
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "online", "message": "PostgreSQL connected successfully"}
    except Exception as e:
        logger.warning(f"PostgreSQL connection test failed: {e}")
        return {"status": "offline", "error": str(e)}
