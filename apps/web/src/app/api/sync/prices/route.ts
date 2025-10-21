// 価格同期API - Next.js 14 App Router

import { NextRequest, NextResponse } from "next/server";
import { createAdaptersFromEnv } from "@/lib/adapters";
import type { ProductIdentifier } from "@/lib/adapters/types";

/**
 * 価格同期リクエスト
 */
interface SyncPriceRequest {
  identifier: ProductIdentifier;
  sources?: string[]; // 特定のソースのみ同期（オプション）
}

/**
 * 価格同期レスポンス
 */
interface SyncPriceResponse {
  success: boolean;
  results: Array<{
    source: string;
    success: boolean;
    price?: number;
    currency?: string;
    url?: string;
    error?: string;
  }>;
  timestamp: string;
}

/**
 * POST /api/sync/prices
 *
 * 指定された商品の価格を各ECサイトから取得して返す
 *
 * @example
 * ```json
 * POST /api/sync/prices
 * {
 *   "identifier": {
 *     "jan": "4573117580016",
 *     "asin": "B00TEST123"
 *   },
 *   "sources": ["amazon", "rakuten"]
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const body: SyncPriceRequest = await request.json();

    // バリデーション
    if (!body.identifier) {
      return NextResponse.json(
        { error: "identifier is required" },
        { status: 400 },
      );
    }

    // 環境変数から利用可能なアダプターを構築
    const adapters = createAdaptersFromEnv();

    if (adapters.length === 0) {
      return NextResponse.json(
        {
          error: "No API credentials configured",
          hint: "Set AMAZON_ACCESS_KEY_ID and/or RAKUTEN_APPLICATION_ID in .env.local",
        },
        { status: 503 },
      );
    }

    // 指定されたソースのみフィルタリング（オプション）
    const targetAdapters = body.sources
      ? adapters.filter((adapter) => body.sources!.includes(adapter.name))
      : adapters;

    // 各アダプターで並列に価格取得
    const results = await Promise.all(
      targetAdapters.map(async (adapter) => {
        const result = await adapter.fetchPrice(body.identifier);

        if (result.success) {
          return {
            source: adapter.name,
            success: true,
            price: result.data.amount,
            currency: result.data.currency,
            url: result.data.url,
          };
        } else {
          return {
            source: adapter.name,
            success: false,
            error: result.error.message,
          };
        }
      }),
    );

    const response: SyncPriceResponse = {
      success: results.some((r) => r.success),
      results,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Price Sync API] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/sync/prices?jan=XXX&asin=YYY
 *
 * クエリパラメータで商品を指定して価格を取得
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const identifier: ProductIdentifier = {
    jan: searchParams.get("jan") || undefined,
    asin: searchParams.get("asin") || undefined,
    ean: searchParams.get("ean") || undefined,
    itemCode: searchParams.get("itemCode") || undefined,
  };

  // 少なくとも1つの識別子が必要
  if (
    !identifier.jan &&
    !identifier.asin &&
    !identifier.ean &&
    !identifier.itemCode
  ) {
    return NextResponse.json(
      {
        error: "At least one identifier (jan, asin, ean, itemCode) is required",
      },
      { status: 400 },
    );
  }

  // POSTハンドラーを再利用
  return POST(
    new NextRequest(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify({ identifier }),
    }),
  );
}
