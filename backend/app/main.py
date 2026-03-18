from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.logging_config import setup_logging
from app.middleware import RequestProfilerMiddleware
from app.routers import geocoding, system, weather
from app.tasks import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    setup_logging()
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="Weather Cast API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestProfilerMiddleware)

app.include_router(weather.router)
app.include_router(geocoding.router)
app.include_router(system.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
