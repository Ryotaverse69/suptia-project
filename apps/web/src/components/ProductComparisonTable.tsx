"use client";

import Link from "next/link";
import Image from "next/image";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {recommendations.map((rec, index) => (
          <Link
            key={rec.product.id}
            href={`/products/${rec.product.slug || rec.product.id}`}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all relative block group cursor-pointer"
          >
            {/* ランキング順位 */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <div
                className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-white text-sm sm:text-base ${
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
              <div className="mb-3 sm:mb-4 flex justify-center pt-6 sm:pt-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                  <Image
                    src={rec.product.imageUrl}
                    alt={rec.product.name}
                    fill
                    className="object-cover rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* 商品名 */}
            <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] text-sm sm:text-base group-hover:text-blue-600 transition-colors">
              {rec.product.name}
            </h3>

            {/* ブランド名 */}
            {rec.product.brand && (
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 truncate">
                {rec.product.brand}
              </p>
            )}

            {/* 価格 */}
            <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
              <div className="text-center space-y-1.5 sm:space-y-2">
                {/* 1日あたりの価格 */}
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  ¥{Math.round(rec.scores.costDetails.costPerDayJPY)}
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">
                    /日
                  </span>
                </div>
                {/* 商品価格 */}
                <div className="text-xs sm:text-sm text-gray-600">
                  商品価格: ¥{rec.product.priceJPY?.toLocaleString() || "—"}
                </div>
              </div>
            </div>

            {/* 詳細を見るインジケーター */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 text-center">
              <span className="text-xs sm:text-sm text-blue-600 group-hover:text-blue-700 font-medium">
                詳細を見る →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
