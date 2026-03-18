"use client";

import { useEffect, useState } from "react";
import { SchedulerInfo } from "@/types/weather";
import { getSchedulerInfo } from "@/services/api";

function TimeUntil({ isoDate }: { isoDate: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(isoDate).getTime() - Date.now();
      if (diff <= 0) {
        setText("now");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setText(`${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isoDate]);

  return <span className="font-mono">{text}</span>;
}

export default function SchedulerPage() {
  const [info, setInfo] = useState<SchedulerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      setInfo(await getSchedulerInfo());
    } catch {
      setError("Failed to fetch scheduler info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scheduler Monitor</h1>
            <p className="mt-1 text-sm text-gray-500">APScheduler background jobs</p>
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
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {info && (
          <>
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm">
              <div
                className={`h-3 w-3 rounded-full ${
                  info.running ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span className="text-lg font-semibold text-gray-900">
                Scheduler is {info.running ? "running" : "stopped"}
              </span>
            </div>

            <div className="space-y-4">
              {info.jobs.length === 0 && (
                <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                  No scheduled jobs
                </div>
              )}

              {info.jobs.map((job) => (
                <div key={job.id} className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{job.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{job.id}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">TRIGGER</div>
                      <div className="text-sm text-gray-900 font-mono">{job.trigger || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">NEXT RUN</div>
                      {job.next_run_time ? (
                        <div className="text-sm text-gray-900">
                          <TimeUntil isoDate={job.next_run_time} />
                          <div className="text-xs text-gray-400 mt-0.5">
                            {new Date(job.next_run_time).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">—</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
