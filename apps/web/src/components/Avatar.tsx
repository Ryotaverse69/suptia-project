"use client";

import {
  User,
  Smile,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Bot,
  Ghost,
  Baby,
  LucideIcon,
} from "lucide-react";
import {
  AvatarType,
  getPresetById,
  DEFAULT_AVATAR_GRADIENT,
} from "@/lib/avatar-presets";

// lucide-reactアイコンマッピング
const ICON_MAP: Record<string, LucideIcon> = {
  User,
  Smile,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Bot,
  Ghost,
  Baby,
};

export interface AvatarProps {
  type?: AvatarType;
  presetId?: string | null;
  customUrl?: string | null;
  fallback?: string; // イニシャル用（メール頭文字など）
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  xs: { container: "w-6 h-6", icon: 14, text: "text-[10px]" },
  sm: { container: "w-8 h-8", icon: 16, text: "text-xs" },
  md: { container: "w-10 h-10", icon: 20, text: "text-sm" },
  lg: { container: "w-16 h-16", icon: 32, text: "text-xl" },
  xl: { container: "w-24 h-24", icon: 48, text: "text-3xl" },
};

export function Avatar({
  type = "initial",
  presetId,
  customUrl,
  fallback = "U",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeConfig = SIZE_MAP[size];

  // カスタム画像の場合（外部URLなのでネイティブimgタグを使用）
  if (type === "custom" && customUrl) {
    return (
      <div
        className={`${sizeConfig.container} rounded-full overflow-hidden ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customUrl}
          alt="アバター"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // プリセットアイコンの場合
  if (type === "preset" && presetId) {
    const preset = getPresetById(presetId);
    if (preset) {
      const IconComponent = ICON_MAP[preset.icon];
      return (
        <div
          className={`${sizeConfig.container} rounded-full flex items-center justify-center ${className}`}
          style={{
            background: `linear-gradient(135deg, ${preset.gradient[0]} 0%, ${preset.gradient[1]} 100%)`,
          }}
        >
          {IconComponent && (
            <IconComponent size={sizeConfig.icon} className="text-white" />
          )}
        </div>
      );
    }
  }

  // イニシャル（デフォルト）
  return (
    <div
      className={`${sizeConfig.container} rounded-full flex items-center justify-center text-white font-semibold ${sizeConfig.text} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${DEFAULT_AVATAR_GRADIENT[0]} 0%, ${DEFAULT_AVATAR_GRADIENT[1]} 100%)`,
      }}
    >
      {fallback[0]?.toUpperCase() || "U"}
    </div>
  );
}
