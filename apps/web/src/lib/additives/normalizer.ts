/**
 * 原材料テキスト正規化パイプライン
 *
 * allIngredientsフィールドの多様なフォーマットを
 * 統一された配列形式に変換する
 */

import type { NormalizedIngredients } from "./types";

/**
 * 区切り文字パターン
 */
const DELIMITERS = [
  /、/g, // 読点
  /，/g, // 全角カンマ
  /,/g, // 半角カンマ
  /・/g, // 中黒
  /\//g, // スラッシュ
  /\n/g, // 改行
  /\r/g, // キャリッジリターン
];

/**
 * 除去すべきパターン（括弧内の補足情報など）
 */
const REMOVE_PATTERNS = [
  /\（[^）]*\）/g, // 全角括弧内
  /\([^)]*\)/g, // 半角括弧内
  /【[^】]*】/g, // 隅付き括弧内
  /＜[^＞]*＞/g, // 全角山括弧内
  /<[^>]*>/g, // 半角山括弧内
];

/**
 * 無視すべきプレフィックス/サフィックス
 */
const IGNORE_PREFIXES = [
  "原材料名",
  "原材料",
  "全成分",
  "成分",
  "内容成分",
  "※",
  "＊",
  "*",
];

/**
 * 正規化の別名マッピング（表記ゆれ対応）
 */
const ALIAS_NORMALIZATIONS: Record<string, string> = {
  // カプセル素材
  ゼラチンカプセル: "ゼラチン",
  HPMCカプセル: "ヒプロメロース",
  植物性カプセル: "ヒプロメロース",
  "V-カプセル": "ヒプロメロース",
  Vcaps: "ヒプロメロース",

  // 滑沢剤
  ステアリン酸Mg: "ステアリン酸マグネシウム",
  ステアリン酸Ca: "ステアリン酸カルシウム",
  微粒二酸化ケイ素: "二酸化ケイ素",
  微粒酸化ケイ素: "二酸化ケイ素",
  シリカ: "二酸化ケイ素",

  // 甘味料
  ステビア抽出物: "ステビア",
  ステビア甘味料: "ステビア",
  甘味料ステビア: "ステビア",
  "甘味料（ステビア）": "ステビア",
  "甘味料（スクラロース）": "スクラロース",
  "甘味料（アスパルテーム・L-フェニルアラニン化合物）": "アスパルテーム",

  // 着色料
  "着色料（二酸化チタン）": "二酸化チタン",
  "着色料（酸化チタン）": "二酸化チタン",
  "着色料（カラメル）": "カラメル色素",
  "着色料（βカロテン）": "β-カロテン",
  "着色料（リボフラビン）": "リボフラビン",

  // 酸化防止剤
  "酸化防止剤（V.E）": "トコフェロール",
  "酸化防止剤（ビタミンE）": "トコフェロール",
  "酸化防止剤（V.C）": "アスコルビン酸",
  "酸化防止剤（ビタミンC）": "アスコルビン酸",

  // 乳化剤
  "乳化剤（大豆由来）": "大豆レシチン",
  "乳化剤（レシチン）": "レシチン",

  // 増粘剤
  "増粘剤（キサンタンガム）": "キサンタンガム",
  "ゲル化剤（ペクチン）": "ペクチン",

  // セルロース
  結晶セルロース: "セルロース",
  微結晶セルロース: "セルロース",
  MCC: "セルロース",

  // その他
  pH調整剤: "クエン酸",
  酸味料: "クエン酸",
};

/**
 * 原材料テキストを正規化して配列に変換
 */
