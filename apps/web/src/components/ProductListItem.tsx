"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Shield, Award, MapPin } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import { calculateComprehensiveCost } from "@/lib/cost-calculator";

interface ProductListItemProps {
  product: {
    name: string;
    priceJPY: number;
    slug?: {
      current: string;
    } | null;
    servingsPerDay?: number;
    servingsPerContainer?: number;
    ingredients?: Array<{
      amountMgPerServing: number;
    }>;
    effectiveCostPerDay?: number;
    rating?: number;
    reviewCount?: number;
    isBestValue?: boolean;
    safetyScore?: number;
    imageUrl?: string;
    externalImageUrl?: string;
  };
}

export function ProductListItem({ product }: ProductListItemProps) {
  const {
    name,
    priceJPY,
    slug,
    servingsPerDay,
    servingsPerContainer,
    ingredients,
    effectiveCostPerDay: manualCostPerDay,
    rating = 4.5,
    reviewCount = 127,
    isBestValue = false,
    safetyScore = 95,
    imageUrl,
    externalImageUrl,
  } = product;

  // 画像URL: 外部画像URL > imageUrl > プレースホルダー
  const displayImageUrl = externalImageUrl || imageUrl;

  // slugが存在しない場合は商品名をエンコードして使用
  const productSlug =
    slug?.current ||
    encodeURIComponent((name || "product").toLowerCase().replace(/\s+/g, "-"));

  // 実効コストを自動計算（データが揃っている場合）
  let calculatedCost;
  if (
    servingsPerDay &&
    servingsPerContainer &&
    ingredients &&
    ingredients.length > 0
  ) {
    calculatedCost = calculateComprehensiveCost({
      priceJPY,
      servingsPerDay,
      servingsPerContainer,
      ingredients,
    });
  }

  // 計算されたコストまたは手動で渡されたコストを使用
  const effectiveCostPerDay = calculatedCost?.costPerDay ?? manualCostPerDay;

  // 評価スコアの色を決定
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return "bg-green-600 text-white";
    if (score >= 7.0) return "bg-green-500 text-white";
    if (score >= 6.0) return "bg-yellow-500 text-white";
    return "bg-orange-500 text-white";
  };

  return (
    <div className="bg-white rounded-xl border border-primary-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* 左側：商品画像 */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0">
          <Link href={`/products/${productSlug}`}>
            <div className="relative w-full h-full overflow-hidden bg-gradient-blue">
              {displayImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImageUrl}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-3 opacity-40">📦</div>
                    <p className="text-sm text-gray-400 font-medium">
                      画像準備中
                    </p>
                  </div>
                </div>
              )}

              {/* バッジ */}
              {isBestValue && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge
                    variant="bestValue"
                    className="flex items-center gap-1.5 shadow-soft px-3 py-1.5 font-semibold text-xs"
                  >
                    <TrendingUp size={14} />
                    ベストバリュー
                  </Badge>
                </div>
              )}

              {safetyScore >= 90 && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    variant="success"
                    className="flex items-center gap-1.5 shadow-soft px-3 py-1.5 font-semibold text-xs"
                  >
                    <Shield size={14} />
                    高安全性
                  </Badge>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* 右側：商品情報 */}
        <div className="flex-1 flex flex-col md:flex-row p-5">
          {/* 商品詳細 */}
          <div className="flex-1 pr-0 md:pr-6 mb-4 md:mb-0">
            <Link href={`/products/${productSlug}`}>
              <div className="mb-3">
                {/* 星評価バッジ */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-500 text-lg">
                    {"★".repeat(Math.floor(rating))}
                    {"☆".repeat(5 - Math.floor(rating))}
                  </span>
                  <span className="text-sm text-primary-600">ホテル</span>
                </div>

                {/* 商品名 */}
                <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {name}
                </h3>
              </div>

              {/* 説明文（簡易版） */}
              <div className="mb-3">
                <p className="text-sm text-primary-700 line-clamp-2">
                  {servingsPerContainer && servingsPerDay && (
                    <>
                      1容器あたり{servingsPerContainer}回分、1日{servingsPerDay}
                      回摂取
                    </>
                  )}
                </p>
              </div>

              {/* 場所情報（モック） */}
              <div className="flex items-center gap-2 text-sm text-primary-600 mb-3">
                <MapPin size={16} />
                <span>オンライン購入可能</span>
              </div>

              {/* 評価スコア */}
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded font-bold text-sm ${getScoreColor(rating)}`}
                >
                  {rating.toFixed(1)}
                </div>
                <span className="text-sm text-primary-700">
                  満足 ({reviewCount.toLocaleString()}件の評価)
                </span>
              </div>
            </Link>
          </div>

          {/* 価格とボタン */}
          <div className="flex flex-row md:flex-col items-end md:items-end justify-between md:justify-end md:w-48 flex-shrink-0">
            {/* 価格表示 */}
            <div className="text-right mb-4 space-y-3">
              {/* 商品価格 */}
              <div>
                <div className="text-xs text-gray-500 mb-1">商品価格</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCostJPY(priceJPY)}
                </div>
              </div>

              {/* 1日あたり価格 */}
              {effectiveCostPerDay && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">最安値</div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCostJPY(effectiveCostPerDay)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">1日あたり</div>
                </div>
              )}
            </div>

            {/* 比較するボタン */}
            <Link
              href={`/products/${productSlug}`}
              className="bg-primary hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              比較する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
