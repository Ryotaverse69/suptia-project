import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";
import { isValidSlug } from "@/lib/sanitize";
import { withGptFields } from "@/lib/api-helpers";

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
 * GET /api/v1/ingredients/[slug]
 *
 * 成分の詳細情報と関連商品を取得します。
 *
 * Query Parameters:
 * - products_limit: 関連商品の取得件数（デフォルト: 5, 最大: 20）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const productsLimit = Math.min(
      parseInt(searchParams.get("products_limit") || "5", 10),
      20,
    );

    // Validate slug
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ingredient slug",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const query = `*[_type == "ingredient" && slug.current == $slug][0] {
      _id,
      name,
      nameEn,
      "slug": slug.current,
      category,
      description,
      evidenceLevel,
      safetyScore,
      dailyRecommendedAmount,
      dailyUpperLimit,
      benefits,
      sideEffects,
      interactions,
      sources,
      "relatedProducts": *[_type == "product" && references(^._id) && availability == "in-stock"] | order(tierRatings.overallRank == "S+" desc, tierRatings.overallRank == "S" desc, priceJPY asc) [0...${productsLimit}] {
        _id,
        name,
        "slug": slug.current,
        priceJPY,
        servingsPerContainer,
        servingsPerDay,
        externalImageUrl,
        source,
        tierRatings {
          overallRank,
          costEffectivenessRank
        },
        badges,
        "ingredientAmount": ingredients[ingredient._ref == ^.^._id][0].amountMgPerServing
      },
      "totalProductCount": count(*[_type == "product" && references(^._id) && availability == "in-stock"])
    }`;

    const ingredient = await sanityServer.fetch(query, { slug });

    if (!ingredient) {
      return NextResponse.json(
        {
          success: false,
          error: "Ingredient not found",
        },
        { status: 404, headers: corsHeaders },
      );
    }

    const response = {
      success: true,
      ingredient: {
        id: ingredient._id,
        name: ingredient.name,
        nameEn: ingredient.nameEn,
        slug: ingredient.slug,
        category: ingredient.category,
        url: `https://suptia.com/ingredients/${ingredient.slug}`,
        description: ingredient.description,
        evidenceLevel: ingredient.evidenceLevel,
        safetyScore: ingredient.safetyScore,
        dosage: {
          dailyRecommended: ingredient.dailyRecommendedAmount,
          dailyUpperLimit: ingredient.dailyUpperLimit,
        },
        benefits: ingredient.benefits || [],
        sideEffects: ingredient.sideEffects || [],
        interactions: ingredient.interactions || [],
        sources: ingredient.sources || [],
      },
      relatedProducts: {
        total: ingredient.totalProductCount,
        showing: ingredient.relatedProducts?.length || 0,
        items:
          ingredient.relatedProducts?.map((p: any) => {
            const daysSupply = Math.floor(
              p.servingsPerContainer / p.servingsPerDay,
            );
            return {
              id: p._id,
              name: p.name,
              slug: p.slug,
              url: `https://suptia.com/products/${p.slug}`,
              price: p.priceJPY,
              pricePerDay: Math.round(p.priceJPY / daysSupply),
              daysSupply,
              image: p.externalImageUrl,
              source: p.source,
              ingredientAmount: p.ingredientAmount,
              tierRank: p.tierRatings?.overallRank,
              costEffectivenessRank: p.tierRatings?.costEffectivenessRank,
              badges: p.badges || [],
            };
          }) || [],
      },
      _links: {
        self: `https://suptia.com/api/v1/ingredients/${slug}`,
        web: `https://suptia.com/ingredients/${slug}`,
        allProducts: `https://suptia.com/api/v1/products/search?ingredient=${encodeURIComponent(ingredient.name)}`,
        docs: "https://suptia.com/openapi.yaml",
      },
    };

    const evidenceDesc = ingredient.evidenceLevel
      ? ` Evidence level: ${ingredient.evidenceLevel}.`
      : "";
    const safetyDesc = ingredient.safetyScore
      ? ` Safety score: ${ingredient.safetyScore}/100.`
      : "";
    const productDesc =
      ingredient.totalProductCount > 0
        ? ` ${ingredient.totalProductCount} products available.`
        : "";

    const gptResponse = withGptFields(response, {
      summary: `${ingredient.nameEn || ingredient.name} (${ingredient.category}).${evidenceDesc}${safetyDesc}${productDesc}`,
      citationPath: `/ingredients/${slug}`,
    });

    return NextResponse.json(gptResponse, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Ingredient detail API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch ingredient",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
