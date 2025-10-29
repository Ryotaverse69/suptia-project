/**
 * 成分データに基づく自動スコア計算
 */

interface Ingredient {
  _id: string;
  name: string;
  nameEn: string;
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  category?: string;
  sideEffects?: string[] | string; // 配列または文字列の両方に対応
  interactions?: string[] | string; // 配列または文字列の両方に対応
}

export interface IngredientSafetyDetail {
  name: string;
  baseScore: number;
  evidenceLevelPenalty: number;
  sideEffectsPenalty: number;
  interactionsPenalty: number;
  categoryBonus: number;
  finalScore: number;
  sideEffectsCount: number;
  interactionsCount: number;
}

export interface AutoScoreResult {
  evidenceScore: number;
  evidenceLevel: "S" | "A" | "B" | "C" | "D";
  safetyScore: number;
  safetyLevel: "S" | "A" | "B" | "C" | "D";
  overallScore: number;
  foundIngredients: string[];
  safetyDetails: IngredientSafetyDetail[];
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
 * 添加物・保存料のリスト（安全性が懸念される成分）
 */
const UNSAFE_ADDITIVES = [
  // 保存料
  { name: "安息香酸", penalty: -5, severity: "warning" },
  { name: "安息香酸ナトリウム", penalty: -5, severity: "warning" },
  { name: "ソルビン酸", penalty: -3, severity: "info" },
  { name: "ソルビン酸カリウム", penalty: -3, severity: "info" },
  { name: "パラベン", penalty: -5, severity: "warning" },
  { name: "パラオキシ安息香酸", penalty: -5, severity: "warning" },

  // 甘味料（人工甘味料）
  { name: "アスパルテーム", penalty: -4, severity: "warning" },
  { name: "アセスルファムK", penalty: -4, severity: "warning" },
  { name: "スクラロース", penalty: -3, severity: "info" },
  { name: "サッカリン", penalty: -5, severity: "warning" },
  { name: "サッカリンナトリウム", penalty: -5, severity: "warning" },

  // 着色料（タール系）
  { name: "赤色2号", penalty: -6, severity: "warning" },
  { name: "赤色3号", penalty: -6, severity: "warning" },
  { name: "赤色40号", penalty: -6, severity: "warning" },
  { name: "赤色102号", penalty: -6, severity: "warning" },
  { name: "赤色104号", penalty: -6, severity: "warning" },
  { name: "赤色105号", penalty: -6, severity: "warning" },
  { name: "赤色106号", penalty: -6, severity: "warning" },
  { name: "黄色4号", penalty: -6, severity: "warning" },
  { name: "黄色5号", penalty: -6, severity: "warning" },
  { name: "青色1号", penalty: -6, severity: "warning" },
  { name: "青色2号", penalty: -6, severity: "warning" },

  // 酸化防止剤
  { name: "BHA", penalty: -7, severity: "critical" },
  { name: "BHT", penalty: -7, severity: "critical" },
  { name: "ブチルヒドロキシアニソール", penalty: -7, severity: "critical" },
  { name: "ジブチルヒドロキシトルエン", penalty: -7, severity: "critical" },

  // その他の添加物
  { name: "亜硝酸ナトリウム", penalty: -8, severity: "critical" },
  { name: "カラギーナン", penalty: -4, severity: "warning" },
  { name: "リン酸塩", penalty: -3, severity: "info" },
  { name: "二酸化チタン", penalty: -5, severity: "warning" },
  { name: "ステアリン酸マグネシウム", penalty: -2, severity: "info" },
];

/**
 * 商品名・説明から添加物を検出
 */
export function detectUnsafeAdditives(
  text: string,
): Array<{ name: string; penalty: number; severity: string }> {
  const found: Array<{ name: string; penalty: number; severity: string }> = [];
  const normalizedText = text.toLowerCase();

  for (const additive of UNSAFE_ADDITIVES) {
    if (
      normalizedText.includes(additive.name.toLowerCase()) ||
      normalizedText.includes(additive.name)
    ) {
      found.push(additive);
    }
  }

  return found;
}

/**
 * 成分の安全性スコアを計算（詳細情報付き）
 */
export function calculateSafetyScoreWithDetails(
  ingredient: Ingredient,
): IngredientSafetyDetail {
  const baseScore = 90;
  let score = baseScore;

  // エビデンスレベルによる調整（変更：Sはボーナス、Aは中立）
  const evidenceBonus = {
    S: +5, // Sランクにはボーナス
    A: 0, // Aランクは中立
    B: -5,
    C: -10,
    D: -15,
  };
  const evidenceLevelPenalty = evidenceBonus[ingredient.evidenceLevel || "D"];
  score += evidenceLevelPenalty;

  // 副作用の数でペナルティ
  // 配列の場合は要素数、文字列の場合は存在する場合は1としてカウント
  const sideEffectsCount = Array.isArray(ingredient.sideEffects)
    ? ingredient.sideEffects.length
    : ingredient.sideEffects
      ? 1
      : 0;
  const sideEffectsPenalty =
    sideEffectsCount > 0 ? -Math.min(sideEffectsCount * 2, 15) : 0;
  score += sideEffectsPenalty;

  // 相互作用の数でペナルティ
  // 配列の場合は要素数、文字列の場合は存在する場合は1としてカウント
  const interactionsCount = Array.isArray(ingredient.interactions)
    ? ingredient.interactions.length
    : ingredient.interactions
      ? 1
      : 0;
  const interactionsPenalty =
    interactionsCount > 0 ? -Math.min(interactionsCount * 1.5, 10) : 0;
  score += interactionsPenalty;

  // カテゴリによる調整
  const categoryBonus =
    ingredient.category === "ビタミン" || ingredient.category === "ミネラル"
      ? 5
      : 0;
  score += categoryBonus;

  const finalScore = Math.max(Math.min(score, 100), 0); // 0-100に正規化

  return {
    name: ingredient.name,
    baseScore,
    evidenceLevelPenalty,
    sideEffectsPenalty,
    interactionsPenalty,
    categoryBonus,
    finalScore,
    sideEffectsCount,
    interactionsCount,
  };
}

/**
 * 成分の安全性スコアを計算（後方互換性のため）
 */
export function calculateSafetyScore(ingredient: Ingredient): number {
  return calculateSafetyScoreWithDetails(ingredient).finalScore;
}

/**
 * 複数の成分から総合安全性スコアを計算（配合率ベース）
 * @param ingredientsWithAmount 成分データと配合量の配列
 * @returns 安全性スコア（0-100）
 */
export function calculateSafetyScoreByRatio(
  ingredientsWithAmount: Array<{
    ingredient: Ingredient;
    amountMg: number;
  }>,
): { score: number; details: IngredientSafetyDetail[] } {
  if (ingredientsWithAmount.length === 0) {
    return { score: 50, details: [] };
  }

  // 全成分の配合量合計を計算
  const totalAmount = ingredientsWithAmount.reduce(
    (sum, item) => sum + item.amountMg,
    0,
  );

  if (totalAmount === 0) {
    return { score: 50, details: [] };
  }

  // 各成分の安全性詳細を取得
  const safetyDetails = ingredientsWithAmount.map((item) =>
    calculateSafetyScoreWithDetails(item.ingredient),
  );

  // 各成分の安全性スコアを配合率で重み付けして合計
  const weightedScore = ingredientsWithAmount.reduce((sum, item, index) => {
    const ratio = item.amountMg / totalAmount; // 配合率
    const safetyScore = safetyDetails[index].finalScore;
    return sum + safetyScore * ratio;
  }, 0);

  return {
    score: Math.round(weightedScore),
    details: safetyDetails,
  };
}

/**
 * 複数の成分から総合安全性スコアを計算（旧方式：後方互換性のため残す）
 * @deprecated 配合率ベースのcalculateSafetyScoreByRatio()を使用してください
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
 * 複数の成分から総合エビデンススコアを計算（配合率ベース）
 * @param ingredientsWithAmount 成分データと配合量の配列
 * @returns エビデンススコア（0-100）
 */
export function calculateEvidenceScoreByRatio(
  ingredientsWithAmount: Array<{
    ingredient: Ingredient;
    amountMg: number;
  }>,
): number {
  if (ingredientsWithAmount.length === 0) return 50; // デフォルト

  // 全成分の配合量合計を計算
  const totalAmount = ingredientsWithAmount.reduce(
    (sum, item) => sum + item.amountMg,
    0,
  );

  if (totalAmount === 0) return 50; // 配合量が0の場合はデフォルト

  // 各成分のエビデンススコアを配合率で重み付けして合計
  const weightedScore = ingredientsWithAmount.reduce((sum, item) => {
    const ratio = item.amountMg / totalAmount; // 配合率
    const evidenceScore = evidenceLevelToScore(item.ingredient.evidenceLevel);
    return sum + evidenceScore * ratio;
  }, 0);

  return Math.round(weightedScore);
}

/**
 * 複数の成分から総合エビデンススコアを計算（旧方式：後方互換性のため残す）
 * @deprecated 配合率ベースのcalculateEvidenceScoreByRatio()を使用してください
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
      safetyDetails: [],
    };
  }

  // エビデンススコア計算
  const evidenceScore = calculateOverallEvidenceScore(matchedIngredients);
  const evidenceLevel = scoreToEvidenceLevel(evidenceScore);

  // 安全性スコア計算（全成分を考慮、詳細情報も取得）
  const safetyDetails = matchedIngredients.map((ing) =>
    calculateSafetyScoreWithDetails(ing),
  );
  let safetyScore =
    safetyDetails.length > 0
      ? Math.round(
          safetyDetails.reduce((sum, detail) => sum + detail.finalScore, 0) /
            safetyDetails.length,
        )
      : 50;

  // 添加物・保存料のチェック
  const unsafeAdditives = detectUnsafeAdditives(productName);
  let additivesPenalty = 0;
  if (unsafeAdditives.length > 0) {
    additivesPenalty = unsafeAdditives.reduce(
      (sum, additive) => sum + additive.penalty,
      0,
    );
    safetyScore = Math.max(0, safetyScore + additivesPenalty);

    console.log(`[添加物検出] ${productName}:`, {
      添加物: unsafeAdditives.map((a) => a.name),
      ペナルティ合計: additivesPenalty,
      調整前スコア: safetyScore - additivesPenalty,
      調整後スコア: safetyScore,
    });
  }

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
    safetyDetails,
  };
}
