from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.schemas import SearchResponse
from app.services.search_service import search_service

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
def search_entities(
    q: str = Query(..., min_length=1, description="Clue or identifier to search"),
    entity_type: Optional[str] = Query(None, description="Filter by entity type"),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search for entities using any clue (Person, Phone, SIM, Device, Vehicle, Account, Location, FIR).
    """
    return search_service.search(db, query_str=q, entity_type_filter=entity_type, limit=limit)
