# NEXUS — AI-Powered Criminal Network Analysis System (SIH26189)

NEXUS is an AI-powered investigation-support system that converts structured and unstructured crime and intelligence data into an interactive, evidence-backed knowledge graph.

## System Architecture

* **Backend**: FastAPI, PostgreSQL, Neo4j, spaCy, NetworkX, OpenCV / PaddleOCR, scikit-learn.
* **Frontend**: React, Cytoscape.js, Google Maps, Timeline UI (Handled by Frontend Lead).

## Quick Start — Backend

See [backend/README.md](backend/README.md) for complete installation and setup instructions.

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
