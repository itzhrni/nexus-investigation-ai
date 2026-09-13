from fastapi import APIRouter

router = APIRouter(prefix="/vision", tags=["Surveillance & Vision"])

@router.post("/analyze")
def analyze_image():
    return {"status": "ok", "message": "Surveillance image OCR pipeline placeholder"}
