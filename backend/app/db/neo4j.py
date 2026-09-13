import logging

logger = logging.getLogger("nexus.db.neo4j")

class Neo4jLegacyStub:
    """
    Legacy Neo4j service stub for Phase 2.5 architecture migration.
    Neo4j is replaced by the PostgreSQL Graph Layer.
    This stub prevents runtime breakage if legacy modules reference Neo4j.
    """
    def __init__(self):
        self._driver = None

    def connect(self):
        logger.info("Neo4j is disabled (PostgreSQL Graph Layer active). Skipping Neo4j connection.")

    def close(self):
        pass

    def check_connection(self) -> dict:
        return {
            "status": "disabled",
            "message": "Neo4j replaced by PostgreSQL Graph Layer (Phase 2.5 Migration)"
        }

    def execute_query(self, query: str, parameters: dict = None):
        raise NotImplementedError("Neo4j engine is disabled. Use PostgresGraphService instead.")

    def init_constraints(self):
        return False

neo4j_client = Neo4jLegacyStub()
