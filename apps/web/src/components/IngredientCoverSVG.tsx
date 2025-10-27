"use client";

import React from "react";

interface IngredientCoverSVGProps {
  name: string;
  nameEn: string;
  category: string;
  className?: string;
}

// カテゴリ別のグラデーションとパターン定義
const categoryDesigns = {
  ビタミン: {
    gradient: ["#FF6B35", "#F7931E", "#FDC830"],
    pattern: "radial",
    icon: "sun",
  },
  ミネラル: {
    gradient: ["#667eea", "#764ba2", "#4facfe"],
    pattern: "crystal",
    icon: "hexagon",
  },
  脂肪酸: {
    gradient: ["#4facfe", "#00f2fe", "#667eea"],
    pattern: "wave",
    icon: "wave",
  },
  アミノ酸: {
    gradient: ["#56ab2f", "#a8e063", "#38ef7d"],
    pattern: "helix",
    icon: "dna",
  },
  プロバイオティクス: {
    gradient: ["#84fab0", "#8fd3f4", "#a8e063"],
    pattern: "circles",
    icon: "bacteria",
  },
  ハーブ: {
    gradient: ["#2af598", "#009efd", "#38ef7d"],
    pattern: "leaf",
    icon: "leaf",
  },
  その他: {
    gradient: ["#667eea", "#764ba2", "#f093fb"],
    pattern: "simple",
    icon: "pill",
  },
};

export function IngredientCoverSVG({
  name,
  nameEn,
  category,
  className = "",
}: IngredientCoverSVGProps) {
  const design =
    categoryDesigns[category as keyof typeof categoryDesigns] ||
    categoryDesigns["その他"];

  return (
    <svg
      viewBox="0 0 1200 630"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${name}のイメージ`}
    >
      <defs>
        {/* グラデーション定義 */}
        <linearGradient
          id={`grad-${category}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            style={{ stopColor: design.gradient[0], stopOpacity: 1 }}
          />
          <stop
            offset="50%"
            style={{ stopColor: design.gradient[1], stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: design.gradient[2], stopOpacity: 1 }}
          />
        </linearGradient>

        {/* パターン定義 */}
        {design.pattern === "radial" && (
          <radialGradient id={`radial-${category}`}>
            <stop
              offset="0%"
              style={{ stopColor: design.gradient[2], stopOpacity: 0.8 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: design.gradient[0], stopOpacity: 1 }}
            />
          </radialGradient>
        )}

        {/* 装飾パターン */}
        {design.pattern === "crystal" && (
          <pattern
            id="crystalPattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="50,10 90,40 70,80 30,80 10,40"
              fill="white"
              opacity="0.1"
            />
          </pattern>
        )}

        {design.pattern === "wave" && (
          <pattern
            id="wavePattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,100 Q50,70 100,100 T200,100"
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
            <path
              d="M0,130 Q50,100 100,130 T200,130"
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.15"
            />
          </pattern>
        )}

        {design.pattern === "circles" && (
          <pattern
            id="circlesPattern"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="30" cy="30" r="20" fill="white" opacity="0.15" />
            <circle cx="90" cy="70" r="15" fill="white" opacity="0.1" />
            <circle cx="50" cy="90" r="25" fill="white" opacity="0.12" />
          </pattern>
        )}

        {design.pattern === "leaf" && (
          <pattern
            id="leafPattern"
            x="0"
            y="0"
            width="150"
            height="150"
            patternUnits="userSpaceOnUse"
          >
            <ellipse
              cx="50"
              cy="70"
              rx="20"
              ry="40"
              fill="white"
              opacity="0.15"
              transform="rotate(-30 50 70)"
            />
            <ellipse
              cx="100"
              cy="50"
              rx="25"
              ry="45"
              fill="white"
              opacity="0.1"
              transform="rotate(20 100 50)"
            />
          </pattern>
        )}

        {/* グローエフェクト */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景グラデーション */}
      <rect
        width="1200"
        height="630"
        fill={
          design.pattern === "radial"
            ? `url(#radial-${category})`
            : `url(#grad-${category})`
        }
      />

      {/* 装飾パターン */}
      {design.pattern === "crystal" && (
        <rect width="1200" height="630" fill="url(#crystalPattern)" />
      )}
      {design.pattern === "wave" && (
        <rect width="1200" height="630" fill="url(#wavePattern)" />
      )}
      {design.pattern === "circles" && (
        <rect width="1200" height="630" fill="url(#circlesPattern)" />
      )}
      {design.pattern === "leaf" && (
        <rect width="1200" height="630" fill="url(#leafPattern)" />
      )}

      {/* 装飾的な大きな図形（背景） */}
      {design.pattern === "radial" && (
        <>
          <circle cx="900" cy="150" r="200" fill="white" opacity="0.1" />
          <circle cx="300" cy="500" r="150" fill="white" opacity="0.08" />
        </>
      )}

      {design.pattern === "helix" && (
        <>
          <ellipse
            cx="200"
            cy="315"
            rx="100"
            ry="300"
            fill="white"
            opacity="0.1"
            transform="rotate(-15 200 315)"
          />
          <ellipse
            cx="1000"
            cy="315"
            rx="100"
            ry="300"
            fill="white"
            opacity="0.1"
            transform="rotate(15 1000 315)"
          />
        </>
      )}

      {/* アイコン（背景の装飾） */}
      {design.icon === "hexagon" && (
        <>
          <polygon
            points="950,200 1050,250 1050,350 950,400 850,350 850,250"
            fill="white"
            opacity="0.15"
            strokeWidth="3"
            stroke="white"
          />
          <polygon
            points="200,100 280,140 280,220 200,260 120,220 120,140"
            fill="white"
            opacity="0.1"
            strokeWidth="2"
            stroke="white"
          />
        </>
      )}

      {/* グラデーションオーバーレイ（下部を暗く） */}
      <defs>
        <linearGradient id="textBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "rgba(0,0,0,0)", stopOpacity: 0 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgba(0,0,0,0.6)", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#textBg)" />

      {/* カテゴリバッジ */}
      <rect
        x="50"
        y="50"
        width="auto"
        height="50"
        rx="25"
        fill="white"
        opacity="0.95"
      />
      <text
        x="75"
        y="82"
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="24"
        fontWeight="700"
        fill={design.gradient[0]}
      >
        {category}
      </text>

      {/* 成分名（日本語） */}
      <text
        x="50"
        y="520"
        fontFamily="'Noto Sans JP', sans-serif"
        fontSize="72"
        fontWeight="900"
        fill="white"
        filter="url(#glow)"
      >
        {name}
      </text>

      {/* 成分名（英語） */}
      <text
        x="50"
        y="570"
        fontFamily="'Inter', sans-serif"
        fontSize="36"
        fontWeight="600"
        fill="white"
        opacity="0.9"
      >
        {nameEn}
      </text>
    </svg>
  );
}
