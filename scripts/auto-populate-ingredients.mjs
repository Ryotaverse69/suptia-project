#!/usr/bin/env node

/**
 * 商品名から成分を自動抽出してSanityに設定するスクリプト
 *
 * 使い方:
 *   npm run tsx scripts/auto-populate-ingredients.mjs [--dry-run]
 *
 * --dry-run: 実際の更新をせずに、どの商品にどの成分が設定されるかをプレビュー
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

// コマンドライン引数からdry-runモードを取得
const isDryRun = process.argv.includes("--dry-run");

// 成分抽出パターン（商品名から成分名と量を抽出）
const ingredientPatterns = [
  // ビタミンD
  {
    pattern: /ビタミンd|vitamin\s*d/i,
    ingredientSlug: "ingredient-vitamin-d",
    ingredientName: "ビタミンD",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:μg|mcg|ug)/i);
      if (match) {
        return parseFloat(match[1]) / 1000; // μgからmgに変換
      }
      const iuMatch = name.match(/(\d+)\s*iu/i);
      if (iuMatch) {
        return parseFloat(iuMatch[1]) * 0.025 / 1000; // IU to mg (1 IU = 0.025 μg)
      }
      return 0.025; // デフォルト: 25μg = 0.025mg (1000 IU相当)
    }
  },
  // ビタミンC
  {
    pattern: /ビタミンc|vitamin\s*c|アスコルビン酸/i,
    ingredientSlug: "ingredient-vitamin-c",
    ingredientName: "ビタミンC（アスコルビン酸）",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 1000; // デフォルト: 1000mg
    }
  },
  // カルシウム
  {
    pattern: /カルシウム|calcium/i,
    ingredientSlug: "ingredient-calcium",
    ingredientName: "カルシウム",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 500; // デフォルト: 500mg
    }
  },
  // マグネシウム
  {
    pattern: /マグネシウム|magnesium/i,
    ingredientSlug: "ingredient-magnesium",
    ingredientName: "マグネシウム",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 200; // デフォルト: 200mg
    }
  },
  // DHA/EPA
  {
    pattern: /dha|epa|オメガ3|omega\s*3/i,
    ingredientSlug: "ingredient-omega-3",
    ingredientName: "DHA・EPA（オメガ3脂肪酸）",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 500; // デフォルト: 500mg
    }
  },
  // 亜鉛
  {
    pattern: /亜鉛|zinc/i,
    ingredientSlug: "ingredient-zinc",
    ingredientName: "亜鉛",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 15; // デフォルト: 15mg
    }
  },
  // 葉酸
  {
    pattern: /葉酸|folic\s*acid/i,
    ingredientSlug: "ingredient-folic-acid",
    ingredientName: "葉酸",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:μg|mcg|ug)/i);
      return match ? parseFloat(match[1]) / 1000 : 0.4; // デフォルト: 400μg = 0.4mg
    }
  },
  // 鉄
  {
    pattern: /鉄|iron|アイアン/i,
    ingredientSlug: "ingredient-iron",
    ingredientName: "鉄",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 10; // デフォルト: 10mg
    }
  },
  // ルテイン
  {
    pattern: /ルテイン|lutein/i,
    ingredientSlug: "ingredient-lutein",
    ingredientName: "ルテイン",
    extractAmount: (name) => {
      const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
      return match ? parseFloat(match[1]) : 20; // デフォルト: 20mg
    }
  },
  // セサミン（成分マスタに未登録のためスキップ）
  // {
  //   pattern: /セサミン|sesamin/i,
  //   ingredientSlug: "ingredient-sesamin",
  //   ingredientName: "セサミン",
  //   extractAmount: (name) => {
  //     const match = name.match(/(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i);
  //     return match ? parseFloat(match[1]) : 10; // デフォルト: 10mg
  //   }
  // },
];

/**
 * 商品名から成分を抽出
 */
function extractIngredientsFromName(productName) {
  const extractedIngredients = [];

  for (const pattern of ingredientPatterns) {
    if (pattern.pattern.test(productName)) {
      const amount = pattern.extractAmount(productName);
      extractedIngredients.push({
        ingredientRef: pattern.ingredientSlug,
        ingredientName: pattern.ingredientName,
        amountMgPerServing: amount,
      });
    }
  }

  return extractedIngredients;
}

async function autoPopulateIngredients() {
  console.log(`🔍 商品名から成分を自動抽出して設定${isDryRun ? '（プレビューモード）' : ''}...\n`);

  try {
    // 成分データが空または不完全な商品を取得
    const products = await client.fetch(
      `*[_type == "product" && availability == "in-stock"] | order(name asc){
        _id,
        name,
        'hasIngredients': defined(ingredients) && count(ingredients) > 0,
        'ingredientCount': count(ingredients)
      }`
    );

    console.log(`📊 全${products.length}件の商品を確認\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let noMatchCount = 0;

    for (const product of products) {
      const extracted = extractIngredientsFromName(product.name);

      if (extracted.length === 0) {
        noMatchCount++;
        console.log(`⏭️  スキップ（成分を検出できず）: ${product.name}`);
        continue;
      }

      // すでに成分データがある場合はスキップ（上書きしない）
      if (product.hasIngredients && product.ingredientCount > 0) {
        skippedCount++;
        console.log(`⏭️  スキップ（既に成分データあり）: ${product.name}`);
        continue;
      }

      console.log(`✨ ${product.name}`);
      console.log(`   検出された成分:`);
      extracted.forEach(ing => {
        console.log(`     - ${ing.ingredientName}: ${ing.amountMgPerServing}mg/回`);
      });

      if (!isDryRun) {
        // Sanityに更新
        const ingredientsArray = extracted.map(ing => ({
          _type: 'productIngredient',
          _key: ing.ingredientRef.replace('ingredient-', ''),
          ingredient: {
            _type: 'reference',
            _ref: ing.ingredientRef,
          },
          amountMgPerServing: ing.amountMgPerServing,
        }));

        await client
          .patch(product._id)
          .set({ ingredients: ingredientsArray })
          .commit();

        console.log(`   ✅ Sanityに保存しました`);
      } else {
        console.log(`   🔍 （dry-runモード: 実際には更新していません）`);
      }

      updatedCount++;
      console.log('');
    }

    console.log('\n📈 結果:');
    console.log(`   ✅ 更新${isDryRun ? '予定' : '完了'}: ${updatedCount}件`);
    console.log(`   ⏭️  スキップ（既存データあり）: ${skippedCount}件`);
    console.log(`   ⚠️  スキップ（成分検出不可）: ${noMatchCount}件`);

    if (isDryRun) {
      console.log('\n💡 実際に更新するには、--dry-run オプションを外して再実行してください');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

autoPopulateIngredients()
  .then(() => {
    console.log('\n\n✅ 処理完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
