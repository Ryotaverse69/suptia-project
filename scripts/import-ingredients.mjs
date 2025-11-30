#!/usr/bin/env node

/**
 * 11個の成分記事をSanityにインポートするスクリプト
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

// インポートする成分記事ファイル
const ingredientFiles = [
  'bilberry-article.json',
  'maca-article.json',
  'sesamin-article.json',
  'propolis-article.json',
  'squalene-article.json',
  'manuka-honey-article.json',
];

async function importIngredients() {
  console.log('🚀 成分記事のインポートを開始します...\n');
  console.log('═══════════════════════════════════════════════════');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  try {
    for (const fileName of ingredientFiles) {
      const filePath = join(__dirname, '..', fileName);

      try {
        // JSONファイル読み込み
        const jsonContent = readFileSync(filePath, 'utf8');
        const ingredientData = JSON.parse(jsonContent);

        console.log(`\n📄 処理中: ${ingredientData.name} (${ingredientData.nameEn})`);
        console.log(`   ファイル: ${fileName}`);

        // slugから_idを生成
        const documentId = ingredientData.slug.current;

        // 既存のドキュメントをチェック
        const existingDoc = await client.fetch(
          `*[_type == "ingredient" && slug.current == $slug][0]`,
          { slug: documentId }
        );

        if (existingDoc) {
          console.log(`   ⚠️  既に存在します (ID: ${existingDoc._id})`);
          console.log(`   → スキップします`);
          skippedCount++;
          continue;
        }

        // ドキュメントを作成
        const doc = {
          _id: documentId,
          _type: 'ingredient',
          ...ingredientData,
        };

        await client.createOrReplace(doc);

        console.log(`   ✅ インポート成功`);
        console.log(`   - 効能: ${ingredientData.benefits?.length || 0}件`);
        console.log(`   - FAQ: ${ingredientData.faqs?.length || 0}件`);
        console.log(`   - 参考文献: ${ingredientData.references?.length || 0}件`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ エラー: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('              インポート完了サマリー');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ 成功: ${successCount}件`);
    console.log(`⚠️  スキップ: ${skippedCount}件（既存）`);
    console.log(`❌ エラー: ${errorCount}件`);
    console.log(`📊 合計: ${ingredientFiles.length}件`);

    if (successCount > 0) {
      console.log('\n🎉 成分記事のインポートが完了しました！');
      console.log('\n次のステップ:');
      console.log('1. Sanity Studioでインポートされた記事を確認');
      console.log('2. Webサイトで成分ページが正しく表示されるか確認');
      console.log('3. 目的別ガイドページで成分リンクが動作するか確認');
    }

  } catch (error) {
    console.error('\n❌ 予期しないエラーが発生しました:', error);
    process.exit(1);
  }
}

importIngredients();
