/**
 * Tierランク計算ロジック
 *
 * 全商品のデータから相対的な順位を計算し、S~Dランクに分類
 */

import { TierRank, scoreToTierRank } from "./tier-colors";

export interface ProductForTierEvaluation {
  _id: string;
  priceJPY: number;
  servingsPerContainer?: number;
  servingsPerDay?: number;
  ingredients?: Array<{
    amountMgPerServing: number;
  }>;
  safetyScore?: number;
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
}

export interface TierRatings {
  priceRank: TierRank;
  costEffectivenessRank: TierRank;
  contentRank: TierRank;
  evidenceRank: TierRank;
  safetyRank: TierRank;
}

/**
 * 全商品のTierランクを一括計算
 */
export function calculateAllTierRankings(
  products: ProductForTierEvaluation[],
): Map<string, TierRatings> {
  const rankings = new Map<string, TierRatings>();

  // 1. 価格ランク計算
  const priceRanks = calculatePriceRanks(products);

  // 2. コスパランク計算
  const costEffectivenessRanks = calculateCostEffectivenessRanks(products);

  // 3. 含有量ランク計算
  const contentRanks = calculateContentRanks(products);

  // 4. エビデンスランク（既存データを流用）
  const evidenceRanks = calculateEvidenceRanks(products);

  // 5. 安全性ランク（safetyScoreを変換）
  const safetyRanks = calculateSafetyRanks(products);

  // 各商品にランクを統合
  products.forEach((product) => {
    rankings.set(product._id, {
      priceRank: priceRanks.get(product._id) || "D",
      costEffectivenessRank: costEffectivenessRanks.get(product._id) || "D",
      contentRank: contentRanks.get(product._id) || "D",
      evidenceRank: evidenceRanks.get(product._id) || "D",
      safetyRank: safetyRanks.get(product._id) || "D",
    });
  });

  return rankings;
}

/**
 * 単一商品のTierランクを計算
 */
export function calculateTierRankings(
  product: ProductForTierEvaluation,
  allProducts: ProductForTierEvaluation[],
): TierRatings {
  const allRankings = calculateAllTierRankings(allProducts);
  return (
    allRankings.get(product._id) || {
      priceRank: "D",
      costEffectivenessRank: "D",
      contentRank: "D",
      evidenceRank: "D",
      safetyRank: "D",
    }
  );
}

/**
 * 価格ランク計算（安いほど高ランク）
 */
function calculatePriceRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();
  const prices = products.map((p) => p.priceJPY).sort((a, b) => a - b);

  if (prices.length === 0) return ranks;

  // 5分位点を計算
  const quintiles = calculateQuintiles(prices);

  products.forEach((product) => {
    const price = product.priceJPY;
    let rank: TierRank = "D";

    // 安いほど高ランク（逆順）
    if (price <= quintiles[0]) rank = "S";
    else if (price <= quintiles[1]) rank = "A";
    else if (price <= quintiles[2]) rank = "B";
    else if (price <= quintiles[3]) rank = "C";
    else rank = "D";

    ranks.set(product._id, rank);
  });

  return ranks;
}

/**
 * コスパランク計算（成分量あたり価格、低いほど高ランク）
 */
function calculateCostEffectivenessRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();

  // コスパ計算可能な商品のみ抽出
  const productsWithCost = products
    .map((p) => ({
      _id: p._id,
      costPerMg: calculateCostPerMg(p),
    }))
    .filter((p) => p.costPerMg !== null) as Array<{
    _id: string;
    costPerMg: number;
  }>;

  if (productsWithCost.length === 0) {
    // データがない場合は全てDランク
    products.forEach((p) => ranks.set(p._id, "D"));
    return ranks;
  }

  const costs = productsWithCost.map((p) => p.costPerMg).sort((a, b) => a - b);
  const quintiles = calculateQuintiles(costs);

  productsWithCost.forEach(({ _id, costPerMg }) => {
    let rank: TierRank = "D";

    // コストが低いほど高ランク（逆順）
    if (costPerMg <= quintiles[0]) rank = "S";
    else if (costPerMg <= quintiles[1]) rank = "A";
    else if (costPerMg <= quintiles[2]) rank = "B";
    else if (costPerMg <= quintiles[3]) rank = "C";
    else rank = "D";

    ranks.set(_id, rank);
  });

  // コスパ計算不可の商品はDランク
  products.forEach((p) => {
    if (!ranks.has(p._id)) {
      ranks.set(p._id, "D");
    }
  });

  return ranks;
}