export function normalizeIngredients(text: string): NormalizedIngredients {
  if (!text || text.trim() === "") {
    return {
      items: [],
      original: text || "",
      confidence: 0,
      errors: ["空のテキストです"],
    };
  }

  const errors: string[] = [];
  let workingText = text;

  // 1. プレフィックス除去
  for (const prefix of IGNORE_PREFIXES) {
    if (workingText.startsWith(prefix)) {
      workingText = workingText.slice(prefix.length);
    }
    // コロン後のテキストを取得
    const colonIndex = workingText.indexOf("：");
    if (colonIndex !== -1 && colonIndex < 10) {
      workingText = workingText.slice(colonIndex + 1);
    }
    const colonIndex2 = workingText.indexOf(":");
    if (colonIndex2 !== -1 && colonIndex2 < 10) {
      workingText = workingText.slice(colonIndex2 + 1);
    }
  }

  // 2. 括弧内の補足情報を抽出して処理
  const bracketContents: string[] = [];
  workingText = workingText.replace(/\（([^）]+)\）/g, (_, content) => {
    bracketContents.push(content);
    return ""; // 一旦除去
  });
  workingText = workingText.replace(/\(([^)]+)\)/g, (_, content) => {
    bracketContents.push(content);
    return "";
  });

  // 3. 区切り文字で分割
  let items: string[] = [workingText];

  // 3.5. 括弧内の内容も区切り文字で分割して追加
  for (const bracketContent of bracketContents) {
    // 括弧内の内容も区切り文字で分割
    let bracketItems = [bracketContent];
    for (const delimiter of DELIMITERS) {
      bracketItems = bracketItems.flatMap((item) => item.split(delimiter));
    }
    items.push(...bracketItems);
  }

  for (const delimiter of DELIMITERS) {
    items = items.flatMap((item) => item.split(delimiter));
  }

  // 4. 各アイテムをクリーンアップ
  items = items
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item) => !IGNORE_PREFIXES.some((prefix) => item === prefix));

  // 5. 別名の正規化
  items = items.map((item) => {
    const normalized = ALIAS_NORMALIZATIONS[item];
    return normalized || item;
  });

  // 6. 重複除去
  items = [...new Set(items)];

  // 7. 信頼度計算
  let confidence = 1.0;

  // アイテム数が少なすぎる場合は信頼度低下
  if (items.length < 3) {
    confidence *= 0.7;
    errors.push("検出された成分が少なすぎます");
  }

  // 元テキストが短すぎる場合
  if (text.length < 20) {
    confidence *= 0.8;
    errors.push("元のテキストが短すぎます");
  }

  // 括弧内のテキストが多い場合（情報が失われている可能性）
  if (bracketContents.length > items.length) {
    confidence *= 0.9;
    errors.push("括弧内の補足情報が多く、一部が除外されています");
  }

  return {
    items,
    original: text,
    confidence,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 配列形式のクリーンデータを生成
 *
 * Sanityに保存する際のフォーマット
 */
export function toCleanArray(normalized: NormalizedIngredients): string[] {
  return normalized.items;
}

/**
 * 配列からテキストに戻す（表示用）
 */
export function toDisplayText(items: string[]): string {
  return items.join("、");
}

/**
 * 原材料テキストの形式を検出
 */
export function detectFormat(text: string): {
  format: "comma" | "slash" | "newline" | "mixed" | "unknown";
  delimiter: string;
} {
  const commaCount = (text.match(/[、，,]/g) || []).length;
  const slashCount = (text.match(/[・\/]/g) || []).length;
  const newlineCount = (text.match(/[\n\r]/g) || []).length;

  if (
    commaCount >= slashCount &&
    commaCount >= newlineCount &&
    commaCount > 0
  ) {
    return { format: "comma", delimiter: "、" };
  }
  if (
    slashCount >= commaCount &&
    slashCount >= newlineCount &&
    slashCount > 0
  ) {
    return { format: "slash", delimiter: "・" };
  }
  if (newlineCount > 0) {
    return { format: "newline", delimiter: "\n" };
  }
  if (commaCount > 0 || slashCount > 0 || newlineCount > 0) {
    return { format: "mixed", delimiter: "、" };
  }

  return { format: "unknown", delimiter: "" };
}

/**
 * 原材料テキストのバリデーション
 */
export function validateIngredientsText(text: string): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!text || text.trim() === "") {
    return {
      isValid: false,
      warnings: ["原材料テキストが空です"],
      suggestions: ["製品パッケージから原材料名をコピーしてください"],
    };
  }

  // 最小文字数チェック
  if (text.length < 10) {
    warnings.push("原材料テキストが短すぎます");
    suggestions.push("全ての原材料が含まれているか確認してください");
  }

  // 区切り文字がない場合
  const { format } = detectFormat(text);
  if (format === "unknown") {
    warnings.push("区切り文字が検出されませんでした");
    suggestions.push("原材料は「、」で区切って入力してください");
  }

  // 括弧が閉じていない場合
  const openParen = (text.match(/[（(]/g) || []).length;
  const closeParen = (text.match(/[）)]/g) || []).length;
  if (openParen !== closeParen) {
    warnings.push("括弧が正しく閉じていません");
    suggestions.push("括弧のバランスを確認してください");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  };
}
