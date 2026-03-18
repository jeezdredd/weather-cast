import axios from "axios";
import {
  DBTableRows,
  ForecastDay,
  GeocodingResult,
  LogEntry,
  ProfilerRequest,
  RecordsStats,
  SchedulerInfo,
  SystemStatus,
  WeatherRecord,
} from "@/types/weather";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_BASE });

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

export async function getWeatherRecords(city?: string): Promise<WeatherRecord[]> {
  const response = await api.get("/weather/records", {
    params: city ? { city, limit: 100 } : { limit: 100 },
  });
  return response.data;
}

export async function getWeatherRecord(id: number): Promise<WeatherRecord> {
  const response = await api.get(`/weather/records/${id}`);
  return response.data;
}

export async function deleteWeatherRecord(id: number): Promise<void> {
  await api.delete(`/weather/records/${id}`);
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const response = await api.get("/system/status");
  return response.data;
}

export async function getSchedulerInfo(): Promise<SchedulerInfo> {
  const response = await api.get("/system/scheduler");
  return response.data;
}

export async function getRecordsStats(): Promise<RecordsStats> {
  const response = await api.get("/system/records/stats");
  return response.data;
}

export async function getForecast(
  params: { lat: number; lon: number } | { city: string; country?: string },
  days: number = 5
): Promise<ForecastDay[]> {
  const response = await api.get("/weather/forecast", {
    params: { ...params, days },
  });
  return response.data;
}

export async function getProfilerData(): Promise<ProfilerRequest[]> {
  const response = await api.get("/system/profiler");
  return response.data.requests;
}

export async function clearProfilerData(): Promise<void> {
  await api.delete("/system/profiler");
}

export async function getLogs(): Promise<LogEntry[]> {
  const response = await api.get("/system/logs");
  return response.data.logs;
}

export async function getDBTables(): Promise<string[]> {
  const response = await api.get("/system/db/tables");
  return response.data.tables;
}

export async function getDBTableRows(
  table: string,
  limit: number = 50
): Promise<DBTableRows> {
  const response = await api.get(`/system/db/tables/${table}`, {
    params: { limit },
  });
  return response.data;
}

export async function getCountryAverage(
  country: string
): Promise<{ country: string; average_temperature: number; sample_cities: number }> {
  const response = await api.get("/weather/country-average", {
    params: { country },
  });
  return response.data;
}