/**
 * 含有量ランク計算（多いほど高ランク）
 */
function calculateContentRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();

  // 主要成分の含有量を取得
  const productsWithContent = products
    .map((p) => ({
      _id: p._id,
      totalContent: getTotalIngredientAmount(p),
    }))
    .filter((p) => p.totalContent !== null) as Array<{
    _id: string;
    totalContent: number;
  }>;

  if (productsWithContent.length === 0) {
    products.forEach((p) => ranks.set(p._id, "D"));
    return ranks;
  }

  const contents = productsWithContent
    .map((p) => p.totalContent)
    .sort((a, b) => a - b);
  const quintiles = calculateQuintiles(contents);

  productsWithContent.forEach(({ _id, totalContent }) => {
    let rank: TierRank = "D";

    // 含有量が多いほど高ランク（正順）
    if (totalContent >= quintiles[3]) rank = "S";
    else if (totalContent >= quintiles[2]) rank = "A";
    else if (totalContent >= quintiles[1]) rank = "B";
    else if (totalContent >= quintiles[0]) rank = "C";
    else rank = "D";

    ranks.set(_id, rank);
  });

  // 含有量不明の商品はDランク
  products.forEach((p) => {
    if (!ranks.has(p._id)) {
      ranks.set(p._id, "D");
    }
  });

  return ranks;
}

/**
 * エビデンスランク（既存データを流用）
 */
function calculateEvidenceRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();

  products.forEach((product) => {
    ranks.set(product._id, product.evidenceLevel || "D");
  });

  return ranks;
}

/**
 * 安全性ランク（safetyScoreを変換）
 */
function calculateSafetyRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();

  products.forEach((product) => {
    const score = product.safetyScore || 0;
    ranks.set(product._id, scoreToTierRank(score));
  });

  return ranks;
}

/**
 * 1mgあたりのコストを計算
 */
function calculateCostPerMg(product: ProductForTierEvaluation): number | null {
  if (
    !product.ingredients ||
    product.ingredients.length === 0 ||
    !product.servingsPerContainer ||
    !product.servingsPerDay
  ) {
    return null;
  }

  // 1回分あたりの総成分量
  const totalMgPerServing = product.ingredients.reduce(
    (sum, ing) => sum + ing.amountMgPerServing,
    0,
  );

  if (totalMgPerServing === 0) return null;

  // 容器全体の総成分量
  const totalMgPerContainer = totalMgPerServing * product.servingsPerContainer;

  // 1mgあたりの価格
  return product.priceJPY / totalMgPerContainer;
}

/**
 * 商品の総成分量を取得
 */
function getTotalIngredientAmount(
  product: ProductForTierEvaluation,
): number | null {
  if (!product.ingredients || product.ingredients.length === 0) {
    return null;
  }

  // 1回分あたりの総成分量
  return product.ingredients.reduce(
    (sum, ing) => sum + ing.amountMgPerServing,
    0,
  );
}

/**
 * 5分位点を計算（20%, 40%, 60%, 80%）
 */
function calculateQuintiles(
  sortedValues: number[],
): [number, number, number, number] {
  const len = sortedValues.length;
  if (len === 0) return [0, 0, 0, 0];
  if (len === 1)
    return [sortedValues[0], sortedValues[0], sortedValues[0], sortedValues[0]];

  const q1 = sortedValues[Math.floor(len * 0.2)];
  const q2 = sortedValues[Math.floor(len * 0.4)];
  const q3 = sortedValues[Math.floor(len * 0.6)];
  const q4 = sortedValues[Math.floor(len * 0.8)];

  return [q1, q2, q3, q4];
}

/**
 * 5冠達成判定（すべてSランク）
 */
export function isPerfectProduct(ratings: TierRatings): boolean {
  return (
    ratings.priceRank === "S" &&
    ratings.costEffectivenessRank === "S" &&
    ratings.contentRank === "S" &&
    ratings.evidenceRank === "S" &&
    ratings.safetyRank === "S"
  );
}

/**
 * Tierランクの総合スコアを計算（S=5, A=4, B=3, C=2, D=1）
 */
export function calculateOverallTierScore(ratings: TierRatings): number {
  const scoreMap: Record<TierRank, number> = {
    S: 5,
    A: 4,
    B: 3,
    C: 2,
    D: 1,
  };

  return (
    scoreMap[ratings.priceRank] +
    scoreMap[ratings.costEffectivenessRank] +
    scoreMap[ratings.contentRank] +
    scoreMap[ratings.evidenceRank] +
    scoreMap[ratings.safetyRank]
  );
}
