/**
 * 商品の称号（バッジ）を判定するロジック
 *
 * 5つの称号（すべてSランク）:
 * 1. 💰 価格S - 複数ECサイトで最も安い価格
 * 2. 📊 含有量S - その成分の含有量が最も多い
 * 3. 💡 コスパS - コスパが最も優れている
 * 4. 🔬 エビデンスS - 最高レベルの科学的根拠
 * 5. 🛡️ 安全性S - 安全性スコア90点以上
 */

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
    label: "価格S",
    icon: "💰",
    color: "bg-green-50 border-green-200 text-green-700",
    description: "複数ECサイトで最も安い価格",
  },
  "highest-content": {
    type: "highest-content",
    label: "含有量S",
    icon: "📊",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    description: "成分量が最も多い",
  },
  "best-value": {
    type: "best-value",
    label: "コスパS",
    icon: "💡",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    description: "コスパが最も優れている",
  },
  "evidence-s": {
    type: "evidence-s",
    label: "エビデンスS",
    icon: "🔬",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    description: "最高レベルの科学的根拠",
  },
  "high-safety": {
    type: "high-safety",
    label: "安全性S",
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
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  safetyScore?: number;
  priceData?: Array<{
    source: string;
    amount: number;
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

  // 1. 💰 価格S判定
  if (isLowestPrice(product, allProducts)) {
    badges.push("lowest-price");
  }

  // 2. 📊 含有量S判定
  if (isHighestContent(product, allProducts)) {
    badges.push("highest-content");
  }

  // 3. 💡 コスパS判定
  if (isBestValue(product, allProducts)) {
    badges.push("best-value");
  }

  // 4. 🔬 エビデンスS判定
  if (product.evidenceLevel === "S") {
    badges.push("evidence-s");
  }

  // 5. 🛡️ 安全性S判定
  if (product.safetyScore && product.safetyScore >= 90) {
    badges.push("high-safety");
  }

  return badges;
}

/**
 * 価格S判定（最安値）
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
 * 含有量S判定（最高含有量）
 */
function isHighestContent(
  product: ProductForBadgeEvaluation,
  allProducts: ProductForBadgeEvaluation[],
): boolean {
  if (!product.ingredientAmount) return false;

  // 同じ成分を含む商品の中で最高含有量か判定
  const productsWithIngredient = allProducts.filter(
    (p) => p.ingredientAmount && p.ingredientAmount > 0,
  );

  if (productsWithIngredient.length === 0) return false;

  const maxAmount = Math.max(
    ...productsWithIngredient.map((p) => p.ingredientAmount || 0),
  );
  return product.ingredientAmount === maxAmount;
}

/**
 * コスパS判定（ベストバリュー）
 */
function isBestValue(
  product: ProductForBadgeEvaluation,
  allProducts: ProductForBadgeEvaluation[],
): boolean {
  // コスパ = 価格 / 成分量
  const productCostPerMg = calculateCostPerMg(product);
  if (productCostPerMg === null) return false;

  // 全商品の中で最もコスパが良いか判定
  const costPerMgValues = allProducts
    .map((p) => calculateCostPerMg(p))
    .filter((v) => v !== null) as number[];

  if (costPerMgValues.length === 0) return false;

  const minCostPerMg = Math.min(...costPerMgValues);
  return Math.abs(productCostPerMg - minCostPerMg) < 0.01; // 誤差許容
}

/**
 * 1mgあたりのコストを計算
 */
function calculateCostPerMg(product: ProductForBadgeEvaluation): number | null {
  if (!product.ingredientAmount || product.ingredientAmount === 0) {
    return null;
  }

  if (!product.servingsPerContainer || product.servingsPerContainer === 0) {
    return null;
  }

  // 総成分量（mg）
  const totalIngredientMg =
    product.ingredientAmount * product.servingsPerContainer;

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
