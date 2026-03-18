"use client";

const SERVICES = [
  {
    name: "Open-Meteo",
    url: "https://open-meteo.com",
    purpose: "Weather data and geocoding",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    note: "Free for non-commercial use. No API key required. Attribution required.",
  },
  {
    name: "Render",
    url: "https://render.com",
    purpose: "Cloud hosting (backend, frontend, database)",
    license: "Free Tier",
    licenseUrl: "https://render.com/docs/free",
    note: "Services sleep after 15 min of inactivity. PostgreSQL free tier expires after 90 days.",
  },
];

const TECHNOLOGIES = [
  {
    category: "Frontend",
    items: [
      { name: "Next.js 15", license: "MIT", url: "https://github.com/vercel/next.js" },
      { name: "React 19", license: "MIT", url: "https://github.com/facebook/react" },
      { name: "Tailwind CSS v4", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss" },
      { name: "Zustand", license: "MIT", url: "https://github.com/pmndrs/zustand" },
      { name: "Axios", license: "MIT", url: "https://github.com/axios/axios" },
      { name: "Recharts", license: "MIT", url: "https://github.com/recharts/recharts" },
      { name: "react-hot-toast", license: "MIT", url: "https://github.com/timolins/react-hot-toast" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "FastAPI", license: "MIT", url: "https://github.com/fastapi/fastapi" },
      { name: "SQLAlchemy 2.0", license: "MIT", url: "https://github.com/sqlalchemy/sqlalchemy" },
      { name: "Pydantic v2", license: "MIT", url: "https://github.com/pydantic/pydantic" },
      { name: "Alembic", license: "MIT", url: "https://github.com/sqlalchemy/alembic" },
      { name: "httpx", license: "BSD-3", url: "https://github.com/encode/httpx" },
      { name: "APScheduler", license: "MIT", url: "https://github.com/agronholm/apscheduler" },
      { name: "asyncpg", license: "Apache-2.0", url: "https://github.com/MagicStack/asyncpg" },
      { name: "Uvicorn", license: "BSD-3", url: "https://github.com/encode/uvicorn" },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "PostgreSQL 16", license: "PostgreSQL License", url: "https://www.postgresql.org/about/licence/" },
    ],
  },
  {
    category: "Testing",
    items: [
      { name: "pytest", license: "MIT", url: "https://github.com/pytest-dev/pytest" },
      { name: "Jest", license: "MIT", url: "https://github.com/jestjs/jest" },
      { name: "React Testing Library", license: "MIT", url: "https://github.com/testing-library/react-testing-library" },
    ],
  },
];

export default function LicensesPage() {
  return (
    <div className="min-h-screen p-6 pl-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Licenses & Attribution</h1>
        <p className="mb-8 text-sm text-gray-500">
          Third-party services and open-source software used in this project
        </p>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">External Services</h2>
          <div className="space-y-4">
            {SERVICES.map((s) => (
              <div key={s.name} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {s.name}
                  </a>
                  <a
                    href={s.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    {s.license}
                  </a>
                </div>
                <div className="mb-1 text-sm text-gray-600">{s.purpose}</div>
                <div className="text-xs text-gray-400">{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Open-Source Libraries</h2>
          <div className="space-y-6">
            {TECHNOLOGIES.map((group) => (
              <div key={group.category}>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {group.category}
                </div>
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y">
                      {group.items.map((item) => (
                        <tr key={item.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2.5">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {item.name}
                            </a>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              {item.license}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-gray-50 p-5 text-xs text-gray-500">
          This project is built entirely with open-source software and free-tier services.
          All weather data is provided by Open-Meteo under CC BY 4.0 license.
          No personal data is collected or stored.
        </div>
      </div>
    </div>
  );
}
