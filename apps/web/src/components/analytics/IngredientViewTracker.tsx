"use client";

import { useEffect } from "react";
import { trackIngredientView } from "@/lib/analytics";

interface IngredientViewTrackerProps {
  ingredientId: string;
  ingredientName: string;
}

/**
 * 成分ガイド閲覧トラッキングコンポーネント
 *
 * 成分ガイドページで使用し、ページ表示時にGA4イベントを送信します。
 */
export function IngredientViewTracker({
  ingredientId,
  ingredientName,
}: IngredientViewTrackerProps) {
  useEffect(() => {
    // ページ表示時に成分閲覧イベントを送信
    trackIngredientView(ingredientId, ingredientName);
  }, [ingredientId, ingredientName]);

  // このコンポーネントはUIを表示しない
  return null;
}
