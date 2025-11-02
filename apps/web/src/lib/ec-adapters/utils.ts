/**
 * EC Adapter共通ユーティリティ
 */

/**
 * 商品名からブランド名を抽出
 *
 * 楽天・Yahoo!などのECサイトAPIには、ブランド情報が含まれていない場合があります。
 * この関数は商品名からブランド名を推定します。
 *
 * 抽出ルール:
 * 1. 商品名の最初の単語（空白・記号区切り）をブランドとして抽出
 * 2. 括弧内の情報は除外（例: 【送料無料】、(公式)）
 * 3. よくあるノイズを除去（例: サプリメント、supplement）
 *
 * @param productName - 商品名（例: "DHC ビタミンC ハードカプセル 60日分"）
 * @returns ブランド名（例: "DHC"）、抽出できない場合は空文字
 *
 * @example
 * extractBrandFromProductName("DHC ビタミンC ハードカプセル 60日分") // "DHC"
 * extractBrandFromProductName("【送料無料】ネイチャーメイド マルチビタミン") // "ネイチャーメイド"
 * extractBrandFromProductName("ディアナチュラ 亜鉛 60粒") // "ディアナチュラ"
 */
export function extractBrandFromProductName(productName: string): string {
  if (!productName) return "";

  // 1. 括弧内の情報を除去（【】、()、[]、<>、＼/、◆、●、★など）
  let cleaned = productName
    .replace(/【[^】]*】/g, "") // 【送料無料】など
    .replace(/＼[^／]*／/g, "") // ＼ポイント5倍／など
    .replace(/\([^)]*\)/g, "") // (公式)など
    .replace(/\[[^\]]*\]/g, "") // [限定]など
    .replace(/<[^>]*>/g, "") // <新商品>など
    .replace(/◆[^◆]*◆/g, "") // ◆マーク囲み
    .replace(/●[^●]*●/g, "") // ●マーク囲み
    .replace(/★[^★]*★/g, "") // ★マーク囲み
    .replace(/^[＼◆●★■▲▼◎○☆※]/g, "") // プロモーション記号を先頭から削除
    .trim();

  // 2. 最初の単語を抽出（空白、全角空白、スラッシュ、ハイフンで区切り）
  const firstWord = cleaned.split(/[\s　/\-]/)[0].trim();

  // 3. ノイズ除去（一般的な接頭辞・サプリメント用語・プロモーション文言）
  const noisePatterns = [
    /^サプリメント$/i,
    /^サプリ$/i,
    /^supplement$/i,
    /^健康食品$/i,
    /^栄養補助食品$/i,
    /^送料無料$/i,
    /^公式$/i,
    /^正規品$/i,
    /^新品$/i,
    /ポイント[0-9０-９]+倍/i, // ポイント倍率
    /[0-9０-９]+%?OFF/i, // 割引率
    /クーポン/i,
    /タイムセール/i,
    /限定/i,
    /個セット/i,
    /まとめ買い/i,
    /メール便/i,
    /ネコポス/i,
    /ポスト投函/i,
    /定期便/i,
    /選べる/i,
    /ふるさと納税/i,
    /エントリーで/i,
    /POINT/i,
    /^第[0-9０-９]+類医薬品$/i,
  ];

  for (const pattern of noisePatterns) {
    if (pattern.test(firstWord)) {
      return "";
    }
  }

  // 4. 最小文字数チェック（1文字のブランド名は除外）
  if (firstWord.length < 2) {
    return "";
  }

  // 5. プロモーション文字列チェック（記号を含むものは除外）
  if (/[＼\\\/◆●★■▲▼◎○☆※【】（）《》「」]/.test(firstWord)) {
    return "";
  }

  return firstWord;
}

/**
 * 商品名からブランド名を抽出（フォールバック付き）
 *
 * extractBrandFromProductNameが空文字を返す場合、
 * デフォルトブランド名を返します。
 *
 * @param productName - 商品名
 * @param fallbackBrand - デフォルトブランド名（例: 販売元の店舗名）
 * @returns ブランド名
 */
export function extractBrandWithFallback(
  productName: string,
  fallbackBrand: string,
): string {
  const extracted = extractBrandFromProductName(productName);
  return extracted || fallbackBrand;
}
