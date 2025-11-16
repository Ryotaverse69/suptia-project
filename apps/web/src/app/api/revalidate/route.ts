/**
 * On-Demand ISR（Incremental Static Regeneration）APIルート
 *
 * 目的:
 *   - GitHub Actionsから呼び出されて、価格・ランク更新時にフロントエンドを自動更新
 *   - 手動でのキャッシュクリア・再生成も可能
 *
 * 使用方法:
 *   curl -X POST "https://suptia.com/api/revalidate?secret=YOUR_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"path": "/products"}'
 *
 * セキュリティ:
 *   - REVALIDATE_SECRET環境変数による認証
 *   - 不正なリクエストは403 Forbiddenを返す
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  // 1. シークレット検証
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      {
        error: "REVALIDATE_SECRET is not configured",
        message: "サーバー設定エラー：環境変数が設定されていません",
      },
      { status: 500 },
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      {
        error: "Invalid secret",
        message: "認証に失敗しました",
      },
      { status: 403 },
    );
  }

  // 2. リクエストボディの解析
  let body: { path?: string; tag?: string; all?: boolean };
  try {
    body = await request.json();
  } catch (error) {
    body = {};
  }

  const { path, tag, all } = body;

  try {
    // 3. 再検証実行
    if (all) {
      // すべてのページを再検証
      revalidatePath("/", "layout");
      console.log("[ISR] Revalidated all pages");

      return NextResponse.json({
        revalidated: true,
        type: "all",
        message: "すべてのページを再検証しました",
        now: Date.now(),
      });
    } else if (path) {
      // 特定のパスを再検証
      revalidatePath(path);
      console.log(`[ISR] Revalidated path: ${path}`);

      return NextResponse.json({
        revalidated: true,
        type: "path",
        path,
        message: `パス「${path}」を再検証しました`,
        now: Date.now(),
      });
    } else if (tag) {
      // 特定のタグを再検証
      revalidateTag(tag);
      console.log(`[ISR] Revalidated tag: ${tag}`);

      return NextResponse.json({
        revalidated: true,
        type: "tag",
        tag,
        message: `タグ「${tag}」を再検証しました`,
        now: Date.now(),
      });
    } else {
      // デフォルト: 商品一覧と商品詳細を再検証
      revalidatePath("/products");
      revalidatePath("/products/[slug]", "page");
      console.log(
        "[ISR] Revalidated default paths: /products, /products/[slug]",
      );

      return NextResponse.json({
        revalidated: true,
        type: "default",
        paths: ["/products", "/products/[slug]"],
        message: "商品ページを再検証しました",
        now: Date.now(),
      });
    }
  } catch (error) {
    console.error("[ISR] Revalidation error:", error);

    return NextResponse.json(
      {
        error: "Revalidation failed",
        message: "再検証に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GETリクエストでヘルスチェック
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (secret !== expectedSecret) {
    return NextResponse.json(
      {
        error: "Invalid secret",
        message: "認証に失敗しました",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "On-Demand ISR API is ready",
    endpoint: "/api/revalidate",
    methods: ["POST"],
    parameters: {
      secret: "required (query parameter)",
      path: "optional (revalidate specific path)",
      tag: "optional (revalidate specific tag)",
      all: "optional (revalidate all pages)",
    },
    examples: [
      {
        description: "商品ページのみ再検証",
        curl: 'curl -X POST "https://suptia.com/api/revalidate?secret=YOUR_SECRET" -H "Content-Type: application/json" -d \'{"path": "/products"}\'',
      },
      {
        description: "すべてのページを再検証",
        curl: 'curl -X POST "https://suptia.com/api/revalidate?secret=YOUR_SECRET" -H "Content-Type: application/json" -d \'{"all": true}\'',
      },
      {
        description: "特定のタグを再検証",
        curl: 'curl -X POST "https://suptia.com/api/revalidate?secret=YOUR_SECRET" -H "Content-Type: application/json" -d \'{"tag": "products"}\'',
      },
    ],
  });
}
