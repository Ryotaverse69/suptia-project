#!/usr/bin/env node

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

const slug = process.argv[2] || "afc-30-3-1-4";

async function inspectProduct() {
  console.log(`🔍 商品を確認: ${slug}\n`);

  // 参照解決なしで生データを取得
  const productRaw = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      ingredients
    }`,
    { slug }
  );

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 生データ（参照解決なし）");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(JSON.stringify(productRaw, null, 2));
  console.log();

  // 参照解決ありで取得
  const productResolved = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
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

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 参照解決後のデータ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(JSON.stringify(productResolved, null, 2));
  console.log();

  // 診断
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🩺 診断結果");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!productRaw.ingredients || productRaw.ingredients.length === 0) {
    console.log("❌ 問題: ingredients配列が空またはundefined\n");
    return;
  }

  const firstIngredient = productRaw.ingredients[0];
  console.log("最初の成分要素の構造:");
  console.log(JSON.stringify(firstIngredient, null, 2));
  console.log();

  if (firstIngredient.ingredient) {
    if (firstIngredient.ingredient._ref) {
      console.log("✅ 正しい構造: ingredient._ref が存在");
      console.log(`   参照先: ${firstIngredient.ingredient._ref}\n`);

      // 参照先の成分が存在するか確認
      const ingredientExists = await client.fetch(
        `*[_id == $id][0]{_id, name}`,
        { id: firstIngredient.ingredient._ref }
      );

      if (ingredientExists) {
        console.log(`✅ 参照先の成分は存在します: ${ingredientExists.name}\n`);
      } else {
        console.log(`❌ 参照先の成分が存在しません: ${firstIngredient.ingredient._ref}\n`);
      }
    } else if (firstIngredient.ingredient._id) {
      console.log("❌ 構造エラー: ingredient._id が直接存在（パターンB）");
      console.log(`   これは正しい参照構造ではありません\n`);
    } else {
      console.log("❌ 構造エラー: ingredient フィールドが不明な形式\n");
    }
  } else {
    console.log("❌ 構造エラー: ingredient フィールドが存在しません\n");
  }

  // amountMgPerServing の確認
  if (firstIngredient.amountMgPerServing !== undefined) {
    console.log(`✅ amountMgPerServing: ${firstIngredient.amountMgPerServing}mg\n`);
  } else {
    console.log("❌ amountMgPerServing が存在しません\n");
  }
}

inspectProduct()
  .then(() => {
    console.log("✅ 完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
