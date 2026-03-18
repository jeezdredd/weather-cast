"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import WeatherForm from "@/components/WeatherForm";
import Favorites from "@/components/Favorites";
import { fetchCurrentWeatherByCity, fetchCurrentWeatherByCoords, getCountryAverage } from "@/services/api";
import { useWeatherStore } from "@/store/weatherStore";
import { FavoriteCity, WeatherFormData } from "@/types/weather";

function useLiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function formatUtcOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const h = Math.floor(Math.abs(offset) / 60);
  const m = Math.abs(offset) % 60;
  return `UTC ${sign}${h}${m > 0 ? `:${String(m).padStart(2, "0")}` : ""}`;
}

function countryToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

const COUNTRY_CODES: Record<string, string> = {
  "Russia": "RU", "United Kingdom": "GB", "France": "FR", "Germany": "DE",
  "Italy": "IT", "Spain": "ES", "Poland": "PL", "Ukraine": "UA",
  "Romania": "RO", "Netherlands": "NL", "Belgium": "BE", "Austria": "AT",
  "Czech Republic": "CZ", "Sweden": "SE", "Finland": "FI", "Norway": "NO",
  "Denmark": "DK", "Portugal": "PT", "Greece": "GR", "Hungary": "HU",
  "Serbia": "RS", "Croatia": "HR", "Bulgaria": "BG", "Switzerland": "CH",
  "Ireland": "IE", "Estonia": "EE", "Latvia": "LV", "Lithuania": "LT",
  "Belarus": "BY", "Turkey": "TR", "United States": "US", "Canada": "CA",
  "Mexico": "MX", "Colombia": "CO", "Peru": "PE", "Brazil": "BR",
  "Argentina": "AR", "Chile": "CL", "Cuba": "CU", "Venezuela": "VE",
  "Japan": "JP", "China": "CN", "India": "IN", "South Korea": "KR",
  "Thailand": "TH", "Singapore": "SG", "Indonesia": "ID", "UAE": "AE",
  "Saudi Arabia": "SA", "Iran": "IR", "Pakistan": "PK", "Bangladesh": "BD",
  "Philippines": "PH", "Malaysia": "MY", "Taiwan": "TW", "Kazakhstan": "KZ",
  "Uzbekistan": "UZ", "Georgia": "GE", "Armenia": "AM", "Azerbaijan": "AZ",
  "Australia": "AU", "New Zealand": "NZ", "Egypt": "EG", "Nigeria": "NG",
  "Kenya": "KE", "South Africa": "ZA", "Morocco": "MA", "Algeria": "DZ",
  "Tunisia": "TN",
};

function UserLocation() {
  const time = useLiveClock();
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [avgTemp, setAvgTemp] = useState<number | null>(null);
  const [loadingTemp, setLoadingTemp] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts = tz.split("/");
      const region = parts.length > 1 ? parts[0] : null;

      const tzToCountry: Record<string, string> = {
        Europe: guessEuropeanCountry(tz),
        America: guessAmericaCountry(tz),
        Asia: guessAsianCountry(tz),
        Africa: guessAfricanCountry(tz),
        Australia: "Australia",
        Pacific: "New Zealand",
      };

      const detected = region ? tzToCountry[region] || region : null;
      if (detected) {
        setCountry(detected);
        setCountryCode(COUNTRY_CODES[detected] || null);
        setLoadingTemp(true);
        getCountryAverage(detected)
          .then((data) => setAvgTemp(data.average_temperature))
          .catch(() => {})
          .finally(() => setLoadingTemp(false));
      }
    } catch {
      /* empty */
    }
  }, []);

  if (!country) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
      <span className="text-gray-400">Your location:</span>
      {countryCode && (
        <span className="text-lg leading-none">{countryToFlag(countryCode)}</span>
      )}
      <span className="font-medium">{country}</span>
      {loadingTemp && (
        <span className="inline-block h-5 w-16 animate-pulse rounded-full bg-gray-200 blur-[2px]" />
      )}
      {avgTemp != null && (
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 transition-all duration-500">
          avg {avgTemp}°C
        </span>
      )}
      <span className="text-gray-300">|</span>
      {time && (
        <span className="font-mono tabular-nums text-gray-600">
          {time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      )}
      <span className="text-xs text-gray-400">{formatUtcOffset()}</span>
    </div>
  );
}

