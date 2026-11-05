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

## Deteksi dan segmentasi kuku dengan YOLOv8 (opsional)

Generator tetap memakai MediaPipe jika `NAIL_YOLO_MODEL` tidak diatur. Untuk
menggunakan YOLOv8, siapkan weights **YOLOv8-seg yang sudah dilatih dengan
masker kuku**; weights deteksi objek biasa atau model COCO bawaan tidak cukup
untuk mengenali kuku.

Atur variabel lingkungan sebelum menjalankan service:

```powershell
$env:NAIL_YOLO_MODEL = "C:\path\to\nail-segmentation.pt"
```

Ketika tersedia, masker segmentasi dari model digunakan langsung sebagai batas
area penerapan nail art. Bila variabel tidak diatur, jalur MediaPipe tetap
digunakan dan kandidat landmark di dalam area telapak tangan diabaikan untuk
mengurangi kuku tersembunyi yang ikut dihias. Foto contoh saja belum menjadi
dataset training: setiap kuku perlu anotasi masker dan weights perlu dilatih
sebelum YOLOv8 dapat digunakan.
