/**
 * 診断エンジンβ - Suptia推薦システム
 *
 * 4スコア評価システムにより、ユーザーの目的・健康状態・予算に応じて
 * 最適なサプリメントを推薦し、その理由を説明します。
 */

import type {
  ContraindicationTag,
  UserHealthProfile,
  SafetyCheckResult,
} from "./safety-checker";
import { checkProductSafety } from "./safety-checker";
import type { ProductCostData, CostCalculationResult } from "./cost-calculator";
import { calculateComprehensiveCost } from "./cost-calculator";

/**
 * 健康目標（ユーザーが達成したいこと）
 */
export type HealthGoal =
  | "immune-boost" // 免疫強化
  | "skin-health" // 美肌・肌の健康
  | "energy-recovery" // 疲労回復・エネルギー
  | "muscle-growth" // 筋力向上
  | "bone-health" // 骨の健康
  | "heart-health" // 心血管の健康
  | "brain-function" // 脳機能・認知機能
  | "sleep-quality" // 睡眠の質
  | "stress-relief" // ストレス軽減
  | "digestive-health" // 消化器の健康
  | "eye-health" // 目の健康
  | "anti-aging" // アンチエイジング
  | "weight-management" // 体重管理
  | "joint-health" // 関節の健康
  | "general-wellness"; // 総合的な健康維持

/**
 * 健康目標の日本語ラベル
 */
export const HEALTH_GOAL_LABELS: Record<HealthGoal, string> = {
  "immune-boost": "免疫力強化",
  "skin-health": "美肌・肌の健康",
  "energy-recovery": "疲労回復・エネルギー",
  "muscle-growth": "筋力向上",
  "bone-health": "骨の健康",
  "heart-health": "心血管の健康",
  "brain-function": "脳機能・認知機能",
  "sleep-quality": "睡眠の質改善",
  "stress-relief": "ストレス軽減",
  "digestive-health": "消化器の健康",
  "eye-health": "目の健康",
  "anti-aging": "アンチエイジング",
  "weight-management": "体重管理",
  "joint-health": "関節の健康",
  "general-wellness": "総合的な健康維持",
};

/**
 * エビデンスレベル（Sanityスキーマと一致）
 */
export type EvidenceLevel = "S" | "A" | "B" | "C" | "D" | "高" | "中" | "低";

/**
 * ユーザーの優先事項
 */
export type UserPriority =
  | "effectiveness"
  | "safety"
  | "cost"
  | "evidence"
  | "balanced";

/**
 * ユーザーの優先事項ラベル
 */
export const USER_PRIORITY_LABELS: Record<UserPriority, string> = {
  effectiveness: "効果重視",
  safety: "安全性重視",
  cost: "コスト重視",
  evidence: "エビデンス重視",
  balanced: "バランス重視",
};

/**
 * ユーザープロファイル（診断用）
 */
export interface UserDiagnosisProfile {
  goals: HealthGoal[]; // 健康目標（複数選択可）
  healthConditions: ContraindicationTag[]; // 健康状態・懸念事項
  budgetPerDay?: number; // 1日あたりの予算（円）
  priority: UserPriority; // 優先事項
}

/**
 * 成分情報（診断用）
 */
export interface IngredientForDiagnosis {
  name: string;
  slug: string;
  category?: string;
  evidenceLevel?: EvidenceLevel;
  relatedGoals?: HealthGoal[]; // この成分が貢献する健康目標
  contraindications?: ContraindicationTag[];
  amountMgPerServing: number;
}

/**
 * 商品情報（診断用）
 */
export interface ProductForDiagnosis extends ProductCostData {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  brand?: string;
  ingredients: IngredientForDiagnosis[];
}

/**
 * 4スコア評価結果
 */
export interface FourScoreEvaluation {
  effectivenessScore: number; // 効果スコア (0-100)
  safetyScore: number; // 安全性スコア (0-100)
  costScore: number; // コストスコア (0-100)
  evidenceScore: number; // エビデンススコア (0-100)
  overallScore: number; // 総合スコア (0-100)

  // 各スコアの詳細
  effectivenessDetails: {
    matchedGoals: HealthGoal[];
    goalMatchRate: number; // 目標一致率 (0-1)
    averageEvidenceLevel: number;
  };

