import { NextRequest, NextResponse } from "next/server";
import { sanityServer } from "@/lib/sanityServer";

// GROQクエリ用のサニタイズ関数
function sanitizeForGroq(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\*/g, "\\*");
}

// 英語成分名の正規化マッピング（GPT Actions用）
// スペースやハイフンのバリエーションを統一
const ingredientNormalizationMap: Record<string, string> = {
  "vitamin-d": "Vitamin D",
  "vitamin d": "Vitamin D",
  "vitamin-c": "Vitamin C",
  "vitamin c": "Vitamin C",
  "vitamin-b": "Vitamin B",
  "vitamin b": "Vitamin B",
  "vitamin-e": "Vitamin E",
  "vitamin e": "Vitamin E",
  "vitamin-k": "Vitamin K",
  "vitamin k": "Vitamin K",
  "vitamin-a": "Vitamin A",
  "vitamin a": "Vitamin A",
  zinc: "Zinc",
  iron: "Iron",
  calcium: "Calcium",
  magnesium: "Magnesium",
  "omega-3": "Omega-3",
  omega3: "Omega-3",
  dha: "DHA",
  epa: "EPA",
  "fish-oil": "Fish Oil",
  "fish oil": "Fish Oil",
  probiotics: "Probiotics",
  collagen: "Collagen",
  "hyaluronic-acid": "Hyaluronic Acid",
  "hyaluronic acid": "Hyaluronic Acid",
  coq10: "CoQ10",
  "coenzyme-q10": "CoQ10",
  gaba: "GABA",
  theanine: "Theanine",
  "l-theanine": "L-Theanine",
  glycine: "Glycine",
  ashwagandha: "Ashwagandha",
  glucosamine: "Glucosamine",
  chondroitin: "Chondroitin",
  protein: "Protein",
  bcaa: "BCAA",
  creatine: "Creatine",
  hmb: "HMB",
  carnitine: "Carnitine",
  "l-carnitine": "L-Carnitine",
  multivitamin: "Multivitamin",
  "multi-vitamin": "Multivitamin",
  fiber: "Fiber",
  "dietary-fiber": "Dietary Fiber",
  "ginkgo-biloba": "Ginkgo Biloba",
  "ginkgo biloba": "Ginkgo Biloba",
  echinacea: "Echinacea",
};

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

    // パラメータ取得
    const rawQ = searchParams.get("q") || "";
    const rawIngredient = searchParams.get("ingredient") || "";
    const rawCategory = searchParams.get("category") || "";

    // 英語成分名の正規化（GPT Actions対応）
    // nameEnフィールドで検索できる形式に変換
    const normalizedKey = rawIngredient.toLowerCase().replace(/\s+/g, "-");
    const normalizedIngredient =
      ingredientNormalizationMap[normalizedKey] ||
      ingredientNormalizationMap[rawIngredient.toLowerCase()] ||
      rawIngredient;

    // サニタイズ
    const q = sanitizeForGroq(rawQ);
    const ingredient = sanitizeForGroq(normalizedIngredient);
    const category = sanitizeForGroq(rawCategory);
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
    // GROQはselectでスコア化してソート
    let orderClause = "";
    switch (sort) {
      case "price-asc":
        orderClause = "| order(priceJPY asc)";
        break;
      case "price-desc":
        orderClause = "| order(priceJPY desc)";
        break;
      case "cost-effectiveness":
        orderClause = `| order(
          select(
            tierRatings.costEffectivenessRank == "S" => 5,
            tierRatings.costEffectivenessRank == "A" => 4,
            tierRatings.costEffectivenessRank == "B" => 3,
            tierRatings.costEffectivenessRank == "C" => 2,
            tierRatings.costEffectivenessRank == "D" => 1,
            0
          ) desc, priceJPY asc)`;
        break;
      case "tier-rank":
      default:
        orderClause = `| order(
          select(
            tierRatings.overallRank == "S+" => 6,
            tierRatings.overallRank == "S" => 5,
            tierRatings.overallRank == "A" => 4,
            tierRatings.overallRank == "B" => 3,
            tierRatings.overallRank == "C" => 2,
            tierRatings.overallRank == "D" => 1,
            0
          ) desc, priceJPY asc)`;
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
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
