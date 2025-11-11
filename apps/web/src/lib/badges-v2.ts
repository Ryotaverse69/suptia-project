/**
 * 商品の称号（バッジ）判定ロジック v2
 *
 * 改善点：
 * 1. 信頼度重み付け（confidence）
 * 2. 理由の説明可能性（reason-tracking）
 * 3. 異常値除外ロジック
 * 4. 単位統一（mg換算）
 * 5. バランス指数（harmony index）
 */

import {
  convertToMg,
  validateServingsPerDay,
  validateIngredientAmount,
} from "./unit-converter";

export type BadgeType =
  | "lowest-price"
  | "highest-content"
  | "best-value"
  | "evidence-s"
  | "high-safety";

export interface Badge {
  type: BadgeType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

/**
 * バッジ判定結果（理由付き）
 */
export interface BadgeEvaluationResult {
  badge: BadgeType;
  awarded: boolean;
  reason: string;
  score?: number;
  confidence: number;
  details?: Record<string, any>;
}

/**
 * 総合評価結果
 */
export interface ComprehensiveBadgeResult {
  badges: BadgeType[];
  evaluations: BadgeEvaluationResult[];
  harmonyIndex: number;
  isPerfectSupplement: boolean;
  overallConfidence: number;
  warnings: string[];
}

export const BADGE_DEFINITIONS: Record<BadgeType, Badge> = {
  "lowest-price": {
    type: "lowest-price",
    label: "価格S",
    icon: "💰",
    color: "bg-green-50 border-green-200 text-green-700",
    description: "複数ECサイトで最も安い価格",
  },
  "highest-content": {
    type: "highest-content",
    label: "含有量S",
    icon: "📊",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    description: "成分量が最も多い",
  },
  "best-value": {
    type: "best-value",
    label: "コスパS",
    icon: "💡",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    description: "コスパが最も優れている",
  },
  "evidence-s": {
    type: "evidence-s",
    label: "エビデンスS",
    icon: "🔬",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    description: "最高レベルの科学的根拠",
  },
  "high-safety": {
    type: "high-safety",
    label: "安全性S",
    icon: "🛡️",
    color: "bg-red-50 border-red-200 text-red-700",
    description: "安全性スコア90点以上",
  },
};

export interface ProductForBadgeEvaluationV2 {
  _id: string;
  name?: string;
  priceJPY: number;
  servingsPerContainer?: number;
  servingsPerDay?: number;
  ingredientAmount?: number;
  ingredientUnit?: string; // 単位（mg, IU, mcg等）
  ingredientId?: string;
  ingredientName?: string; // IU換算用
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  safetyScore?: number;
  thirdPartyTested?: boolean;
  warnings?: string[];
  contraindicationCount?: number;
  priceData?: Array<{
    source: string;
    amount: number;
    confidence?: number;
    fetchedAt?: string;
    shopName?: string;
  }>;
}

/**
 * 価格データの鮮度チェック
 */
function isPriceDataFresh(
  fetchedAt?: string,
  maxAgeHours: number = 48,
): boolean {
  if (!fetchedAt) return false;

  const fetchedDate = new Date(fetchedAt);
  const now = new Date();
  const ageHours = (now.getTime() - fetchedDate.getTime()) / (1000 * 60 * 60);

  return ageHours <= maxAgeHours;
}

/**
 * 価格S判定（改善版）
 */
function evaluateLowestPrice(
  product: ProductForBadgeEvaluationV2,
  allProducts: ProductForBadgeEvaluationV2[],
): BadgeEvaluationResult {
  const warnings: string[] = [];
  let confidence = 1.0;

  // 異常値チェック
  if (product.priceJPY <= 0 || product.priceJPY > 999999) {
    return {
      badge: "lowest-price",
      awarded: false,
      reason: `価格が異常値です: ¥${product.priceJPY}`,
      confidence: 0,
    };
  }

  // 複数ECサイトの価格データがある場合
  if (product.priceData && product.priceData.length > 0) {
    // 新鮮なデータのみフィルタリング
    const freshPrices = product.priceData.filter((p) =>
      isPriceDataFresh(p.fetchedAt),
    );

    if (freshPrices.length === 0) {
      warnings.push("価格データが48時間以上古いため、更新が必要です");
      confidence = 0.5;
    }

    // 信頼度重み付けを適用
    const weightedPrices = (
      freshPrices.length > 0 ? freshPrices : product.priceData
    ).map((p) => {
      const priceConfidence = p.confidence || 0.8;
      return {
        ...p,
        weightedAmount: p.amount / priceConfidence, // 信頼度が低いと実質価格が高く評価される
        originalAmount: p.amount,
      };
    });

    const minWeightedPrice = Math.min(
      ...weightedPrices.map((p) => p.weightedAmount),
    );
    const actualMinPrice = weightedPrices.find(
      (p) => p.weightedAmount === minWeightedPrice,
    );

    // 許容範囲（1円差）を考慮
    const tolerance = 1;
    const isLowest =
      Math.abs(
        (actualMinPrice?.originalAmount || product.priceJPY) - product.priceJPY,
      ) <= tolerance;

    if (isLowest) {
      return {
        badge: "lowest-price",
        awarded: true,
        reason: `複数ECサイトの中で最安値（¥${product.priceJPY}）${tolerance > 0 ? `±¥${tolerance}の範囲内` : ""}`,
        score: product.priceJPY,
        confidence: confidence * (actualMinPrice?.confidence || 0.8),
        details: {
          shopName: actualMinPrice?.shopName,
          source: actualMinPrice?.source,
          comparedCount: weightedPrices.length,
        },
      };
    }
  }

  // 全商品の中で最安値か判定
  const validPrices = allProducts
    .filter((p) => p.priceJPY > 0 && p.priceJPY < 999999)
    .map((p) => p.priceJPY);

  if (validPrices.length === 0) {
    return {
      badge: "lowest-price",
      awarded: false,
      reason: "比較可能な商品がありません",
      confidence: 0,
    };
  }

  const minPrice = Math.min(...validPrices);
  const tolerance = 1;
  const isLowest = Math.abs(product.priceJPY - minPrice) <= tolerance;

  return {
    badge: "lowest-price",
    awarded: isLowest,
    reason: isLowest
      ? `全${validPrices.length}商品中で最安値（¥${product.priceJPY}）`
      : `最安値¥${minPrice}より¥${product.priceJPY - minPrice}高い`,
    score: product.priceJPY,
    confidence: confidence,
  };
}

/**
 * 含有量S判定（改善版）
 */
function evaluateHighestContent(
  product: ProductForBadgeEvaluationV2,
  allProducts: ProductForBadgeEvaluationV2[],
): BadgeEvaluationResult {
  // 必須データチェック
  if (
    !product.ingredientAmount ||
    !product.servingsPerDay ||
    !product.ingredientId
  ) {
    return {
      badge: "highest-content",
      awarded: false,
      reason: "必要なデータ（成分量、摂取回数、成分ID）が不足しています",
      confidence: 0,
    };
  }

  // servingsPerDayの異常値チェック
  const servingsValidation = validateServingsPerDay(product.servingsPerDay);
  if (!servingsValidation.isValid) {
    return {
      badge: "highest-content",
      awarded: false,
      reason: servingsValidation.warning || "摂取回数が異常です",
      confidence: 0,
    };
  }

  // 単位換算（mgに統一）
  const unit = product.ingredientUnit || "mg";
  const converted = convertToMg(
    product.ingredientAmount,
    unit as any,
    product.ingredientName,
  );

  if (converted.confidence < 0.5) {
    return {
      badge: "highest-content",
      awarded: false,
      reason: converted.warning || "単位換算に失敗しました",
      confidence: 0,
    };
  }

  // 1日あたりの成分量を計算
  const productDailyAmount = converted.value * product.servingsPerDay;

  // 同じ成分を含む商品でフィルタリング（異常値を除外）
  const productsWithSameIngredient = allProducts.filter((p) => {
    if (p.ingredientId !== product.ingredientId) return false;
    if (!p.ingredientAmount || !p.servingsPerDay) return false;

    const validation = validateServingsPerDay(p.servingsPerDay);
    return validation.isValid;
  });

  if (productsWithSameIngredient.length === 0) {
    return {
      badge: "highest-content",
      awarded: false,
      reason: "同じ成分を含む比較可能な商品がありません",
      confidence: 0,
    };
  }

  // 各商品の1日量を計算（単位換算含む）
  const dailyAmounts = productsWithSameIngredient.map((p) => {
    const pUnit = p.ingredientUnit || "mg";
    const pConverted = convertToMg(
      p.ingredientAmount || 0,
      pUnit as any,
      p.ingredientName,
    );
    return {
      id: p._id,
      name: p.name,
      amount: pConverted.value * (p.servingsPerDay || 1),
      confidence: pConverted.confidence,
    };
  });

  const maxDailyAmount = Math.max(...dailyAmounts.map((d) => d.amount));
  const tolerance = 0.001; // 0.001mg未満の差は同一とみなす
  const isHighest = Math.abs(productDailyAmount - maxDailyAmount) < tolerance;

  return {
    badge: "highest-content",
    awarded: isHighest,
    reason: isHighest
      ? `${product.ingredientName || "成分"}の1日量${productDailyAmount.toFixed(1)}mgで最高含有量`
      : `最高含有量${maxDailyAmount.toFixed(1)}mgより${(maxDailyAmount - productDailyAmount).toFixed(1)}mg少ない`,
    score: productDailyAmount,
    confidence: converted.confidence,
    details: {
      comparedCount: productsWithSameIngredient.length,
      unit: unit,
      originalAmount: product.ingredientAmount,
    },
  };
}

/**
 * コスパS判定（改善版）
 */
function evaluateBestValue(
  product: ProductForBadgeEvaluationV2,
  allProducts: ProductForBadgeEvaluationV2[],
): BadgeEvaluationResult {
  if (
    !product.ingredientAmount ||
    !product.servingsPerContainer ||
    !product.ingredientId
  ) {
    return {
      badge: "best-value",
      awarded: false,
      reason: "コスパ計算に必要なデータが不足しています",
      confidence: 0,
    };
  }

  // 単位換算
  const unit = product.ingredientUnit || "mg";
  const converted = convertToMg(
    product.ingredientAmount,
    unit as any,
    product.ingredientName,
  );

  if (converted.confidence < 0.5) {
    return {
      badge: "best-value",
      awarded: false,
      reason: converted.warning || "単位換算に失敗しました",
      confidence: 0,
    };
  }

  // 総成分量とmgあたりコスト
  const totalMg = converted.value * product.servingsPerContainer;
  const costPerMg = product.priceJPY / totalMg;

  // 品質を考慮したコストスコア（第三者機関検査済みなら10%ボーナス）
  const qualityBonus = product.thirdPartyTested ? 0.9 : 1.0;
  const adjustedCostPerMg = costPerMg * qualityBonus;

  // 同じ成分を含む商品で比較
  const productsWithSameIngredient = allProducts.filter(
    (p) =>
      p.ingredientId === product.ingredientId &&
      p.ingredientAmount &&
      p.servingsPerContainer,
  );

  const costPerMgData = productsWithSameIngredient
    .map((p) => {
      const pUnit = p.ingredientUnit || "mg";
      const pConverted = convertToMg(
        p.ingredientAmount || 0,
        pUnit as any,
        p.ingredientName,
      );
      const pTotalMg = pConverted.value * (p.servingsPerContainer || 1);
      const pCostPerMg = pTotalMg > 0 ? p.priceJPY / pTotalMg : Infinity;
      const pQualityBonus = p.thirdPartyTested ? 0.9 : 1.0;

      return {
        id: p._id,
        name: p.name,
        adjustedCost: pCostPerMg * pQualityBonus,
        originalCost: pCostPerMg,
        confidence: pConverted.confidence,
      };
    })
    .filter((d) => d.adjustedCost < Infinity);

  if (costPerMgData.length === 0) {
    return {
      badge: "best-value",
      awarded: false,
      reason: "比較可能な商品がありません",
      confidence: 0,
    };
  }

  const minAdjustedCost = Math.min(...costPerMgData.map((d) => d.adjustedCost));
  const tolerance = 0.01; // 0.01円/mg未満の差は同一とみなす
  const isBestValue = Math.abs(adjustedCostPerMg - minAdjustedCost) < tolerance;

  return {
    badge: "best-value",
    awarded: isBestValue,
    reason: isBestValue
      ? `1mgあたり¥${adjustedCostPerMg.toFixed(3)}で最高のコスパ${product.thirdPartyTested ? "（品質ボーナス適用）" : ""}`
      : `最安コスト¥${minAdjustedCost.toFixed(3)}/mgより¥${(adjustedCostPerMg - minAdjustedCost).toFixed(3)}高い`,
    score: adjustedCostPerMg,
    confidence: converted.confidence,
    details: {
      comparedCount: costPerMgData.length,
      qualityBonus: product.thirdPartyTested,
      totalMg: totalMg,
    },
  };
}

/**
 * エビデンスS判定（改善版）
 */
function evaluateEvidence(
  product: ProductForBadgeEvaluationV2,
): BadgeEvaluationResult {
  if (!product.evidenceLevel) {
    return {
      badge: "evidence-s",
      awarded: false,
      reason: "エビデンスレベルが設定されていません",
      confidence: 0,
    };
  }

  const isEvidenceS = product.evidenceLevel === "S";

  // 動的スコア計算（将来の拡張用）
  const baseScores: Record<string, number> = {
    S: 100,
    A: 80,
    B: 60,
    C: 40,
    D: 20,
  };

  const score = baseScores[product.evidenceLevel] || 0;

  return {
    badge: "evidence-s",
    awarded: isEvidenceS,
    reason: isEvidenceS
      ? "大規模RCTやメタ解析による最高レベルの科学的根拠（Sランク）"
      : `エビデンスレベル${product.evidenceLevel}（Sランク未満）`,
    score: score,
    confidence: 1.0,
    details: {
      level: product.evidenceLevel,
    },
  };
}

/**
 * 安全性S判定（改善版）
 */
function evaluateSafety(
  product: ProductForBadgeEvaluationV2,
): BadgeEvaluationResult {
  // 安全性スコアの透明な計算
  let calculatedScore = 100;
  const deductions: string[] = [];

  // 禁忌タグによる減点
  if (product.contraindicationCount) {
    const criticalDeduction = Math.min(product.contraindicationCount * 20, 60);
    calculatedScore -= criticalDeduction;
    deductions.push(
      `禁忌${product.contraindicationCount}件: -${criticalDeduction}点`,
    );
  }

  // 警告事項による減点
  if (product.warnings && product.warnings.length > 0) {
    const warningDeduction = Math.min(product.warnings.length * 10, 30);
    calculatedScore -= warningDeduction;
    deductions.push(`警告${product.warnings.length}件: -${warningDeduction}点`);
  }

  // 第三者機関検査による加点
  if (product.thirdPartyTested) {
    calculatedScore += 10;
    deductions.push("第三者機関検査済み: +10点");
  }

  // 既存のスコアと計算スコアの比較（既存スコアを優先）
  const finalScore =
    product.safetyScore !== undefined ? product.safetyScore : calculatedScore;
  const isHighSafety = finalScore >= 90;

  return {
    badge: "high-safety",
    awarded: isHighSafety,
    reason: isHighSafety
      ? `安全性スコア${finalScore}点で高安全性認定${deductions.length > 0 ? `（${deductions.join("、")}）` : ""}`
      : `安全性スコア${finalScore}点（90点未満）${deductions.length > 0 ? ` - ${deductions.join("、")}` : ""}`,
    score: finalScore,
    confidence: 1.0,
    details: {
      calculatedScore: calculatedScore,
      providedScore: product.safetyScore,
      deductions: deductions,
    },
  };
}

/**
 * ハーモニー指数の計算
 */
function calculateHarmonyIndex(evaluations: BadgeEvaluationResult[]): number {
  const scores = evaluations
    .filter((e) => e.score !== undefined)
    .map((e) => {
      // スコアを0-100の範囲に正規化
      switch (e.badge) {
        case "lowest-price":
          // 価格は低いほど良い（逆スケール）
          return Math.max(0, Math.min(100, 100 - e.score! / 100));
        case "best-value":
          // コスパも低いほど良い（逆スケール）
          return Math.max(0, Math.min(100, 100 - e.score! * 100));
        default:
          // その他はそのまま使用
          return Math.max(0, Math.min(100, e.score!));
      }
    });

  if (scores.length === 0) return 0;

  // 平均と標準偏差を計算
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
    scores.length;
  const stdDev = Math.sqrt(variance);

  // ハーモニー指数：標準偏差が小さいほど高い（0-1の範囲）
  const harmonyIndex = 1 - stdDev / 100;

  return Math.max(0, Math.min(1, harmonyIndex));
}

/**
 * 包括的なバッジ評価（改善版）
 */
export function evaluateBadgesV2(
  product: ProductForBadgeEvaluationV2,
  allProducts: ProductForBadgeEvaluationV2[],
): ComprehensiveBadgeResult {
  const evaluations: BadgeEvaluationResult[] = [];
  const warnings: string[] = [];

  // 各評価を実行
  evaluations.push(evaluateLowestPrice(product, allProducts));
  evaluations.push(evaluateHighestContent(product, allProducts));
  evaluations.push(evaluateBestValue(product, allProducts));
  evaluations.push(evaluateEvidence(product));
  evaluations.push(evaluateSafety(product));

  // 授与されたバッジを抽出
  const awardedBadges = evaluations
    .filter((e) => e.awarded)
    .map((e) => e.badge);

  // 警告を収集
  evaluations.forEach((e) => {
    if (e.confidence < 0.7 && e.awarded) {
      warnings.push(
        `${e.badge}の判定信頼度が低い（${(e.confidence * 100).toFixed(0)}%）`,
      );
    }
  });

  // 全体の信頼度（最小値）
  const overallConfidence = Math.min(...evaluations.map((e) => e.confidence));

  // ハーモニー指数を計算
  const harmonyIndex = calculateHarmonyIndex(
    evaluations.filter((e) => e.awarded),
  );

  // 5冠達成判定
  const isPerfectSupplement = awardedBadges.length === 5 && harmonyIndex > 0.7;

  return {
    badges: awardedBadges,
    evaluations,
    harmonyIndex,
    isPerfectSupplement,
    overallConfidence,
    warnings,
  };
}

/**
 * バッジの表示情報を取得
 */
export function getBadgeInfoV2(badgeType: BadgeType): Badge {
  return BADGE_DEFINITIONS[badgeType];
}

/**
 * 評価結果のサマリーを生成
 */
export function generateEvaluationSummary(
  result: ComprehensiveBadgeResult,
): string {
  const badgeCount = result.badges.length;

  if (result.isPerfectSupplement) {
    return `🌟 完璧なサプリメント！5つすべての称号を獲得し、バランス指数${(result.harmonyIndex * 100).toFixed(0)}%を達成しました。`;
  }

  if (badgeCount === 0) {
    return "称号を獲得できませんでした。商品データの見直しが必要です。";
  }

  const badgeLabels = result.badges
    .map((b) => BADGE_DEFINITIONS[b].label)
    .join("、");
  return `${badgeCount}個の称号を獲得: ${badgeLabels}（信頼度: ${(result.overallConfidence * 100).toFixed(0)}%）`;
}
