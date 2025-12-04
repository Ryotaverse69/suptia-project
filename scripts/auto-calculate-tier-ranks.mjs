#!/usr/bin/env node

/**
 * Tierランク自動計算・更新スクリプト
 *
 * 目的:
 * 1. 実際のデータ（価格、成分量、コスパなど）からTierランクを自動計算
 * 2. Sanityの各商品のtierRatingsフィールドを自動更新
 * 3. 手動設定との不一致を解消
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

// カテゴリ別重み付けマトリクスの読み込み
const categoryWeights = JSON.parse(
  readFileSync(join(__dirname, "../apps/web/src/data/category-weights.json"), "utf-8")
);

// 成分カテゴリマッピングの読み込み
const ingredientCategoryMapping = JSON.parse(
  readFileSync(join(__dirname, "../apps/web/src/data/ingredient-category-mapping.json"), "utf-8")
);

// 成分別推奨摂取量の読み込み
const recommendedDailyIntake = JSON.parse(
  readFileSync(join(__dirname, "../apps/web/src/data/recommended-daily-intake.json"), "utf-8")
);

// 成分名正規化関数のインポート
import { normalizeIngredientName } from "./ingredient-normalizer.mjs";

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
 * マルチビタミン判定
 *
 * 成分数が3より多い場合、マルチビタミンとみなす
 *
 * @param {Array} ingredients - 商品の成分配列
 * @returns {boolean} マルチビタミンかどうか
 */
function isMultiVitamin(ingredients) {
  return ingredients && ingredients.length > 3;
}

/**
 * 主要成分トップ5を取得
 *
 * mg量が多い順にソートして上位5件を返す
 *
 * @param {Array} ingredients - 成分配列
 * @returns {Array} トップ5成分
 */
function getTop5MajorIngredients(ingredients) {
  if (!ingredients || ingredients.length === 0) return [];

  // mg量でソート（降順）
  const sorted = [...ingredients].sort(
    (a, b) => b.amountMgPerServing - a.amountMgPerServing
  );

  // トップ5を返す（5件未満の場合は全件）
  return sorted.slice(0, 5);
}

/**
 * マルチビタミン用のcost/mg計算
 *
 * 主要成分トップ5（mg量が多い順）のみを使ってコスト効率を計算
 * 微量成分を除外することで、実質的な価値を正確に反映
 *
 * @param {number} price - 商品価格
 * @param {Array} ingredients - 成分配列
 * @param {number} servingsPerContainer - 1容器あたりの回数
 * @returns {number} 1mgあたりのコスト（円）
 */
function calculateCostPerMgForMultiVitamin(price, ingredients, servingsPerContainer) {
  // 主要成分トップ5を取得
  const top5Ingredients = getTop5MajorIngredients(ingredients);

  // トップ5の合計mg（1回分）
  const top5MgPerServing = top5Ingredients.reduce(
    (sum, ingredient) => sum + ingredient.amountMgPerServing,
    0
  );

  // 全容器の主要成分合計mg
  const totalTop5Mg = top5MgPerServing * servingsPerContainer;

  if (totalTop5Mg === 0) {
    return 0;
  }

  return price / totalTop5Mg;
}

/**
 * スコアをS/A/B/C/Dランクに変換
 * @param {number} score 0-100のスコア
 * @param {boolean} reverse trueの場合、低い方が良い（価格など）
 * @returns {string} S/A/B/C/D
 */
function scoreToRank(score, reverse = false) {
  const adjustedScore = reverse ? 100 - score : score;

  if (adjustedScore >= 90) return "S";
  if (adjustedScore >= 80) return "A";
  if (adjustedScore >= 70) return "B";
  if (adjustedScore >= 60) return "C";
  return "D";
}

/**
 * ハイブリッド方式による含有量ランク計算
 *
 * 絶対評価（推奨摂取量に対する充足率）+ 相対評価（最高含有量ボーナス）
 *
 * @param {number} amountMgPerServing - 1回あたりの含有量（mg）
 * @param {number} servingsPerDay - 1日あたりの摂取回数
 * @param {string} ingredientName - 成分名（推奨量取得用）
 * @param {number[]} allDailyAmounts - 同じ成分を持つ全商品の1日あたり含有量配列
 * @returns {string} S/A/B/C/D
 */
