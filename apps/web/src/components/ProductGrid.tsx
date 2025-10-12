"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, TrendingUp, Shield, Award } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  brand: {
    _id: string;
    name: string;
    trustScore?: number;
    country?: string;
  };
  priceJPY: number;
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
  form?: string;
  thirdPartyTested?: boolean;
  images?: Array<{
    asset: {
      url: string;
    };
  }>;
}

interface ProductGridProps {
  products: Product[];
  currentSort?: string;
}

export function ProductGrid({
  products,
  currentSort = "overall",
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div>
      {/* ソート＆件数表示 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-200">
        <p className="text-sm text-primary-700">
          <span className="font-bold text-primary-900">{products.length}</span>{" "}
          件の商品
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-primary-700">
            並び替え:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            <option value="overall">総合スコア順</option>
            <option value="price-asc">価格が安い順</option>
            <option value="price-desc">価格が高い順</option>
            <option value="rating">レビュー評価順</option>
          </select>
        </div>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug.current}`}
            className="group bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* 商品画像プレースホルダー */}
            <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <p className="text-primary-600 font-bold text-lg text-center mb-2">
                  {product.brand.name}
                </p>
                {product.brand.trustScore && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full">
                    <Shield className="text-accent-mint" size={14} />
                    <span className="text-xs font-semibold text-primary-900">
                      信頼度 {product.brand.trustScore}
                    </span>
                  </div>
                )}
              </div>

              {/* バッジ */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.thirdPartyTested && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-accent-mint text-white rounded-md text-xs font-semibold">
                    <Award size={12} />
                    第三者認証
                  </div>
                )}
                {product.scores &&
                  product.scores.costEffectiveness &&
                  product.scores.costEffectiveness >= 90 && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md text-xs font-semibold">
                      <TrendingUp size={12} />
                      ベストバリュー
                    </div>
                  )}
              </div>
            </div>

            <div className="p-5">
              {/* ブランド名 */}
              <p className="text-sm text-primary-600 mb-1 font-medium">
                {product.brand.name}
                {product.brand.country && (
                  <span className="ml-2">
                    {product.brand.country === "JP" ? "🇯🇵" : "🇺🇸"}
                  </span>
                )}
              </p>

              {/* 商品名 */}
              <h3 className="text-lg font-semibold text-primary-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                {product.name}
              </h3>

              {/* レビュー統計 */}
              {product.reviewStats && product.reviewStats.averageRating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star
                      className="text-accent-orange fill-accent-orange"
                      size={16}
                    />
                    <span className="text-sm font-semibold text-primary-900">
                      {product.reviewStats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-primary-600">
                    ({product.reviewStats.reviewCount?.toLocaleString()}件)
                  </span>
                </div>
              )}

              {/* スコア表示 */}
              {product.scores && (
                <div className="space-y-2 mb-4">
                  {/* 総合スコア */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-700 font-medium">
                        総合スコア
                      </span>
                      <span className="text-sm font-bold text-accent-mint">
                        {product.scores.overall || "-"}/100
                      </span>
                    </div>
                    <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-mint to-primary transition-all"
                        style={{ width: `${product.scores.overall || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* サブスコア */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-primary-600">安全性</p>
                      <p className="font-bold text-primary-900">
                        {product.scores.safety || "-"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-primary-600">エビデンス</p>
                      <p className="font-bold text-primary-900">
                        {product.scores.evidence || "-"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-primary-600">コスパ</p>
                      <p className="font-bold text-primary-900">
                        {product.scores.costEffectiveness || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 価格 */}
              <div className="flex items-baseline justify-between pt-4 border-t border-primary-100">
                <span className="text-2xl font-bold text-primary-900">
                  ¥{product.priceJPY.toLocaleString()}
                </span>
                <span className="text-sm text-primary-600">税込</span>
              </div>

              {/* 剤形 */}
              {product.form && (
                <p className="text-xs text-primary-500 mt-2">
                  剤形: {product.form}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
