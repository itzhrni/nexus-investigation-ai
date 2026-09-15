from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.schemas import EntityResolutionResponse, PatternDetectionResponse, EvidenceResponse
from app.services.entity_resolution import entity_resolution_service
from app.services.anomaly_service import anomaly_service
from app.services.evidence_service import evidence_service
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

