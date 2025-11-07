/**
 * 成分量比較コンポーネント
 * 同じ成分を含む商品の成分量を比較表示
 */

import { BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface IngredientComparisonProps {
  currentProduct: {
    name: string;
    slug?: { current: string };
    imageUrl?: string;
    ingredientAmount: number; // mg
    servingsPerDay: number;
  };
  similarProducts?: Array<{
    name: string;
    slug?: { current: string };
    imageUrl?: string;
    ingredientAmount: number;
    servingsPerDay: number;
  }>;
  ingredientName?: string;
  recommendedDailyIntake?: number; // 推奨摂取量（mg）
  contentRank?: "S" | "A" | "B" | "C" | "D";
  className?: string;
}

export function IngredientComparison({
  currentProduct,
  similarProducts = [],
  ingredientName = "主要成分",
  recommendedDailyIntake,
  contentRank,
  className = "",
}: IngredientComparisonProps) {
  // ランク情報の定義
  const rankInfo: Record<
    string,
    {
      color: string;
      bgColor: string;
      borderColor: string;
      textColor: string;
      label: string;
      description: string;
    }
  > = {
    S: {
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      label: "最高含有量",
      description: "最も多くの成分を含んでいます",
    },
    A: {
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      label: "高含有量",
      description: "豊富な成分量を含んでいます",
    },
    B: {
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      label: "標準含有量",
      description: "標準的な成分量です",
    },
    C: {
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      label: "やや少なめ",
      description: "成分量がやや少なめです",
    },
    D: {
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      label: "少なめ",
      description: "成分量が少なめです",
    },
  };

  const currentRankInfo = contentRank ? rankInfo[contentRank] : null;

  // 1日あたりの成分量を計算
  const currentDailyAmount =
    currentProduct.ingredientAmount * currentProduct.servingsPerDay;

  // 類似商品を成分量でソート
  const sortedProducts = [
    { ...currentProduct, dailyAmount: currentDailyAmount, isCurrent: true },
    ...similarProducts.map((p) => ({
      ...p,
      dailyAmount: p.ingredientAmount * p.servingsPerDay,
      isCurrent: false,
    })),
  ].sort((a, b) => b.dailyAmount - a.dailyAmount);

  // 最大値を取得（グラフのスケール用）
  const maxAmount = Math.max(...sortedProducts.map((p) => p.dailyAmount));

  return (
    <div
      className={`bg-white border border-primary-200 rounded-xl shadow-sm p-6 ${className}`}
    >
      <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
        <BarChart3 size={24} />
        {ingredientName}の含有量比較
      </h2>

      {/* ランクバッジ */}
      {currentRankInfo && (
        <div
          className={`mb-4 p-4 rounded-xl bg-gradient-to-r ${currentRankInfo.color}`}
        >
          <div className="text-white">
            <p className="text-xl font-bold mb-1">{contentRank}ランク</p>
            <p className="text-base opacity-90">{currentRankInfo.label}</p>
          </div>
        </div>
      )}

      {/* ランク説明 */}
      {currentRankInfo && (
        <div
          className={`mb-6 p-4 rounded-lg ${currentRankInfo.bgColor} border ${currentRankInfo.borderColor}`}
        >
          <p className={`text-sm ${currentRankInfo.textColor}`}>
            {currentRankInfo.description}
          </p>
        </div>
      )}

      {/* 推奨摂取量の表示 */}
      {recommendedDailyIntake && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>推奨1日摂取量:</strong>{" "}
            {recommendedDailyIntake.toLocaleString()}mg
          </p>
          <p className="text-xs text-blue-700 mt-1">
            この商品は推奨摂取量の
            <strong>
              {((currentDailyAmount / recommendedDailyIntake) * 100).toFixed(0)}
              %
            </strong>
            を提供します。
          </p>
        </div>
      )}

      {/* 比較の結果（比較セクションの上に表示） */}
      {sortedProducts.length > 1 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-base font-semibold text-blue-900 mb-2">
            比較の結果
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            {contentRank ? (
              // contentRankが指定されている場合は、全体評価を表示
              <>
                この商品の含有量は全体で
                <strong className="mx-1">{contentRank}ランク</strong>
                です。{currentRankInfo && currentRankInfo.description}
                {sortedProducts.length > 1 && (
                  <span className="ml-1 text-gray-700">
                    （表示中の類似商品{sortedProducts.length}件では第
                    {sortedProducts.findIndex((p) => p.isCurrent) + 1}位）
                  </span>
                )}
              </>
            ) : (
              // contentRankがない場合は、ローカル比較のみ
              <>
                この商品は{sortedProducts.length}商品中
                <strong className="mx-1">
                  第{sortedProducts.findIndex((p) => p.isCurrent) + 1}位
                </strong>
                の含有量です。
                {sortedProducts[0].isCurrent && (
                  <span className="ml-1 text-green-700 font-semibold">
                    最も多くの{ingredientName}を含んでいます！
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      )}

      {/* 商品別の成分量バー */}
      <div className="space-y-4">
        {sortedProducts.map((product, index) => {
          const percentage = (product.dailyAmount / maxAmount) * 100;
          const isHighest = index === 0;

          const productContent = (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                {/* 商品画像 */}
                <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-2xl opacity-30">📦</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-semibold break-words leading-tight mb-1 ${
                          product.isCurrent
                            ? "text-primary"
                            : "text-primary-700"
                        }`}
                      >
                        {product.name}
                        {product.isCurrent && " (この商品)"}
                      </div>
                      {isHighest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full">
                          <TrendingUp size={12} />
                          最高含有量
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-primary-900 whitespace-nowrap flex-shrink-0 ml-2">
                      {product.dailyAmount.toLocaleString()}mg/日
                    </span>
                  </div>

                  {/* プログレスバー */}
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative mb-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        product.isCurrent
                          ? "bg-gradient-to-r from-primary to-primary-700"
                          : isHighest
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-blue-300 to-blue-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="flex items-center justify-end h-full pr-3">
                        <span className="text-white text-xs font-bold">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 詳細情報 */}
                  <div className="flex items-center gap-4 text-xs text-primary-600">
                    <span>1回分: {product.ingredientAmount}mg</span>
                    <span>×</span>
                    <span>1日{product.servingsPerDay}回</span>
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <div key={product.name}>
              {!product.isCurrent && product.slug?.current ? (
                <Link
                  href={`/products/${product.slug.current}`}
                  className="block hover:opacity-80 transition-opacity"
                >
                  {productContent}
                </Link>
              ) : (
                productContent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
