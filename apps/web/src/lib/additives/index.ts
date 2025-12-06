/**
 * 添加物安全性チェックシステム
 *
 * Suptiaの全原材料安全性チェック機能の中核モジュール
 *
 * @example
 * ```typescript
 * import { checkAdditives, normalizeIngredients } from '@/lib/additives';
 *
 * // 原材料テキストから安全性をチェック
 * const result = checkAdditives('ゼラチン、ステアリン酸Mg、二酸化チタン');
 *
 * console.log(result.summary.overallGrade); // 'avoid'
 * console.log(result.warnings); // ['回避推奨の添加物が1件検出されました: 二酸化チタン']
 * ```
 */

// 型定義
export type {
  AdditiveCategory,
  SafetyGrade,
  DataSource,
  SafetyRationale,
  AdditiveContraindication,
  AdditiveInfo,
  AdditiveCheckResult,
  NormalizedIngredients,
} from "./types";

export {
  ADDITIVE_CATEGORY_LABELS,
  SAFETY_GRADE_INFO,
  DATA_SOURCE_LABELS,
} from "./types";

// データ
export {
  ADDITIVES_DATA,
  getAdditiveById,
  getAdditivesByCategory,
  getAdditivesBySafetyGrade,
  searchAdditive,
} from "./data";

// 正規化
export {
  normalizeIngredients,
  toCleanArray,
  toDisplayText,
  detectFormat,
  validateIngredientsText,
} from "./normalizer";

// チェッカー
export {
  checkAdditives,
  calculateAdditiveScoreDeduction,
  formatCheckResult,
  checkContraindications,
} from "./checker";
