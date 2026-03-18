"use client";

import { useEffect, useRef, useState } from "react";
import { SystemStatus, RecordsStats } from "@/types/weather";
import { getSystemStatus, getRecordsStats } from "@/services/api";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

function LiveUptime({ baseSeconds }: { baseSeconds: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [baseSeconds]);

  return (
    <span className="font-mono tabular-nums">{formatUptime(baseSeconds + elapsed)}</span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isOk = status === "ok" || status === "running";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOk ? "bg-green-500" : "bg-red-500"}`} />
      {status.toUpperCase()}
    </span>
  );
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [stats, setStats] = useState<RecordsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [pageLoadMs, setPageLoadMs] = useState<number | null>(null);
  const [fetchMs, setFetchMs] = useState<number | null>(null);
  const pageLoadStart = useRef(Date.now());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const t0 = performance.now();
    try {
      const [statusData, statsData] = await Promise.all([
        getSystemStatus(),
        getRecordsStats(),
      ]);
      setFetchMs(Math.round(performance.now() - t0));
      setStatus(statusData);
      setStats(statsData);
      setLastRefresh(new Date());
    } catch {
      setError("Failed to fetch system status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().then(() => {
      setPageLoadMs(Date.now() - pageLoadStart.current);
    });
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const memoryMb = typeof window !== "undefined" && (performance as unknown as Record<string, unknown>).memory
    ? Math.round(((performance as unknown as Record<string, { usedJSHeapSize: number }>).memory.usedJSHeapSize) / 1048576)
    : null;

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
            <p className="mt-1 text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()} (auto-refresh 15s)
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {status && (
          <>
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-medium text-gray-500">SERVER</div>
              <div className="text-3xl font-bold text-gray-900">
                <LiveUptime baseSeconds={status.uptime_seconds} />
              </div>
              <div className="mt-1 text-sm text-gray-500">uptime (live)</div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {pageLoadMs != null ? `${pageLoadMs}ms` : "..."}
                </div>
                <div className="text-xs text-gray-500">Page Load</div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {fetchMs != null ? `${fetchMs}ms` : "..."}
                </div>
                <div className="text-xs text-gray-500">API Fetch</div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {status.services.open_meteo_weather.latency_ms != null
                    ? `${status.services.open_meteo_weather.latency_ms}ms`
                    : "—"}
                </div>
                <div className="text-xs text-gray-500">Open-Meteo Latency</div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {memoryMb != null ? `${memoryMb}MB` : "N/A"}
                </div>
                <div className="text-xs text-gray-500">JS Heap</div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(status.services).map(([name, service]) => (
                <div key={name} className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <StatusBadge status={service.status} />
                  </div>
                  {service.latency_ms != null && (
                    <div className="text-xs text-gray-500">
                      Latency: <span className="font-mono">{service.latency_ms}ms</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {stats && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-medium text-gray-500">DATABASE</div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total_records}</div>
                <div className="text-sm text-gray-500">Total Records</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.distinct_cities}</div>
                <div className="text-sm text-gray-500">Distinct Cities</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {stats.latest_record
                    ? new Date(stats.latest_record).toLocaleString()
                    : "—"}
                </div>
                <div className="text-sm text-gray-500">Latest Record</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
