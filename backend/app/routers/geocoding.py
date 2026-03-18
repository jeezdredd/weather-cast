from fastapi import APIRouter, Query

from app.schemas import GeocodingResponse
from app.services import geocoding_service

router = APIRouter(prefix="/geocoding", tags=["geocoding"])


@router.get("/search", response_model=GeocodingResponse)
async def search_cities(
    name: str = Query(min_length=1),
    count: int = Query(default=10, ge=1, le=20),
):
    results = await geocoding_service.search_cities(name, count)
    return GeocodingResponse(results=results)
