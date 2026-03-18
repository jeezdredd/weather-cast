import logging

import httpx

from app.config import settings
from app.schemas import GeocodingResult

logger = logging.getLogger(__name__)


async def search_cities(name: str, count: int = 10) -> list[GeocodingResult]:
    url = f"{settings.geocoding_base_url}/search"
    params = {"name": name, "count": count, "language": "en", "format": "json"}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()

    results = data.get("results", [])
    return [
        GeocodingResult(
            name=r["name"],
            latitude=r["latitude"],
            longitude=r["longitude"],
            country=r.get("country"),
            country_code=r.get("country_code"),
            admin1=r.get("admin1"),
        )
        for r in results
    ]


async def geocode_city(city: str, country: str | None = None) -> tuple[float, float] | None:
    results = await search_cities(city, count=5)
    if not results:
        return None

    if country:
        for r in results:
            if r.country and r.country.lower() == country.lower():
                return (r.latitude, r.longitude)
        for r in results:
            if r.country_code and r.country_code.lower() == country.lower():
                return (r.latitude, r.longitude)

    return (results[0].latitude, results[0].longitude)
