import asyncio
import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.logging_config import setup_logging
from app.middleware import RequestProfilerMiddleware
from app.routers import geocoding, system, weather
from app.tasks import start_scheduler, stop_scheduler

logger = logging.getLogger(__name__)


async def run_migrations():
    try:
        proc = await asyncio.create_subprocess_exec(
            "alembic", "upgrade", "head",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()
        if proc.returncode == 0:
            logger.info("Alembic migrations applied successfully")
        else:
            logger.error("Alembic migration failed: %s", stderr.decode())
    except Exception:
        logger.exception("Failed to run alembic migrations")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    setup_logging()
    await run_migrations()
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="Weather Cast API", version="1.0.0", lifespan=lifespan)

app.add_middleware(RequestProfilerMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(geocoding.router)
app.include_router(system.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
