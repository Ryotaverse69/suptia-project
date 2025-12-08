"use client";

/**
 * お気に入りContext（Supabase連携版）
 *
 * ログインユーザーのお気に入りをSupabaseに保存・同期
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FavoritesContextType {
  favorites: string[];
  isLoading: boolean;
  isLoggedIn: boolean;
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const isLoggedIn = !!user;

  // ユーザーがログインしたらお気に入りを取得
  useEffect(() => {
    const fetchFavorites = async () => {
      if (authLoading) return;

      if (!user) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[FavoritesContext] Failed to fetch favorites:", error);
          setFavorites([]);
        } else {
          setFavorites(
            data?.map((item: { product_id: string }) => item.product_id) ?? [],
          );
        }
      } catch (error) {
        console.error("[FavoritesContext] Error fetching favorites:", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, authLoading, supabase]);

  /**
   * お気に入りに追加
   */
  const addFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        console.warn("[FavoritesContext] User not logged in");
        return;
      }

      // 楽観的更新
      setFavorites((prev) => {
        if (prev.includes(productId)) return prev;
        return [productId, ...prev];
      });

      try {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          product_id: productId,
        });

        if (error) {
          // エラー時はロールバック
          console.error("[FavoritesContext] Failed to add favorite:", error);
          setFavorites((prev) => prev.filter((id) => id !== productId));
        }
      } catch (error) {
        console.error("[FavoritesContext] Error adding favorite:", error);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      }
    },
    [user, supabase],
  );

  /**
   * お気に入りから削除
   */
  const removeFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        console.warn("[FavoritesContext] User not logged in");
        return;
      }

      // 楽観的更新
      const previousFavorites = favorites;
      setFavorites((prev) => prev.filter((id) => id !== productId));

      try {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          // エラー時はロールバック
          console.error("[FavoritesContext] Failed to remove favorite:", error);
          setFavorites(previousFavorites);
        }
      } catch (error) {
        console.error("[FavoritesContext] Error removing favorite:", error);
        setFavorites(previousFavorites);
      }
    },
    [user, supabase, favorites],
  );

  /**
   * お気に入りかどうかを確認
   */
  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites],
  );

  /**
   * お気に入りのトグル
   */
  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (isFavorite(productId)) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
    },
    [isFavorite, removeFavorite, addFavorite],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isLoggedIn,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
