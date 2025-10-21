"use client";

import {
  Check,
  X,
  Award,
  TrendingUp,
  Shield,
  DollarSign,
  FileText,
} from "lucide-react";
import type { RecommendationResult } from "@/lib/recommendation-engine";
import { SafetyBadge } from "./SafetyAlert";
import { HEALTH_GOAL_LABELS } from "@/lib/recommendation-engine";

interface ProductComparisonTableProps {
  recommendations: RecommendationResult[];
  className?: string;
}

/**
 * スコアを色付きバーで表示
 */
function ScoreBar({ score, label }: { score: number; label: string }) {
  let colorClass = "bg-gray-300";
  if (score >= 80) colorClass = "bg-green-500";
  else if (score >= 60) colorClass = "bg-blue-500";
  else if (score >= 40) colorClass = "bg-amber-500";
  else colorClass = "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{score}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 推薦レベルバッジ
 */
function RecommendationBadge({
  level,
}: {
  level:
    | "highly-recommended"
    | "recommended"
    | "acceptable"
    | "not-recommended";
}) {
  const config = {
    "highly-recommended": {
      label: "強く推奨",
      icon: Award,
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      textColor: "text-white",
    },
    recommended: {
      label: "推奨",
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    acceptable: {
      label: "許容範囲",
      icon: Check,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
    },
    "not-recommended": {
      label: "非推奨",
      icon: X,
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    },
  };

  const { label, icon: Icon, bgColor, textColor } = config[level];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm ${bgColor} ${textColor}`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}

/**
 * ベストバリューバッジ
 */
function BestValueBadge({ isBest }: { isBest: boolean }) {
  if (!isBest) return null;

  return (
    <div className="absolute top-0 right-0 -mt-3 -mr-3 z-10">
      <div className="relative">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-1.5">
          <Award size={16} />
          <span>Best Value</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg blur opacity-50 -z-10" />
      </div>
    </div>
  );
}

export function ProductComparisonTable({
  recommendations,
  className = "",
}: ProductComparisonTableProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        比較する商品がありません
      </div>
    );
  }

  // Best Valueの判定（総合スコア1位かつコストスコア70以上）
  const bestValueProduct = recommendations.find(
    (rec) => rec.rank === 1 && rec.scores.costScore >= 70,
  );

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="inline-block min-w-full align-middle">
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(recommendations.length, 3)}, minmax(300px, 1fr))`,
          }}
        >
          {recommendations.slice(0, 3).map((rec) => {
            const isBestValue = bestValueProduct?.product.id === rec.product.id;

            return (
              <div
                key={rec.product.id}
                className={`relative bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all hover:shadow-xl ${
                  isBestValue ? "border-amber-400" : "border-gray-200"
                }`}
              >
                {/* Best Valueバッジ */}
                <BestValueBadge isBest={isBestValue} />

                {/* ヘッダー */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">
                        ランク #{rec.rank}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">
                        {rec.product.name}
                      </h3>
                      {rec.product.brand && (
                        <p className="text-sm text-gray-600">
                          {rec.product.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 推薦レベル */}
                  <div className="mb-4">
                    <RecommendationBadge level={rec.recommendation} />
                  </div>

                  {/* 総合スコア */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {rec.scores.overallScore}
                      </div>
                      <div className="text-xs text-gray-500">総合スコア</div>
                    </div>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-6 space-y-6">
                  {/* 4スコア詳細 */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <FileText size={16} />
                      評価スコア
                    </h4>
                    <div className="space-y-3">
                      <ScoreBar
                        score={rec.scores.effectivenessScore}
                        label="効果"
                      />
                      <ScoreBar score={rec.scores.safetyScore} label="安全性" />
                      <ScoreBar score={rec.scores.costScore} label="コスト" />
                      <ScoreBar
                        score={rec.scores.evidenceScore}
                        label="エビデンス"
                      />
                    </div>
                  </div>

                  {/* 価格情報 */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-blue-600" />
                      <h4 className="font-semibold text-sm text-blue-900">
                        価格
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-blue-700">1日あたり</span>
                        <span className="text-lg font-bold text-blue-900">
                          ¥{Math.round(rec.scores.costDetails.costPerDayJPY)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-blue-700">1mgあたり</span>
                        <span className="text-sm text-blue-800">
                          ¥
                          {rec.scores.costDetails.costCalculation.costPerMg.toFixed(
                            3,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-blue-700">容器価格</span>
                        <span className="text-sm text-blue-800">
                          ¥{rec.product.priceJPY}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-blue-700">
                          容器あたり
                        </span>
                        <span className="text-sm text-blue-800">
                          {Math.round(
                            rec.scores.costDetails.costCalculation
                              .daysPerContainer,
                          )}
                          日分
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 成分情報 */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      主要成分
                    </h4>
                    <div className="space-y-2">
                      {rec.product.ingredients
                        .slice(0, 3)
                        .map((ingredient, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2"
                          >
                            <span className="text-gray-700">
                              {ingredient.name}
                            </span>
                            <span className="font-medium text-gray-900">
                              {ingredient.amountMgPerServing}mg
                            </span>
                          </div>
                        ))}
                      {rec.product.ingredients.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          他 {rec.product.ingredients.length - 3}成分
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 安全性アラート */}
                  {rec.scores.safetyDetails.hasContraindications && (
                    <div>
                      <SafetyBadge
                        result={rec.scores.safetyDetails.safetyCheckResult}
                      />
                    </div>
                  )}

                  {/* 推薦理由 */}
                  {rec.reasons.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="font-semibold text-sm text-green-900 mb-2 flex items-center gap-2">
                        <Check size={16} />
                        推薦理由
                      </h4>
                      <ul className="space-y-1.5">
                        {rec.reasons.map((reason, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-green-800 flex items-start gap-2"
                          >
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 注意事項 */}
                  {rec.warnings.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <h4 className="font-semibold text-sm text-amber-900 mb-2 flex items-center gap-2">
                        <Shield size={16} />
                        注意事項
                      </h4>
                      <ul className="space-y-1.5">
                        {rec.warnings.map((warning, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-amber-800 flex items-start gap-2"
                          >
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 一致する目標 */}
                  {rec.scores.effectivenessDetails.matchedGoals.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        対応する健康目標
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.scores.effectivenessDetails.matchedGoals.map(
                          (goal) => (
                            <span
                              key={goal}
                              className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                              {HEALTH_GOAL_LABELS[goal]}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* フッター：CTAボタン */}
                <div className="p-6 pt-0">
                  <button
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                      rec.recommendation === "highly-recommended"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg"
                        : rec.recommendation === "recommended"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    詳細を見る
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4商品以上ある場合の注意 */}
      {recommendations.length > 3 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            上位3商品を表示中（全{recommendations.length}商品）
          </p>
        </div>
      )}
    </div>
  );
}
