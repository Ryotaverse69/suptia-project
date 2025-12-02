/**
 * 4法対応コンプライアンスチェッカー
 *
 * 対応法令:
 * 1. 薬機法（医薬品医療機器等法）
 * 2. 健康増進法
 * 3. 食品表示法
 * 4. 食品衛生法
 *
 * テキスト内の法令違反表現を検出し、代替表現を提案します
 */

import {
  COMPLIANCE_RULES,
  CATEGORY_SEVERITY_SCORE,
  SEVERITY_SCORE,
  LAW_NAMES,
  CATEGORY_NAMES,
  LAW_IMPORTANCE,
  getRulesByLaw,
  type ComplianceRule,
  type ComplianceCategory,
  type ComplianceSeverity,
  type ComplianceLaw,
} from "./rules";

export interface ComplianceViolation {
  originalText: string; // 違反している元のテキスト
  suggestedText: string; // 提案する代替テキスト
  pattern: string; // マッチしたパターン
  category: ComplianceCategory; // 違反カテゴリ
  categoryName: string; // 違反カテゴリの日本語名
  severity: ComplianceSeverity; // 重大度
  description?: string; // 違反の説明
  law: ComplianceLaw; // 関連法令
  lawName: string; // 法令の日本語名
  lawArticle?: string; // 根拠条文
  position?: {
    start: number; // 文字列内の開始位置
    end: number; // 文字列内の終了位置
  };
}

export interface LawSummary {
  law: ComplianceLaw;
  lawName: string;
  totalViolations: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  score: number; // この法令のコンプライアンススコア（0-100）
  riskLevel: "safe" | "low" | "medium" | "high" | "critical";
}

export interface ComplianceResult {
  hasViolations: boolean; // 違反があるかどうか
  violations: ComplianceViolation[]; // 違反のリスト
  score: number; // 総合コンプライアンススコア（0-100、100が完全準拠）
  riskLevel: "safe" | "low" | "medium" | "high" | "critical"; // 総合リスクレベル
  summary: {
    critical: number; // 重大違反の数
    high: number; // 高リスク違反の数
    medium: number; // 中リスク違反の数
    low: number; // 低リスク違反の数
  };
  byLaw: LawSummary[]; // 法令別の集計
  byCategory: Record<ComplianceCategory, number>; // カテゴリ別の違反数
}

/**
 * チェックオプション
 */
export interface CheckOptions {
  laws?: ComplianceLaw[]; // チェック対象の法令（指定しない場合は全法令）
  ignoreCategories?: ComplianceCategory[]; // 無視するカテゴリ
  minSeverity?: ComplianceSeverity; // 最低重大度（これ以上のみ報告）
}

/**
 * テキストの法令コンプライアンスをチェック
 */
