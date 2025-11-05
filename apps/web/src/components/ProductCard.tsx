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
  } = product;

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(_id);

  // 5冠達成判定（すべてSランク）
  const isPerfect = tierRatings ? isPerfectProduct(tierRatings) : false;

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

  // ランク別の色（ツヤツヤグラデーション付き）
  const rankColors: Record<TierRank, string> = {
    "S+": "bg-gradient-to-br from-purple-500/80 via-pink-500/70 to-yellow-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    S: "bg-gradient-to-br from-purple-500/80 via-purple-500/70 to-purple-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    A: "bg-gradient-to-br from-blue-500/80 via-blue-500/70 to-blue-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    B: "bg-gradient-to-br from-green-500/80 via-green-500/70 to-green-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    C: "bg-gradient-to-br from-yellow-500/80 via-yellow-500/70 to-yellow-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    D: "bg-gradient-to-br from-gray-400/80 via-gray-400/70 to-gray-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
  };

  // ランク別のテキスト色（ツヤツヤ感のため濃く）
  const rankTextColors: Record<TierRank, string> = {
    "S+": "text-purple-800",
    S: "text-purple-800",
    A: "text-blue-800",
    B: "text-green-800",
    C: "text-yellow-800",
    D: "text-gray-800",
  };

  // ガラス光沢シャドウ（ツヤツヤ感強化）
  const glassTextShadow = {
    textShadow:
      "0 2px 0 rgba(255,255,255,1), 0 3px 2px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)",
  } as React.CSSProperties;

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
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                <span className="text-lg">🏆</span>
                <span className="font-bold text-sm">
                  5冠達成！すべてSランクの最高品
                </span>
                <span className="text-lg">🏆</span>
              </div>
            </div>
          )}

          {/* Tierランクラベル（総合評価、左上に小さく表示） */}
          {!isPerfect && tierRatings && tierRatings.overallRank && (
            <div className="absolute top-3 left-3 z-10">
              <div className="relative w-12 h-8">
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded font-black text-sm ${rankColors[tierRatings.overallRank as TierRank]} ${rankTextColors[tierRatings.overallRank as TierRank]}`}
                >
                  <span style={glassTextShadow}>{tierRatings.overallRank}</span>
                </div>
                {/* キラキラハイライト（複数レイヤー） */}
                <div className="absolute inset-0 rounded bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              </div>
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
