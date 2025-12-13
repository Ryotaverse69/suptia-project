/**
 * 商品の称号（バッジ）を判定するロジック
 *
 * 5つの称号:
 * 1. 💰 最適価格 - 複数ECサイトで最も安い価格
 * 2. 📊 高含有リード - その成分の含有量が最も多い
 * 3. 💡 高効率モデル - コスパが最も優れている
 * 4. 🔬 高エビデンス - 最高レベルの科学的根拠
 * 5. 🛡️ 高安全性 - 安全性スコア90点以上
 */

// デバッグログの制御（開発環境でのみ有効）
const DEBUG = process.env.NODE_ENV === "development";
const debugLog = DEBUG ? console.log : () => {};

export type BadgeType =
  | "lowest-price"
  | "highest-content"
  | "best-value"
  | "evidence-s"
  | "high-safety";

export interface Badge {
  type: BadgeType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const BADGE_DEFINITIONS: Record<BadgeType, Badge> = {
  "lowest-price": {
    type: "lowest-price",
    label: "最適価格",
    icon: "💰",
    color: "bg-green-50 border-green-200 text-green-700",
    description: "複数ECサイトで最も安い価格",
  },
  "highest-content": {
    type: "highest-content",
    label: "高含有リード",
    icon: "📊",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    description: "成分量が最も多い",
  },
  "best-value": {
    type: "best-value",
    label: "高効率モデル",
    icon: "💡",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    description: "コスパが最も優れている",
  },
  "evidence-s": {
    type: "evidence-s",
    label: "高エビデンス",
    icon: "🔬",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    description: "最高レベルの科学的根拠",
  },
  "high-safety": {
    type: "high-safety",
    label: "高安全性",
    icon: "🛡️",
    color: "bg-red-50 border-red-200 text-red-700",
    description: "安全性スコア90点以上",
  },
};

export interface ProductForBadgeEvaluation {
  _id: string;
  priceJPY: number;
  servingsPerContainer?: number;
  servingsPerDay?: number;
  ingredientAmount?: number; // 主要成分の含有量（mg）
  ingredientId?: string; // 主要成分のID（ingredient-vitamin-dなど）
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  safetyScore?: number;
  priceData?: Array<{
    source: string;
    amount: number;
  }>;
  // マルチビタミン対応: 全成分の配列（コスパ計算用）
  ingredients?: Array<{
    amountMgPerServing: number;
  }>;
}

/**
 * 商品が獲得している称号を判定
 */
export function evaluateBadges(
  product: ProductForBadgeEvaluation,
  allProducts: ProductForBadgeEvaluation[],
): BadgeType[] {
  const badges: BadgeType[] = [];

  // 1. 💰 最適価格判定
  if (isLowestPrice(product, allProducts)) {
    badges.push("lowest-price");
  }

  // 2. 📊 高含有リード判定
  if (isHighestContent(product, allProducts)) {
    badges.push("highest-content");
  }

  // 3. 💡 高効率モデル判定
  if (isBestValue(product, allProducts)) {
    badges.push("best-value");
  }

  // 4. 🔬 高エビデンス判定
  if (product.evidenceLevel === "S") {
    badges.push("evidence-s");
  }

  // 5. 🛡️ 高安全性判定
  if (product.safetyScore && product.safetyScore >= 90) {
    badges.push("high-safety");
  }

  return badges;
}

/**
 * 最適価格判定（複数ECサイトで最安値）
 */
function isLowestPrice(
  product: ProductForBadgeEvaluation,
  allProducts: ProductForBadgeEvaluation[],
): boolean {
  // priceDataがある場合は、複数ECサイトの中で最安値か判定
  if (product.priceData && product.priceData.length > 0) {
    const minECPrice = Math.min(...product.priceData.map((p) => p.amount));
    return minECPrice === product.priceJPY;
  }

  // 全商品の中で最安値か判定
  const minPrice = Math.min(...allProducts.map((p) => p.priceJPY));
  return product.priceJPY === minPrice;
}

/**
 * 高含有リード判定（成分量が最も多い）
 * 1日あたりの成分量で比較（同じ成分を含む商品同士）
 */
function isHighestContent(
  product: ProductForBadgeEvaluation,
  allProducts: ProductForBadgeEvaluation[],
): boolean {
  debugLog("[高含有リード判定] product:", {
    _id: product._id,
    ingredientId: product.ingredientId,
    ingredientAmount: product.ingredientAmount,
    servingsPerDay: product.servingsPerDay,
  });

  if (
    !product.ingredientAmount ||
    !product.servingsPerDay ||
    !product.ingredientId
  ) {
    debugLog("[高含有リード判定] 必須データ不足でfalse");
    return false;
  }

  // 1日あたりの成分量を計算
  const productDailyAmount = product.ingredientAmount * product.servingsPerDay;
  debugLog("[高含有リード判定] 1日あたりの成分量:", productDailyAmount);

  // 同じ成分を含む商品の中で最高含有量か判定
  const productsWithSameIngredient = allProducts.filter(
    (p) =>
      p.ingredientId === product.ingredientId &&
      p.ingredientAmount &&
      p.ingredientAmount > 0 &&
      p.servingsPerDay &&
      p.servingsPerDay > 0,
  );

  debugLog(
    "[高含有リード判定] 同じ成分の商品数:",
    productsWithSameIngredient.length,
  );

  if (productsWithSameIngredient.length === 0) return false;

  const dailyAmounts = productsWithSameIngredient.map((p) => ({
    id: p._id,
    amount: (p.ingredientAmount || 0) * (p.servingsPerDay || 1),
  }));

  const maxDailyAmount = Math.max(...dailyAmounts.map((d) => d.amount));

  debugLog(
    "[高含有リード判定] 最大1日量:",
    maxDailyAmount,
    "vs 現在の商品:",
    productDailyAmount,
  );
  debugLog(
    "[高含有リード判定] 差分:",
    Math.abs(productDailyAmount - maxDailyAmount),
  );
  debugLog("[高含有リード判定] 全商品の1日量:", dailyAmounts.slice(0, 5));

  // 浮動小数点の精度問題に対応するため、許容誤差を使用
  const tolerance = 0.001; // 0.001mg未満の差は同一とみなす
  const result = Math.abs(productDailyAmount - maxDailyAmount) < tolerance;
  debugLog("[高含有リード判定] 結果:", result);

  return result;
}

/**
 * 高効率モデル判定（コスパが最も優れている）
 * 同じ成分を含む商品同士で比較
 */
function isBestValue(
  product: ProductForBadgeEvaluation,
  allProducts: ProductForBadgeEvaluation[],
): boolean {
  // コスパ = 価格 / 成分量
  const productCostPerMg = calculateCostPerMg(product);
  debugLog(
    "[高効率モデル判定] productCostPerMg:",
    productCostPerMg,
    "ingredientId:",
    product.ingredientId,
  );

  if (productCostPerMg === null || !product.ingredientId) {
    debugLog("[高効率モデル判定] コスト計算失敗またはingredientId不足でfalse");
    return false;
  }

  // 同じ成分を含む商品の中で最もコスパが良いか判定
  const productsWithSameIngredient = allProducts.filter(
    (p) => p.ingredientId === product.ingredientId,
  );

  const costPerMgData = productsWithSameIngredient
    .map((p) => ({
      id: p._id,
      cost: calculateCostPerMg(p),
    }))
    .filter((d) => d.cost !== null);

  const costPerMgValues = costPerMgData.map((d) => d.cost) as number[];

  debugLog(
    "[高効率モデル判定] 同じ成分の商品数:",
    productsWithSameIngredient.length,
  );
  debugLog(
    "[高効率モデル判定] コスト計算できた商品数:",
    costPerMgValues.length,
  );

  if (costPerMgValues.length === 0) return false;

  const minCostPerMg = Math.min(...costPerMgValues);
  debugLog(
    "[高効率モデル判定] 最小コスト:",
    minCostPerMg,
    "vs 現在の商品:",
    productCostPerMg,
  );
  debugLog(
    "[高効率モデル判定] 差分:",
    Math.abs(productCostPerMg - minCostPerMg),
  );
  debugLog("[高効率モデル判定] 全商品のコスト:", costPerMgData.slice(0, 5));

  const tolerance = 0.01; // 0.01円/mg未満の差は同一とみなす
  const result = Math.abs(productCostPerMg - minCostPerMg) < tolerance;
  debugLog("[高効率モデル判定] 結果:", result);

  return result;
}

/**
 * マルチビタミン判定（成分数 > 3）
 */
function isMultiVitamin(
  ingredients: ProductForBadgeEvaluation["ingredients"],
): boolean {
  return !!ingredients && ingredients.length > 3;
}

/**
 * 主要成分トップ5を取得（mg量が多い順）
 */
function getTop5MajorIngredients(
  ingredients: ProductForBadgeEvaluation["ingredients"],
): NonNullable<ProductForBadgeEvaluation["ingredients"]> {
  if (!ingredients || ingredients.length === 0) return [];
  const sorted = [...ingredients].sort(
    (a, b) => (b.amountMgPerServing || 0) - (a.amountMgPerServing || 0),
  );
  return sorted.slice(0, 5);
}

/**
 * 1mgあたりのコストを計算
 *
 * マルチビタミン対応:
 * - ingredients 配列がある場合はそれを使用
 * - 成分数 > 3 の場合はトップ5成分のみで計算
 * - それ以外は従来通り ingredientAmount を使用
 */
function calculateCostPerMg(product: ProductForBadgeEvaluation): number | null {
  if (!product.servingsPerContainer || product.servingsPerContainer === 0) {
    return null;
  }

  let totalMgPerServing: number;

  // ingredients 配列がある場合（マルチビタミン対応）
  if (product.ingredients && product.ingredients.length > 0) {
    // マルチビタミンの場合はトップ5成分のみ使用
    const targetIngredients = isMultiVitamin(product.ingredients)
      ? getTop5MajorIngredients(product.ingredients)
      : product.ingredients;

    totalMgPerServing = targetIngredients.reduce(
      (sum, ing) => sum + (ing.amountMgPerServing || 0),
      0,
    );
  } else if (product.ingredientAmount && product.ingredientAmount > 0) {
    // 従来方式（主成分のみ）
    totalMgPerServing = product.ingredientAmount;
  } else {
    return null;
  }

  if (totalMgPerServing === 0) return null;

  // 総成分量（mg）
  const totalIngredientMg = totalMgPerServing * product.servingsPerContainer;

  // 1mgあたりの価格
  return product.priceJPY / totalIngredientMg;
}

/**
 * 称号の数をカウント
 */
export function getBadgeCount(badges: BadgeType[]): number {
  return badges.length;
}

/**
 * 完璧なサプリメント（5冠）判定
 */
export function isPerfectSupplement(badges: BadgeType[]): boolean {
  return badges.length === 5;
}

/**
 * バッジの表示情報を取得
 */
export function getBadgeInfo(badgeType: BadgeType): Badge {
  return BADGE_DEFINITIONS[badgeType];
}

/**
 * 商品が特定のバッジを持っているか判定
 */
export function hasBadge(
  product: { badges?: BadgeType[] },
  badgeType: BadgeType,
): boolean {
  return product.badges?.includes(badgeType) ?? false;
}
