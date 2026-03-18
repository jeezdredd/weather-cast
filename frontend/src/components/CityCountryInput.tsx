"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GeocodingResult, ValidationErrors } from "@/types/weather";
import { searchCities } from "@/services/api";

interface CityCountryInputProps {
  city: string;
  country: string;
  errors: ValidationErrors;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onCitySelect: (result: GeocodingResult) => void;
}

export default function CityCountryInput({
  city,
  country,
  errors,
  onCityChange,
  onCountryChange,
  onCitySelect,
}: CityCountryInputProps) {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await searchCities(query, 5);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(city), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [city, fetchSuggestions]);

  const handleSelect = (result: GeocodingResult) => {
    onCitySelect(result);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Enter city name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((result, index) => (
              <li
                key={`${result.name}-${result.latitude}-${index}`}
                onMouseDown={() => handleSelect(result)}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
              >
                <span className="font-medium">{result.name}</span>
                {result.admin1 && <span className="text-gray-500">, {result.admin1}</span>}
                {result.country && <span className="text-gray-500"> - {result.country}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country (optional)
        </label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder="Enter country name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
