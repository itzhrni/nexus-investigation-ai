# NEXUS Backend API Contract — Frontend Integration Guide (Person 2)

This document provides the complete API specification for integrating the **React + TypeScript + Vite** frontend with the NEXUS FastAPI backend and PostgreSQL Graph Layer.

---

## 🌐 Base URL & CORS
* **Default Local API Base URL**: `http://localhost:8000/api`
* **CORS Origins Allowed**: `http://localhost:3000`, `http://localhost:5173`, `http://127.0.0.1:3000`, `http://127.0.0.1:5173`

---

## 📌 1. Any-Clue Search API

### `GET /api/search`
Search across all investigation entities (Person, Phone, SIM, Device, Vehicle, BankAccount, Location, FIR, Organization).

* **Query Parameters**:
  - `q` (string, required): Search query (e.g. `SIM001`, `Aarav Sharma`, `+919810012345`, `DL01CA1234`)
  - `entity_type` (string, optional): Filter by entity type (`Person`, `Phone`, `SIM`, `Device`, `Vehicle`, `BankAccount`, `Location`, `FIR`)
  - `limit` (int, default=10): Maximum results to return

* **Example Response**:
```json
{
  "query": "SIM001",
  "total_matches": 1,
  "results": [
    {
      "entity_id": "SIM001",
      "entity_type": "SIM",
      "label": "SIM001",
      "match_type": "exact",
      "confidence": 1.0,
      "properties": {
        "operator": "Airtel"
      }
    }
  ]
}
```

---

## 🕸️ 2. Dynamic Focal Graph API (Cytoscape Integration)

### `GET /api/investigation/{entity_type}/{identifier}`
Retrieve multi-hop recursive graph centered around a focal entity.

> **IMPORTANT FOR CYTOSCAPE.JS**: The backend returns `"relationships": [...]`. Map `"relationships"` directly to Cytoscape edges in the frontend (`source` -> `source`, `target` -> `target`).

* **Path Parameters**:
  - `entity_type` (string): `Person`, `Phone`, `SIM`, `Device`, `Vehicle`, `BankAccount`, `Location`, `FIR`
  - `identifier` (string): Entity unique ID (e.g. `P001`, `SIM001`, `ACC001`, `LOC005`)

* **Query Parameters**:
  - `depth` (int, default=1, max=5): Multi-hop traversal depth
  - `relationship_type` (string, optional): Filter relationship types (e.g., `CALLED`, `TRANSFERRED_MONEY`, `SEEN_AT`, `OWNS_SIM`)
  - `start_time` (string, optional): ISO timestamp filter start
  - `end_time` (string, optional): ISO timestamp filter end

* **Example Response**:
```json
{
  "focal_entity_id": "SIM001",
  "focal_entity_type": "SIM",
  "depth": 2,
  "nodes": [
    {
      "id": "SIM001",
      "type": "SIM",
      "label": "SIM001",
      "properties": {"operator": "Airtel"}
    },
    {
      "id": "DEV001",
      "type": "Device",
      "label": "DEV001",
      "properties": {"model": "Galaxy S23"}
    }
  ],
  "relationships": [
    {
      "id": "REL_GT_SIM001_DEV001",
      "source": "SIM001",
      "target": "DEV001",
      "type": "USED_IN_DEVICE",
      "properties": {},
      "timestamp": "2026-01-05T10:00:00",
      "confidence": 1.0
    }
  ],
  "metrics": {
    "total_nodes": 4,
    "total_edges": 3,
    "relationship_distribution": {"OWNS_SIM": 1, "USED_IN_DEVICE": 2},
    "central_entities": [
      {
        "entity_id": "SIM001",
        "label": "SIM001",
        "entity_type": "SIM",
        "degree": 3,
        "investigation_role": "highly connected entity"
      }
    ]
  }
}
```

---

## 📊 3. High-Level Investigation Summary API (Dashboard UI)

### `GET /api/investigation/{entity_type}/{identifier}/summary`
Single combined endpoint delivering graph metrics, detected patterns, identity transitions, cross-jurisdiction insights, temporal changes, and explainable evidence.

* **Example Response**:
```json
{
  "focal_entity_id": "P004",
  "focal_entity_type": "Person",
  "label": "Vikram Patel",
  "properties": {"state": "Maharashtra", "district": "Mumbai Suburban"},
  "graph_metrics": { ... },
  "detected_patterns": [
    {
      "pattern_id": "PATTERN_CROSS_STATE_JURISDICTION",
      "pattern_type": "CROSS_JURISDICTION_ACTIVITY",
      "severity": "MEDIUM",
      "confidence": 0.94,
      "involved_entities": ["P004", "FIR001", "V004", "LOC002"],
      "evidence": ["Subject P004 named in FIR001 in Delhi", "Vehicle V004 sighted in Mumbai"],
      "explanation": "Multi-jurisdiction operational footprint spanning Delhi and Maharashtra."
    }
  ],
  "identity_transitions": [],
  "cross_jurisdiction_insights": [ ... ],
  "temporal_summary": { ... },
  "explainable_evidence": [ ... ]
}
```

---

## 🔄 4. Identity Continuity API

### `GET /api/investigation/{entity_type}/{identifier}/continuity`
Detect SIM, Device, Phone, or Vehicle identifier transitions.

* **Example Response**:
```json
{
  "entity_id": "P005",
  "entity_type": "Person",
  "transitions": [
    {
      "entity_id": "P005",
      "transition": {
        "from_identifier": "PH005",
        "to_identifier": "PH015",
        "identifier_type": "Phone"
      },
      "confidence": 0.91,
      "transition_date": "2026-01-11",
      "evidence": [
        "Sudden drop in PH005 call activity followed by activation of PH015",
        "Called identical contact network (PH001) from cell tower TOWER_101"
      ],
      "timeline": [ ... ]
    }
  ]
}
```

---

## 🗺️ 5. Cross-Jurisdiction API

### `GET /api/investigation/{entity_type}/{identifier}/jurisdictions`
Retrieve connections spanning states, districts, or police stations.

---

## ⏱️ 6. Temporal Baseline API ("What Changed?")

### `GET /api/investigation/{entity_type}/{identifier}/timeline?reference_timestamp=2026-01-15T12:00:00`
Compares BEFORE and AFTER baseline metrics around reference timestamp.

---

## 🚨 7. Anomaly & Suspicious Pattern API

### `GET /api/investigation/{entity_type}/{identifier}/patterns`
Detects pattern leads (SIM switch, financial loops, location convergence, temporal escalation).

---

## 🔍 8. Bharat-Aware Entity Resolution API

### `GET /api/analysis/entity-resolution?query_entity_id=P001`
Returns candidate profiles with matching signals (`alias_match`, `phonetic_key_match`, `shared_district_context`).

---

## 📥 9. Ingestion APIs (FIR, CSV, Surveillance Image)

### `POST /api/ingest/fir`
Upload/send raw text of police FIR report.
* **Request Body (JSON)**:
  `{"text_content": "...", "report_title": "..."}`
* **Effect**: Automatically creates entities and inserts relationships into `entity_relationships`.

### `POST /api/ingest/csv`
Upload CSV file (`multipart/form-data` with `file`).
* **Effect**: Populates entities and relationships; returns `{ "records_processed": 120, "entities_created": 86, "relationships_created": 143, "duplicates_resolved": 17, "warnings": [] }`.

### `POST /api/vision/analyze`
Upload surveillance image file (`multipart/form-data` with `file`).
* **Effect**: OCR extracts vehicle plate -> normalizes registration number -> looks up vehicle and owner in PostgreSQL -> returns candidate match & connected entities.
