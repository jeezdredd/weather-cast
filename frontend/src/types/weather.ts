export interface WeatherRecord {
  id: number;
  city: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  wind_speed: number | null;
  weather_description: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string | null;
  country_code: string | null;
  admin1: string | null;
}

export interface WeatherFormData {
  mode: "coordinates" | "city";
  latitude: string;
  longitude: string;
  city: string;
  country: string;
}

export interface ValidationErrors {
  latitude?: string;
  longitude?: string;
  city?: string;
}

export interface ServiceHealth {
  status: string;
  latency_ms?: number | null;
}

export interface SystemStatus {
  uptime_seconds: number;
  services: {
    database: ServiceHealth;
    open_meteo_weather: ServiceHealth;
    open_meteo_geocoding: ServiceHealth;
    scheduler: ServiceHealth;
  };
}

export interface SchedulerJob {
  id: string;
  name: string;
  next_run_time: string | null;
  trigger: string | null;
}

export interface SchedulerInfo {
  running: boolean;
  jobs: SchedulerJob[];
}

export interface RecordsStats {
  total_records: number;
  distinct_cities: number;
  latest_record: string | null;
}

export interface ForecastDay {
  date: string;
  temperature_max: number;
  temperature_min: number;
  weather_code: number;
  weather_description: string;
  precipitation_sum: number;
  wind_speed_max: number;
}

export interface ProfilerRequest {
  method: string;
  path: string;
  status_code: number;
  duration_ms: number;
  timestamp: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
}

export interface DBTableRows {
  table: string;
  columns: string[];
  rows: Record<string, unknown>[];
  count: number;
}

export interface FavoriteCity {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}
