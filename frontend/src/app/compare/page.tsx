"use client";

import { useState } from "react";
import { WeatherRecord, GeocodingResult } from "@/types/weather";
import { fetchCurrentWeatherByCoords, searchCities } from "@/services/api";

function CitySearch({
  label,
  onResult,
}: {
  label: string;
  onResult: (record: WeatherRecord, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
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
    try {
      const record = await fetchCurrentWeatherByCoords(city.latitude, city.longitude);
      onResult(record, `${city.name}${city.country ? `, ${city.country}` : ""}`);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">{label}</div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search city..."
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        {loading && (
          <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        )}
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelect(s)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-gray-400">{s.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherCard({ record, name }: { record: WeatherRecord; name: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{name}</h3>
      <div className="mb-2 text-4xl font-bold text-gray-900">
        {record.temperature != null ? `${record.temperature}°C` : "—"}
      </div>
      <div className="mb-4 text-sm text-gray-500">{record.weather_description}</div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Humidity</span>
          <span className="font-medium">{record.humidity != null ? `${record.humidity}%` : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Pressure</span>
          <span className="font-medium">{record.pressure != null ? `${record.pressure} hPa` : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Wind</span>
          <span className="font-medium">{record.wind_speed != null ? `${record.wind_speed} km/h` : "—"}</span>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [left, setLeft] = useState<{ record: WeatherRecord; name: string } | null>(null);
  const [right, setRight] = useState<{ record: WeatherRecord; name: string } | null>(null);

  const diff =
    left?.record.temperature != null && right?.record.temperature != null
      ? left.record.temperature - right.record.temperature
      : null;

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Compare Weather</h1>
        <p className="mb-8 text-sm text-gray-500">Pick two cities to compare side by side</p>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CitySearch label="City A" onResult={(r, n) => setLeft({ record: r, name: n })} />
          <CitySearch label="City B" onResult={(r, n) => setRight({ record: r, name: n })} />
        </div>

        {diff !== null && (
          <div className="mb-6 rounded-xl bg-gray-900 p-4 text-center text-white">
            <span className="text-sm text-gray-400">Temperature difference: </span>
            <span className="text-lg font-bold">
              {diff > 0 ? "+" : ""}{diff.toFixed(1)}°C
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {left ? (
            <WeatherCard record={left.record} name={left.name} />
          ) : (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-12 text-sm text-gray-400">
              Select City A
            </div>
          )}
          {right ? (
            <WeatherCard record={right.record} name={right.name} />
          ) : (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-12 text-sm text-gray-400">
              Select City B
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
