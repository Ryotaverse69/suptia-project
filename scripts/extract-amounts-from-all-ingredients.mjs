#!/usr/bin/env node

/**
 * allIngredientsフィールドから成分量を抽出して更新するスクリプト
 *
 * 商品の「全成分表示」(allIngredients)に含まれる成分量情報を解析し、
 * ingredients配列のamountMgPerServingを更新します。
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// 成分名と検索パターンのマッピング
const INGREDIENT_PATTERNS = {
  'ビタミンD': [/ビタミン\s*D[\s:：…]*([0-9.]+)\s*(?:μg|mcg)/i, /V\.?\s*D[\s:：…]*([0-9.]+)\s*(?:μg|mcg)/i],
  'ビタミンC（アスコルビン酸）': [/ビタミン\s*C[\s:：…]*([0-9.]+)\s*mg/i, /V\.?\s*C[\s:：…]*([0-9.]+)\s*mg/i],
  'ビタミンE': [/ビタミン\s*E[\s:：…]*([0-9.]+)\s*mg/i, /V\.?\s*E[\s:：…]*([0-9.]+)\s*mg/i],
  'ビタミンA（レチノール）': [/ビタミン\s*A[\s:：…]*([0-9.]+)\s*(?:μg|mcg)/i, /V\.?\s*A[\s:：…]*([0-9.]+)\s*(?:μg|mcg)/i],
  '葉酸': [/葉酸[\s:：…]*([0-9.]+)\s*(?:μg|mcg)/i],
  'ナイアシン（ビタミンB3）': [/ナイアシン[\s:：…]*([0-9.]+)\s*mg/i],
  '亜鉛': [/亜鉛[\s:：…]*([0-9.]+)\s*mg/i],
  'カルシウム': [/カルシウム[\s:：…]*([0-9.]+)\s*mg/i],
  '鉄分': [/鉄[\s:：…]*([0-9.]+)\s*mg/i, /ピロリン酸鉄[\s:：…]*([0-9.]+)\s*mg/i],
  'ビタミンB群': [/ビタミン\s*B1[\s:：…]*([0-9.]+)\s*mg/i], // B1をB群の代表値として使用
  'マグネシウム': [/マグネシウム[\s:：…]*([0-9.]+)\s*mg/i],
  'オメガ3脂肪酸（EPA・DHA）': [/(?:DHA|EPA)[\s:：…]*([0-9.]+)\s*mg/i],
  'CoQ10（コエンザイムQ10）': [/(?:CoQ10|コエンザイムQ10|Q10)[\s:：…]*([0-9.]+)\s*mg/i],
  'マカ': [/マカ[\s:：…]*([0-9.]+)\s*mg/i],
  'トンカットアリ': [/トンカットアリ[\s:：…]*([0-9.]+)\s*mg/i],
};

// μg単位の成分リスト（mg変換が必要）
const UG_INGREDIENTS = ['ビタミンD', 'ビタミンA（レチノール）', '葉酸'];

/**
 * allIngredientsから特定の成分量を抽出
 * @param {string} allIngredients - 全成分表示テキスト
 * @param {string} ingredientName - 成分名
 * @returns {number|null} - 抽出された成分量（mg単位）またはnull
 */
function extractAmountFromAllIngredients(allIngredients, ingredientName) {
  if (!allIngredients || !ingredientName) return null;

  const patterns = INGREDIENT_PATTERNS[ingredientName];
  if (!patterns) return null;

  for (const pattern of patterns) {
    const match = allIngredients.match(pattern);
    if (match) {
      let amount = parseFloat(match[1]);
      // μg単位の成分はmgに変換
      if (UG_INGREDIENTS.includes(ingredientName)) {
        amount = amount / 1000;
      }
      return amount;
    }
  }

  return null;
}

/**
 * 特定の商品を更新（テスト用）
 */
