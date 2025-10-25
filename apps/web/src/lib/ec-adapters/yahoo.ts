/**
 * Yahoo!ショッピング アダプター
 *
 * Yahoo!ショッピングWebサービス V3を使用して商品情報を取得します。
 *
 * API仕様:
 * https://developer.yahoo.co.jp/webapi/shopping/shopping/v3/itemsearch.html
 */

import type { ECAdapter, ECProduct, SearchOptions, SearchResult } from "./base";
import { ECAdapterError, RateLimitError } from "./base";

/**
 * Yahoo!ショッピングAPI レスポンス型定義
 */
interface YahooItem {
  name: string;
  code: string;
  price: number;
  url: string;
  image?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  description?: string;
  review?: {
    rate: number;
    count: number;
  };
  store?: {
    name: string;
  };
  janCode?: string;
  availability?: number; // 0: 在庫なし, 1: 在庫あり
}

interface YahooSearchResponse {
  hits?: YahooItem[];
  totalResultsAvailable?: number;
  totalResultsReturned?: number;
}

/**
 * Yahoo!ショッピング アダプター
 */
export class YahooAdapter implements ECAdapter {
  readonly name = "yahoo" as const;

  private readonly clientId: string;
  private readonly affiliateId?: string;
  private readonly baseUrl =
    "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch";

  constructor(clientId: string, affiliateId?: string) {
    if (!clientId) {
      throw new ECAdapterError(
        "Yahoo! Client ID is required",
        "yahoo",
        undefined,
        new Error("Missing clientId"),
      );
    }
    this.clientId = clientId;
    this.affiliateId = affiliateId;
  }

  /**
   * キーワードで商品を検索
   */
  async search(
    keyword: string,
    options: SearchOptions = {},
  ): Promise<SearchResult> {
    const {
      limit = 30,
      sortBy = "relevance",
      minPrice,
      maxPrice,
      page = 1,
    } = options;

    // Yahoo! APIは1リクエストあたり最大100件
    const hits = Math.min(limit, 100);
    const offset = (page - 1) * hits + 1; // Yahoo! APIは1始まり

    const params = new URLSearchParams({
      appid: this.clientId,
      query: keyword,
      hits: hits.toString(),
      offset: offset.toString(),
      sort: this.mapSortBy(sortBy),
      ...(minPrice && { price_from: minPrice.toString() }),
      ...(maxPrice && { price_to: maxPrice.toString() }),
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      // レート制限チェック
      if (response.status === 429) {
        throw new RateLimitError(
          "yahoo",
          parseInt(response.headers.get("Retry-After") || "60"),
        );
      }

      if (!response.ok) {
        throw new ECAdapterError(
          `Yahoo! API request failed: ${response.statusText}`,
          "yahoo",
          response.status,
        );
      }

      const data: YahooSearchResponse = await response.json();

      const products = (data.hits || []).map((item) =>
        this.normalizeProduct(item),
      );

      const total = data.totalResultsAvailable || 0;
      const totalPages = Math.ceil(total / hits);

      return {
        products,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      if (error instanceof ECAdapterError || error instanceof RateLimitError) {
        throw error;
      }

      throw new ECAdapterError(
        `Yahoo! API error: ${error instanceof Error ? error.message : String(error)}`,
        "yahoo",
        undefined,
        error,
      );
    }
  }

  /**
   * 商品IDで詳細情報を取得
   */
  async getProduct(productId: string): Promise<ECProduct | null> {
    try {
      const result = await this.search(productId, { limit: 1 });
      return result.products[0] || null;
    } catch (error) {
      console.error(`Failed to get Yahoo! product ${productId}:`, error);
      return null;
    }
  }

  /**
   * アダプターが利用可能かチェック
   */
  isAvailable(): boolean {
    return !!this.clientId;
  }

  /**
   * ソート順をYahoo! API形式に変換
   */
  private mapSortBy(sortBy: SearchOptions["sortBy"]): string {
    switch (sortBy) {
      case "price-asc":
        return "+price"; // 価格が安い順
      case "price-desc":
        return "-price"; // 価格が高い順
      case "rating":
        return "-review"; // レビューが高い順
      case "popular":
        return "-sold"; // 売れている順
      case "relevance":
      default:
        return "-score"; // 関連性が高い順（デフォルト）
    }
  }

  /**
   * Yahoo!商品データをECProduct形式に正規化
   */
  private normalizeProduct(item: YahooItem): ECProduct {
    // アフィリエイトリンクの生成
    let affiliateUrl = item.url;
    if (this.affiliateId) {
      // バリューコマース形式のアフィリエイトリンク
      affiliateUrl = `${this.affiliateId}${encodeURIComponent(item.url)}`;
    }

    return {
      id: item.code,
      name: item.name,
      price: item.price,
      currency: "JPY",
      url: item.url,
      affiliateUrl,
      imageUrl: item.image?.medium || item.image?.small,
      brand: item.store?.name,
      rating: item.review?.rate,
      reviewCount: item.review?.count,
      source: "yahoo",
      description: item.description,
      inStock: item.availability === 1,
      identifiers: {
        yahooCode: item.code,
        jan: item.janCode,
      },
    };
  }
}
