"use client";

import { useEffect } from "react";
import { trackProductView } from "@/lib/analytics";

interface ProductViewTrackerProps {
  productId: string;
  productName: string;
  brand: string;
  price?: number;
}

/**
 * 商品閲覧トラッキングコンポーネント
 *
 * 商品詳細ページで使用し、ページ表示時にGA4イベントを送信します。
 */
export function ProductViewTracker({
  productId,
  productName,
  brand,
  price,
}: ProductViewTrackerProps) {
  useEffect(() => {
    // ページ表示時に商品閲覧イベントを送信
    trackProductView(productId, productName, brand, price);
  }, [productId, productName, brand, price]);

  // このコンポーネントはUIを表示しない
  return null;
}