  safetyDetails: {
    safetyCheckResult: SafetyCheckResult;
    hasContraindications: boolean;
  };

  costDetails: {
    costCalculation: CostCalculationResult;
    costEfficiencyRating: "excellent" | "good" | "fair" | "poor";
    costPerDayJPY: number;
  };

  evidenceDetails: {
    overallEvidenceLevel: EvidenceLevel;
    evidenceLevelScore: number;
    hasHighQualityEvidence: boolean;
  };
}

/**
 * 成績評価（S〜D）
 */
export type LetterGrade = "S" | "A" | "B" | "C" | "D";

/**
 * 推薦結果
 */
export interface RecommendationResult {
  product: ProductForDiagnosis;
  scores: FourScoreEvaluation;
  rank: number;
  grade: LetterGrade; // 総合評価（S〜D）
  recommendation:
    | "highly-recommended"
    | "recommended"
    | "acceptable"
    | "not-recommended";
  reasons: string[]; // 推薦理由（箇条書き）
  warnings: string[]; // 注意事項
}

/**
 * エビデンスレベルを数値化
 */
function evidenceLevelToScore(level?: EvidenceLevel): number {
  if (!level) return 50; // デフォルト

  const mapping: Record<string, number> = {
    S: 100,
    A: 85,
    高: 85,
    B: 70,
    中: 70,
    C: 50,
    D: 30,
    低: 30,
  };

  return mapping[level] || 50;
}

/**
 * 効果スコアの計算
 * ユーザーの健康目標と成分の関連性を評価
 */
function calculateEffectivenessScore(
  product: ProductForDiagnosis,
  userGoals: HealthGoal[],
): FourScoreEvaluation["effectivenessDetails"] & { score: number } {
  if (userGoals.length === 0) {
    return {
      matchedGoals: [],
      goalMatchRate: 0,
      averageEvidenceLevel: 50,
      score: 50, // 目標未設定の場合は中立
    };
  }

  // 各成分がユーザーの目標に貢献するかチェック
  const matchedGoals = new Set<HealthGoal>();
  let totalEvidenceScore = 0;
  let ingredientCount = 0;

  for (const ingredient of product.ingredients) {
    if (ingredient.relatedGoals) {
      for (const goal of userGoals) {
        if (ingredient.relatedGoals.includes(goal)) {
          matchedGoals.add(goal);
        }
      }
    }

    totalEvidenceScore += evidenceLevelToScore(ingredient.evidenceLevel);
    ingredientCount++;
  }

  const goalMatchRate = matchedGoals.size / userGoals.length;
  const averageEvidenceLevel =
    ingredientCount > 0 ? totalEvidenceScore / ingredientCount : 50;

  // 効果スコア = 目標一致率 × 70% + エビデンスレベル × 30%
  const score = Math.round(goalMatchRate * 70 + averageEvidenceLevel * 0.3);

  return {
    matchedGoals: Array.from(matchedGoals),
    goalMatchRate,
    averageEvidenceLevel,
    score,
  };
}

/**
 * 安全性スコアの計算
 * 禁忌チェック結果を数値化
 */
function calculateSafetyScore(
  product: ProductForDiagnosis,
  userHealth: UserHealthProfile,
): FourScoreEvaluation["safetyDetails"] & { score: number } {
  const safetyCheckResult = checkProductSafety(product.ingredients, userHealth);

  let score = 100;

  // リスクレベルに応じて減点
  switch (safetyCheckResult.riskLevel) {
    case "safe":
      score = 100;
      break;
    case "low-risk":
      score = 75;
      break;
    case "medium-risk":
      score = 50;
      break;
    case "high-risk":
      score = 0;
      break;
  }

  // 個別アラートでさらに細かく調整
  const criticalCount = safetyCheckResult.alerts.filter(
    (a) => a.severity === "critical",
  ).length;
  const warningCount = safetyCheckResult.alerts.filter(
    (a) => a.severity === "warning",
  ).length;

  // Critical 1件ごとに -25点
  score -= criticalCount * 25;
  // Warning 1件ごとに -10点
  score -= warningCount * 10;

  score = Math.max(0, Math.min(100, score)); // 0-100の範囲に制限

  return {
    safetyCheckResult,
    hasContraindications: !safetyCheckResult.isOverallSafe,
    score,
  };
}

