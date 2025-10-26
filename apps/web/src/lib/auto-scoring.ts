/**
 * 成分データに基づく自動スコア計算
 */

interface Ingredient {
  _id: string;
  name: string;
  nameEn: string;
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  category?: string;
  sideEffects?: string[];
  interactions?: string[];
}

interface AutoScoreResult {
  evidenceScore: number;
  evidenceLevel: "S" | "A" | "B" | "C" | "D";
  safetyScore: number;
  safetyLevel: "S" | "A" | "B" | "C" | "D";
  overallScore: number;
  foundIngredients: string[];
}

/**
 * 商品名から成分を抽出
 */
export function extractIngredientFromProductName(
  productName: string,
): string[] {
  const normalizedName = productName.toLowerCase();

  // よくある成分パターン（日本語・英語）
  const ingredientPatterns = [
    // ビタミン類
    {
      pattern: /ビタミンc|vitamin\s*c|アスコルビン酸/i,
      name: "ビタミンC（アスコルビン酸）",
    },
    { pattern: /ビタミンd|vitamin\s*d/i, name: "ビタミンD" },
    { pattern: /ビタミンe|vitamin\s*e/i, name: "ビタミンE" },
    { pattern: /ビタミンa|vitamin\s*a/i, name: "ビタミンA" },
    {
      pattern: /ビタミンb12|vitamin\s*b12|コバラミン/i,
      name: "ビタミンB12（コバラミン）",
    },
    { pattern: /ビタミンb6|vitamin\s*b6/i, name: "ビタミンB6（ピリドキシン）" },
    {
      pattern: /ビタミンb1|vitamin\s*b1|チアミン/i,
      name: "ビタミンB1（チアミン）",
    },
    {
      pattern: /ビタミンb2|vitamin\s*b2|リボフラビン/i,
      name: "ビタミンB2（リボフラビン）",
    },
    { pattern: /ビタミンk|vitamin\s*k/i, name: "ビタミンK" },
    { pattern: /葉酸|folic\s*acid/i, name: "葉酸" },
    { pattern: /ナイアシン|niacin/i, name: "ナイアシン" },
    { pattern: /ビオチン|biotin/i, name: "ビオチン" },
    { pattern: /パントテン酸|pantothenic/i, name: "パントテン酸" },

    // ミネラル類
    { pattern: /カルシウム|calcium/i, name: "カルシウム" },
    { pattern: /マグネシウム|magnesium/i, name: "マグネシウム" },
    { pattern: /鉄|iron|アイアン/i, name: "鉄" },
    { pattern: /亜鉛|zinc/i, name: "亜鉛" },
    { pattern: /セレン|selenium/i, name: "セレン" },
    { pattern: /カリウム|potassium/i, name: "カリウム" },
    { pattern: /ヨウ素|iodine/i, name: "ヨウ素" },
    { pattern: /クロム|chromium/i, name: "クロム" },

    // オメガ脂肪酸
    {
      pattern: /オメガ3|omega\s*3|epa|dha|フィッシュオイル|fish\s*oil/i,
      name: "オメガ3脂肪酸（EPA/DHA）",
    },

    // アミノ酸
    { pattern: /bcaa|分岐鎖アミノ酸/i, name: "BCAA（分岐鎖アミノ酸）" },
    { pattern: /グルタミン|glutamine/i, name: "グルタミン" },
    { pattern: /アルギニン|arginine/i, name: "アルギニン" },

    // その他
    { pattern: /コエンザイムq10|coq10|コキューテン/i, name: "コエンザイムQ10" },
    {
      pattern: /プロバイオティクス|乳酸菌|ビフィズス菌/i,
      name: "プロバイオティクス（乳酸菌）",
    },
    { pattern: /グルコサミン|glucosamine/i, name: "グルコサミン" },
    { pattern: /コンドロイチン|chondroitin/i, name: "コンドロイチン" },
    { pattern: /ルテイン|lutein/i, name: "ルテイン" },
    { pattern: /アスタキサンチン|astaxanthin/i, name: "アスタキサンチン" },
    { pattern: /アシュワガンダ|ashwagandha/i, name: "アシュワガンダ" },
    { pattern: /クレアチン|creatine/i, name: "クレアチン" },
    { pattern: /プロテイン|protein/i, name: "プロテイン" },
  ];

  const foundIngredients: string[] = [];

  for (const { pattern, name } of ingredientPatterns) {
    if (pattern.test(normalizedName)) {
      foundIngredients.push(name);
    }
  }

  return foundIngredients;
}

/**
 * エビデンスレベルをスコアに変換
 */
