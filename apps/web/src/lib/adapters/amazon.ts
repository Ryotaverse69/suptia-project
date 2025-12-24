// Amazon Product Advertising API 5.0 アダプター

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
 * Amazon PA-API 5.0固有の設定
 */
export interface AmazonAdapterConfig extends AdapterConfig {
  accessKeyId: string;
  secretAccessKey: string;
  associateTag: string;
  region?: string; // デフォルト: "us-west-2"
  marketplace?: string; // デフォルト: "www.amazon.co.jp"
}

/**
 * Amazon PA-API 5.0レスポンス型（簡略版）
 */
interface AmazonProductResponse {
  ItemsResult?: {
    Items?: Array<{
      ASIN: string;
      DetailPageURL: string;
      Offers?: {
        Listings?: Array<{
          Price?: {
            Amount: number;
            Currency: string;
          };
          Availability?: {
            Type: string;
          };
        }>;
      };
      CustomerReviews?: {
        StarRating?: number;
        Count?: number;
      };
    }>;
  };
  Errors?: Array<{
    Code: string;
    Message: string;
  }>;
}

/**
 * Amazon PA-API 5.0 アダプター
 *
 * @see https://webservices.amazon.com/paapi5/documentation/
 */
export class AmazonAdapter extends BaseAdapter {
  readonly name = "amazon";
  private amazonConfig: AmazonAdapterConfig;

  constructor(config: AmazonAdapterConfig) {
    super(config);
    this.amazonConfig = {
      region: "us-west-2",
      marketplace: "www.amazon.co.jp",
      ...config,
    };
  }

  /**
   * 価格情報を取得
   */
  async fetchPrice(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<PriceData>> {
    try {
      // ASINを優先的に使用
      const asin = identifier.asin || identifier.ean || identifier.jan;

      if (!asin) {
        return {
          success: false,
          error: {
            code: "invalid_identifier" as AdapterErrorCode,
            message: "ASIN, EAN, またはJANが必要です",
            retryable: false,
          },
        };
      }

      // PA-API 5.0リクエストを作成・実行
      const response = await this.retryWithBackoff(() =>
        this.callPAAPI("GetItems", { ItemIds: [asin] }),
      );

      if (!response.ItemsResult?.Items?.[0]) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const item = response.ItemsResult.Items[0];
      const listing = item.Offers?.Listings?.[0];

      if (!listing?.Price) {
        return {
          success: false,
          error: {
            code: "invalid_response" as AdapterErrorCode,
            message: "価格情報が取得できませんでした",
            retryable: true,
          },
        };
      }

      const priceData: PriceData = {
        amount: listing.Price.Amount,
        currency: listing.Price.Currency,
        source: "amazon.jp",
        fetchedAt: new Date(),
        confidence: 0.95, // PA-APIは高信頼度
        url: item.DetailPageURL,
        affiliateTag: this.amazonConfig.associateTag,
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
      const asin = identifier.asin || identifier.ean || identifier.jan;

      if (!asin) {
        return {
          success: false,
          error: {
            code: "invalid_identifier" as AdapterErrorCode,
            message: "ASIN, EAN, またはJANが必要です",
            retryable: false,
          },
        };
      }

      const response = await this.retryWithBackoff(() =>
        this.callPAAPI("GetItems", { ItemIds: [asin] }),
      );

      const item = response.ItemsResult?.Items?.[0];
      const availability = item?.Offers?.Listings?.[0]?.Availability?.Type;

      let stockStatus: StockStatus;
      switch (availability) {
        case "Now":
          stockStatus = "in_stock" as StockStatus;
          break;
        case "OutOfStock":
          stockStatus = "out_of_stock" as StockStatus;
          break;
        case "Preorder":
          stockStatus = "preorder" as StockStatus;
          break;
        default:
          stockStatus = "unknown" as StockStatus;
      }

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
      const asin = identifier.asin || identifier.ean || identifier.jan;

      if (!asin) {
        return {
          success: false,
          error: {
            code: "invalid_identifier" as AdapterErrorCode,
            message: "ASIN, EAN, またはJANが必要です",
            retryable: false,
          },
        };
      }

      const response = await this.retryWithBackoff(() =>
        this.callPAAPI("GetItems", { ItemIds: [asin] }),
      );

      const item = response.ItemsResult?.Items?.[0];
      const reviews = item?.CustomerReviews;

      if (!reviews) {
        return {
          success: false,
          error: {
            code: "invalid_response" as AdapterErrorCode,
            message: "レビュー情報が取得できませんでした",
            retryable: true,
          },
        };
      }

      const reviewData: ReviewData = {
        averageRating: reviews.StarRating || 0,
        totalReviews: reviews.Count || 0,
        source: "amazon.jp",
        fetchedAt: new Date(),
      };

      return { success: true, data: reviewData };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PA-API 5.0エンドポイントを呼び出し
   *
   * NOTE: 実際の実装では署名生成が必要（AWS Signature Version 4）
   * @see https://webservices.amazon.com/paapi5/documentation/sending-request.html
   */
  private async callPAAPI(
    operation: string,
    params: Record<string, unknown>,
  ): Promise<AmazonProductResponse> {
    const endpoint = `https://webservices.amazon.${this.getMarketplaceTLD()}/paapi5/${operation.toLowerCase()}`;

    // TODO: AWS Signature Version 4を使った署名生成
    // 現状はモックレスポンスを返す（実装時に置き換え）
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Amazon Adapter] PA-API署名が未実装です。モックデータを返します。",
      );
      return this.getMockResponse();
    }

    // 本番環境では実際のAPIを呼び出す
    const headers = this.generateSignedHeaders(operation, params);

    const response = await this.fetchWithTimeout(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(
        `PA-API Error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * マーケットプレイスからTLDを取得
   */
  private getMarketplaceTLD(): string {
    const marketplace = this.amazonConfig.marketplace || "www.amazon.co.jp";
    if (marketplace.includes("co.jp")) return "co.jp";
    if (marketplace.includes("com")) return "com";
    return "co.jp"; // デフォルト
  }

  /**
   * AWS Signature Version 4でヘッダーを生成
   *
   * TODO: 実装が必要
   * @see https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
   */
  private generateSignedHeaders(
    _operation: string,
    _params: Record<string, unknown>,
  ): Record<string, string> {
    return {
      "Content-Type": "application/json; charset=utf-8",
      "X-Amz-Target": `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${_operation}`,
      "Content-Encoding": "amz-1.0",
      // TODO: 署名ヘッダーを追加
    };
  }

  /**
   * モックレスポンス（開発用）
   */
  private getMockResponse(): AmazonProductResponse {
    return {
      ItemsResult: {
        Items: [
          {
            ASIN: "B00TEST123",
            DetailPageURL:
              "https://amazon.co.jp/dp/B00TEST123?tag=suptia6902-22",
            Offers: {
              Listings: [
                {
                  Price: {
                    Amount: 1980,
                    Currency: "JPY",
                  },
                  Availability: {
                    Type: "Now",
                  },
                },
              ],
            },
            CustomerReviews: {
              StarRating: 4.5,
              Count: 120,
            },
          },
        ],
      },
    };
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): AdapterResult<never> {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Rate limitエラーを検出
    if (
      errorMessage.includes("TooManyRequests") ||
      errorMessage.includes("429")
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
      // 軽量なリクエストでAPIの疎通を確認
      // 実装時はダミーASINでテスト
      return true;
    } catch {
      return false;
    }
  }
}
