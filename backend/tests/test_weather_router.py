from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import AsyncClient


class TestGetCurrentWeather:
    @pytest.mark.asyncio
    async def test_by_coordinates(self, client: AsyncClient, mock_httpx_get):
        response = await client.get("/weather/current", params={"lat": 52.52, "lon": 13.405})
        assert response.status_code == 200
        data = response.json()
        assert data["temperature"] == 15.5
        assert data["latitude"] == 52.52
        assert data["id"] is not None

    @pytest.mark.asyncio
    async def test_by_city(self, client: AsyncClient, mock_httpx_get):
        with patch(
            "app.services.geocoding_service.geocode_city",
            new_callable=AsyncMock,
            return_value=(52.52, 13.405),
        ):
            response = await client.get("/weather/current", params={"city": "Berlin"})
        assert response.status_code == 200
        data = response.json()
        assert data["temperature"] == 15.5

    @pytest.mark.asyncio
    async def test_missing_params(self, client: AsyncClient):
        response = await client.get("/weather/current")
        assert response.status_code == 400


class TestRecordsCRUD:
    @pytest.mark.asyncio
    async def test_create_and_list(self, client: AsyncClient):
        payload = {
            "latitude": 52.52,
            "longitude": 13.405,
            "city": "Berlin",
            "temperature": 15.5,
            "recorded_at": datetime.now(UTC).isoformat(),
        }
        create_resp = await client.post("/weather/records", json=payload)
        assert create_resp.status_code == 201
        record_id = create_resp.json()["id"]

        list_resp = await client.get("/weather/records")
        assert list_resp.status_code == 200
        assert len(list_resp.json()) == 1

        get_resp = await client.get(f"/weather/records/{record_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["city"] == "Berlin"

    @pytest.mark.asyncio
    async def test_update_record(self, client: AsyncClient):
        payload = {
            "latitude": 52.52,
            "longitude": 13.405,
            "temperature": 15.0,
            "recorded_at": datetime.now(UTC).isoformat(),
        }
        create_resp = await client.post("/weather/records", json=payload)
        record_id = create_resp.json()["id"]

        update_resp = await client.put(
            f"/weather/records/{record_id}", json={"temperature": 20.0}
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["temperature"] == 20.0

    @pytest.mark.asyncio
    async def test_delete_record(self, client: AsyncClient):
        payload = {
            "latitude": 52.52,
            "longitude": 13.405,
            "recorded_at": datetime.now(UTC).isoformat(),
        }
        create_resp = await client.post("/weather/records", json=payload)
        record_id = create_resp.json()["id"]

        delete_resp = await client.delete(f"/weather/records/{record_id}")
        assert delete_resp.status_code == 204

        get_resp = await client.get(f"/weather/records/{record_id}")
        assert get_resp.status_code == 404

    @pytest.mark.asyncio
    async def test_get_nonexistent_record(self, client: AsyncClient):
        response = await client.get("/weather/records/999")
        assert response.status_code == 404
