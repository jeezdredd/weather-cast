import logging
from datetime import UTC, datetime

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import WeatherRecord
from app.schemas import WeatherRecordCreate, WeatherRecordUpdate

logger = logging.getLogger(__name__)

WMO_CODES: dict[int, str] = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


async def fetch_current_weather(latitude: float, longitude: float) -> dict:
    url = f"{settings.open_meteo_base_url}/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code",
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()

    current = data["current"]
    weather_code = current.get("weather_code", 0)

    return {
        "temperature": current.get("temperature_2m"),
        "humidity": current.get("relative_humidity_2m"),
        "pressure": current.get("surface_pressure"),
        "wind_speed": current.get("wind_speed_10m"),
        "weather_description": WMO_CODES.get(weather_code, "Unknown"),
        "recorded_at": datetime.now(UTC),
    }


async def get_current_weather_and_save(
    session: AsyncSession,
    latitude: float,
    longitude: float,
    city: str | None = None,
    country: str | None = None,
) -> WeatherRecord:
    weather_data = await fetch_current_weather(latitude, longitude)
    record = WeatherRecord(
        city=city,
        country=country,
        latitude=latitude,
        longitude=longitude,
        **weather_data,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def get_records(
    session: AsyncSession,
    city: str | None = None,
    country: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[WeatherRecord]:
    query = select(WeatherRecord)
    if city:
        query = query.where(WeatherRecord.city.ilike(f"%{city}%"))
    if country:
        query = query.where(WeatherRecord.country.ilike(f"%{country}%"))
    query = query.order_by(WeatherRecord.created_at.desc()).offset(skip).limit(limit)
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_record_by_id(session: AsyncSession, record_id: int) -> WeatherRecord | None:
    return await session.get(WeatherRecord, record_id)


async def create_record(session: AsyncSession, data: WeatherRecordCreate) -> WeatherRecord:
    record = WeatherRecord(**data.model_dump())
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def update_record(
    session: AsyncSession, record: WeatherRecord, data: WeatherRecordUpdate
) -> WeatherRecord:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
    await session.commit()
    await session.refresh(record)
    return record


async def delete_record(session: AsyncSession, record: WeatherRecord) -> None:
    await session.delete(record)
    await session.commit()


async def get_distinct_coordinates(session: AsyncSession) -> list[dict]:
    query = (
        select(
            WeatherRecord.latitude,
            WeatherRecord.longitude,
            WeatherRecord.city,
            WeatherRecord.country,
        )
        .group_by(
            WeatherRecord.latitude,
            WeatherRecord.longitude,
            WeatherRecord.city,
            WeatherRecord.country,
        )
    )
    result = await session.execute(query)
    return [
        {"latitude": row.latitude, "longitude": row.longitude, "city": row.city, "country": row.country}
        for row in result.all()
    ]
