/**
 * 4法対応コンプライアンスチェックシステム
 *
 * 対応法令:
 * 1. 薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）
 * 2. 健康増進法（誇大表示の禁止、栄養表示基準）
 * 3. 食品表示法（アレルゲン表示、栄養成分表示、原材料名表示）
 * 4. 食品衛生法（添加物表示、衛生基準）
 *
 * 使用例:
 * ```typescript
 * import { checkCompliance, generateComplianceReport } from '@/lib/compliance';
 *
 * // 全法令でチェック
 * const result = checkCompliance('この商品で糖尿病が治ります');
 * console.log(result.hasViolations); // true
 * console.log(result.score); // 0 (重大違反)
 * console.log(result.byLaw); // 法令別の詳細
 *
 * // 詳細レポートを生成
 * const report = generateComplianceReport(result);
 * console.log(report);
 *
 * // 特定の法令のみチェック
 * import { checkPharmaceuticalAffairs } from '@/lib/compliance';
 * const pharmaResult = checkPharmaceuticalAffairs('効果があります');
 *
 * // 自動修正
 * import { autoFixViolations } from '@/lib/compliance';
 * const fixedText = autoFixViolations(text, result.violations);
 * ```
 */

// メイン機能のエクスポート
export {
  // コアチェック機能
  checkCompliance,
  checkByLaw,
  checkPharmaceuticalAffairs,
  checkHealthPromotion,
  checkFoodLabeling,
  checkFoodSanitation,
  // ユーティリティ
  highlightViolations,
  autoFixViolations,
  summarizeByCategory,
  // レポート生成
  generateComplianceReport,
  generateLawReport,
  // エクスポート・フィルタリング
  exportToJSON,
  filterBySeverity,
  filterByLaw,
  getCriticalViolations,
  getQuickSummary,
} from "./checker";

// ルール定義のエクスポート
export {
  COMPLIANCE_RULES,
  APPROVED_EXPRESSIONS,
  CATEGORY_SEVERITY_SCORE,
  SEVERITY_SCORE,
  LAW_NAMES,
  CATEGORY_NAMES,
  LAW_IMPORTANCE,
  getRulesByLaw,
  getRulesByCategory,
} from "./rules";

// 型定義のエクスポート
export type {
  ComplianceRule,
  ComplianceCategory,
  ComplianceSeverity,
  ComplianceLaw,
} from "./rules";

export type {
  ComplianceViolation,
  ComplianceResult,
  LawSummary,
  CheckOptions,
} from "./checker";

/**
 * ルール統計情報
 */
export const RULE_STATISTICS = {
  totalRules: 100, // 約100ルール
  byLaw: {
    pharmaceutical_affairs: 45, // 薬機法: 約45ルール
    health_promotion: 35, // 健康増進法: 約35ルール
    food_labeling: 12, // 食品表示法: 約12ルール
    food_sanitation: 8, // 食品衛生法: 約8ルール
  },
  bySeverity: {
    critical: 35, // 重大違反: 約35ルール
    high: 40, // 高リスク: 約40ルール
    medium: 20, // 中リスク: 約20ルール
    low: 5, // 低リスク: 約5ルール
  },
};

/**
 * 法令の説明
 */
export const LAW_DESCRIPTIONS = {
  pharmaceutical_affairs: {
    name: "薬機法",
    fullName: "医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律",
    description:
      "医薬品・医療機器等の品質、有効性、安全性を確保するための法律。健康食品やサプリメントが医薬品的な効能効果を標榜することを禁止しています。",
    penalty: "2年以下の懲役または200万円以下の罰金",
    keyArticles: [
      "第66条（誇大広告等の禁止）",
      "第68条（承認前の医薬品等の広告の禁止）",
    ],
  },
  health_promotion: {
    name: "健康増進法",
    fullName: "健康増進法",
    description:
      "国民の健康の増進を図るための法律。食品の虚偽・誇大表示を禁止し、栄養表示基準を定めています。",
    penalty: "措置命令、課徴金納付命令",
    keyArticles: ["第65条（誇大表示の禁止）"],
  },
  food_labeling: {
    name: "食品表示法",
    fullName: "食品表示法",
    description:
      "食品の表示に関する包括的な法律。アレルゲン表示、栄養成分表示、原材料名表示などを規定しています。",
    penalty: "措置命令、2年以下の懲役または200万円以下の罰金",
    keyArticles: [
      "第3条（アレルゲン表示）",
      "第7条（栄養成分表示）",
      "第8条（栄養機能食品）",
      "第9条（機能性表示食品）",
    ],
  },
  food_sanitation: {
    name: "食品衛生法",
    fullName: "食品衛生法",
    description:
      "食品の安全性を確保し、飲食による健康被害の発生を防止するための法律。添加物表示、衛生基準などを規定しています。",
    penalty: "営業禁止・停止命令、3年以下の懲役または300万円以下の罰金",
    keyArticles: [
      "第11条（規格基準）",
      "第18条（器具及び容器包装）",
      "第19条（表示）",
      "第50条の2（HACCP）",
    ],
  },
};
