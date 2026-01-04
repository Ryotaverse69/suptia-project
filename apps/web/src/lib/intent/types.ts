/**
 * Intent Classification Types
 *
 * ヒーローセクションの入力からユーザーの意図を分類するための型定義
 *
 * ## 設計思想
 * - AIを賢く「制御する」API
 * - コスト事故を起こしにくい設計
 * - UXと将来拡張の両立
 *
 * ## IntentType 一覧
 * | 値 | 説明 | 遷移先 |
 * |---|------|--------|
 * | ingredient | 成分名（ビタミンD、オメガ3） | search |
 * | product | 商品名（ネイチャーメイド） | search |
 * | symptom | 悩み・症状（疲れやすい） | concierge |
 * | question | 疑問（安全？副作用は？） | concierge |
 * | condition | 条件（妊娠中、服薬中） | concierge |
 * | comparison | 比較（AとBの違い） | concierge |
 * | unknown | 判定不能 | concierge |
 *
 * ## 判定優先順位（重要）
 * 1. symptom（症状）→ concierge
 * 2. condition（条件）→ concierge
 * 3. product（商品）→ search
 * 4. ingredient（成分）→ search
 *
 * 例: 「妊娠中 ビタミン」→ condition が優先 → concierge
 *
 * ## destination の責務
 * - destination は「推奨遷移先」であり、結果の有無を保証しない
 * - destination = search の場合、検索結果が 0 件となる可能性がある
 * - 結果 0 件時の UX 制御はフロントエンドに委ねる
 *
 * ## extractedEntities の拡張性
 * - 将来キーが追加される可能性がある
 * - フロントエンドは存在チェックを行い、未知のキーを無視すること
 */

/**
 * 分類結果のIntent種別
 *
 * unknown の場合は concierge へ遷移（AIが聞き返しで回収できる）
 */
export type IntentType =
  | "ingredient" // 成分名のみ（例：ビタミンD、オメガ3）→ search
  | "product" // 商品名（例：ネイチャーメイド マルチビタミン）→ search
  | "symptom" // 悩み・症状（例：疲れやすい、眠れない）→ concierge
  | "question" // 疑問（例：安全？多すぎない？）→ concierge
  | "condition" // 条件（例：妊娠中、服薬中）→ concierge
  | "comparison" // 比較（例：AとBの違い）→ concierge
  | "unknown"; // 判定不能 → concierge（AIが聞き返しで回収）

/**
 * 分類結果の遷移先（推奨遷移先）
 *
 * destination は UX 上の「推奨遷移先」を示す。
 * フロントエンドは必要に応じて上書き可能。
 * 将来の「検索＋AI併用表示」にも対応できる。
 */
export type IntentDestination = "search" | "concierge";

/**
 * 信頼度（confidence）の定義
 *
 * - high: 単一の intent に明確に一致
 * - medium: 複数 intent の可能性があるが、最も確からしいものを選択
 * - low: fallback による推定判定
 *
 * フロントは「どこまで信用してよいか」を判断するために使用。
 */
export type IntentConfidence = "high" | "medium" | "low";

/**
 * 分類結果
 */
export interface IntentClassification {
  /** 判定されたIntent種別 */
  intent: IntentType;

  /**
   * 推奨遷移先
   * - search: 検索ページへ
   * - concierge: AIコンシェルジュへ
   */
  destination: IntentDestination;

  /**
   * 判定の確からしさ
   * @see IntentConfidence
   */
  confidence: IntentConfidence;

  /**
   * 抽出されたエンティティ
   *
   * 各配列は、該当エンティティが検出されなかった場合は空配列を返す。
   * 空配列 = 未検出（未対応ではない）
   */
  extractedEntities: {
    ingredients: string[];
    products: string[];
    conditions: string[];
    symptoms: string[];
  };

  /**
   * 正規化された入力文字列
   *
   * キャッシュキーとしても使用される。
   */
  normalizedInput: string;

  /**
   * 判定に使用したロジックの種別（内部用）
   *
   * 内部ロジックの種別を示すものであり、
   * 品質保証や外部契約上の意味は持たない。
   * フロントエンドはこの値に依存すべきではない。
   */
  method: "dictionary" | "pattern" | "ai" | "fallback";
}

/**
 * API レスポンス
 */
export interface IntentAPIResponse {
  success: boolean;
  data?: IntentClassification;
  error?: string;
  cached?: boolean;
}

/**
 * キャッシュエントリ
 */
export interface CacheEntry {
  result: IntentClassification;
  timestamp: number;
}
