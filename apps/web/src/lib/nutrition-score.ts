/**
 * Nutrition Score Calculator
 *
 * Phase 2.7-A: 栄養価スコア導入
 * - RDA（推奨摂取量）ベース評価
 * - 「質 × 量」の総合評価
 *
 * Formula: Σ(成分mg / RDA) × エビデンススコア
 */

import rdaStandards from "../data/rda-standards.json";
import type { RdaStandards } from "../types/rda";
import { normalizeIngredientName } from "./ingredient-utils";

const rdaData = rdaStandards as RdaStandards;

/**
 * エビデンスレベルをスコアに変換
 *
 * S: 100点 - 大規模RCTやメタ解析による高い信頼性
 * A: 80点 - 良質な研究で効果が確認
 * B: 60点 - 限定的研究・条件付きの効果
 * C: 40点 - 動物実験・小規模試験レベル
 * D: 20点 - 理論・未検証レベル
 */
export function evidenceLevelToScore(level: string): number {
  const mapping: Record<string, number> = {
    S: 100,
    A: 80,
    B: 60,
    C: 40,
    D: 20,
  };

  return mapping[level.toUpperCase()] || 0;
}

export interface IngredientWithEvidence {
  /** 成分名（日本語） */
  name: string;
  /** 成分量（mg） */
  amount: number;
  /** エビデンスレベル（S/A/B/C/D） */
  evidenceLevel: string;
}

export interface NutritionScoreResult {
  /** 総合栄養価スコア（0-100+） */
  totalScore: number;
  /** 成分別スコア */
  ingredientScores: Array<{
    name: string;
    rdaFulfillment: number; // RDA充足率（%）
    evidenceScore: number; // エビデンススコア（0-100）
    contributionScore: number; // 貢献スコア（RDA充足率 × エビデンススコア）
  }>;
  /** カテゴリー別スコア */
  categoryScores: Record<
    string,
    {
      count: number;
      averageScore: number;
    }
  >;
}

/**
 * 商品の栄養価スコアを計算
 *
 * @param ingredients - 成分配列（{name, amount, evidenceLevel}）
 * @param gender - "male" or "female"（デフォルト: "male"）
 * @returns 栄養価スコア結果
 */
export function calculateNutritionScore(
  ingredients: IngredientWithEvidence[],
  gender: "male" | "female" = "male",
): NutritionScoreResult {
  let totalScore = 0;
  const ingredientScores: NutritionScoreResult["ingredientScores"] = [];
  const categoryScores: Record<string, { count: number; totalScore: number }> =
    {};

  for (const ing of ingredients) {
    const normalizedName = normalizeIngredientName(ing.name);
    const rdaIngredient = rdaData.ingredients[normalizedName];
    if (!rdaIngredient) {
      // RDAデータがない成分はスキップ
      continue;
    }

    // RDA充足率を計算（0-100%でキャップ）
    const rdaValue = rdaIngredient.rda[gender];
    const rdaFulfillment = Math.min((ing.amount / rdaValue) * 100, 100);

    // エビデンススコアを取得
    const evidenceScore = evidenceLevelToScore(ing.evidenceLevel);

    // 貢献スコア = (RDA充足率 / 100) × エビデンススコア
    const contributionScore = (rdaFulfillment / 100) * evidenceScore;

    totalScore += contributionScore;
    ingredientScores.push({
      name: ing.name,
      rdaFulfillment,
      evidenceScore,
      contributionScore,
    });

    // カテゴリー別集計
    const category = rdaIngredient.category;
    if (!categoryScores[category]) {
      categoryScores[category] = { count: 0, totalScore: 0 };
    }
    categoryScores[category].count++;
    categoryScores[category].totalScore += contributionScore;
  }

  // カテゴリー別平均スコアを計算
  const finalCategoryScores: NutritionScoreResult["categoryScores"] = {};
  for (const [category, data] of Object.entries(categoryScores)) {
    finalCategoryScores[category] = {
      count: data.count,
      averageScore: data.totalScore / data.count,
    };
  }

  return {
    totalScore,
    ingredientScores,
    categoryScores: finalCategoryScores,
  };
}

/**
 * RDA充足率を計算
 *
 * @param ingredientName - 成分名（日本語）
 * @param amountMg - 成分量（mg）
 * @param gender - "male" or "female"
 * @returns RDA充足率（%）、データがない場合はnull
 */
export function calculateRdaFulfillment(
  ingredientName: string,
  amountMg: number,
  gender: "male" | "female" = "male",
): number | null {
  const normalizedName = normalizeIngredientName(ingredientName);
  const rdaIngredient = rdaData.ingredients[normalizedName];
  if (!rdaIngredient) return null;

  const rdaValue = rdaIngredient.rda[gender];
  return (amountMg / rdaValue) * 100;
}

/**
 * 耐容上限量（UL）を超過しているかチェック
 *
 * @param ingredientName - 成分名（日本語）
 * @param amountMg - 成分量（mg）
 * @returns 超過している場合true、ULが設定されていない場合はnull
 */
export function exceedsTolerableUpperLimit(
  ingredientName: string,
  amountMg: number,
): boolean | null {
  const normalizedName = normalizeIngredientName(ingredientName);
  const rdaIngredient = rdaData.ingredients[normalizedName];
  if (!rdaIngredient || !rdaIngredient.ul) return null;

  return amountMg > rdaIngredient.ul.value;
}

/**
 * 安全レベルを判定
 *
 * @param ingredientName - 成分名（日本語）
 * @param amountMg - 成分量（mg）
 * @param gender - "male" or "female"
 * @returns 安全レベル
 *
 * - "deficient": 不足（RDA充足率 < 50%）
 * - "adequate": 適切（50% ≤ RDA充足率 < 100%）
 * - "optimal": 最適（100% ≤ RDA充足率 ≤ 150%）
 * - "high": 高め（150% < RDA充足率、UL未満）
 * - "excessive": 過剰（UL超過）
 * - "unknown": データなし
 */
export function getSafetyLevel(
  ingredientName: string,
  amountMg: number,
  gender: "male" | "female" = "male",
): "deficient" | "adequate" | "optimal" | "high" | "excessive" | "unknown" {
  const fulfillment = calculateRdaFulfillment(ingredientName, amountMg, gender);
  if (fulfillment === null) return "unknown";

  const exceedsUL = exceedsTolerableUpperLimit(ingredientName, amountMg);

  if (exceedsUL === true) return "excessive";
  if (fulfillment < 50) return "deficient";
  if (fulfillment < 100) return "adequate";
  if (fulfillment <= 150) return "optimal";

  return "high";
}

/**
 * RDAデータを取得
 *
 * @param ingredientName - 成分名（日本語）
 * @returns RDAデータ、存在しない場合はnull
 */
export function getRdaData(ingredientName: string) {
  return rdaData.ingredients[ingredientName] || null;
}

/**
 * すべての成分のRDAデータを取得
 *
 * @returns RDAデータベース全体
 */
export function getAllRdaData(): RdaStandards {
  return rdaData;
}