function calculateContentRankHybrid(amountMgPerServing, servingsPerDay, ingredientName, allDailyAmounts) {
  // 1日あたりの含有量を計算
  const dailyAmount = amountMgPerServing * (servingsPerDay || 1);

  // 推奨摂取量を取得（見つからない場合はnull）
  const recommendedDose = getRecommendedDose(ingredientName);

  // 推奨摂取量が設定されていない場合は従来の相対評価にフォールバック
  if (!recommendedDose || recommendedDose <= 0) {
    return calculateContentRankRelative(dailyAmount, allDailyAmounts);
  }

  // 推奨量に対する充足率を計算
  const fulfillmentRatio = dailyAmount / recommendedDose;

  // 絶対評価による基本ランク
  let baseRank;
  if (fulfillmentRatio >= 5.0) baseRank = 'S';       // 500%以上
  else if (fulfillmentRatio >= 2.0) baseRank = 'A'; // 200%以上
  else if (fulfillmentRatio >= 1.0) baseRank = 'B'; // 100%以上（推奨量を満たす）
  else if (fulfillmentRatio >= 0.5) baseRank = 'C'; // 50%以上
  else baseRank = 'D';                              // 50%未満

  // 相対評価ボーナス: 同カテゴリ内で最高含有量なら1ランクアップ
  if (allDailyAmounts && allDailyAmounts.length > 1) {
    const maxAmount = Math.max(...allDailyAmounts);
    // 最高含有量（許容誤差0.1%）かつSランク未満の場合
    if (Math.abs(dailyAmount - maxAmount) / maxAmount < 0.001 && baseRank !== 'S') {
      baseRank = upgradeRank(baseRank);
    }
  }

  return baseRank;
}

/**
 * 成分名から推奨摂取量を取得
 * @param {string} ingredientName - 成分名
 * @returns {number|null} 推奨摂取量（mg）または null
 */
function getRecommendedDose(ingredientName) {
  if (!ingredientName) return null;

  // 完全一致を試みる
  if (recommendedDailyIntake[ingredientName]) {
    return recommendedDailyIntake[ingredientName];
  }

  // 部分一致を試みる
  for (const [name, dose] of Object.entries(recommendedDailyIntake)) {
    if (name === '_comment' || name === '_note') continue;
    if (ingredientName.includes(name) || name.includes(ingredientName)) {
      return dose;
    }
  }

  return null;
}

/**
 * ランクを1段階上げる
 * @param {string} rank - 現在のランク
 * @returns {string} 1段階上のランク
 */
function upgradeRank(rank) {
  const rankOrder = ['D', 'C', 'B', 'A', 'S'];
  const currentIndex = rankOrder.indexOf(rank);
  if (currentIndex < rankOrder.length - 1) {
    return rankOrder[currentIndex + 1];
  }
  return rank;
}

/**
 * 従来の相対評価による含有量ランク計算（フォールバック用）
 * @param {number} dailyAmount - 1日あたりの含有量
 * @param {number[]} allDailyAmounts - 全商品の1日あたり含有量配列
 * @returns {string} S/A/B/C/D
 */
function calculateContentRankRelative(dailyAmount, allDailyAmounts) {
  if (!allDailyAmounts || allDailyAmounts.length === 0) return 'D';

  const sortedAmounts = [...allDailyAmounts].sort((a, b) => a - b);
  const n = sortedAmounts.length;

  // 同値を考慮したパーセンタイル計算
  const belowCount = sortedAmounts.filter(a => a < dailyAmount).length;
  const sameCount = sortedAmounts.filter(a => a === dailyAmount).length;
  const percentile = ((belowCount + sameCount / 2) / n) * 100;

  // 含有量が多いほど高ランク
  if (percentile >= 80) return 'S';
  if (percentile >= 60) return 'A';
  if (percentile >= 40) return 'B';
  if (percentile >= 20) return 'C';
  return 'D';
}

/**
 * 成分名から詳細カテゴリを判定
 * @param {string} ingredientName - 成分名
 * @returns {string} カテゴリ名（水溶性ビタミン、脂溶性ビタミン、ミネラル、機能性成分、アミノ酸、マルチビタミン、その他）
 */
