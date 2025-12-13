/**
 * Tierランク計算ロジック
 *
 * 全商品のデータから相対的な順位を計算し、S~Dランクに分類
 * 含有量ランクはハイブリッド方式（絶対評価 + 相対評価）を使用
 */

import { TierRank, scoreToTierRank, getTierScore } from "./tier-colors";
import recommendedDailyIntake from "@/data/recommended-daily-intake.json";
import { getPrimaryIngredient } from "./primary-ingredient";

export interface ProductForTierEvaluation {
  _id: string;
  priceJPY: number;
  servingsPerContainer?: number;
  servingsPerDay?: number;
  ingredients?: Array<{
    amountMgPerServing: number;
    isPrimary?: boolean;
    ingredient?: {
      name?: string;
    };
  }>;
  safetyScore?: number;
  evidenceScore?: number;
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
}

export interface TierRatings {
  priceRank: TierRank;
  costEffectivenessRank: TierRank;
  contentRank: TierRank;
  evidenceRank: TierRank;
  safetyRank: TierRank;
  overallRank?: TierRank; // 総合評価（重み付け平均）
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

  // 各商品にランクを統合し、総合評価も計算
  products.forEach((product) => {
    const tierRatings: TierRatings = {
      priceRank: priceRanks.get(product._id) || "D",
      costEffectivenessRank: costEffectivenessRanks.get(product._id) || "D",
      contentRank: contentRanks.get(product._id) || "D",
      evidenceRank: evidenceRanks.get(product._id) || "D",
      safetyRank: safetyRanks.get(product._id) || "D",
    };

    // 総合評価を計算
    tierRatings.overallRank = calculateOverallRank(tierRatings);

    rankings.set(product._id, tierRatings);
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
      overallRank: "D",
    }
  );
}

/**
 * 価格ランク計算（安いほど高ランク）
 *
 * Bessel補正パーセンタイル方式:
 * - 外れ値（超高額商品など）の影響を排除
 * - 統計学的に正確な順位計算
 */
function calculatePriceRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();
  const prices = products.map((p) => p.priceJPY);

  if (prices.length === 0) return ranks;

  products.forEach((product) => {
    // 安いほど高ランク（lowerIsBetter = true）
    const percentile = calculatePercentile(product.priceJPY, prices, true);
    ranks.set(product._id, percentileToRank(percentile));
  });

  return ranks;
}

/**
 * コスパランク計算（成分量あたり価格、低いほど高ランク）
 *
 * Bessel補正パーセンタイル方式:
 * - 外れ値（異常なコスパ値）の影響を排除
 * - マルチビタミン商品はトップ5成分で計算
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

  const costs = productsWithCost.map((p) => p.costPerMg);

  productsWithCost.forEach(({ _id, costPerMg }) => {
    // コストが低いほど高ランク（lowerIsBetter = true）
    const percentile = calculatePercentile(costPerMg, costs, true);
    ranks.set(_id, percentileToRank(percentile));
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
 * 成分名から推奨摂取量を取得
 */
function getRecommendedDose(ingredientName: string | undefined): number | null {
  if (!ingredientName) return null;

  const intakeData = recommendedDailyIntake as Record<string, number | string>;

  // 完全一致を試みる
  if (typeof intakeData[ingredientName] === "number") {
    return intakeData[ingredientName] as number;
  }

  // 部分一致を試みる
  for (const [name, dose] of Object.entries(intakeData)) {
    if (name === "_comment" || name === "_note") continue;
    if (typeof dose !== "number") continue;
    if (ingredientName.includes(name) || name.includes(ingredientName)) {
      return dose;
    }
  }

  return null;
}

/**
 * ランクを1段階上げる
 */
function upgradeRank(rank: TierRank): TierRank {
  const rankOrder: TierRank[] = ["D", "C", "B", "A", "S"];
  const currentIndex = rankOrder.indexOf(rank);
  if (currentIndex < rankOrder.length - 1) {
    return rankOrder[currentIndex + 1];
  }
  return rank;
}

/**
 * ハイブリッド方式による含有量ランク計算
 * 絶対評価（推奨摂取量に対する充足率）+ 相対評価（最高含有量ボーナス）
 */
function calculateContentRankHybrid(
  dailyAmount: number,
  ingredientName: string | undefined,
  allDailyAmounts: number[],
): TierRank {
  const recommendedDose = getRecommendedDose(ingredientName);

  // 推奨摂取量が設定されていない場合は従来の相対評価にフォールバック
  if (!recommendedDose || recommendedDose <= 0) {
    return calculateContentRankRelative(dailyAmount, allDailyAmounts);
  }

  // 推奨量に対する充足率を計算
  const fulfillmentRatio = dailyAmount / recommendedDose;

  // 絶対評価による基本ランク
  let baseRank: TierRank;
  if (fulfillmentRatio >= 5.0)
    baseRank = "S"; // 500%以上
  else if (fulfillmentRatio >= 2.0)
    baseRank = "A"; // 200%以上
  else if (fulfillmentRatio >= 1.0)
    baseRank = "B"; // 100%以上（推奨量を満たす）
  else if (fulfillmentRatio >= 0.5)
    baseRank = "C"; // 50%以上
  else baseRank = "D"; // 50%未満

  // 相対評価ボーナス: 同カテゴリ内で最高含有量なら1ランクアップ
  if (allDailyAmounts && allDailyAmounts.length > 1) {
    const maxAmount = Math.max(...allDailyAmounts);
    // 最高含有量（許容誤差0.1%）かつSランク未満の場合
    if (
      Math.abs(dailyAmount - maxAmount) / maxAmount < 0.001 &&
      baseRank !== "S"
    ) {
      baseRank = upgradeRank(baseRank);
    }
  }

  return baseRank;
}

