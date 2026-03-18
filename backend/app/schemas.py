from datetime import datetime

from pydantic import BaseModel, Field


class WeatherRecordBase(BaseModel):
    city: str | None = None
    country: str | None = None
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    temperature: float | None = None
    humidity: float | None = None
    pressure: float | None = None
    wind_speed: float | None = None
    weather_description: str | None = None
    recorded_at: datetime


class WeatherRecordCreate(WeatherRecordBase):
    pass


class WeatherRecordUpdate(BaseModel):
    city: str | None = None
    country: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    temperature: float | None = None
    humidity: float | None = None
    pressure: float | None = None
    wind_speed: float | None = None
    weather_description: str | None = None
    recorded_at: datetime | None = None


class WeatherRecordResponse(WeatherRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GeocodingResult(BaseModel):
    name: str
    latitude: float
    longitude: float
    country: str | None = None
    country_code: str | None = None
    admin1: str | None = None


class GeocodingResponse(BaseModel):
    results: list[GeocodingResult]
