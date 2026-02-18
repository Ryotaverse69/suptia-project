"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Shield, Beaker, Calendar } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  tierColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

interface IngredientHeaderProps {
  name: string;
  nameEn: string;
  category?: string;
  evidenceLevel?: string;
  description?: string;
  updatedAt?: string;
  ogImageUrl?: string;
}

// 日付をフォーマット
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// エビデンスレベルのラベル
const evidenceLevelLabels: Record<string, string> = {
  S: "最高レベル",
  A: "高い根拠",
  B: "中程度の根拠",
  C: "限定的な根拠",
  D: "根拠不十分",
  高: "高い根拠",
  中: "中程度の根拠",
  低: "限定的な根拠",
};

export function IngredientHeader({
  name,
  nameEn,
  category,
  evidenceLevel,
  description,
  updatedAt,
  ogImageUrl,
}: IngredientHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const evidenceLabel = evidenceLevel
    ? evidenceLevelLabels[evidenceLevel] || "限定的な根拠"
    : null;

  // Get tier color for evidence level badge
  const getTierColor = (level: string) => {
    if (level in tierColors) {
      return tierColors[level as keyof typeof tierColors];
    }
    // Map Japanese levels to tier colors
    if (level === "高") return tierColors.A;
    if (level === "中") return tierColors.B;
    if (level === "低") return tierColors.C;
    return tierColors.D;
  };

  return (
    <header className="mb-6 sm:mb-8" style={{ fontFamily: fontStack }}>
      {/* パンくずリスト */}
      <nav
        className="text-[14px] mb-4"
        style={{ color: appleWebColors.textSecondary }}
      >
        <ol className="flex items-center gap-1.5 sm:gap-2 flex-nowrap min-w-0">
          <li className="shrink-0">
            <Link
              href="/"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: appleWebColors.blue }}
            >
              ホーム
            </Link>
          </li>
          <li className="shrink-0">/</li>
          <li className="shrink-0">
            <Link
              href="/ingredients"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: appleWebColors.blue }}
            >
              成分ガイド
            </Link>
          </li>
          <li className="shrink-0">/</li>
          <li
            className="font-medium truncate min-w-0"
            style={{ color: appleWebColors.textPrimary }}
          >
            {name}
          </li>
        </ol>
      </nav>

      {/* メインヘッダー */}
      <div
        className="rounded-[20px] p-5 sm:p-8 border"
        style={{
          background: `linear-gradient(135deg, ${systemColors.blue}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.green}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        {/* タイトルと更新日 */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
          <h1
            className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-tight tracking-[-0.015em]"
            style={{ color: appleWebColors.textPrimary }}
          >
            {name}
          </h1>
          {updatedAt && (
            <time
              dateTime={updatedAt}
              className="inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap"
              style={{ color: appleWebColors.textSecondary }}
            >
              <Calendar
                size={14}
                style={{ color: appleWebColors.textTertiary }}
              />
              最終更新: {formatDate(updatedAt)}
            </time>
          )}
        </div>
        <p
          className="text-[17px] sm:text-[20px] mb-5 sm:mb-6"
          style={{ color: appleWebColors.textSecondary }}
        >
          {nameEn}
        </p>

        {/* アイキャッチ画像 */}
        {ogImageUrl && !imageError && (
          <div className="relative w-full max-w-md mx-auto aspect-[1200/630] mb-5 sm:mb-6 rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <Image
              src={ogImageUrl}
              alt={`${name}（${nameEn}）のアイキャッチ画像`}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* バッジ群 */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
          {category && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium bg-white/60 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
              style={{
                color: appleWebColors.textSecondary,
              }}
            >
              <Beaker
                size={14}
                style={{ color: appleWebColors.textTertiary }}
              />
              {category}
            </span>
          )}
          {evidenceLevel && evidenceLabel && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold text-white"
              style={{
                background: getTierColor(evidenceLevel).bg,
              }}
            >
              <Award size={14} />
              エビデンス: {evidenceLevel}
              <span className="text-[11px] opacity-85">({evidenceLabel})</span>
            </span>
          )}
        </div>

        {/* 概要説明 */}
        {description && (
          <div className="rounded-[24px] p-4 sm:p-6 bg-white/60 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-start gap-3">
              <Shield
                size={20}
                className="flex-shrink-0 mt-1"
                style={{ color: systemColors.blue }}
              />
              <p
                className="text-[15px] leading-[1.9] sm:leading-[2]"
                style={{ color: appleWebColors.textSecondary }}
              >
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
