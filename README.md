# NEXUS — AI-Powered Criminal Network Analysis System (SIH26189)

> Connect the clues. Reveal the network.

NEXUS is an AI-powered investigation-support system that converts structured and unstructured crime and intelligence data into an interactive, evidence-backed knowledge graph.

## System Architecture (Phase 3 Complete)

* **Frontend**: React + TypeScript + Vite, Cytoscape.js, Google Maps, Timeline UI (Phase 4).
* **Backend**: FastAPI, Python 3.11+.
* **Database & Graph Layer**: Supabase PostgreSQL (Relational tables + `entity_relationships` graph layer powered by recursive SQL CTEs).
* **Investigation Intelligence Services**:
  - Any-Clue Search Across All Entities
  - Bharat-Aware Entity Resolution Engine
  - Multi-Hop Graph Analysis & Centrality (Non-accusatory roles)
  - SIM / Device / Phone Identity Continuity Detection
  - Cross-State / Cross-Jurisdiction Footprint Analysis
  - Temporal Baseline Comparison ("What Changed?")
  - Suspicious Pattern, Financial Loop & Location Convergence Engine
  - 6-W Explainable Evidence Generation
  - High-Level Investigation Summary API
* **AI/ML**: spaCy, Transformers, Gemini API, scikit-learn.

## Quick Start — Backend

See [backend/README.md](backend/README.md) for complete installation and setup instructions.

```bash
cd backend
pip install -r requirements.txt
python scripts/seed_database.py
pytest tests/ -v
uvicorn app.main:app --reload
```
