from fastapi import APIRouter, Query
from app.models.schemas import SearchResponse, EntitySearchResult

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
def search_entities(
    q: str = Query(..., min_length=1, description="Clue or identifier to search"),
    entity_type: str = Query(None, description="Filter by entity type (Person, Phone, Vehicle, etc.)"),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Search for entities using any clue (Person, Phone, SIM, Device, Vehicle, Account, Location, FIR).
    Returns list of matching entities.
    """
    # Phase 1 stub return
    return SearchResponse(
        query=q,
        total_matches=0,
        results=[]
    )
