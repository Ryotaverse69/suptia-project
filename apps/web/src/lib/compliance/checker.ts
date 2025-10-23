/**
 * 薬機法コンプライアンスチェッカー
 *
 * テキスト内の薬機法違反表現を検出し、代替表現を提案します
 */

import {
  COMPLIANCE_RULES,
  CATEGORY_SEVERITY_SCORE,
  SEVERITY_SCORE,
  type ComplianceRule,
  type ComplianceCategory,
  type ComplianceSeverity,
} from "./rules";

export interface ComplianceViolation {
  originalText: string; // 違反している元のテキスト
  suggestedText: string; // 提案する代替テキスト
  pattern: string; // マッチしたパターン
  category: ComplianceCategory; // 違反カテゴリ
  severity: ComplianceSeverity; // 重大度
  description?: string; // 違反の説明
  position?: {
    start: number; // 文字列内の開始位置
    end: number; // 文字列内の終了位置
  };
}

export interface ComplianceResult {
  hasViolations: boolean; // 違反があるかどうか
  violations: ComplianceViolation[]; // 違反のリスト
  score: number; // コンプライアンススコア（0-100、100が完全準拠）
  riskLevel: "safe" | "low" | "medium" | "high" | "critical"; // リスクレベル
  summary: {
    critical: number; // 重大違反の数
    high: number; // 高リスク違反の数
    medium: number; // 中リスク違反の数
    low: number; // 低リスク違反の数
  };
}

/**
 * テキストの薬機法コンプライアンスをチェック
 */
