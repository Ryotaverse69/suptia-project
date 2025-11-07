#!/usr/bin/env node

/**
 * コスパ計算のデバッグスクリプト
 * 実際の商品データでコスパ計算が正しく行われているか確認
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

// コスパ計算関数（CostEffectivenessDetail.tsxと同じロジック）
function calculateCostPerMg(product) {
  const totalIngredientMg = product.ingredientAmount * product.servingsPerContainer;
  return product.priceJPY / totalIngredientMg;
}

function calculateCostPerDay(product) {
  const daysSupply = product.servingsPerContainer / product.servingsPerDay;
  return product.priceJPY / daysSupply;
}

async function debugCostCalculation() {
  console.log('🔍 コスパ計算のデバッグを開始...\n');

  try {
    // テスト用の商品を取得（成分データがある商品）
    const testProduct = await client.fetch(
      `*[_type == "product"
        && availability == "in-stock"
        && defined(ingredients)
        && count(ingredients) > 0
        && defined(ingredients[0].amountMgPerServing)
        && ingredients[0].amountMgPerServing > 0
      ][0]{
        _id,
        name,
        priceJPY,
        servingsPerDay,
        servingsPerContainer,
        ingredients[]{
          amountMgPerServing,
          ingredient->{
            _id,
            name
          }
        }
      }`
    );

    if (!testProduct) {
      console.error("❌ テスト商品が見つかりませんでした");
      return;
    }

    console.log('📦 テスト商品:', testProduct.name);
    console.log('   価格:', testProduct.priceJPY, '円');
    console.log('   1日あたり摂取回数:', testProduct.servingsPerDay, '回/日');
    console.log('   1容器あたり総回数:', testProduct.servingsPerContainer, '回');
    console.log('   成分数:', testProduct.ingredients?.length || 0);

    if (testProduct.ingredients && testProduct.ingredients.length > 0) {
      console.log('   成分詳細:');
      testProduct.ingredients.forEach((ing, i) => {
        console.log(`     ${i + 1}. ${ing.ingredient?.name || '不明'}: ${ing.amountMgPerServing || '不明'}mg/回`);
      });
    } else {
      console.log('   ⚠️  成分データなし');
    }

    // 主要成分量を取得
    const mainIngredientAmount = testProduct.ingredients?.[0]?.amountMgPerServing || 0;
    console.log('\n📊 コスパ計算:');
    console.log('   主要成分量（1回あたり）:', mainIngredientAmount, 'mg/回');

    if (mainIngredientAmount > 0) {
      // 計算実行
      const totalIngredientMg = mainIngredientAmount * testProduct.servingsPerContainer;
      const costPerMg = testProduct.priceJPY / totalIngredientMg;
      const daysSupply = testProduct.servingsPerContainer / testProduct.servingsPerDay;
      const costPerDay = testProduct.priceJPY / daysSupply;
      const dailyIngredient = mainIngredientAmount * testProduct.servingsPerDay;

      console.log('\n   計算結果:');
      console.log('   ----------------------------------------');
      console.log('   総成分量:', totalIngredientMg.toFixed(2), 'mg');
      console.log('   （計算式: ', mainIngredientAmount, 'mg/回 × ', testProduct.servingsPerContainer, '回）');
      console.log('');
      console.log('   コスト/mg:', costPerMg.toFixed(4), '円/mg');
      console.log('   （計算式: ¥', testProduct.priceJPY, ' ÷ ', totalIngredientMg.toFixed(2), 'mg）');
      console.log('');
      console.log('   供給日数:', daysSupply.toFixed(1), '日分');
      console.log('   （計算式: ', testProduct.servingsPerContainer, '回 ÷ ', testProduct.servingsPerDay, '回/日）');
      console.log('');
      console.log('   コスト/日:', costPerDay.toFixed(0), '円/日');
      console.log('   （計算式: ¥', testProduct.priceJPY, ' ÷ ', daysSupply.toFixed(1), '日）');
      console.log('');
      console.log('   1日あたりの成分量:', dailyIngredient.toFixed(2), 'mg/日');
      console.log('   （計算式: ', mainIngredientAmount, 'mg/回 × ', testProduct.servingsPerDay, '回/日）');
      console.log('   ----------------------------------------');

      // 検証: 計算結果が妥当か
      console.log('\n🔍 妥当性チェック:');

      if (isNaN(costPerMg) || !isFinite(costPerMg)) {
        console.log('   ❌ コスト/mgが不正な値です:', costPerMg);
      } else if (costPerMg < 0.0001) {
        console.log('   ⚠️  コスト/mgが異常に小さい:', costPerMg, '円/mg');
        console.log('       → 成分量が大きすぎる可能性があります');
      } else if (costPerMg > 10) {
        console.log('   ⚠️  コスト/mgが異常に大きい:', costPerMg, '円/mg');
        console.log('       → 成分量が小さすぎる可能性があります');
      } else {
        console.log('   ✅ コスト/mgは妥当な範囲です:', costPerMg.toFixed(4), '円/mg');
      }

      if (isNaN(costPerDay) || !isFinite(costPerDay)) {
        console.log('   ❌ コスト/日が不正な値です:', costPerDay);
      } else if (costPerDay < 1) {
        console.log('   ⚠️  コスト/日が異常に小さい:', costPerDay, '円/日');
      } else if (costPerDay > testProduct.priceJPY) {
        console.log('   ⚠️  コスト/日が商品価格を超えています:', costPerDay, '円/日');
      } else {
        console.log('   ✅ コスト/日は妥当な範囲です:', costPerDay.toFixed(0), '円/日');
      }

    } else {
      console.log('   ❌ 主要成分量が0のため、コスパ計算ができません');
    }

    // 類似商品を確認
    console.log('\n\n🔍 類似商品を確認...\n');

    const mainIngredientId = testProduct.ingredients?.[0]?.ingredient?._id;

    if (!mainIngredientId) {
      console.log('❌ 主要成分IDが取得できないため、類似商品検索ができません');
      return;
    }

    const similarProductsQuery = `*[_type == "product"
      && _id != $productId
      && availability == "in-stock"
      && $mainIngredientId in ingredients[].ingredient._ref
    ]{
      name,
      priceJPY,
      servingsPerDay,
      servingsPerContainer,
      'ingredientAmount': coalesce(
        ingredients[ingredient._ref == $mainIngredientId][0].amountMgPerServing,
        ingredients[0].amountMgPerServing,
        1000
      )
    }[0...5]`;

    const similarProducts = await client.fetch(similarProductsQuery, {
      productId: testProduct._id,
      mainIngredientId,
    });

    console.log(`📋 類似商品: ${similarProducts.length}件\n`);

    similarProducts.forEach((product, i) => {
      console.log(`${i + 1}. ${product.name}`);
      console.log(`   価格: ¥${product.priceJPY}`);
      console.log(`   1日あたり摂取回数: ${product.servingsPerDay}回/日`);
      console.log(`   1容器あたり総回数: ${product.servingsPerContainer}回`);
      console.log(`   成分量: ${product.ingredientAmount}mg/回`);

      if (product.ingredientAmount > 0) {
        const totalMg = product.ingredientAmount * product.servingsPerContainer;
        const costPerMg = product.priceJPY / totalMg;
        const daysSupply = product.servingsPerContainer / product.servingsPerDay;
        const costPerDay = product.priceJPY / daysSupply;

        console.log(`   総成分量: ${totalMg.toFixed(2)}mg`);
        console.log(`   コスト/mg: ¥${costPerMg.toFixed(4)}/mg`);
        console.log(`   供給日数: ${daysSupply.toFixed(1)}日`);
        console.log(`   コスト/日: ¥${costPerDay.toFixed(0)}/日`);
      } else {
        console.log(`   ⚠️  成分量が0のため計算不可`);
      }
      console.log('');
    });

    // 全商品でコスパを比較
    if (mainIngredientAmount > 0 && similarProducts.length > 0) {
      console.log('\n📊 コスパ比較（コスト/mg で比較）:\n');

      const allProducts = [
        {
          name: testProduct.name,
          priceJPY: testProduct.priceJPY,
          servingsPerContainer: testProduct.servingsPerContainer,
          ingredientAmount: mainIngredientAmount,
          isCurrent: true,
        },
        ...similarProducts.map(p => ({ ...p, isCurrent: false }))
      ].filter(p => p.ingredientAmount > 0);

      const sortedByValue = allProducts
        .map(p => ({
          ...p,
          costPerMg: p.priceJPY / (p.ingredientAmount * p.servingsPerContainer)
        }))
        .sort((a, b) => a.costPerMg - b.costPerMg);

      sortedByValue.forEach((p, i) => {
        const badge = i === 0 ? '🏆' : p.isCurrent ? '👉' : '  ';
        console.log(`${badge} ${i + 1}位: ¥${p.costPerMg.toFixed(4)}/mg - ${p.name.substring(0, 60)}${p.name.length > 60 ? '...' : ''}`);
      });
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

debugCostCalculation()
  .then(() => {
    console.log('\n\n✅ デバッグ完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
