"use client";

import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Heart } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  calculateComprehensiveCost,
  getCostEfficiencyLabel,
} from "@/lib/cost-calculator";
import {
  TierBadgeRow,
  PerfectProductBanner,
  OverallRankBadge,
} from "@/components/ui/TierBadge";
import { TierRatings, isPerfectProduct } from "@/lib/tier-ranking";
import { TierRank } from "@/lib/tier-colors";
import { BadgeType, getBadgeInfo, isPerfectSupplement } from "@/lib/badges";

interface ProductCardProps {
  product: {
    _id: string;
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
    tierRatings?: TierRatings; // 新: Tierランク評価
    badges?: BadgeType[]; // 獲得している称号
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    _id,
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
    tierRatings,
    badges,
  } = product;

  // Ensure badges is always an array (defensive programming)
  const safeBadges = Array.isArray(badges) ? badges : [];

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(_id);

  // 5冠達成判定（すべての称号を獲得）
  const isPerfect = isPerfectSupplement(safeBadges);

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

          {/* 称号バッジ（小さく表示、ホバーで拡大） - リキッドグラス版 */}
          {(isPerfect || safeBadges.length > 0) && (
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 max-w-[90px]">
              {isPerfect ? (
                // 5冠達成の場合は王冠のみ表示
                <div
                  className="relative bg-gradient-to-br from-yellow-400/60 via-yellow-300/50 to-yellow-200/40 backdrop-blur-lg backdrop-saturate-150 p-1 rounded-lg shadow-lg border border-yellow-300/40 hover:shadow-2xl hover:border-yellow-400/60 transition-all duration-300 cursor-pointer hover:scale-150 hover:z-20 animate-pulse"
                  title="5冠達成！全項目で最高評価"
                >
                  <span className="text-sm">🏆</span>
                </div>
              ) : (
                // 通常のバッジ表示
                safeBadges.map((badgeType) => {
                  const badgeInfo = getBadgeInfo(badgeType);
                  return (
                    <div
                      key={badgeType}
                      className="relative bg-gradient-to-br from-white/50 via-white/40 to-white/30 backdrop-blur-lg backdrop-saturate-150 p-1 rounded-lg shadow-lg border border-white/30 hover:shadow-2xl hover:border-white/50 transition-all duration-300 cursor-pointer hover:scale-150 hover:z-20"
                      title={badgeInfo.label}
                    >
                      <span className="text-sm">{badgeInfo.icon}</span>
                    </div>
                  );
                })
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

          {/* お気に入りボタン */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(_id);
            }}
            className={`absolute bottom-3 right-3 z-10 p-2 rounded-full backdrop-blur-xl transition-all duration-300 ${
              favorite
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-white/80 hover:bg-white"
            } shadow-lg hover:shadow-xl hover:scale-110`}
            aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                favorite
                  ? "fill-white text-white"
                  : "text-gray-600 hover:text-pink-500"
              }`}
            />
          </button>
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
