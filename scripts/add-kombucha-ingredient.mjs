#!/usr/bin/env node

/**
 * 紅茶キノコ（コンブチャ）成分を作成し、該当商品に追加するスクリプト
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

const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

async function addKombuchaIngredient() {
  console.log(`🔍 紅茶キノコ（コンブチャ）成分の追加を開始${isDryRun ? '（プレビューモード）' : ''}...\n`);

  try {
    // 1. 紅茶キノコ成分が既に存在するかチェック
    const existingIngredient = await client.fetch(
      `*[_type == 'ingredient' && slug.current == 'kombucha-extract'][0]`
    );

    let kombuchaIngredientId;

    if (existingIngredient) {
      console.log(`✅ 紅茶キノコ成分は既に存在します: ${existingIngredient._id}\n`);
      kombuchaIngredientId = existingIngredient._id;
    } else {
      console.log('📝 紅茶キノコ成分を新規作成します...\n');

      if (isDryRun) {
        console.log('[プレビュー] 以下の成分を作成します:');
        console.log('  名前: 紅茶キノコ（コンブチャ）');
        console.log('  英語名: Kombucha Extract');
        console.log('  カテゴリ: 発酵食品エキス');
        console.log('  エビデンスレベル: C\n');
        kombuchaIngredientId = 'ingredient-kombucha-extract'; // 仮ID
      } else {
        const newIngredient = await client.create({
          _type: 'ingredient',
          _id: 'ingredient-kombucha-extract',
          name: '紅茶キノコ（コンブチャ）',
          nameEn: 'Kombucha Extract',
          slug: {
            _type: 'slug',
            current: 'kombucha-extract'
          },
          category: '発酵食品エキス',
          evidenceLevel: 'C',
          description: '紅茶を発酵させて作られる伝統的な発酵飲料。乳酸菌や酵母、有機酸を含み、腸内環境のサポートに役立つとされています。',
        });

        console.log(`✅ 紅茶キノコ成分を作成しました: ${newIngredient._id}\n`);
        kombuchaIngredientId = newIngredient._id;
      }
    }

    // 2. 該当商品を取得
    const productSlug = '11-4-298-1-d-c-b';
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        ingredients
      }`,
      { slug: productSlug }
    );

    if (!product) {
      console.error(`❌ 商品が見つかりません: ${productSlug}`);
      process.exit(1);
    }

    console.log(`📦 対象商品: ${product.name}`);
    console.log(`   ID: ${product._id}\n`);

    // 3. 既に紅茶キノコ成分が含まれているかチェック
    const hasKombucha = product.ingredients?.some(
      (ing) => ing.ingredient?._ref === kombuchaIngredientId
    );

    if (hasKombucha) {
      console.log('✅ この商品には既に紅茶キノコ成分が含まれています\n');
      return;
    }

    // 4. 紅茶キノコ成分を配列の先頭に追加
    // 紅茶キノコは主成分なので、推定配合量は多めに設定（例: 2000mg）
    const kombuchaIngredient = {
      _key: `ingredient-${Date.now()}`,
      amountMgPerServing: 2000, // 推定値（主成分として他の成分より多い量を設定）
      ingredient: {
        _type: 'reference',
        _ref: kombuchaIngredientId
      }
    };

    const updatedIngredients = [
      kombuchaIngredient,
      ...(product.ingredients || [])
    ];

    console.log('📝 更新内容:');
    console.log('  紅茶キノコを配列の先頭に追加');
    console.log(`  配合量: ${kombuchaIngredient.amountMgPerServing}mg（推定値）\n`);

    if (isDryRun) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 次のステップ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('実際に更新を適用するには、--fix オプションを付けて実行してください:');
      console.log('  node scripts/add-kombucha-ingredient.mjs --fix\n');
      console.log('⚠️ 注意: 配合量100mgは推定値です。商品の原材料表記から正確な値を確認して、');
      console.log('   必要に応じてSanityスタジオで修正してください。\n');
    } else {
      // 商品を更新
      await client
        .patch(product._id)
        .set({ ingredients: updatedIngredients })
        .commit();

      console.log('✅ 商品を更新しました！\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ 完了');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('次のステップ:');
      console.log('1. ページをリロードして主要成分が「紅茶キノコ」になっているか確認');
      console.log('2. 配合量100mgが正しいか確認し、必要に応じてSanityスタジオで修正\n');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

addKombuchaIngredient()
  .then(() => {
    console.log('✅ スクリプト完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
