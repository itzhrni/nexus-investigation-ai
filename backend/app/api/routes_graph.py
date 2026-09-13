from fastapi import APIRouter, Query, Path
from app.models.schemas import FocalGraphResponse

router = APIRouter(prefix="/investigation", tags=["Investigation & Graph"])

@router.get("/{entity_type}/{identifier}", response_model=FocalGraphResponse)
def get_focal_graph(
    entity_type: str = Path(..., description="Entity type, e.g. Person, Phone, Vehicle"),
    identifier: str = Path(..., description="Entity unique identifier"),
    depth: int = Query(1, ge=1, le=3, description="Graph traversal depth (1-3 hops)")
):
    """
    Retrieve dynamic focal graph centered around a searched entity.
    """
    return FocalGraphResponse(
        focal_entity_id=identifier,
        focal_entity_type=entity_type,
        depth=depth,
        nodes=[],
        relationships=[]
    )
