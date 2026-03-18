import axios from "axios";
import { GeocodingResult, WeatherRecord } from "@/types/weather";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

export async function fetchCurrentWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherRecord> {
  const response = await api.get("/weather/current", {
    params: { lat, lon },
  });
  return response.data;
}

export async function fetchCurrentWeatherByCity(
  city: string,
  country?: string
): Promise<WeatherRecord> {
  const params: Record<string, string> = { city };
  if (country) params.country = country;
  const response = await api.get("/weather/current", { params });
  return response.data;
}

export async function searchCities(
  name: string,
  count: number = 10
): Promise<GeocodingResult[]> {
  const response = await api.get("/geocoding/search", {
    params: { name, count },
  });
  return response.data.results;
}

export async function getWeatherRecords(): Promise<WeatherRecord[]> {
  const response = await api.get("/weather/records");
  return response.data;
}

export async function getWeatherRecord(id: number): Promise<WeatherRecord> {
  const response = await api.get(`/weather/records/${id}`);
  return response.data;
}
