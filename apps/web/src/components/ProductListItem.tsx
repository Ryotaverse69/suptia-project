"use client";

import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import { calculateComprehensiveCost } from "@/lib/cost-calculator";
import { useFavorites } from "@/contexts/FavoritesContext";
import { BadgeType, getBadgeInfo, isPerfectSupplement } from "@/lib/badges";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
    form?: string;
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
    form,
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

  // 剤形ラベル
  const formLabel: Record<string, string> = {
    capsule: "カプセル",
    tablet: "タブレット",
    softgel: "ソフトジェル",
    powder: "パウダー",
    liquid: "リキッド",
    gummy: "グミ",
  };

  return (
    <Link href={`/products/${productSlug}`}>
      <div
        className={`group cursor-pointer overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1`}
        style={{
          fontFamily: fontStack,
        }}
      >
        <div className="flex h-[160px] sm:h-[200px]">
          {/* 左: 画像 */}
          <div className="relative w-[100px] sm:w-[200px] flex-shrink-0 overflow-hidden rounded-l-[16px]">
            {displayImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Package
                  className="w-10 h-10"
                  style={{ color: appleWebColors.borderSubtle }}
                  aria-hidden="true"
                />
              </div>
            )}

            {/* バッジ（左上） */}
            {(isPerfect || safeBadges.length > 0) && (
              <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[100px]">
                {isPerfect ? (
                  <div
                    className="p-1.5 rounded-lg shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`,
                    }}
                    title="5冠達成"
                  >
                    <span className="text-xs">🏆</span>
                  </div>
                ) : (
                  safeBadges.slice(0, 3).map((badgeType) => {
                    const badgeInfo = getBadgeInfo(badgeType);
                    return (
                      <div
                        key={badgeType}
                        className="p-1 rounded-lg shadow-md"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                        }}
                        title={badgeInfo.label}
                      >
                        <span className="text-xs">{badgeInfo.icon}</span>
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
              className="absolute bottom-2 right-2 p-2 rounded-full min-w-[36px] min-h-[36px] flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: favorite
                  ? systemColors.pink
                  : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              aria-label={favorite ? "お気に入りから削除" : "お気に入りに追加"}
            >
              <Heart
                size={16}
                className={`transition-all duration-300 ${
                  favorite ? "fill-white text-white" : ""
                }`}
                style={{
                  color: favorite ? "white" : appleWebColors.textSecondary,
                }}
              />
            </button>
          </div>

          {/* 中央: 商品情報 */}
          <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between min-w-0">
            {/* 商品名 */}
            <h3
              className={`text-[13px] sm:text-[17px] font-semibold leading-tight tracking-[-0.41px] line-clamp-3 group-hover:opacity-80 transition-opacity`}
              style={{ color: appleWebColors.textPrimary }}
            >
              {name}
            </h3>

            <div className="mt-auto">
              {/* 成分タグ・剤形タグ */}
              {(mainIngredient || form) && (
                <div className="mb-2 hidden sm:flex flex-wrap gap-1.5">
                  {mainIngredient && (
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[12px] font-semibold"
                      style={{
                        backgroundColor: `${systemColors.blue}15`,
                        color: systemColors.blue,
                      }}
                    >
                      {mainIngredient}
                    </span>
                  )}
                  {form && formLabel[form] && (
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[12px] font-medium"
                      style={{
                        backgroundColor: "rgba(142, 142, 147, 0.1)",
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      {formLabel[form]}
                    </span>
                  )}
                </div>
              )}

              {/* 内容量 */}
              {servingsPerContainer && (
                <p
                  className="text-[13px]"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  {servingsPerContainer}回分
                </p>
              )}
            </div>
          </div>

          {/* 右: 価格 */}
          <div
            className="w-[90px] sm:w-[150px] flex-shrink-0 p-2 sm:p-5 flex flex-col justify-center items-end border-l"
            style={{
              borderColor: appleWebColors.borderSubtle,
              backgroundColor: appleWebColors.sectionBackground,
            }}
          >
            {safePriceJPY > 0 && (
              <div className="text-right">
                <p
                  className="text-[11px] font-medium uppercase tracking-wider mb-0.5"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  価格
                </p>
                <div
                  className="text-[14px] sm:text-[17px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {formatCostJPY(safePriceJPY)}
                </div>
                {effectiveCostPerDay && effectiveCostPerDay > 0 && (
                  <div className="mt-1 sm:mt-2">
                    <p
                      className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-0.5"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      1日あたり
                    </p>
                    <span
                      className="text-[16px] sm:text-[20px] font-bold"
                      style={{ color: systemColors.green }}
                    >
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