/**
 * コストスコアの計算
 * 【新基準】予算内で最安値を最高評価、安い順に高得点
 */
function calculateCostScore(
  product: ProductForDiagnosis,
  userBudget?: number,
): FourScoreEvaluation["costDetails"] & { score: number } {
  const costCalculation = calculateComprehensiveCost(product);
  const costPerDay = costCalculation.costPerDay;

  let score = 100;
  let costEfficiencyRating: "excellent" | "good" | "fair" | "poor" = "good";

  if (userBudget && userBudget > 0) {
    // 予算設定あり: 予算内で安い順に高得点
    if (costPerDay <= userBudget) {
      // 予算内: 100点から価格に応じて減点（安いほど高得点）
      // 例: 予算500円の場合
      //   0円 → 100点
      //   250円（予算の50%） → 75点
      //   500円（予算ぴったり） → 50点
      const budgetRatio = costPerDay / userBudget;
      score = Math.round(100 - budgetRatio * 50);

      if (budgetRatio <= 0.3) {
        costEfficiencyRating = "excellent";
      } else if (budgetRatio <= 0.6) {
        costEfficiencyRating = "excellent";
      } else if (budgetRatio <= 0.8) {
        costEfficiencyRating = "good";
      } else {
        costEfficiencyRating = "fair";
      }
    } else {
      // 予算オーバー: 大幅減点
      const overBudgetRatio = (costPerDay - userBudget) / userBudget;
      // 予算の10%オーバー → 40点
      // 予算の50%オーバー → 20点
      // 予算の100%オーバー（2倍） → 5点
      score = Math.round(50 - overBudgetRatio * 40);
      score = Math.max(5, score); // 最低5点は残す
      costEfficiencyRating = "poor";
    }
  } else {
    // 予算未設定の場合は絶対値で評価（最安値優遇）
    // 段階的に細かく評価
    if (costPerDay <= 20) {
      score = 100;
      costEfficiencyRating = "excellent";
    } else if (costPerDay <= 40) {
      score = 95;
      costEfficiencyRating = "excellent";
    } else if (costPerDay <= 60) {
      score = 88;
      costEfficiencyRating = "excellent";
    } else if (costPerDay <= 80) {
      score = 80;
      costEfficiencyRating = "good";
    } else if (costPerDay <= 100) {
      score = 72;
      costEfficiencyRating = "good";
    } else if (costPerDay <= 120) {
      score = 64;
      costEfficiencyRating = "fair";
    } else if (costPerDay <= 150) {
      score = 55;
      costEfficiencyRating = "fair";
    } else if (costPerDay <= 180) {
      score = 46;
      costEfficiencyRating = "fair";
    } else if (costPerDay <= 200) {
      score = 38;
      costEfficiencyRating = "poor";
    } else if (costPerDay <= 250) {
      score = 28;
      costEfficiencyRating = "poor";
    } else {
      score = 15;
      costEfficiencyRating = "poor";
    }
  }

  return {
    costCalculation,
    costEfficiencyRating,
    costPerDayJPY: costPerDay,
    score,
  };
}

/**
 * エビデンススコアの計算
 * 成分の科学的根拠の強さを評価
 */
function calculateEvidenceScore(
  product: ProductForDiagnosis,
): FourScoreEvaluation["evidenceDetails"] & { score: number } {
  const evidenceLevels = product.ingredients
    .map((i) => evidenceLevelToScore(i.evidenceLevel))
    .filter((score) => score > 0);

  if (evidenceLevels.length === 0) {
    return {
      overallEvidenceLevel: "C",
      evidenceLevelScore: 50,
      hasHighQualityEvidence: false,
      score: 50,
    };
  }

  const averageScore =
    evidenceLevels.reduce((sum, s) => sum + s, 0) / evidenceLevels.length;
  const hasHighQualityEvidence = evidenceLevels.some((s) => s >= 85); // A or S

  let overallEvidenceLevel: EvidenceLevel;
  if (averageScore >= 90) overallEvidenceLevel = "S";
  else if (averageScore >= 75) overallEvidenceLevel = "A";
  else if (averageScore >= 60) overallEvidenceLevel = "B";
  else if (averageScore >= 40) overallEvidenceLevel = "C";
  else overallEvidenceLevel = "D";

  return {
    overallEvidenceLevel,
    evidenceLevelScore: averageScore,
    hasHighQualityEvidence,
    score: Math.round(averageScore),
  };
}

