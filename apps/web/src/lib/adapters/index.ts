// EC API Adapters - エクスポート

export * from "./types";
export * from "./base";
export * from "./amazon";
export * from "./rakuten";
export * from "./yahoo";

// アダプターファクトリー
import { AmazonAdapter, type AmazonAdapterConfig } from "./amazon";
import { RakutenAdapter, type RakutenAdapterConfig } from "./rakuten";
import { YahooAdapter, type YahooAdapterConfig } from "./yahoo";
import type { ProductPriceAdapter } from "./base";

/**
 * アダプター種別
 */
export type AdapterType = "amazon" | "rakuten" | "yahoo";

/**
 * アダプター設定のユニオン型
 */
export type AnyAdapterConfig =
  | AmazonAdapterConfig
  | RakutenAdapterConfig
  | YahooAdapterConfig;

/**
 * アダプターファクトリー
 *
 * @param type アダプター種別
 * @param config 設定
 * @returns アダプターインスタンス
 */
export function createAdapter(
  type: "amazon",
  config: AmazonAdapterConfig,
): AmazonAdapter;
export function createAdapter(
  type: "rakuten",
  config: RakutenAdapterConfig,
): RakutenAdapter;
export function createAdapter(
  type: "yahoo",
  config: YahooAdapterConfig,
): YahooAdapter;
export function createAdapter(
  type: AdapterType,
  config: AnyAdapterConfig,
): ProductPriceAdapter {
  switch (type) {
    case "amazon":
      return new AmazonAdapter(config as AmazonAdapterConfig);
    case "rakuten":
      return new RakutenAdapter(config as RakutenAdapterConfig);
    case "yahoo":
      return new YahooAdapter(config as YahooAdapterConfig);
    default:
      throw new Error(`Unknown adapter type: ${type}`);
  }
}

/**
 * 環境変数からアダプターを自動構築
 *
 * 優先順位:
 * 1. 楽天API（売上要件なし、MVP期間中のメイン）
 * 2. Yahoo!ショッピングAPI（フェーズ2.5 - 価格比較拡張）
 * 3. Amazon PA-API（売上発生後に有効化）
 */
export function createAdaptersFromEnv(): ProductPriceAdapter[] {
  const adapters: ProductPriceAdapter[] = [];

  // 楽天API（優先）
  // - 売上要件なし
  // - 月間10,000リクエスト無料
  // - MVP期間中のメインデータソース
  if (process.env.RAKUTEN_APPLICATION_ID) {
    adapters.push(
      createAdapter("rakuten", {
        applicationId: process.env.RAKUTEN_APPLICATION_ID,
        applicationSecret: process.env.RAKUTEN_APPLICATION_SECRET,
        affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
      }),
    );
  }

  // Yahoo!ショッピングAPI（フェーズ2.5）
  // - 売上要件なし
  // - 1リクエスト/秒制限
  // - バリューコマースアフィリエイト（報酬率1-50%）
  if (process.env.YAHOO_SHOPPING_CLIENT_ID) {
    adapters.push(
      createAdapter("yahoo", {
        clientId: process.env.YAHOO_SHOPPING_CLIENT_ID,
        valueCommerceSid: process.env.VALUE_COMMERCE_SID,
        valueCommercePid: process.env.VALUE_COMMERCE_PID,
      }),
    );
  }

  // Amazon PA-API（オプション - 売上発生後に有効化）
  // ⚠️ 注意: 過去30日以内に3件以上の売上が必要
  // ENABLE_AMAZON_API=true の場合のみ有効化
  if (
    process.env.ENABLE_AMAZON_API === "true" &&
    process.env.AMAZON_ACCESS_KEY_ID &&
    process.env.AMAZON_SECRET_ACCESS_KEY &&
    process.env.AMAZON_ASSOCIATE_TAG
  ) {
    adapters.push(
      createAdapter("amazon", {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        associateTag: process.env.AMAZON_ASSOCIATE_TAG,
        region: process.env.AMAZON_REGION || "us-west-2",
        marketplace: process.env.AMAZON_MARKETPLACE || "www.amazon.co.jp",
      }),
    );
  }

  return adapters;
}
