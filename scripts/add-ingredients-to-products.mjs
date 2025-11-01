/**
 * 商品に成分データを一括追加するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

if (!SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN が見つかりません");
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = "fny3jdcg";
const SANITY_DATASET = "production";

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: SANITY_API_TOKEN,
  useCdn: false,
});

// デフォルトの成分量（mg）- 商品タイプに応じて調整
const DEFAULT_AMOUNTS = {
  "vitamin-c": 1000,
  "vitamin-d": 25,
  "vitamin-e": 400,
  "vitamin-a": 800,
  "vitamin-b-complex": 50,
  "dha-epa": 500,
  "folic-acid": 400,
  "magnesium": 300,
  "calcium": 500,
  "iron": 10,
  "zinc": 15,
  "protein": 20000, // 20g
  "collagen": 5000, // 5g
  "probiotics": 100, // 100億個
};

async function main() {
  console.log("🔍 分析結果を読み込み中...\n");

  // 分析結果JSONを読み込み
  const mappingPath = join(__dirname, "product-ingredient-mapping.json");
  const mappingData = JSON.parse(readFileSync(mappingPath, "utf8"));

  console.log(`✅ ${mappingData.length}件の商品データを読み込みました\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const productData of mappingData) {
    // 成分が検出されなかった商品はスキップ
    if (productData.detectedIngredients.length === 0) {
      skippedCount++;
      continue;
    }

    console.log(`📦 処理中: ${productData.name.substring(0, 60)}...`);
    console.log(`   ID: ${productData.id}`);
    console.log(`   検出成分数: ${productData.detectedIngredients.length}件`);

    try {
      // 各成分のSanity _idを取得
      const ingredientsArray = [];

      for (const { slug, name } of productData.detectedIngredients) {
        const ingredient = await client.fetch(
          `*[_type == "ingredient" && slug.current == $slug][0]{ _id, name }`,
          { slug }
        );

        if (ingredient) {
          ingredientsArray.push({
            _type: "ingredientWithAmount",
            amountMgPerServing: DEFAULT_AMOUNTS[slug] || 100,
            ingredient: {
              _type: "reference",
              _ref: ingredient._id,
            },
          });
          console.log(`   ✅ ${name}: ${DEFAULT_AMOUNTS[slug] || 100}mg`);
        } else {
          console.log(`   ⚠️ ${name}: Sanityに成分データが見つかりません（スキップ）`);
        }
      }

      // 成分データが1つ以上取得できた場合のみ更新
      if (ingredientsArray.length > 0) {
        await client
          .patch(productData.id)
          .set({ ingredients: ingredientsArray })
          .commit();

        successCount++;
        console.log(`   ✅ 更新完了: ${ingredientsArray.length}件の成分を追加\n`);
      } else {
        skippedCount++;
        console.log(`   ⚠️ スキップ: 有効な成分データが見つかりませんでした\n`);
      }
    } catch (error) {
      errorCount++;
      console.error(`   ❌ エラー: ${error.message}\n`);
    }
  }

  // 最終結果を表示
  console.log("=".repeat(80));
  console.log("📊 処理結果:");
  console.log(`   成功: ${successCount}件`);
  console.log(`   スキップ: ${skippedCount}件`);
  console.log(`   エラー: ${errorCount}件`);
  console.log(`   合計: ${mappingData.length}件`);
  console.log("=".repeat(80));

  if (successCount > 0) {
    console.log("\n✅ 成分データの一括追加が完了しました！");
    console.log("次のステップ: 商品詳細ページで成分ガイドリンクが表示されるか確認してください");
  }
}

main().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
