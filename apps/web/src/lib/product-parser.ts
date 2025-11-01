/**
 * 商品名から数量・店舗名を抽出するユーティリティ
 */

/**
 * 商品名からセット数量を検出
 * 例: "3個セット" → 3, "18個セット" → 18, "単品" → 1
 */
export function extractQuantity(productName: string): number {
  // パターン1: "3個セット", "3袋セット", "3本セット"
  const setPattern = /(\d+)(個|袋|本|缶|箱|パック)セット/;
  const setMatch = productName.match(setPattern);
  if (setMatch) {
    return parseInt(setMatch[1], 10);
  }

  // パターン2: "×3袋", "*3袋", "x3袋"
  const multiplyPattern = /[×*xX](\d+)(個|袋|本|缶|箱|パック)/;
  const multiplyMatch = productName.match(multiplyPattern);
  if (multiplyMatch) {
    return parseInt(multiplyMatch[1], 10);
  }

  // パターン3: "(3袋)", "【3袋】"
  const bracketPattern = /[（(【](\d+)(個|袋|本|缶|箱|パック)[）)】]/;
  const bracketMatch = productName.match(bracketPattern);
  if (bracketMatch) {
    return parseInt(bracketMatch[1], 10);
  }

  // デフォルト: 単品として扱う
  return 1;
}

/**
 * 商品名から販売元（店舗名）を抽出
 * 例: "【ツルハドラッグ】商品名" → "ツルハドラッグ"
 */
export function extractStoreName(productName: string, source: string): string {
  // パターン1: 【店舗名】
  const bracketMatch = productName.match(/【(.+?)】/);
  if (bracketMatch) {
    return bracketMatch[1];
  }

  // パターン2: ＼店舗名／
  const slashMatch = productName.match(/＼(.+?)／/);
  if (slashMatch) {
    return slashMatch[1];
  }

  // パターン3: 既知の店舗名を検索
  const knownStores: Record<string, string[]> = {
    rakuten: [
      "ツルハドラッグ",
      "tsuruha",
      "楽天24",
      "rakuten24",
      "コスメ21",
      "アットライフ",
      "at-life",
      "くすりのフクタロウ",
      "DHC",
    ],
    yahoo: [
      "エクセレント",
      "ekuserennto",
      "セルニック",
      "selnic",
      "ヤフーショッピング",
    ],
  };

  const storeKeywords = knownStores[source] || [];
  for (const keyword of storeKeywords) {
    const regex = new RegExp(keyword, "i");
    if (regex.test(productName)) {
      return keyword;
    }
  }

  // デフォルト: ECサイト名を返す
  const sourceNames: Record<string, string> = {
    rakuten: "楽天市場",
    yahoo: "Yahoo!ショッピング",
    amazon: "Amazon",
    iherb: "iHerb",
  };

  return sourceNames[source] || source;
}

/**
 * 単位価格を計算
 */
export function calculateUnitPrice(
  totalPrice: number,
  quantity: number,
): number {
  if (quantity <= 0) return totalPrice;
  return Math.round(totalPrice / quantity);
}

/**
 * 商品情報を解析して構造化データを返す
 */
export interface ParsedProductInfo {
  quantity: number; // セット数量
  storeName: string; // 店舗名
  unitPrice: number; // 単位価格
  isBulk: boolean; // セット商品かどうか（2個以上）
}

export function parseProductInfo(
  productName: string,
  source: string,
  totalPrice: number,
): ParsedProductInfo {
  const quantity = extractQuantity(productName);
  const storeName = extractStoreName(productName, source);
  const unitPrice = calculateUnitPrice(totalPrice, quantity);
  const isBulk = quantity > 1;

  return {
    quantity,
    storeName,
    unitPrice,
    isBulk,
  };
}
