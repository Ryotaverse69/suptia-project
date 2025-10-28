#!/usr/bin/env node

/**
 * 成分ガイドの参考文献チェックスクリプト
 *
 * 各成分記事の参考文献（references）フィールドをチェックし、
 * 空または不足している記事をリストアップします。
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

async function checkIngredientReferences() {
  console.log('📚 成分ガイドの参考文献チェックを開始します...\n');

  try {
    // 全成分を取得
    const ingredients = await client.fetch(`
      *[_type == "ingredient"] | order(name asc) {
        _id,
        name,
        nameEn,
        slug,
        references[] {
          title,
          url,
          source
        }
      }
    `);

    if (!ingredients || ingredients.length === 0) {
      console.log('⚠️  成分データが見つかりませんでした。');
      return;
    }

    console.log(`✅ ${ingredients.length}件の成分データを取得しました。\n`);

    // 参考文献の有無をチェック
    const missingReferences = [];
    const insufficientReferences = [];
    const goodReferences = [];

    ingredients.forEach((ingredient) => {
      const refCount = ingredient.references?.length || 0;

      if (refCount === 0) {
        missingReferences.push(ingredient);
      } else if (refCount < 5) {
        insufficientReferences.push({ ...ingredient, refCount });
      } else {
        goodReferences.push({ ...ingredient, refCount });
      }
    });

    // 結果を表示
    console.log('═══════════════════════════════════════════════════');
    console.log('              📊 チェック結果サマリー');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ 参考文献が充実している記事: ${goodReferences.length}件 (5件以上)`);
    console.log(`⚠️  参考文献が不足している記事: ${insufficientReferences.length}件 (1-4件)`);
    console.log(`❌ 参考文献が全くない記事: ${missingReferences.length}件`);
    console.log('═══════════════════════════════════════════════════\n');

    // 参考文献が全くない記事
    if (missingReferences.length > 0) {
      console.log('❌ 参考文献が全くない記事 (最優先修正対象):');
      console.log('───────────────────────────────────────────────────');
      missingReferences.forEach((ingredient, index) => {
        console.log(`${index + 1}. ${ingredient.name} (${ingredient.nameEn})`);
        console.log(`   ID: ${ingredient._id}`);
        console.log(`   Slug: ${ingredient.slug?.current || 'なし'}`);
        console.log('');
      });
    }

    // 参考文献が不足している記事
    if (insufficientReferences.length > 0) {
      console.log('⚠️  参考文献が不足している記事 (1-4件、推奨: 5件以上):');
      console.log('───────────────────────────────────────────────────');
      insufficientReferences.forEach((ingredient, index) => {
        console.log(`${index + 1}. ${ingredient.name} (${ingredient.nameEn}) - ${ingredient.refCount}件`);
        console.log(`   ID: ${ingredient._id}`);
        console.log(`   Slug: ${ingredient.slug?.current || 'なし'}`);
        console.log('');
      });
    }

    // 参考文献が充実している記事
    if (goodReferences.length > 0) {
      console.log('✅ 参考文献が充実している記事 (5件以上):');
      console.log('───────────────────────────────────────────────────');
      goodReferences.forEach((ingredient, index) => {
        console.log(`${index + 1}. ${ingredient.name} (${ingredient.nameEn}) - ${ingredient.refCount}件`);
      });
      console.log('');
    }

    // 推奨事項
    console.log('═══════════════════════════════════════════════════');
    console.log('              💡 推奨事項');
    console.log('═══════════════════════════════════════════════════');
    console.log('• 各成分には最低5件以上の信頼できる参考文献を追加してください');
    console.log('• 推奨ソース: PubMed, Cochrane, 厚生労働省, WHO, NIH');
    console.log('• 参考文献には title, url, source を必ず含めてください');
    console.log('');

    // 修正が必要な記事の総数
    const needsFixCount = missingReferences.length + insufficientReferences.length;
    if (needsFixCount > 0) {
      console.log(`⚡ アクション必要: ${needsFixCount}件の記事に参考文献の追加が必要です。`);
    } else {
      console.log('🎉 全ての記事に十分な参考文献が含まれています！');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

checkIngredientReferences();
