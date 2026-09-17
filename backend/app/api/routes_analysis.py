from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.schemas import (
    EntityResolutionResponse,
    PatternDetectionResponse,
    EvidenceResponse,
    AadhaarForensicsResponse,
)
from app.services.entity_resolution import entity_resolution_service
from app.services.anomaly_service import anomaly_service
from app.services.evidence_service import evidence_service
from app.services.aadhaar_service import aadhaar_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/analysis", tags=["Analytics & AI"])

@router.get("/entity-resolution", response_model=EntityResolutionResponse)
def get_entity_resolution(
    query_entity_id: str = Query(..., description="Target person ID to find candidates for"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Bharat-aware entity resolution candidate suggestions. Protected endpoint.
    """
    return entity_resolution_service.resolve_candidates(db, query_entity_id=query_entity_id)

@router.get("/anomalies", response_model=PatternDetectionResponse)
def get_anomalies(
    focal_entity_id: Optional[str] = Query(None, description="Optional focal entity ID filter"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Detect suspicious patterns and anomalies. Protected endpoint.
    """
    return anomaly_service.detect_patterns(db, focal_entity_id=focal_entity_id)

@router.get("/evidence", response_model=EvidenceResponse)
def get_evidence(
    focal_entity_id: str = Query(..., description="Focal entity ID"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get 6-W explainable evidence items for focal entity. Protected endpoint.
    """
    return evidence_service.get_explainable_evidence(db, focal_entity_id=focal_entity_id)

@router.get("/aadhaar-forensics", response_model=AadhaarForensicsResponse)
def get_aadhaar_forensics(
    person_id: str = Query(..., description="Person entity ID, e.g. P001"),
    db: Session = Depends(get_db)
):
    """
    Forensic Aadhaar Intelligence: Verhoeff mathematical integrity, privacy masking,
    and 1-to-many / many-to-1 fraud collision detection.
    """
    res = aadhaar_service.analyze_person_aadhaar(db, person_id=person_id)
    return AadhaarForensicsResponse(
        person_id=person_id,
        has_aadhaar=res["has_aadhaar"],
        aadhaar_masked=res["aadhaar_masked"],
        status=res["status"],
        verhoeff_valid=res["verhoeff_valid"],
        collision_detected=res["collision_detected"],
        collision_details=res["collision_details"],
        colliding_person_ids=res.get("colliding_person_ids", []),
        fanout_sim_count=res.get("fanout_sim_count", 0),
        fanout_account_count=res.get("fanout_account_count", 0),
        total_fanout=res.get("total_fanout", 0)
    )


