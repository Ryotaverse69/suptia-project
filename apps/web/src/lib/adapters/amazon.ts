// Amazon Creators API アダプター（PA-API 5.0後継）
//
// 2026年〜 PA-API 5.0が廃止予定のため、Creators APIを使用。
// 認証: OAuth 2.0 (Amazon Cognito)
// エンドポイント: https://creatorsapi.amazon/catalog/v1
//
// @see https://github.com/hakanensari/vacuum (参考実装)

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
 * Amazon Creators API 設定
 */
export interface AmazonAdapterConfig extends AdapterConfig {
  credentialId: string;
  credentialSecret: string;
  associateTag: string;
  version?: string; // "2.1"=NA, "2.2"=EU, "2.3"=FE(Japan)
  marketplace?: string; // デフォルト: "www.amazon.co.jp"
}

// PA-API互換（既存コードとの後方互換性）
export type { AmazonAdapterConfig as AmazonPAAPIConfig };

/**
 * Creators API アイテム型
 */
export interface CreatorsAPIItem {
  asin: string;
  detailPageUrl: string;
  itemInfo?: {
    title?: { displayValue: string; label: string; locale: string };
    byLineInfo?: {
      brand?: { displayValue: string; label: string; locale: string };
      manufacturer?: { displayValue: string; label: string; locale: string };
    };
    features?: { displayValues: string[] };
  };
  offersV2?: {
    listings?: Array<{
      price?: {
        amount: number;
        currency: string;
        displayAmount: string;
      };
      availability?: {
        type: string;
        message?: string;
      };
      condition?: {
        value: string;
      };
      merchantInfo?: {
        name: string;
      };
      isBuyBoxWinner?: boolean;
    }>;
  };
  customerReviews?: {
    starRating?: { value: number };
    count?: number;
  };
  images?: {
    primary?: {
      large?: { url: string; width: number; height: number };
    };
  };
}

// 後方互換エイリアス
export type PAAPIItem = CreatorsAPIItem;

/**
 * Creators API レスポンス型
 */
interface CreatorsAPIResponse {
  itemsResult?: {
    items?: CreatorsAPIItem[];
  };
  searchResult?: {
    items?: CreatorsAPIItem[];
    totalResultCount?: number;
    searchUrl?: string;
  };
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

/**
 * SearchItems用パラメータ
 */
export interface AmazonSearchParams {
  keywords: string;
  searchIndex?: string; // デフォルト: "HealthPersonalCare"
  itemCount?: number; // デフォルト: 10, 最大: 10
  resources?: string[];
}

// --- OAuth 2.0 トークン管理 ---

/**
 * Cognito認証エンドポイント（バージョン別）
 */
const AUTH_URLS: Record<string, string> = {
  "2.1": "https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token", // NA
  "2.2": "https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token", // EU
  "2.3": "https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token", // FE (Japan)
};

const API_BASE_URL = "https://creatorsapi.amazon/catalog/v1";
const TOKEN_TTL_MS = 59.5 * 60 * 1000; // 59.5分（トークン有効期限1時間の少し前）

/**
 * Amazon Creators API アダプター
 *
 * OAuth 2.0 Bearer Tokenによる認証を使用して
 * Amazon Creators API と通信する。
 */
export class AmazonAdapter extends BaseAdapter {
  readonly name = "amazon";
  private amazonConfig: AmazonAdapterConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: AmazonAdapterConfig) {
    super(config);
    this.amazonConfig = {
      version: "2.3", // デフォルト: Far East (Japan)
      marketplace: "www.amazon.co.jp",
      ...config,
    };
  }

  // =========================================================================
  // OAuth 2.0 トークン管理
  // =========================================================================

  /**
   * OAuth 2.0 アクセストークンを取得（キャッシュ対応）
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const version = this.amazonConfig.version || "2.3";
    const authUrl = AUTH_URLS[version];
    if (!authUrl) {
      throw new Error(`未知のAPIバージョン: ${version}`);
    }

    // Basic認証でトークン取得
    const credentials = Buffer.from(
      `${this.amazonConfig.credentialId}:${this.amazonConfig.credentialSecret}`,
    ).toString("base64");

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials&scope=creatorsapi/default",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth Token取得失敗: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + TOKEN_TTL_MS;

    return this.accessToken!;
  }

  // =========================================================================
  // 商品識別子の解決
  // =========================================================================

  /**
   * 商品識別子からitemIdとitemIdTypeを解決
   * ASIN > EAN > JAN の優先順位
   */
  private resolveIdentifier(identifier: ProductIdentifier): {
    itemId: string | null;
    itemIdType: string | null;
  } {
    if (identifier.asin) {
      return { itemId: identifier.asin, itemIdType: null }; // ASINはデフォルト
    }
    if (identifier.ean) {
      return { itemId: identifier.ean, itemIdType: "EAN" };
    }
    if (identifier.jan) {
      return { itemId: identifier.jan, itemIdType: "EAN" }; // JAN = EAN-13互換
    }
    return { itemId: null, itemIdType: null };
  }

