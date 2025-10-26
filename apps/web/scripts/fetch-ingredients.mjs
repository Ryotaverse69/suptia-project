#!/usr/bin/env node

/**
 * Sanityから成分リストを取得するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動で読み込む
const envPath = resolve(__dirname, "../.env.local");
try {
  const envFile = readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
} catch (error) {
  console.warn("⚠️ .env.localファイルが見つかりません。環境変数を確認してください。");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fetchIngredients() {
  console.log("📊 Sanityから成分リストを取得中...\n");

  try {
    const ingredients = await client.fetch(
      `*[_type == "ingredient"] | order(name asc) {
        _id,
        name,
        nameEn,
        slug,
        category,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`
    );

    console.log(`✅ ${ingredients.length}件の成分を取得しました\n`);
    console.log("=".repeat(80));
    console.log("成分リスト:");
    console.log("=".repeat(80));

    ingredients.forEach((ingredient, index) => {
      console.log(
        `${(index + 1).toString().padStart(2, "0")}. ${ingredient.name} (${ingredient.nameEn})`
      );
      console.log(
        `    カテゴリ: ${ingredient.category || "未設定"} | 商品数: ${ingredient.productCount}件`
      );
      console.log(`    Slug: ${ingredient.slug?.current || "未設定"}`);
      console.log("");
    });

    console.log("=".repeat(80));
    console.log("\n📈 統計情報:");
    console.log(`- 総成分数: ${ingredients.length}件`);
    console.log(
      `- 商品が紐付いている成分: ${ingredients.filter((i) => i.productCount > 0).length}件`
    );
    console.log(
      `- 商品が0件の成分: ${ingredients.filter((i) => i.productCount === 0).length}件`
    );

    // 商品が0件の成分を優先度高として表示
    const ingredientsWithNoProducts = ingredients.filter(
      (i) => i.productCount === 0
    );
    if (ingredientsWithNoProducts.length > 0) {
      console.log("\n⚠️ 商品データが不足している成分（優先取得対象）:");
      ingredientsWithNoProducts.forEach((ingredient) => {
        console.log(`  - ${ingredient.name} (${ingredient.nameEn})`);
      });
    }

    return ingredients;
  } catch (error) {
    console.error("❌ エラー:", error.message);
    process.exit(1);
  }
}

// 実行
fetchIngredients();
