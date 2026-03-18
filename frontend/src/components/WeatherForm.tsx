"use client";

import { useState } from "react";
import { GeocodingResult, ValidationErrors, WeatherFormData } from "@/types/weather";
import { isFormValid, validateWeatherForm } from "@/utils/validation";
import CoordinatesInput from "./CoordinatesInput";
import CityCountryInput from "./CityCountryInput";

interface WeatherFormProps {
  onSubmit: (data: WeatherFormData) => void;
  isLoading: boolean;
}

export default function WeatherForm({ onSubmit, isLoading }: WeatherFormProps) {
  const [formData, setFormData] = useState<WeatherFormData>({
    mode: "coordinates",
    latitude: "",
    longitude: "",
    city: "",
    country: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateWeatherForm(formData);
    setErrors(validationErrors);
    if (isFormValid(validationErrors)) {
      onSubmit(formData);
    }
  };

  const handleModeSwitch = (mode: "coordinates" | "city") => {
    setFormData({ ...formData, mode });
    setErrors({});
  };

  const handleCitySelect = (result: GeocodingResult) => {
    setFormData({
      ...formData,
      city: result.name,
      country: result.country || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          type="button"
          onClick={() => handleModeSwitch("coordinates")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            formData.mode === "coordinates"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Coordinates
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("city")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            formData.mode === "city"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          City
        </button>
      </div>

      {formData.mode === "coordinates" ? (
        <CoordinatesInput
          latitude={formData.latitude}
          longitude={formData.longitude}
          errors={errors}
          onLatitudeChange={(v) => setFormData({ ...formData, latitude: v })}
          onLongitudeChange={(v) => setFormData({ ...formData, longitude: v })}
        />
      ) : (
        <CityCountryInput
          city={formData.city}
          country={formData.country}
          errors={errors}
          onCityChange={(v) => setFormData({ ...formData, city: v })}
          onCountryChange={(v) => setFormData({ ...formData, country: v })}
          onCitySelect={handleCitySelect}
        />
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Loading..." : "Get Weather"}
      </button>
    </form>
  );
}
