/**
 * Safety-Integrated Badge Logic
 *
 * Phase 2.7-B: 安全性統合（ULチェック）
 * - Sバッジ判定時に安全上限値（UL）をチェック
 * - UL超過の場合は警告表示に切り替え
 * - 安全性スコアへの自動減点
 */

import {
  exceedsTolerableUpperLimit,
  getSafetyLevel,
  getRdaData,
} from "./nutrition-score";

export type BadgeType = "S" | "A" | "B" | "C" | "warning" | "none";
export type SafetyLevel =
  | "deficient"
  | "adequate"
  | "optimal"
  | "high"
  | "excessive"
  | "unknown";

export interface BadgeDecision {
  /** バッジタイプ */
  badge: BadgeType;
  /** 表示メッセージ */
  message: string;
  /** 警告の有無 */
  hasWarning: boolean;
  /** 警告詳細（警告がある場合） */
  warningDetails?: {
    type: "ul_exceeded" | "deficiency" | "excessive";
    severity: "high" | "medium" | "low";
    recommendation: string;
  };
  /** 安全性レベル */
  safetyLevel: SafetyLevel;
}

export interface IngredientForBadge {
  /** 成分名（日本語） */
  name: string;
  /** 成分量（mg） */
  amount: number;
  /** 同グループ内での順位 */
  rankInGroup?: number;
  /** グループ内総数 */
  totalInGroup?: number;
  /** 性別（デフォルト: male） */
  gender?: "male" | "female";
}

/**
 * 含有量バッジを判定（安全性チェック統合版）
 *
 * 従来のロジック:
 * - グループ内で1日摂取量が最大 → Sバッジ
 *
 * 安全性統合後:
 * - 最大含有量でもUL超過 → 警告表示
 * - UL未満 → Sバッジ
 *
 * @param ingredient - 成分データ
 * @returns バッジ判定結果
 */
export function determineContentBadgeWithSafety(
  ingredient: IngredientForBadge,
): BadgeDecision {
  const gender = ingredient.gender || "male";

  // 1. 基本的な含有量ランク判定
  let baseBadge: BadgeType = "none";
  if (ingredient.rankInGroup === 1) {
    baseBadge = "S";
  } else if (ingredient.rankInGroup && ingredient.totalInGroup) {
    const percentile = (ingredient.rankInGroup / ingredient.totalInGroup) * 100;
    if (percentile <= 10) baseBadge = "A";
    else if (percentile <= 30) baseBadge = "B";
    else if (percentile <= 50) baseBadge = "C";
  }

  // 2. 安全性レベルを取得
  const safetyLevel = getSafetyLevel(
    ingredient.name,
    ingredient.amount,
    gender,
  );

  // 3. UL超過チェック
  const exceedsUL = exceedsTolerableUpperLimit(
    ingredient.name,
    ingredient.amount,
  );
  const rdaData = getRdaData(ingredient.name);

  // 4. 安全性に基づく最終判定
  if (exceedsUL === true && rdaData?.ul) {
    // UL超過の場合は警告表示
    return {
      badge: "warning",
      message: "安全上限超過",
      hasWarning: true,
      warningDetails: {
        type: "ul_exceeded",
        severity: "high",
        recommendation: `${ingredient.name}の摂取量（${ingredient.amount}mg）が安全上限値（${rdaData.ul.value}mg）を超えています。過剰摂取のリスクがあるため、摂取を控えることをお勧めします。`,
      },
      safetyLevel,
    };
  }

  // 5. 過剰摂取警告（ULは超えていないが、RDAの3倍以上）
  if (safetyLevel === "high" || safetyLevel === "excessive") {
    return {
      badge: baseBadge,
      message: getBadgeMessage(baseBadge),
      hasWarning: true,
      warningDetails: {
        type: "excessive",
        severity: "medium",
        recommendation: `${ingredient.name}の摂取量が推奨量を大幅に上回っています。長期的な過剰摂取には注意が必要です。`,
      },
      safetyLevel,
    };
  }

  // 6. 不足警告
  if (safetyLevel === "deficient") {
    return {
      badge: baseBadge,
      message: getBadgeMessage(baseBadge),
      hasWarning: true,
      warningDetails: {
        type: "deficiency",
        severity: "low",
        recommendation: `${ingredient.name}の摂取量が推奨量の50%未満です。不足している可能性があります。`,
      },
      safetyLevel,
    };
  }

  // 7. 正常範囲
  return {
    badge: baseBadge,
    message: getBadgeMessage(baseBadge),
    hasWarning: false,
    safetyLevel,
  };
}

/**
 * バッジタイプに応じたメッセージを取得
 */
function getBadgeMessage(badge: BadgeType): string {
  const messages: Record<BadgeType, string> = {
    S: "最高含有量",
    A: "高含有量",
    B: "標準以上",
    C: "標準的",
    warning: "安全上限超過",
    none: "-",
  };
  return messages[badge];
}

