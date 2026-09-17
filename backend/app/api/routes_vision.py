from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.services.vision_service import vision_service
from app.services.audit_service import audit_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/vision", tags=["Surveillance & Vision"])

MAX_IMAGE_FILE_BYTES = 10 * 1024 * 1024  # 10 MB Limit
ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("/analyze")
async def analyze_surveillance_image(
    request: Request,
    file: Optional[UploadFile] = File(None),
    location_id: Optional[str] = Form("LOC005"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Surveillance Image OCR Pipeline.
    Protected endpoint: Enforces 10MB size limit, MIME/image file validation, and audit logging.
    Extracts number plate text, normalizes vehicle registration, looks up matching Vehicle & Person in PostgreSQL,
    and returns connected investigation graph entities.
    """
    if not file:
        raise HTTPException(status_code=400, detail="Surveillance image file must be uploaded")

    filename_lower = file.filename.lower() if file.filename else ""
    ext_match = any(filename_lower.endswith(ext) for ext in ALLOWED_EXTENSIONS)
    content_type = (file.content_type or "").lower()

    if not ext_match and content_type not in ALLOWED_IMAGE_MIMES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Uploaded file must be a JPEG or PNG image file"
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(image_bytes) > MAX_IMAGE_FILE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Uploaded surveillance image exceeds 10MB maximum file size limit"
        )

    analysis_res = vision_service.analyze_surveillance_image(db, image_bytes=image_bytes, location_id=location_id)

    # Persistent audit logging
    audit_service.log_action(
        db=db,
        user_id=current_user["id"],
        user_email=current_user["email"],
        action="VISION_INGEST",
        resource_type="SURVEILLANCE_IMAGE",
        resource_id=file.filename or "uploaded_image.jpg",
        metadata={
            "location_id": location_id,
            "plate_detected": analysis_res.get("detected_plate"),
            "matched_person": analysis_res.get("matched_person_id")
        },
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    return analysis_res

