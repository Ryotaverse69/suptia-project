/**
 * ECサイトアダプター共通インターフェース
 *
 * 各ECサイト（楽天、Yahoo!、Amazon）のAPIを抽象化し、
 * 統一されたインターフェースで商品データを取得できるようにします。
 */

/**
 * EC商品データの共通形式
 */
export interface ECProduct {
  /** 商品ID（ECサイト固有） */
  id: string;
  /** 商品名 */
  name: string;
  /** 価格 */
  price: number;
  /** 通貨コード */
  currency: string;
  /** 商品URL */
  url: string;
  /** 商品画像URL */
  imageUrl?: string;
  /** ブランド名（発売元・メーカー） */
  brand?: string;
  /** 店舗名（販売元） */
  shopName?: string;
  /** 平均評価（0-5） */
  rating?: number;
  /** レビュー数 */
  reviewCount?: number;
  /** データソース */
  source: "rakuten" | "yahoo" | "amazon";
  /** 商品説明 */
  description?: string;
  /** アフィリエイトURL */
  affiliateUrl?: string;
  /** 在庫状況 */
  inStock?: boolean;
  /** 商品識別子（JAN、ASINなど） */
  identifiers?: {
    jan?: string;
    asin?: string;
    upc?: string;
    ean?: string;
    rakutenItemCode?: string;
    yahooCode?: string;
  };
}

/**
 * 検索オプション
 */
export interface SearchOptions {
  /** 取得件数の上限 */
  limit?: number;
  /** ソート順 */
  sortBy?:
    | "price"
    | "price-asc"
    | "price-desc"
    | "popularity"
    | "popular"
    | "rating"
    | "relevance";
  /** 最低価格 */
  minPrice?: number;
  /** 最高価格 */
  maxPrice?: number;
  /** ページ番号 */
  page?: number;
}

/**
 * 検索結果
 */
export interface SearchResult {
  /** 商品リスト */
  products: ECProduct[];
  /** 総件数 */
  total: number;
  /** 現在のページ */
  page: number;
  /** 総ページ数 */
  totalPages: number;
}

/**
 * ECアダプター共通インターフェース
 */
export interface ECAdapter {
  /** アダプター名 */
  readonly name: "rakuten" | "yahoo" | "amazon";

  /**
   * キーワードで商品を検索
   * @param keyword 検索キーワード
   * @param options 検索オプション
   * @returns 検索結果
   */
  search(keyword: string, options?: SearchOptions): Promise<SearchResult>;

  /**
   * 商品IDから商品詳細を取得
   * @param productId 商品ID
   * @returns 商品データ（見つからない場合はnull）
   */
  getProduct(productId: string): Promise<ECProduct | null>;

  /**
   * アダプターが利用可能かチェック
   * （API認証情報が設定されているか）
   * @returns 利用可能ならtrue
   */
  isAvailable(): boolean;
}

/**
 * APIエラー
 */
export class ECAdapterError extends Error {
  constructor(
    message: string,
    public readonly source: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "ECAdapterError";
  }
}

/**
 * レート制限エラー
 */
export class RateLimitError extends ECAdapterError {
  constructor(
    source: string,
    public readonly retryAfter?: number,
  ) {
    super(`Rate limit exceeded for ${source}`, source, 429);
    this.name = "RateLimitError";
  }
}
