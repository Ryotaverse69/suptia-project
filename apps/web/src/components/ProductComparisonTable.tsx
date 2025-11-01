"use client";

import type { RecommendationResult } from "@/lib/recommendation-engine";

interface ProductComparisonTableProps {
  recommendations: RecommendationResult[];
  className?: string;
}

/**
 * トップ3商品の簡易比較表示
 * シンプルなグリッド形式で商品情報を表示
 */
export function ProductComparisonTable({
  recommendations,
  className = "",
}: ProductComparisonTableProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        おすすめトップ3
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div
            key={rec.product.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
          >
            {/* ランキング順位 */}
            <div className="absolute top-4 left-4">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                      ? "bg-gray-400"
                      : "bg-orange-400"
                }`}
              >
                {index + 1}
              </div>
            </div>

            {/* 商品画像 */}
            {rec.product.imageUrl && (
              <div className="mb-4 flex justify-center pt-8">
                <img
                  src={rec.product.imageUrl}
                  alt={rec.product.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* 商品名 */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
              {rec.product.name}
            </h3>

            {/* ブランド名 */}
            {rec.product.brand && (
              <p className="text-sm text-gray-600 mb-4">
                {rec.product.brand}
              </p>
            )}

            {/* 価格 */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="text-center space-y-2">
                {/* 1日あたりの価格 */}
                <div className="text-2xl font-bold text-gray-900">
                  ¥{Math.round(rec.scores.costDetails.costPerDayJPY)}
                  <span className="text-sm text-gray-500 ml-1">/日</span>
                </div>
                {/* 商品価格 */}
                <div className="text-sm text-gray-600">
                  商品価格: ¥{rec.product.priceJPY?.toLocaleString() || "—"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
