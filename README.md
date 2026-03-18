# Weather Cast

Full-stack weather application that fetches real-time weather data by coordinates or city name, displays results on a temperature-colored page, and stores records in PostgreSQL.

## Architecture

```
Browser ──► Next.js (port 3000) ──► FastAPI (port 8000) ──► Open-Meteo API
                                          │
                                          ▼
                                     PostgreSQL
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4, Zustand v5 |
| Backend | Python 3.13, FastAPI, Pydantic v2, pydantic-settings |
| Database | PostgreSQL 16, SQLAlchemy 2.0 (async), Alembic |
| HTTP clients | axios (frontend), httpx (backend) |
| Periodic tasks | APScheduler |
| Tests | pytest + pytest-asyncio, Jest + React Testing Library |
| Containerization | Docker, Docker Compose |

## Quick Start

```bash
docker compose up --build
docker compose exec backend alembic upgrade head
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Start PostgreSQL locally, then:
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/weather/current` | Fetch current weather by `lat`/`lon` or `city`/`country` |
| GET | `/weather/records` | List stored records (optional `city`, `country`, `skip`, `limit`) |
| GET | `/weather/records/{id}` | Get a single record |
| POST | `/weather/records` | Create a record |
| PUT | `/weather/records/{id}` | Update a record |
| DELETE | `/weather/records/{id}` | Delete a record |
| GET | `/geocoding/search` | Search cities by name |

Full interactive docs available at http://localhost:8000/docs.

## Running Tests

```bash
# Backend (23 tests)
cd backend
pytest -v

# Frontend (27 tests)
cd frontend
npm test
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://weather:weather@localhost:5432/weather_cast` | Database connection string |
| `LOG_LEVEL` | `INFO` | Logging level |
| `WEATHER_UPDATE_INTERVAL_MINUTES` | `30` | How often APScheduler refreshes stored weather data |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |
