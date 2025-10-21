// API Health Check - アダプター疎通確認

import { NextResponse } from "next/server";
import { createAdaptersFromEnv } from "@/lib/adapters";

/**
 * GET /api/health
 *
 * 楽天/Amazon APIの疎通確認
 *
 * レスポンス例:
 * {
 *   "status": "healthy",
 *   "adapters": {
 *     "rakuten": { "available": true, "healthy": true },
 *     "amazon": { "available": false, "reason": "ENABLE_AMAZON_API is false" }
 *   },
 *   "timestamp": "2025-10-20T12:00:00Z"
 * }
 */
export async function GET() {
  try {
    const adapters = createAdaptersFromEnv();

    // 各アダプターのヘルスチェック
    const results = await Promise.all(
      adapters.map(async (adapter) => {
        try {
          const isHealthy = await adapter.healthCheck();
          return {
            name: adapter.name,
            available: true,
            healthy: isHealthy,
          };
        } catch (error) {
          return {
            name: adapter.name,
            available: true,
            healthy: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    // 有効化されていないアダプターも報告
    const availableAdapterNames = results.map((r) => r.name);
    const allAdapters = ["rakuten", "amazon"];

    const unavailableAdapters = allAdapters
      .filter((name) => !availableAdapterNames.includes(name))
      .map((name) => {
        let reason = "API credentials not configured";

        if (name === "amazon") {
          if (process.env.ENABLE_AMAZON_API !== "true") {
            reason = "ENABLE_AMAZON_API is false (MVP期間中の推奨設定)";
          } else if (!process.env.AMAZON_ACCESS_KEY_ID) {
            reason = "AMAZON_ACCESS_KEY_ID not set";
          }
        } else if (name === "rakuten") {
          if (!process.env.RAKUTEN_APPLICATION_ID) {
            reason = "RAKUTEN_APPLICATION_ID not set";
          }
        }

        return {
          name,
          available: false,
          reason,
        };
      });

    const allResults = [...results, ...unavailableAdapters];

    // 少なくとも1つのアダプターが健全ならOK
    const overallStatus =
      results.length > 0 && results.some((r) => r.healthy)
        ? "healthy"
        : "unhealthy";

    return NextResponse.json({
      status: overallStatus,
      adapters: allResults.reduce(
        (acc, result) => {
          acc[result.name] = result;
          return acc;
        },
        {} as Record<string, (typeof allResults)[number]>,
      ),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Health Check API] Error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
