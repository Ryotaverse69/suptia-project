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

// 目的から成分カテゴリへのマッピング
const goalToIngredients: Record<string, string[]> = {
  // 免疫系
  immunity: ["ビタミンC", "ビタミンD", "亜鉛", "エキナセア"],
  immune: ["ビタミンC", "ビタミンD", "亜鉛", "エキナセア"],
  免疫: ["ビタミンC", "ビタミンD", "亜鉛", "エキナセア"],

  // エネルギー・疲労
  energy: ["ビタミンB群", "鉄", "コエンザイムQ10", "マグネシウム"],
  fatigue: ["ビタミンB群", "鉄", "コエンザイムQ10", "マグネシウム"],
  疲労: ["ビタミンB群", "鉄", "コエンザイムQ10", "マグネシウム"],
  エネルギー: ["ビタミンB群", "鉄", "コエンザイムQ10", "マグネシウム"],

  // 睡眠
  sleep: ["マグネシウム", "GABA", "グリシン", "テアニン"],
  睡眠: ["マグネシウム", "GABA", "グリシン", "テアニン"],

  // 美容・肌
  skin: ["ビタミンC", "ビタミンE", "コラーゲン", "ヒアルロン酸"],
  beauty: ["ビタミンC", "ビタミンE", "コラーゲン", "ヒアルロン酸"],
  美容: ["ビタミンC", "ビタミンE", "コラーゲン", "ヒアルロン酸"],
  肌: ["ビタミンC", "ビタミンE", "コラーゲン", "ヒアルロン酸"],

  // 骨・関節
  bone: ["ビタミンD", "カルシウム", "ビタミンK", "マグネシウム"],
  joint: ["グルコサミン", "コンドロイチン", "MSM", "コラーゲン"],
  骨: ["ビタミンD", "カルシウム", "ビタミンK", "マグネシウム"],
  関節: ["グルコサミン", "コンドロイチン", "MSM", "コラーゲン"],

  // 筋肉・運動
  muscle: ["プロテイン", "BCAA", "クレアチン", "HMB"],
  workout: ["プロテイン", "BCAA", "クレアチン", "HMB"],
  筋肉: ["プロテイン", "BCAA", "クレアチン", "HMB"],
  運動: ["プロテイン", "BCAA", "クレアチン", "HMB"],

  // 集中・脳
  focus: ["DHA", "EPA", "イチョウ葉", "ホスファチジルセリン"],
  brain: ["DHA", "EPA", "イチョウ葉", "ホスファチジルセリン"],
  集中: ["DHA", "EPA", "イチョウ葉", "ホスファチジルセリン"],
  脳: ["DHA", "EPA", "イチョウ葉", "ホスファチジルセリン"],

  // ストレス
  stress: ["GABA", "テアニン", "アシュワガンダ", "マグネシウム"],
  ストレス: ["GABA", "テアニン", "アシュワガンダ", "マグネシウム"],

  // ダイエット
  diet: ["カルニチン", "CLA", "ガルシニア", "難消化性デキストリン"],
  weight: ["カルニチン", "CLA", "ガルシニア", "難消化性デキストリン"],
  ダイエット: ["カルニチン", "CLA", "ガルシニア", "難消化性デキストリン"],

  // 腸内環境
  gut: ["乳酸菌", "ビフィズス菌", "食物繊維", "オリゴ糖"],
  digestive: ["乳酸菌", "ビフィズス菌", "食物繊維", "オリゴ糖"],
  腸: ["乳酸菌", "ビフィズス菌", "食物繊維", "オリゴ糖"],

  // 総合・マルチビタミン
  general: ["マルチビタミン"],
  overall: ["マルチビタミン"],
  総合: ["マルチビタミン"],
};

