import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";
import { isValidSlug } from "@/lib/sanitize";

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
 * GET /api/v1/products/[slug]
 *
 * 商品の詳細情報を取得します。
 * 価格比較、成分情報、ティアランク、購入リンクを含みます。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product slug",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const query = `*[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      description,
      priceJPY,
      servingsPerContainer,
      servingsPerDay,
      externalImageUrl,
      source,
      availability,
      priceData[] {
        source,
        shopName,
        storeName,
        amount,
        currency,
        url,
        fetchedAt,
        shippingFee,
        isFreeShipping,
        effectivePrice,
        stockStatus
      },
      ingredients[] {
        amountMgPerServing,
        ingredient-> {
          _id,
          name,
          nameEn,
          "slug": slug.current,
          category,
          evidenceLevel,
          safetyScore,
          dailyRecommendedAmount,
          dailyUpperLimit,
          description
        }
      },
      tierRatings {
        priceRank,
        costEffectivenessRank,
        contentRank,
        evidenceRank,
        safetyRank,
        overallRank
      },
      badges,
      priceHistory[] {
        source,
        amount,
        recordedAt
      }
    }`;

    const product = await sanityServer.fetch(query, { slug });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404, headers: corsHeaders },
      );
    }

    // Calculate additional metrics
    const daysSupply = Math.floor(
      product.servingsPerContainer / product.servingsPerDay,
    );
    const pricePerDay = Math.round(product.priceJPY / daysSupply);

    // Find lowest price
    const lowestPriceData = product.priceData?.reduce(
      (min: any, p: any) => (!min || p.amount < min.amount ? p : min),
      null,
    );

    // Transform for GPT-friendly response
    const response = {
      success: true,
      product: {
        id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        url: `https://suptia.com/products/${product.slug}`,
        availability: product.availability,
        image: product.externalImageUrl,
        source: product.source,
        pricing: {
          basePrice: product.priceJPY,
          currency: "JPY",
          pricePerDay,
          daysSupply,
          lowestPrice: lowestPriceData
            ? {
                amount: lowestPriceData.amount,
                source: lowestPriceData.source,
                shopName: lowestPriceData.shopName || lowestPriceData.storeName,
                url: lowestPriceData.url,
                shippingFee: lowestPriceData.shippingFee,
                isFreeShipping: lowestPriceData.isFreeShipping,
              }
            : null,
          priceComparison:
            product.priceData?.map((p: any) => ({
              source: p.source,
              shopName: p.shopName || p.storeName,
              amount: p.amount,
              url: p.url,
              shippingFee: p.shippingFee,
              isFreeShipping: p.isFreeShipping,
              effectivePrice: p.effectivePrice,
              stockStatus: p.stockStatus,
              fetchedAt: p.fetchedAt,
            })) || [],
        },
        servings: {
          perContainer: product.servingsPerContainer,
          perDay: product.servingsPerDay,
          daysSupply,
        },
        tierRanks: product.tierRatings
          ? {
              overall: product.tierRatings.overallRank,
              price: product.tierRatings.priceRank,
              costEffectiveness: product.tierRatings.costEffectivenessRank,
              content: product.tierRatings.contentRank,
              evidence: product.tierRatings.evidenceRank,
              safety: product.tierRatings.safetyRank,
            }
          : null,
        badges: product.badges || [],
        ingredients:
          product.ingredients?.map((i: any) => ({
            name: i.ingredient?.name,
            nameEn: i.ingredient?.nameEn,
            slug: i.ingredient?.slug,
            category: i.ingredient?.category,
            amountMgPerServing: i.amountMgPerServing,
            evidenceLevel: i.ingredient?.evidenceLevel,
            safetyScore: i.ingredient?.safetyScore,
            dailyRecommendedAmount: i.ingredient?.dailyRecommendedAmount,
            dailyUpperLimit: i.ingredient?.dailyUpperLimit,
            description: i.ingredient?.description,
            url: i.ingredient?.slug
              ? `https://suptia.com/ingredients/${i.ingredient.slug}`
              : null,
          })) || [],
        priceHistory:
          product.priceHistory?.slice(-30).map((h: any) => ({
            source: h.source,
            amount: h.amount,
            date: h.recordedAt,
          })) || [],
      },
      _links: {
        self: `https://suptia.com/api/v1/products/${slug}`,
        web: `https://suptia.com/products/${slug}`,
        search: "https://suptia.com/api/v1/products/search",
      },
    };

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
