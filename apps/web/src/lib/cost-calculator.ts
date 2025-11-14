/**
 * 実効コスト計算ロジック
 *
 * 商品の価格、成分量、摂取回数から以下を算出：
 * - 1日あたりのコスト
 * - mgあたりのコスト
 * - 正規化コスト（基準量あたりのコスト）
 */

export interface ProductCostData {
  priceJPY: number; // 価格（円）
  servingsPerDay: number; // 1日あたりの摂取回数
  servingsPerContainer: number; // 1容器あたりの回数
  ingredients: {
    amountMgPerServing: number; // 1回分あたりの含有量（mg）
  }[];
}

export interface CostCalculationResult {
  costPerDay: number; // 1日あたりのコスト（円）
  costPerServing: number; // 1回あたりのコスト（円）
  daysPerContainer: number; // 1容器で何日分か
  totalMgPerServing: number; // 1回分の総mg数
  totalMgPerDay: number; // 1日分の総mg数
  costPerMg: number; // 1mgあたりのコスト（円）
}

export interface NormalizedCostResult extends CostCalculationResult {
  baselineMg: number; // 基準量（mg）
  normalizedCost: number; // 正規化コスト（基準量あたりの円）
  costEfficiencyScore: number; // コスト効率スコア（0-100）
}

/**
 * 1日あたりのコストを計算
 *
 * @param product - 商品データ
 * @returns 1日あたりのコスト（円）
 *
 * @example
 * // ビタミンC 1000mg×250粒、¥1,980、1日2粒
 * calculateCostPerDay({
 *   priceJPY: 1980,
 *   servingsPerDay: 2,
 *   servingsPerContainer: 250,
 *   ingredients: [{ amountMgPerServing: 1000 }]
 * })
 * // => 15.84
 */
export function calculateCostPerDay(product: ProductCostData): number {
  const costPerServing = product.priceJPY / product.servingsPerContainer;
  return costPerServing * product.servingsPerDay;
}

/**
 * 1回あたりのコストを計算
 *
 * @param product - 商品データ
 * @returns 1回あたりのコスト（円）
 */
export function calculateCostPerServing(product: ProductCostData): number {
  return product.priceJPY / product.servingsPerContainer;
}

/**
 * 1容器で何日分かを計算
 *
 * @param product - 商品データ
 * @returns 日数
 */
export function calculateDaysPerContainer(product: ProductCostData): number {
  return product.servingsPerContainer / product.servingsPerDay;
}

/**
 * 1回分の総mg数を計算
 *
 * @param product - 商品データ
 * @returns 総mg数
 */
export function calculateTotalMgPerServing(product: ProductCostData): number {
  return product.ingredients.reduce(
    (sum, ingredient) => sum + ingredient.amountMgPerServing,
    0,
  );
}

/**
 * 1日分の総mg数を計算
 *
 * @param product - 商品データ
 * @returns 総mg数
 */
export function calculateTotalMgPerDay(product: ProductCostData): number {
  const totalMgPerServing = calculateTotalMgPerServing(product);
  return totalMgPerServing * product.servingsPerDay;
}

/**
 * マルチビタミン判定
 *
 * 成分数が3より多い場合、マルチビタミンとみなす
 *
 * @param product - 商品データ
 * @returns マルチビタミンかどうか
 */
export function isMultiVitaminProduct(product: ProductCostData): boolean {
  return product.ingredients.length > 3;
}

/**
 * 主要成分トップ5を取得
 *
 * mg量が多い順にソートして上位5件を返す
 * 成分数が5未満の場合は全成分を返す
 *
 * @param ingredients - 成分配列
 * @returns トップ5成分
 */
export function getTop5MajorIngredients(
  ingredients: { amountMgPerServing: number }[],
): { amountMgPerServing: number }[] {
  // mg量でソート（降順）
  const sorted = [...ingredients].sort(
    (a, b) => b.amountMgPerServing - a.amountMgPerServing,
  );

  // トップ5を返す（5件未満の場合は全件）
  return sorted.slice(0, 5);
}

