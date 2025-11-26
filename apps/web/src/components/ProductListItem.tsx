"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import { calculateComprehensiveCost } from "@/lib/cost-calculator";
import { useFavorites } from "@/contexts/FavoritesContext";
import { BadgeType, getBadgeInfo, isPerfectSupplement } from "@/lib/badges";

interface ProductListItemProps {
  product: {
    _id: string;
    name: string;
    priceJPY?: number | null;
    slug?: {
      current: string;
    } | null;
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
    effectiveCostPerDay?: number | null;
    imageUrl?: string;
    externalImageUrl?: string;
    badges?: BadgeType[];
  };
}

export function ProductListItem({ product }: ProductListItemProps) {
  const {
    _id,
    name,
    priceJPY,
    slug,
    servingsPerDay,
    servingsPerContainer,
    ingredients,
    effectiveCostPerDay: manualCostPerDay,
    imageUrl,
    externalImageUrl,
    badges,
  } = product;

  const safePriceJPY = priceJPY ?? 0;
  const safeBadges = Array.isArray(badges) ? badges : [];
  const isPerfect = isPerfectSupplement(safeBadges);

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(_id);

  const displayImageUrl = externalImageUrl || imageUrl;

  const productSlug =
    slug?.current ||
    encodeURIComponent((name || "product").toLowerCase().replace(/\s+/g, "-"));

  // コスト計算
  let calculatedCost;
  if (
    safePriceJPY > 0 &&
    servingsPerDay &&
    servingsPerContainer &&
    ingredients &&
    ingredients.length > 0
  ) {
    calculatedCost = calculateComprehensiveCost({
      priceJPY: safePriceJPY,
      servingsPerDay,
      servingsPerContainer,
      ingredients,
    });
  }

  const effectiveCostPerDay = calculatedCost?.costPerDay ?? manualCostPerDay;

  // 主成分名を取得
  const mainIngredient = ingredients?.[0]?.ingredient?.name;

  return (
    <Link href={`/products/${productSlug}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-200 group">
        <div className="flex h-[200px] sm:h-[220px]">
          {/* 左: 画像 */}
          <div className="relative w-[200px] sm:w-[220px] flex-shrink-0">
            {displayImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImageUrl}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-2xl opacity-40">📦</span>
              </div>
            )}

            {/* バッジ（左上） */}
            {(isPerfect || safeBadges.length > 0) && (
              <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-0.5 max-w-[90px]">
                {isPerfect ? (
                  <div
                    className="bg-yellow-400 p-0.5 rounded shadow"
                    title="5冠達成"
                  >
                    <span className="text-[11px]">🏆</span>
                  </div>
                ) : (
                  safeBadges.map((badgeType) => {
                    const badgeInfo = getBadgeInfo(badgeType);
                    return (
                      <div
                        key={badgeType}
                        className="bg-white/95 p-0.5 rounded shadow border border-gray-200"
                        title={badgeInfo.label}
                      >
                        <span className="text-[11px]">{badgeInfo.icon}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* お気に入りボタン */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(_id);
              }}
              className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${
                favorite
                  ? "bg-pink-500 text-white"
                  : "bg-white/90 text-gray-500 hover:text-pink-500"
              } shadow-md`}
              aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
            >
              <Heart size={16} className={favorite ? "fill-white" : ""} />
            </button>
          </div>

          {/* 中央: 商品情報 */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
            {/* 商品名 */}
            <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-3 group-hover:text-primary transition-colors leading-snug">
              {name}
            </h3>

            {/* 成分タグ */}
            {mainIngredient && (
              <div className="mt-2">
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-md">
                  {mainIngredient}
                </span>
              </div>
            )}

            {/* 内容量 */}
            {servingsPerContainer && (
              <p className="text-sm text-gray-500 mt-2">
                {servingsPerContainer}回分
              </p>
            )}
          </div>

          {/* 右: 価格 */}
          <div className="w-[120px] sm:w-[145px] flex-shrink-0 p-4 sm:p-5 flex flex-col justify-center items-end border-l border-gray-100 bg-gray-50">
            {safePriceJPY > 0 && (
              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCostJPY(safePriceJPY)}
                </div>
                {effectiveCostPerDay && effectiveCostPerDay > 0 && (
                  <div className="mt-1.5">
                    <span className="text-xs text-gray-500">1日</span>
                    <span className="text-base sm:text-lg font-bold text-green-600 ml-1">
                      {formatCostJPY(effectiveCostPerDay)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
