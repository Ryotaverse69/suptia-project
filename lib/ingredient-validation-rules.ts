/**
 * 成分量の妥当性検証ルール
 *
 * 各成分の一般的な摂取量範囲を定義し、異常値を検出します。
 * 参考: 厚生労働省「日本人の食事摂取基準」、各成分の一般的な製品データ
 */

export interface IngredientValidationRule {
  /** 成分ID */
  ingredientId: string;
  /** 成分名（日本語） */
  name: string;
  /** 成分名（英語） */
  nameEn: string;
  /** 最小妥当量（mg/回） */
  minAmountMg: number;
  /** 最大妥当量（mg/回） */
  maxAmountMg: number;
  /** 一般的な摂取量（mg/回） */
  typicalAmountMg: number;
  /** 1日推奨摂取量（mg/日） */
  recommendedDailyMg: number;
  /** 上限量（mg/日） */
  upperLimitMg?: number;
  /** 単位（表示用） */
  unit: "mg" | "μg" | "IU";
  /** 単位変換係数（mgベースへの変換） */
  conversionFactor: number;
  /** 備考 */
  notes?: string;
}

/**
 * 成分別検証ルール
 *
 * 注意事項:
 * - 全ての値はmg単位で統一
 * - μg表記の成分は1000で割った値（例: 25μg = 0.025mg）
 * - IU表記の成分は換算係数を使用（例: ビタミンD 1000IU = 25μg = 0.025mg）
 */