/**
 * マルチビタミン用のcost/mg計算
 *
 * 主要成分トップ5（mg量が多い順）のみを使ってコスト効率を計算
 * 微量成分を除外することで、実質的な価値を正確に反映
 *
 * @param product - 商品データ
 * @returns 1mgあたりのコスト（円）
 *
 * @example
 * // マルチビタミン 22成分入り、¥1,500
 * // トップ5: ビタミンC 100mg、ビタミンE 80mg、カルシウム 100mg、マグネシウム 50mg、ビタミンB1 12mg
 * // 合計: 342mg × 30回分 = 10,260mg
 * // cost/mg = ¥1,500 / 10,260mg = ¥0.146/mg
 */
export function calculateCostPerMgForMultiVitamin(
  product: ProductCostData,
): number {
  // 主要成分トップ5を取得
  const top5Ingredients = getTop5MajorIngredients(product.ingredients);

  // トップ5の合計mg（1回分）
  const top5MgPerServing = top5Ingredients.reduce(
    (sum, ingredient) => sum + ingredient.amountMgPerServing,
    0,
  );

  // 全容器の主要成分合計mg
  const totalTop5Mg = top5MgPerServing * product.servingsPerContainer;

  if (totalTop5Mg === 0) {
    return 0;
  }

  return product.priceJPY / totalTop5Mg;
}

/**
 * 1mgあたりのコストを計算
 *
 * 成分数に応じて適切な計算方法を自動選択：
 * - 成分数 ≤ 3: 全成分を使用（単一成分系）
 * - 成分数 > 3: 主要成分トップ5のみ使用（マルチビタミン）
 *
 * @param product - 商品データ
 * @returns 1mgあたりのコスト（円）
 *
 * @example
 * // 単一成分（ビタミンC 1000mg）
 * calculateCostPerMg({ ingredients: [{ amountMgPerServing: 1000 }], ... })
 * // → 全成分を使用
 *
 * // マルチビタミン（22成分）
 * calculateCostPerMg({ ingredients: [...22 items], ... })
 * // → 主要成分トップ5のみ使用
 */
export function calculateCostPerMg(product: ProductCostData): number {
  // マルチビタミン判定
  if (isMultiVitaminProduct(product)) {
    return calculateCostPerMgForMultiVitamin(product);
  }

  // 単一成分系：従来のロジック
  const totalMg =
    calculateTotalMgPerServing(product) * product.servingsPerContainer;
  if (totalMg === 0) {
    return 0;
  }
  return product.priceJPY / totalMg;
}

/**
 * 包括的なコスト計算
 *
 * @param product - 商品データ
 * @returns すべてのコスト指標
 *
 * @example
 * const result = calculateComprehensiveCost(product);
 * console.log(result.costPerDay);     // 15.84
 * console.log(result.costPerMg);      // 0.00792
 * console.log(result.daysPerContainer); // 125
 */
export function calculateComprehensiveCost(
  product: ProductCostData,
): CostCalculationResult {
  return {
    costPerDay: calculateCostPerDay(product),
    costPerServing: calculateCostPerServing(product),
    daysPerContainer: calculateDaysPerContainer(product),
    totalMgPerServing: calculateTotalMgPerServing(product),
    totalMgPerDay: calculateTotalMgPerDay(product),
    costPerMg: calculateCostPerMg(product),
  };
}

/**
 * 正規化コストを計算（基準量あたりのコスト）
 *
 * 異なる含有量の商品を公平に比較するために、
 * 基準量（例: 1000mg）あたりのコストを算出
 *
 * @param product - 商品データ
 * @param baselineMg - 基準量（mg）デフォルト: 1000mg
 * @returns 正規化コストと詳細指標
 *
 * @example
 * // 商品A: ビタミンC 1000mg×250粒、¥1,980
 * // 商品B: ビタミンC 500mg×200粒、¥1,200
 *
 * const resultA = calculateNormalizedCost(productA, 1000);
 * const resultB = calculateNormalizedCost(productB, 1000);
 *
 * // resultA.normalizedCost = 7.92
 * // resultB.normalizedCost = 12.00
 * // → 商品Aの方がコスト効率が良い
 */
