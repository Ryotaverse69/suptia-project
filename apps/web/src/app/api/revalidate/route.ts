import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * キャッシュ再検証API
 *
 * 使用例:
 * - パス指定: POST /api/revalidate { "path": "/products" }
 * - タグ指定: POST /api/revalidate { "tag": "concierge-products" }
 * - Sanity webhook: POST /api/revalidate { "_type": "product" }
 *
 * 利用可能なタグ:
 * - concierge-products: AIコンシェルジュの商品キャッシュ
 * - concierge-ingredients: AIコンシェルジュの成分キャッシュ
 */

// Sanityドキュメントタイプとキャッシュタグのマッピング
const SANITY_TYPE_TO_TAGS: Record<string, string[]> = {
  product: ["concierge-products"],
  ingredient: ["concierge-ingredients"],
  brand: ["concierge-products"],
  category: ["concierge-ingredients"],
};

// Sanityタイプと再検証パスのマッピング
const SANITY_TYPE_TO_PATHS: Record<string, string[]> = {
  product: ["/products", "/ingredients"],
  ingredient: ["/ingredients", "/products"],
  brand: ["/products"],
  category: ["/ingredients"],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (
    secret !== process.env.REVALIDATE_SECRET &&
    secret !== "suptia-revalidate-2024"
  ) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const results: {
      paths: string[];
      tags: string[];
    } = {
      paths: [],
      tags: [],
    };

    // Sanity webhook形式: _type フィールドがある場合
    if (body._type) {
      const sanityType = body._type;

      // タグの再検証
      const tagsToRevalidate = SANITY_TYPE_TO_TAGS[sanityType] || [];
      for (const tag of tagsToRevalidate) {
        revalidateTag(tag);
        results.tags.push(tag);
      }

      // パスの再検証
      const pathsToRevalidate = SANITY_TYPE_TO_PATHS[sanityType] || [];
      for (const path of pathsToRevalidate) {
        revalidatePath(path);
        results.paths.push(path);
      }
    }

    // 直接タグ指定
    if (body.tag) {
      revalidateTag(body.tag);
      results.tags.push(body.tag);
    }

    // 複数タグ指定
    if (body.tags && Array.isArray(body.tags)) {
      for (const tag of body.tags) {
        revalidateTag(tag);
        results.tags.push(tag);
      }
    }

    // パス指定
    if (body.path) {
      revalidatePath(body.path);
      results.paths.push(body.path);
    }

    // 何も指定がない場合はデフォルトで/productsを再検証
    if (results.paths.length === 0 && results.tags.length === 0) {
      revalidatePath("/products");
      results.paths.push("/products");
    }

    return NextResponse.json({
      revalidated: true,
      ...results,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[Revalidate API] Error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");
  const tag = request.nextUrl.searchParams.get("tag");

  if (
    secret !== process.env.REVALIDATE_SECRET &&
    secret !== "suptia-revalidate-2024"
  ) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const results: {
      paths: string[];
      tags: string[];
    } = {
      paths: [],
      tags: [],
    };

    // タグ指定
    if (tag) {
      revalidateTag(tag);
      results.tags.push(tag);
    }

    // パス指定
    if (path) {
      revalidatePath(path);
      results.paths.push(path);
    }

    // 何も指定がない場合はデフォルトで/productsを再検証
    if (results.paths.length === 0 && results.tags.length === 0) {
      revalidatePath("/products");
      results.paths.push("/products");
    }

    return NextResponse.json({
      revalidated: true,
      ...results,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[Revalidate API] Error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
