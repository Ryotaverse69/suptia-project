/**
 * 薬機法コンプライアンスチェッカー（後方互換版）
 *
 * より強力なコンプライアンスシステムは @/lib/compliance/checker を使用してください
 */

// 新しい強力なシステムから機能を再エクスポート
export {
  checkCompliance,
  highlightViolations,
  autoFixViolations,
  summarizeByCategory,
  generateComplianceReport,
  type ComplianceViolation,
  type ComplianceResult,
} from "./compliance/checker";

export {
  type ComplianceRule,
  type ComplianceCategory,
  type ComplianceSeverity,
} from "./compliance/rules";

// レガシー型定義（後方互換性のため残す）
export interface LegacyComplianceRule {
  pattern: string;
  suggest: string;
}

export interface LegacyComplianceViolation {
  originalText: string;
  suggestedText: string;
  pattern: string;
}

export interface LegacyComplianceResult {
  hasViolations: boolean;
  violations: LegacyComplianceViolation[];
}

/**
 * Generate sample product description (for demo purposes)
 */
export function generateSampleDescription(productName: string): string {
  const descriptions = [
    `${productName}は健康維持をサポートする高品質なサプリメントです。`,
    `${productName}で毎日の栄養バランスを整えましょう。`,
    `${productName}は科学的根拠に基づいて開発された製品です。`,
    `${productName}は即効性があり、必ず痩せる効果が期待できます。`, // NG表現を含む例
    `${productName}で完治を目指しましょう。`, // NG表現を含む例
  ];

  // ランダムに説明文を選択（デモ用）
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
}
