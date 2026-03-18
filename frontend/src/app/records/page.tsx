"use client";

import { useEffect, useState } from "react";
import { WeatherRecord } from "@/types/weather";
import { getWeatherRecords, deleteWeatherRecord } from "@/services/api";
import toast from "react-hot-toast";

export default function RecordsPage() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      setRecords(await getWeatherRecords());
    } catch {
      setError("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWeatherRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Record deleted");
    } catch {
      toast.error("Failed to delete record");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weather Records</h1>
            <p className="mt-1 text-sm text-gray-500">{records.length} records stored</p>
          </div>
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && records.length === 0 && !error && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">No weather records yet. Search for weather to create one.</p>
          </div>
        )}

        {records.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Temp</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Humidity</th>
                    <th className="px-4 py-3">Wind</th>
                    <th className="px-4 py-3">Recorded</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {r.city || `${r.latitude.toFixed(2)}, ${r.longitude.toFixed(2)}`}
                        </div>
                        {r.country && (
                          <div className="text-xs text-gray-400">{r.country}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {r.temperature != null ? `${r.temperature}°C` : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.weather_description || "—"}
                      </td>
                      <td className="px-4 py-3">{r.humidity != null ? `${r.humidity}%` : "—"}</td>
                      <td className="px-4 py-3">
                        {r.wind_speed != null ? `${r.wind_speed} km/h` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(r.recorded_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="rounded px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
