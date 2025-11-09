#!/usr/bin/env node

/**
 * 成分データなし商品の詳細分析
 *
 * 目的:
 * 1. 36件の商品の詳細情報を取得
 * 2. 商品名から推測される主要成分を提案
 * 3. 楽天APIで詳細情報が取得可能か確認
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// 商品名から主要成分を推測
function guessMainIngredient(productName) {
  const name = productName.toLowerCase();

  const ingredientPatterns = [
    { pattern: /ビタミンd|vitamin\s*d/i, ingredient: "ingredient-vitamin-d", name: "ビタミンD" },
    { pattern: /ビタミンc|vitamin\s*c/i, ingredient: "ingredient-vitamin-c", name: "ビタミンC（アスコルビン酸）" },
    { pattern: /ビタミンe|vitamin\s*e/i, ingredient: "ingredient-vitamin-e", name: "ビタミンE" },
    { pattern: /ビタミンb|vitamin\s*b/i, ingredient: "ingredient-vitamin-b-complex", name: "ビタミンB群" },
    { pattern: /葉酸|folic|folate/i, ingredient: "ingredient-folic-acid", name: "葉酸" },
    { pattern: /カルシウム|calcium/i, ingredient: "ingredient-calcium", name: "カルシウム" },
    { pattern: /マグネシウム|magnesium/i, ingredient: "ingredient-magnesium", name: "マグネシウム" },
    { pattern: /亜鉛|zinc/i, ingredient: "ingredient-zinc", name: "亜鉛" },
    { pattern: /鉄|iron|ヘム鉄/i, ingredient: "ingredient-iron", name: "鉄" },
    { pattern: /dha|epa|オメガ/i, ingredient: "ingredient-dha-epa", name: "DHA・EPA" },
    { pattern: /ルテイン|lutein/i, ingredient: "ingredient-lutein", name: "ルテイン" },
    { pattern: /ブルーベリー|blueberry|ビルベリー/i, ingredient: "ingredient-bilberry", name: "ビルベリー（ブルーベリー）" },
    { pattern: /コラーゲン|collagen/i, ingredient: "ingredient-collagen", name: "コラーゲン" },
    { pattern: /プラセンタ|placenta/i, ingredient: "ingredient-placenta", name: "プラセンタ" },
    { pattern: /マカ|maca/i, ingredient: "ingredient-maca", name: "マカ" },
    { pattern: /乳酸菌|lactobacillus|ビフィズス/i, ingredient: "ingredient-lactobacillus", name: "乳酸菌" },
    { pattern: /酵素|enzyme/i, ingredient: "ingredient-enzyme", name: "酵素" },
    { pattern: /コエンザイムq10|coq10|ubiquinone/i, ingredient: "ingredient-coenzyme-q10", name: "コエンザイムQ10" },
    { pattern: /セサミン|sesamin/i, ingredient: "ingredient-sesamin", name: "セサミン" },
    { pattern: /イソフラボン|isoflavone|エクオール/i, ingredient: "ingredient-isoflavone", name: "大豆イソフラボン" },
    { pattern: /グルコサミン|glucosamine/i, ingredient: "ingredient-glucosamine", name: "グルコサミン" },
    { pattern: /コンドロイチン|chondroitin/i, ingredient: "ingredient-chondroitin", name: "コンドロイチン" },
    { pattern: /マルチビタミン|multivitamin/i, ingredient: "ingredient-multivitamin", name: "マルチビタミン" },
    { pattern: /マルチミネラル|multimineral/i, ingredient: "ingredient-multimineral", name: "マルチミネラル" },
    { pattern: /プロテイン|protein/i, ingredient: "ingredient-protein", name: "プロテイン" },
    { pattern: /bcaa/i, ingredient: "ingredient-bcaa", name: "BCAA" },
    { pattern: /カロリミット|diet|ダイエット/i, ingredient: "ingredient-diet-support", name: "ダイエットサポート成分" },
    { pattern: /イチョウ葉|ginkgo/i, ingredient: "ingredient-ginkgo", name: "イチョウ葉エキス" },
    { pattern: /深海鮫|squalene|スクワレン/i, ingredient: "ingredient-squalene", name: "深海鮫エキス（スクワレン）" },
    { pattern: /プロポリス|propolis/i, ingredient: "ingredient-propolis", name: "プロポリス" },
    { pattern: /マヌカハニー|manuka/i, ingredient: "ingredient-manuka-honey", name: "マヌカハニー" },
  ];

  const matches = [];
  for (const { pattern, ingredient, name } of ingredientPatterns) {
    if (pattern.test(productName)) {
      matches.push({ ingredient, name });
    }
  }

  return matches;
}

async function analyzeMissingIngredients() {
  console.log("🔍 成分データなし商品を分析中...\n");

  // 成分データなし商品を取得
  const products = await client.fetch(
    `*[_type == "product" && availability == "in-stock" && (!defined(ingredients) || count(ingredients) == 0)] | order(priceJPY asc){
      _id,
      name,
      slug,
      source,
      itemCode,
      priceJPY,
      servingsPerDay,
      servingsPerContainer
    }`
  );

  console.log(`📊 成分データなし商品: ${products.length}件\n`);

  const analysis = products.map((product) => {
    const rakutenUrl =
      product.source === "rakuten" ? `https://item.rakuten.co.jp/${product.itemCode}` : null;

    const suggestedIngredients = guessMainIngredient(product.name);

    return {
      _id: product._id,
      name: product.name,
      slug: product.slug.current,
      price: product.priceJPY,
      source: product.source,
      itemCode: product.itemCode,
      rakutenUrl,
      suggestedIngredients,
    };
  });

  // カテゴリ別に集計
  const categories = {
    vitamin: [],
    mineral: [],
    omega: [],
    herbal: [],
    multiNutrient: [],
    functional: [],
    unknown: [],
  };

  analysis.forEach((item) => {
    const name = item.name.toLowerCase();

    if (name.includes("マルチ") || name.includes("multi")) {
      categories.multiNutrient.push(item);
    } else if (name.includes("ビタミン") || name.includes("vitamin")) {
      categories.vitamin.push(item);
    } else if (name.includes("カルシウム") || name.includes("マグネシウム") || name.includes("亜鉛") || name.includes("鉄")) {
      categories.mineral.push(item);
    } else if (name.includes("dha") || name.includes("epa") || name.includes("オメガ")) {
      categories.omega.push(item);
    } else if (name.includes("マカ") || name.includes("プロポリス") || name.includes("イチョウ")) {
      categories.herbal.push(item);
    } else if (name.includes("カロリミット") || name.includes("ダイエット") || name.includes("乳酸菌")) {
      categories.functional.push(item);
    } else {
      categories.unknown.push(item);
    }
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 カテゴリ別集計");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`🟡 マルチ栄養素: ${categories.multiNutrient.length}件`);
  console.log(`🟠 ビタミン系: ${categories.vitamin.length}件`);
  console.log(`🔵 ミネラル系: ${categories.mineral.length}件`);
  console.log(`🟢 オメガ脂肪酸: ${categories.omega.length}件`);
  console.log(`🟣 ハーブ・植物系: ${categories.herbal.length}件`);
  console.log(`🟤 機能性: ${categories.functional.length}件`);
  console.log(`⚪ 不明: ${categories.unknown.length}件\n`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 商品詳細（推測成分付き）");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  analysis.forEach((item, i) => {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`[${i + 1}] ${item.name.substring(0, 70)}...`);
    console.log(`    価格: ¥${item.price}`);
    console.log(`    slug: ${item.slug}`);
    if (item.rakutenUrl) {
      console.log(`    URL: ${item.rakutenUrl}`);
    }

    if (item.suggestedIngredients.length > 0) {
      console.log(`    💡 推測される成分 (${item.suggestedIngredients.length}件):`);
      item.suggestedIngredients.forEach((ing, j) => {
        console.log(`       ${j + 1}. ${ing.name} (${ing.ingredient})`);
      });
    } else {
      console.log(`    ⚠️ 成分を推測できません（商品名から判断不可）`);
    }
    console.log();
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💡 次のステップ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("以下の方法で成分データを追加できます:\n");
  console.log("1. 楽天APIで商品詳細を取得して自動入力");
  console.log("   → scripts/fetch-rakuten-ingredients.mjs を実行\n");
  console.log("2. 商品ページを手動確認して一括入力");
  console.log("   → scripts/batch-add-ingredients.mjs を実行\n");
  console.log("3. 推測された成分を初期値として登録");
  console.log("   → scripts/apply-suggested-ingredients.mjs を実行\n");

  // JSONレポート出力
  const fs = await import("fs");
  fs.writeFileSync(
    join(__dirname, "missing-ingredients-report.json"),
    JSON.stringify(
      {
        summary: {
          total: products.length,
          categories,
        },
        products: analysis,
      },
      null,
      2
    )
  );
  console.log("📄 詳細レポートを保存しました: scripts/missing-ingredients-report.json\n");
}

analyzeMissingIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
