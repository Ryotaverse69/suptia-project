/**
 * 楽天市場APIアダプター
 *
 * 楽天市場の商品検索API（Ichiba Item Search API 2.0）を使用して
 * 商品データを取得します。
 *
 * API仕様: https://webservice.rakuten.co.jp/documentation/ichiba-item-search
 */

import {
  ECAdapter,
  ECProduct,
  SearchOptions,
  SearchResult,
  ECAdapterError,
  RateLimitError,
} from "./base";

/**
 * 楽天APIのレスポンス型定義
 */
interface RakutenItem {
  itemName: string;
  itemCode: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  mediumImageUrls?: Array<{ imageUrl: string }>;
  shopName: string;
  reviewAverage?: number;
  reviewCount?: number;
  itemCaption?: string;
  availability?: number; // 0: 売り切れ, 1: 在庫あり
  shopCode?: string;
  itemNumber?: string;
}

interface RakutenSearchResponse {
  Items?: Array<{
    Item: RakutenItem;
  }>;
  hits?: number;
  page?: number;
  pageCount?: number;
  error?: string;
  error_description?: string;
}

/**
 * 楽天アダプター
 */
export class RakutenAdapter implements ECAdapter {
  readonly name = "rakuten" as const;

  private readonly applicationId: string;
  private readonly affiliateId?: string;
  private readonly baseUrl =
    "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601";

  constructor() {
    this.applicationId = process.env.RAKUTEN_APPLICATION_ID || "";
    this.affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  }

  /**
   * アダプターが利用可能かチェック
   */
  isAvailable(): boolean {
    return !!this.applicationId;
  }

  /**
   * キーワードで商品を検索
   */
  async search(
    keyword: string,
    options: SearchOptions = {},
  ): Promise<SearchResult> {
    if (!this.isAvailable()) {
      throw new ECAdapterError(
        "楽天APIの認証情報が設定されていません",
        this.name,
      );
    }

    const {
      limit = 30,
      sortBy = "relevance",
      minPrice,
      maxPrice,
      page = 1,
    } = options;

    // APIパラメータ構築
    const params = new URLSearchParams({
      applicationId: this.applicationId,
      keyword,
      hits: Math.min(limit, 30).toString(), // 楽天APIの上限は30件
      page: page.toString(),
      sort: this.mapSortBy(sortBy),
      ...(this.affiliateId && { affiliateId: this.affiliateId }),
      ...(minPrice && { minPrice: minPrice.toString() }),
      ...(maxPrice && { maxPrice: maxPrice.toString() }),
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      // レート制限チェック
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        throw new RateLimitError(
          this.name,
          retryAfter ? parseInt(retryAfter) : undefined,
        );
      }

      if (!response.ok) {
        throw new ECAdapterError(
          `楽天API error: ${response.statusText}`,
          this.name,
          response.status,
        );
      }

      const data: RakutenSearchResponse = await response.json();

      // APIエラーチェック
      if (data.error) {
        throw new ECAdapterError(
          `楽天API error: ${data.error_description || data.error}`,
          this.name,
        );
      }

      // 商品データを正規化
      const products = (data.Items || []).map((item) =>
        this.normalizeProduct(item.Item),
      );

      return {
        products,
        total: data.hits || 0,
        page: data.page || 1,
        totalPages: data.pageCount || 1,
      };
    } catch (error) {
      if (error instanceof ECAdapterError || error instanceof RateLimitError) {
        throw error;
      }

      throw new ECAdapterError(
        `楽天API呼び出しエラー: ${error instanceof Error ? error.message : "Unknown error"}`,
        this.name,
        undefined,
        error,
      );
    }
  }

  /**
   * 商品IDから商品詳細を取得
   */
  async getProduct(productId: string): Promise<ECProduct | null> {
    if (!this.isAvailable()) {
      throw new ECAdapterError(
        "楽天APIの認証情報が設定されていません",
        this.name,
      );
    }

    const params = new URLSearchParams({
      applicationId: this.applicationId,
      itemCode: productId,
      ...(this.affiliateId && { affiliateId: this.affiliateId }),
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new ECAdapterError(
          `楽天API error: ${response.statusText}`,
          this.name,
          response.status,
        );
      }

      const data: RakutenSearchResponse = await response.json();

      if (!data.Items || data.Items.length === 0) {
        return null;
      }

      return this.normalizeProduct(data.Items[0].Item);
    } catch (error) {
      if (error instanceof ECAdapterError) {
        throw error;
      }

      throw new ECAdapterError(
        `楽天API呼び出しエラー: ${error instanceof Error ? error.message : "Unknown error"}`,
        this.name,
        undefined,
        error,
      );
    }
  }

  /**
   * 楽天の商品データを共通形式に変換
   */
  private normalizeProduct(item: RakutenItem): ECProduct {
    // itemCaptionからJANコードを抽出
    const janCode = this.extractJanCode(item.itemCaption);

    return {
      id: item.itemCode,
      name: item.itemName,
      price: item.itemPrice,
      currency: "JPY",
      url: item.itemUrl,
      affiliateUrl: item.affiliateUrl,
      imageUrl: item.mediumImageUrls?.[0]?.imageUrl,
      brand: item.shopName, // 楽天はブランド情報がないため店舗名を使用
      rating: item.reviewAverage,
      reviewCount: item.reviewCount,
      source: "rakuten",
      description: item.itemCaption,
      inStock: item.availability === 1,
      identifiers: {
        rakutenItemCode: item.itemCode,
        ...(janCode && { jan: janCode }),
      },
    };
  }

  /**
   * 商品説明文からJANコードを抽出
   *
   * 楽天APIはJANコード専用フィールドを持たないため、
   * itemCaption（商品説明）から正規表現で抽出します。
   *
   * 対応パターン:
   * - "JANコード:1234567890123"
   * - "JAN:1234567890123"
   * - "JAN 1234567890123"
   * - "JANコード 1234567890123"
   *
   * @param caption 商品説明文
   * @returns JANコード（8桁または13桁）、見つからない場合はundefined
   */
  private extractJanCode(caption?: string): string | undefined {
    if (!caption) return undefined;

    // JANコードのパターン: 8桁または13桁の数字
    // よくある表記: "JANコード:1234567890123", "JAN:1234567890123", "JAN 1234567890123"
    const patterns = [
      /JAN\s*コード\s*[:：]\s*(\d{8,13})/i,
      /JAN\s*[:：]\s*(\d{8,13})/i,
      /JAN\s+(\d{8,13})/i,
      /JAN\s*コード\s+(\d{8,13})/i,
    ];

    for (const pattern of patterns) {
      const match = caption.match(pattern);
      if (match && match[1]) {
        const code = match[1];
        // 8桁または13桁のみ許可（JANコードの標準形式）
        if (code.length === 8 || code.length === 13) {
          return code;
        }
      }
    }

    return undefined;
  }

  /**
   * ソート順を楽天API用にマッピング
   */
  private mapSortBy(sortBy: SearchOptions["sortBy"]): string {
    switch (sortBy) {
      case "price":
        return "+itemPrice"; // 価格昇順
      case "popularity":
        return "-sold"; // 売れ筋順
      case "rating":
        return "-reviewAverage"; // レビュー評価順
      case "relevance":
      default:
        return "standard"; // 標準（関連性順）
    }
  }
}
