/**
 * Vercel Cron Job エンドポイント
 *
 * 毎日午前3時に実行され、全商品の価格を更新します。
 * Schedule: 0 3 * * * (毎日午前3時 UTC)
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
 * GET /api/sync/cron
 *
 * Vercel Cronから呼び出されます。
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Vercel Cronからの呼び出しか確認
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Cron] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting price sync batch job...");

    // Sanityから全商品を取得（識別子も含む）
    const products = await sanityServer.fetch(
      `*[_type == "product" && availability == "in-stock"] {
        _id,
        name,
        "brand": brand->name,
        identifiers
      }`,
    );

    if (products.length === 0) {
      console.log("[Cron] No products found");
      return NextResponse.json({
        success: true,
        message: "No products to sync",
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      });
    }

    console.log(`[Cron] Found ${products.length} products to sync`);

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
        totalProducts: result.totalProducts,
        successCount: result.successCount,
        failureCount: result.failureCount,
        savedToSanity: saveResult.successCount,
        saveErrors: saveResult.failureCount,
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
