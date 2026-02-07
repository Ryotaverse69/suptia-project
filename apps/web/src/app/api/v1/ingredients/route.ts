import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";

// GROQクエリ用のサニタイズ関数
function sanitizeForGroq(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\*/g, "\\*");
}

// CORS headers for GPT Actions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/v1/ingredients
 *
 * 成分一覧を取得します。
 *
 * Query Parameters:
 * - category: カテゴリでフィルター（vitamin, mineral, amino-acid, fatty-acid, etc.）
 * - q: 検索キーワード（成分名）
 * - limit: 取得件数（デフォルト: 20, 最大: 100）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // URLエンコードされた日本語パラメータを適切にサニタイズ
    const category = sanitizeForGroq(searchParams.get("category") || "");
    const q = sanitizeForGroq(searchParams.get("q") || "");
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100,
    );

    // Build GROQ query filters
    const filters: string[] = ['_type == "ingredient"'];

    if (category) {
      filters.push(`category == "${category}"`);
    }

    if (q) {
      filters.push(`(name match "*${q}*" || nameEn match "*${q}*")`);
    }

    const query = `*[${filters.join(" && ")}] | order(name asc) [0...${limit}] {
      _id,
      name,
      nameEn,
      "slug": slug.current,
      category,
      evidenceLevel,
      safetyScore,
      description,
      dailyRecommendedAmount,
      dailyUpperLimit,
      "productCount": count(*[_type == "product" && references(^._id) && availability == "in-stock"])
    }`;

    const ingredients = await sanityServer.fetch(query);

    // Get available categories for filtering
    const categoriesQuery = `array::unique(*[_type == "ingredient"].category)`;
    const categories = await sanityServer.fetch(categoriesQuery);

    const response = {
      success: true,
      count: ingredients.length,
      query: {
        category: category || null,
        keyword: q || null,
        limit,
      },
      availableCategories: categories.filter(Boolean).sort(),
      ingredients: ingredients.map((i: any) => ({
        id: i._id,
        name: i.name,
        nameEn: i.nameEn,
        slug: i.slug,
        category: i.category,
        url: `https://suptia.com/ingredients/${i.slug}`,
        evidenceLevel: i.evidenceLevel,
        safetyScore: i.safetyScore,
        description: i.description,
        dailyRecommended: i.dailyRecommendedAmount,
        dailyUpperLimit: i.dailyUpperLimit,
        productCount: i.productCount,
      })),
      _links: {
        self: `https://suptia.com/api/v1/ingredients?${searchParams.toString()}`,
        docs: "https://suptia.com/api/docs",
      },
    };

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Ingredients list API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch ingredients",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
