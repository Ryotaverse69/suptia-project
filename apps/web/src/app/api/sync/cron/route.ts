/**
 * Vercel Cron Job エンドポイント
 *
 * 毎日午前3時に実行され、全商品の価格を更新します。
 * Schedule: 0 3 * * * (毎日午前3時 UTC)
 *
 * 最適化機能：
 * - スマート同期: 最近更新した商品はスキップ（APIリクエスト削減）
 * - 優先度ベース: JANコードがある商品を優先
 * - バッチサイズ制限: 月間リクエスト制限（10,000回）を考慮
 *
 * @see https://vercel.com/docs/cron-jobs
 */

import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";
import {
  saveBulkPriceData,
  type PriceDataForSanity,
} from "@/lib/price-manager";

export const dynamic = "force-dynamic"; // 動的レンダリングを強制
export const maxDuration = 300; // 5分のタイムアウト（Pro planの場合）

/**
 * 同期設定
 * 月間リクエスト制限（10,000回）を考慮した設定
 *
 * 計算: 10,000 / 30日 ≈ 333商品/日
 * 安全マージン込み: 300商品/日
 */
const SYNC_CONFIG = {
  // 1日あたりの最大同期商品数（楽天API制限対策）
  MAX_PRODUCTS_PER_DAY: 300,
  // 価格更新をスキップする期間（時間）
  SKIP_IF_UPDATED_WITHIN_HOURS: 24,
  // 優先同期: JANコードがある商品を優先
  PRIORITIZE_JAN_CODE: true,
} as const;

