import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";

// CORS headers for GPT Actions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/v1/products/search
 *
 * サプリメント商品を検索します。
 *
 * Query Parameters:
 * - q: 検索キーワード（商品名）
 * - ingredient: 成分名（日本語または英語）
 * - category: カテゴリ（vitamin, mineral, amino-acid, etc.）
 * - sort: ソート順（price-asc, price-desc, cost-effectiveness, tier-rank）
 * - limit: 取得件数（デフォルト: 10, 最大: 50）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";
    const ingredient = searchParams.get("ingredient") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "tier-rank";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

    // Build GROQ query filters
    const filters: string[] = [
      '_type == "product"',
      'availability == "in-stock"',
    ];

    if (q) {
      filters.push(`name match "*${q}*"`);
    }

    if (ingredient) {
      filters.push(
        `count(ingredients[ingredient->name match "*${ingredient}*" || ingredient->nameEn match "*${ingredient}*"]) > 0`,
      );
    }

    if (category) {
      filters.push(
        `count(ingredients[ingredient->category == "${category}"]) > 0`,
      );
    }

    // Build sort order
    let orderClause = "";
    switch (sort) {
      case "price-asc":
        orderClause = "| order(priceJPY asc)";
        break;
      case "price-desc":
        orderClause = "| order(priceJPY desc)";
        break;
      case "cost-effectiveness":
        orderClause =
          '| order(tierRatings.costEffectivenessRank == "S" desc, tierRatings.costEffectivenessRank == "A" desc, priceJPY asc)';
        break;
      case "tier-rank":
      default:
        orderClause =
          '| order(tierRatings.overallRank == "S+" desc, tierRatings.overallRank == "S" desc, tierRatings.overallRank == "A" desc, priceJPY asc)';
        break;
    }

    const query = `*[${filters.join(" && ")}] ${orderClause} [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      priceJPY,
      servingsPerContainer,
      servingsPerDay,
      externalImageUrl,
      source,
      "url": "https://suptia.com/products/" + slug.current,
      "pricePerDay": round(priceJPY / (servingsPerContainer / servingsPerDay)),
      "lowestPrice": priceData[0].amount,
      "lowestPriceSource": priceData[0].source,
      tierRatings {
        priceRank,
        costEffectivenessRank,
        contentRank,
        evidenceRank,
        safetyRank,
        overallRank
      },
      badges,
      "mainIngredients": ingredients[0...3]{
        amountMgPerServing,
        "name": ingredient->name,
        "nameEn": ingredient->nameEn,
        "category": ingredient->category
      }
    }`;

    const products = await sanityServer.fetch(query);

    // Transform for GPT-friendly response
    const response = {
      success: true,
      count: products.length,
      query: {
        keyword: q || null,
        ingredient: ingredient || null,
        category: category || null,
        sort,
        limit,
      },
      products: products.map((p: any) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        url: p.url,
        price: {
          amount: p.priceJPY,
          currency: "JPY",
          perDay: p.pricePerDay,
          lowestPrice: p.lowestPrice,
          lowestPriceSource: p.lowestPriceSource,
        },
        servings: {
          perContainer: p.servingsPerContainer,
          perDay: p.servingsPerDay,
          daysSupply: Math.floor(p.servingsPerContainer / p.servingsPerDay),
        },
        image: p.externalImageUrl,
        source: p.source,
        tierRanks: p.tierRatings
          ? {
              overall: p.tierRatings.overallRank,
              price: p.tierRatings.priceRank,
              costEffectiveness: p.tierRatings.costEffectivenessRank,
              content: p.tierRatings.contentRank,
              evidence: p.tierRatings.evidenceRank,
              safety: p.tierRatings.safetyRank,
            }
          : null,
        badges: p.badges || [],
        mainIngredients:
          p.mainIngredients?.map((i: any) => ({
            name: i.name,
            nameEn: i.nameEn,
            category: i.category,
            amountMg: i.amountMgPerServing,
          })) || [],
      })),
      _links: {
        self: `https://suptia.com/api/v1/products/search?${searchParams.toString()}`,
        docs: "https://suptia.com/api/docs",
      },
    };

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Product search API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search products",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
