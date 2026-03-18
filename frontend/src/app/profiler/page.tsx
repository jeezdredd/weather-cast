"use client";

import { useEffect, useState } from "react";
import { ProfilerRequest } from "@/types/weather";
import { getProfilerData, clearProfilerData } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProfilerPage() {
  const [requests, setRequests] = useState<ProfilerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      setRequests(await getProfilerData());
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    await clearProfilerData();
    setRequests([]);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const avgMs = requests.length > 0
    ? (requests.reduce((s, r) => s + r.duration_ms, 0) / requests.length).toFixed(1)
    : "0";
  const maxMs = requests.length > 0
    ? Math.max(...requests.map((r) => r.duration_ms)).toFixed(1)
    : "0";

  const chartData = requests.slice(-50).map((r, i) => ({
    index: i,
    duration: r.duration_ms,
    label: `${r.method} ${r.path}`,
  }));

  const statusGroups: Record<string, number> = {};
  requests.forEach((r) => {
    const group = `${Math.floor(r.status_code / 100)}xx`;
    statusGroups[group] = (statusGroups[group] || 0) + 1;
  });

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Profiler</h1>
            <p className="mt-1 text-sm text-gray-500">
              {requests.length} requests captured (auto-refresh 5s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
            <div className="text-xs text-gray-500">Total Requests</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{avgMs}ms</div>
            <div className="text-xs text-gray-500">Avg Duration</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{maxMs}ms</div>
            <div className="text-xs text-gray-500">Max Duration</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            {Object.entries(statusGroups).map(([group, count]) => (
              <span key={group} className="mr-2 text-sm">
                <span className={`font-bold ${group === "2xx" ? "text-green-600" : group === "4xx" ? "text-yellow-600" : "text-red-600"}`}>
                  {count}
                </span>
                <span className="text-gray-400"> {group}</span>
              </span>
            ))}
            <div className="text-xs text-gray-500 mt-1">Status Codes</div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-medium text-gray-500">RESPONSE TIME (ms)</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="index" tick={false} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                        <div>{d.label}</div>
                        <div className="font-bold">{d.duration}ms</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="duration" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {requests.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Path</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[...requests].reverse().slice(0, 50).map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2">
                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          r.method === "GET" ? "bg-blue-100 text-blue-700" :
                          r.method === "POST" ? "bg-green-100 text-green-700" :
                          r.method === "DELETE" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {r.method}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">{r.path}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs font-medium ${
                          r.status_code < 300 ? "text-green-600" :
                          r.status_code < 400 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {r.status_code}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">{r.duration_ms}ms</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{r.timestamp}</td>
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
