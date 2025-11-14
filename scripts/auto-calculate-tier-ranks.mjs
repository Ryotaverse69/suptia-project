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
 * @returns {Object} {evidenceScore, safetyScore, overall}
 */
function calculateProductScores(ingredients, servingsPerDay) {
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

  // 配合量に基づく加重平均を計算
  let weightedEvidenceScore = 0;
  let weightedSafetyScore = 0;

  for (const ing of ingredientScores) {
    const weight = ing.dailyAmount / totalDailyAmount;
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
 * パーセンタイルを計算（外れ値に強いTrimmed Percentile）
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

  // 除外後のデータ内でインデックスを検索
  const index = trimmedValues.findIndex(v => v >= value);

  if (index === -1) {
    // 除外範囲外の値の場合
    return lowerIsBetter ? 0 : 100;
  }

  const percentile = (index / trimmedValues.length) * 100;
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
      const ingredientId = ing.ingredient._id;

      if (!ingredientGroups[ingredientId]) {
        ingredientGroups[ingredientId] = {
          name: ing.ingredient.name,
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

      // スコアを計算（全成分を考慮）
      const calculatedScores = calculateProductScores(product.ingredients, product.servingsPerDay);

      ingredientGroups[ingredientId].products.push({
        productId: product._id,
        productName: product.name,
        slug: product.slug?.current,
        price: product.priceJPY,
        costPerDay,
        costPerMg,
        amount: ing.amountMgPerServing,
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

        // 3. 含有量ランク（多い方が良い）
        const contentPercentile = calculatePercentile(productData.amount, amounts, false);
        const contentRank = scoreToRank(contentPercentile);

        if (isTargetProduct) {
          console.log(`   含有量: ${productData.amount}mg/回`);
          console.log(`   amounts配列の要素数: ${amounts.length}件`);
          console.log(`   amounts配列の最大値: ${Math.max(...amounts)}mg/回`);
          console.log(`   含有量パーセンタイル: ${contentPercentile.toFixed(2)}%`);
          console.log(`   含有量ランク: ${contentRank}\n`);
        }

        // 4. エビデンスランク（evidenceScoreベース + 参考文献数ボーナス）
        let evidencePercentile = calculatePercentile(productData.evidenceScore, evidenceScores, false);
        // 参考文献が5件以上ある場合、+10点ボーナス
        if (productData.referenceCount >= 5) {
          evidencePercentile = Math.min(100, evidencePercentile + 10);
        }
        const evidenceRank = scoreToRank(evidencePercentile);

        // 5. 安全性ランク（safetyScoreベース - 警告数ペナルティ）
        let safetyPercentile = calculatePercentile(productData.safetyScore, safetyScores, false);
        // 警告が3件以上ある場合、-10点ペナルティ
        if (productData.warningCount >= 3) {
          safetyPercentile = Math.max(0, safetyPercentile - 10);
        }
        const safetyRank = scoreToRank(safetyPercentile);

        // 6. 総合評価ランク（5つのランクの平均）
        const rankValues = { S: 100, A: 85, B: 75, C: 65, D: 50 };
        const overallScore = (
          rankValues[priceRank] +
          rankValues[costEffectivenessRank] +
          rankValues[contentRank] +
          rankValues[evidenceRank] +
          rankValues[safetyRank]
        ) / 5;

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
