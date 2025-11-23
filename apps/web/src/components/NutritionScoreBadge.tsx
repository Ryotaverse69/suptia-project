"use client";

import {
  Trophy,
  FolderOpen,
  TrendingUp,
  Activity,
  ShieldCheck,
  Beaker,
  Zap,
} from "lucide-react";

interface NutritionScoreBadgeProps {
  score: number;
  maxScore?: number;
  label?: string;
  subLabel?: string;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

/**
 * 栄養スコアを表示するバッジコンポーネント
 * Futuristic HUD Style
 */
export function NutritionScoreBadge({
  score,
  maxScore = 100,
  label = "NUTRITION SCORE",
  subLabel,
  size = "md",
  showDetails = false,
  className = "",
}: NutritionScoreBadgeProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  // サイズ設定
  const sizeConfig = {
    sm: {
      width: 80,
      stroke: 4,
      fontSize: "text-lg",
      iconSize: 14,
    },
    md: {
      width: 120,
      stroke: 6,
      fontSize: "text-3xl",
      iconSize: 18,
    },
    lg: {
      width: 160,
      stroke: 8,
      fontSize: "text-4xl",
      iconSize: 24,
    },
  };

  const { width, stroke, fontSize, iconSize } = sizeConfig[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // スコアに基づく色設定 (Neon/Glowing colors)
  let colorClass = "text-slate-400";
  let bgClass = "bg-slate-500/10";
  let glowClass = "shadow-none";
  let strokeColor = "#94a3b8"; // slate-400

  if (score >= 90) {
    colorClass = "text-purple-500";
    bgClass = "bg-purple-500/10";
    glowClass = "shadow-[0_0_15px_rgba(168,85,247,0.4)]";
    strokeColor = "#a855f7"; // purple-500
  } else if (score >= 80) {
    colorClass = "text-blue-500";
    bgClass = "bg-blue-500/10";
    glowClass = "shadow-[0_0_15px_rgba(59,130,246,0.4)]";
    strokeColor = "#3b82f6"; // blue-500
  } else if (score >= 70) {
    colorClass = "text-emerald-500";
    bgClass = "bg-emerald-500/10";
    glowClass = "shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    strokeColor = "#10b981"; // emerald-500
  } else if (score >= 60) {
    colorClass = "text-amber-500";
    bgClass = "bg-amber-500/10";
    glowClass = "shadow-none";
    strokeColor = "#f59e0b"; // amber-500
  } else {
    colorClass = "text-rose-500";
    bgClass = "bg-rose-500/10";
    glowClass = "shadow-none";
    strokeColor = "#f43f5e"; // rose-500
  }

  // 詳細表示用のダミーデータ生成（本来はpropsで受け取るべき）
  const details = [
    { label: "Cost", value: 92, icon: Trophy, color: "text-emerald-500" },
    { label: "Safety", value: 88, icon: ShieldCheck, color: "text-blue-500" },
    { label: "Evidence", value: 75, icon: Beaker, color: "text-purple-500" },
    { label: "Potency", value: 85, icon: Zap, color: "text-amber-500" },
  ];

  return (
    <div
      className={`flex flex-col items-center ${className} ${showDetails ? "p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl" : ""}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-20 ${bgClass.replace("/10", "")}`}
        />

        {/* SVG Gauge */}
        <svg
          width={width}
          height={width}
          className="transform -rotate-90 relative z-10"
        >
          {/* Background Circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono font-bold ${fontSize} ${colorClass}`}
            style={{ textShadow: "0 0 10px currentColor" }}
          >
            {score}
          </span>
          {size !== "sm" && (
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">
              SCORE
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      {(label || subLabel) && (
        <div className="mt-4 text-center">
          {label && (
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase">
                {label}
              </h3>
            </div>
          )}
          {subLabel && (
            <p className="text-xs text-slate-400 font-medium">{subLabel}</p>
          )}
        </div>
      )}

      {/* Detailed Stats Grid (HUD Style) */}
      {showDetails && (
        <div className="w-full mt-6 grid grid-cols-2 gap-3">
          {details.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group"
            >
              <div className="flex items-center gap-2">
                <item.icon
                  className={`w-4 h-4 ${item.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-700 group-hover:text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface NutritionScoreCardProps {
  ingredients: Array<{
    name: string;
    amount: number;
    evidenceLevel: "S" | "A" | "B" | "C" | "D";
  }>;
  gender?: "male" | "female";
  className?: string;
}

/**
 * 栄養スコアカード（詳細表示用ラッパー）
 */
export function NutritionScoreCard({
  ingredients,
  gender = "male",
  className = "",
}: NutritionScoreCardProps) {
  // 簡易的なスコア計算（実際にはもっと複雑なロジックが必要）
  // ここではエビデンスレベルに基づいてスコアを算出
  const calculateScore = () => {
    if (!ingredients || ingredients.length === 0) return 0;

    const totalScore = ingredients.reduce((acc, ing) => {
      const levelScore =
        ing.evidenceLevel === "S"
          ? 100
          : ing.evidenceLevel === "A"
            ? 85
            : ing.evidenceLevel === "B"
              ? 70
              : ing.evidenceLevel === "C"
                ? 55
                : 40;
      return acc + levelScore;
    }, 0);

    return Math.round(totalScore / ingredients.length);
  };

  const score = calculateScore();

  return (
    <div className={className}>
      <NutritionScoreBadge
        score={score}
        size="lg"
        showDetails={true}
        label="TOTAL SCORE"
        subLabel="BASED ON INGREDIENTS"
      />
    </div>
  );
}
