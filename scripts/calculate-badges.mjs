#!/usr/bin/env node

/**
 * 称号バッジ自動計算・更新スクリプト
 *
 * 目的:
 * 1. 実際のデータ（価格、成分量、コスパ、エビデンス、安全性）から称号バッジを自動計算
 * 2. Sanityの各商品のbadgesフィールドを自動更新
 * 3. 5つの称号: 💰最適価格、📊高含有リード、💡高効率モデル、🔬高エビデンス、🛡️高安全性
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// コマンドライン引数
const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

/**
 * 称号バッジ定義
 */
const BADGE_DEFINITIONS = {
  "lowest-price": {
    label: "💰 最適価格",
    description: "複数ECサイトで最も安い価格",
  },
  "highest-content": {
    label: "📊 高含有リード",
    description: "成分量が最も多い",
  },
  "best-value": {
    label: "💡 高効率モデル",
    description: "コスパが最も優れている",
  },
  "evidence-s": {
    label: "🔬 高エビデンス",
    description: "最高レベルの科学的根拠",
  },
  "high-safety": {
    label: "🛡️ 高安全性",
    description: "安全性スコア90点以上",
  },
};

/**
 * 商品データを取得
 */
async function fetchProducts() {
  const query = `*[_type == "product"] {
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    ingredients[] {
      amountMgPerServing,
      isPrimary,
      ingredient-> {
        _id,
        name
      }
    },
    priceData[] {
      source,
      amount
    },
    scores {
      safety,
      evidence
    },
    badges
  }`;

  const products = await client.fetch(query);
  return products;
}

/**
 * 主要成分を取得
 *
 * 優先順位:
 * 1. isPrimary: true が設定された成分
 * 2. 配列の最初（0番目）の成分
 */
function getPrimaryIngredient(product) {
  if (!product.ingredients || product.ingredients.length === 0) {
    return null;
  }

  // isPrimary=trueの成分を探す
  const primary = product.ingredients.find((ing) => ing.isPrimary);
  if (primary && primary.ingredient) {
    return {
      id: primary.ingredient._id,
      amount: primary.amountMgPerServing,
    };
  }

  // isPrimaryがない場合は、配列の最初の要素を主成分とする
  const first = product.ingredients[0];
  if (!first || !first.ingredient) {
    return null;
  }
  return {
    id: first.ingredient._id,
    amount: first.amountMgPerServing,
  };
}

/**
 * 1mgあたりのコストを計算
 */
function calculateCostPerMg(product) {
  const primaryIngredient = getPrimaryIngredient(product);
  if (!primaryIngredient || !product.servingsPerContainer) {
    return null;
  }

  const totalIngredientMg =
    primaryIngredient.amount * product.servingsPerContainer;
  return product.priceJPY / totalIngredientMg;
}

/**
 * 💰 最適価格判定（複数ECサイトで最安値）
 */
function isLowestPrice(product, allProducts) {
  // priceDataがある場合は、複数ECサイトの中で最安値か判定
  if (product.priceData && product.priceData.length > 0) {
    const minECPrice = Math.min(...product.priceData.map((p) => p.amount));
    return minECPrice === product.priceJPY;
  }

  // 全商品の中で最安値か判定
  const minPrice = Math.min(...allProducts.map((p) => p.priceJPY));
  return product.priceJPY === minPrice;
}

/**
 * 📊 高含有リード判定（成分量が最も多い）
 */
function isHighestContent(product, allProducts) {
  const primaryIngredient = getPrimaryIngredient(product);
  if (!primaryIngredient || !product.servingsPerDay) {
    return false;
  }

  const productDailyAmount = primaryIngredient.amount * product.servingsPerDay;

  // 同じ成分を含む商品の中で最高含有量か判定
  const productsWithSameIngredient = allProducts.filter((p) => {
    const pPrimary = getPrimaryIngredient(p);
    return (
      pPrimary &&
      pPrimary.id === primaryIngredient.id &&
      pPrimary.amount > 0 &&
      p.servingsPerDay > 0
    );
  });

  if (productsWithSameIngredient.length === 0) return false;

  const dailyAmounts = productsWithSameIngredient.map((p) => {
    const pPrimary = getPrimaryIngredient(p);
    return (pPrimary?.amount || 0) * (p.servingsPerDay || 1);
  });

  const maxDailyAmount = Math.max(...dailyAmounts);

  // 浮動小数点の精度問題に対応するため、許容誤差を使用
  const tolerance = 0.001;
  return Math.abs(productDailyAmount - maxDailyAmount) < tolerance;
}

/**
 * 💡 高効率モデル判定（コスパが最も優れている）
 */
function isBestValue(product, allProducts) {
  const primaryIngredient = getPrimaryIngredient(product);
  const productCostPerMg = calculateCostPerMg(product);

  if (productCostPerMg === null || !primaryIngredient) {
    return false;
  }

  // 同じ成分を含む商品の中で最もコスパが良いか判定
  const productsWithSameIngredient = allProducts.filter((p) => {
    const pPrimary = getPrimaryIngredient(p);
    return pPrimary && pPrimary.id === primaryIngredient.id;
  });

  const costPerMgValues = productsWithSameIngredient
    .map((p) => calculateCostPerMg(p))
    .filter((cost) => cost !== null);

  if (costPerMgValues.length === 0) return false;

  const minCostPerMg = Math.min(...costPerMgValues);

  const tolerance = 0.01; // 0.01円/mg未満の差は同一とみなす
  return Math.abs(productCostPerMg - minCostPerMg) < tolerance;
}

