# NEXUS — AI-Powered Criminal Network Analysis System Backend (SIH26189)

NEXUS Backend is an investigation-support system API pipeline built with **FastAPI** and **Supabase PostgreSQL**. It converts structured and unstructured crime and intelligence data into an interactive, evidence-backed knowledge graph for network analysis, entity resolution, identifier switching detection, spatial-temporal reasoning, and dynamic focal graph traversal.

---

## 🚀 Phase 3 API Endpoints & Capabilities

### 1. Investigation & Search API
* `GET /api/search?q={clue}`: Any-Clue Search across Persons, Phones, SIMs, Devices, Vehicles, Accounts, Locations, FIRs.
* `GET /api/investigation/{entity_type}/{identifier}`: Dynamic Focal Graph traversal (1–5 hops) with recursive SQL CTE and cycle protection.
* `GET /api/investigation/{entity_type}/{identifier}/summary`: High-level dashboard summary payload combining graph metrics, patterns, transitions, and evidence.
* `GET /api/investigation/{entity_type}/{identifier}/continuity`: SIM / Device / Phone identity transition detection.
* `GET /api/investigation/{entity_type}/{identifier}/jurisdictions`: Multi-state and cross-jurisdiction operational footprint analysis.
* `GET /api/investigation/{entity_type}/{identifier}/timeline`: Temporal baseline change comparison ("What Changed?") before and after an incident.
* `GET /api/investigation/{entity_type}/{identifier}/patterns`: Suspicious pattern detection (SIM switch, financial loops, location convergence, temporal escalation).

### 2. Analytics & Evidence API
* `GET /api/analysis/entity-resolution?query_entity_id={id}`: Bharat-aware entity resolution candidate matching.
* `GET /api/analysis/anomalies`: Global pattern and anomaly detection engine.
* `GET /api/analysis/evidence?focal_entity_id={id}`: 6-W Explainable Evidence generation (WHAT, WHO, WHEN, WHERE, WHY, CONFIDENCE) referencing database records.

---

## 🧪 Running Tests
```bash
pytest tests/ -v
```

---

## 📁 Repository Structure
```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── config.py                # Environment configuration
│   ├── api/                     # REST API route handlers
│   │   ├── routes_search.py     # Any-Clue Search endpoints
│   │   ├── routes_graph.py      # Dynamic focal graph & investigation endpoints
│   │   ├── routes_entities.py   # Entity management endpoints
│   │   ├── routes_ingestion.py  # FIR & dataset ingestion endpoints
│   │   ├── routes_analysis.py   # Entity resolution, anomaly & evidence endpoints
│   │   └── routes_vision.py     # Surveillance image OCR endpoints
│   ├── db/                      # Database connections
│   │   ├── postgres.py          # SQLAlchemy PostgreSQL session
│   │   └── neo4j.py             # Legacy stub (Neo4j replaced by PostgreSQL Graph Layer)
│   ├── models/                  # Pydantic & SQLAlchemy schemas
│   │   ├── database_models.py   # Relational DB & EntityRelationship models
│   │   └── schemas.py           # Pydantic request/response schemas
│   └── services/                # Investigation Engine Services
│       ├── search_service.py    # Any-Clue Search engine
│       ├── entity_resolution.py # Bharat-aware entity resolution
│       ├── graph_service.py     # PostgresGraphService with recursive SQL & metrics
│       ├── continuity_service.py# Identity continuity & SIM switch engine
│       ├── jurisdiction_service.py # Cross-jurisdiction detection
│       ├── timeline_service.py  # Temporal "What Changed?" baseline engine
│       ├── anomaly_service.py   # Suspicious pattern & financial loop engine
│       ├── evidence_service.py  # 6-W explainable evidence generator
│       └── summary_service.py   # Comprehensive investigation summary pipeline
├── data/
│   ├── synthetic/              # Raw synthetic records & ground truth
│   └── processed/              # Processed assets
├── scripts/
│   ├── generate_data.py        # Synthetic dataset generator
│   ├── seed_database.py        # Seed script for Postgres relational & graph layer
│   └── supabase_schema.sql     # Supabase DDL initialization schema
├── tests/                      # Automated test suite
│   ├── test_investigation_engine.py # Phase 3 investigation engine unit tests
│   ├── test_postgres_graph.py  # PostgreSQL graph layer unit tests
│   ├── test_synthetic_data.py  # Ground truth verification tests
│   └── test_health.py          # API health check tests
├── .env.example                # Template configuration
├── requirements.txt            # Python dependencies
└── README.md                   # Backend documentation
```
