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

    // Sanityから全商品を取得
    const products = await sanityServer.fetch(
      `*[_type == "product" && availability == "in-stock"] {
        _id,
        name,
        "brand": brand->name
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

    // バッチ同期APIを呼び出し
    const batchRequest = {
      products: products.map((product: any) => ({
        id: product._id,
        identifier: {
          title: product.name,
        },
      })),
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

    // TODO: 価格データをSanityに保存する処理を追加
    // TODO: 価格履歴を記録する処理を追加

    return NextResponse.json({
      success: true,
      message: "Price sync completed",
      stats: {
        totalProducts: result.totalProducts,
        successCount: result.successCount,
        failureCount: result.failureCount,
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
