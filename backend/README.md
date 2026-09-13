# NEXUS — AI-Powered Criminal Network Analysis System Backend (SIH26189)

NEXUS Backend is an investigation-support system API pipeline built with **FastAPI**, **PostgreSQL**, and **Neo4j**. It converts structured and unstructured crime and intelligence data into an interactive, evidence-backed knowledge graph for network analysis, entity resolution, identifier switching detection, and spatial-temporal reasoning.

---

## 🚀 Quick Start (Phase 1)

### 1. Requirements & Prerequisites
* **Python**: 3.11+ (Tested on Python 3.14)
* **PostgreSQL**: (Optional for Phase 1 health check, required for Phase 2+)
* **Neo4j**: (Optional for Phase 1 health check, required for Phase 2+)

### 2. Set Up Virtual Environment & Dependencies
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Running the Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Once running:
* **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative API Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Running Tests
```bash
pytest tests/
```

---

## 📁 Repository Structure
```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── config.py                # Environment configuration
│   ├── api/                     # REST API route handlers
│   │   ├── routes_search.py     # Clue search endpoints
│   │   ├── routes_graph.py      # Dynamic focal graph & path endpoints
│   │   ├── routes_entities.py   # Entity management endpoints
│   │   ├── routes_ingestion.py  # FIR & dataset ingestion endpoints
│   │   ├── routes_analysis.py   # Transitions & anomaly detection endpoints
│   │   └── routes_vision.py     # Surveillance image OCR endpoints
│   ├── db/                      # Database connections
│   │   ├── postgres.py          # SQLAlchemy PostgreSQL session & health
│   │   └── neo4j.py             # Neo4j driver wrapper & health
│   ├── models/                  # Pydantic & SQLAlchemy schemas
│   │   ├── database_models.py   # Relational DB models
│   │   └── schemas.py           # API request/response schemas
│   └── services/                # Business logic & AI pipelines
│       ├── entity_extraction.py
│       ├── relationship_extraction.py
│       ├── entity_resolution.py
│       ├── graph_service.py
│       ├── continuity_service.py
│       ├── anomaly_service.py
│       ├── analytics_service.py
│       ├── evidence_service.py
│       └── vision_service.py
├── data/
│   ├── synthetic/              # Raw synthetic records
│   └── processed/              # Graph-ready datasets
├── scripts/
│   ├── generate_data.py        # Synthetic dataset generator
│   └── seed_database.py        # Seed script for Postgres & Neo4j
├── tests/                      # Automated test suite
├── .env.example                # Template configuration
├── requirements.txt            # Python dependencies
└── README.md                   # Backend documentation
```
