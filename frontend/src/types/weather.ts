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
