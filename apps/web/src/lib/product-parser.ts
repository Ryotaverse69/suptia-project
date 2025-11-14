/**
 * 商品名から数量・店舗名を抽出するユーティリティ
 */

/**
 * 商品名からセット数量を検出（高度化版）
 * 例: "3個セット" → 3, "90粒×3袋" → 3, "120粒/2袋" → 2
 *
 * 対応パターン:
 * - 基本: "3個セット", "3袋セット"
 * - 複雑: "90粒×3袋", "120錠×2本"
 * - スラッシュ: "120粒/2袋"
 * - 期間セット: "30日分×3箱", "3ヶ月分×2袋"
 * - まとめ買い: "まとめ買い5個", "お得な3個セット"
 * - 倍率: "×3袋", "*3袋"
 * - 括弧: "(3袋)", "【3袋】"
 */
export function extractQuantity(productName: string): number {
  // パターン1: "90粒×3袋", "120錠×2本" (複雑セット表記)
  const complexSetPattern = /\d+[粒錠カプセル]+[×*xX](\d+)[個袋本缶箱パック]/;
  const complexMatch = productName.match(complexSetPattern);
  if (complexMatch) {
    return parseInt(complexMatch[1], 10);
  }

  // パターン2: "120粒/2袋" (スラッシュ区切り)
  const slashPattern = /\d+[粒錠カプセル]+\/(\d+)[個袋本缶箱パック]/;
  const slashMatch = productName.match(slashPattern);
  if (slashMatch) {
    return parseInt(slashMatch[1], 10);
  }

  // パターン3: "30日分×3箱", "3ヶ月分×2袋" (期間ベースセット)
  const durationSetPattern = /\d+[ヶ日週月]+分[×*xX](\d+)[個袋本缶箱パック]/;
  const durationMatch = productName.match(durationSetPattern);
  if (durationMatch) {
    return parseInt(durationMatch[1], 10);
  }

  // パターン4: "まとめ買い3個", "お得な5個セット" (まとめ買い表記)
  const bulkPattern = /(?:まとめ買い|お得な|大容量)(\d+)[個袋本缶箱パック]/;
  const bulkMatch = productName.match(bulkPattern);
  if (bulkMatch) {
    return parseInt(bulkMatch[1], 10);
  }

  // パターン5: "3個セット", "3袋セット", "3本セット" (基本セット表記)
  const setPattern = /(\d+)(個|袋|本|缶|箱|パック)セット/;
  const setMatch = productName.match(setPattern);
  if (setMatch) {
    return parseInt(setMatch[1], 10);
  }

  // パターン6: "×3袋", "*3袋", "x3袋" (倍率表記)
  const multiplyPattern = /[×*xX](\d+)(個|袋|本|缶|箱|パック)/;
  const multiplyMatch = productName.match(multiplyPattern);
  if (multiplyMatch) {
    return parseInt(multiplyMatch[1], 10);
  }

  // パターン7: "(3袋)", "【3袋】" (括弧表記)
  const bracketPattern = /[（(【](\d+)(個|袋|本|缶|箱|パック)[）)】]/;
  const bracketMatch = productName.match(bracketPattern);
  if (bracketMatch) {
    return parseInt(bracketMatch[1], 10);
  }

  // デフォルト: 単品として扱う
  return 1;
}

/**
 * itemCodeから店舗名を抽出
 * 例: "tsuruha:10020349" → "ツルハドラッグ"
 */
function extractStoreNameFromItemCode(itemCode: string): string | null {
  if (!itemCode) return null;

  // itemCodeの形式: "店舗コード:商品ID"
  const storeCode = itemCode.split(":")[0];

  // 店舗コードと店舗名のマッピング
  const storeMapping: Record<string, string> = {
    // 楽天市場の店舗
    tsuruha: "ツルハドラッグ",
    "at-life": "アットライフ",
    rakuten24: "楽天24",
    "cosme-cosme21": "コスメ21",
    fukutaro: "くすりのフクタロウ",
    // Yahoo!ショッピングの店舗
    ekuserennto: "エクセレント",
    selnic: "セルニック",
    // その他
    dhc: "DHC",
  };

  return storeMapping[storeCode] || null;
}

/**
 * 商品名から販売元（店舗名）を抽出
 * 例: "【ツルハドラッグ】商品名" → "ツルハドラッグ"
 */
export function extractStoreName(
  productName: string,
  source: string,
  itemCode?: string,
): string {
  // 優先順位1: itemCodeから店舗名を取得
  if (itemCode) {
    const storeFromCode = extractStoreNameFromItemCode(itemCode);
    if (storeFromCode) {
      return storeFromCode;
    }
  }

  // 優先順位2: 【店舗名】パターン
  const bracketMatch = productName.match(/【(.+?)】/);
  if (bracketMatch) {
    return bracketMatch[1];
  }

  // 優先順位3: ＼店舗名／パターン
  const slashMatch = productName.match(/＼(.+?)／/);
  if (slashMatch) {
    return slashMatch[1];
  }

  // 優先順位4: 既知の店舗名を検索
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
  itemCode?: string,
): ParsedProductInfo {
  const quantity = extractQuantity(productName);
  const storeName = extractStoreName(productName, source, itemCode);
  const unitPrice = calculateUnitPrice(totalPrice, quantity);
  const isBulk = quantity > 1;

  return {
    quantity,
    storeName,
    unitPrice,
    isBulk,
  };
}
