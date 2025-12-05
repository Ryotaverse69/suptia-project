/**
 * 成分量バリデーションユーティリティ
 *
 * Sanity Studio で成分量入力時に異常値を検出し警告する
 * 今後のデータ入力ミスを防止するためのガードレール
 *
 * 主な検出対象:
 * 1. デフォルト値の誤用（1000mg問題）
 * 2. 単位の混同（μg → mg）
 * 3. 成分ごとの常識的な上限超過
 */

export interface IngredientValidationResult {
  isValid: boolean;
  message?: string;
  severity?: "error" | "warning" | "info";
}

/**
 * 成分ごとの推奨範囲（mg単位）
 * min: 一般的なサプリメントの最小含有量
 * max: 一般的なサプリメントの最大含有量（高用量製品を含む）
 * typical: 典型的な含有量
 * note: 注意事項
 */
interface IngredientRange {
  min: number;
  max: number;
  typical: number;
  unit: "mg" | "μg" | "IU";
  note?: string;
}

const INGREDIENT_RANGES: Record<string, IngredientRange> = {
  // ビタミン類
  "vitamin-d": {
    min: 0.005, // 5μg = 0.005mg
    max: 0.125, // 125μg = 0.125mg（5000IU相当）
    typical: 0.025, // 25μg = 1000IU
    unit: "μg",
    note: "μgで入力する場合、1μg = 0.001mgに変換してください",
  },
  "vitamin-b12": {
    min: 0.001, // 1μg
    max: 0.5, // 500μg（高用量製品）
    typical: 0.01, // 10μg
    unit: "μg",
    note: "μgで入力する場合、1μg = 0.001mgに変換してください",
  },
  "vitamin-e": {
    min: 1,
    max: 400, // 400IU相当（約268mg d-α-tocopherol）
    typical: 30,
    unit: "mg",
    note: "IU表記の場合: 1IU ≈ 0.67mg (d-α-tocopherol)",
  },
  "vitamin-c": {
    min: 30,
    max: 2000, // 高用量製品
    typical: 500,
    unit: "mg",
  },
  "vitamin-a": {
    min: 0.1,
    max: 3, // 3000μg RE相当
    typical: 0.6,
    unit: "mg",
    note: "μg REで入力する場合、1000μg = 1mgに変換してください",
  },
  "vitamin-b1": {
    min: 0.5,
    max: 100,
    typical: 10,
    unit: "mg",
  },
  "vitamin-b2": {
    min: 0.5,
    max: 100,
    typical: 10,
    unit: "mg",
  },
  "vitamin-b6": {
    min: 0.5,
    max: 100,
    typical: 10,
    unit: "mg",
  },
  biotin: {
    min: 0.01, // 10μg
    max: 0.5, // 500μg
    typical: 0.05, // 50μg
    unit: "μg",
    note: "μgで入力する場合、1μg = 0.001mgに変換してください",
  },
  "folic-acid": {
    min: 0.1, // 100μg
    max: 1, // 1000μg
    typical: 0.4, // 400μg
    unit: "μg",
    note: "μgで入力する場合、1000μg = 1mgに変換してください",
  },
  "pantothenic-acid": {
    min: 1,
    max: 100,
    typical: 10,
    unit: "mg",
  },
  niacin: {
    min: 5,
    max: 500,
    typical: 50,
    unit: "mg",
  },

  // ミネラル類
  calcium: {
    min: 50,
    max: 1200,
    typical: 300,
    unit: "mg",
  },
  magnesium: {
    min: 30,
    max: 500,
    typical: 150,
    unit: "mg",
  },
  iron: {
    min: 1,
    max: 100,
    typical: 10,
    unit: "mg",
  },
  zinc: {
    min: 5,
    max: 50,
    typical: 15,
    unit: "mg",
  },
  selenium: {
    min: 0.01, // 10μg
    max: 0.2, // 200μg
    typical: 0.05, // 50μg
    unit: "μg",
    note: "μgで入力する場合、1μg = 0.001mgに変換してください",
  },
  copper: {
    min: 0.3,
    max: 5,
    typical: 1,
    unit: "mg",
  },
  manganese: {
    min: 0.5,
    max: 15,
    typical: 3,
    unit: "mg",
  },
  chromium: {
    min: 0.02, // 20μg
    max: 0.5, // 500μg
    typical: 0.1, // 100μg
    unit: "μg",
    note: "μgで入力する場合、1μg = 0.001mgに変換してください",
  },
  potassium: {
    min: 50,
    max: 500,
    typical: 100,
    unit: "mg",
  },

  // オメガ3
  "dha-epa": {
    min: 100,
    max: 2000,
    typical: 500,
    unit: "mg",
  },
  dha: {
    min: 50,
    max: 1500,
    typical: 300,
    unit: "mg",
  },
  epa: {
    min: 50,
    max: 1500,
    typical: 300,
    unit: "mg",
  },
  "omega-3": {
    min: 100,
    max: 3000,
    typical: 1000,
    unit: "mg",
  },

  // アミノ酸・その他
  lutein: {
    min: 1,
    max: 40, // 高用量製品
    typical: 10,
    unit: "mg",
  },
  zeaxanthin: {
    min: 0.5,
    max: 10,
    typical: 2,
    unit: "mg",
  },
  astaxanthin: {
    min: 1,
    max: 24,
    typical: 6,
    unit: "mg",
  },
  "coenzyme-q10": {
    min: 30,
    max: 400,
    typical: 100,
    unit: "mg",
  },
  "alpha-lipoic-acid": {
    min: 50,
    max: 600,
    typical: 200,
    unit: "mg",
  },
  resveratrol: {
    min: 10,
    max: 500,
    typical: 100,
    unit: "mg",
  },
  curcumin: {
    min: 50,
    max: 1500,
    typical: 400,
    unit: "mg",
  },
  turmeric: {
    min: 100,
    max: 2000,
    typical: 500,
    unit: "mg",
  },
  glucosamine: {
    min: 300,
    max: 2000,
    typical: 1500,
    unit: "mg",
  },
  chondroitin: {
    min: 100,
    max: 1200,
    typical: 500,
    unit: "mg",
  },
  collagen: {
    min: 500,
    max: 10000,
    typical: 3000,
    unit: "mg",
  },
  "hyaluronic-acid": {
    min: 20,
    max: 300,
    typical: 120,
    unit: "mg",
  },
  probiotics: {
    min: 0.001, // 1億CFU表記ではなく含有量として
    max: 100,
    typical: 10,
    unit: "mg",
  },
  spirulina: {
    min: 100,
    max: 5000,
    typical: 1000,
    unit: "mg",
  },
  chlorella: {
    min: 100,
    max: 5000,
    typical: 1000,
    unit: "mg",
  },
  ginkgo: {
    min: 30,
    max: 240,
    typical: 120,
    unit: "mg",
  },
  saw_palmetto: {
    min: 80,
    max: 400,
    typical: 320,
    unit: "mg",
  },
  garlic: {
    min: 100,
    max: 2000,
    typical: 500,
    unit: "mg",
  },
  ginseng: {
    min: 50,
    max: 1000,
    typical: 200,
    unit: "mg",
  },
  maca: {
    min: 500,
    max: 3000,
    typical: 1500,
    unit: "mg",
  },
  ashwagandha: {
    min: 100,
    max: 1000,
    typical: 300,
    unit: "mg",
  },
  melatonin: {
    min: 0.5,
    max: 10,
    typical: 3,
    unit: "mg",
  },
  "l-theanine": {
    min: 50,
    max: 400,
    typical: 200,
    unit: "mg",
  },
  gaba: {
    min: 30,
    max: 750,
    typical: 200,
    unit: "mg",
  },
  lysine: {
    min: 300,
    max: 3000,
    typical: 1000,
    unit: "mg",
  },
  arginine: {
    min: 500,
    max: 6000,
    typical: 1500,
    unit: "mg",
  },
  glutamine: {
    min: 500,
    max: 10000,
    typical: 2000,
    unit: "mg",
  },
  creatine: {
    min: 1000,
    max: 10000,
    typical: 5000,
    unit: "mg",
  },
  "milk-thistle": {
    min: 50,
    max: 500,
    typical: 200,
    unit: "mg",
  },
  taurine: {
    min: 100,
    max: 3000,
    typical: 1000,
    unit: "mg",
  },
};

