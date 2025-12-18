"use client";

import { useState } from "react";
import Image from "next/image";

interface ArticleEyecatchProps {
  src: string;
  alt: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function ArticleEyecatch({
  src,
  alt,
  className = "",
  size = "medium",
}: ArticleEyecatchProps) {
  const [imageError, setImageError] = useState(false);

  // デフォルト画像の場合は表示しない
  if (src === "/og-image.png" || imageError) {
    return null;
  }

  const sizeClasses = {
    small: "max-w-xs",
    medium: "max-w-md",
    large: "max-w-lg",
  };

  return (
    <div
      className={`relative w-full ${sizeClasses[size]} mx-auto aspect-[1200/630] rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 448px) 100vw, 448px"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  );
}
