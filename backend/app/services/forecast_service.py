import httpx

from app.config import settings
from app.services.weather_service import WMO_CODES


async def fetch_forecast(latitude: float, longitude: float, days: int = 5) -> list[dict]:
    url = f"{settings.open_meteo_base_url}/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max",
        "timezone": "auto",
        "forecast_days": days,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()

    daily = data["daily"]
    result = []
    for i in range(len(daily["time"])):
        result.append({
            "date": daily["time"][i],
            "temperature_max": daily["temperature_2m_max"][i],
            "temperature_min": daily["temperature_2m_min"][i],
            "weather_code": daily["weather_code"][i],
            "weather_description": WMO_CODES.get(daily["weather_code"][i], "Unknown"),
            "precipitation_sum": daily["precipitation_sum"][i],
            "wind_speed_max": daily["wind_speed_10m_max"][i],
        })
    return result
