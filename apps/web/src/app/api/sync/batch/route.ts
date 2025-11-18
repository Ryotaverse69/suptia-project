// バッチ価格同期API - 深夜の一括更新用

import { NextRequest, NextResponse } from "next/server";
import { createAdaptersFromEnv } from "@/lib/adapters";
import type { ProductIdentifier } from "@/lib/adapters/types";

export const dynamic = "force-dynamic"; // 動的レンダリングを強制

/**
 * バッチ同期リクエスト
 */
interface BatchSyncRequest {
  products: Array<{
    id: string; // 内部商品ID
    identifier: ProductIdentifier;
  }>;
  maxConcurrency?: number; // 同時実行数制限（デフォルト: 5）
}

/**
 * バッチ同期レスポンス
 */
interface BatchSyncResponse {
  success: boolean;
  totalProducts: number;
  successCount: number;
  failureCount: number;
  results: Array<{
    productId: string;
    success: boolean;
    prices?: Array<{
      source: string;
      amount: number;
      currency: string;
      url: string;
    }>;
    errors?: Array<{
      source: string;
      message: string;
    }>;
  }>;
  timestamp: string;
  duration: number; // 実行時間（ミリ秒）
}

/**
 * POST /api/sync/batch
 *
 * 複数商品の価格を一括取得（深夜バッチ処理用）
 *
 * NOTE: このエンドポイントは認証が必要（本番環境では Vercel Cron Job または内部トークン必須）
 *
 * @example
 * ```json
 * POST /api/sync/batch
 * {
 *   "products": [
 *     {
 *       "id": "product-001",
 *       "identifier": { "jan": "4573117580016", "asin": "B00TEST123" }
 *     },
 *     {
 *       "id": "product-002",
 *       "identifier": { "jan": "1234567890123" }
 *     }
 *   ],
 *   "maxConcurrency": 5
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 簡易的な認証（本番環境では強化が必要）
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.BATCH_SYNC_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BatchSyncRequest = await request.json();

    // バリデーション
    if (
      !body.products ||
      !Array.isArray(body.products) ||
      body.products.length === 0
    ) {
      return NextResponse.json(
        { error: "products array is required" },
        { status: 400 },
      );
    }

    const maxConcurrency = body.maxConcurrency || 5;

    // 環境変数から利用可能なアダプターを構築
    const adapters = createAdaptersFromEnv();

    if (adapters.length === 0) {
      return NextResponse.json(
        { error: "No API credentials configured" },
        { status: 503 },
      );
    }

    // 並列実行数を制限しながら処理
    const results = await processBatchWithConcurrency(
      body.products,
      adapters,
      maxConcurrency,
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    const response: BatchSyncResponse = {
      success: successCount > 0,
      totalProducts: body.products.length,
      successCount,
      failureCount,
      results,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Batch Sync API] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}

/**
 * 並列実行数を制限しながらバッチ処理
 */
async function processBatchWithConcurrency(
  products: Array<{ id: string; identifier: ProductIdentifier }>,
  adapters: ReturnType<typeof createAdaptersFromEnv>,
  maxConcurrency: number,
) {
  const results: BatchSyncResponse["results"] = [];
  const queue = [...products];

  // ワーカー関数
  const worker = async () => {
    while (queue.length > 0) {
      const product = queue.shift();
      if (!product) break;

      const productResult = await syncSingleProduct(product, adapters);
      results.push(productResult);
    }
  };

  // 並列ワーカーを起動
  const workers = Array.from({ length: maxConcurrency }, () => worker());
  await Promise.all(workers);

  return results;
}

/**
 * 単一商品の価格を全アダプターで取得
 */
async function syncSingleProduct(
  product: { id: string; identifier: ProductIdentifier },
  adapters: ReturnType<typeof createAdaptersFromEnv>,
) {
  const prices: Array<{
    source: string;
    amount: number;
    currency: string;
    url: string;
  }> = [];

  const errors: Array<{
    source: string;
    message: string;
  }> = [];

  // 各アダプターで並列に取得
  await Promise.all(
    adapters.map(async (adapter) => {
      try {
        const result = await adapter.fetchPrice(product.identifier);

        if (result.success) {
          prices.push({
            source: adapter.name,
            amount: result.data.amount,
            currency: result.data.currency,
            url: result.data.url,
          });
        } else {
          errors.push({
            source: adapter.name,
            message: result.error.message,
          });
        }
      } catch (error) {
        errors.push({
          source: adapter.name,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),
  );

  return {
    productId: product.id,
    success: prices.length > 0,
    prices: prices.length > 0 ? prices : undefined,
    errors: errors.length > 0 ? errors : undefined,
  };
}
