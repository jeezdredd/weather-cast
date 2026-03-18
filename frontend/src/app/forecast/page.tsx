"use client";

import { useState } from "react";
import { ForecastDay, GeocodingResult } from "@/types/weather";
import { getForecast, searchCities } from "@/services/api";

export default function ForecastPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSuggestions(await searchCities(value, 5));
      } catch {
        setSuggestions([]);
      }
    }, 300);
    setDebounceTimer(timer);
  };

  const handleSelect = async (city: GeocodingResult) => {
    setQuery(city.name);
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setLocation(`${city.name}${city.country ? `, ${city.country}` : ""}`);
    try {
      setForecast(await getForecast({ lat: city.latitude, lon: city.longitude }));
    } catch {
      setError("Failed to fetch forecast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">5-Day Forecast</h1>
        <p className="mb-8 text-sm text-gray-500">Search for a city to see the forecast</p>

        <div className="relative mb-8 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search city..."
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-gray-400">{s.admin1 ? `${s.admin1}, ` : ""}{s.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="text-center text-gray-500">Loading forecast...</div>
        )}

        {forecast.length > 0 && (
          <>
            <div className="mb-4 text-sm font-medium text-gray-500">{location}</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              {forecast.map((day) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString("en", { weekday: "short" });
                const dateStr = date.toLocaleDateString("en", { month: "short", day: "numeric" });
                return (
                  <div key={day.date} className="rounded-xl bg-white p-5 shadow-sm text-center">
                    <div className="text-sm font-semibold text-gray-900">{dayName}</div>
                    <div className="text-xs text-gray-400 mb-3">{dateStr}</div>
                    <div className="mb-1 text-lg font-bold text-gray-900">
                      {day.temperature_max !== null ? Math.round(day.temperature_max) : "—"}°
                    </div>
                    <div className="mb-3 text-sm text-gray-400">
                      {day.temperature_min !== null ? Math.round(day.temperature_min) : "—"}°
                    </div>
                    <div className="mb-2 text-xs text-gray-600">{day.weather_description}</div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>Precip: {day.precipitation_sum}mm</div>
                      <div>Wind: {day.wind_speed_max} km/h</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