/**
 * 成分スラッグの正規化
 * 日本語名やバリエーションを統一されたスラッグに変換
 */
function normalizeIngredientSlug(slug: string): string {
  const normalizations: Record<string, string> = {
    // ビタミン類
    ビタミンd: "vitamin-d",
    ビタミンd3: "vitamin-d",
    vitamind: "vitamin-d",
    vitamind3: "vitamin-d",
    ビタミンe: "vitamin-e",
    vitamine: "vitamin-e",
    ビタミンc: "vitamin-c",
    vitaminc: "vitamin-c",
    ビタミンa: "vitamin-a",
    vitamina: "vitamin-a",
    ビタミンb1: "vitamin-b1",
    vitaminb1: "vitamin-b1",
    ビタミンb2: "vitamin-b2",
    vitaminb2: "vitamin-b2",
    ビタミンb6: "vitamin-b6",
    vitaminb6: "vitamin-b6",
    ビタミンb12: "vitamin-b12",
    vitaminb12: "vitamin-b12",
    葉酸: "folic-acid",
    ナイアシン: "niacin",
    パントテン酸: "pantothenic-acid",
    ビオチン: "biotin",

    // ミネラル類
    カルシウム: "calcium",
    マグネシウム: "magnesium",
    亜鉛: "zinc",
    鉄: "iron",
    鉄分: "iron",
    セレン: "selenium",
    銅: "copper",
    マンガン: "manganese",
    クロム: "chromium",
    カリウム: "potassium",

    // オメガ3
    dha: "dha",
    epa: "epa",
    dhaepa: "dha-epa",
    "dha-epa": "dha-epa",
    omega3: "omega-3",
    オメガ3: "omega-3",

    // その他
    ルテイン: "lutein",
    ゼアキサンチン: "zeaxanthin",
    アスタキサンチン: "astaxanthin",
    コエンザイムq10: "coenzyme-q10",
    coq10: "coenzyme-q10",
    αリポ酸: "alpha-lipoic-acid",
    レスベラトロール: "resveratrol",
    クルクミン: "curcumin",
    ウコン: "turmeric",
    グルコサミン: "glucosamine",
    コンドロイチン: "chondroitin",
    コラーゲン: "collagen",
    ヒアルロン酸: "hyaluronic-acid",
    乳酸菌: "probiotics",
    ビフィズス菌: "probiotics",
    スピルリナ: "spirulina",
    クロレラ: "chlorella",
    イチョウ葉: "ginkgo",
    ノコギリヤシ: "saw_palmetto",
    にんにく: "garlic",
    高麗人参: "ginseng",
    マカ: "maca",
    アシュワガンダ: "ashwagandha",
    メラトニン: "melatonin",
    テアニン: "l-theanine",
    リジン: "lysine",
    アルギニン: "arginine",
    グルタミン: "glutamine",
    クレアチン: "creatine",
    マリアアザミ: "milk-thistle",
    タウリン: "taurine",
  };

  const lowercaseSlug = slug.toLowerCase().replace(/[-_\s]/g, "");
  return normalizations[lowercaseSlug] || slug.toLowerCase();
}

