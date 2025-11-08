#!/usr/bin/env node

/**
 * 商品名から成分を推定し、既存の成分記事と自動的に紐付ける
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

const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

// 成分名マッピング（商品名に含まれるキーワード → 成分ID）
const ingredientMapping = {
  "ビタミンD": "ingredient-vitamin-d",
  "ビタミンD3": "ingredient-vitamin-d",
  "vitamin d": "ingredient-vitamin-d",
  "vitamin d3": "ingredient-vitamin-d",

  "ビタミンB": "ingredient-vitamin-b-complex",
  "vitamin b": "ingredient-vitamin-b-complex",

  "ビタミンB12": "ingredient-vitamin-b12",
  "vitamin b12": "ingredient-vitamin-b12",

  "ビタミンB6": "ingredient-vitamin-b6",
  "vitamin b6": "ingredient-vitamin-b6",

  "ビタミンC": "ingredient-vitamin-c",
  "vitamin c": "ingredient-vitamin-c",

  "ビタミンE": "ingredient-vitamin-e",
  "vitamin e": "ingredient-vitamin-e",

  "ビタミンK": "ingredient-vitamin-k",
  "ビタミンK2": "ingredient-vitamin-k2",
  "vitamin k": "ingredient-vitamin-k",
  "vitamin k2": "ingredient-vitamin-k2",

  "ビタミンA": "ingredient-vitamin-a",
  "vitamin a": "ingredient-vitamin-a",

  "葉酸": "ingredient-folic-acid",
  "folic acid": "ingredient-folic-acid",
  "folate": "ingredient-folic-acid",

  "ビオチン": "ingredient-biotin",
  "biotin": "ingredient-biotin",

  "ナイアシン": "ingredient-niacin",
  "niacin": "ingredient-niacin",

  "亜鉛": "ingredient-zinc",
  "zinc": "ingredient-zinc",

  "カルシウム": "ingredient-calcium",
  "calcium": "ingredient-calcium",

  "マグネシウム": "ingredient-magnesium",
  "magnesium": "ingredient-magnesium",

  "鉄": "ingredient-iron",
  "鉄分": "ingredient-iron",
  "iron": "ingredient-iron",

  "セレン": "ingredient-selenium",
  "selenium": "ingredient-selenium",

  "クロム": "ingredient-chromium",
  "chromium": "ingredient-chromium",

  "ヨウ素": "ingredient-iodine",
  "iodine": "ingredient-iodine",

  "カリウム": "ingredient-potassium",
  "potassium": "ingredient-potassium",

  "DHA": "ingredient-dha-epa",
  "EPA": "ingredient-dha-epa",
  "オメガ3": "ingredient-omega-3",
  "omega-3": "ingredient-omega-3",
  "omega 3": "ingredient-omega-3",

  "CoQ10": "ingredient-coenzyme-q10",
  "コエンザイムQ10": "ingredient-coenzyme-q10",
  "coenzyme q10": "ingredient-coenzyme-q10",

  "ルテイン": "ingredient-lutein",
  "lutein": "ingredient-lutein",

  "イソフラボン": "ingredient-soy-isoflavones",
  "エクオール": "ingredient-soy-isoflavones",
  "isoflavone": "ingredient-soy-isoflavones",

  "グルコサミン": "ingredient-glucosamine",
  "glucosamine": "ingredient-glucosamine",

  "コラーゲン": "ingredient-collagen",
  "collagen": "ingredient-collagen",

  "セサミン": "ingredient-coenzyme-q10", // 仮マッピング（セサミン記事がない場合）

  "プロバイオティクス": "ingredient-probiotics",
  "乳酸菌": "ingredient-probiotics",
  "ビフィズス菌": "ingredient-probiotics",
  "probiotics": "ingredient-probiotics",

  "クレアチン": "ingredient-creatine",
  "creatine": "ingredient-creatine",

  "BCAA": "ingredient-bcaa",
  "bcaa": "ingredient-bcaa",

  "プロテイン": "ingredient-protein",
  "protein": "ingredient-protein",
  "ホエイ": "whey-protein",
  "whey": "whey-protein",

  "グルタミン": "ingredient-glutamine",
  "glutamine": "ingredient-glutamine",

  "アシュワガンダ": "ingredient-ashwagandha",
  "ashwagandha": "ingredient-ashwagandha",

  "ウコン": "ingredient-turmeric",
  "ターメリック": "ingredient-turmeric",
  "turmeric": "ingredient-turmeric",
  "curcumin": "ingredient-turmeric",

  "ギンコ": "ingredient-ginkgo",
  "イチョウ葉": "ingredient-ginkgo-biloba",
  "ginkgo": "ingredient-ginkgo-biloba",

  "メラトニン": "ingredient-melatonin",
  "melatonin": "ingredient-melatonin",
};

async function autoLinkIngredients() {
  console.log(`🔗 成分の自動紐付け${isDryRun ? '（プレビューモード）' : ''}...\n`);

  try {
    // 主要成分未登録の商品を取得
    const products = await client.fetch(
      `*[_type == "product" && defined(ingredients) && count(ingredients) > 0] {
        _id,
        name,
        slug,
        ingredients
      }`
    );

    console.log(`📊 全商品数: ${products.length}件\n`);

    const results = {
      linked: [],
      alreadyLinked: [],
      notFound: [],
    };

    for (const product of products) {
      // データ構造エラーの商品をスキップ（referenceが直接配列に入っている）
      const hasStructureError = product.ingredients.some(
        (ing) => ing._type === "reference" && ing._ref && !ing.amountMgPerServing
      );

      if (hasStructureError) {
        results.notFound.push(product);
        continue;
      }

      // 未リンクの成分を探す（amountMgPerServingがあるもののみ）
      const unlinkedIngredients = product.ingredients.filter(
        (ing) => ing.amountMgPerServing && (!ing.ingredient || !ing.ingredient._ref)
      );

      if (unlinkedIngredients.length === 0) {
        results.alreadyLinked.push(product);
        continue;
      }

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📦 ${product.name.substring(0, 60)}...`);
      console.log(`   未リンク成分: ${unlinkedIngredients.length}/${product.ingredients.length}件\n`);

      // 商品名から成分を推定
      const productNameLower = product.name.toLowerCase();
      const matchedIngredients = [];

      for (const [keyword, ingredientId] of Object.entries(ingredientMapping)) {
        if (productNameLower.includes(keyword.toLowerCase())) {
          matchedIngredients.push({
            keyword,
            ingredientId,
          });
        }
      }

      if (matchedIngredients.length === 0) {
        console.log(`   ⚠️  商品名から成分を推定できません\n`);
        results.notFound.push(product);
        continue;
      }

      console.log(`   推定成分: ${matchedIngredients.map((m) => m.keyword).join(", ")}\n`);

      if (!isDryRun) {
        // 成分参照を更新
        const updatedIngredients = product.ingredients.map((ing, index) => {
          // 既にリンクされている場合はスキップ
          if (ing.ingredient && ing.ingredient._ref) {
            return ing;
          }

          // indexに対応する成分があればリンク
          const matchedIng = matchedIngredients[index] || matchedIngredients[0];

          // _keyを保持しつつ、ingredientフィールドのみ追加
          const { ingredient, ...rest } = ing;

          return {
            _key: ing._key || `ingredient-${Date.now()}-${index}`,
            ...rest,
            ingredient: {
              _type: "reference",
              _ref: matchedIng.ingredientId,
            },
          };
        });

        await client.patch(product._id).set({ ingredients: updatedIngredients }).commit();

        console.log(`   ✅ 成分を紐付けました\n`);
        results.linked.push(product);
      } else {
        console.log(`   ✅ 紐付け予定\n`);
        results.linked.push(product);
      }
    }

    // サマリーレポート
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 紐付け結果サマリー");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log(`全商品数: ${products.length}件`);
    console.log(`✅ 紐付け済み: ${results.alreadyLinked.length}件`);
    console.log(`🔗 紐付け実行: ${results.linked.length}件`);
    console.log(`⚠️  成分不明: ${results.notFound.length}件\n`);

    if (isDryRun) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💡 次のステップ");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      console.log("実際に紐付けを実行するには、--fix オプションを付けて実行してください:");
      console.log("  node scripts/auto-link-ingredients.mjs --fix\n");
    } else {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ 完了");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      console.log("次のステップ:");
      console.log("1. 全商品チェックスクリプトを再実行して結果を確認");
      console.log("  node scripts/check-all-products-ingredients.mjs\n");
    }
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

autoLinkIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
