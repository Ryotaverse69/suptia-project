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

      {/* 比較の結果（比較セクションの上に表示） */}
      {sortedProducts.length > 1 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-3xl">📊</div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                比較の結果
              </h3>
              <p className="text-base text-blue-800 leading-relaxed">
                この商品は{sortedProducts.length}商品中
                <strong className="mx-1">
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

      {/* 商品別の成分量バー */}
      <div className="space-y-4">
        {sortedProducts.map((product, index) => {
          const percentage = (product.dailyAmount / maxAmount) * 100;
          const isHighest = index === 0;

          const productContent = (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                {/* 商品画像 */}
                {product.imageUrl && (
                  <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                )}

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
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          📊 最高含有量
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
