/**
 * 成分名正規化ライブラリ
 *
 * 目的:
 * - 成分名の表記ゆらぎを吸収（"ビタミンC" vs "Vitamin C" vs "アスコルビン酸"）
 * - 正規名（canonical name）に統一することで、グループ化精度を向上
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ingredient-aliases.jsonの読み込み
const ingredientAliases = JSON.parse(
  readFileSync(join(__dirname, "../apps/web/src/data/ingredient-aliases.json"), "utf-8")
);

// エイリアス辞書を逆引き可能に構築（小文字化して照合）
const aliasToCanonical = new Map();

Object.entries(ingredientAliases).forEach(([canonical, data]) => {
  // 正規名自身もマッピングに追加
  aliasToCanonical.set(canonical.toLowerCase(), canonical);

  // すべてのエイリアスを小文字化してマッピング
  if (data.aliases && Array.isArray(data.aliases)) {
    data.aliases.forEach((alias) => {
      aliasToCanonical.set(alias.toLowerCase(), canonical);
    });
  }
});

/**
 * 成分名を正規化（標準化）
 *
 * @param {string} name - 入力された成分名（任意の表記）
 * @returns {string} 正規名（canonical name）または元の名前
 *
 * @example
 * normalizeIngredientName("Vitamin C") // → "ビタミンC"
 * normalizeIngredientName("リボフラビン") // → "ビタミンB2"
 * normalizeIngredientName("DHA") // → "オメガ3脂肪酸（EPA・DHA）"
 */
export function normalizeIngredientName(name) {
  if (!name || typeof name !== "string") {
    return name; // 空文字列やundefinedはそのまま返す
  }

  // 小文字化して検索
  const normalized = aliasToCanonical.get(name.toLowerCase());

  // 見つかった場合は正規名を返す、見つからない場合は元の名前を返す
  return normalized || name;
}

/**
 * 成分名が既知（登録済み）かチェック
 *
 * @param {string} name - 成分名
 * @returns {boolean} 登録済みならtrue
 */
export function isKnownIngredient(name) {
  if (!name || typeof name !== "string") return false;
  return aliasToCanonical.has(name.toLowerCase());
}

/**
 * すべての登録済み正規名を取得
 *
 * @returns {string[]} 正規名の配列
 */
export function getAllCanonicalNames() {
  return Object.keys(ingredientAliases);
}

/**
 * デバッグ用: 登録されているエイリアス数を取得
 *
 * @returns {number} エイリアス数
 */
export function getAliasCount() {
  return aliasToCanonical.size;
}
