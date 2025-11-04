#!/usr/bin/env node
/**
 * 既存商品にTierランクを自動付与するスクリプト
 *
 * 使い方:
 *   node scripts/calculate-tier-ranks.mjs
 *
 * 処理フロー:
 *   1. Sanityから全商品を取得
 *   2. tier-ranking.tsのロジックでランクを計算
 *   3. Sanityに書き戻し
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// __dirnameの取得（ESモジュール対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// apps/web/.env.localを読み込み
config({ path: join(__dirname, "../apps/web/.env.local") });

// sanity.config.tsから値を使用（フォールバック）
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  console.error("\n以下のいずれかの方法で実行してください:");
  console.error("1. SANITY_API_TOKEN=your_token node scripts/calculate-tier-ranks.mjs");
  console.error("2. apps/web/.env.local ファイルに SANITY_API_TOKEN を設定");
  console.error("\nSanity APIトークンの取得方法:");
  console.error("https://www.sanity.io/manage/personal/tokens");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * Tierランク計算ロジック（tier-ranking.tsから移植）
 */

// 5分位点を計算
function calculateQuintiles(sortedValues) {
  const len = sortedValues.length;
  if (len === 0) return [0, 0, 0, 0];
  if (len === 1)
    return [
      sortedValues[0],
      sortedValues[0],
      sortedValues[0],
      sortedValues[0],
    ];

  const q1 = sortedValues[Math.floor(len * 0.2)];
  const q2 = sortedValues[Math.floor(len * 0.4)];
  const q3 = sortedValues[Math.floor(len * 0.6)];
  const q4 = sortedValues[Math.floor(len * 0.8)];

  return [q1, q2, q3, q4];
}

// 1mgあたりのコスト計算
function calculateCostPerMg(product) {
  if (
    !product.ingredients ||
    product.ingredients.length === 0 ||
    !product.servingsPerContainer ||
    !product.servingsPerDay
  ) {
    return null;
  }

  const totalMgPerServing = product.ingredients.reduce(
    (sum, ing) => sum + ing.amountMgPerServing,
    0,
  );

  if (totalMgPerServing === 0) return null;

  const totalMgPerContainer = totalMgPerServing * product.servingsPerContainer;
  return product.priceJPY / totalMgPerContainer;
}

// 総成分量取得
function getTotalIngredientAmount(product) {
  if (!product.ingredients || product.ingredients.length === 0) {
    return null;
  }

  return product.ingredients.reduce(
    (sum, ing) => sum + ing.amountMgPerServing,
    0,
  );
}

