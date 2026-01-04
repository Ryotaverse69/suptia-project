/**
 * Intent Classification API
 *
 * ヒーローセクションの入力からユーザーの意図を分類し、
 * 適切な遷移先（検索 or AIコンシェルジュ）を返す
 *
 * 設計原則（docs/HERO_AI_DESIGN.md）:
 * - フェーズ①: 辞書マッチ・パターンマッチ（LLM不使用）
 * - フェーズ②: 曖昧な場合のみ軽量AI（Haiku）を使用
 * - キャッシュで同一入力を再計算しない
 */

import { NextRequest, NextResponse } from "next/server";
import {
  classifyIntent,
  generateCacheKey,
  getCached,
  setCache,
  normalizeInput,
} from "@/lib/intent";
import type { IntentAPIResponse } from "@/lib/intent";

export const dynamic = "force-dynamic";

/**
 * POST /api/intent
 *
 * @body { query: string } - ユーザー入力テキスト
 * @returns IntentAPIResponse
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    // バリデーション
    if (!query || typeof query !== "string") {
      return NextResponse.json<IntentAPIResponse>(
        {
          success: false,
          error: "query is required and must be a string",
        },
        { status: 400 },
      );
    }

    // 入力の正規化
    const normalizedInput = normalizeInput(query);

    // 空入力チェック
    if (!normalizedInput) {
      return NextResponse.json<IntentAPIResponse>(
        {
          success: false,
          error: "query is empty after normalization",
        },
        { status: 400 },
      );
    }

    // キャッシュチェック（正規化済み入力をキーに）
    const cacheKey = `intent:${normalizedInput}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json<IntentAPIResponse>({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // 分類実行（フェーズ①: LLM不使用）
    const result = classifyIntent(query);

    // キャッシュに保存
    const fullCacheKey = generateCacheKey(
      result.normalizedInput,
      result.intent,
    );
    setCache(cacheKey, result);

    return NextResponse.json<IntentAPIResponse>({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error("[Intent API] Error:", error);
    return NextResponse.json<IntentAPIResponse>(
      {
        success: false,
        error: "Intent classification failed",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/intent?q=xxx
 *
 * クエリパラメータ版（簡易利用用）
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json<IntentAPIResponse>(
      {
        success: false,
        error: "q parameter is required",
      },
      { status: 400 },
    );
  }

  // POSTと同じロジックを使用
  const normalizedInput = normalizeInput(query);

  if (!normalizedInput) {
    return NextResponse.json<IntentAPIResponse>(
      {
        success: false,
        error: "query is empty after normalization",
      },
      { status: 400 },
    );
  }

  // キャッシュチェック
  const cacheKey = `intent:${normalizedInput}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json<IntentAPIResponse>({
      success: true,
      data: cached,
      cached: true,
    });
  }

  // 分類実行
  const result = classifyIntent(query);

  // キャッシュに保存
  setCache(cacheKey, result);

  return NextResponse.json<IntentAPIResponse>({
    success: true,
    data: result,
    cached: false,
  });
}