/**
 * 従来の相対評価による含有量ランク計算（フォールバック用）
 */
function calculateContentRankRelative(
  dailyAmount: number,
  allDailyAmounts: number[],
): TierRank {
  if (!allDailyAmounts || allDailyAmounts.length === 0) return "D";

  const sortedAmounts = [...allDailyAmounts].sort((a, b) => a - b);
  const n = sortedAmounts.length;

  // 同値を考慮したパーセンタイル計算
  const belowCount = sortedAmounts.filter((a) => a < dailyAmount).length;
  const sameCount = sortedAmounts.filter((a) => a === dailyAmount).length;
  const percentile = ((belowCount + sameCount / 2) / n) * 100;

  // 含有量が多いほど高ランク
  if (percentile >= 80) return "S";
  if (percentile >= 60) return "A";
  if (percentile >= 40) return "B";
  if (percentile >= 20) return "C";
  return "D";
}

/**
 * 含有量ランク計算（ハイブリッド方式）
 */
function calculateContentRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();

  // 主要成分（isPrimary優先、なければ最初の成分）の1日あたり含有量を取得
  interface ProductContentInfo {
    _id: string;
    dailyAmount: number;
    ingredientName: string | undefined;
  }

  const productsWithContent: ProductContentInfo[] = [];

  for (const p of products) {
    // isPrimaryフラグを優先し、なければ配列の最初の成分を使用
    const primaryIngredient = getPrimaryIngredient(p.ingredients);
    if (!primaryIngredient || !primaryIngredient.amountMgPerServing) continue;

    const dailyAmount =
      primaryIngredient.amountMgPerServing * (p.servingsPerDay || 1);
    productsWithContent.push({
      _id: p._id,
      dailyAmount,
      ingredientName: primaryIngredient.ingredient?.name,
    });
  }

  if (productsWithContent.length === 0) {
    products.forEach((p) => ranks.set(p._id, "D"));
    return ranks;
  }

  // 全商品の1日あたり含有量配列
  const allDailyAmounts = productsWithContent.map((p) => p.dailyAmount);

  for (const { _id, dailyAmount, ingredientName } of productsWithContent) {
    const rank = calculateContentRankHybrid(
      dailyAmount,
      ingredientName,
      allDailyAmounts,
    );
    ranks.set(_id, rank);
  }

  // 含有量不明の商品はDランク
  products.forEach((p) => {
    if (!ranks.has(p._id)) {
      ranks.set(p._id, "D");
    }
  });

  return ranks;
}

/**
 * エビデンスランク（evidenceLevelまたはevidenceScoreから計算）
 */
