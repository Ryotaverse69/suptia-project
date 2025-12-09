"use client";

/**
 * 価格アラートContext（Supabase連携版）
 *
 * ログインユーザーの価格アラートをSupabaseに保存・同期
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

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number | null;
  isActive: boolean;
  createdAt: string;
}

interface PriceAlertsContextType {
  alerts: PriceAlert[];
  isLoading: boolean;
  isLoggedIn: boolean;
  addAlert: (
    productId: string,
    productName: string,
    targetPrice: number,
    currentPrice: number,
  ) => Promise<void>;
  removeAlert: (productId: string) => Promise<void>;
  updateAlert: (productId: string, targetPrice: number) => Promise<void>;
  getAlert: (productId: string) => PriceAlert | undefined;
  hasAlert: (productId: string) => boolean;
}

const PriceAlertsContext = createContext<PriceAlertsContextType | undefined>(
  undefined,
);

export function PriceAlertsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const isLoggedIn = !!user;

  // ユーザーがログインしたらアラートを取得
  useEffect(() => {
    const fetchAlerts = async () => {
      if (authLoading) return;

      if (!user) {
        setAlerts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("price_alerts")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[PriceAlertsContext] Failed to fetch alerts:", error);
          setAlerts([]);
        } else {
          interface PriceAlertRow {
            id: string;
            product_id: string;
            product_name: string | null;
            target_price: number | string;
            current_price: number | string | null;
            is_active: boolean;
            created_at: string;
          }
          setAlerts(
            data?.map((item: PriceAlertRow) => ({
              id: item.id,
              productId: item.product_id,
              productName: item.product_name || "",
              targetPrice: Number(item.target_price),
              currentPrice: item.current_price
                ? Number(item.current_price)
                : null,
              isActive: item.is_active,
              createdAt: item.created_at,
            })) ?? [],
          );
        }
      } catch (error) {
        console.error("[PriceAlertsContext] Error fetching alerts:", error);
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [user, authLoading, supabase]);

  /**
   * アラートを追加
   */
  const addAlert = useCallback(
    async (
      productId: string,
      productName: string,
      targetPrice: number,
      currentPrice: number,
    ) => {
      if (!user) {
        console.warn("[PriceAlertsContext] User not logged in");
        return;
      }

      const newAlert: PriceAlert = {
        id: `temp-${Date.now()}`,
        productId,
        productName,
        targetPrice,
        currentPrice,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // 楽観的更新
      setAlerts((prev) => {
        const filtered = prev.filter((a) => a.productId !== productId);
        return [newAlert, ...filtered];
      });

      try {
        // 既存のアラートを確認
        const { data: existing } = await supabase
          .from("price_alerts")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .single();

        if (existing) {
          // 既存アラートを更新
          const { error } = await supabase
            .from("price_alerts")
            .update({
              target_price: targetPrice,
              current_price: currentPrice,
              is_active: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          // 新規アラートを作成
          const { error } = await supabase.from("price_alerts").insert({
            user_id: user.id,
            product_id: productId,
            product_name: productName,
            target_price: targetPrice,
            current_price: currentPrice,
            is_active: true,
          });

          if (error) throw error;
        }

        // 最新データを再取得
        const { data: refreshed } = await supabase
          .from("price_alerts")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .single();

        if (refreshed) {
          setAlerts((prev) => {
            const filtered = prev.filter((a) => a.productId !== productId);
            return [
              {
                id: refreshed.id,
                productId: refreshed.product_id,
                productName: refreshed.product_name || "",
                targetPrice: Number(refreshed.target_price),
                currentPrice: refreshed.current_price
                  ? Number(refreshed.current_price)
                  : null,
                isActive: refreshed.is_active,
                createdAt: refreshed.created_at,
              },
              ...filtered,
            ];
          });
        }
      } catch (error) {
        console.error("[PriceAlertsContext] Failed to add alert:", error);
        // エラー時はロールバック
        setAlerts((prev) => prev.filter((a) => a.productId !== productId));
      }
    },
    [user, supabase],
  );

  /**
   * アラートを削除
   */
  const removeAlert = useCallback(
    async (productId: string) => {
      if (!user) {
        console.warn("[PriceAlertsContext] User not logged in");
        return;
      }

      // 楽観的更新
      const previousAlerts = alerts;
      setAlerts((prev) => prev.filter((a) => a.productId !== productId));

      try {
        const { error } = await supabase
          .from("price_alerts")
          .update({ is_active: false })
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          console.error("[PriceAlertsContext] Failed to remove alert:", error);
          setAlerts(previousAlerts);
        }
      } catch (error) {
        console.error("[PriceAlertsContext] Error removing alert:", error);
        setAlerts(previousAlerts);
      }
    },
    [user, supabase, alerts],
  );

  /**
   * アラートを更新
   */
  const updateAlert = useCallback(
    async (productId: string, targetPrice: number) => {
      if (!user) {
        console.warn("[PriceAlertsContext] User not logged in");
        return;
      }

      // 楽観的更新
      const previousAlerts = alerts;
      setAlerts((prev) =>
        prev.map((a) =>
          a.productId === productId ? { ...a, targetPrice } : a,
        ),
      );

      try {
        const { error } = await supabase
          .from("price_alerts")
          .update({
            target_price: targetPrice,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          console.error("[PriceAlertsContext] Failed to update alert:", error);
          setAlerts(previousAlerts);
        }
      } catch (error) {
        console.error("[PriceAlertsContext] Error updating alert:", error);
        setAlerts(previousAlerts);
      }
    },
    [user, supabase, alerts],
  );

  /**
   * 商品のアラートを取得
   */
  const getAlert = useCallback(
    (productId: string) => {
      return alerts.find((a) => a.productId === productId);
    },
    [alerts],
  );

  /**
   * アラートが設定されているか確認
   */
  const hasAlert = useCallback(
    (productId: string) => {
      return alerts.some((a) => a.productId === productId);
    },
    [alerts],
  );

  return (
    <PriceAlertsContext.Provider
      value={{
        alerts,
        isLoading,
        isLoggedIn,
        addAlert,
        removeAlert,
        updateAlert,
        getAlert,
        hasAlert,
      }}
    >
      {children}
    </PriceAlertsContext.Provider>
  );
}

export function usePriceAlerts() {
  const context = useContext(PriceAlertsContext);
  if (context === undefined) {
    throw new Error("usePriceAlerts must be used within a PriceAlertsProvider");
  }
  return context;
}