/**
 * 商品が獲得している称号を判定
 */
function evaluateBadges(product, allProducts) {
  const badges = [];

  // 1. 💰 最適価格判定
  if (isLowestPrice(product, allProducts)) {
    badges.push("lowest-price");
  }

  // 2. 📊 高含有リード判定
  if (isHighestContent(product, allProducts)) {
    badges.push("highest-content");
  }

  // 3. 💡 高効率モデル判定
  if (isBestValue(product, allProducts)) {
    badges.push("best-value");
  }

  // 4. 🔬 高エビデンス判定（エビデンススコア90点以上）
  if (product.scores?.evidence && product.scores.evidence >= 90) {
    badges.push("evidence-s");
  }

  // 5. 🛡️ 高安全性判定（安全性スコア90点以上）
  if (product.scores?.safety && product.scores.safety >= 90) {
    badges.push("high-safety");
  }

  return badges;
}

/**
 * メイン処理
 */
async function calculateBadges() {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏆 称号バッジ自動計算スクリプト");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (isDryRun) {
      console.log("💡 DRY-RUNモード（--fixオプションで実際に更新）\n");
    }

    console.log("📥 商品データを取得中...");
    const products = await fetchProducts();
    console.log(`✅ ${products.length}件の商品を取得しました\n`);

    console.log("🔍 称号バッジを計算中...\n");

    const updates = [];

    for (const product of products) {
      const newBadges = evaluateBadges(product, products);

      // 既存のbadgesと比較
      const oldBadges = product.badges || [];
      const badgesChanged =
        JSON.stringify(oldBadges.sort()) !== JSON.stringify(newBadges.sort());

      if (badgesChanged) {
        updates.push({
          productId: product._id,
          productName: product.name,
          oldBadges,
          newBadges,
        });
      }
    }

    // 結果表示
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📈 称号バッジ計算結果");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log(`🔄 更新が必要な商品: ${updates.length}件\n`);

    // 統計情報
    const badgeStats = {};
    for (const badgeType of Object.keys(BADGE_DEFINITIONS)) {
      const count = products.filter((p) =>
        evaluateBadges(p, products).includes(badgeType)
      ).length;
      badgeStats[badgeType] = count;
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 称号別獲得商品数");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    for (const [badgeType, count] of Object.entries(badgeStats)) {
      const badge = BADGE_DEFINITIONS[badgeType];
      console.log(`${badge.label}: ${count}件`);
    }
    console.log("");

    // 5冠達成商品
    const perfectProducts = products.filter(
      (p) => evaluateBadges(p, products).length === 5
    );
    console.log(`🌟 5冠達成商品: ${perfectProducts.length}件\n`);

    if (updates.length > 0) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📋 更新内容（最初の30件）");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      for (const [index, update] of updates.slice(0, 30).entries()) {
        console.log(`${index + 1}. ${update.productName.substring(0, 60)}...`);

        const oldBadgeLabels =
          update.oldBadges.length > 0
            ? update.oldBadges
                .map((b) => BADGE_DEFINITIONS[b]?.label || b)
                .join(", ")
            : "なし";
        const newBadgeLabels =
          update.newBadges.length > 0
            ? update.newBadges
                .map((b) => BADGE_DEFINITIONS[b]?.label || b)
                .join(", ")
            : "なし";

        console.log(`   現在: ${oldBadgeLabels}`);
        console.log(`   更新: ${newBadgeLabels}`);
        console.log("");
      }

      if (updates.length > 30) {
        console.log(`\n... 他${updates.length - 30}件\n`);
      }
    }

    // 修正実行
    if (shouldFix && updates.length > 0) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔧 称号バッジを更新中...");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      let successCount = 0;
      let errorCount = 0;

      for (const update of updates) {
        try {
          await client
            .patch(update.productId)
            .set({
              badges: update.newBadges,
            })
            .commit();

          successCount++;
          console.log(
            `✅ ${update.productName.substring(0, 60)}... - 称号バッジ更新`
          );
        } catch (error) {
          errorCount++;
          console.error(
            `❌ ${update.productName.substring(0, 60)}... - エラー: ${error.message}`
          );
        }
      }

      console.log(`\n更新完了: ${successCount}件成功、${errorCount}件失敗\n`);
    } else if (isDryRun && updates.length > 0) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💡 次のステップ");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      console.log(
        "実際に更新を適用するには、--fix オプションを付けて実行してください:"
      );
      console.log("  node scripts/calculate-badges.mjs --fix\n");
    } else if (updates.length === 0) {
      console.log("✅ すべての商品の称号バッジは最新の状態です！\n");
    }
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

calculateBadges()
  .then(() => {
    console.log("✅ 称号バッジ計算完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
