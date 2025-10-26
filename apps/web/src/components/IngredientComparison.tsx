/**
 * 成分量比較コンポーネント
 * 同じ成分を含む商品の成分量を比較表示
 */

import { BarChart3, TrendingUp } from "lucide-react";

interface IngredientComparisonProps {
  currentProduct: {
    name: string;
    ingredientAmount: number; // mg
    servingsPerDay: number;
  };
  similarProducts?: Array<{
    name: string;
    ingredientAmount: number;
    servingsPerDay: number;
  }>;
  ingredientName?: string;
  recommendedDailyIntake?: number; // 推奨摂取量（mg）
  className?: string;
}

export function IngredientComparison({
  currentProduct,
  similarProducts = [],
  ingredientName = "主要成分",
  recommendedDailyIntake,
  className = "",
}: IngredientComparisonProps) {
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

      {/* 商品別の成分量バー */}
      <div className="space-y-4">
        {sortedProducts.map((product, index) => {
          const percentage = (product.dailyAmount / maxAmount) * 100;
          const isHighest = index === 0;

          return (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      product.isCurrent ? "text-primary" : "text-primary-700"
                    }`}
                  >
                    {product.name}
                    {product.isCurrent && " (この商品)"}
                  </span>
                  {isHighest && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      📊 最高含有量
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-primary-900">
                  {product.dailyAmount.toLocaleString()}mg/日
                </span>
              </div>

              {/* プログレスバー */}
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
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
          );
        })}
      </div>

      {/* サマリー */}
      {sortedProducts.length > 1 && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start gap-2">
            <TrendingUp size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-primary-800">
              <p className="font-semibold mb-1">比較結果</p>
              <p>
                この商品は{sortedProducts.length}商品中
                <strong>
                  第{sortedProducts.findIndex((p) => p.isCurrent) + 1}位
                </strong>
                の含有量です。
                {sortedProducts[0].isCurrent && (
                  <span className="ml-1 text-green-700 font-bold">
                    最も多くの{ingredientName}を含んでいます！
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
