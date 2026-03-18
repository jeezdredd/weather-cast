"use client";

import { useEffect, useRef, useState } from "react";
import { LogEntry } from "@/types/weather";
import { API_BASE, getLogs } from "@/services/api";

const LEVEL_COLORS: Record<string, string> = {
  DEBUG: "text-gray-400",
  INFO: "text-blue-500",
  WARNING: "text-yellow-500",
  ERROR: "text-red-500",
  CRITICAL: "text-red-700 font-bold",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    getLogs().then(setLogs).catch(() => {});
  }, []);

  useEffect(() => {
    const wsUrl = API_BASE.replace(/^http/, "ws") + "/system/logs/ws";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      if (paused) return;
      const entry: LogEntry = JSON.parse(event.data);
      setLogs((prev) => [...prev.slice(-499), entry]);
    };

    return () => ws.close();
  }, [paused]);

  useEffect(() => {
    if (!paused) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, paused]);

  const handleClear = () => setLogs([]);

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Logs Viewer</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              {connected ? "Connected via WebSocket" : "Disconnected"}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaused(!paused)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                paused
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-12rem)] overflow-y-auto rounded-xl bg-gray-900 p-4 font-mono text-xs shadow-sm">
          {logs.length === 0 && (
            <div className="text-gray-500">Waiting for logs...</div>
          )}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 py-0.5 hover:bg-white/5">
              <span className="flex-shrink-0 text-gray-600">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`w-16 flex-shrink-0 ${LEVEL_COLORS[log.level] || "text-gray-400"}`}>
                {log.level}
              </span>
              <span className="flex-shrink-0 text-gray-500">{log.logger}</span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
