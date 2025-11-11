/**
 * ランク整合性チェッカー
 *
 * データの不整合や誤表記を検出・修正するシステム
 */

import type { TierRank } from "./tier-colors";

/**
 * 整合性チェックの結果
 */
export interface IntegrityCheckResult {
  isValid: boolean;
  errors: IntegrityError[];
  warnings: IntegrityWarning[];
  suggestions: IntegritySuggestion[];
  confidence: number;
}

export interface IntegrityError {
  type:
    | "RANK_MISMATCH"
    | "IMPOSSIBLE_COMBINATION"
    | "MISSING_DATA"
    | "INVALID_VALUE";
  field: string;
  message: string;
  currentValue: any;
  expectedValue?: any;
  severity: "critical" | "high" | "medium";
}

export interface IntegrityWarning {
  type: "OUTDATED" | "SUSPICIOUS" | "INCOMPLETE";
  field: string;
  message: string;
  recommendation: string;
}

export interface IntegritySuggestion {
  field: string;
  currentValue: any;
  suggestedValue: any;
  reason: string;
  confidence: number;
}

/**
 * 商品データの構造
 */
interface ProductData {
  _id: string;
  name: string;
  priceJPY: number;

  // 複数の場所に存在するランク情報
  tierRatings?: {
    priceRank?: TierRank;
    costEffectivenessRank?: TierRank;
    contentRank?: TierRank;
    evidenceRank?: TierRank;
    safetyRank?: TierRank;
    overallRank?: TierRank;
  };

  // 旧形式のランク（後方互換性）
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";

  // スコア情報
  scores?: {
    safety?: number;
    evidence?: number;
    costEffectiveness?: number;
    overall?: number;
  };

  // 実データ
  ingredientAmount?: number;
  servingsPerDay?: number;
  servingsPerContainer?: number;
  references?: any[];
  warnings?: string[];
  thirdPartyTested?: boolean;

  // メタデータ
  _updatedAt?: string;
  lastCalculatedAt?: string;
}

/**
 * ランクの妥当性をチェック
 */
function isValidRank(rank: any): rank is TierRank {
  return ["S+", "S", "A", "B", "C", "D"].includes(rank);
}

/**
 * スコアからランクを推定
 */
