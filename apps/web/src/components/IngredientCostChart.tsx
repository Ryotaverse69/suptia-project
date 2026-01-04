/**
 * Ingredient Cost Chart Component
 *
 * Phase 2.7-C: UI/UX改善
 * - 成分別の1mgあたりコストを棒グラフで表示
 * - 主要成分トップ5のコスト比較
 * - ホバー時に詳細情報を表示
 */

import React from "react";

interface IngredientCostData {
  name: string;
  amount: number;
  costPerMg: number;
  totalCost: number;
  percentage: number;
}

interface IngredientCostChartProps {
  /** 成分別コストデータ */
  ingredients: IngredientCostData[];
  /** 商品の合計価格 */
  totalPrice: number;
  /** カスタムクラス名 */
  className?: string;
}

export function IngredientCostChart({
  ingredients,
  totalPrice,
  className = "",
}: IngredientCostChartProps) {
  if (ingredients.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="text-sm text-gray-500">コストデータがありません</p>
      </div>
    );
  }

  const maxCostPerMg = Math.max(...ingredients.map((ing) => ing.costPerMg));

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        成分別コスト分析
      </h3>

      <div className="space-y-3">
        {ingredients.map((ing, index) => (
          <IngredientCostBar
            key={ing.name}
            data={ing}
            maxCostPerMg={maxCostPerMg}
            rank={index + 1}
          />
        ))}
      </div>

      {/* サマリー */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">合計価格</p>
            <p className="text-lg font-bold text-gray-900">
              ¥{totalPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">分析成分数</p>
            <p className="text-lg font-bold text-gray-900">
              {ingredients.length}成分
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IngredientCostBar({
  data,
  maxCostPerMg,
  rank,
}: {
  data: IngredientCostData;
  maxCostPerMg: number;
  rank: number;
}) {
  const barWidth = (data.costPerMg / maxCostPerMg) * 100;

  const getBarColor = (rank: number): string => {
    if (rank === 1) return "bg-purple-500";
    if (rank === 2) return "bg-blue-500";
    if (rank === 3) return "bg-green-500";
    return "bg-gray-400";
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">#{rank}</span>
          <span className="text-sm font-medium text-gray-900">{data.name}</span>
        </div>
        <span className="text-xs text-gray-600">{data.amount}mg</span>
      </div>

      <div className="relative">
        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className={`h-full ${getBarColor(rank)} transition-all duration-500 ease-out group-hover:opacity-80`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
          <span className="text-white drop-shadow">
            ¥{data.costPerMg.toFixed(3)}/mg
          </span>
          <span className="text-gray-700">{data.percentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* Hover detail */}
      <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="text-xs text-gray-600 flex items-center justify-between px-1">
          <span>この成分のコスト: ¥{data.totalCost.toFixed(2)}</span>
          <span>全体の{data.percentage.toFixed(1)}%を占める</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Cost Per Serving Comparison
 * 1日分あたりのコスト比較
 */
export function CostPerServingCard({
  dailyCost,
  monthlyCost,
  costPerMajorIngredient,
  className = "",
}: {
  dailyCost: number;
  monthlyCost: number;
  costPerMajorIngredient: number;
  className?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 ${className}`}
    >
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        コストパフォーマンス
      </h4>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-600">1日あたり</p>
          <p className="text-lg sm:text-xl font-bold text-blue-600">
            ¥{dailyCost.toFixed(0)}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-600">30日分</p>
          <p className="text-lg sm:text-xl font-bold text-purple-600">
            ¥{monthlyCost.toFixed(0)}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-600 truncate">
            主要成分/mg
          </p>
          <p className="text-lg sm:text-xl font-bold text-green-600">
            ¥{costPerMajorIngredient.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Cost Efficiency Badge
 * コスパ効率バッジ
 */
export function CostEfficiencyBadge({
  costPerMg,
  groupMedianCostPerMg,
  className = "",
}: {
  costPerMg: number;
  groupMedianCostPerMg: number;
  className?: string;
}) {
  const efficiency = groupMedianCostPerMg / costPerMg; // Higher is better
  const label = getEfficiencyLabel(efficiency);
  const badgeClass = getEfficiencyBadgeClass(efficiency);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
      >
        {label}
      </span>
      <span className="text-xs text-gray-600">
        中央値の{efficiency.toFixed(1)}倍お得
      </span>
    </div>
  );
}

function getEfficiencyLabel(efficiency: number): string {
  if (efficiency >= 2.0) return "超高コスパ";
  if (efficiency >= 1.5) return "高コスパ";
  if (efficiency >= 1.2) return "良コスパ";
  if (efficiency >= 0.8) return "標準的";
  return "やや割高";
}

function getEfficiencyBadgeClass(efficiency: number): string {
  if (efficiency >= 2.0)
    return "bg-purple-100 text-purple-800 border border-purple-300";
  if (efficiency >= 1.5)
    return "bg-blue-100 text-blue-800 border border-blue-300";
  if (efficiency >= 1.2)
    return "bg-green-100 text-green-800 border border-green-300";
  if (efficiency >= 0.8)
    return "bg-gray-100 text-gray-800 border border-gray-300";
  return "bg-orange-100 text-orange-800 border border-orange-300";
}
