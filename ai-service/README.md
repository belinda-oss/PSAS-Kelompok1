# AI Microservice - PT GSU

Layanan AI berbasis Python FastAPI untuk analisis warna kulit tangan (*Hand Skin Tone Analysis*) dan rekomendasi *Nail Art* & *Eyelash Extension*.

## Struktur Folder `ai-service/`

```
ai-service/
├── main.py                   # FastAPI Server Entry Point
├── requirements.txt          # Python Dependencies
├── app/
│   ├── api/
│   │   └── endpoints.py      # FastAPI Endpoints (/api/v1/analyze-hand, /api/v1/health)
│   ├── services/
│   │   └── tone_analyzer.py  # Logika Analisis Citra Warna Kulit
│   └── schemas/
│       └── tone_schema.py    # Model Data Pydantic (Request & Response)
└── README.md
```

## Panduan Memulai

1. **Masuk ke folder `ai-service`**:
   ```bash
   cd ai-service
   ```

2. **Aktifkan Virtual Environment**:
   ```bash
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   ```

3. **Install Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Jalankan Server FastAPI**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Akses Dokumentasi API**:
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`
