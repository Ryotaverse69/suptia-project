#!/usr/bin/env node

/**
 * ビタミンC商品のSanityデータをデバッグ
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]?.trim();
const SANITY_DATASET = envContent.match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]?.trim();
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: SANITY_API_TOKEN,
});

async function debugVitaminCData() {
  console.log("🔍 ビタミンC商品データのデバッグ\n");

  try {
    // ビタミンCを含む商品を検索
    const query = `*[_type == "product" && name match "*ビタミンC*"][0...5]{
      _id,
      name,
      slug,
      scores,
      tierRatings,
      ingredients[]{
        amountMgPerServing,
        ingredient->{
          _id,
          name,
          evidenceLevel
        }
      }
    }`;

    const products = await client.fetch(query);
    console.log(`✅ ${products.length}件のDHCビタミンC商品を取得\n`);

    products.forEach((product, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📦 商品 ${index + 1}: ${product.name.substring(0, 80)}...`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`\n🔗 Slug: ${product.slug?.current || "なし"}`);
      console.log(`\n📊 Sanityに保存されているスコア:`);
      console.log(`  - evidence: ${product.scores?.evidence || "未設定"}`);
      console.log(`  - safety: ${product.scores?.safety || "未設定"}`);
      console.log(`\n🎯 Sanityに保存されているランク:`);
      console.log(`  - evidenceRank: ${product.tierRatings?.evidenceRank || "未設定"}`);
      console.log(`  - safetyRank: ${product.tierRatings?.safetyRank || "未設定"}`);
      console.log(`  - priceRank: ${product.tierRatings?.priceRank || "未設定"}`);
      console.log(`  - costEffectivenessRank: ${product.tierRatings?.costEffectivenessRank || "未設定"}`);
      console.log(`  - contentRank: ${product.tierRatings?.contentRank || "未設定"}`);

      if (product.ingredients && product.ingredients.length > 0) {
        console.log(`\n🧪 成分情報 (${product.ingredients.length}件):`);
        product.ingredients.slice(0, 3).forEach((ing, i) => {
          console.log(`  ${i + 1}. ${ing.ingredient?.name || "不明"}`);
          console.log(`     - 配合量: ${ing.amountMgPerServing}mg/serving`);
          console.log(`     - エビデンスレベル: ${ing.ingredient?.evidenceLevel || "未設定"}`);
        });
      }
    });

    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 期待される結果:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  - scores.evidence: 94.98〜95点`);
    console.log(`  - scores.safety: 65点前後`);
    console.log(`  - tierRatings.evidenceRank: "S" (90点以上)`);
    console.log(`  - tierRatings.safetyRank: "C" (60-69点)`);
    console.log(`\n`);

  } catch (error) {
    console.error("❌ エラー:", error);
    process.exit(1);
  }
}

debugVitaminCData();
