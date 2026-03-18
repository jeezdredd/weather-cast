"use client";

import { useEffect, useState } from "react";
import { DBTableRows } from "@/types/weather";
import { getDBTables, getDBTableRows } from "@/services/api";

export default function ExplorerPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [data, setData] = useState<DBTableRows | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDBTables()
      .then((t) => {
        setTables(t);
        if (t.length > 0) setSelected(t[0]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    getDBTableRows(selected)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">DB Explorer</h1>
        <p className="mb-8 text-sm text-gray-500">Browse database tables</p>

        <div className="mb-6 flex items-center gap-4">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-500"
          >
            {tables.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {data && (
            <span className="text-sm text-gray-400">{data.count} rows</span>
          )}
        </div>

        {loading && <div className="text-gray-500">Loading...</div>}

        {data && data.rows.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500">
                  <tr>
                    {data.columns.map((col) => (
                      <th key={col} className="px-3 py-2.5 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {data.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      {data.columns.map((col) => (
                        <td key={col} className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate">
                          {row[col] != null ? String(row[col]) : <span className="text-gray-300">NULL</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data && data.rows.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
            Table is empty
          </div>
        )}
      </div>
    </div>
  );
}
