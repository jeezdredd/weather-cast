"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import WeatherForm from "@/components/WeatherForm";
import { fetchCurrentWeatherByCity, fetchCurrentWeatherByCoords } from "@/services/api";
import { useWeatherStore } from "@/store/weatherStore";
import { WeatherFormData } from "@/types/weather";

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Cast</h1>
        <p className="text-gray-500">Enter coordinates or search for a city</p>
      </div>
      <WeatherForm onSubmit={handleSubmit} isLoading={isLoading} />
    </main>
  );
}
