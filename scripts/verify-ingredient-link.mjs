#!/usr/bin/env node

/**
 * 成分リンク検証スクリプト
 * DHC フォースコリーから成分ページへのリンクが正しく機能するか確認
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

async function verifyIngredientLink() {
  console.log("🔍 成分リンク検証\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // 1. 商品データを取得（成分のslugも含む）
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      ingredients[]{
        _key,
        amountMgPerServing,
        ingredient->{
          _id,
          name,
          nameEn,
          slug,
          evidenceLevel,
          safetyScore,
          category
        }
      }
    }`,
    { slug: "dhc-20-80-6-dhc" }
  );

  console.log(`📦 商品: ${product.name}\n`);
  console.log(`商品URL: /products/${product.slug.current}\n`);

  if (!product.ingredients || product.ingredients.length === 0) {
    console.log("❌ 成分データが見つかりません\n");
    return;
  }

  console.log(`成分数: ${product.ingredients.length}件\n`);

  // 2. 各成分のリンク情報を表示
  for (const ing of product.ingredients) {
    if (!ing.ingredient) {
      console.log("⚠️ 成分情報が取得できません\n");
      continue;
    }

    const ingredient = ing.ingredient;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📋 成分情報:\n`);
    console.log(`   ID: ${ingredient._id}`);
    console.log(`   名前: ${ingredient.name}`);
    console.log(`   英語名: ${ingredient.nameEn}`);
    console.log(`   配合量: ${ing.amountMgPerServing}mg`);
    console.log(`   カテゴリ: ${ingredient.category || "未設定"}`);
    console.log(`   エビデンスレベル: ${ingredient.evidenceLevel || "未設定"}`);
    console.log(`   安全性スコア: ${ingredient.safetyScore || "未設定"}点\n`);

    // slug情報を確認
    if (ingredient.slug && ingredient.slug.current) {
      console.log(`✅ Slug: ${ingredient.slug.current}`);
      console.log(
        `✅ 成分ページURL: /ingredients/${ingredient.slug.current}\n`
      );

      // 成分記事が実際に存在するか確認
      const ingredientArticle = await client.fetch(
        `*[_type == "ingredient" && slug.current == $slug][0]{
          _id,
          name,
          description
        }`,
        { slug: ingredient.slug.current }
      );

      if (ingredientArticle) {
        console.log(`✅ 成分記事が存在します`);
        console.log(`   記事ID: ${ingredientArticle._id}`);
        console.log(
          `   説明文: ${ingredientArticle.description.substring(0, 100)}...\n`
        );
      } else {
        console.log(`❌ 成分記事が見つかりません（slug: ${ingredient.slug.current}）\n`);
      }
    } else {
      console.log(`❌ Slugが設定されていません`);
      console.log(
        `   → RelatedIngredientsコンポーネントではこの成分は表示されません\n`
      );
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("✅ 検証完了\n");

  // RelatedIngredients表示判定
  const displayableIngredients = product.ingredients.filter(
    (ing) => ing.ingredient?.slug?.current
  );

  console.log("📊 RelatedIngredientsコンポーネント表示判定:\n");
  console.log(
    `   表示可能な成分: ${displayableIngredients.length}/${product.ingredients.length}件\n`
  );

  if (displayableIngredients.length > 0) {
    console.log("✅ 「関連する成分ガイド」セクションが表示されます\n");
    console.log("   リンク先:\n");
    displayableIngredients.forEach((ing) => {
      console.log(`   • ${ing.ingredient.name}`);
      console.log(`     → /ingredients/${ing.ingredient.slug.current}\n`);
    });
  } else {
    console.log("❌ 「関連する成分ガイド」セクションは表示されません\n");
    console.log("   原因: すべての成分にslugが設定されていません\n");
  }
}

verifyIngredientLink()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
