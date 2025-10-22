// 楽天市場API アダプター

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

/**
 * 楽天API固有の設定
 */
export interface RakutenAdapterConfig extends AdapterConfig {
  applicationId: string;
  applicationSecret?: string; // 一部のAPIエンドポイントで必要
  affiliateId?: string;
}

/**
 * 楽天商品検索APIレスポンス型（簡略版）
 */
interface RakutenItemSearchResponse {
  Items?: Array<{
    Item: {
      itemName: string;
      itemCode: string;
      itemPrice: number;
      itemUrl: string;
      affiliateUrl?: string;
      availability: number; // 0=売り切れ, 1=在庫あり
      reviewCount: number;
      reviewAverage: number;
      pointRate: number;
      janCode?: string;
    };
  }>;
  error?: string;
  error_description?: string;
}

/**
 * 楽天市場API アダプター
 *
 * @see https://webservice.rakuten.co.jp/documentation/ichiba-item-search
 */
export class RakutenAdapter extends BaseAdapter {
  readonly name = "rakuten";
  private rakutenConfig: RakutenAdapterConfig;
  private baseUrl =
    "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601";

  constructor(config: RakutenAdapterConfig) {
    super(config);
    this.rakutenConfig = config;
  }

  /**
   * 価格情報を取得
   */
  async fetchPrice(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<PriceData>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.searchItem(identifier),
      );

      if (!response.Items || response.Items.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.Items[0].Item;

      // ポイント還元を考慮した実効価格
      const pointDiscount = item.itemPrice * (item.pointRate / 100);
      const effectivePrice = item.itemPrice - pointDiscount;

      const priceData: PriceData = {
        amount: Math.round(effectivePrice), // 実効価格（ポイント還元後）
        currency: "JPY",
        source: "rakuten.jp",
        fetchedAt: new Date(),
        confidence: 0.92, // 楽天APIは高信頼度
        url: item.affiliateUrl || item.itemUrl,
        affiliateTag: this.rakutenConfig.affiliateId,
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

      if (!response.Items || response.Items.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.Items[0].Item;
      const stockStatus: StockStatus =
        item.availability === 1
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

      if (!response.Items || response.Items.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.Items[0].Item;

      const reviewData: ReviewData = {
        averageRating: item.reviewAverage,
        totalReviews: item.reviewCount,
        source: "rakuten.jp",
        fetchedAt: new Date(),
      };

      return { success: true, data: reviewData };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 楽天商品検索APIを呼び出し
   */
  private async searchItem(
    identifier: ProductIdentifier,
  ): Promise<RakutenItemSearchResponse> {
    const params = new URLSearchParams({
      applicationId: this.rakutenConfig.applicationId,
      formatVersion: "2",
    });

    // 識別子の優先順位: JAN > itemCode > keyword
    if (identifier.jan) {
      params.append("janCode", identifier.jan);
    } else if (identifier.itemCode) {
      params.append("itemCode", identifier.itemCode);
    } else if (identifier.title) {
      params.append("keyword", identifier.title);
      if (identifier.brand) {
        params.append("keyword", identifier.brand);
      }
    } else {
      throw new Error("有効な商品識別子が指定されていません");
    }

    // アフィリエイトID
    if (this.rakutenConfig.affiliateId) {
      params.append("affiliateId", this.rakutenConfig.affiliateId);
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(
        `Rakuten API Error: ${response.status} ${response.statusText}`,
      );
    }

    const data: RakutenItemSearchResponse = await response.json();

    // エラーレスポンスチェック
    if (data.error) {
      throw new Error(
        `Rakuten API Error: ${data.error} - ${data.error_description}`,
      );
    }

    return data;
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): AdapterResult<never> {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Rate limitエラー
    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests")
    ) {
      return {
        success: false,
        error: {
          code: "rate_limit" as AdapterErrorCode,
          message: "APIレート制限に達しました",
          details: error,
          retryable: true,
        },
      };
    }

    // 認証エラー
    if (
      errorMessage.includes("applicationId") ||
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
        applicationId: this.rakutenConfig.applicationId,
        keyword: "test",
        hits: "1",
      });

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await this.fetchWithTimeout(url);

      return response.ok;
    } catch {
      return false;
    }
  }
}
