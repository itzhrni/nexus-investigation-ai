import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.postgres import check_postgres_connection
from app.db.neo4j import neo4j_client
from app.models.schemas import HealthResponse
from app.api import (
    routes_search,
    routes_graph,
    routes_entities,
    routes_ingestion,
    routes_analysis,
    routes_vision
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("nexus.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing NEXUS Backend Application (PostgreSQL Graph Architecture)...")
    yield
    logger.info("NEXUS Backend Application Shutdown Complete.")

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Criminal Network Analysis System Backend (SIH26189 - PostgreSQL Graph Architecture)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(routes_search.router, prefix="/api")
app.include_router(routes_graph.router, prefix="/api")
app.include_router(routes_entities.router, prefix="/api")
app.include_router(routes_ingestion.router, prefix="/api")
app.include_router(routes_analysis.router, prefix="/api")
app.include_router(routes_vision.router, prefix="/api")

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "NEXUS AI Criminal Network Analysis Backend is running (PostgreSQL Graph Architecture)",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Health check endpoint to verify backend status and PostgreSQL graph connection."""
    postgres_status = check_postgres_connection()
    neo4j_status = neo4j_client.check_connection()

    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        environment=settings.APP_ENV,
        services={
            "postgresql": postgres_status,
            "graph_layer": {
                "status": "online" if postgres_status.get("status") == "online" else "offline",
                "engine": "postgresql_recursive_cte"
            },
            "neo4j": neo4j_status
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
