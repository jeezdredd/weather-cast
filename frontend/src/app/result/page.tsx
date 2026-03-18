"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeatherStore } from "@/store/weatherStore";
import { getTemperatureBackground } from "@/utils/temperature";
import WeatherDisplay from "@/components/WeatherDisplay";

export default function ResultPage() {
  const router = useRouter();
  const { currentWeather } = useWeatherStore();

  useEffect(() => {
    if (!currentWeather) {
      router.replace("/");
    }
  }, [currentWeather, router]);

  if (!currentWeather) return null;

  const bgGradient = getTemperatureBackground(currentWeather.temperature);

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${bgGradient}`}
    >
      <WeatherDisplay weather={currentWeather} />
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
      >
        Search Again
      </button>
    </main>
  );
}
