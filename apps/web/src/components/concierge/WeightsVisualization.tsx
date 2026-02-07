/**
 * 推薦ロジック可視化コンポーネント
 *
 * Pro以上で表示される5つの柱の重み付け表示
 * カスタム重み付けがある場合はそちらを優先表示
 */

"use client";

import { systemColors, appleWebColors } from "@/lib/design-system";
import type { CharacterId } from "@/lib/concierge/types";
import { calculateWeightPercentages } from "@/lib/concierge/characters";
import { ScoreExplanationTooltip } from "./ScoreExplanationTooltip";

interface CustomWeights {
  price: number;
  amount: number;
  costPerformance: number;
  evidence: number;
  safety: number;
}

interface WeightsVisualizationProps {
  characterId: CharacterId;
  customWeights?: CustomWeights | null;
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
  customWeights,
  compact = false,
}: WeightsVisualizationProps) {
  const characterWeights = calculateWeightPercentages(characterId);
  const isCustom = !!customWeights;

  // カスタム重み付けがある場合はそちらを使用
  const weights = isCustom
    ? {
        price: customWeights.price,
        amount: customWeights.amount,
        costPerformance: customWeights.costPerformance,
        evidence: customWeights.evidence,
        safety: customWeights.safety,
      }
    : characterWeights;

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
      className="p-3 rounded-2xl"
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        border: `1px solid ${appleWebColors.borderSubtle}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[12px] font-medium"
          style={{ color: appleWebColors.textSecondary }}
        >
          推薦ロジック
        </span>
        {isCustom ? (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              backgroundColor: `${systemColors.purple}15`,
              color: systemColors.purple,
            }}
          >
            カスタム
          </span>
        ) : (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              backgroundColor: `${systemColors.blue}15`,
              color: systemColors.blue,
            }}
          >
            Pro
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {Object.entries(weights).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-4 text-center text-[11px]">
              {WEIGHT_LABELS[key].icon}
            </span>
            <span
              className="w-16 text-[11px]"
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
              className="w-8 text-right text-[10px] font-medium"
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
        className="mt-2 text-[10px]"
        style={{ color: appleWebColors.textTertiary }}
      >
        {isCustom
          ? "※ カスタム重み付けが反映中"
          : "※ キャラクター別の重み付けで評価"}
      </p>
    </div>
  );
}
