"use client";

import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import { useFavorites } from "@/contexts/FavoritesContext";
import { calculateComprehensiveCost } from "@/lib/cost-calculator";
import { TierRatings } from "@/lib/tier-ranking";
import { BadgeType, getBadgeInfo, isPerfectSupplement } from "@/lib/badges";
import {
  systemColors,
  appleWebColors,
  typography,
  tierColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
    effectiveCostPerDay?: number;
    imageUrl?: string;
    externalImageUrl?: string;
    tierRatings?: TierRatings;
    badges?: BadgeType[];
  };
}

// Tier badge gradient helper
const getTierGradient = (tier: string): string => {
  const gradients: Record<string, string> = {
    "S+": `linear-gradient(135deg, ${tierColors["S+"]} 0%, ${systemColors.pink} 100%)`,
    S: `linear-gradient(135deg, ${tierColors.S} 0%, ${systemColors.indigo} 100%)`,
    A: `linear-gradient(135deg, ${tierColors.A} 0%, ${systemColors.teal} 100%)`,
    B: `linear-gradient(135deg, ${tierColors.B} 0%, ${systemColors.green} 100%)`,
    C: `linear-gradient(135deg, ${tierColors.C} 0%, ${systemColors.yellow} 100%)`,
    D: `linear-gradient(135deg, ${tierColors.D} 0%, ${appleWebColors.textSecondary} 100%)`,
  };
  return gradients[tier] || gradients.D;
};

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
    imageUrl,
    externalImageUrl,
    tierRatings,
    badges,
  } = product;

  const safeBadges = Array.isArray(badges) ? badges : [];
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(_id);
  const isPerfect = isPerfectSupplement(safeBadges);
  const displayImageUrl = externalImageUrl || imageUrl;

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

  const effectiveCostPerDay = calculatedCost?.costPerDay ?? manualCostPerDay;

  return (
    <Link href={`/products/${slug.current}`}>
      <div
        className={`group cursor-pointer overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${liquidGlassClasses.light}`}
        style={{
          fontFamily: fontStack,
        }}
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden rounded-t-[20px]">
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
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: appleWebColors.sectionBackground }}
            >
              <Package
                className="w-12 h-12"
                style={{ color: appleWebColors.borderSubtle }}
                aria-hidden="true"
              />
            </div>
          )}

          {/* Tier Badge */}
          {tierRatings?.overallRank && (
            <div className="absolute top-3 left-3 z-10">
              <div
                className="px-2.5 py-1 rounded-xl font-bold text-white text-[13px] shadow-lg"
                style={{
                  background: getTierGradient(tierRatings.overallRank),
                }}
              >
                {tierRatings.overallRank}
              </div>
            </div>
          )}

          {/* Award Badges */}
          {(isPerfect || safeBadges.length > 0) && (
            <div className="absolute top-3 right-12 z-10 flex gap-1">
              {isPerfect ? (
                <div
                  className="p-1.5 rounded-xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`,
                  }}
                  title="5冠達成"
                >
                  <span className="text-sm">🏆</span>
                </div>
              ) : (
                safeBadges.slice(0, 3).map((badgeType) => {
                  const badgeInfo = getBadgeInfo(badgeType);
                  return (
                    <div
                      key={badgeType}
                      className="p-1 rounded-lg shadow-md bg-white/90 backdrop-blur-[10px]"
                      title={badgeInfo.label}
                    >
                      <span className="text-xs">{badgeInfo.icon}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Ingredient Tags */}
          {ingredients && ingredients.length > 0 && (
            <div
              className="absolute bottom-0 left-0 right-0 px-3 py-2"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              }}
            >
              <div className="flex flex-wrap gap-1.5">
                {ingredients.slice(0, 1).map(
                  (item, index) =>
                    item.ingredient && (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90"
                        style={{
                          color: appleWebColors.textPrimary,
                        }}
                      >
                        {item.ingredient.name}
                      </span>
                    ),
                )}
                {ingredients.length > 1 && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/70"
                    style={{
                      color: appleWebColors.textSecondary,
                    }}
                  >
                    +{ingredients.length - 1}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(_id);
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full min-w-[36px] min-h-[36px] flex items-center justify-center transition-all duration-300 backdrop-blur-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            style={{
              backgroundColor: favorite
                ? systemColors.pink
                : "rgba(255, 255, 255, 0.85)",
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

        {/* Content Section */}
        <div className="flex-1 p-4">
          <h3
            className={`${typography.headline} mb-3 line-clamp-2 leading-tight group-hover:opacity-80 transition-opacity`}
            style={{ color: appleWebColors.textPrimary }}
          >
            {name}
          </h3>

          {/* Price Info */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-wider mb-0.5"
                style={{ color: appleWebColors.textTertiary }}
              >
                価格
              </p>
              <p
                className="text-[17px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                {formatCostJPY(priceJPY)}
              </p>
            </div>

            {effectiveCostPerDay && (
              <div className="text-right">
                <p
                  className="text-[11px] font-medium uppercase tracking-wider mb-0.5"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  1日あたり
                </p>
                <p
                  className="text-[20px] font-bold"
                  style={{ color: systemColors.green }}
                >
                  {formatCostJPY(effectiveCostPerDay)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <button
            className="w-full py-3 rounded-full font-semibold text-[15px] transition-all duration-300 min-h-[44px]"
            style={{
              backgroundColor: systemColors.blue,
              color: "white",
            }}
          >
            詳細を見る
          </button>
        </div>
      </div>
    </Link>
  );
}
