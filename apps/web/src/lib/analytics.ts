/**
 * Google Analytics カスタムイベントトラッキング
 *
 * 使用例:
 * ```typescript
 * import { trackEvent, trackProductView, trackProductClick } from '@/lib/analytics';
 *
 * // 一般的なイベント
 * trackEvent('button_click', { button_name: 'signup' });
 *
 * // 商品閲覧
 * trackProductView('vitamin-c-1000mg', 'Vitamin C 1000mg', 'Now Foods');
 *
 * // 商品クリック（外部リンク）
 * trackProductClick('vitamin-c-1000mg', 'amazon', 1980);
 * ```
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * 汎用イベントトラッキング
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>,
) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, parameters);
}

/**
 * 商品閲覧イベント
 * @param productId - 商品ID（slug）
 * @param productName - 商品名
 * @param brand - ブランド名
 * @param price - 価格（オプション）
 */
export function trackProductView(
  productId: string,
  productName: string,
  brand: string,
  price?: number,
) {
  trackEvent("view_item", {
    item_id: productId,
    item_name: productName,
    item_brand: brand,
    ...(price && { price }),
  });
}

/**
 * 商品クリックイベント（外部リンク）
 * @param productId - 商品ID（slug）
 * @param source - ECサイト名（amazon/rakuten/yahoo等）
 * @param price - 価格
 */
export function trackProductClick(
  productId: string,
  source: string,
  price: number,
) {
  trackEvent("select_item", {
    item_id: productId,
    source,
    price,
  });
}

/**
 * 検索イベント
 * @param searchTerm - 検索キーワード
 */
export function trackSearch(searchTerm: string) {
  trackEvent("search", {
    search_term: searchTerm,
  });
}

/**
 * フィルター使用イベント
 * @param filterType - フィルタータイプ（category/price/brand等）
 * @param filterValue - フィルター値
 */
export function trackFilter(filterType: string, filterValue: string) {
  trackEvent("filter_used", {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

/**
 * 診断開始イベント
 */
export function trackDiagnosisStart() {
  trackEvent("diagnosis_start", {});
}

/**
 * 診断完了イベント
 * @param resultCount - 推薦商品数
 */
export function trackDiagnosisComplete(resultCount: number) {
  trackEvent("diagnosis_complete", {
    result_count: resultCount,
  });
}

/**
 * 価格アラート登録イベント
 * @param productId - 商品ID（slug）
 * @param targetPrice - 目標価格
 */
export function trackPriceAlertCreated(productId: string, targetPrice: number) {
  trackEvent("price_alert_created", {
    item_id: productId,
    target_price: targetPrice,
  });
}

/**
 * お気に入り追加イベント
 * @param productId - 商品ID（slug）
 */
export function trackFavoriteAdded(productId: string) {
  trackEvent("favorite_added", {
    item_id: productId,
  });
}

/**
 * 成分ガイド閲覧イベント
 * @param ingredientId - 成分ID（slug）
 * @param ingredientName - 成分名
 */
export function trackIngredientView(
  ingredientId: string,
  ingredientName: string,
) {
  trackEvent("ingredient_view", {
    ingredient_id: ingredientId,
    ingredient_name: ingredientName,
  });
}

/**
 * アウトバウンドリンククリックイベント
 * @param url - リンク先URL
 * @param linkText - リンクテキスト
 */
export function trackOutboundLink(url: string, linkText?: string) {
  trackEvent("click", {
    event_category: "outbound",
    event_label: url,
    ...(linkText && { link_text: linkText }),
  });
}

/**
 * エラートラッキング
 * @param errorMessage - エラーメッセージ
 * @param errorLocation - エラー発生場所
 */
export function trackError(errorMessage: string, errorLocation: string) {
  trackEvent("exception", {
    description: errorMessage,
    location: errorLocation,
    fatal: false,
  });
}

/**
 * フォーム送信イベント
 * @param formName - フォーム名
 * @param formCategory - フォームカテゴリ（contact/diagnosis等）
 */
export function trackFormSubmit(formName: string, formCategory: string) {
  trackEvent("form_submit", {
    form_name: formName,
    form_category: formCategory,
  });
}

/**
 * ページスクロールイベント（スクロール深度90%）
 */
export function trackScrollDepth() {
  trackEvent("scroll", {
    percent_scrolled: 90,
  });
}

// TypeScript型定義（gtag用）
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer: unknown[];
  }
}
