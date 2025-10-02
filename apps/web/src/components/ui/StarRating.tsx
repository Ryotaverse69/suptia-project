"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showLabel = true,
  reviewCount,
  className,
}: StarRatingProps) {
  const iconSize = sizeMap[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < fullStars;
          const isHalf = index === fullStars && hasHalfStar;

          return (
            <div key={index} className="relative">
              <Star
                size={iconSize}
                className={cn(
                  "transition-colors",
                  isFilled || isHalf
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300",
                )}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    size={iconSize}
                    className="fill-yellow-400 text-yellow-400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
}
