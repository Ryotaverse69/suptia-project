// Yahoo!ショッピングAPI アダプター

import { BaseAdapter } from "./base";
import type {
  PriceData,
  StockStatus,
  ReviewData,
  ProductIdentifier,
  AdapterResult,
  AdapterConfig,
  AdapterErrorCode,
} from "./types";
import {
  getPriceCache,
  generateCacheKey,
  withCache,
  DEFAULT_CACHE_TTL,
} from "./cache";

/**
 * Yahoo! Shopping API固有の設定
 */
export interface YahooAdapterConfig extends AdapterConfig {
  clientId: string; // アプリケーションID
  valueCommerceSid?: string; // バリューコマース サイトID
  valueCommercePid?: string; // バリューコマース プログラムID
}

/**
 * Yahoo!ショッピング商品検索APIレスポンス型（V3）
 */
interface YahooItemSearchResponse {
  totalResultsAvailable?: number;
  totalResultsReturned?: number;
  firstResultPosition?: number;
  hits?: Array<{
    name: string;
    code: string;
    price: number;
    priceLabel?: {
      taxable?: boolean;
      defaultPrice?: number;
      discountedPrice?: number;
      fixedPrice?: number;
      premiumPrice?: number;
      priceRange?: string;
      salePrice?: number;
    };
    url: string;
    affiliateUrl?: string;
    inStock: boolean;
    review?: {
      count: number;
      rate: number;
      url?: string;
    };
    store?: {
      id: string;
      name: string;
      url: string;
    };
    janCode?: string;
    brand?: {
      id: string;
      name: string;
    };
  }>;
  error?: string;
}

/**
 * Yahoo!ショッピングAPI アダプター
 *
 * @see https://developer.yahoo.co.jp/webapi/shopping/v3/itemsearch.html
 */
export class YahooAdapter extends BaseAdapter {
  readonly name = "yahoo";
  private yahooConfig: YahooAdapterConfig;
  private baseUrl =
    "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch";

  constructor(config: YahooAdapterConfig) {
    super(config);
    this.yahooConfig = config;
  }

  /**
   * バリューコマースのアフィリエイトリンクを生成
   */
  private generateValueCommerceUrl(originalUrl: string): string {
    const { valueCommerceSid, valueCommercePid } = this.yahooConfig;

    if (!valueCommerceSid || !valueCommercePid) {
      return originalUrl;
    }

    const encodedUrl = encodeURIComponent(originalUrl);
    return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${valueCommerceSid}&pid=${valueCommercePid}&vc_url=${encodedUrl}`;
  }

  /**
   * 価格情報を取得（キャッシュ対応）
   */
  async fetchPrice(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<PriceData>> {
    const cacheKey = generateCacheKey(this.name, identifier, "price");
    const cache = getPriceCache();

    return withCache(
      cache,
      cacheKey,
      () => this.fetchPriceFromAPI(identifier),
      DEFAULT_CACHE_TTL.PRICE,
    );
  }

  /**
   * APIから価格情報を取得（内部メソッド）
   */
  private async fetchPriceFromAPI(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<PriceData>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.searchItem(identifier),
      );

      if (!response.hits || response.hits.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.hits[0];

      // 価格の優先順位: セール価格 > プレミアム価格 > 通常価格
      const price =
        item.priceLabel?.salePrice ||
        item.priceLabel?.premiumPrice ||
        item.price;

      // バリューコマースのアフィリエイトリンクを生成
      const affiliateUrl = this.generateValueCommerceUrl(item.url);

      const priceData: PriceData = {
        amount: price,
        currency: "JPY",
        source: "shopping.yahoo.co.jp",
        fetchedAt: new Date(),
        confidence: 0.9, // Yahoo!APIは高信頼度
        url: affiliateUrl,
      };

      return { success: true, data: priceData };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 在庫状況を取得
   */
  async fetchStock(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<StockStatus>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.searchItem(identifier),
      );

      if (!response.hits || response.hits.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.hits[0];
      const stockStatus: StockStatus = item.inStock
        ? ("in_stock" as StockStatus)
        : ("out_of_stock" as StockStatus);

      return { success: true, data: stockStatus };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * レビュー情報を取得
   */
  async fetchReviews(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<ReviewData>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.searchItem(identifier),
      );

      if (!response.hits || response.hits.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.hits[0];

      const reviewData: ReviewData = {
        averageRating: item.review?.rate || 0,
        totalReviews: item.review?.count || 0,
        source: "shopping.yahoo.co.jp",
        fetchedAt: new Date(),
      };

      return { success: true, data: reviewData };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Yahoo!ショッピング商品検索APIを呼び出し
   */
  private async searchItem(
    identifier: ProductIdentifier,
  ): Promise<YahooItemSearchResponse> {
    const params = new URLSearchParams({
      appid: this.yahooConfig.clientId,
      results: "1", // 最初の1件のみ取得（効率化）
    });

    // 識別子の優先順位: JAN > itemCode > query
    if (identifier.jan) {
      params.append("jan_code", identifier.jan);
    } else if (identifier.itemCode) {
      // Yahoo!には商品コードで検索するパラメータがないため、queryとして扱う
      params.append("query", identifier.itemCode);
    } else if (identifier.title) {
      let query = identifier.title;
      if (identifier.brand) {
        query = `${identifier.brand} ${query}`;
      }
      params.append("query", query);
    } else {
      throw new Error("有効な商品識別子が指定されていません");
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(
        `Yahoo Shopping API Error: ${response.status} ${response.statusText}`,
      );
    }

    const data: YahooItemSearchResponse = await response.json();

    // エラーレスポンスチェック
    if (data.error) {
      throw new Error(`Yahoo Shopping API Error: ${data.error}`);
    }

    return data;
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): AdapterResult<never> {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Rate limitエラー（1リクエスト/秒制限）
    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests")
    ) {
      return {
        success: false,
        error: {
          code: "rate_limit" as AdapterErrorCode,
          message: "APIレート制限に達しました（1リクエスト/秒）",
          details: error,
          retryable: true,
        },
      };
    }

    // 認証エラー
    if (
      errorMessage.includes("appid") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      return {
        success: false,
        error: {
          code: "auth_error" as AdapterErrorCode,
          message: "API認証エラー",
          details: error,
          retryable: false,
        },
      };
    }

    // ネットワークエラー
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED")
    ) {
      return {
        success: false,
        error: {
          code: "network_error" as AdapterErrorCode,
          message: "ネットワークエラーが発生しました",
          details: error,
          retryable: true,
        },
      };
    }

    // デフォルトエラー
    return {
      success: false,
      error: {
        code: "unknown" as AdapterErrorCode,
        message: errorMessage,
        details: error,
        retryable: false,
      },
    };
  }

  /**
   * ヘルスチェック（API疎通確認）
   */
  async healthCheck(): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        appid: this.yahooConfig.clientId,
        query: "test",
        results: "1",
      });

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await this.fetchWithTimeout(url);

      return response.ok;
    } catch {
      return false;
    }
  }
}
