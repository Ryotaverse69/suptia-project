/**
 * 実効コスト計算ロジック
 *
 * 商品の価格、成分量、摂取回数から以下を算出：
 * - 1日あたりのコスト
 * - mgあたりのコスト
 * - 正規化コスト（基準量あたりのコスト）
 *
 * マルチビタミン対応:
 * - 成分数 > 3 の場合、RDA充足率ベースでトップ5成分を抽出
 * - 栄養学的に重要な成分を優先して比較
 */

import rdaStandards from "@/data/rda-standards.json";

export interface ProductCostData {
  priceJPY: number; // 価格（円）
  servingsPerDay: number; // 1日あたりの摂取回数
  servingsPerContainer: number; // 1容器あたりの回数
  ingredients: {
    name?: string; // 成分名（RDA充足率計算用）
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
 * 主要成分トップ5を取得（mg量ベース - レガシー）
 *
 * mg量が多い順にソートして上位5件を返す
 * 成分数が5未満の場合は全成分を返す
 *
 * @param ingredients - 成分配列
 * @returns トップ5成分
 * @deprecated RDA充足率ベースの getTop5ByRdaCoverage を使用してください
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
 * 成分名からRDA（推奨摂取量）を取得
 *
 * RDAデータベースを検索し、該当する成分のRDA値を返す
 * 部分一致にも対応（例: "ビタミンC" で "ビタミンC" にマッチ）
 *
 * @param ingredientName - 成分名
 * @param gender - 性別（デフォルト: male）
 * @returns RDA値（mg）、見つからない場合はnull
 */
export function getRdaForIngredient(
  ingredientName: string,
  gender: "male" | "female" = "male",
): number | null {
  if (!ingredientName) return null;

  const ingredients = rdaStandards.ingredients as Record<
    string,
    { rda: { male: number; female: number } }
  >;

  // 完全一致を試みる
  if (ingredients[ingredientName]) {
    return ingredients[ingredientName].rda[gender];
  }

  // 部分一致を試みる（成分名の揺らぎに対応）
  for (const [name, data] of Object.entries(ingredients)) {
    if (ingredientName.includes(name) || name.includes(ingredientName)) {
      return data.rda[gender];
    }
  }

  return null;
}

/**
 * RDA充足率を計算
 *
 * 含有量 ÷ RDA × 100 で充足率（%）を算出
 *
 * @param ingredientName - 成分名
 * @param amountMg - 含有量（mg）
 * @param gender - 性別（デフォルト: male）
 * @returns 充足率（%）、RDAが見つからない場合はnull
 *
 * @example
 * // ビタミンC 500mg → RDA 100mg → 500%
 * calculateRdaCoverage("ビタミンC", 500) // => 500
 *
 * // ビタミンD 10μg (0.01mg) → RDA 8.5μg (0.0085mg) → 118%
 * calculateRdaCoverage("ビタミンD", 0.01) // => 117.6
 */
export function calculateRdaCoverage(
  ingredientName: string,
  amountMg: number,
  gender: "male" | "female" = "male",
): number | null {
  const rda = getRdaForIngredient(ingredientName, gender);
  if (rda === null || rda === 0) return null;

  return (amountMg / rda) * 100;
}

/**
 * UL（耐容上限量）チェック結果
 */
export interface ULCheckResult {
  /** 成分名 */
  ingredientName: string;
  /** 摂取量（mg） */
  amountMg: number;
  /** UL値（mg）、設定されていない場合はnull */
  ulValue: number | null;
  /** ULを超過しているか */
  exceedsUL: boolean;
  /** UL超過率（%）、ULが設定されていない場合はnull */
  exceedanceRate: number | null;
  /** 警告メッセージ */
  warning: string | null;
}

/**
 * 成分名からUL（耐容上限量）を取得
 *
 * @param ingredientName - 成分名
 * @returns UL値（mg）、設定されていない場合はnull
 */
export function getULForIngredient(ingredientName: string): number | null {
  if (!ingredientName) return null;

  const ingredients = rdaStandards.ingredients as Record<
    string,
    { ul: { value: number } | null }
  >;

  // 完全一致を試みる
  if (ingredients[ingredientName]?.ul) {
    return ingredients[ingredientName].ul.value;
  }

  // 部分一致を試みる
  for (const [name, data] of Object.entries(ingredients)) {
    if (ingredientName.includes(name) || name.includes(ingredientName)) {
      return data.ul?.value ?? null;
    }
  }

  return null;
}

/**
 * UL（耐容上限量）超過チェック
 *
 * 成分の摂取量がULを超えているかチェックし、警告情報を返す
 *
 * @param ingredientName - 成分名
 * @param amountMg - 摂取量（mg）
 * @returns ULチェック結果
 *
 * @example
 * // ビタミンD 150μg (0.15mg) → UL 100μg (0.1mg) → 超過
 * checkULExceedance("ビタミンD", 0.15)
 * // => { exceedsUL: true, exceedanceRate: 150, warning: "..." }
 */
export function checkULExceedance(
  ingredientName: string,
  amountMg: number,
): ULCheckResult {
  const ulValue = getULForIngredient(ingredientName);

  if (ulValue === null) {
    return {
      ingredientName,
      amountMg,
      ulValue: null,
      exceedsUL: false,
      exceedanceRate: null,
      warning: null,
    };
  }

  const exceedsUL = amountMg > ulValue;
  const exceedanceRate = (amountMg / ulValue) * 100;

  let warning: string | null = null;
  if (exceedsUL) {
    warning = `${ingredientName}の摂取量（${amountMg}mg）が耐容上限量（${ulValue}mg）を超えています`;
  }

  return {
    ingredientName,
    amountMg,
    ulValue,
    exceedsUL,
    exceedanceRate,
    warning,
  };
}

/**
 * 商品全体のULチェック
 *
 * 商品に含まれる全成分のUL超過をチェックし、
 * 超過している成分の警告リストを返す
 *
 * @param ingredients - 成分配列
 * @param servingsPerDay - 1日あたりの摂取回数
 * @returns UL超過している成分の警告リスト
 */
export function checkProductULExceedance(
  ingredients: { name?: string; amountMgPerServing: number }[],
  servingsPerDay: number = 1,
): ULCheckResult[] {
  const warnings: ULCheckResult[] = [];

  for (const ing of ingredients) {
    if (!ing.name) continue;

    // 1日あたりの摂取量を計算
    const dailyAmount = ing.amountMgPerServing * servingsPerDay;
    const result = checkULExceedance(ing.name, dailyAmount);

    if (result.exceedsUL) {
      warnings.push(result);
    }
  }

  return warnings;
}

/**
 * 商品全体のUL超過数を取得（可視化・注意喚起用）
 *
 * ULを超過している成分数に基づく参考値を返す
 * ※実際の安全性スコア減点には使用しない（UIでの警告表示用）
 *
 * @param ingredients - 成分配列
 * @param servingsPerDay - 1日あたりの摂取回数
 * @returns 超過成分数に基づく参考値（0-30）
 */
export function calculateULDeduction(
  ingredients: { name?: string; amountMgPerServing: number }[],
  servingsPerDay: number = 1,
): number {
  const warnings = checkProductULExceedance(ingredients, servingsPerDay);
  const deduction = Math.min(warnings.length * 10, 30);
  return deduction;
}

/**
 * 主要成分トップ5を取得（RDA充足率ベース）
 *
 * RDA（推奨摂取量）に対する充足率が高い順にソートして上位5件を返す
 * これにより、栄養学的に重要な成分を優先して比較できる
 *
 * 利点:
 * - カルシウム500mg vs ビタミンD 10μg のような異なる単位の成分を公平に比較
 * - 微量でも重要な成分（ビタミンD、B12など）が正しく評価される
 *
 * @param ingredients - 成分配列（name必須）
 * @param gender - 性別（デフォルト: male）
 * @returns RDA充足率順のトップ5成分
 *
 * @example
 * // マルチビタミン商品の成分
 * const ingredients = [
 *   { name: "カルシウム", amountMgPerServing: 500 },     // RDA充足率 62%
 *   { name: "ビタミンD", amountMgPerServing: 0.01 },     // RDA充足率 118%
 *   { name: "ビタミンC", amountMgPerServing: 100 },      // RDA充足率 100%
 * ];
 *
 * getTop5ByRdaCoverage(ingredients)
 * // => ビタミンD（118%）、ビタミンC（100%）、カルシウム（62%）の順
 */
export function getTop5ByRdaCoverage(
  ingredients: { name?: string; amountMgPerServing: number }[],
  gender: "male" | "female" = "male",
): { name?: string; amountMgPerServing: number; rdaCoverage: number | null }[] {
  // RDA充足率を計算して付与
  const withCoverage = ingredients.map((ing) => ({
    ...ing,
    rdaCoverage: ing.name
      ? calculateRdaCoverage(ing.name, ing.amountMgPerServing, gender)
      : null,
  }));

  // RDA充足率でソート（降順）
  // RDAが見つからない成分は後ろに回す（mg量でフォールバック）
  const sorted = [...withCoverage].sort((a, b) => {
    // 両方ともRDA充足率がある場合
    if (a.rdaCoverage !== null && b.rdaCoverage !== null) {
      return b.rdaCoverage - a.rdaCoverage;
    }
    // aのみRDA充足率がある場合、aを優先
    if (a.rdaCoverage !== null) return -1;
    // bのみRDA充足率がある場合、bを優先
    if (b.rdaCoverage !== null) return 1;
    // 両方ともRDA充足率がない場合、mg量でソート
    return b.amountMgPerServing - a.amountMgPerServing;
  });

  // トップ5を返す（5件未満の場合は全件）
  return sorted.slice(0, 5);
}

/**
 * マルチビタミン用のcost/mg計算（RDA充足率ベース）
 *
 * RDA（推奨摂取量）充足率が高い順にトップ5成分を抽出し、
 * それらの成分のみでコスト効率を計算
 *
 * 改善点:
 * - mg量だけでなく栄養学的重要度を考慮
 * - ビタミンD（微量だが重要）などが正しく評価される
 * - カルシウム（大量だが充足率は低い）に偏らない
 *
 * @param product - 商品データ
 * @param gender - 性別（デフォルト: male）
 * @returns 1mgあたりのコスト（円）
 *
 * @example
 * // マルチビタミン商品
 * // RDA充足率トップ5: ビタミンD(118%), ビタミンB12(200%), ビタミンC(100%), ...
 * // これらの合計mgでcost/mgを計算
 */
export function calculateCostPerMgForMultiVitamin(
  product: ProductCostData,
  gender: "male" | "female" = "male",
): number {
  // 成分名がある場合はRDA充足率ベースでトップ5を取得
  const hasIngredientNames = product.ingredients.some((ing) => ing.name);

  let top5Ingredients: { amountMgPerServing: number }[];

  if (hasIngredientNames) {
    // RDA充足率ベースでトップ5を取得
    top5Ingredients = getTop5ByRdaCoverage(product.ingredients, gender);
  } else {
    // 成分名がない場合は従来のmg量ベースにフォールバック
    top5Ingredients = getTop5MajorIngredients(product.ingredients);
  }

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
