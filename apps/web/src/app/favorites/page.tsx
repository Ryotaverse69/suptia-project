"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductListItem } from "@/components/ProductListItem";
import { sanity } from "@/lib/sanity.client";
import { Heart, LogIn } from "lucide-react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
  const { favorites, isLoading: favoritesLoading, isLoggedIn } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!isLoggedIn) {
        setProducts([]);
        setLoading(false);
        return;
      }

      if (favoritesLoading) return;

      if (favorites.length === 0) {
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

        const result = await sanity.fetch<Product[]>(query, { ids: favorites });
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
  }, [favorites, favoritesLoading, isLoggedIn]);

  return (
    <div
      className="min-h-screen py-8 sm:py-12 md:py-16"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6"
              style={{
                backgroundColor: systemColors.pink,
              }}
            >
              <Heart
                size={32}
                className="text-white sm:w-10 sm:h-10"
                fill="white"
              />
            </div>
            <h1
              className="text-[34px] sm:text-[48px] md:text-[56px] font-bold mb-3 sm:mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              お気に入り
            </h1>
            <p
              className="text-[17px] sm:text-[19px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              気になった商品を保存して、いつでも比較できます
            </p>
          </div>

          {/* Not Logged In State */}
          {!isLoggedIn && !favoritesLoading && (
            <div
              className={`text-center py-20 rounded-[20px] ${liquidGlassClasses.light}`}
            >
              <div className="mb-6" style={{ color: systemColors.gray[3] }}>
                <LogIn size={64} className="mx-auto" />
              </div>
              <h2
                className="text-[28px] font-bold mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                ログインが必要です
              </h2>
              <p
                className="text-[17px] mb-8 max-w-md mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                お気に入り機能を使うにはログインしてください。
                <br />
                ログインすると、複数のデバイスでお気に入りを同期できます。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] transition-all font-semibold text-[17px]"
                style={{
                  backgroundColor: systemColors.blue,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0051D5";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = systemColors.blue;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <LogIn size={20} />
                ログイン / 新規登録
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoggedIn && (loading || favoritesLoading) && (
            <div className="text-center py-20">
              <div
                className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                style={{ borderColor: systemColors.gray[5] }}
              ></div>
              <p
                className="mt-4 text-[17px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                読み込み中...
              </p>
            </div>
          )}

          {/* Empty State (Logged In) */}
          {isLoggedIn &&
            !loading &&
            !favoritesLoading &&
            products.length === 0 && (
              <div
                className={`text-center py-20 rounded-[20px] ${liquidGlassClasses.light}`}
              >
                <div className="mb-6" style={{ color: systemColors.pink }}>
                  <Heart size={64} className="mx-auto" />
                </div>
                <h2
                  className="text-[28px] font-bold mb-4"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お気に入りがまだありません
                </h2>
                <p
                  className="text-[17px] mb-8 max-w-md mx-auto"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  商品ページでハートアイコンをクリックすると、お気に入りに追加できます
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] transition-all font-semibold text-[17px] hover:scale-[1.02]"
                  style={{
                    backgroundColor: systemColors.blue,
                    color: "white",
                  }}
                >
                  商品を探す
                </Link>
              </div>
            )}

          {/* Favorites List */}
          {isLoggedIn &&
            !loading &&
            !favoritesLoading &&
            products.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-[15px] sm:text-[17px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