export function checkCompliance(text: string): ComplianceResult {
  // 入力チェック
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      hasViolations: false,
      violations: [],
      score: 100,
      riskLevel: "safe",
      summary: { critical: 0, high: 0, medium: 0, low: 0 },
    };
  }

  const violations: ComplianceViolation[] = [];

  // 各ルールに対してチェック
  for (const rule of COMPLIANCE_RULES) {
    const regex = new RegExp(rule.pattern, "gi");
    let match: RegExpExecArray | null;

    // 同じパターンが複数回出現する場合も検出
    while ((match = regex.exec(text)) !== null) {
      violations.push({
        originalText: match[0],
        suggestedText: rule.suggest,
        pattern: rule.pattern,
        category: rule.category,
        severity: rule.severity,
        description: rule.description,
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }
  }

  // 重大度別の集計
  const summary = {
    critical: violations.filter((v) => v.severity === "critical").length,
    high: violations.filter((v) => v.severity === "high").length,
    medium: violations.filter((v) => v.severity === "medium").length,
    low: violations.filter((v) => v.severity === "low").length,
  };

  // コンプライアンススコアを計算
  const score = calculateComplianceScore(violations, text.length);

  // リスクレベルを判定
  const riskLevel = determineRiskLevel(summary, score);

  return {
    hasViolations: violations.length > 0,
    violations,
    score,
    riskLevel,
    summary,
  };
}

/**
 * コンプライアンススコアを計算（0-100）
 * 100が完全準拠、0が最悪
 */
function calculateComplianceScore(
  violations: ComplianceViolation[],
  textLength: number,
): number {
  if (violations.length === 0) {
    return 100;
  }

  // 違反による減点を計算
  let totalPenalty = 0;

  for (const violation of violations) {
    // カテゴリと重大度による基本ペナルティ
    const categoryPenalty = CATEGORY_SEVERITY_SCORE[violation.category];
    const severityPenalty = SEVERITY_SCORE[violation.severity];

    // 複合ペナルティ（カテゴリと重大度の平均）
    const penalty = (categoryPenalty + severityPenalty) / 2;

    totalPenalty += penalty;
  }

  // テキスト長に対する相対的なペナルティを調整
  // 短いテキストほど違反の影響が大きい
  const lengthFactor = Math.min(textLength / 500, 1.0);
  const adjustedPenalty = totalPenalty / lengthFactor;

  // スコアを計算（最低0、最高100）
  const score = Math.max(0, 100 - adjustedPenalty);

  return Math.round(score);
}

/**
 * リスクレベルを判定
 */
function determineRiskLevel(
  summary: ComplianceResult["summary"],
  score: number,
): ComplianceResult["riskLevel"] {
  // 重大違反が1つでもあれば critical
  if (summary.critical > 0) {
    return "critical";
  }

  // スコアベースの判定
  if (score >= 90) {
    return "safe";
  } else if (score >= 70) {
    return "low";
  } else if (score >= 50) {
    return "medium";
  } else {
    return "high";
  }
}

/**
 * テキスト内の違反箇所をハイライト
 * HTML形式で返す
 */
export function highlightViolations(
  text: string,
  violations: ComplianceViolation[],
): string {
  if (violations.length === 0) {
    return text;
  }

  // 位置情報でソート（後ろから処理するため降順）
  const sortedViolations = [...violations].sort((a, b) => {
    if (!a.position || !b.position) return 0;
    return b.position.start - a.position.start;
  });

  let result = text;

  // 後ろから置換していく（位置がずれないように）
  for (const violation of sortedViolations) {
    if (!violation.position) continue;

    const before = result.substring(0, violation.position.start);
    const highlighted = result.substring(
      violation.position.start,
      violation.position.end,
    );
    const after = result.substring(violation.position.end);

    // 重大度に応じたクラス名
    const severityClass = `compliance-violation-${violation.severity}`;

    result = `${before}<span class="${severityClass}" data-suggestion="${violation.suggestedText}" title="${violation.description || ""}">${highlighted}</span>${after}`;
  }

  return result;
}

/**
 * 違反箇所を自動修正
 */
export function autoFixViolations(
  text: string,
  violations: ComplianceViolation[],
): string {
  if (violations.length === 0) {
    return text;
  }

  // 位置情報でソート（後ろから処理）
  const sortedViolations = [...violations].sort((a, b) => {
    if (!a.position || !b.position) return 0;
    return b.position.start - a.position.start;
  });

  let result = text;

  for (const violation of sortedViolations) {
    if (!violation.position) continue;

    const before = result.substring(0, violation.position.start);
    const after = result.substring(violation.position.end);

    result = `${before}${violation.suggestedText}${after}`;
  }

  return result;
}

/**
 * カテゴリ別の違反数を集計
 */
export function summarizeByCategory(
  violations: ComplianceViolation[],
): Record<ComplianceCategory, number> {
  const summary: Partial<Record<ComplianceCategory, number>> = {};

  for (const violation of violations) {
    summary[violation.category] = (summary[violation.category] || 0) + 1;
  }

  return summary as Record<ComplianceCategory, number>;
}

/**
 * コンプライアンスレポートを生成
 */
export function generateComplianceReport(result: ComplianceResult): string {
  const lines: string[] = [];

  lines.push("=== 薬機法コンプライアンスレポート ===\n");
  lines.push(`スコア: ${result.score}/100`);
  lines.push(`リスクレベル: ${result.riskLevel}\n`);

  if (result.violations.length === 0) {
    lines.push("✅ 違反は検出されませんでした。");
    return lines.join("\n");
  }

  lines.push(`違反数: ${result.violations.length}件`);
  lines.push(`  - 重大: ${result.summary.critical}件`);
  lines.push(`  - 高: ${result.summary.high}件`);
  lines.push(`  - 中: ${result.summary.medium}件`);
  lines.push(`  - 低: ${result.summary.low}件\n`);

  lines.push("=== 検出された違反 ===\n");

  for (let i = 0; i < result.violations.length; i++) {
    const v = result.violations[i];
    lines.push(`${i + 1}. [${v.severity.toUpperCase()}] ${v.originalText}`);
    lines.push(`   カテゴリ: ${v.category}`);
    lines.push(`   提案: ${v.suggestedText}`);
    if (v.description) {
      lines.push(`   説明: ${v.description}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
