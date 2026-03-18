import { create } from "zustand";
import { GeocodingResult, WeatherRecord } from "@/types/weather";

interface WeatherState {
  currentWeather: WeatherRecord | null;
  isLoading: boolean;
  error: string | null;
  searchResults: GeocodingResult[];
  setCurrentWeather: (weather: WeatherRecord | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchResults: (results: GeocodingResult[]) => void;
  reset: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  currentWeather: null,
  isLoading: false,
  error: null,
  searchResults: [],
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchResults: (searchResults) => set({ searchResults }),
  reset: () =>
    set({
      currentWeather: null,
      isLoading: false,
      error: null,
      searchResults: [],
    }),
}));