/**
 * 4スコア評価を実行
 */
export function evaluateProduct(
  product: ProductForDiagnosis,
  userProfile: UserDiagnosisProfile,
): FourScoreEvaluation {
  const effectiveness = calculateEffectivenessScore(product, userProfile.goals);
  const safety = calculateSafetyScore(product, {
    conditions: userProfile.healthConditions,
  });
  const cost = calculateCostScore(product, userProfile.budgetPerDay);
  const evidence = calculateEvidenceScore(product);

  // 優先事項に応じた重み付け
  const weights = getWeights(userProfile.priority);

  const overallScore = Math.round(
    effectiveness.score * weights.effectiveness +
      safety.score * weights.safety +
      cost.score * weights.cost +
      evidence.score * weights.evidence,
  );

  return {
    effectivenessScore: effectiveness.score,
    safetyScore: safety.score,
    costScore: cost.score,
    evidenceScore: evidence.score,
    overallScore,
    effectivenessDetails: {
      matchedGoals: effectiveness.matchedGoals,
      goalMatchRate: effectiveness.goalMatchRate,
      averageEvidenceLevel: effectiveness.averageEvidenceLevel,
    },
    safetyDetails: {
      safetyCheckResult: safety.safetyCheckResult,
      hasContraindications: safety.hasContraindications,
    },
    costDetails: {
      costCalculation: cost.costCalculation,
      costEfficiencyRating: cost.costEfficiencyRating,
      costPerDayJPY: cost.costPerDayJPY,
    },
    evidenceDetails: {
      overallEvidenceLevel: evidence.overallEvidenceLevel,
      evidenceLevelScore: evidence.evidenceLevelScore,
      hasHighQualityEvidence: evidence.hasHighQualityEvidence,
    },
  };
}

/**
 * 優先事項に応じた重み付けを取得
 * 【新基準】コスト（最安値・コスパ）を最優先、次に安全性を重視
 */
function getWeights(
  priority: UserPriority,
): Record<"effectiveness" | "safety" | "cost" | "evidence", number> {
  switch (priority) {
    case "effectiveness":
      return { effectiveness: 0.4, safety: 0.25, cost: 0.25, evidence: 0.1 };
    case "safety":
      return { effectiveness: 0.1, safety: 0.5, cost: 0.3, evidence: 0.1 };
    case "cost":
      // コスト重視: 最安値・コスパを最優先
      return { effectiveness: 0.1, safety: 0.25, cost: 0.6, evidence: 0.05 };
    case "evidence":
      return { effectiveness: 0.15, safety: 0.25, cost: 0.3, evidence: 0.3 };
    case "balanced":
    default:
      // バランス重視でもコストを最優先（50%）、次に安全性（30%）
      return { effectiveness: 0.1, safety: 0.3, cost: 0.5, evidence: 0.1 };
  }
}

/**
 * 推薦理由を生成
 */
