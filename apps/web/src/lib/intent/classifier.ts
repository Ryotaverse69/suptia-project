/**
 * Intent Classifier
 *
 * 入力テキストからユーザーの意図を分類する
 *
 * フェーズ①: 辞書マッチ・パターンマッチ（LLM不使用）
 * フェーズ②: 曖昧な場合のみ軽量AI（Haiku）を使用
 */

import type {
  IntentType,
  IntentDestination,
  IntentClassification,
  IntentConfidence,
} from "./types";
import {
  normalizeInput,
  extractIngredients,
  extractProducts,
  extractConditions,
  extractSymptoms,
  QUESTION_PATTERNS,
  COMPARISON_PATTERNS,
} from "./dictionaries";

/**
 * Intent判定結果からDestinationを決定
 *
 * destination は「推奨遷移先」を示す。
 * フロントエンドは必要に応じて上書き可能。
 */
function intentToDestination(intent: IntentType): IntentDestination {
  switch (intent) {
    case "ingredient":
    case "product":
      return "search";
    case "symptom":
    case "question":
    case "condition":
    case "comparison":
      return "concierge";
    case "unknown":
    default:
      // unknown → concierge: AIが聞き返し・補足質問で回収できる
      // 検索に飛ばすと空振りUXになりやすい
      return "concierge";
  }
}

/**
 * パターンマッチでIntentを判定
 */
function classifyByPattern(normalizedInput: string): {
  intent: IntentType;
  confidence: IntentConfidence;
} {
  // 比較パターン
  for (const pattern of COMPARISON_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { intent: "comparison", confidence: "high" };
    }
  }

  // 疑問パターン
  for (const pattern of QUESTION_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { intent: "question", confidence: "high" };
    }
  }

  return { intent: "unknown", confidence: "low" };
}

/**
 * エンティティ抽出結果からIntentを推論
 */
function inferIntentFromEntities(entities: {
  ingredients: string[];
  products: string[];
  conditions: string[];
  symptoms: string[];
}): {
  intent: IntentType;
  confidence: IntentConfidence;
} {
  const hasIngredients = entities.ingredients.length > 0;
  const hasProducts = entities.products.length > 0;
  const hasConditions = entities.conditions.length > 0;
  const hasSymptoms = entities.symptoms.length > 0;

  // 症状がある → concierge
  if (hasSymptoms) {
    return { intent: "symptom", confidence: "high" };
  }

  // 条件がある → concierge
  if (hasConditions) {
    return { intent: "condition", confidence: "high" };
  }

  // 商品名がある → search
  if (hasProducts) {
    return { intent: "product", confidence: "high" };
  }

  // 成分名のみ → search
  if (hasIngredients) {
    return { intent: "ingredient", confidence: "medium" };
  }

  return { intent: "unknown", confidence: "low" };
}

/**
 * 入力テキストの長さ・形式から補助判定
 */
function classifyByFormat(normalizedInput: string): {
  suggestedDestination: IntentDestination | null;
  confidence: IntentConfidence;
} {
  // 短い入力（15文字以下）→ 検索っぽい
  if (normalizedInput.length <= 10) {
    return { suggestedDestination: "search", confidence: "medium" };
  }

  // 長い入力（30文字以上）→ 相談っぽい
  if (normalizedInput.length >= 30) {
    return { suggestedDestination: "concierge", confidence: "medium" };
  }

  // 読点やカンマを含む → 文章形式 → 相談
  if (normalizedInput.includes("、") || normalizedInput.includes(",")) {
    return { suggestedDestination: "concierge", confidence: "low" };
  }

  return { suggestedDestination: null, confidence: "low" };
}

/**
 * メイン分類関数（フェーズ①: LLM不使用）
 *
 * @param input - ユーザー入力テキスト
 * @returns 分類結果
 */
export function classifyIntent(input: string): IntentClassification {
  const normalizedInput = normalizeInput(input);

  // 空入力チェック（空の場合は検索へ - 入力を促すため）
  if (!normalizedInput) {
    return {
      intent: "unknown",
      destination: "search",
      confidence: "low",
      extractedEntities: {
        ingredients: [],
        products: [],
        conditions: [],
        symptoms: [],
      },
      normalizedInput: "",
      method: "fallback",
    };
  }

  // エンティティ抽出
  const entities = {
    ingredients: extractIngredients(normalizedInput),
    products: extractProducts(normalizedInput),
    conditions: extractConditions(normalizedInput),
    symptoms: extractSymptoms(normalizedInput),
  };

  // Step 1: パターンマッチ
  const patternResult = classifyByPattern(normalizedInput);
  if (patternResult.confidence === "high") {
    return {
      intent: patternResult.intent,
      destination: intentToDestination(patternResult.intent),
      confidence: patternResult.confidence,
      extractedEntities: entities,
      normalizedInput,
      method: "pattern",
    };
  }

  // Step 2: エンティティベース推論
  const entityResult = inferIntentFromEntities(entities);
  if (entityResult.confidence !== "low") {
    return {
      intent: entityResult.intent,
      destination: intentToDestination(entityResult.intent),
      confidence: entityResult.confidence,
      extractedEntities: entities,
      normalizedInput,
      method: "dictionary",
    };
  }

  // Step 3: フォーマットベース補助判定
  // エンティティが1つでもある場合のみ、フォーマットベースで search を提案
  // エンティティがない場合は concierge へ（AIが聞き返しで回収）
  const formatResult = classifyByFormat(normalizedInput);
  const hasAnyEntity =
    entities.ingredients.length > 0 ||
    entities.products.length > 0 ||
    entities.conditions.length > 0 ||
    entities.symptoms.length > 0;

  if (formatResult.suggestedDestination === "search" && hasAnyEntity) {
    // エンティティがあって短い入力 → 検索
    return {
      intent: "ingredient",
      destination: "search",
      confidence: formatResult.confidence,
      extractedEntities: entities,
      normalizedInput,
      method: "fallback",
    };
  }

  if (formatResult.suggestedDestination === "concierge") {
    // 長い文章 → AIコンシェルジュ
    return {
      intent: "unknown",
      destination: "concierge",
      confidence: formatResult.confidence,
      extractedEntities: entities,
      normalizedInput,
      method: "fallback",
    };
  }

  // デフォルト: AIコンシェルジュへ（聞き返しで回収できる）
  return {
    intent: "unknown",
    destination: "concierge",
    confidence: "low",
    extractedEntities: entities,
    normalizedInput,
    method: "fallback",
  };
}

/**
 * キャッシュキーを生成
 *
 * 設計書の指定: `${normalizedInput}:${intentType}`
 */
export function generateCacheKey(
  normalizedInput: string,
  intent: IntentType,
): string {
  return `${normalizedInput}:${intent}`;
}
