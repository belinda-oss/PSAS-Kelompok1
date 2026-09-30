from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Body
from typing import Optional, Dict, Any, List
import cv2
import numpy as np
import base64
import json

from app.schemas.tone_schema import AnalysisResponse, AnalysisRequest
from app.services.tone_analyzer import analyze_hand_tone
from app.services.nail_decorator import (
    NAIL_DESIGNS,
    apply_nail_art_to_image
)

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "PT GSU AI Microservice",
        "message": "AI Precision Nail Art Decorator Running Smoothly"
    }

@router.get("/nail-designs")
def get_nail_designs():
    """
    Returns available cute & aesthetic nail art designs catalog.
    """
    return {
        "status": "success",
        "count": len(NAIL_DESIGNS),
        "designs": NAIL_DESIGNS
    }

@router.post("/nail-art-decorate")
async def nail_art_decorate(
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    design_id: str = Form("blush_jelly"),
    nail_length_factor: float = Form(1.0),
    gloss_intensity: float = Form(0.85)
):
    """
    Precision Nail Detection (MediaPipe Hands) + AI Nail Art Decorator Engine.
    Blends cute aesthetic nail patterns with realistic glossy shine (kilau kuku).
    """
    try:
        image_bytes = None
        if image is not None:
            image_bytes = await image.read()
        elif image_base64 is not None:
            # Handle base64 data url (data:image/...;base64,...)
            if "," in image_base64:
                image_base64 = image_base64.split(",", 1)[1]
            image_bytes = base64.b64decode(image_base64)

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Foto tangan/kuku wajib diunggah.")

        # Decode image using OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img_bgr is None:
            raise HTTPException(status_code=400, detail="Format gambar tidak valid atau rusak.")

        # Resize if image is excessively large to keep response fast (max 1280px)
        max_dim = max(img_bgr.shape[:2])
        if max_dim > 1280:
            scale = 1280.0 / max_dim
            img_bgr = cv2.resize(img_bgr, (int(img_bgr.shape[1] * scale), int(img_bgr.shape[0] * scale)), interpolation=cv2.INTER_AREA)

        # Apply AI Nail Art Decorator
        decorated_bgr, detected_nails, analysis_info = apply_nail_art_to_image(
            image_bgr=img_bgr,
            design_id=design_id,
            nail_length_factor=nail_length_factor,
            gloss_intensity=gloss_intensity
        )

        # Encode before and after images to base64
        _, before_buffer = cv2.imencode('.jpg', img_bgr, [cv2.IMWRITE_JPEG_QUALITY, 92])
        before_base64 = f"data:image/jpeg;base64,{base64.b64encode(before_buffer).decode('utf-8')}"

        _, after_buffer = cv2.imencode('.png', decorated_bgr)
        after_base64 = f"data:image/png;base64,{base64.b64encode(after_buffer).decode('utf-8')}"

        selected_design = next((d for d in NAIL_DESIGNS if d["id"] == design_id), NAIL_DESIGNS[0])

        return {
            "status": "success",
            "message": "AI Nail Art Decorator berhasil diterapkan secara presisi.",
            "design": selected_design,
            "detected_nails_count": len(detected_nails),
            "nails": detected_nails,
            "analysis": analysis_info,
            "before_image": before_base64,
            "after_image": after_base64
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pemrosesan AI: {str(e)}")

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
