/**
 * RDA Fulfillment Heatmap Component
 *
 * Phase 3: Futuristic UI Redesign
 * - Cyberpunk/SF Style Data Visualization
 * - Neon gradients, segmented bars, holographic glow
 * - Terminal/HUD aesthetic
 */

import React from "react";
import { calculateRdaFulfillment } from "@/lib/nutrition-score";
import { BarChart3, Activity, Zap, Info } from "lucide-react";

interface RdaFulfillmentHeatmapProps {
  /** 成分配列 */
  ingredients: Array<{
    name: string;
    amount: number;
  }>;
  /** 性別（デフォルト: male） */
  gender?: "male" | "female";
  /** 最大表示数（デフォルト: 10） */
  maxDisplay?: number;
  /** カスタムクラス名 */
  className?: string;
}

export function RdaFulfillmentHeatmap({
  ingredients,
  gender = "male",
  maxDisplay = 10,
  className = "",
}: RdaFulfillmentHeatmapProps) {
  const ingredientsWithRda = ingredients
    .map((ing) => {
      const fulfillment = calculateRdaFulfillment(ing.name, ing.amount, gender);
      return fulfillment !== null
        ? {
            ...ing,
            fulfillment,
          }
        : null;
    })
    .filter((ing): ing is NonNullable<typeof ing> => ing !== null)
    .slice(0, maxDisplay);

  if (ingredientsWithRda.length === 0) {
    return (
      <div
        className={`text-center py-8 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed ${className}`}
      >
        <p className="text-sm font-mono text-slate-500">
          NO_RDA_DATA_AVAILABLE // SYSTEM_IDLE
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative ${className}`}
    >
      {/* Background Grid Effect */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold font-mono text-cyan-400 tracking-widest uppercase">
            RDA_ANALYSIS_MATRIX
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <Activity className="w-3 h-3 animate-pulse text-emerald-500" />
          <span>LIVE_DATA</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Explanation Panel */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                RDA（推奨摂取量）とは？
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                RDA (Recommended Dietary Allowance)
                は、健康な人が1日に摂取することが推奨される栄養素の量を示しています。
                このグラフは、本製品が1日分の推奨量をどの程度満たしているかを可視化したものです。
                <br />
                <span className="text-slate-400 mt-1 block">
                  ※
                  100%に近いほど、1日分の必要量を十分に補えることを意味します。
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ingredientsWithRda.map((ing) => (
            <RdaBar
              key={ing.name}
              name={ing.name}
              amount={ing.amount}
              fulfillment={ing.fulfillment}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            <span>OPTIMAL (≤100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            <span>HIGH (100-300%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
            <span>EXCESS (≥300%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RdaBar({
  name,
  amount,
  fulfillment,
}: {
  name: string;
  amount: number;
  fulfillment: number;
}) {
  // Determine colors based on fulfillment
  let barColor = "bg-emerald-500";
  let glowColor = "shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  let textColor = "text-emerald-400";
  let statusText = "OPTIMAL";

  if (fulfillment > 300) {
    barColor = "bg-rose-500";
    glowColor = "shadow-[0_0_10px_rgba(244,63,94,0.5)]";
    textColor = "text-rose-400";
    statusText = "EXCESS";
  } else if (fulfillment > 100) {
    barColor = "bg-amber-500";
    glowColor = "shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    textColor = "text-amber-400";
    statusText = "HIGH";
  }

  // Cap display at 100% for the bar width (since it's a fulfillment meter, not a linear scale)
  // Actually, let's make it a segmented bar where 100% is full width, but we can go over
  const displayPercentage = Math.min(fulfillment, 100);

  // Generate segments
  const segments = 20; // 5% per segment
  const filledSegments = Math.ceil((displayPercentage / 100) * segments);

  return (
    <div className="group relative">
      <div className="flex items-end justify-between mb-1">
        <span className="text-xs font-mono font-bold text-slate-300 truncate max-w-[120px]">
          {name}
        </span>
        <div className="text-right">
          <span className={`text-sm font-mono font-bold ${textColor}`}>
            {fulfillment.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Segmented Bar Container */}
      <div className="h-2 flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filledSegments;
          const isOverfill = fulfillment > 100 && i >= segments - 1; // Last segment indicates overflow if > 100%

          return (
            <div
              key={i}
              className={`
                flex-1 rounded-sm transition-all duration-300
                ${isFilled ? barColor : "bg-slate-800"}
                ${isFilled ? glowColor : ""}
                ${isOverfill && fulfillment > 300 ? "animate-pulse" : ""}
              `}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono text-slate-500">{amount}mg</span>
        <span className={`text-[10px] font-mono font-bold ${textColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

/**
 * RDA Fulfillment Gauge Component (Single)
 * Used in other parts of the app
 */
export function RdaFulfillmentGauge({
  name,
  amount,
  gender = "male",
  className = "",
}: {
  name: string;
  amount: number;
  gender?: "male" | "female";
  className?: string;
}) {
  const fulfillment = calculateRdaFulfillment(name, amount, gender);

  if (fulfillment === null) return null;

  let strokeColor = "#10b981"; // emerald-500
  if (fulfillment > 300)
    strokeColor = "#f43f5e"; // rose-500
  else if (fulfillment > 100) strokeColor = "#f59e0b"; // amber-500

  const percentage = Math.min(fulfillment, 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#1e293b"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke={strokeColor}
            strokeWidth="3"
            fill="none"
            strokeDasharray={88}
            strokeDashoffset={88 - (percentage / 100) * 88}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <Zap className="w-3 h-3 text-slate-400 absolute" />
      </div>
      <div>
        <div className="text-xs font-mono font-bold text-slate-300">{name}</div>
        <div className="text-[10px] font-mono text-slate-500">
          {fulfillment.toFixed(0)}% RDA
        </div>
      </div>
    </div>
  );
}
