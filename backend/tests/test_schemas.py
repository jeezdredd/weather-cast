from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from app.schemas import WeatherRecordCreate, WeatherRecordUpdate


class TestWeatherRecordCreate:
    def test_valid_record(self):
        record = WeatherRecordCreate(
            latitude=52.52,
            longitude=13.405,
            city="Berlin",
            country="Germany",
            recorded_at=datetime.now(UTC),
        )
        assert record.latitude == 52.52
        assert record.longitude == 13.405

    def test_latitude_out_of_range(self):
        with pytest.raises(ValidationError):
            WeatherRecordCreate(
                latitude=91.0,
                longitude=13.405,
                recorded_at=datetime.now(UTC),
            )

    def test_latitude_negative_out_of_range(self):
        with pytest.raises(ValidationError):
            WeatherRecordCreate(
                latitude=-91.0,
                longitude=13.405,
                recorded_at=datetime.now(UTC),
            )

    def test_longitude_out_of_range(self):
        with pytest.raises(ValidationError):
            WeatherRecordCreate(
                latitude=52.52,
                longitude=181.0,
                recorded_at=datetime.now(UTC),
            )

    def test_longitude_negative_out_of_range(self):
        with pytest.raises(ValidationError):
            WeatherRecordCreate(
                latitude=52.52,
                longitude=-181.0,
                recorded_at=datetime.now(UTC),
            )

    def test_boundary_values(self):
        record = WeatherRecordCreate(
            latitude=90.0,
            longitude=180.0,
            recorded_at=datetime.now(UTC),
        )
        assert record.latitude == 90.0
        assert record.longitude == 180.0

    def test_negative_boundary_values(self):
        record = WeatherRecordCreate(
            latitude=-90.0,
            longitude=-180.0,
            recorded_at=datetime.now(UTC),
        )
        assert record.latitude == -90.0
        assert record.longitude == -180.0


class TestWeatherRecordUpdate:
    def test_partial_update(self):
        update = WeatherRecordUpdate(temperature=20.0)
        data = update.model_dump(exclude_unset=True)
        assert data == {"temperature": 20.0}

    def test_empty_update(self):
        update = WeatherRecordUpdate()
        data = update.model_dump(exclude_unset=True)
        assert data == {}

    def test_latitude_validation_on_update(self):
        with pytest.raises(ValidationError):
            WeatherRecordUpdate(latitude=100.0)
