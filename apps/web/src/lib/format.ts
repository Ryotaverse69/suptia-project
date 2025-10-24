/**
 * 価格フォーマットユーティリティ
 * サーバーサイドレンダリングとクライアントサイドで一貫した結果を保証
 */

/**
 * 価格を日本円形式でフォーマット
 * @param price - 価格（数値）
 * @returns フォーマットされた価格文字列（例: "¥1,234"）
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) {
    return "¥0";
  }

  // Intl.NumberFormatを使用してサーバー・クライアント両方で一貫した結果を保証
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}

/**
 * 数値を3桁区切りでフォーマット（通貨記号なし）
 * @param value - 数値
 * @returns フォーマットされた数値文字列（例: "1,234"）
 */
export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return "0";
  }

  return new Intl.NumberFormat("ja-JP").format(value);
}