function getIngredientCategory(ingredientName) {
  if (!ingredientName) return "その他";

  // 各カテゴリをチェック
  for (const [category, ingredientList] of Object.entries(ingredientCategoryMapping)) {
    // 完全一致または部分一致をチェック
    const isMatch = ingredientList.some(name => {
      return ingredientName.includes(name) || name.includes(ingredientName);
    });

    if (isMatch) {
      return category;
    }
  }

  // どのカテゴリにも該当しない場合
  return "その他";
}

/**
 * カテゴリ別重み付けによる総合スコア計算
 * @param {object} ranks - 5つのランク {priceRank, costEffectivenessRank, contentRank, evidenceRank, safetyRank}
 * @param {string} ingredientName - 成分名（カテゴリ判定用）
 * @returns {number} 重み付け後の総合スコア（0-100）
 */
function calculateWeightedOverallScore(ranks, ingredientName) {
  const rankValues = { S: 100, A: 85, B: 75, C: 65, D: 50 };

  // 成分カテゴリを判定
  const category = getIngredientCategory(ingredientName);

  // カテゴリ別の重みを取得（デフォルトは「その他」）
  const weights = categoryWeights[category] || categoryWeights["その他"];

  // 重み付けスコアの計算
  const weightedScore =
    rankValues[ranks.priceRank] * weights.priceWeight +
    rankValues[ranks.costEffectivenessRank] * weights.costEffectivenessWeight +
    rankValues[ranks.contentRank] * weights.contentWeight +
    rankValues[ranks.evidenceRank] * weights.evidenceWeight +
    rankValues[ranks.safetyRank] * weights.safetyWeight;

  return Math.round(weightedScore * 100) / 100; // 小数点第2位まで
}

/**
 * evidenceLevelをスコアに変換
 * @param {string} level S/A/B/C/D
 * @returns {number} 0-100のスコア
 */
function evidenceLevelToScore(level) {
  switch (level) {
    case "S": return 95;
    case "A": return 85;
    case "B": return 75;
    case "C": return 65;
    case "D": return 55;
    default: return 50; // レベルが設定されていない場合
  }
}

/**
 * safetyLevelをスコアに変換
 * @param {string} level S/A/B/C/D
 * @returns {number} 0-100のスコア
 */
function safetyLevelToScore(level) {
  switch (level) {
    case "S": return 100;
    case "A": return 90;
    case "B": return 80;
    case "C": return 70;
    case "D": return 60;
    default: return 75; // レベルが設定されていない場合
  }
}

/**
 * 商品のエビデンススコア・安全性スコアを計算
 * @param {Array} ingredients 成分配列
 * @param {number} servingsPerDay 1日あたりの摂取回数
 * @param {boolean} isMultiVitamin マルチビタミンかどうか
 * @returns {Object} {evidenceScore, safetyScore, overall}
 */
function calculateProductScores(ingredients, servingsPerDay, isMultiVitamin = false) {
  if (!ingredients || ingredients.length === 0) {
    return {
      evidenceScore: 50,
      safetyScore: 75,
      overall: 63,
    };
  }

  // 全成分の1日あたりの総量を計算
  let totalDailyAmount = 0;
  const ingredientScores = [];

  for (const ing of ingredients) {
    if (!ing.ingredient || !ing.amountMgPerServing || ing.amountMgPerServing <= 0) {
      continue;
    }

    const dailyAmount = ing.amountMgPerServing * (servingsPerDay || 1);
    totalDailyAmount += dailyAmount;

    const evidenceScore = evidenceLevelToScore(ing.ingredient.evidenceLevel);
    const safetyScore = safetyLevelToScore(ing.ingredient.safetyLevel);

    ingredientScores.push({
      name: ing.ingredient.name,
      dailyAmount,
      evidenceScore,
      safetyScore,
    });
  }

  if (totalDailyAmount === 0 || ingredientScores.length === 0) {
    return {
      evidenceScore: 50,
      safetyScore: 75,
      overall: 63,
    };
  }

  // マルチビタミンの場合、トップ5成分のみでスコア計算（コスパ計算との一貫性）
  const targetScores = isMultiVitamin
    ? [...ingredientScores].sort((a, b) => b.dailyAmount - a.dailyAmount).slice(0, 5)
    : ingredientScores;

  const totalTargetAmount = targetScores.reduce(
    (sum, ing) => sum + ing.dailyAmount,
    0
  );

  // 配合量に基づく加重平均を計算
  let weightedEvidenceScore = 0;
  let weightedSafetyScore = 0;

  for (const ing of targetScores) {
    const weight = ing.dailyAmount / totalTargetAmount;
    weightedEvidenceScore += ing.evidenceScore * weight;
    weightedSafetyScore += ing.safetyScore * weight;
  }

  // 小数点第2位で四捨五入
  const evidenceScore = Math.round(weightedEvidenceScore * 100) / 100;
  const safetyScore = Math.round(weightedSafetyScore * 100) / 100;
  const overall = Math.round((evidenceScore + safetyScore) / 2);

  return {
    evidenceScore,
    safetyScore,
    overall,
  };
}

