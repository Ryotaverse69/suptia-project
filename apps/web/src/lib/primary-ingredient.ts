/**
 * 主成分判定ユーティリティ
 *
 * 商品の主成分を一貫した方法で判定する
 * 優先順位:
 * 1. isPrimary: true が設定された成分
 * 2. 含有量（amountMgPerServing）が最も多い成分
 * 3. 配列の最初（0番目）の成分
 */

export interface IngredientItem {
  amountMgPerServing: number;
  isPrimary?: boolean;
  ingredient?: {
    _id?: string;
    name?: string;
    nameEn?: string;
    slug?: { current: string };
    evidenceLevel?: "S" | "A" | "B" | "C" | "D";
    category?: string;
  };
}

/**
 * 商品の主成分を取得
 *
 * @param ingredients 成分配列
 * @returns 主成分、存在しない場合はnull
 */
export function getPrimaryIngredient<T extends IngredientItem>(
  ingredients: T[] | undefined | null,
): T | null {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  // isPrimary: true の成分を優先
  const primaryMarked = ingredients.find((ing) => ing.isPrimary === true);
  if (primaryMarked) {
    return primaryMarked;
  }

  // 含有量が最も多い成分を選択（マルチビタミン対応）
  const highestAmount = ingredients.reduce(
    (max, ing) =>
      (ing.amountMgPerServing || 0) > (max.amountMgPerServing || 0) ? ing : max,
    ingredients[0],
  );

  return highestAmount;
}

/**
 * 商品の主成分IDを取得
 *
 * @param ingredients 成分配列
 * @returns 主成分のID、存在しない場合はnull
 */
export function getPrimaryIngredientId(
  ingredients: IngredientItem[] | undefined | null,
): string | null {
  const primary = getPrimaryIngredient(ingredients);
  return primary?.ingredient?._id ?? null;
}

/**
 * 商品の主成分量（mg/serving）を取得
 *
 * @param ingredients 成分配列
 * @returns 主成分量、存在しない場合は0
 */
export function getPrimaryIngredientAmount(
  ingredients: IngredientItem[] | undefined | null,
): number {
  const primary = getPrimaryIngredient(ingredients);
  return primary?.amountMgPerServing ?? 0;
}
