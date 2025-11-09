"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ローカルストレージから初期データを読み込む（ブラウザを閉じても保持）
  useEffect(() => {
    const stored = localStorage.getItem("suptia-favorites");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("[Favorites] Loaded from localStorage:", parsed);
        setFavorites(parsed);
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // お気に入りが変更されたらローカルストレージに保存
  useEffect(() => {
    if (isLoaded) {
      console.log("[Favorites] Saving to localStorage:", favorites);
      localStorage.setItem("suptia-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (productId: string) => {
    console.log("[Favorites] Adding favorite:", productId);
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        console.log("[Favorites] Already in favorites");
        return prev;
      }
      const newFavorites = [...prev, productId];
      console.log("[Favorites] New favorites array:", newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (productId: string) => {
    console.log("[Favorites] Removing favorite:", productId);
    setFavorites((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      console.log("[Favorites] After removal:", filtered);
      return filtered;
    });
  };

  const isFavorite = (productId: string) => {
    const result = favorites.includes(productId);
    console.log(`[Favorites] isFavorite(${productId}):`, result);
    return result;
  };

  const toggleFavorite = (productId: string) => {
    console.log("[Favorites] Toggle favorite:", productId);
    console.log("[Favorites] Current favorites:", favorites);
    if (isFavorite(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
