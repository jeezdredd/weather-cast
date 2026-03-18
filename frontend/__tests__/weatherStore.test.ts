import { useWeatherStore } from "@/store/weatherStore";
import { WeatherRecord } from "@/types/weather";

const mockWeather: WeatherRecord = {
  id: 1,
  city: "Berlin",
  country: "Germany",
  latitude: 52.52,
  longitude: 13.405,
  temperature: 15.5,
  humidity: 65,
  pressure: 1013.25,
  wind_speed: 12.3,
  weather_description: "Mainly clear",
  recorded_at: "2026-03-18T12:00:00Z",
  created_at: "2026-03-18T12:00:00Z",
  updated_at: "2026-03-18T12:00:00Z",
};

describe("weatherStore", () => {
  beforeEach(() => {
    useWeatherStore.getState().reset();
  });

  it("sets current weather", () => {
    useWeatherStore.getState().setCurrentWeather(mockWeather);
    expect(useWeatherStore.getState().currentWeather).toEqual(mockWeather);
  });

  it("sets loading state", () => {
    useWeatherStore.getState().setIsLoading(true);
    expect(useWeatherStore.getState().isLoading).toBe(true);
  });

  it("sets error", () => {
    useWeatherStore.getState().setError("Something went wrong");
    expect(useWeatherStore.getState().error).toBe("Something went wrong");
  });

  it("sets search results", () => {
    const results = [
      {
        name: "Berlin",
        latitude: 52.52,
        longitude: 13.405,
        country: "Germany",
        country_code: "DE",
        admin1: "Berlin",
      },
    ];
    useWeatherStore.getState().setSearchResults(results);
    expect(useWeatherStore.getState().searchResults).toEqual(results);
  });

  it("resets state", () => {
    useWeatherStore.getState().setCurrentWeather(mockWeather);
    useWeatherStore.getState().setIsLoading(true);
    useWeatherStore.getState().setError("error");

    useWeatherStore.getState().reset();

    const state = useWeatherStore.getState();
    expect(state.currentWeather).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.searchResults).toEqual([]);
  });
});
