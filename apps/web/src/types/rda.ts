/**
 * RDA (Recommended Dietary Allowance) Standards Type Definitions
 *
 * Based on: 厚生労働省「日本人の食事摂取基準（2020年版）」
 */

export type RdaType = "RDA" | "AI";

export type IngredientCategory =
  | "ビタミン"
  | "ミネラル"
  | "アミノ酸"
  | "脂肪酸"
  | "その他";

export type Unit = "mg" | "g" | "IU";

export interface RdaValue {
  /** Adult male (18-29歳) RDA/AI */
  male: number;
  /** Adult female (18-29歳) RDA/AI */
  female: number;
  /** Unit of measurement */
  unit: Unit;
  /** RDA (Recommended Dietary Allowance) or AI (Adequate Intake) */
  type: RdaType;
  /** Additional notes */
  note?: string;
}

export interface TolerableUpperIntakeLevel {
  /** Upper limit value */
  value: number;
  /** Unit of measurement */
  unit: Unit;
  /** Additional notes */
  note?: string;
}

export interface IngredientRdaData {
  /** English name */
  nameEn: string;
  /** Ingredient category */
  category: IngredientCategory;
  /** Recommended Dietary Allowance */
  rda: RdaValue;
  /** Tolerable Upper Intake Level (null if not established) */
  ul: TolerableUpperIntakeLevel | null;
  /** Health risks associated with deficiency */
  deficiencyRisks: string[];
  /** Health risks associated with excess intake */
  excessRisks: string[];
}

export interface RdaStandards {
  /** Schema version */
  version: string;
  /** Data source reference */
  source: string;
  /** Last update date (YYYY-MM-DD) */
  lastUpdated: string;
  /** General notes about the data */
  notes?: string[];
  /** Ingredient-specific RDA data (key: Japanese ingredient name) */
  ingredients: Record<string, IngredientRdaData>;
}

/**
 * Calculate RDA fulfillment percentage for a given ingredient amount
 *
 * @param ingredientName - Japanese ingredient name
 * @param amountMg - Amount in mg
 * @param gender - "male" or "female"
 * @param rdaData - RDA standards database
 * @returns Fulfillment percentage (0-100+)
 */
export function calculateRdaFulfillment(
  ingredientName: string,
  amountMg: number,
  gender: "male" | "female",
  rdaData: RdaStandards,
): number | null {
  const ingredient = rdaData.ingredients[ingredientName];
  if (!ingredient) return null;

  const rdaValue = ingredient.rda[gender];
  return (amountMg / rdaValue) * 100;
}

/**
 * Check if amount exceeds Tolerable Upper Intake Level
 *
 * @param ingredientName - Japanese ingredient name
 * @param amountMg - Amount in mg
 * @param rdaData - RDA standards database
 * @returns true if exceeds UL, false otherwise, null if UL not established
 */
export function exceedsTolerableUpperLimit(
  ingredientName: string,
  amountMg: number,
  rdaData: RdaStandards,
): boolean | null {
  const ingredient = rdaData.ingredients[ingredientName];
  if (!ingredient || !ingredient.ul) return null;

  return amountMg > ingredient.ul.value;
}

/**
 * Get safety level based on RDA fulfillment and UL
 *
 * @param ingredientName - Japanese ingredient name
 * @param amountMg - Amount in mg
 * @param gender - "male" or "female"
 * @param rdaData - RDA standards database
 * @returns Safety level: "deficient" | "adequate" | "optimal" | "high" | "excessive" | "unknown"
 */
export function getSafetyLevel(
  ingredientName: string,
  amountMg: number,
  gender: "male" | "female",
  rdaData: RdaStandards,
): "deficient" | "adequate" | "optimal" | "high" | "excessive" | "unknown" {
  const fulfillment = calculateRdaFulfillment(
    ingredientName,
    amountMg,
    gender,
    rdaData,
  );
  if (fulfillment === null) return "unknown";

  const exceedsUL = exceedsTolerableUpperLimit(
    ingredientName,
    amountMg,
    rdaData,
  );

  if (exceedsUL === true) return "excessive";
  if (fulfillment < 50) return "deficient";
  if (fulfillment < 100) return "adequate";
  if (fulfillment <= 150) return "optimal";

  return "high";
}

/**
 * Calculate nutrition score based on RDA fulfillment
 *
 * Formula: Σ(ingredient_mg / RDA) × evidence_score
 *
 * @param ingredients - Array of {name, amount, evidenceScore}
 * @param gender - "male" or "female"
 * @param rdaData - RDA standards database
 * @returns Nutrition score (0-100+)
 */
export function calculateNutritionScore(
  ingredients: Array<{ name: string; amount: number; evidenceScore: number }>,
  gender: "male" | "female",
  rdaData: RdaStandards,
): number {
  let totalScore = 0;

  for (const ing of ingredients) {
    const fulfillment = calculateRdaFulfillment(
      ing.name,
      ing.amount,
      gender,
      rdaData,
    );
    if (fulfillment === null) continue;

    // Cap at 100% RDA to avoid over-rewarding excessive amounts
    const cappedFulfillment = Math.min(fulfillment, 100);
    totalScore += (cappedFulfillment / 100) * ing.evidenceScore;
  }

  return totalScore;
}
