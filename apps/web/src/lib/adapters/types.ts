// EC API Adapter共通型定義

/**
 * 価格データ
 */
export interface PriceData {
  amount: number;
  currency: string;
  source: string;
  fetchedAt: Date;
  confidence: number; // 0-1の信頼度スコア
  url: string;
  affiliateTag?: string;
}

/**
 * 在庫状態
 */
export enum StockStatus {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
  LOW_STOCK = "low_stock",
  PREORDER = "preorder",
  UNKNOWN = "unknown",
}

/**
 * レビューデータ
 */
export interface ReviewData {
  averageRating: number; // 0-5
  totalReviews: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  source: string;
  fetchedAt: Date;
}

/**
 * 商品識別子（複数のID形式に対応）
 */
export interface ProductIdentifier {
  jan?: string; // JANコード（日本独自）
  ean?: string; // 国際商品コード
  asin?: string; // Amazon Standard Identification Number
  itemCode?: string; // 楽天商品コード
  title?: string; // 商品名（フォールバック）
  brand?: string; // ブランド名
}

/**
 * API呼び出し結果（成功・失敗を包含）
 */
export type AdapterResult<T> =
  | { success: true; data: T }
  | { success: false; error: AdapterError };

/**
 * アダプターエラー
 */
export interface AdapterError {
  code: AdapterErrorCode;
  message: string;
  details?: unknown;
  retryable: boolean;
}

/**
 * エラーコード
 */
export enum AdapterErrorCode {
  RATE_LIMIT = "rate_limit",
  NOT_FOUND = "not_found",
  NETWORK_ERROR = "network_error",
  AUTH_ERROR = "auth_error",
  INVALID_RESPONSE = "invalid_response",
  UNKNOWN = "unknown",
}

/**
 * API設定
 */
export interface AdapterConfig {
  apiKey?: string;
  apiSecret?: string;
  affiliateTag?: string;
  baseUrl?: string;
  timeout?: number; // ミリ秒
  maxRetries?: number;
}