export const INGREDIENT_VALIDATION_RULES: Record<string, IngredientValidationRule> = {
  // ビタミンD
  "ingredient-vitamin-d": {
    ingredientId: "ingredient-vitamin-d",
    name: "ビタミンD",
    nameEn: "Vitamin D",
    minAmountMg: 0.005, // 5μg (200IU)
    maxAmountMg: 0.125, // 125μg (5000IU) - 上限は100μg/日だが製品には高用量もある
    typicalAmountMg: 0.025, // 25μg (1000IU)
    recommendedDailyMg: 0.0085, // 8.5μg/日
    upperLimitMg: 0.1, // 100μg/日
    unit: "μg",
    conversionFactor: 0.001, // 1μg = 0.001mg
    notes: "1000IU = 25μg = 0.025mg、上限は100μg/日（4000IU/日）",
  },

  // ビタミンC
  "ingredient-vitamin-c": {
    ingredientId: "ingredient-vitamin-c",
    name: "ビタミンC（アスコルビン酸）",
    nameEn: "Vitamin C (Ascorbic Acid)",
    minAmountMg: 100, // 100mg
    maxAmountMg: 2000, // 2000mg
    typicalAmountMg: 1000, // 1000mg
    recommendedDailyMg: 100, // 100mg/日
    upperLimitMg: 2000, // 2000mg/日（過剰摂取でも排泄されるが目安）
    unit: "mg",
    conversionFactor: 1,
    notes: "水溶性ビタミンで過剰摂取のリスクは低い",
  },

  // カルシウム
  "ingredient-calcium": {
    ingredientId: "ingredient-calcium",
    name: "カルシウム",
    nameEn: "Calcium",
    minAmountMg: 100, // 100mg
    maxAmountMg: 600, // 600mg
    typicalAmountMg: 200, // 200mg
    recommendedDailyMg: 650, // 650mg/日（成人男性）
    upperLimitMg: 2500, // 2500mg/日
    unit: "mg",
    conversionFactor: 1,
    notes: "1回500mg超は吸収率が低下するため分割摂取が推奨",
  },

  // マグネシウム
  "ingredient-magnesium": {
    ingredientId: "ingredient-magnesium",
    name: "マグネシウム",
    nameEn: "Magnesium",
    minAmountMg: 50, // 50mg
    maxAmountMg: 350, // 350mg（サプリメントからの摂取上限）
    typicalAmountMg: 100, // 100mg
    recommendedDailyMg: 320, // 320mg/日（成人女性）
    upperLimitMg: 350, // 350mg/日（サプリメントから）
    unit: "mg",
    conversionFactor: 1,
    notes: "過剰摂取で下痢のリスク、上限は通常摂取込み700mg/日",
  },

  // オメガ3（DHA・EPA）
  "ingredient-omega-3": {
    ingredientId: "ingredient-omega-3",
    name: "DHA・EPA（オメガ3脂肪酸）",
    nameEn: "Omega-3 Fatty Acids (EPA/DHA)",
    minAmountMg: 200, // 200mg
    maxAmountMg: 3000, // 3000mg
    typicalAmountMg: 1000, // 1000mg
    recommendedDailyMg: 1000, // 1000mg/日
    upperLimitMg: 3000, // 3000mg/日
    unit: "mg",
    conversionFactor: 1,
    notes: "EPA+DHAの合計量、高用量は抗凝固作用に注意",
  },

  // 亜鉛
  "ingredient-zinc": {
    ingredientId: "ingredient-zinc",
    name: "亜鉛",
    nameEn: "Zinc",
    minAmountMg: 5, // 5mg
    maxAmountMg: 40, // 40mg
    typicalAmountMg: 10, // 10mg
    recommendedDailyMg: 10, // 10mg/日（成人男性）
    upperLimitMg: 40, // 40mg/日
    unit: "mg",
    conversionFactor: 1,
    notes: "長期的な過剰摂取は銅の吸収阻害のリスク",
  },

  // 葉酸
  "ingredient-folic-acid": {
    ingredientId: "ingredient-folic-acid",
    name: "葉酸",
    nameEn: "Folic Acid",
    minAmountMg: 0.2, // 200μg
    maxAmountMg: 1.0, // 1000μg（上限）
    typicalAmountMg: 0.4, // 400μg
    recommendedDailyMg: 0.24, // 240μg/日
    upperLimitMg: 1.0, // 1000μg/日（サプリメントから）
    unit: "μg",
    conversionFactor: 0.001, // 1μg = 0.001mg
    notes: "妊娠計画中・妊娠初期は400〜800μg推奨",
  },

  // 鉄
  "ingredient-iron": {
    ingredientId: "ingredient-iron",
    name: "鉄",
    nameEn: "Iron",
    minAmountMg: 2, // 2mg
    maxAmountMg: 40, // 40mg
    typicalAmountMg: 10, // 10mg
    recommendedDailyMg: 6.5, // 6.5mg/日（成人男性）、月経あり女性10.5mg/日
    upperLimitMg: 40, // 40mg/日（成人）
    unit: "mg",
    conversionFactor: 1,
    notes: "ヘム鉄と非ヘム鉄で吸収率が異なる、過剰摂取注意",
  },

  // ルテイン
  "ingredient-lutein": {
    ingredientId: "ingredient-lutein",
    name: "ルテイン",
    nameEn: "Lutein",
    minAmountMg: 6, // 6mg
    maxAmountMg: 40, // 40mg
    typicalAmountMg: 20, // 20mg
    recommendedDailyMg: 10, // 10mg/日（目安）
    unit: "mg",
    conversionFactor: 1,
    notes: "目の健康に推奨される量は6〜20mg/日",
  },

  // ビタミンE
  "ingredient-vitamin-e": {
    ingredientId: "ingredient-vitamin-e",
    name: "ビタミンE（トコフェロール）",
    nameEn: "Vitamin E (Tocopherol)",
    minAmountMg: 6, // 6mg（α-トコフェロール）
    maxAmountMg: 600, // 600mg
    typicalAmountMg: 100, // 100mg
    recommendedDailyMg: 6.0, // 6.0mg/日（成人女性）
    upperLimitMg: 650, // 650mg/日（α-トコフェロール）
    unit: "mg",
    conversionFactor: 1,
    notes: "α-トコフェロール換算値、IU表記の場合1IU≒0.67mg",
  },

  // ビタミンA
  "ingredient-vitamin-a": {
    ingredientId: "ingredient-vitamin-a",
    name: "ビタミンA（レチノール）",
    nameEn: "Vitamin A (Retinol)",
    minAmountMg: 0.3, // 300μg RAE
    maxAmountMg: 2.7, // 2700μg RAE（上限）
    typicalAmountMg: 0.6, // 600μg RAE
    recommendedDailyMg: 0.65, // 650μg RAE/日（成人女性）
    upperLimitMg: 2.7, // 2700μg RAE/日
    unit: "μg",
    conversionFactor: 0.001, // 1μg = 0.001mg
    notes: "レチノール活性当量（RAE）、妊娠中は過剰摂取注意",
  },

  // コラーゲン
  "ingredient-collagen": {
    ingredientId: "ingredient-collagen",
    name: "コラーゲン",
    nameEn: "Collagen",
    minAmountMg: 1000, // 1000mg
    maxAmountMg: 10000, // 10000mg
    typicalAmountMg: 5000, // 5000mg
    recommendedDailyMg: 5000, // 5000mg/日（目安）
    unit: "mg",
    conversionFactor: 1,
    notes: "美容目的では5000〜10000mg/日が一般的",
  },

  // ナイアシン（ビタミンB3）
  "ingredient-niacin": {
    ingredientId: "ingredient-niacin",
    name: "ナイアシン（ビタミンB3）",
    nameEn: "Niacin (Vitamin B3)",
    minAmountMg: 5, // 5mg
    maxAmountMg: 250, // 250mg（フラッシュフリーでない場合は注意）
    typicalAmountMg: 15, // 15mg
    recommendedDailyMg: 12, // 12mg/日（成人女性、NE）
    upperLimitMg: 250, // 250mg/日（ニコチン酸、NE）
    unit: "mg",
    conversionFactor: 1,
    notes: "ニコチン酸当量（NE）、高用量でフラッシング（紅潮）",
  },

  // ビタミンK
  "ingredient-vitamin-k": {
    ingredientId: "ingredient-vitamin-k",
    name: "ビタミンK",
    nameEn: "Vitamin K",
    minAmountMg: 0.05, // 50μg
    maxAmountMg: 0.5, // 500μg
    typicalAmountMg: 0.15, // 150μg
    recommendedDailyMg: 0.15, // 150μg/日
    unit: "μg",
    conversionFactor: 0.001, // 1μg = 0.001mg
    notes: "ワーファリン服用者は摂取制限が必要",
  },

  // アスタキサンチン
  "ingredient-astaxanthin": {
    ingredientId: "ingredient-astaxanthin",
    name: "アスタキサンチン",
    nameEn: "Astaxanthin",
    minAmountMg: 2, // 2mg
    maxAmountMg: 12, // 12mg
    typicalAmountMg: 6, // 6mg
    recommendedDailyMg: 6, // 6mg/日（目安）
    unit: "mg",
    conversionFactor: 1,
    notes: "抗酸化作用、研究では4〜12mg/日",
  },
};

