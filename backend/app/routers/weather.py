import asyncio

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.schemas import WeatherRecordCreate, WeatherRecordResponse, WeatherRecordUpdate
from app.services import forecast_service, geocoding_service, weather_service

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current", response_model=WeatherRecordResponse)
async def get_current_weather(
    lat: float | None = Query(default=None, ge=-90, le=90),
    lon: float | None = Query(default=None, ge=-180, le=180),
    city: str | None = Query(default=None),
    country: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
):
    if lat is not None and lon is not None:
        record = await weather_service.get_current_weather_and_save(
            session, lat, lon, city=city, country=country
        )
        return record

    if city:
        coords = await geocoding_service.geocode_city(city, country)
        if not coords:
            raise HTTPException(status_code=404, detail="City not found")
        record = await weather_service.get_current_weather_and_save(
            session, coords[0], coords[1], city=city, country=country
        )
        return record

    raise HTTPException(
        status_code=400,
        detail="Provide lat/lon coordinates or a city name",
    )


@router.get("/records", response_model=list[WeatherRecordResponse])
async def list_records(
    city: str | None = Query(default=None),
    country: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    return await weather_service.get_records(session, city=city, country=country, skip=skip, limit=limit)


@router.get("/records/{record_id}", response_model=WeatherRecordResponse)
async def get_record(record_id: int, session: AsyncSession = Depends(get_session)):
    record = await weather_service.get_record_by_id(session, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.post("/records", response_model=WeatherRecordResponse, status_code=201)
async def create_record(
    data: WeatherRecordCreate, session: AsyncSession = Depends(get_session)
):
    return await weather_service.create_record(session, data)


@router.put("/records/{record_id}", response_model=WeatherRecordResponse)
async def update_record(
    record_id: int,
    data: WeatherRecordUpdate,
    session: AsyncSession = Depends(get_session),
):
    record = await weather_service.get_record_by_id(session, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return await weather_service.update_record(session, record, data)


@router.delete("/records/{record_id}", status_code=204)
async def delete_record(record_id: int, session: AsyncSession = Depends(get_session)):
    record = await weather_service.get_record_by_id(session, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    await weather_service.delete_record(session, record)


@router.get("/country-average")
async def get_country_average(
    country: str = Query(min_length=1),
):
    cities = await geocoding_service.search_cities(country, count=3)
    if not cities:
        raise HTTPException(status_code=404, detail="Country not found")

    temps: list[float] = []
    for i, city in enumerate(cities):
        if i > 0:
            await asyncio.sleep(1.5)
        try:
            data = await weather_service.fetch_current_weather(city.latitude, city.longitude)
            if data.get("temperature") is not None:
                temps.append(data["temperature"])
        except Exception:
            continue

    if not temps:
        raise HTTPException(status_code=502, detail="Could not fetch temperature data")

    return {
        "country": country,
        "average_temperature": round(sum(temps) / len(temps), 1),
        "sample_cities": len(temps),
    }


@router.get("/forecast")
async def get_forecast(
    lat: float | None = Query(default=None, ge=-90, le=90),
    lon: float | None = Query(default=None, ge=-180, le=180),
    city: str | None = Query(default=None),
    country: str | None = Query(default=None),
    days: int = Query(default=5, ge=1, le=16),
):
    if lat is not None and lon is not None:
        return await forecast_service.fetch_forecast(lat, lon, days)

    if city:
        coords = await geocoding_service.geocode_city(city, country)
        if not coords:
            raise HTTPException(status_code=404, detail="City not found")
        return await forecast_service.fetch_forecast(coords[0], coords[1], days)

    raise HTTPException(
        status_code=400,
        detail="Provide lat/lon coordinates or a city name",
    )
