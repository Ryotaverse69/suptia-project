import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, TrendingUp, Award } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface RelatedProduct {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  brand?: {
    name: string;
    trustScore?: number;
  } | null;
  priceJPY: number;
  originalPrice?: number;
  discountPercentage?: number;
  isCampaign?: boolean;
  campaignEndDate?: string;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  scores?: {
    overall?: number;
    safety?: number;
    evidence?: number;
    costEffectiveness?: number;
  };
  reviewStats?: {
    averageRating?: number;
    reviewCount?: number;
  };
  availability?: string;
  images?: Array<{
    asset: {
      url: string;
    };
  }>;
  // モックデータ
  effectiveCostPerDay?: number;
  rating?: number;
  reviewCount?: number;
  isBestValue?: boolean;
  safetyScore?: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  ingredientName: string;
}

export function RelatedProducts({
  products,
  ingredientName,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-primary-50/50">
      <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1200px]">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary-900 mb-2 flex items-center gap-2">
            <ShoppingCart className="text-primary" size={28} />
            {ingredientName}を含む推奨商品
          </h2>
          <p className="text-primary-700">
            キャンペーン・割引率の高い順に最大6件表示しています
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug.current}`}
              className="group bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* 商品画像 */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                {product.externalImageUrl ? (
                  <Image
                    src={product.externalImageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary-300/60">
                    <Award size={48} strokeWidth={1} />
                  </div>
                )}
                {/* キャンペーン・割引バッジ */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isCampaign && (
                    <div className="px-3 py-1 bg-red-500 rounded text-white text-xs font-bold shadow-md">
                      🎉 キャンペーン中
                    </div>
                  )}
                  {product.discountPercentage &&
                    product.discountPercentage > 0 && (
                      <div className="px-3 py-1 bg-orange-500 rounded text-white text-xs font-bold shadow-md">
                        {product.discountPercentage.toFixed(0)}% OFF
                      </div>
                    )}
                </div>
              </div>

              <div className="p-5">
                {/* 商品名 */}
                <h3 className="text-base font-bold text-primary-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* 評価（モックデータ） */}
                {product.rating && product.reviewCount && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5 px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">
                      {product.rating.toFixed(1)}
                    </div>
                    <span className="text-xs text-primary-600">
                      ({product.reviewCount}件)
                    </span>
                  </div>
                )}

                {/* 価格（割引前価格がある場合は表示） */}
                <div className="mb-3">
                  {product.originalPrice &&
                    product.originalPrice > product.priceJPY && (
                      <div className="text-sm text-gray-500 line-through">
                        ¥{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                </div>

                {/* 現在価格 */}
                <div className="flex items-end justify-between mb-3">
                  {/* 左側: 商品価格 */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">商品価格</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ¥{product.priceJPY.toLocaleString()}
                    </div>
                  </div>

                  {/* 右側: 1日あたりの価格 */}
                  {product.effectiveCostPerDay !== undefined &&
                    product.effectiveCostPerDay > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">最安値</div>
                        <div className="text-xl font-bold text-green-600">
                          ¥{product.effectiveCostPerDay.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          1日あたり
                        </div>
                      </div>
                    )}
                </div>

                {/* 比較するボタン */}
                <button className="w-full px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary-700 transition-colors">
                  比較する
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* 全商品一覧へのリンク */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            すべての商品を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
