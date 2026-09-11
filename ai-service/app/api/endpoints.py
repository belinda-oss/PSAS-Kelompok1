from fastapi import APIRouter
from typing import Optional
from app.schemas.tone_schema import AnalysisResponse, AnalysisRequest
from app.services.tone_analyzer import analyze_hand_tone

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "AI Service Running Smoothly"}

@router.post("/analyze-hand", response_model=AnalysisResponse)
async def analyze_hand(request: Optional[AnalysisRequest] = None):
    tone = request.tone_preset if request and request.tone_preset else "warm"
    result = analyze_hand_tone(tone)
    return {
        "status": "success",
        "skin_tone": result["skin_tone"],
        "recommended_style": result["recommended_style"],
        "matched_color": result["matched_color"],
        "service_type": result["service_type"],
        "recommendation_note": result["recommendation_note"]
    }
