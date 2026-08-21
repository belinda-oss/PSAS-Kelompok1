from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np
from ultralytics import YOLO

app = FastAPI(title="AI Nail Art Service")

# Load model YOLOv8 untuk deteksi objek/segmentasi kuku/tangan
# Model akan otomatis terunduh ringan saat pertama kali dijalankan
model = YOLO("yolov8n.pt") 

@app.get("/")
def home():
    return {"message": "Generate Nail Art Service ready!"}

@app.post("/api/detect")
async def detect_hand(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Deteksi gambar menggunakan YOLO
    results = model(img)
    
    has_detection = len(results[0].boxes) > 0

    return {
        "filename": file.filename,
        "detected": has_detection,
        "total_objects": len(results[0].boxes)
    }