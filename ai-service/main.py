from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="PT GSU - AI Service API",
    description="Microservice AI untuk Analisis Warna Kulit Tangan & Rekomendasi Nail Art / Eyelash",
    version="1.0.0"
)

# Enable CORS for React Frontend and Laravel Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "PT GSU AI Microservice",
        "status": "online",
        "version": "1.0.0"
    }

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
