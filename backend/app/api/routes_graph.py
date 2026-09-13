from typing import Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.schemas import (
    FocalGraphResponse, SearchResponse, ContinuityResponse, JurisdictionsResponse,
    TimelineComparisonResponse, PatternDetectionResponse, InvestigationSummaryResponse
)
from app.services.graph_service import graph_service
from app.services.search_service import search_service
from app.services.continuity_service import continuity_service
from app.services.jurisdiction_service import jurisdiction_service
from app.services.timeline_service import timeline_service
from app.services.anomaly_service import anomaly_service
from app.services.summary_service import summary_service

router = APIRouter(prefix="/investigation", tags=["Investigation & Graph Engine"])

@router.get("/search", response_model=SearchResponse)
def search_investigation_clues(
    q: str = Query(..., min_length=1, description="Clue or identifier to search"),
    entity_type: Optional[str] = Query(None, description="Optional entity type filter"),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Any-Clue Search: Search across all entities (Person, Phone, SIM, Device, Vehicle, Account, Location, FIR).
    """
    return search_service.search(db, query_str=q, entity_type_filter=entity_type, limit=limit)

@router.get("/{entity_type}/{identifier}", response_model=FocalGraphResponse)
def get_focal_graph(
    entity_type: str = Path(..., description="Entity type, e.g. Person, Phone, Vehicle, BankAccount, Location, FIR"),
    identifier: str = Path(..., description="Entity unique identifier, e.g. P001, PH001, ACC001, FIR001"),
    depth: int = Query(1, ge=1, le=5, description="Graph traversal depth (1-5 hops)"),
    relationship_type: Optional[str] = Query(None, description="Filter by relationship type"),
    start_time: Optional[str] = Query(None, description="ISO timestamp filter start"),
    end_time: Optional[str] = Query(None, description="ISO timestamp filter end"),
    db: Session = Depends(get_db)
):
    """
    Retrieve dynamic focal graph centered around a searched entity using PostgreSQL recursive CTE.
    """
    return graph_service.get_focal_graph(
        db=db,
        identifier=identifier,
        entity_type=entity_type,
        depth=depth,
        relationship_type=relationship_type,
        start_time=start_time,
        end_time=end_time
    )

@router.get("/{entity_type}/{identifier}/summary", response_model=InvestigationSummaryResponse)
def get_investigation_summary(
    entity_type: str = Path(...),
    identifier: str = Path(...),
    db: Session = Depends(get_db)
):
    """
    High-level Investigation Summary API payload for dashboard UI.
    """
    return summary_service.get_investigation_summary(db, entity_type=entity_type, identifier=identifier)

@router.get("/{entity_type}/{identifier}/continuity", response_model=ContinuityResponse)
def get_identity_continuity(
    entity_type: str = Path(...),
    identifier: str = Path(...),
    db: Session = Depends(get_db)
):
    """
    Detect SIM/Device/Phone/Vehicle identity transitions for subject.
    """
    return continuity_service.detect_transitions(db, entity_id=identifier)

@router.get("/{entity_type}/{identifier}/jurisdictions", response_model=JurisdictionsResponse)
def get_cross_jurisdictions(
    entity_type: str = Path(...),
    identifier: str = Path(...),
    db: Session = Depends(get_db)
):
    """
    Detect cross-state and cross-jurisdiction operational footprints.
    """
    return jurisdiction_service.detect_cross_jurisdiction(db, entity_id=identifier)

@router.get("/{entity_type}/{identifier}/timeline", response_model=TimelineComparisonResponse)
def get_timeline_comparison(
    entity_type: str = Path(...),
    identifier: str = Path(...),
    reference_timestamp: Optional[str] = Query("2026-01-15T12:00:00"),
    db: Session = Depends(get_db)
):
    """
    Temporal baseline analysis ("What Changed?") before and after an anchor timestamp.
    """
    return timeline_service.compare_before_after(db, focal_entity_id=identifier, reference_timestamp=reference_timestamp)

@router.get("/{entity_type}/{identifier}/patterns", response_model=PatternDetectionResponse)
def get_detected_patterns(
    entity_type: str = Path(...),
    identifier: str = Path(...),
    db: Session = Depends(get_db)
):
    """
    Detect suspicious patterns and anomalies involving the focal entity.
    """
    return anomaly_service.detect_patterns(db, focal_entity_id=identifier)