async function updateSpecificProduct(slug) {
  console.log(`🔍 商品「${slug}」の成分量を更新中...\n`);

  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      allIngredients,
      ingredients[]{
        _key,
        amountMgPerServing,
        ingredient->{
          _id,
          name
        }
      }
    }`,
    { slug }
  );

  if (!product) {
    console.error(`❌ 商品が見つかりません: ${slug}`);
    return;
  }

  console.log(`📦 商品名: ${product.name}\n`);

  if (!product.allIngredients) {
    console.log("⚠️ allIngredientsが設定されていません");
    return;
  }

  const updates = [];
  const updatedIngredients = product.ingredients.map((ing) => {
    if (!ing.ingredient?.name) return ing;

    // 既に値が設定されている場合はスキップ
    if (ing.amountMgPerServing > 0) {
      console.log(`✓ ${ing.ingredient.name}: ${ing.amountMgPerServing}mg (既存値)`);
      return ing;
    }

    const extractedAmount = extractAmountFromAllIngredients(
      product.allIngredients,
      ing.ingredient.name
    );

    if (extractedAmount && extractedAmount > 0) {
      console.log(`✅ ${ing.ingredient.name}: 0mg → ${extractedAmount}mg`);
      updates.push({
        ingredientName: ing.ingredient.name,
        newAmount: extractedAmount,
      });
      return {
        ...ing,
        amountMgPerServing: extractedAmount,
      };
    } else {
      console.log(`⚠️ ${ing.ingredient.name}: 抽出できませんでした`);
      return ing;
    }
  });

  if (updates.length === 0) {
    console.log("\n⚠️ 更新対象がありません");
    return;
  }

  // 確認プロンプト
  if (process.argv.includes("--execute")) {
    console.log("\n💾 更新を実行中...");

    await client.patch(product._id).set({ ingredients: updatedIngredients }).commit();

    console.log(`\n✅ ${updates.length}件の成分量を更新しました`);
  } else {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 実行方法");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("  上記の更新を実行する場合は、以下のコマンドを実行してください:");
    console.log(`  node scripts/extract-amounts-from-all-ingredients.mjs "${slug}" --execute\n`);
  }
}

/**
 * 全商品を更新
 */
async function updateAllProducts() {
  console.log("🔍 allIngredientsから成分量を抽出中...\n");

  const products = await client.fetch(
    `*[_type == "product" && availability == "in-stock" && defined(allIngredients)]{
      _id,
      name,
      slug,
      allIngredients,
      ingredients[]{
        _key,
        amountMgPerServing,
        ingredient->{
          _id,
          name
        }
      }
    }`
  );

  console.log(`📊 全${products.length}件の商品を分析\n`);

  let totalUpdates = 0;
  const productsWithUpdates = [];

  for (const product of products) {
    if (!product.ingredients || product.ingredients.length === 0) continue;

    const productUpdates = [];

    for (const ing of product.ingredients) {
      if (!ing.ingredient?.name) continue;
      if (ing.amountMgPerServing > 0) continue;

      const extractedAmount = extractAmountFromAllIngredients(
        product.allIngredients,
        ing.ingredient.name
      );

      if (extractedAmount && extractedAmount > 0) {
        productUpdates.push({
          key: ing._key,
          ingredientName: ing.ingredient.name,
          newAmount: extractedAmount,
        });
        totalUpdates++;
      }
    }

    if (productUpdates.length > 0) {
      productsWithUpdates.push({
        product,
        updates: productUpdates,
      });
    }
  }

  console.log(`📊 抽出結果: ${totalUpdates}件の成分量を更新可能\n`);

  if (productsWithUpdates.length === 0) {
    console.log("✅ 更新対象がありません\n");
    return;
  }

  // 結果表示
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 抽出された成分量（確認）");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  productsWithUpdates.slice(0, 20).forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.product.name.substring(0, 70)}...`
    );
    item.updates.forEach((update) => {
      console.log(`   ✅ ${update.ingredientName}: 0mg → ${update.newAmount}mg`);
    });
    console.log("");
  });

  if (productsWithUpdates.length > 20) {
    console.log(`   ... 他${productsWithUpdates.length - 20}商品\n`);
  }

  // 実行
  if (process.argv.includes("--execute")) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💾 更新を実行中...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    for (const item of productsWithUpdates) {
      const updatedIngredients = item.product.ingredients.map((ing) => {
        const update = item.updates.find((u) => u.key === ing._key);
        if (update) {
          return {
            ...ing,
            amountMgPerServing: update.newAmount,
          };
        }
        return ing;
      });

      await client
        .patch(item.product._id)
        .set({ ingredients: updatedIngredients })
        .commit();

      console.log(`✅ ${item.product.name.substring(0, 50)}...`);
    }

    console.log(`\n✅ ${productsWithUpdates.length}商品の成分量を更新しました\n`);
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 実行方法");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("  上記の更新を実行する場合は、以下のコマンドを実行してください:");
    console.log("  node scripts/extract-amounts-from-all-ingredients.mjs --execute\n");
    console.log("  特定の商品のみ更新する場合:");
    console.log('  node scripts/extract-amounts-from-all-ingredients.mjs "商品スラッグ" --execute\n');
  }
}

// メイン処理
const slug = process.argv[2];
if (slug && !slug.startsWith("--")) {
  updateSpecificProduct(slug)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ エラーが発生しました:", error);
      process.exit(1);
    });
} else {
  updateAllProducts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ エラーが発生しました:", error);
      process.exit(1);
    });
}