  // =========================================================================
  // ProductPriceAdapter インターフェース実装
  // =========================================================================

  /**
   * 価格情報を取得
   */
  async fetchPrice(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<PriceData>> {
    try {
      const { itemId, itemIdType } = this.resolveIdentifier(identifier);

      if (!itemId) {
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
        this.callCreatorsAPI("getItems", {
          itemIds: [itemId],
          ...(itemIdType && { itemIdType }),
        }),
      );

      const item = response.itemsResult?.items?.[0];
      if (!item) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "商品が見つかりませんでした",
            retryable: false,
          },
        };
      }

      const listing = item.offersV2?.listings?.[0];
      if (!listing?.price) {
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
        amount: listing.price.amount,
        currency: listing.price.currency,
        source: "amazon.jp",
        fetchedAt: new Date(),
        confidence: 0.95,
        url: item.detailPageUrl,
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
      const { itemId, itemIdType } = this.resolveIdentifier(identifier);

      if (!itemId) {
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
        this.callCreatorsAPI("getItems", {
          itemIds: [itemId],
          ...(itemIdType && { itemIdType }),
        }),
      );

      const item = response.itemsResult?.items?.[0];
      const availability = item?.offersV2?.listings?.[0]?.availability?.type;

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
      const { itemId, itemIdType } = this.resolveIdentifier(identifier);

      if (!itemId) {
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
        this.callCreatorsAPI("getItems", {
          itemIds: [itemId],
          ...(itemIdType && { itemIdType }),
        }),
      );

      const item = response.itemsResult?.items?.[0];
      const reviews = item?.customerReviews;

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
        averageRating: reviews.starRating?.value || 0,
        totalReviews: reviews.count || 0,
        source: "amazon.jp",
        fetchedAt: new Date(),
      };