export function checkCompliance(
  text: string,
  options?: CheckOptions,
): ComplianceResult {
  // 入力チェック
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return createEmptyResult();
  }

  // 使用するルールをフィルタリング
  let rules = COMPLIANCE_RULES;

  if (options?.laws && options.laws.length > 0) {
    rules = rules.filter((rule) => options.laws!.includes(rule.law));
  }

  if (options?.ignoreCategories && options.ignoreCategories.length > 0) {
    rules = rules.filter(
      (rule) => !options.ignoreCategories!.includes(rule.category),
    );
  }

  if (options?.minSeverity) {
    const severityOrder: ComplianceSeverity[] = [
      "low",
      "medium",
      "high",
      "critical",
    ];
    const minIndex = severityOrder.indexOf(options.minSeverity);
    rules = rules.filter(
      (rule) => severityOrder.indexOf(rule.severity) >= minIndex,
    );
  }

  const violations: ComplianceViolation[] = [];

  // 各ルールに対してチェック
  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, "gi");
    let match: RegExpExecArray | null;

    // 同じパターンが複数回出現する場合も検出
    while ((match = regex.exec(text)) !== null) {
      violations.push({
        originalText: match[0],
        suggestedText: rule.suggest,
        pattern: rule.pattern,
        category: rule.category,
        categoryName: CATEGORY_NAMES[rule.category],
        severity: rule.severity,
        description: rule.description,
        law: rule.law,
        lawName: LAW_NAMES[rule.law],
        lawArticle: rule.lawArticle,
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

  // 法令別の集計
  const byLaw = calculateLawSummaries(violations, text.length);

  // カテゴリ別の集計
  const byCategory = summarizeByCategory(violations);

  // 総合コンプライアンススコアを計算
  const score = calculateComplianceScore(violations, text.length);

  // 総合リスクレベルを判定
  const riskLevel = determineRiskLevel(summary, score);

  return {
    hasViolations: violations.length > 0,
    violations,
    score,
    riskLevel,
    summary,
    byLaw,
    byCategory,
  };
}

/**
 * 特定の法令のみをチェック
 */
export function checkByLaw(text: string, law: ComplianceLaw): ComplianceResult {
  return checkCompliance(text, { laws: [law] });
}

/**
 * 薬機法のみをチェック
 */
export function checkPharmaceuticalAffairs(text: string): ComplianceResult {
  return checkByLaw(text, "pharmaceutical_affairs");
}

/**
 * 健康増進法のみをチェック
 */
export function checkHealthPromotion(text: string): ComplianceResult {
  return checkByLaw(text, "health_promotion");
}

/**
 * 食品表示法のみをチェック
 */
export function checkFoodLabeling(text: string): ComplianceResult {
  return checkByLaw(text, "food_labeling");
}

/**
 * 食品衛生法のみをチェック
 */
export function checkFoodSanitation(text: string): ComplianceResult {
  return checkByLaw(text, "food_sanitation");
}

/**
 * 空の結果を作成
 */
function createEmptyResult(): ComplianceResult {
  return {
    hasViolations: false,
    violations: [],
    score: 100,
    riskLevel: "safe",
    summary: { critical: 0, high: 0, medium: 0, low: 0 },
    byLaw: [
      {
        law: "pharmaceutical_affairs",
        lawName: LAW_NAMES.pharmaceutical_affairs,
        totalViolations: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        score: 100,
        riskLevel: "safe",
      },
      {
        law: "health_promotion",
        lawName: LAW_NAMES.health_promotion,
        totalViolations: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        score: 100,
        riskLevel: "safe",
      },
      {
        law: "food_labeling",
        lawName: LAW_NAMES.food_labeling,
        totalViolations: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        score: 100,
        riskLevel: "safe",
      },
      {
        law: "food_sanitation",
        lawName: LAW_NAMES.food_sanitation,
        totalViolations: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        score: 100,
        riskLevel: "safe",
      },
    ],
    byCategory: {} as Record<ComplianceCategory, number>,
  };
}

/**
 * 法令別の集計を計算
 */
function calculateLawSummaries(
  violations: ComplianceViolation[],
  textLength: number,
): LawSummary[] {
  const laws: ComplianceLaw[] = [
    "pharmaceutical_affairs",
    "health_promotion",
    "food_labeling",
    "food_sanitation",
  ];

  return laws.map((law) => {
    const lawViolations = violations.filter((v) => v.law === law);
    const summary = {
      critical: lawViolations.filter((v) => v.severity === "critical").length,
      high: lawViolations.filter((v) => v.severity === "high").length,
      medium: lawViolations.filter((v) => v.severity === "medium").length,
      low: lawViolations.filter((v) => v.severity === "low").length,
    };
    const score = calculateComplianceScore(lawViolations, textLength);
    const riskLevel = determineRiskLevel(summary, score);

    return {
      law,
      lawName: LAW_NAMES[law],
      totalViolations: lawViolations.length,
      ...summary,
      score,
      riskLevel,
    };
  });
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
    const lawPenalty = LAW_IMPORTANCE[violation.law];

    // 複合ペナルティ（カテゴリ、重大度、法令の重要度を考慮）
    const penalty = (categoryPenalty + severityPenalty + lawPenalty) / 3;

    totalPenalty += penalty;
  }

  // テキスト長に対する相対的なペナルティを調整
  // 短いテキストほど違反の影響が大きい
  const lengthFactor = Math.min(textLength / 500, 1.0);
  const adjustedPenalty = totalPenalty / Math.max(lengthFactor, 0.5);

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

  // 高リスク違反が3つ以上なら high
  if (summary.high >= 3) {
    return "high";
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
    const lawClass = `compliance-law-${violation.law}`;

    result = `${before}<span class="${severityClass} ${lawClass}" data-suggestion="${violation.suggestedText}" data-law="${violation.lawName}" data-article="${violation.lawArticle || ""}" title="${violation.description || ""}">${highlighted}</span>${after}`;
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

  lines.push("╔════════════════════════════════════════════════════════════╗");
  lines.push("║           法令コンプライアンスレポート                      ║");
  lines.push(
    "╚════════════════════════════════════════════════════════════╝\n",
  );

  lines.push(`📊 総合スコア: ${result.score}/100`);
  lines.push(`⚠️  リスクレベル: ${getRiskLevelLabel(result.riskLevel)}\n`);

  if (result.violations.length === 0) {
    lines.push("✅ 違反は検出されませんでした。\n");
    lines.push("すべての法令に準拠しています。");
    return lines.join("\n");
  }

  lines.push(`📝 検出された違反: ${result.violations.length}件`);
  lines.push(`   ├─ 🔴 重大(Critical): ${result.summary.critical}件`);
  lines.push(`   ├─ 🟠 高(High): ${result.summary.high}件`);
  lines.push(`   ├─ 🟡 中(Medium): ${result.summary.medium}件`);
  lines.push(`   └─ 🟢 低(Low): ${result.summary.low}件\n`);

  // 法令別の集計
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("📜 法令別の状況\n");

  for (const lawSummary of result.byLaw) {
    const statusIcon = getStatusIcon(lawSummary.riskLevel);
    lines.push(`${statusIcon} ${lawSummary.lawName}`);
    lines.push(
      `   スコア: ${lawSummary.score}/100 | 違反: ${lawSummary.totalViolations}件`,
    );
    if (lawSummary.totalViolations > 0) {
      lines.push(
        `   (Critical: ${lawSummary.critical}, High: ${lawSummary.high}, Medium: ${lawSummary.medium}, Low: ${lawSummary.low})`,
      );
    }
    lines.push("");
  }

  // 違反の詳細
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("🔍 検出された違反の詳細\n");

  // 重大度順にソート
  const sortedViolations = [...result.violations].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  for (let i = 0; i < sortedViolations.length; i++) {
    const v = sortedViolations[i];
    const severityIcon = getSeverityIcon(v.severity);

    lines.push(`${i + 1}. ${severityIcon} 「${v.originalText}」`);
    lines.push(`   📚 法令: ${v.lawName}`);
    if (v.lawArticle) {
      lines.push(`   📖 条文: ${v.lawArticle}`);
    }
    lines.push(`   📁 カテゴリ: ${v.categoryName}`);
    lines.push(`   💡 提案: ${v.suggestedText}`);
    if (v.description) {
      lines.push(`   📝 説明: ${v.description}`);
    }
    lines.push("");
  }

  // 改善アドバイス
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("💡 改善のためのアドバイス\n");

  if (result.summary.critical > 0) {
    lines.push("🚨 重大な違反が検出されました。これらは法的リスクが高いため、");
    lines.push("   直ちに修正することを強くお勧めします。\n");
  }

  if (
    result.byLaw.find((l) => l.law === "pharmaceutical_affairs")
      ?.totalViolations
  ) {
    lines.push("💊 薬機法違反は刑事罰の対象となる可能性があります。");
    lines.push(
      "   疾病の治療・予防効果を標榜する表現は絶対に避けてください。\n",
    );
  }

  if (result.byLaw.find((l) => l.law === "food_labeling")?.totalViolations) {
    lines.push("🏷️  食品表示法違反は措置命令の対象となります。");
    lines.push(
      "   特にアレルゲン表示は健康被害に直結するため、正確な表示が必要です。\n",
    );
  }

  lines.push(
    "📞 不明な点がある場合は、法務担当者または専門家にご相談ください。",
  );

  return lines.join("\n");
}

/**
 * 法令別のレポートを生成
 */
export function generateLawReport(
  result: ComplianceResult,
  law: ComplianceLaw,
): string {
  const lawSummary = result.byLaw.find((l) => l.law === law);
  if (!lawSummary) {
    return `${LAW_NAMES[law]}のチェック結果が見つかりません。`;
  }

  const lawViolations = result.violations.filter((v) => v.law === law);
  const lines: string[] = [];

  lines.push(`\n📜 ${lawSummary.lawName} コンプライアンスレポート`);
  lines.push("═".repeat(50));
  lines.push(`\nスコア: ${lawSummary.score}/100`);
  lines.push(`リスクレベル: ${getRiskLevelLabel(lawSummary.riskLevel)}`);
  lines.push(`違反数: ${lawSummary.totalViolations}件\n`);

  if (lawViolations.length === 0) {
    lines.push(`✅ ${lawSummary.lawName}に関する違反は検出されませんでした。`);
    return lines.join("\n");
  }

  lines.push("検出された違反:\n");

  for (let i = 0; i < lawViolations.length; i++) {
    const v = lawViolations[i];
    lines.push(`${i + 1}. [${v.severity.toUpperCase()}] ${v.originalText}`);
    if (v.lawArticle) {
      lines.push(`   条文: ${v.lawArticle}`);
    }
    lines.push(`   カテゴリ: ${v.categoryName}`);
    lines.push(`   提案: ${v.suggestedText}`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * リスクレベルのラベルを取得
 */
function getRiskLevelLabel(riskLevel: ComplianceResult["riskLevel"]): string {
  const labels = {
    safe: "🟢 安全",
    low: "🟡 低リスク",
    medium: "🟠 中リスク",
    high: "🔴 高リスク",
    critical: "⛔ 重大リスク",
  };
  return labels[riskLevel];
}

/**
 * ステータスアイコンを取得
 */
function getStatusIcon(riskLevel: ComplianceResult["riskLevel"]): string {
  const icons = {
    safe: "✅",
    low: "⚠️",
    medium: "🟠",
    high: "🔴",
    critical: "⛔",
  };
  return icons[riskLevel];
}

/**
 * 重大度アイコンを取得
 */
function getSeverityIcon(severity: ComplianceSeverity): string {
  const icons = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🟢",
  };
  return icons[severity];
}

/**
 * コンプライアンスチェック結果をJSON形式でエクスポート
 */
export function exportToJSON(result: ComplianceResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * 違反を重大度でフィルタリング
 */
export function filterBySeverity(
  violations: ComplianceViolation[],
  severity: ComplianceSeverity,
): ComplianceViolation[] {
  return violations.filter((v) => v.severity === severity);
}

/**
 * 違反を法令でフィルタリング
 */
export function filterByLaw(
  violations: ComplianceViolation[],
  law: ComplianceLaw,
): ComplianceViolation[] {
  return violations.filter((v) => v.law === law);
}

/**
 * 重大な違反のみを取得
 */
export function getCriticalViolations(
  result: ComplianceResult,
): ComplianceViolation[] {
  return filterBySeverity(result.violations, "critical");
}

/**
 * コンプライアンスチェックのサマリーを取得（簡易版）
 */
export function getQuickSummary(result: ComplianceResult): string {
  if (!result.hasViolations) {
    return "✅ 法令準拠OK（4法すべてクリア）";
  }

  const parts: string[] = [];

  if (result.summary.critical > 0) {
    parts.push(`⛔ 重大違反${result.summary.critical}件`);
  }
  if (result.summary.high > 0) {
    parts.push(`🔴 高リスク${result.summary.high}件`);
  }
  if (result.summary.medium > 0) {
    parts.push(`🟠 中リスク${result.summary.medium}件`);
  }
  if (result.summary.low > 0) {
    parts.push(`🟢 低リスク${result.summary.low}件`);
  }

  return `⚠️ ${parts.join(" / ")} | スコア: ${result.score}/100`;
}
