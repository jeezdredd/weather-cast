"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { className?: string };

function WeatherIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function ForecastIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M2.25 18.75V7.5a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v11.25m-19.5 0a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25m-19.5 0h19.5" />
    </svg>
  );
}

function CompareIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

function HistoryIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function StatusIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function SchedulerIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RecordsIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
}

function SwaggerIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}

function LogsIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ExplorerIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
    </svg>
  );
}

function ProfilerIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  );
}

function LicenseIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Weather", Icon: WeatherIcon },
  { href: "/forecast", label: "5-Day Forecast", Icon: ForecastIcon },
  { href: "/compare", label: "Compare", Icon: CompareIcon },
  { href: "/history", label: "History", Icon: HistoryIcon },
  { href: "/records", label: "Records", Icon: RecordsIcon },
];

const MONITOR_ITEMS = [
  { href: "/status", label: "System Status", Icon: StatusIcon },
  { href: "/scheduler", label: "Scheduler", Icon: SchedulerIcon },
  { href: "/logs", label: "Logs", Icon: LogsIcon },
  { href: "/profiler", label: "Profiler", Icon: ProfilerIcon },
  { href: "/explorer", label: "DB Explorer", Icon: ExplorerIcon },
];

const INFO_ITEMS = [
  { href: "/licenses", label: "Licenses & Attribution", Icon: LicenseIcon },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EXTERNAL_ITEMS = [
  {
    href: `${API_BASE}/docs`,
    label: "API Docs (Swagger)",
    Icon: SwaggerIcon,
  },
];

interface NavLinkProps {
  href: string;
  label: string;
  Icon: React.ComponentType<IconProps>;
  active: boolean;
  index: number;
  mounted: boolean;
  onClick: () => void;
}

function NavLink({ href, label, Icon, active, index, mounted, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
          : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-1"
      }`}
      style={{
        transitionDelay: mounted ? `${index * 40}ms` : "0ms",
        opacity: mounted ? 1 : 0,
        transform: mounted ? undefined : "translateX(-8px)",
      }}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {label}
    </Link>
  );
}

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => setOpen(false), 300);
  };

  let idx = 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95"
        aria-label="Open menu"
      >
        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          <nav
            className={`relative z-10 flex h-full w-72 flex-col bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-out ${
              mounted ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
              <span className="text-lg font-semibold">Weather Cast</span>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-800 hover:rotate-90"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Weather
              </div>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  index={idx++}
                  mounted={mounted}
                  onClick={handleClose}
                />
              ))}

              <div className="mb-2 mt-5 px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Monitoring
              </div>
              {MONITOR_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  index={idx++}
                  mounted={mounted}
                  onClick={handleClose}
                />
              ))}

              <div className="mb-2 mt-5 px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Info
              </div>
              {INFO_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  index={idx++}
                  mounted={mounted}
                  onClick={handleClose}
                />
              ))}

              <div className="mb-2 mt-5 px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                External
              </div>
              {EXTERNAL_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-800 hover:text-white hover:translate-x-1"
                  style={{
                    transitionDelay: mounted ? `${idx++ * 40}ms` : "0ms",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? undefined : "translateX(-8px)",
                  }}
                >
                  <item.Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                  <svg className="ml-auto h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              ))}
            </div>

            <div className="border-t border-gray-700 px-6 py-4 text-xs text-gray-500">
              Weather Cast v1.0.0
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
