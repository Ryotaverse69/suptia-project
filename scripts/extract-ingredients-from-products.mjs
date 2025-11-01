/**
 * 既存商品から成分を抽出して分析するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync } from "fs";
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

// 成分キーワードマップ
const INGREDIENT_KEYWORDS = [
  { keywords: ["ビタミンc", "vitamin c", "アスコルビン酸"], slug: "vitamin-c", name: "ビタミンC" },
  { keywords: ["ビタミンd", "vitamin d"], slug: "vitamin-d", name: "ビタミンD" },
  { keywords: ["ビタミンe", "vitamin e", "トコフェロール"], slug: "vitamin-e", name: "ビタミンE" },
  { keywords: ["ビタミンa", "vitamin a", "レチノール", "βカロテン", "ベータカロテン"], slug: "vitamin-a", name: "ビタミンA" },
  { keywords: ["ビタミンb", "vitamin b", "ナイアシン", "パントテン"], slug: "vitamin-b-complex", name: "ビタミンB群" },
  { keywords: ["dha", "epa", "オメガ3", "omega-3", "omega3", "フィッシュオイル"], slug: "dha-epa", name: "DHA・EPA" },
  { keywords: ["葉酸", "folic", "folate"], slug: "folic-acid", name: "葉酸" },
  { keywords: ["マグネシウム", "magnesium"], slug: "magnesium", name: "マグネシウム" },
  { keywords: ["カルシウム", "calcium"], slug: "calcium", name: "カルシウム" },
  { keywords: ["鉄", "iron", "ヘム鉄", "非ヘム鉄"], slug: "iron", name: "鉄" },
  { keywords: ["亜鉛", "zinc"], slug: "zinc", name: "亜鉛" },
  { keywords: ["プロテイン", "protein", "たんぱく質", "タンパク質"], slug: "protein", name: "プロテイン" },
  { keywords: ["コラーゲン", "collagen"], slug: "collagen", name: "コラーゲン" },
  { keywords: ["乳酸菌", "lactobacillus", "プロバイオティクス", "probiotics", "ビフィズス菌"], slug: "probiotics", name: "乳酸菌" },
];

async function main() {
  console.log("🔍 既存商品を取得中...\n");

  // 成分データがない商品を取得
  const products = await client.fetch(`
    *[_type == "product" && !defined(ingredients)] | order(_createdAt desc) {
      _id,
      name,
      slug,
      brandName,
      priceJPY,
      allIngredients,
      description
    }
  `);

  console.log(`✅ ${products.length}件の商品を取得しました\n`);
  console.log("📊 商品分析中...\n");

  const productAnalysis = [];
  let totalWithIngredients = 0;
  let totalIngredients = 0;

  for (const product of products) {
    const productName = (product.name || "").toLowerCase();
    const allIngredientsText = (product.allIngredients || "").toLowerCase();
    const descriptionText = (product.description || "").toLowerCase();

    const detectedIngredients = [];

    for (const { keywords, slug, name } of INGREDIENT_KEYWORDS) {
      const isDetected = keywords.some(
        (keyword) =>
          productName.includes(keyword.toLowerCase()) ||
          allIngredientsText.includes(keyword.toLowerCase()) ||
          descriptionText.includes(keyword.toLowerCase())
      );

      if (isDetected) {
        detectedIngredients.push({ slug, name });
      }
    }

    if (detectedIngredients.length > 0) {
      totalWithIngredients++;
      totalIngredients += detectedIngredients.length;

      console.log(`✅ ${(product.name || "不明").substring(0, 60)}`);
      console.log(`   検出された成分 (${detectedIngredients.length}件): ${detectedIngredients.map(i => i.name).join(", ")}`);
    }

    productAnalysis.push({
      id: product._id,
      name: product.name || "不明",
      slug: product.slug?.current || "unknown",
      brand: product.brandName || "不明",
      price: product.priceJPY || 0,
      detectedIngredients,
    });
  }

  console.log("\n" + "=".repeat(80));
  console.log("📈 統計:");
  console.log(`   全商品数: ${products.length}件`);
  console.log(`   成分検出された商品: ${totalWithIngredients}件`);
  const percentage = products.length > 0 ? Math.round((totalWithIngredients / products.length) * 100) : 0;
  console.log(`   検出率: ${percentage}%`);
  console.log(`   検出された成分総数: ${totalIngredients}件`);
  const avgIngredients = totalWithIngredients > 0 ? (totalIngredients / totalWithIngredients).toFixed(1) : 0;
  console.log(`   平均成分数/商品: ${avgIngredients}件`);
  console.log("=".repeat(80));

  // JSONファイルに保存
  const outputPath = join(__dirname, "product-ingredient-mapping.json");
  writeFileSync(outputPath, JSON.stringify(productAnalysis, null, 2), "utf8");
  console.log(`\n💾 分析結果を保存しました: ${outputPath}`);
  console.log(`\n次のステップ: この結果を元に成分データを一括追加します`);
}

main().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