/**
 * 成分量が妥当な範囲内かチェック
 */
export function validateIngredientAmount(
  ingredientId: string,
  amountMg: number
): {
  isValid: boolean;
  rule: IngredientValidationRule | null;
  severity: "error" | "warning" | "ok";
  message: string;
} {
  const rule = INGREDIENT_VALIDATION_RULES[ingredientId];

  if (!rule) {
    return {
      isValid: true, // ルールが未定義の成分はスキップ
      rule: null,
      severity: "ok",
      message: "検証ルール未定義（スキップ）",
    };
  }

  // 異常値チェック
  if (amountMg < rule.minAmountMg) {
    return {
      isValid: false,
      rule,
      severity: "error",
      message: `成分量が少なすぎます（最小: ${rule.minAmountMg}mg、実際: ${amountMg}mg）`,
    };
  }

  if (amountMg > rule.maxAmountMg) {
    return {
      isValid: false,
      rule,
      severity: "error",
      message: `成分量が多すぎます（最大: ${rule.maxAmountMg}mg、実際: ${amountMg}mg）`,
    };
  }

  // 警告レベル: 上限量を超えている（製品としては存在するが注意が必要）
  if (rule.upperLimitMg && amountMg > rule.upperLimitMg) {
    return {
      isValid: true,
      rule,
      severity: "warning",
      message: `1日上限量を超える可能性があります（上限: ${rule.upperLimitMg}mg/日、1回量: ${amountMg}mg）`,
    };
  }

  return {
    isValid: true,
    rule,
    severity: "ok",
    message: "妥当な範囲内",
  };
}

/**
 * デフォルト値（1000mg）の可能性をチェック
 */
export function isProbablyDefaultValue(
  ingredientId: string,
  amountMg: number
): boolean {
  const rule = INGREDIENT_VALIDATION_RULES[ingredientId];
  if (!rule) return false;

  // 1000mgがデフォルト値として使われている可能性が高いケース
  if (amountMg === 1000) {
    // μg単位の成分で1000mgは明らかに異常
    if (rule.unit === "μg") return true;

    // 典型的な摂取量が1000mgから大きく外れている
    if (Math.abs(rule.typicalAmountMg - 1000) / rule.typicalAmountMg > 0.5) {
      return true;
    }
  }

  return false;
}

/**
 * 成分量を人間が読みやすい形式にフォーマット
 */
export function formatIngredientAmount(
  ingredientId: string,
  amountMg: number
): string {
  const rule = INGREDIENT_VALIDATION_RULES[ingredientId];

  if (!rule) {
    return `${amountMg.toFixed(2)}mg`;
  }

  if (rule.unit === "μg") {
    const amountUg = amountMg * 1000;
    return `${amountUg.toFixed(1)}μg`;
  }

  if (rule.unit === "IU") {
    // ビタミンDの場合: 1μg = 40IU
    if (ingredientId === "ingredient-vitamin-d") {
      const amountUg = amountMg * 1000;
      const amountIU = amountUg * 40;
      return `${amountUg.toFixed(1)}μg (${amountIU.toFixed(0)}IU)`;
    }
  }

  return `${amountMg.toFixed(2)}mg`;
}