function generateReasons(
  product: ProductForDiagnosis,
  scores: FourScoreEvaluation,
  userProfile: UserDiagnosisProfile,
): string[] {
  const reasons: string[] = [];

  // 効果面
  if (scores.effectivenessScore >= 70) {
    const matchedGoalsText = scores.effectivenessDetails.matchedGoals
      .map((g) => HEALTH_GOAL_LABELS[g])
      .join("、");

    if (matchedGoalsText) {
      reasons.push(`${matchedGoalsText}に効果的な成分を含んでいます`);
    }
  }

  // エビデンス面
  if (scores.evidenceDetails.hasHighQualityEvidence) {
    reasons.push(
      `高品質な科学的エビデンス（レベル${scores.evidenceDetails.overallEvidenceLevel}）に裏付けられています`,
    );
  }

  // 安全性面
  if (scores.safetyScore >= 90) {
    reasons.push("選択された健康状態に関する禁忌がなく、安全性が高いです");
  }

  // コスト面
  if (scores.costDetails.costEfficiencyRating === "excellent") {
    reasons.push(
      `1日あたり約${Math.round(scores.costDetails.costPerDayJPY)}円と、非常にコストパフォーマンスに優れています`,
    );
  } else if (scores.costDetails.costEfficiencyRating === "good") {
    reasons.push(
      `1日あたり約${Math.round(scores.costDetails.costPerDayJPY)}円と、適正価格です`,
    );
  }

  return reasons.length > 0 ? reasons : ["総合的な評価に基づいて推薦されます"];
}

/**
 * 注意事項を生成
 */
function generateWarnings(scores: FourScoreEvaluation): string[] {
  const warnings: string[] = [];

  // 安全性の警告
  if (scores.safetyDetails.hasContraindications) {
    warnings.push(scores.safetyDetails.safetyCheckResult.summary);
  }

  // コストの警告
  if (scores.costDetails.costEfficiencyRating === "poor") {
    warnings.push(
      `1日あたり${Math.round(scores.costDetails.costPerDayJPY)}円と、やや高額です`,
    );
  }

  // エビデンスの警告
  if (scores.evidenceScore < 50) {
    warnings.push("科学的エビデンスが限定的です");
  }

  return warnings;
}

/**
 * 総合スコアから成績評価（S〜D）を判定
 * Sランク: 90点以上（最優秀）
 * Aランク: 80〜89点（優秀）
 * Bランク: 70〜79点（良好）
 * Cランク: 60〜69点（可）
 * Dランク: 59点以下（不可）
 */
export function calculateLetterGrade(overallScore: number): LetterGrade {
  if (overallScore >= 90) return "S";
  if (overallScore >= 80) return "A";
  if (overallScore >= 70) return "B";
  if (overallScore >= 60) return "C";
  return "D";
}

/**
 * 推薦レベルを判定
 */
function determineRecommendationLevel(
  scores: FourScoreEvaluation,
): "highly-recommended" | "recommended" | "acceptable" | "not-recommended" {
  // 安全性が極端に低い場合は推奨しない
  if (scores.safetyScore < 30) {
    return "not-recommended";
  }

  // 総合スコアで判定
  if (scores.overallScore >= 80) {
    return "highly-recommended";
  } else if (scores.overallScore >= 60) {
    return "recommended";
  } else if (scores.overallScore >= 40) {
    return "acceptable";
  } else {
    return "not-recommended";
  }
}

/**
 * 商品を推薦
 */
export function recommendProduct(
  product: ProductForDiagnosis,
  userProfile: UserDiagnosisProfile,
): Omit<RecommendationResult, "rank"> {
  const scores = evaluateProduct(product, userProfile);
  const reasons = generateReasons(product, scores, userProfile);
  const warnings = generateWarnings(scores);
  const recommendation = determineRecommendationLevel(scores);
  const grade = calculateLetterGrade(scores.overallScore);

  return {
    product,
    scores,
    grade,
    recommendation,
    reasons,
    warnings,
  };
}

/**
 * 複数商品を評価してランキング生成
 */
export function recommendProducts(
  products: ProductForDiagnosis[],
  userProfile: UserDiagnosisProfile,
): RecommendationResult[] {
  // 各商品を評価
  const recommendations = products.map((product) =>
    recommendProduct(product, userProfile),
  );

  // 総合スコアでソート
  const sorted = recommendations.sort(
    (a, b) => b.scores.overallScore - a.scores.overallScore,
  );

  // ランクを付与
  return sorted.map((rec, index) => ({
    ...rec,
    rank: index + 1,
  }));
}

/**
 * トップN商品を取得
 */
export function getTopRecommendations(
  products: ProductForDiagnosis[],
  userProfile: UserDiagnosisProfile,
  limit: number = 5,
): RecommendationResult[] {
  const allRecommendations = recommendProducts(products, userProfile);
  return allRecommendations.slice(0, limit);
}
