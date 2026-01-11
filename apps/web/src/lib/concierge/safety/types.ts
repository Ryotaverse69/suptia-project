/**
 * Safety機能 型定義
 *
 * v1.0.0 - 相互作用チェッカー、危険成分オートブロック
 */

// ============================================
// 相互作用データ構造（仕様書9.5準拠）
// ============================================

export type SubstanceType = "ingredient" | "drug" | "condition";
export type InteractionSeverity = "high" | "moderate" | "low" | "theoretical";

export interface Substance {
  type: SubstanceType;
  name: string;
  nameEn: string;
  /** 関連するID（ingredientの場合はslug、conditionの場合はcondition value） */
  relatedId?: string;
}

export interface InteractionSource {
  name: string;
  url: string;
  accessDate: string;
  citation: string;
}

export interface InteractionData {
  id: string;
  substanceA: Substance;
  substanceB: Substance;
  severity: InteractionSeverity;
  /** 作用機序 */
  mechanism: string;
  /** 臨床的意義 */
  clinicalSignificance: string;
  /** 推奨事項（AIは結論を作らず、この文言を使用） */
  recommendation: string;
  sources: InteractionSource[];
  lastVerified: string;
  verifiedBy: string;
}

// ============================================
// 避けるべき成分
// ============================================

export interface BlockedIngredient {
  /** 成分slug */
  ingredientSlug: string;
  /** 成分名 */
  ingredientName: string;
  /** ブロック理由（既往歴や薬との関連） */
  reason: string;
  /** 関連する既往歴/薬 */
  relatedTo: {
    type: "condition" | "medication" | "allergy";
    value: string;
    label: string;
  };
  /** 危険度 */
  severity: InteractionSeverity;
}

// ============================================
// Safety チェック結果
// ============================================

export interface SafetyCheckResult {
  /** 検出された相互作用 */
  interactions: InteractionData[];
  /** 避けるべき成分リスト */
  blockedIngredients: BlockedIngredient[];
  /** 相互作用の系統数（Opus昇格判定用） */
  interactionCount: number;
  /** 危険フラグ */
  dangerFlags: string[];
  /** Sonnetの確信度（0-1、Opus昇格判定用） */
  confidenceScore: number;
}

// ============================================
// 既往歴と避けるべき成分のマッピング
// ============================================

export interface ConditionIngredientWarning {
  /** 既往歴のvalue */
  conditionValue: string;
  /** 既往歴のラベル */
  conditionLabel: string;
  /** 注意が必要な成分 */
  ingredients: Array<{
    slug: string;
    name: string;
    reason: string;
    severity: InteractionSeverity;
  }>;
}

// ============================================
// 薬と成分の相互作用マッピング
// ============================================

export interface DrugIngredientInteraction {
  /** 薬のキーワード（正規表現パターン） */
  drugPattern: string;
  /** 薬の一般名 */
  drugName: string;
  /** 相互作用のある成分 */
  ingredients: Array<{
    slug: string;
    name: string;
    mechanism: string;
    severity: InteractionSeverity;
    recommendation: string;
  }>;
}
