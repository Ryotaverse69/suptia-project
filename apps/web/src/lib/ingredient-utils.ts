/**
 * Ingredient Utilities
 *
 * 成分名の正規化とエイリアス解決を行うユーティリティ
 */

import ingredientAliases from "../data/ingredient-aliases.json";

/**
 * 成分名を正規化する
 *
 * - カタカナ表記の括弧書きを除去（例: "ビタミンC（アスコルビン酸）" → "ビタミンC"）
 * - エイリアス辞書を参照して正規化名を取得
 * - 見つからない場合は元の名前を返す
 *
 * @param name - 元の成分名
 * @returns 正規化された成分名
 */
export function normalizeIngredientName(name: string): string {
  // 1. 括弧書きを除去（全角・半角両対応）
  const nameWithoutParens = name.replace(/[（(][^）)]*[）)]/g, "").trim();

  // 2. エイリアス辞書から正規化名を検索
  for (const [standardName, data] of Object.entries(ingredientAliases)) {
    // 正規化後の名前が一致する場合
    if (nameWithoutParens === standardName) {
      return standardName;
    }

    // エイリアスリストに含まれる場合
    if (
      data.aliases &&
      Array.isArray(data.aliases) &&
      data.aliases.some(
        (alias) => alias === name || alias === nameWithoutParens,
      )
    ) {
      return standardName;
    }
  }

  // 3. 見つからない場合は括弧なしの名前を返す
  return nameWithoutParens;
}

/**
 * 成分カテゴリーを取得
 *
 * @param name - 成分名（正規化前でも可）
 * @returns カテゴリー名（"ビタミン", "ミネラル", "アミノ酸" など）、見つからない場合は"その他"
 */
export function getIngredientCategory(name: string): string {
  const normalizedName = normalizeIngredientName(name);
  const data =
    ingredientAliases[normalizedName as keyof typeof ingredientAliases];
  return data?.category || "その他";
}

/**
 * 成分の英語名を取得
 *
 * @param name - 成分名（正規化前でも可）
 * @returns 英語名、見つからない場合はnull
 */
export function getIngredientEnglishName(name: string): string | null {
  const normalizedName = normalizeIngredientName(name);

  // エイリアスリストの最初の英語名を返す
  const data =
    ingredientAliases[normalizedName as keyof typeof ingredientAliases];
  if (data?.aliases && Array.isArray(data.aliases)) {
    const englishAlias = data.aliases.find((alias) => /^[a-zA-Z]/.test(alias));
    return englishAlias || null;
  }

  return null;
}
