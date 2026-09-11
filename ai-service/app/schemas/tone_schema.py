from pydantic import BaseModel
from typing import Optional

class AnalysisRequest(BaseModel):
    tone_preset: Optional[str] = "warm"

class AnalysisResponse(BaseModel):
    status: str
    skin_tone: str
    recommended_style: str
    matched_color: str
    service_type: str
    recommendation_note: str
