from typing import Dict, Any
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter(prefix="/entities", tags=["Entities"])

@router.get("")
def list_entities(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Placeholder entities endpoint. Protected with Bearer token authentication."""
    return {"status": "ok", "message": "Entities endpoint placeholder", "user": current_user["email"]}