/**
 * 1000mg問題の検出
 * デフォルト値としての1000mgは多くの成分で不自然
 */
function is1000mgProblem(
  amount: number,
  ingredientSlug: string,
): { isProblem: boolean; reason?: string } {
  if (amount !== 1000) {
    return { isProblem: false };
  }

  const normalized = normalizeIngredientSlug(ingredientSlug);
  const range = INGREDIENT_RANGES[normalized];

  if (!range) {
    // 範囲が定義されていない成分で1000mgは警告
    return {
      isProblem: true,
      reason:
        "1000mgはデフォルト値の可能性があります。実際の含有量を確認してください。",
    };
  }

  // 1000mgが典型的な範囲内かどうか
  if (amount > range.max) {
    return {
      isProblem: true,
      reason: `${ingredientSlug}の一般的な最大値は${range.max}mgです。1000mgはデフォルト値の可能性があります。`,
    };
  }

  return { isProblem: false };
}

/**
 * 単位混同の検出（μg成分がmg値として入力されている）
 */
function detectUnitConfusion(
  amount: number,
  ingredientSlug: string,
): { hasConfusion: boolean; reason?: string; suggestedValue?: number } {
  const normalized = normalizeIngredientSlug(ingredientSlug);
  const range = INGREDIENT_RANGES[normalized];

  if (!range || range.unit !== "μg") {
    return { hasConfusion: false };
  }

  // μgが正しい単位だが、値がmg値として入力されている場合
  // 例: ビタミンD 25μg → 25mg (間違い) → 正しくは 0.025mg
  if (amount > range.max * 10) {
    // 10倍以上なら明らかにおかしい
    const suggestedValue = amount / 1000; // μg → mg変換
    return {
      hasConfusion: true,
      reason: `${ingredientSlug}の単位はμgです。${amount}mgは${amount * 1000}μg相当で、一般的な範囲（${range.min * 1000}〜${range.max * 1000}μg）を大幅に超えています。`,
      suggestedValue,
    };
  }

  return { hasConfusion: false };
}

