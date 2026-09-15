import io
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models import database_models
from app.services.entity_extraction import entity_extraction_service
from app.services.relationship_extraction import relationship_extraction_service
from app.services.csv_ingestion_service import csv_ingestion_service
from app.services.audit_service import audit_service
from app.api.deps import get_current_user
from scripts.seed_database import bulk_seed_table

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

MAX_FIR_TEXT_BYTES = 1 * 1024 * 1024  # 1 MB Limit
MAX_CSV_FILE_BYTES = 10 * 1024 * 1024  # 10 MB Limit

class FIRIngestRequest(BaseModel):
    text_content: str
    report_title: Optional[str] = "Police FIR Report"
    police_station: Optional[str] = "Central PS"

@router.post("/fir")
def ingest_fir_report(
    req: FIRIngestRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    FIR & Police Report NLP Ingestion Pipeline.
    Protected endpoint: Enforces 1MB payload limits and persistent audit logging.
    """
    if not req.text_content or not req.text_content.strip():
        raise HTTPException(status_code=400, detail="text_content must not be empty")

    if len(req.text_content.encode("utf-8")) > MAX_FIR_TEXT_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="FIR text payload exceeds 1MB maximum size limit"
        )

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

    # Persistent audit log
    audit_service.log_action(
        db=db,
        user_id=current_user["id"],
        user_email=current_user["email"],
        action="FIR_INGEST",
        resource_type="FIR_DOCUMENT",
        resource_id=req.report_title,
        metadata={"entities_count": len(extracted_entities), "rels_count": len(extracted_rels)},
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    return {
        "report_title": req.report_title,
        "extracted_entities": extracted_entities,
        "extracted_relationships": extracted_rels,
        "overall_confidence": extraction_res["overall_confidence"],
        "warnings": extraction_res["warnings"]
    }

@router.post("/csv")
async def ingest_csv_file(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Upload and ingest CSV investigation dataset into PostgreSQL and graph relationship layer.
    Protected endpoint: Enforces 10MB file size limit, extension, MIME, and UTF-8 content validation.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Uploaded file must have a .csv file extension")

    # Read content with 10MB limit enforcement
    content = await file.read()
    if len(content) > MAX_CSV_FILE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Uploaded CSV file exceeds 10MB maximum file size limit"
        )

    try:
        csv_str = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="CSV file content must be valid UTF-8 encoded text"
        )

    ingest_stats = csv_ingestion_service.ingest_csv(db, csv_content=csv_str)

    # Persistent audit log
    audit_service.log_action(
        db=db,
        user_id=current_user["id"],
        user_email=current_user["email"],
        action="CSV_INGEST",
        resource_type="CSV_DATASET",
        resource_id=file.filename,
        metadata=ingest_stats,
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    return ingest_stats
