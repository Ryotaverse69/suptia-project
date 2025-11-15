/**
 * Ingredient Comparison Card Component
 *
 * Phase 2.7-C: UI/UX改善
 * - グループ内中央値との比較表示
 * - この商品が中央値の何倍かを表示
 * - 視覚的な位置表示（バー）
 */

import React from "react";

interface IngredientComparisonCardProps {
  /** 成分名 */
  ingredientName: string;
  /** この商品の含有量（mg） */
  amount: number;
  /** グループ内の統計情報 */
  groupStats: {
    median: number;
    min: number;
    max: number;
    average: number;
    count: number;
  };
  /** カスタムクラス名 */
  className?: string;
}

export function IngredientComparisonCard({
  ingredientName,
  amount,
  groupStats,
  className = "",
}: IngredientComparisonCardProps) {
  const ratio = amount / groupStats.median;
  const percentile = calculatePercentile(amount, groupStats);

  return (
    <div className={`bg-gray-50 border rounded-lg p-4 ${className}`}>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900">{ingredientName}</h4>
        <p className="text-xs text-gray-500 mt-1">
          同成分を含む{groupStats.count}商品との比較
        </p>
      </div>

      {/* 中央値との比較 */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-600">この商品</span>
          <span className="text-2xl font-bold text-gray-900">
            {amount.toLocaleString()}mg
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-600">グループ中央値</span>
          <span className="text-lg font-semibold text-gray-700">
            {groupStats.median.toLocaleString()}mg
          </span>
        </div>

        {/* 比較結果 */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            中央値の
            <span className={`font-semibold ml-1 ${getRatioColorClass(ratio)}`}>
              {ratio.toFixed(1)}倍
            </span>
            {getRatioDescription(ratio)}
          </p>
        </div>

        {/* 視覚的な位置表示 */}
        <PositionBar
          amount={amount}
          min={groupStats.min}
          max={groupStats.max}
          median={groupStats.median}
        />

        {/* パーセンタイル表示 */}
        <div className="text-xs text-gray-600">
          上位{" "}
          <span className="font-medium">{(100 - percentile).toFixed(0)}%</span>{" "}
          の含有量
        </div>
      </div>
    </div>
  );
}

function getRatioColorClass(ratio: number): string {
  if (ratio < 0.5) return "text-red-600";
  if (ratio < 0.8) return "text-orange-600";
  if (ratio < 1.2) return "text-green-600";
  if (ratio < 2.0) return "text-blue-600";
  return "text-purple-600";
}

function getRatioDescription(ratio: number): string {
  if (ratio < 0.5) return "（かなり少なめ）";
  if (ratio < 0.8) return "（少なめ）";
  if (ratio < 1.2) return "（標準的）";
  if (ratio < 2.0) return "（多め）";
  return "（かなり多め）";
}

function calculatePercentile(
  amount: number,
  stats: { min: number; max: number },
): number {
  if (stats.max === stats.min) return 50;
  return ((amount - stats.min) / (stats.max - stats.min)) * 100;
}

function PositionBar({
  amount,
  min,
  max,
  median,
}: {
  amount: number;
  min: number;
  max: number;
  median: number;
}) {
  const range = max - min;
  if (range === 0) return null;

  const amountPosition = ((amount - min) / range) * 100;
  const medianPosition = ((median - min) / range) * 100;

  return (
    <div className="relative mt-4">
      <div className="h-2 bg-gradient-to-r from-red-200 via-green-200 to-blue-200 rounded-full" />

      {/* Median marker */}
      <div
        className="absolute top-0 w-0.5 h-2 bg-gray-600"
        style={{ left: `${medianPosition}%` }}
        title={`中央値: ${median}mg`}
      />

      {/* Current position marker */}
      <div
        className="absolute -top-1 w-3 h-4 bg-purple-600 rounded transform -translate-x-1/2"
        style={{ left: `${amountPosition}%` }}
        title={`この商品: ${amount}mg`}
      />

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{min.toFixed(0)}mg</span>
        <span className="font-medium">中央値 {median.toFixed(0)}mg</span>
        <span>{max.toFixed(0)}mg</span>
      </div>
    </div>
  );
}

/**
 * Simple Comparison Badge
 * シンプルな比較バッジ（コンパクト表示用）
 */
export function ComparisonBadge({
  ratio,
  className = "",
}: {
  ratio: number;
  className?: string;
}) {
  const getBadgeClass = (ratio: number): string => {
    if (ratio < 0.5) return "bg-red-100 text-red-800 border-red-300";
    if (ratio < 0.8) return "bg-orange-100 text-orange-800 border-orange-300";
    if (ratio < 1.2) return "bg-green-100 text-green-800 border-green-300";
    if (ratio < 2.0) return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-purple-100 text-purple-800 border-purple-300";
  };

  const getLabel = (ratio: number): string => {
    if (ratio < 0.5) return "少量";
    if (ratio < 0.8) return "やや少なめ";
    if (ratio < 1.2) return "標準";
    if (ratio < 2.0) return "多め";
    return "高含有";
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeClass(ratio)} ${className}`}
      title={`中央値の${ratio.toFixed(1)}倍`}
    >
      {getLabel(ratio)} ({ratio.toFixed(1)}x)
    </span>
  );
}
