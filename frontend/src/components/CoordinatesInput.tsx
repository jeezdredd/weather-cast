"use client";

import { ValidationErrors } from "@/types/weather";

interface CoordinatesInputProps {
  latitude: string;
  longitude: string;
  errors: ValidationErrors;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

export default function CoordinatesInput({
  latitude,
  longitude,
  errors,
  onLatitudeChange,
  onLongitudeChange,
}: CoordinatesInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
          Latitude
        </label>
        <input
          id="latitude"
          type="text"
          value={latitude}
          onChange={(e) => onLatitudeChange(e.target.value)}
          placeholder="-90 to 90"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.latitude && (
          <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
        )}
      </div>
      <div>
        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
          Longitude
        </label>
        <input
          id="longitude"
          type="text"
          value={longitude}
          onChange={(e) => onLongitudeChange(e.target.value)}
          placeholder="-180 to 180"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.longitude && (
          <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
        )}
      </div>
    </div>
  );
}
