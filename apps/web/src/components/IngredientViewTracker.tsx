"use client";

import { useEffect } from "react";

interface IngredientViewTrackerProps {
  slug: string;
}

/**
 * 成分ガイド記事の表示回数をトラッキングするコンポーネント
 */
export function IngredientViewTracker({ slug }: IngredientViewTrackerProps) {
  useEffect(() => {
    // ページ読み込み時に1回だけviewCountをインクリメント
    const incrementView = async () => {
      try {
        await fetch(`/api/ingredients/${slug}/increment-view`, {
          method: "POST",
        });
      } catch (error) {
        // エラーは静かに無視（UXに影響を与えない）
        console.error("Failed to track view:", error);
      }
    };

    incrementView();
  }, [slug]);

  // このコンポーネントは何もレンダリングしない
  return null;
}
