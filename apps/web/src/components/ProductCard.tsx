"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { TrendingUp, Shield, Award } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";
import {
  calculateComprehensiveCost,
  getCostEfficiencyLabel,
} from "@/lib/cost-calculator";

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
    imageUrl = "/placeholder-supplement.jpg",
  } = product;

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
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center text-primary-300/60">
            <Award size={56} strokeWidth={1} />
          </div>

          {isBestValue && (
            <div className="absolute top-4 left-4 z-10">
              <Badge
                variant="bestValue"
                className="flex items-center gap-1.5 glass-mint shadow-soft px-3 py-1.5 font-light"
              >
                <TrendingUp size={14} />
                ベストバリュー
              </Badge>
            </div>
          )}

          {safetyScore >= 90 && (
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant="success"
                className="flex items-center gap-1.5 glass-mint shadow-soft px-3 py-1.5 font-light"
              >
                <Shield size={14} />
                高安全性
              </Badge>
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
