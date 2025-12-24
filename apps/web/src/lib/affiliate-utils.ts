/**
 * アフィリエイトリンクユーティリティ
 *
 * すべてのECサイトリンクに適切なアフィリエイトタグを付与する
 */

// Amazonアソシエイトタグ
const AMAZON_ASSOCIATE_TAG = "suptia6902-22";

/**
 * Amazonリンクにアソシエイトタグがあればそのまま、なければ追加する
 *
 * @param url - AmazonのURL
 * @returns タグ付きURL
 */
export function ensureAmazonAffiliateTag(url: string): string {
  if (!url) return url;

  // Amazonリンクかどうかを確認
  if (!isAmazonUrl(url)) {
    return url;
  }

  try {
    const urlObj = new URL(url);

    // 既にtagパラメータがある場合
    if (urlObj.searchParams.has("tag")) {
      const existingTag = urlObj.searchParams.get("tag");
      // 正しいタグなら変更しない
      if (existingTag === AMAZON_ASSOCIATE_TAG) {
        return url;
      }
      // 古いタグを新しいタグに置き換え
      urlObj.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
      return urlObj.toString();
    }

    // tagパラメータがない場合は追加
    urlObj.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
    return urlObj.toString();
  } catch {
    // URLパースに失敗した場合は、単純な文字列操作で追加
    if (url.includes("?")) {
      return `${url}&tag=${AMAZON_ASSOCIATE_TAG}`;
    }
    return `${url}?tag=${AMAZON_ASSOCIATE_TAG}`;
  }
}

/**
 * URLがAmazonのものかどうかを判定
 */
export function isAmazonUrl(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes("amazon.co.jp") ||
    lowerUrl.includes("amazon.com") ||
    lowerUrl.includes("amzn.to") ||
    lowerUrl.includes("amzn.asia")
  );
}

/**
 * 価格データのURLにアフィリエイトタグを追加
 *
 * @param url - ECサイトのURL
 * @param source - ソース（amazon, rakuten, yahoo, iherb）
 * @returns タグ付きURL
 */
export function ensureAffiliateTag(url: string, source?: string): string {
  if (!url) return url;

  // ソースが指定されていない場合はURLから判定
  const detectedSource = source || detectSourceFromUrl(url);

  switch (detectedSource) {
    case "amazon":
      return ensureAmazonAffiliateTag(url);
    // 楽天とYahoo!は既にアフィリエイトURLが設定されているはず
    // 将来的に必要であれば追加
    default:
      return url;
  }
}

/**
 * URLからECサイトのソースを判定
 */
function detectSourceFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (isAmazonUrl(lowerUrl)) return "amazon";
  if (lowerUrl.includes("rakuten")) return "rakuten";
  if (lowerUrl.includes("yahoo") || lowerUrl.includes("shopping.yahoo"))
    return "yahoo";
  if (lowerUrl.includes("iherb")) return "iherb";
  return "unknown";
}

/**
 * アフィリエイト開示文言を取得
 */
export function getAffiliateDisclosure(): string {
  return "※当サイトはAmazonアソシエイト、楽天アフィリエイト、バリューコマースを含むアフィリエイトプログラムに参加しています。";
}

/**
 * 現在のAmazonアソシエイトタグを取得
 */
export function getAmazonAssociateTag(): string {
  return AMAZON_ASSOCIATE_TAG;
}