/**
 * 安全性スコアへの影響を計算
 *
 * @param ingredients - 成分配列
 * @returns 安全性スコア（0-100点）
 */
export function calculateSafetyScore(
  ingredients: Array<{ name: string; amount: number }>,
  gender: "male" | "female" = "male",
): number {
  if (ingredients.length === 0) return 100;

  let totalScore = 0;
  let scoredCount = 0;

  for (const ing of ingredients) {
    const rdaData = getRdaData(ing.name);
    if (!rdaData) continue;

    const exceedsUL = exceedsTolerableUpperLimit(ing.name, ing.amount);
    const safetyLevel = getSafetyLevel(ing.name, ing.amount, gender);

    let score = 100;

    // UL超過は大幅減点
    if (exceedsUL === true) {
      score = 0;
    } else if (safetyLevel === "excessive") {
      score = 30;
    } else if (safetyLevel === "high") {
      score = 70;
    } else if (safetyLevel === "optimal") {
      score = 100;
    } else if (safetyLevel === "adequate") {
      score = 90;
    } else if (safetyLevel === "deficient") {
      score = 60;
    }

    totalScore += score;
    scoredCount++;
  }

  return scoredCount > 0 ? totalScore / scoredCount : 100;
}

/**
 * 警告が必要な成分を抽出
 *
 * @param ingredients - 成分配列
 * @returns 警告が必要な成分のリスト
 */
export function extractWarningIngredients(
  ingredients: Array<{ name: string; amount: number }>,
  gender: "male" | "female" = "male",
): Array<{
  name: string;
  amount: number;
  warningType: "ul_exceeded" | "excessive" | "deficiency";
  severity: "high" | "medium" | "low";
  message: string;
}> {
  const warnings: Array<{
    name: string;
    amount: number;
    warningType: "ul_exceeded" | "excessive" | "deficiency";
    severity: "high" | "medium" | "low";
    message: string;
  }> = [];

  for (const ing of ingredients) {
    const exceedsUL = exceedsTolerableUpperLimit(ing.name, ing.amount);
    const safetyLevel = getSafetyLevel(ing.name, ing.amount, gender);
    const rdaData = getRdaData(ing.name);

    if (exceedsUL === true && rdaData?.ul) {
      warnings.push({
        name: ing.name,
        amount: ing.amount,
        warningType: "ul_exceeded",
        severity: "high",
        message: `${ing.name}の摂取量（${ing.amount}mg）が安全上限値（${rdaData.ul.value}mg）を超えています。${rdaData.excessRisks.join("、")}のリスクがあります。`,
      });
    } else if (safetyLevel === "excessive" || safetyLevel === "high") {
      warnings.push({
        name: ing.name,
        amount: ing.amount,
        warningType: "excessive",
        severity: "medium",
        message: `${ing.name}の摂取量が推奨量を大幅に上回っています。長期的な過剰摂取には注意が必要です。`,
      });
    } else if (safetyLevel === "deficient") {
      warnings.push({
        name: ing.name,
        amount: ing.amount,
        warningType: "deficiency",
        severity: "low",
        message: `${ing.name}の摂取量が推奨量の50%未満です。`,
      });
    }
  }

  return warnings;
}

/**
 * 商品全体の安全性評価
 *
 * @param ingredients - 成分配列
 * @returns 安全性評価結果
 */
export function evaluateProductSafety(
  ingredients: Array<{ name: string; amount: number }>,
  gender: "male" | "female" = "male",
): {
  overallScore: number;
  grade: "S" | "A" | "B" | "C" | "D";
  warnings: ReturnType<typeof extractWarningIngredients>;
  hasHighSeverityWarnings: boolean;
  recommendation: string;
} {
  const score = calculateSafetyScore(ingredients, gender);
  const warnings = extractWarningIngredients(ingredients, gender);
  const hasHighSeverityWarnings = warnings.some((w) => w.severity === "high");

  let grade: "S" | "A" | "B" | "C" | "D";
  let recommendation: string;

  if (score >= 95) {
    grade = "S";
    recommendation = "すべての成分が安全範囲内です。安心して摂取できます。";
  } else if (score >= 85) {
    grade = "A";
    recommendation = "ほぼすべての成分が適切な範囲です。";
  } else if (score >= 70) {
    grade = "B";
    recommendation = "一部の成分に注意が必要ですが、概ね安全です。";
  } else if (score >= 50) {
    grade = "C";
    recommendation =
      "複数の成分で過剰または不足があります。摂取量の調整を検討してください。";
  } else {
    grade = "D";
    recommendation =
      "安全上限を超えている成分があります。医師または薬剤師に相談することをお勧めします。";
  }

  return {
    overallScore: score,
    grade,
    warnings,
    hasHighSeverityWarnings,
    recommendation,
  };
}
