import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import settings
from app.database import async_session
from app.services import weather_service

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def refresh_weather_data() -> None:
    logger.info("Starting periodic weather data refresh")
    async with async_session() as session:
        coordinates = await weather_service.get_distinct_coordinates(session)
        logger.info("Found %d distinct coordinate pairs to refresh", len(coordinates))
        for i, coord in enumerate(coordinates):
            if i > 0:
                await asyncio.sleep(2.0)
            try:
                await weather_service.get_current_weather_and_save(
                    session,
                    coord["latitude"],
                    coord["longitude"],
                    city=coord.get("city"),
                    country=coord.get("country"),
                )
            except Exception:
                logger.exception(
                    "Failed to refresh weather for (%s, %s)",
                    coord["latitude"],
                    coord["longitude"],
                )
    logger.info("Periodic weather data refresh completed")


def start_scheduler() -> None:
    scheduler.add_job(
        refresh_weather_data,
        "interval",
        minutes=settings.weather_update_interval_minutes,
        id="refresh_weather",
        replace_existing=True,
    )
    scheduler.start()
    logger.info(
        "Scheduler started with %d minute interval",
        settings.weather_update_interval_minutes,
    )


def stop_scheduler() -> None:
    scheduler.shutdown(wait=False)
    logger.info("Scheduler stopped")
