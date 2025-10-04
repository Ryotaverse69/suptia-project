"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { TrendingUp, Shield, Award } from "lucide-react";
import { formatCostJPY } from "@/lib/cost";

interface ProductCardProps {
  product: {
    name: string;
    priceJPY: number;
    slug: {
      current: string;
    };
    effectiveCostPerDay?: number;
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
    effectiveCostPerDay,
    rating = 4.5,
    reviewCount = 127,
    isBestValue = false,
    safetyScore = 95,
    imageUrl = "/placeholder-supplement.jpg",
  } = product;

  return (
    <Link href={`/products/${slug.current}`}>
      <Card className="group cursor-pointer overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-primary-50">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center text-primary-300">
            <Award size={48} />
          </div>

          {isBestValue && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="bestValue" className="flex items-center gap-1">
                <TrendingUp size={14} />
                ベストバリュー
              </Badge>
            </div>
          )}

          {safetyScore >= 90 && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="success" className="flex items-center gap-1">
                <Shield size={14} />
                高安全性
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex-1 pt-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>

          <div className="mb-3">
            <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
          </div>

          <div className="space-y-1 text-sm text-primary-700">
            <div className="flex justify-between">
              <span>商品価格</span>
              <span className="font-medium">{formatCostJPY(priceJPY)}</span>
            </div>
            {effectiveCostPerDay && (
              <div className="flex justify-between">
                <span>1日あたり</span>
                <span className="font-medium text-accent-mint">
                  {formatCostJPY(effectiveCostPerDay)}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-900">
                {formatCostJPY(priceJPY)}
              </div>
              {effectiveCostPerDay && (
                <div className="text-xs text-primary-600">
                  {formatCostJPY(effectiveCostPerDay)}/日
                </div>
              )}
            </div>
            <button className="bg-accent-purple hover:bg-accent-purple/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              詳細を見る
            </button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
