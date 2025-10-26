import Link from "next/link";
import { Star, ShoppingCart, TrendingUp } from "lucide-react";
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
            総合スコアの高い順に最大6件表示しています
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug.current}`}
              className="group bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* 商品画像（将来実装） */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                {product.brand && (
                  <div className="text-center">
                    <p className="text-primary-600 font-semibold text-sm">
                      {product.brand.name}
                    </p>
                    {product.brand.trustScore && (
                      <p className="text-primary-500 text-xs mt-1">
                        信頼度: {product.brand.trustScore}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* ブランド名 */}
                {product.brand && (
                  <p className="text-sm text-primary-600 mb-1 font-medium">
                    {product.brand.name}
                  </p>
                )}

                {/* 商品名 */}
                <h3 className="text-lg font-semibold text-primary-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
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
                {product.scores && product.scores.overall && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary-700">
                        総合スコア
                      </span>
                      <span className="text-sm font-bold text-accent-mint">
                        {product.scores.overall}/100
                      </span>
                    </div>
                    <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-mint to-primary transition-all"
                        style={{ width: `${product.scores.overall}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 価格 */}
                <div className="flex items-baseline justify-between pt-3 border-t border-primary-100">
                  <span className="text-2xl font-bold text-primary-900">
                    {formatPrice(product.priceJPY)}
                  </span>
                  <span className="text-sm text-primary-600">税込</span>
                </div>

                {/* ベストバリューバッジ */}
                {product.scores &&
                  product.scores.costEffectiveness &&
                  product.scores.costEffectiveness >= 90 && (
                    <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-accent-mint to-green-500 text-white rounded-full text-xs font-semibold">
                      <TrendingUp size={14} />
                      ベストバリュー
                    </div>
                  )}
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
