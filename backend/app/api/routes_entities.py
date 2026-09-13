from fastapi import APIRouter

router = APIRouter(prefix="/entities", tags=["Entities"])

@router.get("")
def list_entities():
    return {"status": "ok", "message": "Entities endpoint placeholder"}
