"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { TrendingUp, Shield, Award, Sparkles } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import {
  calculateComprehensiveCost,
  getCostEfficiencyLabel,
} from "@/lib/cost-calculator";
import { BadgeType, getBadgeInfo, isPerfectSupplement } from "@/lib/badges";

interface ProductCardProps {
  product: {
    name: string;
    priceJPY: number;
    slug: {
      current: string;
    };
    servingsPerDay?: number;
    servingsPerContainer?: number;
    ingredients?: Array<{
      amountMgPerServing: number;
      ingredient?: {
        name: string;
        nameEn: string;
        category?: string;
      };
    }>;
    effectiveCostPerDay?: number; // 後方互換性のため残す
    rating?: number;
    reviewCount?: number;
    isBestValue?: boolean;
    safetyScore?: number;
    imageUrl?: string;
    externalImageUrl?: string;
    badges?: BadgeType[]; // 称号バッジ
  };
}

export function ProductCard({ product }: ProductCardProps) {
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
    badges = [],
  } = product;

  // 完璧なサプリメント判定
  const isPerfect = isPerfectSupplement(badges);

  // 画像URL: 外部画像URL > imageUrl > プレースホルダー
  const displayImageUrl = externalImageUrl || imageUrl;

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

  return (
    <Link href={`/products/${slug.current}`}>
      <Card className="group cursor-pointer overflow-hidden h-full flex flex-col hover:scale-[1.02]">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-blue">
          {/* Product image */}
          {displayImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImageUrl}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="text-5xl mb-2 opacity-40">📦</div>
                <p className="text-xs text-gray-400 font-medium">画像準備中</p>
              </div>
            </div>
          )}

          {/* 5冠達成バッジ */}
          {isPerfect && (
            <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                <Sparkles size={16} className="animate-spin" />
                <span className="font-bold text-sm">
                  🏆 5冠達成！完璧なサプリメント
                </span>
                <Sparkles size={16} className="animate-spin" />
              </div>
            </div>
          )}

          {/* 称号バッジ（最大3つまで表示） */}
          {!isPerfect && badges.length > 0 && (
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2">
              {badges.slice(0, 3).map((badgeType) => {
                const badgeInfo = getBadgeInfo(badgeType);
                return (
                  <div
                    key={badgeType}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border-2 backdrop-blur-sm ${badgeInfo.color}`}
                  >
                    <span>{badgeInfo.icon}</span>
                    <span>{badgeInfo.label}</span>
                  </div>
                );
              })}
              {badges.length > 3 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 border-2 border-gray-200 text-gray-700">
                  +{badges.length - 3}
                </div>
              )}
            </div>
          )}

          {/* 成分タグ（画像下部） */}
          {ingredients && ingredients.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm px-3 py-2">
              <div className="flex flex-wrap gap-1.5">
                {ingredients.slice(0, 2).map(
                  (item, index) =>
                    item.ingredient && (
                      <div
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white/90 text-primary-900 shadow-sm"
                      >
                        {item.ingredient.name}
                      </div>
                    ),
                )}
                {ingredients.length > 2 && (
                  <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-white/70 text-primary-700">
                    +{ingredients.length - 2}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <CardContent className="flex-1 pt-5 px-5">
          <h3 className="font-light text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 tracking-wide">
            {name}
          </h3>

          <div className="mb-4">
            <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
          </div>

          {/* 価格情報 - 商品価格と1日あたりの両方を表示 */}
          <div className="flex items-end justify-between">
            {/* 左側: 商品価格 */}
            <div>
              <div className="text-xs text-gray-500 mb-1">商品価格</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCostJPY(priceJPY)}
              </div>
            </div>

            {/* 右側: 1日あたりの価格 */}
            {effectiveCostPerDay && (
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">最安値</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCostJPY(effectiveCostPerDay)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">1日あたり</div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 pb-5 px-5">
          <button className="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
            比較する
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
}
