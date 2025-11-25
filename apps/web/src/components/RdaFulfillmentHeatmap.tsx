/**
 * RDA Fulfillment Heatmap Component
 *
 * RDA（推奨摂取量）の充足率を視覚化するコンポーネント
 * モダンでクリーンなデザイン
 */

import React from "react";
import {
  calculateRdaFulfillment,
  getRdaData,
  exceedsTolerableUpperLimit,
} from "@/lib/nutrition-score";
import { Info, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

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
      const rdaData = getRdaData(ing.name);
      const exceedsUL = exceedsTolerableUpperLimit(ing.name, ing.amount);

      return fulfillment !== null && rdaData
        ? {
            ...ing,
            fulfillment,
            rdaValue: rdaData.rda[gender],
            unit: rdaData.rda.unit,
            exceedsUL: exceedsUL === true,
            ulValue: rdaData.ul?.value,
          }
        : null;
    })
    .filter((ing): ing is NonNullable<typeof ing> => ing !== null)
    .slice(0, maxDisplay);

  if (ingredientsWithRda.length === 0) {
    return (
      <div
        className={`text-center py-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed ${className}`}
      >
        <p className="text-sm text-slate-500">
          RDAデータがある成分がありません
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}
    >
      {/* ヘッダー */}
      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                RDA充足率グラフ
              </h4>
              <p className="text-xs text-slate-500">1日の推奨量に対する割合</p>
            </div>
          </div>
        </div>
      </div>

      {/* 説明パネル */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            RDA（推奨摂取量）は、健康な人が1日に摂取することが推奨される栄養素の量です。
            <span className="text-slate-500 block mt-1">
              ※
              100%で1日分の必要量を満たします。300%を超える場合は過剰摂取にご注意ください。
            </span>
          </p>
        </div>
      </div>

      {/* グラフ */}
      <div className="p-4 space-y-3">
        {ingredientsWithRda.map((ing) => (
          <RdaBar
            key={ing.name}
            name={ing.name}
            amount={ing.amount}
            fulfillment={ing.fulfillment}
            rdaValue={ing.rdaValue}
            unit={ing.unit}
            exceedsUL={ing.exceedsUL}
            ulValue={ing.ulValue}
          />
        ))}
      </div>

      {/* 凡例 */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span>適正（≤100%）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500" />
            <span>やや過剰（100-300%）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-500" />
            <span>過剰注意（≥300%）</span>
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
  rdaValue,
  unit,
  exceedsUL,
  ulValue,
}: {
  name: string;
  amount: number;
  fulfillment: number;
  rdaValue: number;
  unit: string;
  exceedsUL: boolean;
  ulValue?: number;
}) {
  // 色の決定
  let barColor = "bg-emerald-500";
  let bgColor = "bg-emerald-100";
  let textColor = "text-emerald-700";
  let statusText = "適正";
  let StatusIcon = CheckCircle;

  if (exceedsUL || fulfillment > 300) {
    barColor = "bg-rose-500";
    bgColor = "bg-rose-100";
    textColor = "text-rose-700";
    statusText = exceedsUL ? "UL超過" : "過剰";
    StatusIcon = AlertTriangle;
  } else if (fulfillment > 100) {
    barColor = "bg-amber-500";
    bgColor = "bg-amber-100";
    textColor = "text-amber-700";
    statusText = "やや過剰";
    StatusIcon = TrendingUp;
  }

  // バーの幅を計算（最大300%まで表示、それ以上は300%で表示）
  const displayPercentage = Math.min(fulfillment, 300);
  const barWidth = (displayPercentage / 300) * 100;

  // RDA値の表示を整形
  const formatRdaValue = (value: number) => {
    if (value < 1) {
      return `${(value * 1000).toFixed(0)}μg`;
    }
    return `${value}${unit}`;
  };

  return (
    <div className="group">
      {/* 成分名と数値 */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-800 truncate">
            {name}
          </span>
          {exceedsUL && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-medium rounded">
              <AlertTriangle className="w-3 h-3" />
              UL超過
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-sm font-bold ${textColor}`}>
            {Math.round(fulfillment)}%
          </span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="relative">
        <div className={`h-6 rounded-lg ${bgColor} overflow-hidden`}>
          <div
            className={`h-full ${barColor} rounded-lg transition-all duration-500 ease-out relative`}
            style={{ width: `${barWidth}%` }}
          >
            {/* 100%マーカー */}
            {fulfillment >= 100 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                style={{ left: `${(100 / 300) * 100}%` }}
              />
            )}
          </div>
        </div>

        {/* 100%位置のマーカーライン */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
          style={{ left: `${(100 / 300) * 100}%` }}
        />
      </div>

      {/* 詳細情報 */}
      <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
        <span>
          {amount}
          {unit} / 推奨 {formatRdaValue(rdaValue)}
        </span>
        <div className="flex items-center gap-1">
          <StatusIcon className={`w-3 h-3 ${textColor}`} />
          <span className={textColor}>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * RDA Fulfillment Gauge Component (Single)
 * 単一成分のRDA充足率を円形ゲージで表示
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
  const rdaData = getRdaData(name);

  if (fulfillment === null || !rdaData) return null;

  // 色の決定
  let strokeColor = "#10b981"; // emerald-500
  let bgColor = "bg-emerald-50";
  let textColor = "text-emerald-700";

  if (fulfillment > 300) {
    strokeColor = "#f43f5e"; // rose-500
    bgColor = "bg-rose-50";
    textColor = "text-rose-700";
  } else if (fulfillment > 100) {
    strokeColor = "#f59e0b"; // amber-500
    bgColor = "bg-amber-50";
    textColor = "text-amber-700";
  }

  const percentage = Math.min(fulfillment, 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="#e2e8f0"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke={strokeColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={100}
            strokeDashoffset={100 - percentage}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={`absolute text-[10px] font-bold ${textColor}`}>
          {Math.round(fulfillment)}%
        </span>
      </div>
      <div>
        <div className="text-xs font-medium text-slate-800">{name}</div>
        <div className="text-[10px] text-slate-500">
          {amount}
          {rdaData.rda.unit} / {rdaData.rda[gender]}
          {rdaData.rda.unit}
        </div>
      </div>
    </div>
  );
}

/**
 * コンパクトなRDA表示
 * 成分詳細モーダルで使用
 */
export function RdaCompactDisplay({
  name,
  amount,
  gender = "male",
}: {
  name: string;
  amount: number;
  gender?: "male" | "female";
}) {
  const fulfillment = calculateRdaFulfillment(name, amount, gender);
  const rdaData = getRdaData(name);
  const exceedsUL = exceedsTolerableUpperLimit(name, amount);

  if (fulfillment === null || !rdaData) {
    return <div className="text-xs text-slate-400 italic">RDAデータなし</div>;
  }

  // 色の決定
  let bgColor = "bg-emerald-100";
  let textColor = "text-emerald-700";
  let statusText = "適正";

  if (exceedsUL || fulfillment > 300) {
    bgColor = "bg-rose-100";
    textColor = "text-rose-700";
    statusText = exceedsUL ? "UL超過注意" : "過剰注意";
  } else if (fulfillment > 100) {
    bgColor = "bg-amber-100";
    textColor = "text-amber-700";
    statusText = "やや過剰";
  }

  // RDA値の表示を整形
  const formatValue = (value: number, unit: string) => {
    if (value < 1) {
      return `${(value * 1000).toFixed(0)}μg`;
    }
    return `${value}${unit}`;
  };

  return (
    <div className="space-y-2">
      {/* 充足率バッジ */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${bgColor} ${textColor}`}
        >
          RDA {Math.round(fulfillment)}%
        </span>
        <span className={`text-xs ${textColor}`}>{statusText}</span>
      </div>

      {/* 詳細 */}
      <div className="text-xs text-slate-600 space-y-1">
        <div className="flex justify-between">
          <span>この商品:</span>
          <span className="font-medium">
            {amount}
            {rdaData.rda.unit}
          </span>
        </div>
        <div className="flex justify-between">
          <span>1日の推奨量:</span>
          <span className="font-medium">
            {formatValue(rdaData.rda[gender], rdaData.rda.unit)}
          </span>
        </div>
        {rdaData.ul && (
          <div className="flex justify-between">
            <span>耐容上限量:</span>
            <span className="font-medium">
              {formatValue(rdaData.ul.value, rdaData.ul.unit)}
            </span>
          </div>
        )}
      </div>

      {/* プログレスバー */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            exceedsUL || fulfillment > 300
              ? "bg-rose-500"
              : fulfillment > 100
                ? "bg-amber-500"
                : "bg-emerald-500"
          }`}
          style={{ width: `${Math.min((fulfillment / 300) * 100, 100)}%` }}
        />
        {/* 100%マーカー */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
          style={{ left: `${(100 / 300) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>0%</span>
        <span>100%</span>
        <span>300%</span>
      </div>
    </div>
  );
}

/**
 * RDA充足率モーダル - リッチなデザイン
 */
export function RdaFulfillmentModal({
  ingredients,
  productName,
  servingsPerDay,
  gender = "male",
}: {
  ingredients: Array<{ name: string; amount: number }>;
  productName: string;
  servingsPerDay: number;
  gender?: "male" | "female";
}) {
  const ingredientsWithRda = ingredients
    .map((ing) => {
      const fulfillment = calculateRdaFulfillment(ing.name, ing.amount, gender);
      const rdaData = getRdaData(ing.name);
      const exceedsUL = exceedsTolerableUpperLimit(ing.name, ing.amount);

      return fulfillment !== null && rdaData
        ? {
            ...ing,
            fulfillment,
            rdaValue: rdaData.rda[gender],
            unit: rdaData.rda.unit,
            category: rdaData.category,
            exceedsUL: exceedsUL === true,
            ulValue: rdaData.ul?.value,
            deficiencyRisks: rdaData.deficiencyRisks,
            excessRisks: rdaData.excessRisks,
          }
        : null;
    })
    .filter((ing): ing is NonNullable<typeof ing> => ing !== null);

  // カテゴリ別にグループ化
  const groupedIngredients = ingredientsWithRda.reduce(
    (acc, ing) => {
      const category = ing.category || "その他";
      if (!acc[category]) acc[category] = [];
      acc[category].push(ing);
      return acc;
    },
    {} as Record<string, typeof ingredientsWithRda>,
  );

  // 統計情報
  const stats = {
    total: ingredientsWithRda.length,
    optimal: ingredientsWithRda.filter(
      (i) => i.fulfillment >= 80 && i.fulfillment <= 150,
    ).length,
    low: ingredientsWithRda.filter((i) => i.fulfillment < 50).length,
    high: ingredientsWithRda.filter((i) => i.fulfillment > 200).length,
    avgFulfillment:
      ingredientsWithRda.length > 0
        ? Math.round(
            ingredientsWithRda.reduce((sum, i) => sum + i.fulfillment, 0) /
              ingredientsWithRda.length,
          )
        : 0,
  };

  const formatValue = (value: number, unit: string) => {
    if (value < 1) return `${(value * 1000).toFixed(0)}μg`;
    return `${value}${unit}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">RDA充足率分析</h2>
            <p className="text-blue-100 text-sm">
              1日の推奨摂取量に対する充足状況
            </p>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="p-6 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.avgFulfillment}%
              </div>
              <div className="text-xs text-slate-500 mt-1">平均充足率</div>
            </div>
            <div className="text-center border-l border-slate-200">
              <div className="text-3xl font-bold text-emerald-600">
                {stats.optimal}
              </div>
              <div className="text-xs text-slate-500 mt-1">適正範囲</div>
            </div>
            <div className="text-center border-l border-slate-200">
              <div className="text-3xl font-bold text-amber-600">
                {stats.low}
              </div>
              <div className="text-xs text-slate-500 mt-1">不足気味</div>
            </div>
            <div className="text-center border-l border-slate-200">
              <div className="text-3xl font-bold text-rose-600">
                {stats.high}
              </div>
              <div className="text-xs text-slate-500 mt-1">過剰注意</div>
            </div>
          </div>
        </div>

        {/* 説明 */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">RDA（推奨摂取量）について</p>
              <p className="text-blue-600 text-xs leading-relaxed">
                RDAは健康な成人が1日に摂取することが推奨される栄養素の量です。
                この商品を1日{servingsPerDay}
                回摂取した場合の充足率を表示しています。
                100%で1日分の必要量を満たします。
              </p>
            </div>
          </div>
        </div>

        {/* カテゴリ別成分リスト */}
        {Object.entries(groupedIngredients).map(([category, ings]) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  category === "ビタミン"
                    ? "bg-purple-500"
                    : category === "ミネラル"
                      ? "bg-cyan-500"
                      : category === "アミノ酸"
                        ? "bg-orange-500"
                        : "bg-slate-400"
                }`}
              />
              {category}
              <span className="text-slate-400 font-normal">
                ({ings.length}種類)
              </span>
            </h3>

            <div className="space-y-3">
              {ings.map((ing) => {
                // 色の決定
                let barColor = "bg-emerald-500";
                let bgColor = "bg-emerald-50";
                let borderColor = "border-emerald-200";
                let textColor = "text-emerald-700";
                let statusText = "適正";
                let StatusIcon = CheckCircle;

                if (ing.exceedsUL || ing.fulfillment > 300) {
                  barColor = "bg-rose-500";
                  bgColor = "bg-rose-50";
                  borderColor = "border-rose-200";
                  textColor = "text-rose-700";
                  statusText = ing.exceedsUL ? "UL超過" : "過剰";
                  StatusIcon = AlertTriangle;
                } else if (ing.fulfillment > 150) {
                  barColor = "bg-amber-500";
                  bgColor = "bg-amber-50";
                  borderColor = "border-amber-200";
                  textColor = "text-amber-700";
                  statusText = "やや過剰";
                  StatusIcon = TrendingUp;
                } else if (ing.fulfillment < 50) {
                  barColor = "bg-slate-400";
                  bgColor = "bg-slate-50";
                  borderColor = "border-slate-200";
                  textColor = "text-slate-600";
                  statusText = "不足気味";
                  StatusIcon = Info;
                }

                const barWidth = Math.min((ing.fulfillment / 300) * 100, 100);

                return (
                  <div
                    key={ing.name}
                    className={`bg-white rounded-xl border ${borderColor} overflow-hidden shadow-sm`}
                  >
                    <div className="p-4">
                      {/* ヘッダー */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {ing.name}
                          </span>
                          {ing.exceedsUL && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              UL超過
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${textColor}`} />
                          <span className={`text-sm font-bold ${textColor}`}>
                            {Math.round(ing.fulfillment)}%
                          </span>
                        </div>
                      </div>

                      {/* プログレスバー */}
                      <div className="relative mb-3">
                        <div className={`h-3 rounded-full ${bgColor}`}>
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        {/* 100%マーカー */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
                          style={{ left: `${(100 / 300) * 100}%` }}
                        />
                      </div>

                      {/* 詳細情報 */}
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <div className="text-slate-500 mb-0.5">この商品</div>
                          <div className="font-bold text-slate-800">
                            {formatValue(ing.amount, ing.unit)}
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <div className="text-blue-500 mb-0.5">推奨量</div>
                          <div className="font-bold text-blue-800">
                            {formatValue(ing.rdaValue, ing.unit)}
                          </div>
                        </div>
                        {ing.ulValue && (
                          <div className="bg-orange-50 rounded-lg p-2 text-center">
                            <div className="text-orange-500 mb-0.5">上限量</div>
                            <div className="font-bold text-orange-800">
                              {formatValue(ing.ulValue, ing.unit)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ステータスフッター */}
                    <div
                      className={`px-4 py-2 ${bgColor} border-t ${borderColor}`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={textColor}>{statusText}</span>
                        <span className="text-slate-500">
                          {ing.fulfillment < 50
                            ? "推奨量の半分以下です"
                            : ing.fulfillment <= 100
                              ? "適正な範囲内です"
                              : ing.fulfillment <= 150
                                ? "十分な量が含まれています"
                                : ing.fulfillment <= 300
                                  ? "やや多めの配合です"
                                  : "過剰摂取に注意してください"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* RDAデータがない成分 */}
        {ingredients.length > ingredientsWithRda.length && (
          <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              RDAデータなしの成分
            </h4>
            <p className="text-xs text-slate-500">
              以下の成分はRDA（推奨摂取量）のデータベースに登録されていないため、充足率を計算できません。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {ingredients
                .filter(
                  (ing) => !ingredientsWithRda.find((r) => r.name === ing.name),
                )
                .map((ing) => (
                  <span
                    key={ing.name}
                    className="px-2 py-1 bg-white rounded text-xs text-slate-600 border border-slate-200"
                  >
                    {ing.name}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* 凡例 */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            充足率の目安
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-400" />
              <span className="text-slate-600">不足気味（50%未満）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-600">適正（50〜150%）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-slate-600">やや過剰（150〜300%）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-slate-600">過剰注意（300%超）</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