/**
 * 成分量のバリデーション（メイン関数）
 *
 * @param amount - 入力された含有量（mg単位）
 * @param ingredientSlug - 成分のスラッグ
 * @returns バリデーション結果
 */
export function validateIngredientAmount(
  amount: number | null | undefined,
  ingredientSlug: string | null | undefined,
): IngredientValidationResult {
  // 必須チェック
  if (amount === null || amount === undefined) {
    return {
      isValid: false,
      message: "含有量を入力してください",
      severity: "error",
    };
  }

  if (!ingredientSlug) {
    // 成分が選択されていない場合は汎用チェックのみ
    if (amount < 0) {
      return {
        isValid: false,
        message: "含有量は0以上である必要があります",
        severity: "error",
      };
    }
    return { isValid: true };
  }

  // 負の値チェック
  if (amount < 0) {
    return {
      isValid: false,
      message: "含有量は0以上である必要があります",
      severity: "error",
    };
  }

  // 0チェック
  if (amount === 0) {
    return {
      isValid: true,
      message: "含有量が0mgです。この成分は製品に含まれていますか？",
      severity: "info",
    };
  }

  // 1000mg問題の検出
  const problem1000 = is1000mgProblem(amount, ingredientSlug);
  if (problem1000.isProblem) {
    return {
      isValid: true, // 保存は許可するが警告
      message: `⚠️ ${problem1000.reason}`,
      severity: "warning",
    };
  }

  // 単位混同の検出
  const unitConfusion = detectUnitConfusion(amount, ingredientSlug);
  if (unitConfusion.hasConfusion) {
    return {
      isValid: true, // 保存は許可するが警告
      message: `⚠️ ${unitConfusion.reason}${unitConfusion.suggestedValue ? ` 正しくは${unitConfusion.suggestedValue}mgではありませんか？` : ""}`,
      severity: "warning",
    };
  }

  // 範囲チェック
  const normalized = normalizeIngredientSlug(ingredientSlug);
  const range = INGREDIENT_RANGES[normalized];

  if (range) {
    if (amount > range.max * 2) {
      // 最大値の2倍を超える場合はエラー
      return {
        isValid: false,
        message: `❌ ${ingredientSlug}の含有量${amount}mgは一般的な範囲（${range.min}〜${range.max}mg）を大幅に超えています。値を確認してください。`,
        severity: "error",
      };
    }

    if (amount > range.max) {
      // 最大値を超えるが2倍以内の場合は警告
      return {
        isValid: true,
        message: `⚠️ ${ingredientSlug}の含有量${amount}mgは一般的な最大値（${range.max}mg）を超えています。高用量製品であれば問題ありませんが、値を確認してください。`,
        severity: "warning",
      };
    }

    if (amount < range.min) {
      // 最小値未満の場合は情報提供
      return {
        isValid: true,
        message: `📝 ${ingredientSlug}の含有量${amount}mgは一般的な最小値（${range.min}mg）を下回っています。`,
        severity: "info",
      };
    }
  }

  return { isValid: true };
}

/**
 * バッチバリデーション（複数成分を一度にチェック）
 */
export function validateIngredients(
  ingredients: Array<{
    ingredient?: { slug?: { current: string } };
    amountMgPerServing: number;
  }>,
): IngredientValidationResult[] {
  return ingredients.map((ing) => {
    const slug = ing.ingredient?.slug?.current;
    return validateIngredientAmount(ing.amountMgPerServing, slug || null);
  });
}

/**
 * Sanityバリデーションルール用ラッパー
 * product.tsのingredients配列内で使用
 */
export function createIngredientAmountValidator() {
  return (Rule: {
    custom: (
      fn: (
        value: number,
        context: { parent?: { ingredient?: { _ref?: string } } },
      ) => true | string,
    ) => unknown;
  }) =>
    Rule.custom((value: number, context) => {
      // contextからingredient参照を取得
      const ingredientRef = context.parent?.ingredient?._ref;

      // 簡易バリデーション（refから完全なslugは取得できないが、基本チェックは可能）
      if (value === 1000) {
        return "⚠️ 1000mgはデフォルト値の可能性があります。実際の含有量を確認してください。";
      }

      if (
        value > 5000 &&
        !ingredientRef?.includes("collagen") &&
        !ingredientRef?.includes("glutamine") &&
        !ingredientRef?.includes("creatine")
      ) {
        return "⚠️ 含有量が5000mgを超えています。高用量製品でない場合は値を確認してください。";
      }

      return true;
    });
}

// 定数エクスポート
export { INGREDIENT_RANGES };
