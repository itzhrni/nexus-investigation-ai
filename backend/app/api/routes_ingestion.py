from fastapi import APIRouter

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

@router.post("/report")
def ingest_report():
    return {"status": "ok", "message": "Ingest report endpoint placeholder"}
