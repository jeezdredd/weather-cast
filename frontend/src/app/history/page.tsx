"use client";

import { useEffect, useState } from "react";
import { WeatherRecord } from "@/types/weather";
import { getWeatherRecords } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HistoryPage() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await getWeatherRecords();
        setRecords(all);
        const unique = [...new Set(all.map((r) => r.city).filter(Boolean))] as string[];
        setCities(unique);
        if (unique.length > 0) setSelectedCity(unique[0]);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = records
    .filter((r) => r.city === selectedCity)
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

  const chartData = filtered.map((r) => ({
    time: new Date(r.recorded_at).toLocaleString("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: r.temperature,
    humidity: r.humidity,
    wind_speed: r.wind_speed,
  }));

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Weather History</h1>
        <p className="mb-8 text-sm text-gray-500">Temperature trends from stored records</p>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : cities.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
            No records yet. Search for weather to start building history.
          </div>
        ) : (
          <>
            <div className="mb-6">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-500"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="ml-3 text-sm text-gray-400">{filtered.length} records</span>
            </div>

            {chartData.length > 0 && (
              <div className="space-y-6">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 text-sm font-medium text-gray-500">TEMPERATURE (°C)</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 text-sm font-medium text-gray-500">HUMIDITY (%) & WIND SPEED (km/h)</div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="wind_speed" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
