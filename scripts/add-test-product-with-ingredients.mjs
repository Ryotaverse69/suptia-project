/**
 * 成分データ付きテスト商品をSanityに追加するスクリプト
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

async function main() {
  console.log("🔍 ビタミンCとビタミンDの成分データを検索中...");

  // ビタミンCとビタミンDを検索
  const vitaminC = await client.fetch(
    `*[_type == "ingredient" && slug.current == "vitamin-c"][0]{ _id, name, slug }`
  );
  const vitaminD = await client.fetch(
    `*[_type == "ingredient" && slug.current == "vitamin-d"][0]{ _id, name, slug }`
  );

  if (!vitaminC && !vitaminD) {
    console.error("❌ ビタミンCまたはビタミンDの成分データが見つかりません");
    process.exit(1);
  }

  console.log(`✅ 成分データ見つかりました:`);
  if (vitaminC) console.log(`   - ${vitaminC.name} (${vitaminC.slug.current})`);
  if (vitaminD) console.log(`   - ${vitaminD.name} (${vitaminD.slug.current})`);

  console.log("\n📦 テスト商品を作成中...");

  const brandRef = await client.fetch(
    `*[_type == "brand" && name == "テストブランド"][0]._id`
  );

  let brandId = brandRef;
  if (!brandId) {
    console.log("   ブランドを新規作成...");
    const brand = await client.create({
      _type: "brand",
      name: "テストブランド",
      slug: { _type: "slug", current: "test-brand" },
    });
    brandId = brand._id;
  }

  const ingredients = [];
  if (vitaminC) {
    ingredients.push({
      _type: "ingredientWithAmount",
      amountMgPerServing: 1000,
      ingredient: {
        _type: "reference",
        _ref: vitaminC._id,
      },
    });
  }
  if (vitaminD) {
    ingredients.push({
      _type: "ingredientWithAmount",
      amountMgPerServing: 25,
      ingredient: {
        _type: "reference",
        _ref: vitaminD._id,
      },
    });
  }

  // 既存商品をチェック
  const existingProduct = await client.fetch(
    `*[_type == "product" && slug.current == "test-product-with-ingredients"][0]._id`
  );

  const testProduct = {
    _type: "product",
    _id: existingProduct || "product-test-with-ingredients", // IDを明示的に指定
    name: "テスト商品（ビタミンC + ビタミンD配合）",
    slug: {
      _type: "slug",
      current: "test-product-with-ingredients",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    priceJPY: 1980,
    servingsPerContainer: 60,
    servingsPerDay: 2,
    description: "成分ガイドリンク表示テスト用の商品です。",
    allIngredients: "ビタミンC、ビタミンD、その他添加物",
    ingredients,
    availability: "in-stock",
    scores: {
      safety: 85,
      evidence: 90,
      overall: 87,
    },
  };

  const result = await client.createOrReplace(testProduct);
  console.log(`✅ テスト商品を作成しました: ${result._id}`);
  console.log(`   商品名: ${result.name}`);
  console.log(`   URL: http://localhost:3000/products/${result.slug.current}`);
  console.log(`   成分数: ${ingredients.length}`);
}

main().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
