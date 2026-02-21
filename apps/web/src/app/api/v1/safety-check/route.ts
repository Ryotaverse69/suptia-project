import { NextRequest, NextResponse } from "next/server";
import {
  performSafetyCheck,
  type UserHealthProfile,
} from "@/lib/concierge/safety/checker";

// CORS headers for GPT Actions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
};

const DISCLAIMER =
  "この情報はPMDA・Natural Medicines Database等の信頼性の高いソースに基づく参考情報です。サプリメントの服用前には必ず医師・薬剤師にご相談ください。This information is for reference only. Always consult a healthcare professional before taking supplements.";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/v1/safety-check
 *
 * サプリメントの安全性チェック（ChatGPT Health連携向け）
 * 薬との相互作用、疾患との禁忌、アレルギーリスクを評価
 *
 * Query Parameters:
 * - ingredients: チェック対象の成分（カンマ区切りslug） e.g. "vitamin-d,zinc,omega-3"
 * - conditions: 既往歴（カンマ区切り） e.g. "kidney-disease,hypertension"
 * - medications: 服用中の薬（カンマ区切り） e.g. "warfarin,metformin"
 * - allergies: アレルギー（カンマ区切り） e.g. "shellfish,soy"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const ingredientsParam = searchParams.get("ingredients") || "";
    const conditionsParam = searchParams.get("conditions") || "";
    const medicationsParam = searchParams.get("medications") || "";
    const allergiesParam = searchParams.get("allergies") || "";

    // パラメータバリデーション
    if (!ingredientsParam && !conditionsParam && !medicationsParam) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one parameter (ingredients, conditions, or medications) is required",
          _links: {
            docs: "https://suptia.com/openapi.yaml",
          },
        },
        { status: 400, headers: corsHeaders },
      );
    }

    // カンマ区切りを配列に変換（空文字をフィルタ）
    const ingredients = ingredientsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const conditions = conditionsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const medications = medicationsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allergies = allergiesParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 安全性チェック実行
    const healthProfile: UserHealthProfile = {
      conditions,
      medications,
      allergies,
    };

    const safetyResult = performSafetyCheck(healthProfile);

    // 指定された成分に関連する警告のみフィルタ
    const relevantWarnings =
      ingredients.length > 0
        ? safetyResult.blockedIngredients.filter((b) =>
            ingredients.includes(b.ingredientSlug),
          )
        : safetyResult.blockedIngredients;

    // 安全かどうかの判定
    const hasHighRisk = relevantWarnings.some((w) => w.severity === "high");
    const hasModerateRisk = relevantWarnings.some(
      (w) => w.severity === "moderate",
    );

    // 安全性スコア（0-100）
    const safetyScore = Math.max(
      0,
      100 -
        relevantWarnings.filter((w) => w.severity === "high").length * 30 -
        relevantWarnings.filter((w) => w.severity === "moderate").length * 15 -
        relevantWarnings.filter((w) => w.severity === "low").length * 5,
    );

    const response = {
      success: true,
      safe: !hasHighRisk,
      safetyScore,
      riskLevel: hasHighRisk
        ? "high"
        : hasModerateRisk
          ? "moderate"
          : relevantWarnings.length > 0
            ? "low"
            : "none",
      query: {
        ingredients,
        conditions,
        medications,
        allergies,
      },
      warnings: relevantWarnings.map((w) => ({
        ingredient: w.ingredientName,
        ingredientSlug: w.ingredientSlug,
        severity: w.severity,
        reason: w.reason,
        relatedTo: {
          type: w.relatedTo.type,
          name: w.relatedTo.label,
        },
      })),
      allBlockedIngredients: safetyResult.blockedIngredients.map((b) => ({
        ingredient: b.ingredientName,
        ingredientSlug: b.ingredientSlug,
        severity: b.severity,
        reason: b.reason,
        relatedTo: {
          type: b.relatedTo.type,
          name: b.relatedTo.label,
        },
      })),
      dangerFlags: safetyResult.dangerFlags,
      disclaimer: DISCLAIMER,
      _gpt_summary: `Safety check completed. ${
        hasHighRisk
          ? `HIGH RISK: ${relevantWarnings.filter((w) => w.severity === "high").length} serious interaction(s) found.`
          : hasModerateRisk
            ? `CAUTION: ${relevantWarnings.filter((w) => w.severity === "moderate").length} moderate concern(s) found.`
            : relevantWarnings.length > 0
              ? `LOW RISK: ${relevantWarnings.length} minor concern(s) found.`
              : "No known safety concerns for the specified combination."
      } Safety score: ${safetyScore}/100.`,
      _citation: "https://suptia.com/about/methodology",
      _links: {
        self: `https://suptia.com/api/v1/safety-check?${searchParams.toString()}`,
        methodology: "https://suptia.com/about/methodology",
        docs: "https://suptia.com/openapi.yaml",
      },
    };

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Safety check API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform safety check",
        disclaimer: DISCLAIMER,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