/**
 * GET /api/sync/cron
 *
 * Vercel Cronから呼び出されます。
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Vercel Cronからの呼び出しか確認（CRON_SECRET必須）
    const cronSecret = process.env.CRON_SECRET;

    // 本番環境ではCRON_SECRET必須
    if (!cronSecret && process.env.NODE_ENV === "production") {
      console.error("[Cron] CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // シークレットが設定されている場合は認証チェック
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.error("[Cron] Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("[Cron] Starting price sync batch job...");

    // Sanityから全商品を取得（識別子と最終更新日時も含む）
    const allProducts = await sanityServer.fetch(
      `*[_type == "product" && availability == "in-stock"] {
        _id,
        name,
        "brand": brand->name,
        identifiers,
        "lastPriceUpdate": prices[0].fetchedAt
      }`,
    );

    if (allProducts.length === 0) {
      console.log("[Cron] No products found");
      return NextResponse.json({
        success: true,
        message: "No products to sync",
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      });
    }

    console.log(`[Cron] Found ${allProducts.length} total products`);

    // スマート同期: 最近更新した商品をスキップ
    const now = Date.now();
    const skipThreshold =
      SYNC_CONFIG.SKIP_IF_UPDATED_WITHIN_HOURS * 60 * 60 * 1000;

    const productsNeedingUpdate = allProducts.filter((product: any) => {
      if (!product.lastPriceUpdate) return true;
      const lastUpdate = new Date(product.lastPriceUpdate).getTime();
      return now - lastUpdate > skipThreshold;
    });

    console.log(
      `[Cron] ${productsNeedingUpdate.length} products need update (${allProducts.length - productsNeedingUpdate.length} skipped - recently updated)`,
    );

    // 優先度ソート: JANコードがある商品を優先
    if (SYNC_CONFIG.PRIORITIZE_JAN_CODE) {
      productsNeedingUpdate.sort((a: any, b: any) => {
        const aHasJan = a.identifiers?.jan ? 1 : 0;
        const bHasJan = b.identifiers?.jan ? 1 : 0;
        return bHasJan - aHasJan; // JANコードありを先に
      });
    }

    // バッチサイズ制限（月間リクエスト制限対策）
    const products = productsNeedingUpdate.slice(
      0,
      SYNC_CONFIG.MAX_PRODUCTS_PER_DAY,
    );
    const skippedDueToLimit = productsNeedingUpdate.length - products.length;

    if (skippedDueToLimit > 0) {
      console.log(
        `[Cron] Limiting to ${SYNC_CONFIG.MAX_PRODUCTS_PER_DAY} products (${skippedDueToLimit} deferred to next run)`,
      );
    }

    console.log(`[Cron] Syncing ${products.length} products`);

    // バッチ同期APIを呼び出し（識別子を優先的に使用）
    const batchRequest = {
      products: products.map((product: any) => {
        const identifier: any = {};

        // 識別子の優先順位: JAN > ASIN > title
        if (product.identifiers?.jan) {
          identifier.jan = product.identifiers.jan;
        }
        if (product.identifiers?.asin) {
          identifier.asin = product.identifiers.asin;
        }
        if (product.identifiers?.upc) {
          identifier.upc = product.identifiers.upc;
        }
        if (product.identifiers?.ean) {
          identifier.ean = product.identifiers.ean;
        }

        // 識別子がない場合はタイトルで検索
        if (Object.keys(identifier).length === 0) {
          identifier.title = product.name;
        }

        return {
          id: product._id,
          identifier,
        };
      }),
      maxConcurrency: 10, // Cronジョブなので並列数を多めに
    };

    // 内部APIを呼び出し
    const batchUrl = new URL("/api/sync/batch", request.url).toString();

    const response = await fetch(batchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.BATCH_SYNC_TOKEN
          ? `Bearer ${process.env.BATCH_SYNC_TOKEN}`
          : "",
      },
      body: JSON.stringify(batchRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Cron] Batch sync failed:", result);
      return NextResponse.json(
        {
          success: false,
          error: "Batch sync failed",
          details: result,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
        },
        { status: 500 },
      );
    }

    console.log(
      `[Cron] Batch sync completed: ${result.successCount}/${result.totalProducts} successful`,
    );

    // 価格データをSanityに保存
    const priceUpdates: Array<{
      productId: string;
      priceData: PriceDataForSanity[];
    }> = [];

    for (const productResult of result.results) {
      if (productResult.success && productResult.prices) {
        const priceData: PriceDataForSanity[] = productResult.prices.map(
          (price: {
            source: string;
            amount: number;
            currency: string;
            url: string;
          }) => ({
            source: price.source as "rakuten" | "amazon" | "iherb",
            amount: price.amount,
            currency: price.currency,
            url: price.url,
            fetchedAt: new Date().toISOString(),
            confidence: 0.95, // デフォルトの信頼度
          }),
        );

        priceUpdates.push({
          productId: productResult.productId,
          priceData,
        });
      }
    }

    let saveResult: {
      successCount: number;
      failureCount: number;
      errors: Array<{ productId: string; error: string }>;
    } = { successCount: 0, failureCount: 0, errors: [] };

    if (priceUpdates.length > 0) {
      console.log(
        `[Cron] Saving ${priceUpdates.length} price updates to Sanity...`,
      );
      saveResult = await saveBulkPriceData(priceUpdates, {
        recordHistory: true,
        maxHistoryEntries: 100,
        priceChangeThreshold: 0.05, // 5%以上の変動で履歴に記録
      });
      console.log(
        `[Cron] Price save completed: ${saveResult.successCount} success, ${saveResult.failureCount} failure`,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Price sync completed",
      stats: {
        totalProducts: allProducts.length,
        skippedRecentlyUpdated:
          allProducts.length - productsNeedingUpdate.length,
        skippedDueToLimit,
        syncedProducts: products.length,
        successCount: result.successCount,
        failureCount: result.failureCount,
        savedToSanity: saveResult.successCount,
        saveErrors: saveResult.failureCount,
      },
      config: {
        maxProductsPerDay: SYNC_CONFIG.MAX_PRODUCTS_PER_DAY,
        skipIfUpdatedWithinHours: SYNC_CONFIG.SKIP_IF_UPDATED_WITHIN_HOURS,
      },
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    });
  } catch (error) {
    console.error("[Cron] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}
