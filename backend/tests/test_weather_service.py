from datetime import UTC, datetime

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import WeatherRecord
from app.schemas import WeatherRecordCreate, WeatherRecordUpdate
from app.services import weather_service


class TestFetchCurrentWeather:
    @pytest.mark.asyncio
    async def test_fetch_current_weather(self, mock_httpx_get):
        result = await weather_service.fetch_current_weather(52.52, 13.405)
        assert result["temperature"] == 15.5
        assert result["humidity"] == 65
        assert result["pressure"] == 1013.25
        assert result["wind_speed"] == 12.3
        assert result["weather_description"] == "Mainly clear"


class TestCRUD:
    @pytest.mark.asyncio
    async def test_create_and_get_record(self, session: AsyncSession):
        data = WeatherRecordCreate(
            latitude=52.52,
            longitude=13.405,
            city="Berlin",
            country="Germany",
            temperature=15.5,
            recorded_at=datetime.now(UTC),
        )
        record = await weather_service.create_record(session, data)
        assert record.id is not None
        assert record.city == "Berlin"

        fetched = await weather_service.get_record_by_id(session, record.id)
        assert fetched is not None
        assert fetched.city == "Berlin"

    @pytest.mark.asyncio
    async def test_get_records_with_filter(self, session: AsyncSession):
        now = datetime.now(UTC)
        for city in ["Berlin", "Paris", "Berlin"]:
            data = WeatherRecordCreate(
                latitude=52.52, longitude=13.405, city=city, recorded_at=now
            )
            await weather_service.create_record(session, data)

        records = await weather_service.get_records(session, city="Berlin")
        assert len(records) == 2

    @pytest.mark.asyncio
    async def test_update_record(self, session: AsyncSession):
        data = WeatherRecordCreate(
            latitude=52.52,
            longitude=13.405,
            temperature=15.0,
            recorded_at=datetime.now(UTC),
        )
        record = await weather_service.create_record(session, data)

        update = WeatherRecordUpdate(temperature=20.0)
        updated = await weather_service.update_record(session, record, update)
        assert updated.temperature == 20.0

    @pytest.mark.asyncio
    async def test_delete_record(self, session: AsyncSession):
        data = WeatherRecordCreate(
            latitude=52.52,
            longitude=13.405,
            recorded_at=datetime.now(UTC),
        )
        record = await weather_service.create_record(session, data)
        record_id = record.id

        await weather_service.delete_record(session, record)
        fetched = await weather_service.get_record_by_id(session, record_id)
        assert fetched is None

    @pytest.mark.asyncio
    async def test_get_distinct_coordinates(self, session: AsyncSession):
        now = datetime.now(UTC)
        session.add(WeatherRecord(latitude=52.52, longitude=13.405, city="Berlin", recorded_at=now))
        session.add(WeatherRecord(latitude=52.52, longitude=13.405, city="Berlin", recorded_at=now))
        session.add(WeatherRecord(latitude=48.85, longitude=2.35, city="Paris", recorded_at=now))
        await session.commit()

        coords = await weather_service.get_distinct_coordinates(session)
        assert len(coords) >= 2
