#!/usr/bin/env node

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

async function diagnoseSimilarProducts() {
  console.log('🔍 類似商品クエリの診断を開始...\n');

  try {
    // 1. テスト用の商品を1つ取得
    const testProduct = await client.fetch(
      `*[_type == "product" && availability == "in-stock" && defined(ingredients) && count(ingredients) > 0][0]{
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
      console.error("❌ テスト用の商品が見つかりませんでした");
      return;
    }

    console.log('📦 テスト商品:', testProduct.name);
    console.log('   価格:', testProduct.priceJPY, '円');
    console.log('   1日あたり摂取回数:', testProduct.servingsPerDay);
    console.log('   1容器あたり総回数:', testProduct.servingsPerContainer);
    console.log('   主要成分:', testProduct.ingredients[0]?.ingredient?.name);
    console.log('   主要成分量:', testProduct.ingredients[0]?.amountMgPerServing, 'mg/回\n');

    const mainIngredientId = testProduct.ingredients[0]?.ingredient?._id;

    if (!mainIngredientId) {
      console.error("❌ 主要成分IDが見つかりませんでした");
      return;
    }

    // 2. 現在のクエリを実行（問題がある可能性のあるクエリ）
    console.log('🔍 現在のクエリ（問題がある可能性）を実行中...\n');

    const currentQuery = `*[_type == "product"
      && _id != $productId
      && availability == "in-stock"
      && $mainIngredientId in ingredients[].ingredient._ref
    ]{
      name,
      slug,
      'imageUrl': coalesce(images[0].asset->url, externalImageUrl),
      'ingredientAmount': ingredients[ingredient._ref == $mainIngredientId][0].amountMgPerServing,
      servingsPerDay,
      priceJPY,
      servingsPerContainer
    }[0...5]`;

    try {
      const currentResults = await client.fetch(currentQuery, {
        productId: testProduct._id,
        mainIngredientId,
      });

      console.log(`✅ 現在のクエリで ${currentResults.length} 件の類似商品を取得`);
      currentResults.forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   - ingredientAmount: ${p.ingredientAmount} mg/回`);
        console.log(`   - servingsPerDay: ${p.servingsPerDay}`);
        console.log(`   - servingsPerContainer: ${p.servingsPerContainer}`);
        console.log(`   - priceJPY: ${p.priceJPY} 円`);

        // コスパ計算
        if (p.ingredientAmount && p.servingsPerContainer && p.priceJPY) {
          const totalMg = p.ingredientAmount * p.servingsPerContainer;
          const costPerMg = p.priceJPY / totalMg;
          console.log(`   - 総成分量: ${totalMg} mg`);
          console.log(`   - コスト/mg: ¥${costPerMg.toFixed(4)}/mg`);
        } else {
          console.log(`   ⚠️  データ不足（ingredientAmount=${p.ingredientAmount}, servingsPerContainer=${p.servingsPerContainer}, priceJPY=${p.priceJPY}）`);
        }
      });
    } catch (error) {
      console.error('❌ 現在のクエリでエラー:', error.message);
    }

    // 3. 改良版クエリを実行
    console.log('\n\n🔍 改良版クエリを実行中...\n');

    const improvedQuery = `*[_type == "product"
      && _id != $productId
      && availability == "in-stock"
      && $mainIngredientId in ingredients[].ingredient._ref
    ]{
      name,
      slug,
      'imageUrl': coalesce(images[0].asset->url, externalImageUrl),
      'ingredientAmount': select(
        count(ingredients[ingredient._ref == $mainIngredientId]) > 0 =>
          ingredients[ingredient._ref == $mainIngredientId][0].amountMgPerServing,
        ingredients[0].amountMgPerServing
      ),
      servingsPerDay,
      priceJPY,
      servingsPerContainer,
      'debugIngredients': ingredients[]{
        amountMgPerServing,
        'ingredientId': ingredient._ref,
        'isMain': ingredient._ref == $mainIngredientId
      }
    }[0...5]`;

    try {
      const improvedResults = await client.fetch(improvedQuery, {
        productId: testProduct._id,
        mainIngredientId,
      });

      console.log(`✅ 改良版クエリで ${improvedResults.length} 件の類似商品を取得`);
      improvedResults.forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   - ingredientAmount: ${p.ingredientAmount} mg/回`);
        console.log(`   - servingsPerDay: ${p.servingsPerDay}`);
        console.log(`   - servingsPerContainer: ${p.servingsPerContainer}`);
        console.log(`   - priceJPY: ${p.priceJPY} 円`);

        // デバッグ: 成分情報
        if (p.debugIngredients) {
          console.log(`   - 成分詳細:`);
          p.debugIngredients.forEach(ing => {
            console.log(`     * ${ing.amountMgPerServing}mg/回, isMain=${ing.isMain}`);
          });
        }

        // コスパ計算
        if (p.ingredientAmount && p.servingsPerContainer && p.priceJPY) {
          const totalMg = p.ingredientAmount * p.servingsPerContainer;
          const costPerMg = p.priceJPY / totalMg;
          console.log(`   - 総成分量: ${totalMg} mg`);
          console.log(`   - コスト/mg: ¥${costPerMg.toFixed(4)}/mg`);
        } else {
          console.log(`   ⚠️  データ不足`);
        }
      });
    } catch (error) {
      console.error('❌ 改良版クエリでエラー:', error.message);
    }

    // 4. 最もシンプルなクエリ（最初の成分を常に使う）
    console.log('\n\n🔍 シンプル版クエリ（最初の成分を使用）を実行中...\n');

    const simpleQuery = `*[_type == "product"
      && _id != $productId
      && availability == "in-stock"
      && $mainIngredientId in ingredients[].ingredient._ref
    ]{
      name,
      slug,
      'imageUrl': coalesce(images[0].asset->url, externalImageUrl),
      'ingredientAmount': ingredients[0].amountMgPerServing,
      servingsPerDay,
      priceJPY,
      servingsPerContainer
    }[0...5]`;

    try {
      const simpleResults = await client.fetch(simpleQuery, {
        productId: testProduct._id,
        mainIngredientId,
      });

      console.log(`✅ シンプル版クエリで ${simpleResults.length} 件の類似商品を取得`);
      simpleResults.forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   - ingredientAmount: ${p.ingredientAmount} mg/回`);
        console.log(`   - servingsPerDay: ${p.servingsPerDay}`);
        console.log(`   - servingsPerContainer: ${p.servingsPerContainer}`);
        console.log(`   - priceJPY: ${p.priceJPY} 円`);

        // コスパ計算
        if (p.ingredientAmount && p.servingsPerContainer && p.priceJPY) {
          const totalMg = p.ingredientAmount * p.servingsPerContainer;
          const costPerMg = p.priceJPY / totalMg;
          console.log(`   - 総成分量: ${totalMg} mg`);
          console.log(`   - コスト/mg: ¥${costPerMg.toFixed(4)}/mg`);
        } else {
          console.log(`   ⚠️  データ不足`);
        }
      });
    } catch (error) {
      console.error('❌ シンプル版クエリでエラー:', error.message);
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

diagnoseSimilarProducts()
  .then(() => {
    console.log('\n\n✅ 診断完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
