import { ValidationErrors, WeatherFormData } from "@/types/weather";

export function validateLatitude(value: string): string | undefined {
  if (!value.trim()) return "Latitude is required";
  const num = Number(value);
  if (isNaN(num)) return "Latitude must be a number";
  if (num < -90 || num > 90) return "Latitude must be between -90 and 90";
  return undefined;
}

export function validateLongitude(value: string): string | undefined {
  if (!value.trim()) return "Longitude is required";
  const num = Number(value);
  if (isNaN(num)) return "Longitude must be a number";
  if (num < -180 || num > 180) return "Longitude must be between -180 and 180";
  return undefined;
}

export function validateCity(value: string): string | undefined {
  if (!value.trim()) return "City name is required";
  return undefined;
}

export function validateWeatherForm(data: WeatherFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.mode === "coordinates") {
    errors.latitude = validateLatitude(data.latitude);
    errors.longitude = validateLongitude(data.longitude);
  } else {
    errors.city = validateCity(data.city);
  }

  return errors;
}

export function isFormValid(errors: ValidationErrors): boolean {
  return !errors.latitude && !errors.longitude && !errors.city;
}
