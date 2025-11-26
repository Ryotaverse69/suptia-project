"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export function FavoriteButton({
  productId,
  productName,
  className = "",
  size = "md",
  iconOnly = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(productId);

  const sizeClasses = {
    sm: "px-2 py-1.5 text-sm sm:px-3",
    md: "px-2.5 py-2 text-base sm:px-4",
    lg: "px-3 py-3 text-lg sm:px-6",
  };

  const iconOnlyClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (iconOnly) {
    return (
      <button
        onClick={() => toggleFavorite(productId)}
        className={`
          rounded-lg transition-all duration-300
          ${
            favorite
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "text-slate-400 hover:text-pink-500 hover:bg-pink-50"
          }
          ${iconOnlyClasses[size]}
          ${className}
        `}
        aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
      >
        <Heart
          size={iconSizes[size]}
          className={`transition-all duration-300 ${
            favorite ? "fill-white text-white" : ""
          }`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleFavorite(productId)}
      className={`
        flex items-center gap-2 rounded-lg font-semibold transition-all duration-300
        ${
          favorite
            ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl"
            : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-pink-300"
        }
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-all duration-300 ${
          favorite ? "fill-white text-white" : "text-gray-600"
        }`}
      />
      <span className="hidden sm:inline">
        {favorite ? "お気に入り済み" : "お気に入りに追加"}
      </span>
    </button>
  );
}