/**
 * パーセンタイルを計算（外れ値に強いTrimmed Percentile + Bessel補正）
 * @param {number} value 評価する値
 * @param {number[]} values 比較対象の値の配列
 * @param {boolean} lowerIsBetter trueの場合、低い方が良い
 * @param {number} trimPercent 除外する割合（%）デフォルト5%
 * @returns {number} 0-100のパーセンタイル
 *
 * 外れ値対策（Trimmed Percentile）:
 * - データ数が10件以上の場合、上下5%（デフォルト）を除外
 * - 超高額商品・異常値の影響を排除してランク判定を適正化
 * - 例: [¥500, ¥800, ¥1000, ¥1200, ¥50000] → 上下除外後 [¥800, ¥1000, ¥1200]
 *
 * Bessel補正（統計学的精度向上）:
 * - 平均順位を使用（重複値の場合、同じ値の中央順位を採用）
 * - (R - 1) / (N - 1) * 100 で計算（境界ケースでも安定）
 * - 重複値が多い場合でも正確なランク判定が可能
 */
function calculatePercentile(value, values, lowerIsBetter = false, trimPercent = 5) {
  if (values.length === 0) return 50;

  const sortedValues = [...values].sort((a, b) => a - b);

  // 外れ値除外（データ数が10件以上の場合のみ）
  let trimmedValues = sortedValues;
  if (sortedValues.length >= 10) {
    const trimCount = Math.floor(sortedValues.length * (trimPercent / 100));
    if (trimCount > 0) {
      trimmedValues = sortedValues.slice(trimCount, sortedValues.length - trimCount);
    }
  }

  const N = trimmedValues.length;

  // 厳密な順位計算（平均順位方式 - Bessel補正）
  const sameValues = trimmedValues.filter(v => v === value);
  const lowerCount = trimmedValues.filter(v => v < value).length;

  // 同じ値がある場合、その範囲の中央順位を使用
  // 例: [1, 2, 2, 2, 3] で value=2 の場合、lowerCount=1、sameValues.length=3
  // rank = 1 + (3 + 1) / 2 = 3（2番目、3番目、4番目の中央）
  const rank = lowerCount + (sameValues.length + 1) / 2;

  // Bessel補正: (R - 1) / (N - 1) * 100
  // N=1の場合は50%（中央値）を返す
  const percentile = N === 1 ? 50 : ((rank - 1) / (N - 1)) * 100;

  return lowerIsBetter ? 100 - percentile : percentile;
}

/**
 * Tierランクを自動計算
 */