export function calculateNormalizedCost(
  product: ProductCostData,
  baselineMg: number = 1000,
): NormalizedCostResult {
  const comprehensive = calculateComprehensiveCost(product);
  const normalizedCost = comprehensive.costPerMg * baselineMg;

  // コスト効率スコア（0-100）
  // 1000mgあたり¥5以下を100点、¥50以上を0点として線形スケール
  const minCost = 5; // 最高効率（100点）
  const maxCost = 50; // 最低効率（0点）
  const costEfficiencyScore = Math.max(
    0,
    Math.min(100, ((maxCost - normalizedCost) / (maxCost - minCost)) * 100),
  );

  return {
    ...comprehensive,
    baselineMg,
    normalizedCost,
    costEfficiencyScore: Math.round(costEfficiencyScore),
  };
}

/**
 * 複数商品のコスト効率を比較
 *
 * @param products - 商品データの配列
 * @param baselineMg - 基準量（mg）
 * @returns ランキング順（コスト効率が良い順）に並んだ結果
 *
 * @example
 * const comparison = compareCostEffectiveness([productA, productB, productC]);
 * console.log(comparison[0]); // 最もコスト効率の良い商品
 */
export function compareCostEffectiveness(
  products: ProductCostData[],
  baselineMg: number = 1000,
): Array<NormalizedCostResult & { rank: number; productIndex: number }> {
  const results = products.map((product, index) => ({
    ...calculateNormalizedCost(product, baselineMg),
    productIndex: index,
  }));

  // normalizedCostでソート（昇順 = コストが安い順）
  results.sort((a, b) => a.normalizedCost - b.normalizedCost);

  // ランキングを追加
  return results.map((result, index) => ({
    ...result,
    rank: index + 1,
  }));
}

/**
 * コスト効率のベンチマーク判定
 *
 * @param normalizedCost - 正規化コスト（1000mgあたりの円）
 * @returns 判定ラベル
 */
export function getCostEfficiencyLabel(normalizedCost: number): string {
  if (normalizedCost <= 10) return "非常に優秀";
  if (normalizedCost <= 20) return "優秀";
  if (normalizedCost <= 30) return "良好";
  if (normalizedCost <= 40) return "平均的";
  return "要検討";
}

/**
 * コスト節約額を計算（vs 他商品）
 *
 * @param productA - 比較元商品
 * @param productB - 比較先商品
 * @param days - 期間（日数）デフォルト: 30日
 * @returns 節約額（円）と節約率（%）
 *
 * @example
 * const savings = calculateSavings(cheapProduct, expensiveProduct, 30);
 * console.log(savings.savingsAmount); // ¥360
 * console.log(savings.savingsRate);   // 30%
 */
export function calculateSavings(
  productA: ProductCostData,
  productB: ProductCostData,
  days: number = 30,
): {
  savingsAmount: number;
  savingsRate: number;
  cheaperProduct: "A" | "B";
} {
  const costPerDayA = calculateCostPerDay(productA);
  const costPerDayB = calculateCostPerDay(productB);

  const totalCostA = costPerDayA * days;
  const totalCostB = costPerDayB * days;

  if (totalCostA < totalCostB) {
    return {
      savingsAmount: totalCostB - totalCostA,
      savingsRate: ((totalCostB - totalCostA) / totalCostB) * 100,
      cheaperProduct: "A",
    };
  } else {
    return {
      savingsAmount: totalCostA - totalCostB,
      savingsRate: ((totalCostA - totalCostB) / totalCostA) * 100,
      cheaperProduct: "B",
    };
  }
}
