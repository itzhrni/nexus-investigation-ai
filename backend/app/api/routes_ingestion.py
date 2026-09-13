import io
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models import database_models
from app.services.entity_extraction import entity_extraction_service
from app.services.relationship_extraction import relationship_extraction_service
from app.services.csv_ingestion_service import csv_ingestion_service
from scripts.seed_database import bulk_seed_table

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

class FIRIngestRequest(BaseModel):
    text_content: str
    report_title: Optional[str] = "Police FIR Report"
    police_station: Optional[str] = "Central PS"

@router.post("/fir")
def ingest_fir_report(
    req: FIRIngestRequest,
    db: Session = Depends(get_db)
):
    """
    FIR & Police Report NLP Ingestion Pipeline.
    Extracts entities, relationship triples, normalizes identifiers, and inserts into PostgreSQL entities & entity_relationships.
    """
    if not req.text_content or not req.text_content.strip():
        raise HTTPException(status_code=400, detail="text_content must not be empty")

    extraction_res = entity_extraction_service.extract_entities_from_text(db, req.text_content)
    extracted_entities = extraction_res["entities"]
    extracted_rels = relationship_extraction_service.extract_relationships_from_entities(db, req.text_content, extracted_entities)

    # Persist extracted entities into entities table registry
    entity_records = []
    for e in extracted_entities:
        entity_records.append({
            "id": e["id"],
            "entity_type": e["entity_type"],
            "primary_identifier": e["label"],
            "metadata_json": e["metadata"]
        })
    bulk_seed_table(db, database_models.Entity, entity_records)

    # Persist extracted relationships into entity_relationships graph layer
    bulk_seed_table(db, database_models.EntityRelationship, extracted_rels)

    return {
        "report_title": req.report_title,
        "extracted_entities": extracted_entities,
        "extracted_relationships": extracted_rels,
        "overall_confidence": extraction_res["overall_confidence"],
        "warnings": extraction_res["warnings"]
    }

@router.post("/csv")
async def ingest_csv_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and ingest CSV investigation dataset into PostgreSQL and graph relationship layer.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a CSV file")

    content = await file.read()
    csv_str = content.decode("utf-8", errors="ignore")

    ingest_stats = csv_ingestion_service.ingest_csv(db, csv_content=csv_str)
    return ingest_stats
