"use client";

import { WeatherRecord } from "@/types/weather";

interface WeatherDisplayProps {
  weather: WeatherRecord;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-white shadow-xl">
      <div className="text-center mb-6">
        {weather.city && (
          <h2 className="text-2xl font-bold">
            {weather.city}
            {weather.country && `, ${weather.country}`}
          </h2>
        )}
        <p className="text-sm opacity-80">
          {weather.latitude.toFixed(2)}, {weather.longitude.toFixed(2)}
        </p>
      </div>

      <div className="text-center mb-8">
        <p className="text-7xl font-light">
          {weather.temperature !== null ? `${weather.temperature}°` : "N/A"}
        </p>
        {weather.weather_description && (
          <p className="text-xl mt-2 opacity-90">{weather.weather_description}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm opacity-70">Humidity</p>
          <p className="text-lg font-semibold">
            {weather.humidity !== null ? `${weather.humidity}%` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm opacity-70">Pressure</p>
          <p className="text-lg font-semibold">
            {weather.pressure !== null ? `${weather.pressure} hPa` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm opacity-70">Wind</p>
          <p className="text-lg font-semibold">
            {weather.wind_speed !== null ? `${weather.wind_speed} km/h` : "N/A"}
          </p>
        </div>
      </div>

      <p className="text-xs text-center mt-6 opacity-60">
        Recorded at {new Date(weather.recorded_at).toLocaleString()}
      </p>
    </div>
  );
}
