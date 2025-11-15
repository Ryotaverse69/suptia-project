/**
 * Nutrition Score Badge Component
 *
 * Phase 2.7-C: UI/UX改善
 * - 栄養価スコアをS/A/B/C/Dのグレードで表示
 * - RDA充足率×エビデンススコアに基づく総合評価
 * - 色分けで視覚的に分かりやすく表示
 *
 * スコア正規化:
 * - calculateNutritionScore()は累積スコア（成分数に依存）を返す
 * - 成分数で割って平均品質（0-100）に正規化
 * - これにより成分数が異なる商品間で公平に比較可能
 */

import React from "react";
import { calculateNutritionScore } from "@/lib/nutrition-score";

type NutritionGrade = "S" | "A" | "B" | "C" | "D";

interface NutritionScoreBadgeProps {
  /** 栄養価スコア（0-100、正規化済み） */
  score: number;
  /** サイズ（デフォルト: md） */
  size?: "sm" | "md" | "lg";
  /** 詳細表示（スコア数値を表示） */
  showScore?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

interface NutritionScoreCardProps {
  /** 成分配列（名前、量、エビデンスレベル） */
  ingredients: Array<{
    name: string;
    amount: number;
    evidenceLevel: string;
  }>;
  /** 性別（デフォルト: male） */
  gender?: "male" | "female";
  /** カスタムクラス名 */
  className?: string;
}

/**
 * スコアからグレードを判定
 */
function getGradeFromScore(score: number): NutritionGrade {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
}

/**
 * グレードに応じた色クラスを取得
 */
function getGradeColorClass(grade: NutritionGrade): string {
  switch (grade) {
    case "S":
      return "bg-gradient-to-br from-purple-500 to-purple-700 text-white border-purple-600";
    case "A":
      return "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-600";
    case "B":
      return "bg-gradient-to-br from-green-500 to-green-700 text-white border-green-600";
    case "C":
      return "bg-gradient-to-br from-orange-500 to-orange-700 text-white border-orange-600";
    case "D":
      return "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-600";
  }
}

/**
 * グレードの説明文を取得
 */
function getGradeDescription(grade: NutritionGrade): string {
  switch (grade) {
    case "S":
      return "優れた栄養価 - RDA充足率とエビデンスの両方が高水準";
    case "A":
      return "良好な栄養価 - 十分なRDA充足率またはエビデンス";
    case "B":
      return "標準的な栄養価 - 基本的な栄養補給に適している";
    case "C":
      return "限定的な栄養価 - 一部の成分のみ含有";
    case "D":
      return "低い栄養価 - 推奨量が不十分またはエビデンスが弱い";
  }
}

/**
 * サイズに応じたクラスを取得
 */
function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-1 min-w-[2rem]";
    case "md":
      return "text-sm px-3 py-1.5 min-w-[2.5rem]";
    case "lg":
      return "text-base px-4 py-2 min-w-[3rem]";
  }
}

/**
 * Nutrition Score Badge
 * 栄養価スコアをグレードバッジで表示
 */
