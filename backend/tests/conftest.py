from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.database import Base, get_session
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
test_async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def session() -> AsyncGenerator[AsyncSession, None]:
    async with test_async_session() as session:
        yield session


@pytest.fixture
async def client(session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session

    with patch("app.main.start_scheduler"), patch("app.main.stop_scheduler"):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac

    app.dependency_overrides.clear()


@pytest.fixture
def mock_weather_response():
    return {
        "current": {
            "temperature_2m": 15.5,
            "relative_humidity_2m": 65,
            "surface_pressure": 1013.25,
            "wind_speed_10m": 12.3,
            "weather_code": 1,
        }
    }


@pytest.fixture
def mock_geocoding_response():
    return {
        "results": [
            {
                "name": "Berlin",
                "latitude": 52.52,
                "longitude": 13.405,
                "country": "Germany",
                "country_code": "DE",
                "admin1": "Berlin",
            }
        ]
    }


@pytest.fixture
def mock_httpx_get(mock_weather_response):
    mock_response = MagicMock()
    mock_response.json.return_value = mock_weather_response
    mock_response.raise_for_status.return_value = None
    mock_response.status_code = 200

    with patch("app.services.weather_service.httpx.AsyncClient") as mock_client_cls:
        mock_client_instance = AsyncMock()
        mock_client_instance.get.return_value = mock_response
        mock_client_cls.return_value.__aenter__ = AsyncMock(return_value=mock_client_instance)
        mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=False)
        yield mock_client_instance.get