      return { success: true, data: reviewData };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 複数商品の価格を一括取得（最大10件/リクエスト）
   */
  async fetchBatchPrices(
    identifiers: ProductIdentifier[],
  ): Promise<AdapterResult<PriceData>[]> {
    const BATCH_SIZE = 10;
    const results: AdapterResult<PriceData>[] = [];

    for (let i = 0; i < identifiers.length; i += BATCH_SIZE) {
      const batch = identifiers.slice(i, i + BATCH_SIZE);
      const asinBatch = batch
        .map((id) => id.asin)
        .filter((asin): asin is string => !!asin);

      if (asinBatch.length === 0) {
        batch.forEach(() =>
          results.push({
            success: false,
            error: {
              code: "invalid_identifier" as AdapterErrorCode,
              message: "ASINが必要です（バッチ取得はASINのみ対応）",
              retryable: false,
            },
          }),
        );
        continue;
      }

      try {
        const response = await this.retryWithBackoff(() =>
          this.callCreatorsAPI("getItems", { itemIds: asinBatch }),
        );

        const items = response.itemsResult?.items || [];
        const itemMap = new Map(items.map((item) => [item.asin, item]));

        for (const asin of asinBatch) {
          const item = itemMap.get(asin);
          const listing = item?.offersV2?.listings?.[0];

          if (item && listing?.price) {
            results.push({
              success: true,
              data: {
                amount: listing.price.amount,
                currency: listing.price.currency,
                source: "amazon.jp",
                fetchedAt: new Date(),
                confidence: 0.95,
                url: item.detailPageUrl,
                affiliateTag: this.amazonConfig.associateTag,
              },
            });
          } else {
            results.push({
              success: false,
              error: {
                code: "not_found" as AdapterErrorCode,
                message: `ASIN ${asin} の価格情報が取得できませんでした`,
                retryable: false,
              },
            });
          }
        }
      } catch (error) {
        asinBatch.forEach(() => results.push(this.handleError(error)));
      }

      // レート制限対策: バッチ間に1秒待機
      if (i + BATCH_SIZE < identifiers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * キーワードで商品を検索（同期スクリプト用）
   */
  async searchItems(
    params: AmazonSearchParams,
  ): Promise<AdapterResult<CreatorsAPIItem[]>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.callCreatorsAPI("searchItems", {
          keywords: params.keywords,
          searchIndex: params.searchIndex || "HealthPersonalCare",
          itemCount: Math.min(params.itemCount || 10, 10),
          ...(params.resources && { resources: params.resources }),
        }),
      );

      const items = response.searchResult?.items;
      if (!items || items.length === 0) {
        return {
          success: false,
          error: {
            code: "not_found" as AdapterErrorCode,
            message: "検索結果が見つかりませんでした",
            retryable: false,
          },
        };
      }

      return { success: true, data: items };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // =========================================================================
  // Creators API 通信層
  // =========================================================================

  /**
   * デフォルトResourcesを設定
   */
  private getDefaultResources(operation: string): string[] {
    if (operation === "getItems") {
      return [
        "customerReviews.count",
        "customerReviews.starRating",
        "images.primary.large",
        "itemInfo.byLineInfo",
        "itemInfo.title",
        "offersV2.listings.availability",
        "offersV2.listings.price",
      ];
    }
    if (operation === "searchItems") {
      return [
        "customerReviews.count",
        "customerReviews.starRating",
        "images.primary.large",
        "itemInfo.byLineInfo",
        "itemInfo.features",
        "itemInfo.title",
        "offersV2.listings.availability",
        "offersV2.listings.price",
      ];
    }
    return [];
  }

  /**
   * Creators API エンドポイントを呼び出し（OAuth 2.0 Bearer Token認証）
   */
  private async callCreatorsAPI(
    operation: string,
    params: Record<string, unknown>,
  ): Promise<CreatorsAPIResponse> {
    const token = await this.getAccessToken();
    const version = this.amazonConfig.version || "2.3";
    const marketplace = this.amazonConfig.marketplace || "www.amazon.co.jp";
    const endpoint = `${API_BASE_URL}/${operation}`;

    const body: Record<string, unknown> = {
      ...params,
      partnerTag: this.amazonConfig.associateTag,
      marketplace,
    };

    // デフォルトResourcesを設定（未指定の場合）
    if (!body.resources) {
      const defaults = this.getDefaultResources(operation);
      if (defaults.length > 0) {
        body.resources = defaults;
      }
    }

    const response = await this.fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}, Version ${version}`,
        "x-marketplace": marketplace,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Creators API Error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors?.[0]) {
          errorMessage = `${errorJson.errors[0].code}: ${errorJson.errors[0].message}`;
        }
      } catch {
        errorMessage += ` ${errorText.substring(0, 200)}`;
      }

      // 401の場合はトークンをリセットしてリトライ可能にする
      if (response.status === 401) {
        this.accessToken = null;
        this.tokenExpiresAt = 0;
      }

      throw new Error(errorMessage);
    }

    const data: CreatorsAPIResponse = await response.json();

    if (data.errors?.length) {
      throw new Error(`${data.errors[0].code}: ${data.errors[0].message}`);
    }

    return data;
  }

  // =========================================================================
  // エラーハンドリング・ヘルスチェック
  // =========================================================================

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): AdapterResult<never> {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("TooManyRequests") ||
      errorMessage.includes("429")
    ) {
      return {
        success: false,
        error: {
          code: "rate_limit" as AdapterErrorCode,
          message:
            "APIレート制限に達しました。しばらく待ってから再試行してください",
          details: error,
          retryable: true,
        },
      };
    }

    if (
      errorMessage.includes("Token取得失敗") ||
      errorMessage.includes("InvalidClient") ||
      errorMessage.includes("AccessDenied") ||
      errorMessage.includes("UnrecognizedClient") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      return {
        success: false,
        error: {
          code: "auth_error" as AdapterErrorCode,
          message:
            "API認証エラー: 認証情報IDまたはシークレットを確認してください",
          details: error,
          retryable: false,
        },
      };
    }

    if (
      errorMessage.includes("network") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("abort")
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
      const response = await this.callCreatorsAPI("searchItems", {
        keywords: "vitamin",
        searchIndex: "HealthPersonalCare",
        itemCount: 1,
        resources: ["itemInfo.title"],
      });
      return !!response.searchResult?.items?.length;
    } catch {
      return false;
    }
  }
}
