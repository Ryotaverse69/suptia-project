#!/usr/bin/env node

/**
 * 商品データ品質分析スクリプト
 *
 * コスパ・含有量計算の正確性を確保するため、以下を分析：
 * 1. 成分データの完全性（どの商品に何が不足しているか）
 * 2. 成分別の商品分布（どの成分の商品が多いか）
 * 3. データ品質スコア（計算可能な商品の割合）
 * 4. 単位の統一状況（mg、μg、IUの混在）
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

async function analyzeDataQuality() {
  console.log('🔍 商品データ品質分析を開始...\n');

  try {
    // 全商品を取得
    const products = await client.fetch(
      `*[_type == "product" && availability == "in-stock"] | order(name asc){
        _id,
        name,
        priceJPY,
        servingsPerDay,
        servingsPerContainer,
        source,
        brand->{
          name
        },
        ingredients[]{
          amountMgPerServing,
          ingredient->{
            _id,
            name,
            nameEn,
            category
          }
        }
      }`
    );

    console.log(`📊 全${products.length}件の商品を分析\n`);

    // データ品質カテゴリ分類
    const dataQuality = {
      perfect: [], // 全データ完璧
      hasIngredients: [], // 成分データあり
      noIngredients: [], // 成分データなし
      invalidIngredients: [], // 成分データ不正
      missingPrice: [], // 価格情報不足
      missingServings: [], // 摂取情報不足
    };

    // 成分別商品数
    const ingredientStats = {};

    // ECサイト別統計
    const sourceStats = {};

    for (const product of products) {
      // ECサイト別集計
      const source = product.source || 'unknown';
      sourceStats[source] = (sourceStats[source] || 0) + 1;

      // 価格情報チェック
      if (!product.priceJPY || product.priceJPY <= 0) {
        dataQuality.missingPrice.push(product);
        continue;
      }

      // 摂取情報チェック
      if (!product.servingsPerDay || !product.servingsPerContainer ||
          product.servingsPerDay <= 0 || product.servingsPerContainer <= 0) {
        dataQuality.missingServings.push(product);
        continue;
      }

      // 成分データチェック
      if (!product.ingredients || product.ingredients.length === 0) {
        dataQuality.noIngredients.push(product);
        continue;
      }

      // 成分データの妥当性チェック
      let hasValidIngredient = false;
      let hasInvalidIngredient = false;

      for (const ing of product.ingredients) {
        if (!ing.ingredient || !ing.ingredient._id) {
          hasInvalidIngredient = true;
          continue;
        }

        if (!ing.amountMgPerServing || ing.amountMgPerServing <= 0) {
          hasInvalidIngredient = true;
          continue;
        }

        hasValidIngredient = true;

        // 成分別統計
        const ingredientName = ing.ingredient.name;
        if (!ingredientStats[ingredientName]) {
          ingredientStats[ingredientName] = {
            count: 0,
            products: [],
            minAmount: Infinity,
            maxAmount: 0,
            avgAmount: 0,
          };
        }
        ingredientStats[ingredientName].count++;
        ingredientStats[ingredientName].products.push({
          name: product.name,
          amount: ing.amountMgPerServing,
          priceJPY: product.priceJPY,
          servingsPerContainer: product.servingsPerContainer,
        });
        ingredientStats[ingredientName].minAmount = Math.min(
          ingredientStats[ingredientName].minAmount,
          ing.amountMgPerServing
        );
        ingredientStats[ingredientName].maxAmount = Math.max(
          ingredientStats[ingredientName].maxAmount,
          ing.amountMgPerServing
        );
      }

      if (hasInvalidIngredient && !hasValidIngredient) {
        dataQuality.invalidIngredients.push(product);
      } else if (hasValidIngredient) {
        if (hasInvalidIngredient) {
          dataQuality.hasIngredients.push(product);
        } else {
          dataQuality.perfect.push(product);
        }
      }
    }

    // 平均含有量を計算
    for (const ingredientName in ingredientStats) {
      const stat = ingredientStats[ingredientName];
      const amounts = stat.products.map(p => p.amount);
      stat.avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    }

    // 結果表示
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 データ品質サマリー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const totalProducts = products.length;
    const perfectRate = (dataQuality.perfect.length / totalProducts * 100).toFixed(1);
    const hasIngredientsRate = ((dataQuality.perfect.length + dataQuality.hasIngredients.length) / totalProducts * 100).toFixed(1);

    console.log(`✅ 完璧なデータ: ${dataQuality.perfect.length}件 (${perfectRate}%)`);
    console.log(`🟡 成分データあり（一部不完全）: ${dataQuality.hasIngredients.length}件`);
    console.log(`❌ 成分データなし: ${dataQuality.noIngredients.length}件`);
    console.log(`⚠️  成分データ不正: ${dataQuality.invalidIngredients.length}件`);
    console.log(`💰 価格情報不足: ${dataQuality.missingPrice.length}件`);
    console.log(`📦 摂取情報不足: ${dataQuality.missingServings.length}件`);
    console.log(`\n📊 コスパ計算可能: ${dataQuality.perfect.length + dataQuality.hasIngredients.length}件 (${hasIngredientsRate}%)\n`);

    // ECサイト別統計
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏪 ECサイト別商品数');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    Object.entries(sourceStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([source, count]) => {
        console.log(`   ${source}: ${count}件`);
      });

    // 成分別統計（商品数が多い順）
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 成分別商品数ランキング（Top 15）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const sortedIngredients = Object.entries(ingredientStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 15);

    sortedIngredients.forEach(([name, stat], index) => {
      console.log(`${index + 1}. ${name}: ${stat.count}件`);
      console.log(`   含有量範囲: ${stat.minAmount.toFixed(2)}mg 〜 ${stat.maxAmount.toFixed(2)}mg`);
      console.log(`   平均含有量: ${stat.avgAmount.toFixed(2)}mg/回`);

      // コスパ計算可能な商品でコスパ分析
      const validProducts = stat.products.filter(p =>
        p.amount > 0 && p.priceJPY > 0 && p.servingsPerContainer > 0
      );

      if (validProducts.length > 0) {
        const costPerMg = validProducts.map(p =>
          p.priceJPY / (p.amount * p.servingsPerContainer)
        );
        const minCostPerMg = Math.min(...costPerMg);
        const maxCostPerMg = Math.max(...costPerMg);
        const avgCostPerMg = costPerMg.reduce((sum, c) => sum + c, 0) / costPerMg.length;

        console.log(`   コスト/mg: ¥${minCostPerMg.toFixed(4)} 〜 ¥${maxCostPerMg.toFixed(4)} (平均: ¥${avgCostPerMg.toFixed(4)})`);

        // 最もコスパが良い商品
        const bestValueIndex = costPerMg.indexOf(minCostPerMg);
        const bestProduct = validProducts[bestValueIndex];
        console.log(`   💰 ベストバリュー: ${bestProduct.name.substring(0, 50)}... (¥${minCostPerMg.toFixed(4)}/mg)`);
      }
      console.log('');
    });

    // データ不足の商品詳細（優先度が高いもの）
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  データ整備が必要な商品（優先度高）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 人気成分（商品数が多い）で成分データが不足している商品
    const popularIngredients = sortedIngredients.slice(0, 5).map(([name]) => name);

    const highPriorityProducts = dataQuality.noIngredients.filter(product => {
      // 商品名に人気成分名が含まれているか
      return popularIngredients.some(ingredientName =>
        product.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
        product.name.includes('ビタミン') ||
        product.name.includes('カルシウム') ||
        product.name.includes('マグネシウム')
      );
    });

    console.log(`🔴 人気成分を含むが成分データ不足: ${highPriorityProducts.length}件\n`);

    highPriorityProducts.slice(0, 20).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   価格: ¥${product.priceJPY} | ECサイト: ${product.source || 'unknown'} | ブランド: ${product.brand?.name || '不明'}`);
      console.log(`   _id: ${product._id}\n`);
    });

    // 推奨アクション
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 推奨アクション');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('1. 【最優先】人気成分の商品に成分データを追加');
    console.log(`   対象: ${highPriorityProducts.length}件`);
    console.log('   方法: auto-populate-ingredients.mjs の精度向上 or 手動入力\n');

    console.log('2. ECサイト連携の改善');
    Object.entries(sourceStats).forEach(([source, count]) => {
      if (source !== 'unknown') {
        const noIngredientsCount = dataQuality.noIngredients.filter(p => p.source === source).length;
        const rate = (noIngredientsCount / count * 100).toFixed(1);
        console.log(`   ${source}: ${noIngredientsCount}/${count}件 (${rate}%) が成分データ不足`);
      }
    });
    console.log('');

    console.log('3. 成分マスタの拡充');
    console.log(`   現在: ${Object.keys(ingredientStats).length}種類の成分`);
    console.log('   追加検討: セサミン、コエンザイムQ10、プロポリス等\n');

    console.log('4. データ検証ルールの実装');
    console.log('   - 成分量の妥当性チェック（異常値検出）');
    console.log('   - 単位の統一（mg/μg/IU）');
    console.log('   - 重複商品の検出と統合\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

analyzeDataQuality()
  .then(() => {
    console.log('✅ 分析完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
