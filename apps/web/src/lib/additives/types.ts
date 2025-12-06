/**
 * 添加物安全性チェックシステム - 型定義
 *
 * データソース（優先順）:
 * 1. 厚生労働省 - 既存添加物リスト
 * 2. JECFA (FAO/WHO) - 国際的なADI基準
 * 3. EFSA - 欧州食品安全機関
 * 4. EWG - 補助（ユーザー心理向け）
 */

/**
 * 添加物カテゴリ
 */
export type AdditiveCategory =
  | "preservative" // 保存料
  | "antioxidant" // 酸化防止剤
  | "colorant" // 着色料
  | "sweetener" // 甘味料
  | "emulsifier" // 乳化剤
  | "stabilizer" // 安定剤
  | "thickener" // 増粘剤
  | "coating" // コーティング剤・光沢剤
  | "binder" // 結合剤
  | "filler" // 賦形剤・増量剤
  | "flavor" // 香料
  | "acidity-regulator" // pH調整剤
  | "anti-caking" // 固結防止剤
  | "lubricant" // 滑沢剤
  | "capsule" // カプセル素材
  | "other"; // その他

/**
 * 添加物カテゴリの日本語ラベル
 */
export const ADDITIVE_CATEGORY_LABELS: Record<AdditiveCategory, string> = {
  preservative: "保存料",
  antioxidant: "酸化防止剤",
  colorant: "着色料",
  sweetener: "甘味料",
  emulsifier: "乳化剤",
  stabilizer: "安定剤",
  thickener: "増粘剤",
  coating: "コーティング剤",
  binder: "結合剤",
  filler: "賦形剤",
  flavor: "香料",
  "acidity-regulator": "pH調整剤",
  "anti-caking": "固結防止剤",
  lubricant: "滑沢剤",
  capsule: "カプセル素材",
  other: "その他",
};

/**
 * 安全性グレード
 *
 * Suptia独自の分類基準:
 * - safe: 一次データ源で問題なしとされ、長期摂取でも安全
 * - caution: 過剰摂取や特定条件で注意が必要
 * - avoid: 可能なら回避を推奨（代替品がある場合）
 */
export type SafetyGrade = "safe" | "caution" | "avoid";

/**
 * 安全性グレードの詳細情報
 */
export const SAFETY_GRADE_INFO: Record<
  SafetyGrade,
  {
    label: string;
    color: string;
    description: string;
    scoreImpact: number; // 安全性スコアへの影響（減点）
  }
> = {
  safe: {
    label: "安全",
    color: "text-green-600",
    description: "長期摂取でも問題なし",
    scoreImpact: 0,
  },
  caution: {
    label: "注意",
    color: "text-yellow-600",
    description: "過剰摂取・特定条件で注意",
    scoreImpact: -5,
  },
  avoid: {
    label: "回避推奨",
    color: "text-red-600",
    description: "可能なら回避を推奨",
    scoreImpact: -15,
  },
};

/**
 * データソース種別
 */
export type DataSource = "mhlw" | "jecfa" | "efsa" | "ewg" | "suptia";

/**
 * データソースの日本語ラベル
 */
export const DATA_SOURCE_LABELS: Record<DataSource, string> = {
  mhlw: "厚生労働省",
  jecfa: "JECFA (FAO/WHO)",
  efsa: "EFSA (欧州食品安全機関)",
  ewg: "EWG (環境ワーキンググループ)",
  suptia: "Suptia独自評価",
};

/**
 * 判定理由（AI推薦用に保持）
 */
export interface SafetyRationale {
  summary: string; // 判定理由の要約
  sources: Array<{
    source: DataSource;
    detail: string;
    url?: string;
  }>;
  lastReviewed: string; // YYYY-MM-DD形式
}

/**
 * 禁忌情報
 */
export interface AdditiveContraindication {
  condition: string; // 対象条件（妊娠中、腎臓病など）
  severity: "critical" | "warning" | "info";
  description: string;
}

/**
 * 添加物マスタデータ
 */
export interface AdditiveInfo {
  /** 識別子（英語スラッグ） */
  id: string;

  /** 日本語名（正式名称） */
  name: string;

  /** 別名リスト（E番号、化学名、略称など） */
  aliases: string[];

  /** カテゴリ */
  category: AdditiveCategory;

  /** 安全性グレード（Suptia独自分類） */
  safetyGrade: SafetyGrade;

  /** 懸念事項リスト */
  concerns: string[];

  /** 禁忌情報 */
  contraindications: AdditiveContraindication[];

  /** 1日許容摂取量 (mg/kg体重/日)、設定なしの場合はundefined */
  adiMgPerKg?: number;

  /** 判定理由（AI推薦用） */
  rationale: SafetyRationale;

  /** 一般的な用途の説明 */
  usageDescription: string;

  /** サプリメントでの一般的な使用目的 */
  supplementPurpose: string;
}

/**
 * 添加物チェック結果
 */
export interface AdditiveCheckResult {
  /** 検出された添加物 */
  detected: Array<{
    additive: AdditiveInfo;
    matchedTerm: string; // マッチした原材料名
  }>;

  /** 未知の原材料（マスタに存在しない） */
  unknown: string[];

  /** 安全性サマリー */
  summary: {
    safeCount: number;
    cautionCount: number;
    avoidCount: number;
    unknownCount: number;
    overallGrade: SafetyGrade | "unknown";
    scoreDeduction: number; // 安全性スコアからの減点合計
  };

  /** 警告メッセージ */
  warnings: string[];

  /** 推奨事項 */
  recommendations: string[];
}

/**
 * 正規化された原材料リスト
 */
export interface NormalizedIngredients {
  /** 正規化後の原材料名リスト */
  items: string[];

  /** 元のテキスト */
  original: string;

  /** パース成功率 (0-1) */
  confidence: number;

  /** パースエラー（あれば） */
  errors?: string[];
}
