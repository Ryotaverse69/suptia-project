/**
 * キャラクター重み付け可視化コンポーネント
 *
 * Pro/Pro+Safety限定機能:
 * 「重み付けを見せる」設計原則の実装
 */

"use client";

import { cn } from "@/lib/utils";
import type { CharacterId, RecommendationWeights } from "@/lib/concierge/types";
import {
  CHARACTERS,
  calculateWeightPercentages,
} from "@/lib/concierge/characters";

interface WeightVisualizationProps {
  characterId: CharacterId;
  className?: string;
  showExplanation?: boolean;
}

const WEIGHT_LABELS: Record<
  keyof RecommendationWeights,
  { icon: string; label: string; description: string }
> = {
  price: {
    icon: "💰",
    label: "価格",
    description: "複数ECサイトでの価格を比較",
  },
  amount: {
    icon: "📊",
    label: "成分量",
    description: "1日あたりの有効成分量",
  },
  costPerformance: {
    icon: "💡",
    label: "コスパ",
    description: "成分量あたりの価格（¥/mg）",
  },
  evidence: {
    icon: "🔬",
    label: "エビデンス",
    description: "科学的根拠のレベル（S〜D）",
  },
  safety: {
    icon: "🛡️",
    label: "安全性",
    description: "添加物・成分の安全性評価",
  },
};

export function WeightVisualization({
  characterId,
  className,
  showExplanation = false,
}: WeightVisualizationProps) {
  const character = CHARACTERS[characterId];
  const percentages = calculateWeightPercentages(characterId);

  // 重み順にソート
  const sortedWeights = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key as keyof RecommendationWeights);

  return (
    <div className={cn("space-y-4", className)}>
      {/* タイトル */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            {character.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {character.name}の推薦スタイル
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {character.recommendationStyleLabel}
          </p>
        </div>
      </div>

      {/* 重み付けレーダー（簡易版：バー表示） */}
      <div className="space-y-3">
        {sortedWeights.map((key) => {
          const { icon, label, description } = WEIGHT_LABELS[key];
          const percentage = percentages[key];
          const isHighlighted = percentage > 22; // 均等より高い

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span
                    className={cn(
                      "text-sm",
                      isHighlighted
                        ? "font-medium text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400",
                    )}
                  >
                    {label}
                    {isHighlighted && " ★"}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {percentage}%
                </span>
              </div>

              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isHighlighted
                      ? "bg-primary-500"
                      : "bg-gray-300 dark:bg-gray-600",
                  )}
                  style={{ width: `${(percentage / 30) * 100}%` }}
                />
              </div>

              {showExplanation && (
                <p className="text-xs text-gray-400 dark:text-gray-500 pl-6">
                  {description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 説明文 */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          ★マークは{character.name}が特に重視する項目です。
          同じ質問でも、選んだキャラクターによって推薦順位が変わります。
        </p>
      </div>
    </div>
  );
}

/**
 * コンパクト版（インライン表示用）
 */
export function WeightVisualizationCompact({
  characterId,
  className,
}: {
  characterId: CharacterId;
  className?: string;
}) {
  const percentages = calculateWeightPercentages(characterId);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Object.entries(WEIGHT_LABELS).map(([key, { icon }]) => {
        const percentage = percentages[key as keyof RecommendationWeights];
        const isHighlighted = percentage > 22;

        return (
          <div
            key={key}
            className={cn(
              "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs",
              isHighlighted
                ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                : "text-gray-400 dark:text-gray-500",
            )}
            title={`${WEIGHT_LABELS[key as keyof RecommendationWeights].label}: ${percentage}%`}
          >
            <span>{icon}</span>
            {isHighlighted && (
              <span className="font-medium">{percentage}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