export function NutritionScoreBadge({
  score,
  size = "md",
  showScore = false,
  className = "",
}: NutritionScoreBadgeProps) {
  const grade = getGradeFromScore(score);
  const colorClass = getGradeColorClass(grade);
  const sizeClass = getSizeClasses(size);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border-2 font-bold ${colorClass} ${sizeClass} ${className}`}
      title={getGradeDescription(grade)}
    >
      <span>{grade}</span>
      {showScore && (
        <span className="ml-1 text-xs opacity-90">({score.toFixed(0)})</span>
      )}
    </div>
  );
}

/**
 * Nutrition Score Card
 * 栄養価スコアを詳細に表示するカード
 */
export function NutritionScoreCard({
  ingredients,
  gender = "male",
  className = "",
}: NutritionScoreCardProps) {
  const result = calculateNutritionScore(ingredients, gender);

  // スコアを正規化（成分数で割って平均品質を算出）
  const normalizedScore =
    result.ingredientScores.length > 0
      ? result.totalScore / result.ingredientScores.length
      : 0;

  const grade = getGradeFromScore(normalizedScore);
  const description = getGradeDescription(grade);

  return (
    <div className={`bg-white rounded-lg border-2 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">栄養価スコア</h3>
        <NutritionScoreBadge score={normalizedScore} size="lg" />
      </div>

      <div className="space-y-4">
        {/* スコア表示 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">平均品質スコア</span>
          <span className="text-2xl font-bold text-gray-900">
            {normalizedScore.toFixed(1)}
          </span>
        </div>

        {/* プログレスバー */}
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getGradeColorClass(grade).split(" ")[0]}`}
            style={{ width: `${Math.min(normalizedScore, 100)}%` }}
          />
        </div>

        {/* 説明文 */}
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>

        {/* グレード基準 */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">グレード基準</p>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="flex flex-col items-center">
              <NutritionScoreBadge score={90} size="sm" />
              <span className="mt-1 text-gray-600">90+</span>
            </div>
            <div className="flex flex-col items-center">
              <NutritionScoreBadge score={75} size="sm" />
              <span className="mt-1 text-gray-600">75+</span>
            </div>
            <div className="flex flex-col items-center">
              <NutritionScoreBadge score={60} size="sm" />
              <span className="mt-1 text-gray-600">60+</span>
            </div>
            <div className="flex flex-col items-center">
              <NutritionScoreBadge score={45} size="sm" />
              <span className="mt-1 text-gray-600">45+</span>
            </div>
            <div className="flex flex-col items-center">
              <NutritionScoreBadge score={30} size="sm" />
              <span className="mt-1 text-gray-600">&lt;45</span>
            </div>
          </div>
        </div>

        {/* トップ5貢献成分 */}
        {result.ingredientScores.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>🏆</span>
              <span>トップ5貢献成分</span>
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              この商品の栄養価スコアに最も貢献している成分です（RDA充足率×エビデンススコア）
            </p>
            <div className="space-y-2">
              {[...result.ingredientScores]
                .sort((a, b) => b.contributionScore - a.contributionScore)
                .slice(0, 5)
                .map((ing, index) => (
                  <div key={ing.name} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {ing.name}
                        </span>
                        <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                          {ing.contributionScore.toFixed(1)}点
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
                        <span>RDA: {ing.rdaFulfillment.toFixed(0)}%</span>
                        <span>•</span>
                        <span>エビデンス: {ing.evidenceScore}点</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* カテゴリ別スコア */}
        {Object.keys(result.categoryScores).length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>📂</span>
              <span>カテゴリ別スコア</span>
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              成分カテゴリごとの平均品質スコアです
            </p>
            <div className="space-y-3">
              {Object.entries(result.categoryScores)
                .sort(([, a], [, b]) => b.averageScore - a.averageScore)
                .map(([category, data]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category}
                        <span className="text-xs text-gray-500 ml-1">
                          ({data.count}成分)
                        </span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {data.averageScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{
                          width: `${Math.min(data.averageScore, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Nutrition Score Comparison
 * 複数商品の栄養価スコアを比較表示
 */
export function NutritionScoreComparison({
  products,
  gender = "male",
  className = "",
}: {
  products: Array<{
    id: string;
    name: string;
    ingredients: Array<{
      name: string;
      amount: number;
      evidenceLevel: string;
    }>;
  }>;
  gender?: "male" | "female";
  className?: string;
}) {
  const productsWithScores = products.map((product) => {
    const result = calculateNutritionScore(product.ingredients, gender);
    const normalizedScore =
      result.ingredientScores.length > 0
        ? result.totalScore / result.ingredientScores.length
        : 0;

    return {
      ...product,
      score: normalizedScore,
      grade: getGradeFromScore(normalizedScore),
    };
  });

  // スコア順にソート
  const sortedProducts = [...productsWithScores].sort(
    (a, b) => b.score - a.score,
  );

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        栄養価スコア比較
      </h3>

      <div className="space-y-3">
        {sortedProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-gray-500">
                #{index + 1}
              </span>
              <span className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">
                {product.score.toFixed(1)}
              </span>
              <NutritionScoreBadge score={product.score} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* 平均スコア */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">平均スコア</span>
          <span className="text-lg font-bold text-gray-900">
            {(
              sortedProducts.reduce((sum, p) => sum + p.score, 0) /
              sortedProducts.length
            ).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Nutrition Score
 * 商品カード等で使用するコンパクト表示
 */
export function InlineNutritionScore({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const grade = getGradeFromScore(score);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-600">栄養価</span>
      <NutritionScoreBadge score={score} size="sm" showScore />
    </div>
  );
}
