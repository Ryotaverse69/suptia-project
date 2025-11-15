import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-Demand ISR Revalidation API
 * Sanity Webhookから呼び出されて、即座にページを再生成
 *
 * 使い方:
 * POST /api/revalidate?secret=YOUR_SECRET&path=/products/vitamin-c
 */
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");

  // シークレットトークンで認証（不正アクセス防止）
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // パス指定の場合
    if (path) {
      await revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    // タグ指定の場合（全商品ページなど）
    if (tag) {
      await revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { message: "Missing path or tag parameter" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 },
    );
  }
}

/**
 * GETリクエストで使い方を表示
 */
export async function GET() {
  return NextResponse.json({
    message: "On-Demand ISR Revalidation API",
    usage: {
      method: "POST",
      parameters: {
        secret: "Required - REVALIDATE_SECRET env variable",
        path: "Optional - Path to revalidate (e.g., /products/vitamin-c)",
        tag: "Optional - Tag to revalidate (e.g., products)",
      },
      example: "/api/revalidate?secret=YOUR_SECRET&path=/products/vitamin-c",
    },
  });
}
