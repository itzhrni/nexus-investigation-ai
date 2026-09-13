from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.services.vision_service import vision_service

router = APIRouter(prefix="/vision", tags=["Surveillance & Vision"])

@router.post("/analyze")
async def analyze_surveillance_image(
    file: Optional[UploadFile] = File(None),
    location_id: Optional[str] = Form("LOC005"),
    db: Session = Depends(get_db)
):
    """
    Surveillance Image OCR Pipeline.
    Extracts number plate text, normalizes vehicle registration, looks up matching Vehicle & Person in PostgreSQL,
    and returns connected investigation graph entities.
    """
    if not file:
        raise HTTPException(status_code=400, detail="Surveillance image file must be uploaded")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    analysis_res = vision_service.analyze_surveillance_image(db, image_bytes=image_bytes, location_id=location_id)
    return analysis_res