export function evidenceLevelToScore(
  level?: "S" | "A" | "B" | "C" | "D",
): number {
  switch (level) {
    case "S":
      return 95;
    case "A":
      return 85;
    case "B":
      return 75;
    case "C":
      return 65;
    case "D":
      return 50;
    default:
      return 50; // デフォルトはD
  }
}

/**
 * スコアをエビデンスレベルに変換
 */
export function scoreToEvidenceLevel(
  score: number,
): "S" | "A" | "B" | "C" | "D" {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

/**
 * 成分の安全性スコアを計算
 */
export function calculateSafetyScore(ingredient: Ingredient): number {
  let score = 90; // ベーススコア

  // エビデンスレベルが高いほど安全性も高いと仮定
  const evidenceBonus = {
    S: 0,
    A: -5,
    B: -10,
    C: -15,
    D: -20,
  };
  score += evidenceBonus[ingredient.evidenceLevel || "D"];

  // 副作用の数でペナルティ
  const sideEffectsCount = ingredient.sideEffects?.length || 0;
  if (sideEffectsCount > 0) {
    score -= Math.min(sideEffectsCount * 2, 15); // 最大-15点
  }

  // 相互作用の数でペナルティ
  const interactionsCount = ingredient.interactions?.length || 0;
  if (interactionsCount > 0) {
    score -= Math.min(interactionsCount * 1.5, 10); // 最大-10点
  }

  // カテゴリによる調整
  if (
    ingredient.category === "ビタミン" ||
    ingredient.category === "ミネラル"
  ) {
    score += 5; // 基本的な栄養素は安全性が高い
  }

  return Math.max(Math.min(score, 100), 0); // 0-100に正規化
}

/**
 * 複数の成分から総合安全性スコアを計算
 */
export function calculateOverallSafetyScore(ingredients: Ingredient[]): number {
  if (ingredients.length === 0) return 50; // デフォルト

  // 全成分の安全性スコアの平均
  const totalScore = ingredients.reduce((sum, ing) => {
    return sum + calculateSafetyScore(ing);
  }, 0);

  return Math.round(totalScore / ingredients.length);
}

/**
 * 複数の成分から総合エビデンススコアを計算
 */
export function calculateOverallEvidenceScore(
  ingredients: Ingredient[],
): number {
  if (ingredients.length === 0) return 50; // デフォルト

  // 主成分（最初の成分）を重視
  const mainIngredientScore = evidenceLevelToScore(
    ingredients[0]?.evidenceLevel,
  );

  if (ingredients.length === 1) {
    return mainIngredientScore;
  }

  // その他の成分の平均
  const otherScores = ingredients
    .slice(1)
    .map((ing) => evidenceLevelToScore(ing.evidenceLevel));
  const otherAverage =
    otherScores.length > 0
      ? otherScores.reduce((a, b) => a + b, 0) / otherScores.length
      : mainIngredientScore;

  // 主成分70%、その他30%の重み付け
  return Math.round(mainIngredientScore * 0.7 + otherAverage * 0.3);
}

/**
 * 商品の自動スコア計算（メイン関数）
 */
export function calculateAutoScores(
  productName: string,
  ingredientsData: Ingredient[],
): AutoScoreResult {
  // 商品名から成分を抽出
  const extractedNames = extractIngredientFromProductName(productName);

  // 抽出された成分名に一致する成分データを取得
  const matchedIngredients = ingredientsData.filter((ing) =>
    extractedNames.some(
      (name) =>
        ing.name.includes(name) ||
        name.includes(ing.name) ||
        ing.nameEn?.toLowerCase().includes(name.toLowerCase()),
    ),
  );

  // 成分が見つからない場合はデフォルト値
  if (matchedIngredients.length === 0) {
    return {
      evidenceScore: 50,
      evidenceLevel: "D",
      safetyScore: 50,
      safetyLevel: "D",
      overallScore: 50,
      foundIngredients: [],
    };
  }

  // エビデンススコア計算
  const evidenceScore = calculateOverallEvidenceScore(matchedIngredients);
  const evidenceLevel = scoreToEvidenceLevel(evidenceScore);

  // 安全性スコア計算（全成分を考慮）
  const safetyScore = calculateOverallSafetyScore(matchedIngredients);
  const safetyLevel = scoreToEvidenceLevel(safetyScore);

  // 総合スコア
  const overallScore = Math.round((evidenceScore + safetyScore) / 2);

  return {
    evidenceScore,
    evidenceLevel,
    safetyScore,
    safetyLevel,
    overallScore,
    foundIngredients: matchedIngredients.map((ing) => ing.name),
  };
}
