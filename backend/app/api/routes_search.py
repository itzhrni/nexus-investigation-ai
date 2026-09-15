from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.schemas import SearchResponse
from app.services.search_service import search_service
from app.services.audit_service import audit_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
def search_entities(
    request: Request,
    q: str = Query(..., min_length=1, description="Clue or identifier to search"),
    entity_type: Optional[str] = Query(None, description="Filter by entity type"),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Search for entities using any clue (Person, Phone, SIM, Device, Vehicle, Account, Location, FIR).
    Protected endpoint: Enforces Bearer JWT authentication and audit logging.
    """
    res = search_service.search(db, query_str=q, entity_type_filter=entity_type, limit=limit)

    audit_service.log_action(
        db=db,
        user_id=current_user["id"],
        user_email=current_user["email"],
        action="SEARCH",
        resource_type="SEARCH_QUERY",
        resource_id=q,
        metadata={"entity_type_filter": entity_type, "matches_found": res.total_matches},
        ip_address=request.client.host if request.client else "127.0.0.1"
    )


    return res

