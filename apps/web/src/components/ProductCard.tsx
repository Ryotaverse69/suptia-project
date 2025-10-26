"use client";

import Link from "next/link";
import Image from "next/image";
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
            <Image
              src={displayImageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-primary-300/60">
              <Award size={56} strokeWidth={1} />
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
        </div>

        <CardContent className="flex-1 pt-5 px-5">
          <h3 className="font-light text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 tracking-wide">
            {name}
          </h3>

          <div className="mb-4">
            <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
          </div>

          <div className="space-y-2 text-sm text-primary-700 font-light">
            <div className="flex justify-between">
              <span>商品価格</span>
              <span className="font-normal">{formatCostJPY(priceJPY)}</span>
            </div>
            {effectiveCostPerDay && (
              <div className="flex justify-between">
                <span>1日あたり</span>
                <span className="font-normal text-accent-mint">
                  {formatCostJPY(effectiveCostPerDay)}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-5 px-5">
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="text-2xl font-light text-primary-900 tracking-wide">
                {formatCostJPY(priceJPY)}
              </div>
              {effectiveCostPerDay && (
                <div className="text-xs text-primary-600 mt-1 font-light">
                  {formatCostJPY(effectiveCostPerDay)}/日
                </div>
              )}
            </div>
            <button className="glass-purple hover:shadow-glow-purple text-white font-light px-6 py-3 rounded-xl transition-all duration-300 border border-white/20">
              詳細を見る
            </button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
