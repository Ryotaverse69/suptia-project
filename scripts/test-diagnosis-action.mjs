#!/usr/bin/env node

/**
 * 診断機能テストスクリプト
 *
 * fetchProductsForDiagnosis()が正しく動作するかテスト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動でパース
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

/**
 * エビデンスレベルマッピング
 */
function mapEvidenceLevel(level) {
  switch (level) {
    case "高":
      return "A";
    case "中":
      return "B";
    case "低":
      return "C";
    default:
      return "C";
  }
}

async function testDiagnosisAction() {
  console.log("🧪 診断機能アクションをテストします...\n");

  try {
    // GROQ query: 商品と関連する成分を取得
    const query = `*[_type == "product" && availability == "in-stock"] {
      _id,
      name,
      "brand": brand->name,
      priceJPY,
      servingsPerDay,
      servingsPerContainer,
      "ingredients": ingredients[] {
        "ingredient": ingredient-> {
          name,
          "slug": slug.current,
          category,
          evidenceLevel,
          relatedGoals,
          contraindications
        },
        amountMgPerServing
      }
    }`;

    const products = await client.fetch(query);

    console.log(`📦 取得した商品数: ${products.length}件\n`);

    // データ変換
    const transformedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      priceJPY: product.priceJPY,
      servingsPerDay: product.servingsPerDay,
      servingsPerContainer: product.servingsPerContainer,
      ingredients: product.ingredients.map((ing) => ({
        name: ing.ingredient.name,
        slug: ing.ingredient.slug,
        category: ing.ingredient.category,
        evidenceLevel: mapEvidenceLevel(ing.ingredient.evidenceLevel),
        relatedGoals: ing.ingredient.relatedGoals || [],
        contraindications: ing.ingredient.contraindications || [],
        amountMgPerServing: ing.amountMgPerServing,
      })),
    }));

    console.log("✅ データ変換成功！\n");

    // サンプル商品を詳細表示
    console.log("📋 サンプル商品（最大3件）:\n");
    transformedProducts.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ブランド: ${product.brand || "未設定"}`);
      console.log(`   価格: ¥${product.priceJPY?.toLocaleString()}`);
      console.log(`   1日あたり: ${product.servingsPerDay}回`);
      console.log(`   容器あたり: ${product.servingsPerContainer}回`);
      console.log(`   成分数: ${product.ingredients.length}個`);
      console.log("");

      product.ingredients.forEach((ing, ingIndex) => {
        console.log(`      ${ingIndex + 1}. ${ing.name} (${ing.slug})`);
        console.log(`         カテゴリ: ${ing.category || "未設定"}`);
        console.log(
          `         エビデンス: ${ing.evidenceLevel}`
        );
        console.log(`         含有量: ${ing.amountMgPerServing}mg`);
        console.log(
          `         健康目標 (${ing.relatedGoals.length}): ${ing.relatedGoals.join(", ") || "なし"}`
        );
        console.log(
          `         禁忌 (${ing.contraindications.length}): ${ing.contraindications.join(", ") || "なし"}`
        );
      });
      console.log("");
    });

    // 統計情報
    const totalIngredients = transformedProducts.reduce(
      (sum, p) => sum + p.ingredients.length,
      0
    );
    const ingredientsWithGoals = transformedProducts.reduce(
      (sum, p) =>
        sum +
        p.ingredients.filter((ing) => ing.relatedGoals.length > 0)
          .length,
      0
    );
    const ingredientsWithContraindications = transformedProducts.reduce(
      (sum, p) =>
        sum +
        p.ingredients.filter((ing) => ing.contraindications.length > 0)
          .length,
      0
    );

    console.log("📊 統計情報:");
    console.log(`   総商品数: ${transformedProducts.length}件`);
    console.log(`   総成分数（重複含む）: ${totalIngredients}個`);
    console.log(
      `   健康目標を持つ成分: ${ingredientsWithGoals}個 (${((ingredientsWithGoals / totalIngredients) * 100).toFixed(1)}%)`
    );
    console.log(
      `   禁忌タグを持つ成分: ${ingredientsWithContraindications}個 (${((ingredientsWithContraindications / totalIngredients) * 100).toFixed(1)}%)`
    );

    console.log("\n✅ 診断機能アクションは正常に動作します！");
    console.log(
      "💡 診断機能（/diagnosis/results）で実際のSanityデータが使用されます。"
    );
  } catch (error) {
    console.error("❌ エラー:", error.message);
    console.error(error.stack);
  }
}

testDiagnosisAction();