function estimateRankFromScore(score: number): TierRank {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

/**
 * ランクからスコア範囲を推定
 */
function getExpectedScoreRange(rank: TierRank): { min: number; max: number } {
  switch (rank) {
    case "S+":
      return { min: 95, max: 100 };
    case "S":
      return { min: 90, max: 100 };
    case "A":
      return { min: 80, max: 89 };
    case "B":
      return { min: 70, max: 79 };
    case "C":
      return { min: 60, max: 69 };
    case "D":
      return { min: 0, max: 59 };
    default:
      return { min: 0, max: 100 };
  }
}

/**
 * 整合性チェックを実行
 */
export function checkRankIntegrity(product: ProductData): IntegrityCheckResult {
  const errors: IntegrityError[] = [];
  const warnings: IntegrityWarning[] = [];
  const suggestions: IntegritySuggestion[] = [];
  let confidence = 1.0;

  // 1. 必須フィールドの存在チェック
  if (!product.tierRatings) {
    errors.push({
      type: "MISSING_DATA",
      field: "tierRatings",
      message: "Tierランク情報が設定されていません",
      currentValue: undefined,
      severity: "critical",
    });
    confidence *= 0.5;
  }

  // 2. 各ランクの妥当性チェック
  if (product.tierRatings) {
    const ranks = [
      { field: "priceRank", value: product.tierRatings.priceRank },
      {
        field: "costEffectivenessRank",
        value: product.tierRatings.costEffectivenessRank,
      },
      { field: "contentRank", value: product.tierRatings.contentRank },
      { field: "evidenceRank", value: product.tierRatings.evidenceRank },
      { field: "safetyRank", value: product.tierRatings.safetyRank },
      { field: "overallRank", value: product.tierRatings.overallRank },
    ];

    for (const { field, value } of ranks) {
      if (!value) {
        errors.push({
          type: "MISSING_DATA",
          field: `tierRatings.${field}`,
          message: `${field}が未設定です`,
          currentValue: undefined,
          severity: "high",
        });
        confidence *= 0.9;
      } else if (!isValidRank(value)) {
        errors.push({
          type: "INVALID_VALUE",
          field: `tierRatings.${field}`,
          message: `無効なランク値: ${value}`,
          currentValue: value,
          expectedValue: "S, A, B, C, D のいずれか",
          severity: "critical",
        });
        confidence *= 0.7;
      }
    }
  }

  // 3. 旧形式と新形式の整合性チェック
  if (product.evidenceLevel && product.tierRatings?.evidenceRank) {
    if (product.evidenceLevel !== product.tierRatings.evidenceRank) {
      errors.push({
        type: "RANK_MISMATCH",
        field: "evidenceLevel vs tierRatings.evidenceRank",
        message: "旧形式と新形式のエビデンスランクが一致しません",
        currentValue: `旧: ${product.evidenceLevel}, 新: ${product.tierRatings.evidenceRank}`,
        expectedValue: "両者が一致",
        severity: "high",
      });

      // 新形式を推奨
      suggestions.push({
        field: "evidenceLevel",
        currentValue: product.evidenceLevel,
        suggestedValue: product.tierRatings.evidenceRank,
        reason: "新形式（tierRatings）を優先することを推奨",
        confidence: 0.9,
      });
    }
  }

  // 4. スコアとランクの整合性チェック
  if (product.scores && product.tierRatings) {
    // 安全性スコアとランクの整合性
    if (product.scores.safety !== undefined && product.tierRatings.safetyRank) {
      const expectedRange = getExpectedScoreRange(
        product.tierRatings.safetyRank,
      );
      if (
        product.scores.safety < expectedRange.min ||
        product.scores.safety > expectedRange.max
      ) {
        warnings.push({
          type: "SUSPICIOUS",
          field: "scores.safety vs tierRatings.safetyRank",
          message: `安全性スコア(${product.scores.safety})とランク(${product.tierRatings.safetyRank})が不整合`,
          recommendation: `スコア${product.scores.safety}の場合、ランクは${estimateRankFromScore(product.scores.safety)}が適切`,
        });
        confidence *= 0.95;
      }
    }

    // エビデンススコアとランクの整合性
    if (
      product.scores.evidence !== undefined &&
      product.tierRatings.evidenceRank
    ) {
      const expectedRange = getExpectedScoreRange(
        product.tierRatings.evidenceRank,
      );
      if (
        product.scores.evidence < expectedRange.min ||
        product.scores.evidence > expectedRange.max
      ) {
        warnings.push({
          type: "SUSPICIOUS",
          field: "scores.evidence vs tierRatings.evidenceRank",
          message: `エビデンススコア(${product.scores.evidence})とランク(${product.tierRatings.evidenceRank})が不整合`,
          recommendation: `スコア${product.scores.evidence}の場合、ランクは${estimateRankFromScore(product.scores.evidence)}が適切`,
        });
        confidence *= 0.95;
      }
    }
  }

  // 5. 不可能な組み合わせのチェック
  if (product.tierRatings) {
    const tr = product.tierRatings;

    // S+ランクは5冠達成時のみ
    if (tr.overallRank === "S+") {
      const allS =
        tr.priceRank === "S" &&
        tr.costEffectivenessRank === "S" &&
        tr.contentRank === "S" &&
        tr.evidenceRank === "S" &&
        tr.safetyRank === "S";

      if (!allS) {
        errors.push({
          type: "IMPOSSIBLE_COMBINATION",
          field: "tierRatings.overallRank",
          message: "S+ランクは5つすべてがSランクの場合のみ付与可能",
          currentValue: tr,
          severity: "critical",
        });
        confidence *= 0.5;
      }
    }

    // 価格とコスパの矛盾チェック
    if (tr.priceRank === "D" && tr.costEffectivenessRank === "S") {
      warnings.push({
        type: "SUSPICIOUS",
        field: "tierRatings",
        message: "価格Dランクでコスパがランクは通常ありえません",
        recommendation: "データの再計算を推奨",
      });
      confidence *= 0.9;
    }
  }

  // 6. データの鮮度チェック
  if (product._updatedAt && product.lastCalculatedAt) {
    const updatedAt = new Date(product._updatedAt);
    const calculatedAt = new Date(product.lastCalculatedAt);
    const daysDiff =
      Math.abs(updatedAt.getTime() - calculatedAt.getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      warnings.push({
        type: "OUTDATED",
        field: "lastCalculatedAt",
        message: `ランクが${Math.floor(daysDiff)}日前に計算されています`,
        recommendation: "ランクの再計算を実行してください",
      });
      confidence *= 0.95;
    }
  }

  // 7. 実データからの推定値との比較
  if (
    product.priceJPY &&
    product.ingredientAmount &&
    product.servingsPerContainer
  ) {
    const costPerMg =
      product.priceJPY /
      (product.ingredientAmount * product.servingsPerContainer);

    // コスパが極端に良い/悪い場合の警告
    if (costPerMg < 0.001) {
      warnings.push({
        type: "SUSPICIOUS",
        field: "calculated costPerMg",
        message: `計算されたmgあたりコスト(¥${costPerMg.toFixed(6)})が異常に低い`,
        recommendation: "データの入力ミスがないか確認してください",
      });
      confidence *= 0.8;
    } else if (costPerMg > 10) {
      warnings.push({
        type: "SUSPICIOUS",
        field: "calculated costPerMg",
        message: `計算されたmgあたりコスト(¥${costPerMg.toFixed(2)})が異常に高い`,
        recommendation: "データの入力ミスがないか確認してください",
      });
      confidence *= 0.8;
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    suggestions,
    confidence,
  };
}

/**
 * 複数商品の整合性を一括チェック
 */
export function batchCheckIntegrity(
  products: ProductData[],
): Map<string, IntegrityCheckResult> {
  const results = new Map<string, IntegrityCheckResult>();

  for (const product of products) {
    results.set(product._id, checkRankIntegrity(product));
  }

  return results;
}

/**
 * 整合性レポートを生成
 */
export function generateIntegrityReport(
  results: Map<string, IntegrityCheckResult>,
  products: ProductData[],
): string {
  let report = "# ランク整合性チェックレポート\n\n";

  const totalProducts = results.size;
  let errorCount = 0;
  let warningCount = 0;
  let validCount = 0;

  const criticalErrors: Array<{ productName: string; error: IntegrityError }> =
    [];

  results.forEach((result, productId) => {
    const product = products.find((p) => p._id === productId);

    if (result.isValid) {
      validCount++;
    }

    errorCount += result.errors.length;
    warningCount += result.warnings.length;

    result.errors.forEach((error) => {
      if (error.severity === "critical") {
        criticalErrors.push({
          productName: product?.name || "Unknown",
          error,
        });
      }
    });
  });

  report += `## 概要\n`;
  report += `- 総商品数: ${totalProducts}\n`;
  report += `- 正常: ${validCount} (${((validCount / totalProducts) * 100).toFixed(1)}%)\n`;
  report += `- エラー総数: ${errorCount}\n`;
  report += `- 警告総数: ${warningCount}\n`;
  report += `- 重大エラー: ${criticalErrors.length}\n\n`;

  if (criticalErrors.length > 0) {
    report += `## ⚠️ 重大エラー（要対応）\n\n`;
    criticalErrors.forEach(({ productName, error }) => {
      report += `### ${productName}\n`;
      report += `- **フィールド**: ${error.field}\n`;
      report += `- **エラー**: ${error.message}\n`;
      report += `- **現在値**: ${JSON.stringify(error.currentValue)}\n`;
      if (error.expectedValue) {
        report += `- **期待値**: ${JSON.stringify(error.expectedValue)}\n`;
      }
      report += "\n";
    });
  }

  report += `## 推奨アクション\n`;
  report += `1. 重大エラーのある商品のデータを手動で修正\n`;
  report += `2. auto-calculate-tier-ranksスクリプトを実行してランクを再計算\n`;
  report += `3. 整合性チェックを再実行して確認\n`;

  return report;
}

/**
 * 自動修正を実行
 */
export async function autoFixIntegrityIssues(
  product: ProductData,
  checkResult: IntegrityCheckResult,
  options: {
    fixMismatches?: boolean;
    adoptSuggestions?: boolean;
    updateOutdated?: boolean;
  } = {},
): Promise<Partial<ProductData>> {
  const fixes: Partial<ProductData> = {};

  // 提案の採用
  if (options.adoptSuggestions) {
    checkResult.suggestions.forEach((suggestion) => {
      if (suggestion.confidence >= 0.8) {
        // ネストされたプロパティの場合の処理
        if (suggestion.field.includes(".")) {
          const parts = suggestion.field.split(".");
          let target: any = fixes;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!target[parts[i]]) {
              target[parts[i]] = {};
            }
            target = target[parts[i]];
          }
          target[parts[parts.length - 1]] = suggestion.suggestedValue;
        } else {
          (fixes as any)[suggestion.field] = suggestion.suggestedValue;
        }
      }
    });
  }

  // 不整合の修正
  if (options.fixMismatches) {
    checkResult.errors.forEach((error) => {
      if (error.type === "RANK_MISMATCH" && error.expectedValue) {
        // 期待値で上書き
        const field = error.field.split(" vs ")[0]; // 最初のフィールドを修正
        (fixes as any)[field] = error.expectedValue;
      }
    });
  }

  // 更新日時の記録
  if (options.updateOutdated) {
    fixes.lastCalculatedAt = new Date().toISOString();
  }

  return fixes;
}
