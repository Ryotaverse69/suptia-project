"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductListItem } from "@/components/ProductListItem";
import { sanity } from "@/lib/sanity.client";
import { Heart, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Product {
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
  }>;
  effectiveCostPerDay?: number;
  rating?: number;
  reviewCount?: number;
  isBestValue?: boolean;
  safetyScore?: number;
  imageUrl?: string;
  externalImageUrl?: string;
}

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      console.log("[FavoritesPage] Favorites from context:", favorites);
      console.log("[FavoritesPage] Favorites count:", favorites.length);

      if (favorites.length === 0) {
        console.log("[FavoritesPage] No favorites to fetch");
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const query = `
          *[_type == "product" && _id in $ids] {
            _id,
            name,
            priceJPY,
            slug,
            servingsPerDay,
            servingsPerContainer,
            ingredients[]{
              amountMgPerServing
            },
            effectiveCostPerDay,
            rating,
            reviewCount,
            isBestValue,
            safetyScore,
            imageUrl,
            externalImageUrl
          }
        `;

        console.log("[FavoritesPage] Fetching products with IDs:", favorites);
        const result = await sanity.fetch<Product[]>(query, { ids: favorites });
        console.log("[FavoritesPage] Fetched products count:", result.length);
        console.log("[FavoritesPage] Fetched products:", result);
        setProducts(result);
      } catch (error) {
        console.error(
          "[FavoritesPage] お気に入り商品の取得に失敗しました:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 sm:mb-6">
              <Heart size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 mb-3 sm:mb-4">
              お気に入り
            </h1>
            <p className="text-base sm:text-lg text-primary-700">
              気になった商品を保存して、いつでも比較できます
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-primary-700">読み込み中...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <div className="text-primary-300 mb-6">
                <Heart size={64} className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 mb-4">
                お気に入りがまだありません
              </h2>
              <p className="text-primary-700 mb-8 max-w-md mx-auto">
                商品ページでハートアイコンをクリックすると、お気に入りに追加できます
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-lg font-semibold"
              >
                商品を探す
              </Link>
            </div>
          )}

          {/* Favorites List */}
          {!loading && products.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm sm:text-base text-primary-700">
                  {products.length}件のお気に入り
                </p>
              </div>

              <div className="space-y-4">
                {products.map((product) => (
                  <ProductListItem key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
