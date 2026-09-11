# PSAS Kelompok 1 - PT GSU Ecosystem

Multi-service repository architecture containing **Frontend**, **Backend**, and **AI Service** microservices.

```
PSAS-Kelompok1/
├── frontend/             # React + Vite Single Page Application (Port 3000 / 5173)
├── backend/              # Laravel 10 Core API & Database Backend (Port 8000)
└── ai-service/           # Python FastAPI AI Microservice (Port 8000 / 8001)
```

---

## 1. Frontend (`frontend/`)

Built with **React 19**, **Vite 5**, **Tailwind CSS**, **Lucide React**, and **React Router v7**.

### Quick Start:
```bash
cd frontend
npm install
npm run dev
```

---

## 2. Backend (`backend/`)

Built with **Laravel 10**, **PHP 8.2+**, and **MySQL**.

### Quick Start:
```bash
cd backend
composer install
php artisan serve --port=8000
```

---

## 3. AI Service (`ai-service/`)

Built with **Python 3.10+**, **FastAPI**, **Uvicorn**, **OpenCV**, and **Pillow**.

### Quick Start:
```bash
cd ai-service
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
