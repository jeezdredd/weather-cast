import asyncio
import json
import time
from datetime import datetime

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import inspect as sa_inspect, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import engine, get_session
from app.logging_config import log_buffer, log_subscribers
from app.middleware import profiler_data
from app.tasks import scheduler

router = APIRouter(prefix="/system", tags=["system"])

_start_time = time.time()


@router.get("/status")
async def get_system_status(session: AsyncSession = Depends(get_session)):
    uptime = time.time() - _start_time

    db_ok = False
    try:
        await session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        pass

    open_meteo_ok = False
    open_meteo_latency_ms: float | None = None
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            t0 = time.time()
            resp = await client.get(f"{settings.open_meteo_base_url}/forecast", params={
                "latitude": 0, "longitude": 0, "current": "temperature_2m",
            })
            open_meteo_latency_ms = round((time.time() - t0) * 1000, 1)
            open_meteo_ok = resp.status_code == 200
    except Exception:
        pass

    geocoding_ok = False
    geocoding_latency_ms: float | None = None
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            t0 = time.time()
            resp = await client.get(f"{settings.geocoding_base_url}/search", params={
                "name": "London", "count": 1,
            })
            geocoding_latency_ms = round((time.time() - t0) * 1000, 1)
            geocoding_ok = resp.status_code == 200
    except Exception:
        pass

    scheduler_running = scheduler.running

    return {
        "uptime_seconds": round(uptime, 1),
        "services": {
            "database": {"status": "ok" if db_ok else "error"},
            "open_meteo_weather": {
                "status": "ok" if open_meteo_ok else "error",
                "latency_ms": open_meteo_latency_ms,
            },
            "open_meteo_geocoding": {
                "status": "ok" if geocoding_ok else "error",
                "latency_ms": geocoding_latency_ms,
            },
            "scheduler": {"status": "running" if scheduler_running else "stopped"},
        },
    }


@router.get("/scheduler")
async def get_scheduler_info():
    jobs = []
    for job in scheduler.get_jobs():
        next_run = job.next_run_time.isoformat() if job.next_run_time else None
        trigger_str = str(job.trigger) if job.trigger else None
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run_time": next_run,
            "trigger": trigger_str,
        })

    return {
        "running": scheduler.running,
        "jobs": jobs,
    }


@router.get("/records/stats")
async def get_records_stats(session: AsyncSession = Depends(get_session)):
    total = await session.execute(text("SELECT COUNT(*) FROM weather_records"))
    total_count = total.scalar()

    cities = await session.execute(
        text("SELECT COUNT(DISTINCT city) FROM weather_records WHERE city IS NOT NULL")
    )
    cities_count = cities.scalar()

    latest = await session.execute(
        text("SELECT MAX(recorded_at) FROM weather_records")
    )
    latest_record = latest.scalar()

    return {
        "total_records": total_count,
        "distinct_cities": cities_count,
        "latest_record": latest_record.isoformat() if latest_record else None,
    }


@router.get("/profiler")
async def get_profiler_data():
    return {"requests": list(profiler_data)}


@router.delete("/profiler")
async def clear_profiler_data():
    profiler_data.clear()
    return {"status": "cleared"}


@router.get("/logs")
async def get_logs():
    return {"logs": list(log_buffer)}


@router.websocket("/logs/ws")
async def logs_websocket(websocket: WebSocket):
    await websocket.accept()
    queue: asyncio.Queue = asyncio.Queue(maxsize=100)
    log_subscribers.add(queue)
    try:
        while True:
            entry = await queue.get()
            await websocket.send_text(json.dumps(entry))
    except WebSocketDisconnect:
        pass
    finally:
        log_subscribers.discard(queue)


@router.get("/db/tables")
async def get_tables():
    async with engine.connect() as conn:
        names = await conn.run_sync(lambda c: sa_inspect(c).get_table_names())
    return {"tables": names}


@router.get("/db/tables/{table_name}")
async def get_table_rows(
    table_name: str,
    limit: int = Query(default=50, ge=1, le=200),
):
    async with engine.connect() as conn:
        tables = await conn.run_sync(lambda c: sa_inspect(c).get_table_names())
        if table_name not in tables:
            raise HTTPException(status_code=404, detail="Table not found")

        columns = await conn.run_sync(
            lambda c: [col["name"] for col in sa_inspect(c).get_columns(table_name)]
        )

        result = await conn.execute(
            text(f'SELECT * FROM "{table_name}" ORDER BY 1 DESC LIMIT :lim'),
            {"lim": limit},
        )
        rows = []
        for row in result.fetchall():
            row_dict = {}
            for col_name, value in zip(columns, row):
                if isinstance(value, datetime):
                    value = value.isoformat()
                row_dict[col_name] = value
            rows.append(row_dict)

    return {"table": table_name, "columns": columns, "rows": rows, "count": len(rows)}