async function calculateTierRanks() {
  console.log(`🔍 Tierランクの自動計算を開始${isDryRun ? '（プレビューモード）' : ''}...\n`);

  try {
    // 全商品を取得
    const products = await client.fetch(
      `*[_type == "product" && availability == "in-stock"] | order(name asc){
        _id,
        name,
        slug,
        priceJPY,
        servingsPerDay,
        servingsPerContainer,
        ingredients[]{
          amountMgPerServing,
          ingredient->{
            _id,
            name,
            evidenceLevel,
            safetyLevel
          }
        },
        scores,
        tierRatings,
        references,
        warnings
      }`
    );

    console.log(`📊 全${products.length}件の商品を分析\n`);

    // 成分別にグループ化
    const ingredientGroups = {};

    for (const product of products) {
      if (!product.ingredients || product.ingredients.length === 0) continue;

      // ⚠️ 重要: 主成分（配列の最初の要素）のみでランク付け
      // 複数成分を含む商品が重複して処理され、最後の成分でランクが上書きされるのを防ぐ
      const primaryIngredient = product.ingredients[0];
      if (!primaryIngredient.ingredient || !primaryIngredient.ingredient._id) continue;
      if (!primaryIngredient.amountMgPerServing || primaryIngredient.amountMgPerServing <= 0) continue;

      const ing = primaryIngredient;

      // 成分名を正規化（表記ゆらぎを吸収）
      const normalizedName = normalizeIngredientName(ing.ingredient.name);

      // 正規化された成分名でグループ化
      if (!ingredientGroups[normalizedName]) {
        ingredientGroups[normalizedName] = {
          name: normalizedName,
          products: [],
        };
      }

      // 必須データのバリデーション
      if (!product.priceJPY || product.priceJPY <= 0) continue;
      if (!product.servingsPerContainer || product.servingsPerContainer <= 0) continue;
      if (!product.servingsPerDay || product.servingsPerDay <= 0) continue;

      const costPerDay = product.priceJPY / (product.servingsPerContainer / product.servingsPerDay);

      // マルチビタミン判定：成分数 > 3 の場合はトップ5方式
      let costPerMg;
      if (isMultiVitamin(product.ingredients)) {
        // マルチビタミン：主要成分トップ5のみで計算
        costPerMg = calculateCostPerMgForMultiVitamin(
          product.priceJPY,
          product.ingredients,
          product.servingsPerContainer
        );
      } else {
        // 単一成分系：従来通りの計算
        costPerMg = product.priceJPY / (ing.amountMgPerServing * product.servingsPerContainer);
      }

      // NaNやInfinityをチェック
      if (!isFinite(costPerDay) || !isFinite(costPerMg)) {
        console.log(`⚠️  スキップ: ${product.name.substring(0, 60)}... (不正な計算結果)`);
        continue;
      }

      // スコアを計算（マルチビタミンの場合はトップ5のみ）
      const calculatedScores = calculateProductScores(
        product.ingredients,
        product.servingsPerDay,
        isMultiVitamin(product.ingredients) // マルチビタミン判定を渡す
      );

      ingredientGroups[normalizedName].products.push({
        productId: product._id,
        productName: product.name,
        slug: product.slug?.current,
        price: product.priceJPY,
        costPerDay,
        costPerMg,
        amount: ing.amountMgPerServing,
        servingsPerDay: product.servingsPerDay || 1,
        ingredientName: ing.ingredient.name, // ハイブリッド方式用
        safetyScore: calculatedScores.safetyScore,
        evidenceScore: calculatedScores.evidenceScore,
        overallScore: calculatedScores.overall,
        referenceCount: product.references?.length || 0,
        warningCount: product.warnings?.length || 0,
        currentTierRatings: product.tierRatings,
        currentScores: product.scores, // 現在のスコアを保持
        // スコア計算結果を保持（後でSanityに保存）
        calculatedScores,
      });
    }

    // 各成分グループ内でランクを計算
    const updates = [];

    console.log(`\n📊 成分グループ数: ${Object.keys(ingredientGroups).length}件`);
    for (const [ingredientId, group] of Object.entries(ingredientGroups)) {
      console.log(`   ${group.name}: ${group.products.length}件`);
      if (ingredientId === "ingredient-vitamin-c") {
        console.log(`      🔍 ビタミンCグループを処理開始`);
        console.log(`      🔍 DHC商品を検索...`);
        const dhcProducts = group.products.filter(p => p.slug === "p-18-dhc-c-90-c-b2-dhc-c-b2-90-vc-well");
        console.log(`      🔍 DHC商品が見つかった数: ${dhcProducts.length}`);
        if (dhcProducts.length > 0) {
          console.log(`      🔍 DHC商品の詳細:`);
          dhcProducts.forEach(p => {
            console.log(`         slug: ${p.slug}`);
            console.log(`         price: ¥${p.price}`);
            console.log(`         costPerMg: ¥${p.costPerMg?.toFixed(4)}/mg`);
            console.log(`         amount: ${p.amount}mg`);
          });
        } else {
          console.log(`      ⚠️  DHC商品が見つかりませんでした！`);
          console.log(`      利用可能なslugの例（最初の3件）:`);
          group.products.slice(0, 3).forEach(p => {
            console.log(`         - ${p.slug}`);
          });
        }
      }
    }
    console.log();

    for (const [ingredientId, group] of Object.entries(ingredientGroups)) {
      const { products: groupProducts } = group;

      // 各指標の値の配列を抽出
      const prices = groupProducts.map(p => p.price);
      const costsPerMg = groupProducts.map(p => p.costPerMg);
      const amounts = groupProducts.map(p => p.amount);
      const dailyAmounts = groupProducts.map(p => p.amount * p.servingsPerDay); // 1日あたりの含有量
      const safetyScores = groupProducts.map(p => p.safetyScore);
      const evidenceScores = groupProducts.map(p => p.evidenceScore);

      for (const productData of groupProducts) {
        // デバッグ: 該当商品の場合、詳細ログを出力
        const isTargetProduct = productData.slug === "p-18-dhc-c-90-c-b2-dhc-c-b2-90-vc-well";

        // 1. 価格ランク（安い方が良い）
        const pricePercentile = calculatePercentile(productData.price, prices, true);
        const priceRank = scoreToRank(pricePercentile);

        // 2. コスパランク（コスト/mgが低い方が良い）
        const costPerMgPercentile = calculatePercentile(productData.costPerMg, costsPerMg, true);
        const costEffectivenessRank = scoreToRank(costPerMgPercentile);

        if (isTargetProduct) {
          console.log(`\n🔍 [デバッグ] ${productData.productName.substring(0, 60)}...`);
          console.log(`   コスパ: ¥${productData.costPerMg?.toFixed(4)}/mg`);
          console.log(`   costsPerMg配列の要素数: ${costsPerMg.length}件`);
          console.log(`   costsPerMg配列の最小値: ¥${Math.min(...costsPerMg).toFixed(4)}/mg`);
          console.log(`   コスパパーセンタイル: ${costPerMgPercentile.toFixed(2)}%`);
          console.log(`   コスパランク: ${costEffectivenessRank}`);
        }

        // 3. 含有量ランク（ハイブリッド方式：絶対評価 + 相対評価）
        const contentRank = calculateContentRankHybrid(
          productData.amount,
          productData.servingsPerDay,
          productData.ingredientName,
          dailyAmounts
        );

        if (isTargetProduct) {
          const dailyAmount = productData.amount * productData.servingsPerDay;
          const recommendedDose = getRecommendedDose(productData.ingredientName);
          console.log(`   含有量: ${productData.amount}mg/回 × ${productData.servingsPerDay}回/日 = ${dailyAmount}mg/日`);
          console.log(`   成分名: ${productData.ingredientName}`);
          console.log(`   推奨摂取量: ${recommendedDose ? recommendedDose + 'mg' : '未設定'}`);
          if (recommendedDose) {
            console.log(`   充足率: ${((dailyAmount / recommendedDose) * 100).toFixed(0)}%`);
          }
          console.log(`   含有量ランク: ${contentRank} (ハイブリッド方式)\n`);
        }

        // 4. エビデンスランク（絶対評価 + 参考文献数ボーナス）
        // エビデンスは相対評価ではなく、成分のevidenceLevelから算出したスコアの絶対評価
        let evidenceScore = productData.evidenceScore;
        // 参考文献が5件以上ある場合、+10点ボーナス
        if (productData.referenceCount >= 5) {
          evidenceScore = Math.min(100, evidenceScore + 10);
        }
        const evidenceRank = scoreToRank(evidenceScore);

        // 5. 安全性ランク（絶対評価 - 警告数ペナルティ）
        // 安全性は相対評価ではなく、成分のsafetyLevelから算出したスコアの絶対評価
        let safetyScore = productData.safetyScore;
        // 警告が3件以上ある場合、-10点ペナルティ
        if (productData.warningCount >= 3) {
          safetyScore = Math.max(0, safetyScore - 10);
        }
        const safetyRank = scoreToRank(safetyScore);

        // 6. 総合評価ランク（カテゴリ別重み付け）
        const overallScore = calculateWeightedOverallScore(
          {
            priceRank,
            costEffectivenessRank,
            contentRank,
            evidenceRank,
            safetyRank,
          },
          group.name // 成分名からカテゴリを判定
        );

        // 5冠達成の場合はS+
        const isFiveCrown =
          priceRank === "S" &&
          costEffectivenessRank === "S" &&
          contentRank === "S" &&
          evidenceRank === "S" &&
          safetyRank === "S";

        const overallRank = isFiveCrown ? "S+" : scoreToRank(overallScore);

        const newTierRatings = {
          priceRank,
          costEffectivenessRank,
          contentRank,
          evidenceRank,
          safetyRank,
          overallRank,
        };

        // 変更があるかチェック（ランクの変更 OR スコアが未設定/デフォルト値）
        const hasChanges =
          !productData.currentTierRatings ||
          productData.currentTierRatings.priceRank !== priceRank ||
          productData.currentTierRatings.costEffectivenessRank !== costEffectivenessRank ||
          productData.currentTierRatings.contentRank !== contentRank ||
          productData.currentTierRatings.evidenceRank !== evidenceRank ||
          productData.currentTierRatings.safetyRank !== safetyRank ||
          productData.currentTierRatings.overallRank !== overallRank ||
          // スコアが未設定またはデフォルト値の場合も更新
          !productData.currentScores ||
          !productData.currentScores.evidence ||
          !productData.currentScores.safety ||
          productData.currentScores.evidence === 50 ||
          productData.currentScores.safety === 50;

        if (hasChanges) {
          updates.push({
            productId: productData.productId,
            productName: productData.productName,
            ingredientName: group.name,
            oldTierRatings: productData.currentTierRatings,
            newTierRatings,
            calculatedScores: productData.calculatedScores, // 計算したスコアを保存
            details: {
              price: `¥${productData.price.toLocaleString()}`,
              costPerMg: `¥${productData.costPerMg.toFixed(4)}/mg`,
              amount: `${productData.amount.toFixed(2)}mg`,
              safetyScore: productData.safetyScore,
              evidenceScore: productData.evidenceScore,
            },
          });
        }
      }
    }

    // 結果表示
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 Tierランク計算結果');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`🔄 更新が必要な商品: ${updates.length}件\n`);

    if (updates.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 更新内容（最初の30件）');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      for (const [index, update] of updates.slice(0, 30).entries()) {
        console.log(`${index + 1}. ${update.productName.substring(0, 60)}...`);
        console.log(`   成分: ${update.ingredientName}`);
        console.log(`   価格: ${update.details.price} | コスト/mg: ${update.details.costPerMg} | 含有量: ${update.details.amount}`);

        if (update.oldTierRatings) {
          console.log(`   現在: 💰${update.oldTierRatings.priceRank} 💡${update.oldTierRatings.costEffectivenessRank} 📊${update.oldTierRatings.contentRank} 🔬${update.oldTierRatings.evidenceRank} 🛡️${update.oldTierRatings.safetyRank} ⭐${update.oldTierRatings.overallRank}`);
        } else {
          console.log(`   現在: ランク未設定`);
        }

        console.log(`   更新: 💰${update.newTierRatings.priceRank} 💡${update.newTierRatings.costEffectivenessRank} 📊${update.newTierRatings.contentRank} 🔬${update.newTierRatings.evidenceRank} 🛡️${update.newTierRatings.safetyRank} ⭐${update.newTierRatings.overallRank}`);
        console.log('');
      }

      if (updates.length > 30) {
        console.log(`\n... 他${updates.length - 30}件\n`);
      }
    }

    // 修正実行
    if (shouldFix && updates.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔧 Tierランクを更新中...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      let successCount = 0;
      let errorCount = 0;

      for (const update of updates) {
        try {
          // tierRatingsとscoresを両方更新
          await client
            .patch(update.productId)
            .set({
              tierRatings: update.newTierRatings,
              scores: {
                evidence: update.calculatedScores.evidenceScore,
                safety: update.calculatedScores.safetyScore,
                overall: update.calculatedScores.overall,
              },
            })
            .commit();

          successCount++;
          console.log(`✅ ${update.productName.substring(0, 60)}... - Tierランク & スコア更新`);
        } catch (error) {
          errorCount++;
          console.error(`❌ ${update.productName.substring(0, 60)}... - エラー: ${error.message}`);
        }
      }

      console.log(`\n更新完了: ${successCount}件成功、${errorCount}件失敗\n`);
    } else if (isDryRun && updates.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 次のステップ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('実際に更新を適用するには、--fix オプションを付けて実行してください:');
      console.log('  node scripts/auto-calculate-tier-ranks.mjs --fix\n');
    } else if (updates.length === 0) {
      console.log('✅ すべての商品のTierランクは最新の状態です！\n');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

calculateTierRanks()
  .then(() => {
    console.log('✅ Tierランク計算完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
