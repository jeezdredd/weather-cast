"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeatherStore } from "@/store/weatherStore";
import { getTemperatureBackground } from "@/utils/temperature";
import { addFavorite, getFavorites } from "@/components/Favorites";
import WeatherDisplay from "@/components/WeatherDisplay";

export default function ResultPage() {
  const router = useRouter();
  const { currentWeather } = useWeatherStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!currentWeather) {
      router.replace("/");
      return;
    }
    const favs = getFavorites();
    setIsFavorite(
      favs.some(
        (f) =>
          f.latitude === currentWeather.latitude &&
          f.longitude === currentWeather.longitude
      )
    );
  }, [currentWeather, router]);

  if (!currentWeather) return null;

  const bgGradient = getTemperatureBackground(currentWeather.temperature);

  const handleAddFavorite = () => {
    addFavorite({
      city: currentWeather.city || `${currentWeather.latitude}, ${currentWeather.longitude}`,
      country: currentWeather.country || "",
      latitude: currentWeather.latitude,
      longitude: currentWeather.longitude,
    });
    setIsFavorite(true);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${bgGradient}`}
    >
      <WeatherDisplay weather={currentWeather} />
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
        >
          Search Again
        </button>
        {!isFavorite && (
          <button
            onClick={handleAddFavorite}
            className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            Add to Favorites
          </button>
        )}
      </div>
    </main>
  );
}
