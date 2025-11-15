/**
 * RDA Fulfillment Heatmap Component
 *
 * Phase 2.7-C: UI/UX改善
 * - 成分ごとのRDA充足率を色分けして表示
 * - 緑（適正範囲）、オレンジ（やや過剰）、赤（過剰注意）
 * - ツールチップで詳細情報を表示
 */

import React from "react";
import { calculateRdaFulfillment } from "@/lib/nutrition-score";

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
      <div className={`text-center py-6 ${className}`}>
        <p className="text-sm text-gray-500">RDAデータがある成分がありません</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* RDAの説明セクション */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-base font-semibold text-blue-900 mb-2">
          📊 RDA充足率とは？
        </h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>RDA（Recommended Dietary Allowance）</strong>
          は、厚生労働省が定める「推奨1日摂取量」です。
          この商品に含まれる各成分が、1日に必要な量の何%を満たしているかを示しています。
        </p>
        <ul className="mt-2 text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>
            <strong>100%</strong> = 1日に必要な量をちょうど満たしている
          </li>
          <li>
            <strong>50%</strong> = 1日に必要な量の半分を満たしている
          </li>
          <li>
            <strong>200%</strong> = 1日に必要な量の2倍を含んでいる
          </li>
        </ul>
      </div>

      <h4 className="text-sm font-medium text-gray-700 mb-3">
        成分別RDA充足率
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {ingredientsWithRda.map((ing) => (
          <RdaCell
            key={ing.name}
            name={ing.name}
            amount={ing.amount}
            fulfillment={ing.fulfillment}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>適正（≤100%）</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>やや過剰（100-300%）</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>過剰注意（≥300%）</span>
        </div>
      </div>
    </div>
  );
}

function RdaCell({
  name,
  amount,
  fulfillment,
}: {
  name: string;
  amount: number;
  fulfillment: number;
}) {
  const getColorClass = (fulfillment: number): string => {
    if (fulfillment <= 100) return "bg-green-500 text-white";
    if (fulfillment <= 300) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  const getStatusText = (fulfillment: number): string => {
    if (fulfillment <= 50) return "不足気味";
    if (fulfillment <= 100) return "適正";
    if (fulfillment <= 150) return "やや多め";
    if (fulfillment <= 300) return "過剰";
    return "要注意";
  };

  return (
    <div
      className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 cursor-help ${getColorClass(fulfillment)}`}
      title={`${name}: ${amount}mg (RDA ${fulfillment.toFixed(0)}% - ${getStatusText(fulfillment)})`}
    >
      <p className="text-xs font-medium truncate">{name}</p>
      <p className="text-lg font-bold mt-1">{fulfillment.toFixed(0)}%</p>
      <p className="text-xs opacity-90">{getStatusText(fulfillment)}</p>
    </div>
  );
}

/**
 * RDA Fulfillment Gauge Component
 * 単一成分のRDA充足率をゲージで表示
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

  if (fulfillment === null) {
    return null;
  }

  const getBarColor = (fulfillment: number): string => {
    if (fulfillment <= 100) return "bg-green-500";
    if (fulfillment <= 300) return "bg-orange-500";
    return "bg-red-500";
  };

  const displayPercentage = Math.min(fulfillment, 400); // Cap at 400% for display

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-bold text-gray-900">
          {fulfillment.toFixed(0)}% RDA
        </span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        {/* Background markers */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-gray-300" />
          <div className="w-1/4 border-r border-gray-300" />
          <div className="w-1/4 border-r border-gray-300" />
          <div className="w-1/4" />
        </div>
        {/* Progress bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(fulfillment)}`}
          style={{ width: `${(displayPercentage / 400) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>0%</span>
        <span>100%</span>
        <span>200%</span>
        <span>300%</span>
        <span>400%+</span>
      </div>
    </div>
  );
}
