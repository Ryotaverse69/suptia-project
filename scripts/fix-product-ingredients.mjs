#!/usr/bin/env node

/**
 * 商品の成分データ構造を修正
 *
 * reference[] → object[] { ingredient: reference, amountMgPerServing: number }
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
});

// デフォルト含有量（mg）- 成分ごとの一般的な量
const DEFAULT_AMOUNTS = {
  "vitamin-c": 1000,
  "vitamin-d": 25, // 1000IU = 25μg = 25mg相当として扱う
  "vitamin-b-complex": 50,
  "vitamin-b12": 0.5,
  "vitamin-e": 134,
  "vitamin-k": 0.12,
  "vitamin-a": 0.9,
  "calcium": 500,
  "magnesium": 400,
  "magnesium-glycinate": 400,
  "zinc": 15,
  "iron": 18,
  "omega-3": 1000,
  "probiotics": 10000, // CFU単位だが便宜上mg換算
  "coenzyme-q10": 100,
  "selenium": 0.2,
  "l-carnitine": 500,
  "creatine": 5000,
  "protein": 25000, // 25g
  "bcaa": 5000,
  "ashwagandha": 300,
  "turmeric": 500,
  "ginkgo": 120,
  "astaxanthin": 12,
  "collagen": 10000, // 10g
  "glucosamine": 1500,
  "lutein": 10,
  "nac": 600,
  "folic-acid": 0.4,
  "niacin": 16,
  "potassium": 99,
  "chromium": 0.2,
  "iodine": 0.15,
};

async function fixProductIngredients() {
  console.log("🔧 商品の成分データ構造を修正します...\n");

  try {
    // 全商品を取得
    const products = await client.fetch(
      `*[_type == "product"] {
        _id,
        name,
        ingredients
      }`
    );

    console.log(`📦 対象商品: ${products.length}件\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // 既に正しい構造か確認
      if (
        product.ingredients &&
        product.ingredients.length > 0 &&
        product.ingredients[0].ingredient
      ) {
        console.log(`⏭️  スキップ: ${product.name} - 既に正しい構造`);
        skippedCount++;
        continue;
      }

      // 旧構造（reference[]）から新構造（object[]）に変換
      if (
        product.ingredients &&
        product.ingredients.length > 0 &&
        product.ingredients[0]._ref
      ) {
        const newIngredients = await Promise.all(
          product.ingredients.map(async (ref) => {
            // 成分情報を取得してslugを取得
            const ingredient = await client.fetch(
              `*[_id == $id][0]{ "slug": slug.current }`,
              { id: ref._ref }
            );

            const slug = ingredient?.slug;
            const amount = DEFAULT_AMOUNTS[slug] || 100; // デフォルト100mg

            return {
              _key: ref._key,
              ingredient: {
                _type: "reference",
                _ref: ref._ref,
              },
              amountMgPerServing: amount,
            };
          })
        );

        // 更新実行
        await client
          .patch(product._id)
          .set({ ingredients: newIngredients })
          .commit();

        console.log(`✅ 修正: ${product.name}`);
        console.log(
          `   成分数: ${newIngredients.length}個`
        );
        newIngredients.forEach((ing) => {
          console.log(
            `   - ${ing.ingredient._ref}: ${ing.amountMgPerServing}mg`
          );
        });
        console.log("");

        fixedCount++;
      } else if (!product.ingredients || product.ingredients.length === 0) {
        console.log(
          `⚠️  警告: ${product.name} - 成分データがありません`
        );
        skippedCount++;
      }
    }

    console.log("\n📊 修正完了:");
    console.log(`   修正: ${fixedCount}件`);
    console.log(`   スキップ: ${skippedCount}件`);
    console.log(`   合計: ${products.length}件`);

    if (fixedCount > 0) {
      console.log(
        "\n💡 注意: デフォルトの含有量を設定しました。"
      );
      console.log(
        "   Sanity Studioで各商品の実際の含有量を確認・修正してください。"
      );
    }
  } catch (error) {
    console.error("❌ エラー:", error.message);
    console.error(error.stack);
  }
}

fixProductIngredients();
