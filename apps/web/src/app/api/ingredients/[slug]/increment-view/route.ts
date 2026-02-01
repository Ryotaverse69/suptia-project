/**
 * 成分ガイド記事の表示回数をインクリメントするAPIエンドポイント
 */

import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    // 1. 現在のingredientを取得
    const ingredient = await sanityServer.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]{
        _id,
        viewCount,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`,
      { slug },
    );

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 },
      );
    }

    // 2. viewCountをインクリメント
    const newViewCount = (ingredient.viewCount || 0) + 1;

    // 3. popularityScoreを計算
    // スコア = (商品数 × 10) + (表示回数 × 1)
    const productCount = ingredient.productCount || 0;
    const newPopularityScore = productCount * 10 + newViewCount * 1;

    // 4. Sanityを更新
    await sanityServer
      .patch(ingredient._id)
      .set({
        viewCount: newViewCount,
        popularityScore: newPopularityScore,
      })
      .commit();

    return NextResponse.json({
      success: true,
      viewCount: newViewCount,
      popularityScore: newPopularityScore,
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
