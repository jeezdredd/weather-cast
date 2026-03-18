"use client";

import { useEffect, useState } from "react";
import { FavoriteCity } from "@/types/weather";

const STORAGE_KEY = "weather-cast-favorites";

export function getFavorites(): FavoriteCity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addFavorite(fav: FavoriteCity): void {
  const all = getFavorites();
  const exists = all.some(
    (f) => f.latitude === fav.latitude && f.longitude === fav.longitude
  );
  if (!exists) {
    all.push(fav);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export function removeFavorite(fav: FavoriteCity): void {
  const all = getFavorites().filter(
    (f) => f.latitude !== fav.latitude || f.longitude !== fav.longitude
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

interface FavoritesProps {
  onSelect: (fav: FavoriteCity) => void;
}

export default function Favorites({ onSelect }: FavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (fav: FavoriteCity) => {
    removeFavorite(fav);
    setFavorites(getFavorites());
  };

  if (favorites.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-6">
      <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
        Favorites
      </div>
      <div className="flex flex-wrap gap-2">
        {favorites.map((fav) => (
          <div
            key={`${fav.latitude}-${fav.longitude}`}
            className="group flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm shadow-sm transition-all hover:shadow-md"
          >
            <button
              onClick={() => onSelect(fav)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {fav.city}{fav.country ? `, ${fav.country}` : ""}
            </button>
            <button
              onClick={() => handleRemove(fav)}
              className="ml-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