/**
 * GET /api/v1/recommendations
 *
 * 目的や予算に応じたおすすめ商品を取得します。
 *
 * Query Parameters:
 * - goal: 目的（immunity, energy, sleep, skin, bone, muscle, focus, stress, diet, gut, general）
 * - ingredient: 特定の成分名
 * - budget: 予算（月額、円）
 * - priority: 優先項目（cost-effectiveness, safety, evidence, content）
 * - limit: 取得件数（デフォルト: 5, 最大: 20）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const goal = searchParams.get("goal")?.toLowerCase() || "";
    const ingredient = searchParams.get("ingredient") || "";
    const budgetStr = searchParams.get("budget");
    const priority = searchParams.get("priority") || "cost-effectiveness";
    const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10), 20);

    // Parse budget (monthly -> calculate max price per day)
    const monthlyBudget = budgetStr ? parseInt(budgetStr, 10) : null;
    const maxPricePerDay = monthlyBudget
      ? Math.floor(monthlyBudget / 30)
      : null;

    // Determine target ingredients
    let targetIngredients: string[] = [];
    if (ingredient) {
      targetIngredients = [ingredient];
    } else if (goal && goalToIngredients[goal]) {
      targetIngredients = goalToIngredients[goal];
    }

    // Build filters
    const filters: string[] = [
      '_type == "product"',
      'availability == "in-stock"',
    ];

    if (targetIngredients.length > 0) {
      const ingredientFilters = targetIngredients
        .map((i) => `ingredient->name match "*${i}*"`)
        .join(" || ");
      filters.push(`count(ingredients[${ingredientFilters}]) > 0`);
    }

    // Build sort order based on priority
    let orderClause = "";
    switch (priority) {
      case "safety":
        orderClause =
          '| order(tierRatings.safetyRank == "S" desc, tierRatings.safetyRank == "A" desc)';
        break;
      case "evidence":
        orderClause =
          '| order(tierRatings.evidenceRank == "S" desc, tierRatings.evidenceRank == "A" desc)';
        break;
      case "content":
        orderClause =
          '| order(tierRatings.contentRank == "S" desc, tierRatings.contentRank == "A" desc)';
        break;
      case "cost-effectiveness":
      default:
        orderClause =
          '| order(tierRatings.costEffectivenessRank == "S" desc, tierRatings.costEffectivenessRank == "A" desc, priceJPY asc)';
        break;
    }

    const query = `*[${filters.join(" && ")}] ${orderClause} [0...50] {
      _id,
      name,
      "slug": slug.current,
      priceJPY,
      servingsPerContainer,
      servingsPerDay,
      externalImageUrl,
      source,
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
        "nameEn": ingredient->nameEn
      }
    }`;

    let products = await sanityServer.fetch(query);

    // Filter by budget if specified
    if (maxPricePerDay) {
      products = products.filter((p: any) => {
        const daysSupply = Math.floor(
          p.servingsPerContainer / p.servingsPerDay,
        );
        const pricePerDay = p.priceJPY / daysSupply;
        return pricePerDay <= maxPricePerDay;
      });
    }

    // Limit results
    products = products.slice(0, limit);

    // Prepare recommendation reasons
    const getRecommendationReason = (product: any) => {
      const reasons: string[] = [];
      const tr = product.tierRatings;

      if (tr?.overallRank === "S+" || tr?.overallRank === "S") {
        reasons.push("総合評価が高い");
      }
      if (tr?.costEffectivenessRank === "S") {
        reasons.push("コスパ最高");
      }
      if (tr?.safetyRank === "S") {
        reasons.push("安全性が高い");
      }
      if (tr?.evidenceRank === "S") {
        reasons.push("エビデンスが豊富");
      }
      if (product.badges?.includes("five-crown")) {
        reasons.push("Five Crown認定（全項目S評価）");
      }

      return reasons.length > 0 ? reasons : ["バランスの取れた商品"];
    };

    const response = {
      success: true,
      count: products.length,
      query: {
        goal: goal || null,
        ingredient: ingredient || null,
        budget: monthlyBudget
          ? {
              monthly: monthlyBudget,
              maxPerDay: maxPricePerDay,
            }
          : null,
        priority,
        limit,
      },
      targetIngredients:
        targetIngredients.length > 0 ? targetIngredients : null,
      recommendations: products.map((p: any) => {
        const daysSupply = Math.floor(
          p.servingsPerContainer / p.servingsPerDay,
        );
        const pricePerDay = Math.round(p.priceJPY / daysSupply);
        const monthlyPrice = pricePerDay * 30;

        return {
          id: p._id,
          name: p.name,
          slug: p.slug,
          url: `https://suptia.com/products/${p.slug}`,
          image: p.externalImageUrl,
          source: p.source,
          pricing: {
            total: p.priceJPY,
            perDay: pricePerDay,
            perMonth: monthlyPrice,
            daysSupply,
          },
          tierRanks: p.tierRatings
            ? {
                overall: p.tierRatings.overallRank,
                costEffectiveness: p.tierRatings.costEffectivenessRank,
                safety: p.tierRatings.safetyRank,
                evidence: p.tierRatings.evidenceRank,
              }
            : null,
          badges: p.badges || [],
          mainIngredients:
            p.mainIngredients?.map((i: any) => ({
              name: i.name,
              nameEn: i.nameEn,
              amountMg: i.amountMgPerServing,
            })) || [],
          recommendationReasons: getRecommendationReason(p),
        };
      }),
      availableGoals: [
        "immunity",
        "energy",
        "sleep",
        "skin",
        "bone",
        "joint",
        "muscle",
        "focus",
        "stress",
        "diet",
        "gut",
        "general",
      ],
      _links: {
        self: `https://suptia.com/api/v1/recommendations?${searchParams.toString()}`,
        search: "https://suptia.com/api/v1/products/search",
        ingredients: "https://suptia.com/api/v1/ingredients",
      },
    };

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get recommendations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
