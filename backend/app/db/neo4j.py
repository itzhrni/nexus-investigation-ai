import logging
from neo4j import GraphDatabase, Driver
from app.config import settings

logger = logging.getLogger("nexus.db.neo4j")

class Neo4jService:
    def __init__(self):
        self._driver: Driver | None = None

    def connect(self):
        """Initialize Neo4j connection driver."""
        try:
            self._driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            logger.info("Neo4j driver initialized.")
        except Exception as e:
            logger.warning(f"Failed to create Neo4j driver: {e}")
            self._driver = None

    def close(self):
        """Close Neo4j driver connection."""
        if self._driver:
            self._driver.close()
            logger.info("Neo4j connection closed.")

    def check_connection(self) -> dict:
        """Check connectivity to Neo4j database."""
        if not self._driver:
            return {"status": "offline", "error": "Driver not initialized"}
        try:
            self._driver.verify_connectivity()
            return {"status": "online", "message": "Neo4j connected successfully"}
        except Exception as e:
            logger.warning(f"Neo4j connection test failed: {e}")
            return {"status": "offline", "error": str(e)}

    def execute_query(self, query: str, parameters: dict = None):
        """Execute Cypher query and return records."""
        if not self._driver:
            raise RuntimeError("Neo4j driver is not connected.")
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]

neo4j_client = Neo4jService()
