/**
 * 推薦ロジック可視化コンポーネント
 *
 * Pro以上で表示される5つの柱の重み付け表示
 */

"use client";

import { systemColors, appleWebColors } from "@/lib/design-system";
import type { CharacterId } from "@/lib/concierge/types";
import { calculateWeightPercentages } from "@/lib/concierge/characters";
import { ScoreExplanationTooltip } from "./ScoreExplanationTooltip";

interface WeightsVisualizationProps {
  characterId: CharacterId;
  compact?: boolean;
}

const WEIGHT_LABELS: Record<string, { label: string; icon: string }> = {
  price: { label: "価格", icon: "💰" },
  amount: { label: "成分量", icon: "📊" },
  costPerformance: { label: "コスパ", icon: "💡" },
  evidence: { label: "エビデンス", icon: "🔬" },
  safety: { label: "安全性", icon: "🛡️" },
};

const WEIGHT_COLORS: Record<string, string> = {
  price: systemColors.yellow,
  amount: systemColors.blue,
  costPerformance: systemColors.green,
  evidence: systemColors.purple,
  safety: systemColors.teal,
};

export function WeightsVisualization({
  characterId,
  compact = false,
}: WeightsVisualizationProps) {
  const weights = calculateWeightPercentages(characterId);

  if (compact) {
    // コンパクト表示（バーのみ）
    return (
      <div className="flex gap-1 items-center">
        {Object.entries(weights).map(([key, value]) => (
          <div
            key={key}
            className="h-2 rounded-full"
            style={{
              width: `${value}%`,
              minWidth: value > 0 ? "4px" : "0",
              backgroundColor: WEIGHT_COLORS[key],
              opacity: value > 15 ? 1 : 0.5,
            }}
            title={`${WEIGHT_LABELS[key].label}: ${value}%`}
          />
        ))}
      </div>
    );
  }

  // フル表示
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        border: `1px solid ${appleWebColors.borderSubtle}`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[13px] font-medium"
          style={{ color: appleWebColors.textSecondary }}
        >
          推薦ロジック
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{
            backgroundColor: `${systemColors.blue}15`,
            color: systemColors.blue,
          }}
        >
          Pro
        </span>
      </div>

      <div className="space-y-2">
        {Object.entries(weights).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-5 text-center text-[12px]">
              {WEIGHT_LABELS[key].icon}
            </span>
            <span
              className="w-20 text-[12px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              {WEIGHT_LABELS[key].label}
            </span>
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${WEIGHT_COLORS[key]}20` }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${value}%`,
                  backgroundColor: WEIGHT_COLORS[key],
                }}
              />
            </div>
            <span
              className="w-10 text-right text-[11px] font-medium"
              style={{ color: appleWebColors.textTertiary }}
            >
              {value}%
            </span>
            {/* スコア説明ツールチップ */}
            <ScoreExplanationTooltip
              pillar={
                key as
                  | "price"
                  | "amount"
                  | "costPerformance"
                  | "evidence"
                  | "safety"
              }
              weight={value / 20} // 20%基準なので、値を5で割って重みに変換
            />
          </div>
        ))}
      </div>

      <p
        className="mt-3 text-[11px]"
        style={{ color: appleWebColors.textTertiary }}
      >
        ※ キャラクターごとに異なる重み付けで商品を評価しています
      </p>
    </div>
  );
}