function guessEuropeanCountry(tz: string): string {
  const city = tz.split("/").pop() || "";
  const map: Record<string, string> = {
    Moscow: "Russia", London: "United Kingdom", Paris: "France", Berlin: "Germany",
    Rome: "Italy", Madrid: "Spain", Warsaw: "Poland", Kyiv: "Ukraine",
    Bucharest: "Romania", Amsterdam: "Netherlands", Brussels: "Belgium",
    Vienna: "Austria", Prague: "Czech Republic", Stockholm: "Sweden",
    Helsinki: "Finland", Oslo: "Norway", Copenhagen: "Denmark",
    Lisbon: "Portugal", Athens: "Greece", Budapest: "Hungary",
    Belgrade: "Serbia", Zagreb: "Croatia", Sofia: "Bulgaria",
    Zurich: "Switzerland", Dublin: "Ireland", Tallinn: "Estonia",
    Riga: "Latvia", Vilnius: "Lithuania", Minsk: "Belarus",
    Istanbul: "Turkey", Samara: "Russia", Volgograd: "Russia",
  };
  return map[city] || "Europe";
}

function guessAmericaCountry(tz: string): string {
  const city = tz.split("/").pop() || "";
  const map: Record<string, string> = {
    New_York: "United States", Chicago: "United States", Los_Angeles: "United States",
    Denver: "United States", Phoenix: "United States", Anchorage: "United States",
    Honolulu: "United States", Toronto: "Canada", Vancouver: "Canada",
    Montreal: "Canada", Winnipeg: "Canada", Edmonton: "Canada",
    Mexico_City: "Mexico", Bogota: "Colombia", Lima: "Peru",
    Sao_Paulo: "Brazil", Buenos_Aires: "Argentina", Santiago: "Chile",
    Havana: "Cuba", Caracas: "Venezuela",
  };
  return map[city] || "America";
}

function guessAsianCountry(tz: string): string {
  const city = tz.split("/").pop() || "";
  const map: Record<string, string> = {
    Tokyo: "Japan", Shanghai: "China", Kolkata: "India", Seoul: "South Korea",
    Bangkok: "Thailand", Singapore: "Singapore", Jakarta: "Indonesia",
    Dubai: "UAE", Riyadh: "Saudi Arabia", Tehran: "Iran",
    Karachi: "Pakistan", Dhaka: "Bangladesh", Manila: "Philippines",
    Kuala_Lumpur: "Malaysia", Taipei: "Taiwan", Hong_Kong: "China",
    Almaty: "Kazakhstan", Tashkent: "Uzbekistan", Tbilisi: "Georgia",
    Yerevan: "Armenia", Baku: "Azerbaijan", Novosibirsk: "Russia",
    Vladivostok: "Russia", Yekaterinburg: "Russia", Omsk: "Russia",
    Krasnoyarsk: "Russia", Irkutsk: "Russia",
  };
  return map[city] || "Asia";
}

function guessAfricanCountry(tz: string): string {
  const city = tz.split("/").pop() || "";
  const map: Record<string, string> = {
    Cairo: "Egypt", Lagos: "Nigeria", Nairobi: "Kenya",
    Johannesburg: "South Africa", Casablanca: "Morocco",
    Algiers: "Algeria", Tunis: "Tunisia",
  };
  return map[city] || "Africa";
}

export default function HomePage() {
  const router = useRouter();
  const { isLoading, setIsLoading, setCurrentWeather, setError } = useWeatherStore();

  const handleSubmit = async (data: WeatherFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let weather;
      if (data.mode === "coordinates") {
        weather = await fetchCurrentWeatherByCoords(
          parseFloat(data.latitude),
          parseFloat(data.longitude)
        );
      } else {
        weather = await fetchCurrentWeatherByCity(
          data.city,
          data.country || undefined
        );
      }
      setCurrentWeather(weather);
      router.push("/result");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async (fav: FavoriteCity) => {
    setIsLoading(true);
    setError(null);
    try {
      const weather = await fetchCurrentWeatherByCoords(fav.latitude, fav.longitude);
      setCurrentWeather(weather);
      router.push("/result");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Cast</h1>
        <p className="text-gray-500 mb-3">Enter coordinates or search for a city</p>
        <UserLocation />
      </div>
      <WeatherForm onSubmit={handleSubmit} isLoading={isLoading} />
      <Favorites onSelect={handleFavorite} />
    </main>
  );
}