function calculateEvidenceRanks(
  products: ProductForTierEvaluation[],
): Map<string, TierRank> {
  const ranks = new Map<string, TierRank>();

  products.forEach((product) => {
    // evidenceLevelが設定されていればそれを使用、なければevidenceScoreから計算
    if (product.evidenceLevel) {
      ranks.set(product._id, product.evidenceLevel);
    } else if (product.evidenceScore !== undefined) {
      ranks.set(product._id, scoreToTierRank(product.evidenceScore));
    } else {
      ranks.set(product._id, "D");
    }
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
 * マルチビタミン判定（成分数 > 3）
 *
 * マルチビタミン商品は微量成分も多く含むため、
 * コスパ計算では主要成分トップ5のみを使用する
 */
function isMultiVitamin(
  ingredients: ProductForTierEvaluation["ingredients"],
): boolean {
  return !!ingredients && ingredients.length > 3;
}

/**
 * 主要成分トップ5を取得（mg量が多い順）
 *
 * マルチビタミン商品のコスパ計算で使用
 * 微量成分を除外し、実質的な価値を反映
 */
function getTop5MajorIngredients(
  ingredients: ProductForTierEvaluation["ingredients"],
): NonNullable<ProductForTierEvaluation["ingredients"]> {
  if (!ingredients || ingredients.length === 0) return [];

  // mg量でソート（降順）
  const sorted = [...ingredients].sort(
    (a, b) => (b.amountMgPerServing || 0) - (a.amountMgPerServing || 0),
  );

  // トップ5を返す（5件未満の場合は全件）
  return sorted.slice(0, 5);
}

/**
 * 1mgあたりのコストを計算
 *
 * マルチビタミン商品（成分数 > 3）の場合:
 *   - 主要成分トップ5のみで計算（微量成分を除外）
 *   - auto-calculate-tier-ranks.mjs と同じロジック
 *
 * 単一成分系の場合:
 *   - 全成分の合計mgで計算
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

  // マルチビタミンの場合はトップ5成分のみ使用
  const targetIngredients = isMultiVitamin(product.ingredients)
    ? getTop5MajorIngredients(product.ingredients)
    : product.ingredients;

  // 1回分あたりの総成分量
  const totalMgPerServing = targetIngredients.reduce(
    (sum, ing) => sum + (ing.amountMgPerServing || 0),
    0,
  );

  if (totalMgPerServing === 0) return null;

  // 容器全体の総成分量
  const totalMgPerContainer = totalMgPerServing * product.servingsPerContainer;

  // 1mgあたりの価格
  return product.priceJPY / totalMgPerContainer;
}

/**
 * パーセンタイルを計算（Bessel補正 + 外れ値除外）
 *
 * auto-calculate-tier-ranks.mjs と同じ統計学的に正確なアルゴリズム:
 * - 外れ値除外（Trimmed Percentile）: データ数10件以上で上下5%を除外
 * - Bessel補正: 同値を考慮した平均順位方式
 *
 * @param value 評価する値
 * @param values 比較対象の値の配列（ソート不要）
 * @param lowerIsBetter trueの場合、低い方が良い（価格、コスパなど）
 * @param trimPercent 除外する割合（%）デフォルト5%
 * @returns 0-100のパーセンタイル
 */
function calculatePercentile(
  value: number,
  values: number[],
  lowerIsBetter = false,
  trimPercent = 5,
): number {
  if (values.length === 0) return 50;

  const sortedValues = [...values].sort((a, b) => a - b);

  // 外れ値除外（データ数が10件以上の場合のみ）
  let trimmedValues = sortedValues;
  if (sortedValues.length >= 10) {
    const trimCount = Math.floor(sortedValues.length * (trimPercent / 100));
    if (trimCount > 0) {
      trimmedValues = sortedValues.slice(
        trimCount,
        sortedValues.length - trimCount,
      );
    }
  }

  const N = trimmedValues.length;

  // 厳密な順位計算（平均順位方式 - Bessel補正）
  const lowerCount = trimmedValues.filter((v) => v < value).length;
  const sameCount = trimmedValues.filter((v) => v === value).length;

  // 同じ値がある場合、その範囲の中央順位を使用
  const rank = lowerCount + (sameCount + 1) / 2;

  // Bessel補正: (R - 1) / (N - 1) * 100
  const percentile = N === 1 ? 50 : ((rank - 1) / (N - 1)) * 100;

  return lowerIsBetter ? 100 - percentile : percentile;
}

/**
 * パーセンタイルからランクに変換
 */
function percentileToRank(percentile: number): TierRank {
  if (percentile >= 80) return "S";
  if (percentile >= 60) return "A";
  if (percentile >= 40) return "B";
  if (percentile >= 20) return "C";
  return "D";
}

/**
 * 5分位点を計算（20%, 40%, 60%, 80%）
 * @deprecated calculatePercentile を使用してください
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
 * 総合評価ランクを計算（重み付け平均方式 + 失格条件）
 *
 * ロジック:
 * 1. 安全性またはエビデンスがDランク → 即座に総合評価D
 * 2. すべての評価軸がSランク → S+（5冠達成）
 * 3. 上記以外 → 重み付け平均で計算
 *    - 安全性: 30%
 *    - エビデンス: 25%
 *    - コスパ: 25%
 *    - 価格: 10%
 *    - 含有量: 10%
 */
export function calculateOverallRank(ratings: TierRatings): TierRank {
  // 失格条件: 安全性またはエビデンスがDランク
  if (ratings.safetyRank === "D" || ratings.evidenceRank === "D") {
    return "D";
  }

  // S+条件: すべての評価軸がSランク（5冠達成）
  if (isPerfectProduct(ratings)) {
    return "S+";
  }

  // 重み付け平均計算
  const safetyScore = getTierScore(ratings.safetyRank);
  const evidenceScore = getTierScore(ratings.evidenceRank);
  const costEffScore = getTierScore(ratings.costEffectivenessRank);
  const priceScore = getTierScore(ratings.priceRank);
  const contentScore = getTierScore(ratings.contentRank);

  const weightedScore =
    safetyScore * 0.3 +
    evidenceScore * 0.25 +
    costEffScore * 0.25 +
    priceScore * 0.1 +
    contentScore * 0.1;

  // スコアをランクに変換（S+ = 6, S = 5, A = 4, B = 3, C = 2, D = 1）
  // 重み付け平均の範囲: 1.0 ~ 5.0（S+は既に判定済みなので除外）
  if (weightedScore >= 4.5) return "S";
  if (weightedScore >= 3.5) return "A";
  if (weightedScore >= 2.5) return "B";
  if (weightedScore >= 1.5) return "C";
  return "D";
}

/**
 * Tierランクの総合スコアを計算（S=5, A=4, B=3, C=2, D=1）
 */
export function calculateOverallTierScore(ratings: TierRatings): number {
  const scoreMap: Record<TierRank, number> = {
    "S+": 6,
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
