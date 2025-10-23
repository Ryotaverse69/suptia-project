/**
 * 薬機法コンプライアンスチェックシステム
 *
 * 使用例:
 * ```typescript
 * import { checkCompliance } from '@/lib/compliance';
 *
 * const result = checkCompliance('この商品で糖尿病が治ります');
 * console.log(result.hasViolations); // true
 * console.log(result.score); // 0 (重大違反)
 * console.log(result.violations[0].suggestedText); // '血糖値の健康維持に'
 * ```
 */

// メイン機能のエクスポート
export {
  checkCompliance,
  highlightViolations,
  autoFixViolations,
  summarizeByCategory,
  generateComplianceReport,
} from "./checker";

// ルール定義のエクスポート
export {
  COMPLIANCE_RULES,
  APPROVED_EXPRESSIONS,
  CATEGORY_SEVERITY_SCORE,
  SEVERITY_SCORE,
} from "./rules";

// 型定義のエクスポート
export type {
  ComplianceRule,
  ComplianceCategory,
  ComplianceSeverity,
} from "./rules";

export type { ComplianceViolation, ComplianceResult } from "./checker";