// スコアからTierランクに変換
function scoreToTierRank(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

// 価格ランク計算
function calculatePriceRanks(products) {
  const ranks = new Map();
  const prices = products.map((p) => p.priceJPY).sort((a, b) => a - b);

  if (prices.length === 0) return ranks;

  const quintiles = calculateQuintiles(prices);

  products.forEach((product) => {
    const price = product.priceJPY;
    let rank = "D";

    // 安いほど高ランク（逆順）
    if (price <= quintiles[0]) rank = "S";
    else if (price <= quintiles[1]) rank = "A";
    else if (price <= quintiles[2]) rank = "B";
    else if (price <= quintiles[3]) rank = "C";
    else rank = "D";

    ranks.set(product._id, rank);
  });

  return ranks;
}

// コスパランク計算
function calculateCostEffectivenessRanks(products) {
  const ranks = new Map();

  const productsWithCost = products
    .map((p) => ({
      _id: p._id,
      costPerMg: calculateCostPerMg(p),
    }))
    .filter((p) => p.costPerMg !== null);

  if (productsWithCost.length === 0) {
    products.forEach((p) => ranks.set(p._id, "D"));
    return ranks;
  }

  const costs = productsWithCost.map((p) => p.costPerMg).sort((a, b) => a - b);
  const quintiles = calculateQuintiles(costs);

  productsWithCost.forEach(({ _id, costPerMg }) => {
    let rank = "D";

    // コストが低いほど高ランク（逆順）
    if (costPerMg <= quintiles[0]) rank = "S";
    else if (costPerMg <= quintiles[1]) rank = "A";
    else if (costPerMg <= quintiles[2]) rank = "B";
    else if (costPerMg <= quintiles[3]) rank = "C";
    else rank = "D";

    ranks.set(_id, rank);
  });

  // コスパ計算不可の商品はDランク
  products.forEach((p) => {
    if (!ranks.has(p._id)) {
      ranks.set(p._id, "D");
    }
  });

  return ranks;
}

// 含有量ランク計算
function calculateContentRanks(products) {
  const ranks = new Map();

  const productsWithContent = products
    .map((p) => ({
      _id: p._id,
      totalContent: getTotalIngredientAmount(p),
    }))
    .filter((p) => p.totalContent !== null);

  if (productsWithContent.length === 0) {
    products.forEach((p) => ranks.set(p._id, "D"));
    return ranks;
  }

  const contents = productsWithContent
    .map((p) => p.totalContent)
    .sort((a, b) => a - b);
  const quintiles = calculateQuintiles(contents);

  productsWithContent.forEach(({ _id, totalContent }) => {
    let rank = "D";

    // 含有量が多いほど高ランク（正順）
    if (totalContent >= quintiles[3]) rank = "S";
    else if (totalContent >= quintiles[2]) rank = "A";
    else if (totalContent >= quintiles[1]) rank = "B";
    else if (totalContent >= quintiles[0]) rank = "C";
    else rank = "D";

    ranks.set(_id, rank);
  });

  // 含有量不明の商品はDランク
  products.forEach((p) => {
    if (!ranks.has(p._id)) {
      ranks.set(p._id, "D");
    }
  });

  return ranks;
}

// エビデンスランク（既存データを流用）
function calculateEvidenceRanks(products) {
  const ranks = new Map();

  products.forEach((product) => {
    // scores.evidenceからランクを推定
    const evidenceScore = product.scores?.evidence || 0;
    ranks.set(product._id, scoreToTierRank(evidenceScore));
  });

  return ranks;
}

// 安全性ランク
function calculateSafetyRanks(products) {
  const ranks = new Map();

  products.forEach((product) => {
    const score = product.scores?.safety || 0;
    ranks.set(product._id, scoreToTierRank(score));
  });

  return ranks;
}

// 全商品のTierランク計算
function calculateAllTierRankings(products) {
  const rankings = new Map();

  console.log("📊 Tierランクを計算中...");

  const priceRanks = calculatePriceRanks(products);
  const costEffectivenessRanks = calculateCostEffectivenessRanks(products);
  const contentRanks = calculateContentRanks(products);
  const evidenceRanks = calculateEvidenceRanks(products);
  const safetyRanks = calculateSafetyRanks(products);

  products.forEach((product) => {
    rankings.set(product._id, {
      priceRank: priceRanks.get(product._id) || "D",
      costEffectivenessRank: costEffectivenessRanks.get(product._id) || "D",
      contentRank: contentRanks.get(product._id) || "D",
      evidenceRank: evidenceRanks.get(product._id) || "D",
      safetyRank: safetyRanks.get(product._id) || "D",
    });
  });

  return rankings;
}

/**
 * メイン処理
 */
async function main() {
  try {
    console.log("🚀 Tierランク自動付与スクリプト開始\n");

    // 1. 全商品取得
    console.log("📥 Sanityから全商品を取得中...");
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        priceJPY,
        servingsPerContainer,
        servingsPerDay,
        ingredients[] {
          amountMgPerServing
        },
        scores {
          safety,
          evidence
        }
      }
    `);

    console.log(`✅ ${products.length}件の商品を取得しました\n`);

    if (products.length === 0) {
      console.log("⚠️  商品が見つかりませんでした");
      return;
    }

    // 2. Tierランク計算
    const rankings = calculateAllTierRankings(products);

    console.log("✅ Tierランク計算完了\n");

    // 3. Sanityに書き戻し
    console.log("💾 Sanityに書き込み中...");

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      const ranking = rankings.get(product._id);

      if (!ranking) {
        console.error(`❌ ${product.name}: ランクが計算されませんでした`);
        errorCount++;
        continue;
      }

      try {
        await client
          .patch(product._id)
          .set({
            tierRatings: {
              priceRank: ranking.priceRank,
              costEffectivenessRank: ranking.costEffectivenessRank,
              contentRank: ranking.contentRank,
              evidenceRank: ranking.evidenceRank,
              safetyRank: ranking.safetyRank,
            },
          })
          .commit();

        const isPerfect =
          ranking.priceRank === "S" &&
          ranking.costEffectivenessRank === "S" &&
          ranking.contentRank === "S" &&
          ranking.evidenceRank === "S" &&
          ranking.safetyRank === "S";

        console.log(
          `${isPerfect ? "🏆" : "✅"} ${product.name}: 💰${ranking.priceRank} 💡${ranking.costEffectivenessRank} 📊${ranking.contentRank} 🔬${ranking.evidenceRank} 🛡️${ranking.safetyRank}`,
        );

        successCount++;
      } catch (error) {
        console.error(`❌ ${product.name}: ${error.message}`);
        errorCount++;
      }
    }

    // 4. 結果サマリー
    console.log("\n" + "=".repeat(60));
    console.log("📊 処理結果サマリー");
    console.log("=".repeat(60));
    console.log(`✅ 成功: ${successCount}件`);
    console.log(`❌ 失敗: ${errorCount}件`);
    console.log(`📦 合計: ${products.length}件`);

    // 5冠達成商品をカウント
    const perfectProducts = Array.from(rankings.values()).filter(
      (r) =>
        r.priceRank === "S" &&
        r.costEffectivenessRank === "S" &&
        r.contentRank === "S" &&
        r.evidenceRank === "S" &&
        r.safetyRank === "S",
    );

    console.log(`\n🏆 5冠達成商品: ${perfectProducts.length}件`);

    console.log("\n✨ Tierランク付与完了！\n");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
