// EC API Adapter基底インターフェース

import type {
  PriceData,
  StockStatus,
  ReviewData,
  ProductIdentifier,
  AdapterResult,
  AdapterConfig,
} from "./types";

/**
 * 商品価格アダプター共通インターフェース
 *
 * 各ECサイトのAPI差異を吸収し、統一されたデータ形式で返す
 */
export interface ProductPriceAdapter {
  /**
   * アダプター名（例: "amazon", "rakuten"）
   */
  readonly name: string;

  /**
   * 価格情報を取得
   * @param identifier 商品識別子
   * @returns 価格データまたはエラー
   */
  fetchPrice(identifier: ProductIdentifier): Promise<AdapterResult<PriceData>>;

  /**
   * 在庫状況を取得
   * @param identifier 商品識別子
   * @returns 在庫状態またはエラー
   */
  fetchStock(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<StockStatus>>;

  /**
   * レビュー情報を取得
   * @param identifier 商品識別子
   * @returns レビューデータまたはエラー
   */
  fetchReviews(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<ReviewData>>;

  /**
   * 複数商品の価格を一括取得（オプション）
   * @param identifiers 商品識別子の配列
   * @returns 価格データの配列
   */
  fetchBatchPrices?(
    identifiers: ProductIdentifier[],
  ): Promise<AdapterResult<PriceData>[]>;

  /**
   * ヘルスチェック（API疎通確認）
   * @returns 接続成功ならtrue
   */
  healthCheck(): Promise<boolean>;
}

/**
 * アダプター基底クラス（共通ロジックを提供）
 */
export abstract class BaseAdapter implements ProductPriceAdapter {
  protected config: AdapterConfig;
  abstract readonly name: string;

  constructor(config: AdapterConfig) {
    this.config = {
      timeout: 10000, // デフォルト10秒
      maxRetries: 3, // デフォルト3回
      ...config,
    };
  }

  abstract fetchPrice(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<PriceData>>;

  abstract fetchStock(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<StockStatus>>;

  abstract fetchReviews(
    identifier: ProductIdentifier,
  ): Promise<AdapterResult<ReviewData>>;

  async healthCheck(): Promise<boolean> {
    try {
      // 各アダプターで実装をオーバーライド可能
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Exponential backoffでリトライ
   * @param fn 実行する非同期関数
   * @param retries リトライ回数
   * @returns 実行結果
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = this.config.maxRetries || 3,
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // 最後のリトライ以外は待機
        if (i < retries - 1) {
          const backoffMs = Math.pow(2, i) * 1000; // 1s, 2s, 4s, ...
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    throw lastError!;
  }

  /**
   * タイムアウト付きでfetchを実行
   * @param url リクエストURL
   * @param options fetchオプション
   * @returns レスポンス
   */
  protected async fetchWithTimeout(
    url: string,
    options?: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
