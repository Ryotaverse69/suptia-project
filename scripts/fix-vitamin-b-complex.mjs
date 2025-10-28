#!/usr/bin/env node

/**
 * ビタミンB群記事の修正スクリプト
 *
 * FAQを日本語に修正し、参考文献を追加します。
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

async function fixVitaminBComplex() {
  console.log('🔧 ビタミンB群の記事を修正します...\n');

  try {
    // 修正データを読み込み
    const fixData = JSON.parse(readFileSync('vitamin-b-complex-fix.json', 'utf8'));

    console.log('📝 修正内容:');
    console.log(`- FAQ: ${fixData.faqs.length}件（日本語版）`);
    console.log(`- 参考文献: ${fixData.references.length}件\n`);

    // データを更新
    const result = await client
      .patch('ingredient-vitamin-b-complex')
      .set({
        faqs: fixData.faqs,
        references: fixData.references,
      })
      .commit();

    console.log('✅ 更新完了！');
    console.log(`\nDocument ID: ${result._id}`);
    console.log(`Updated at: ${result._updatedAt}`);

    // 更新後のデータを確認
    console.log('\n📚 更新後のデータを確認中...');

    const updated = await client.fetch(`
      *[_type == "ingredient" && _id == "ingredient-vitamin-b-complex"][0] {
        name,
        nameEn,
        "faqCount": count(faqs),
        "refCount": count(references),
        faqs[0].question,
        references[0].title
      }
    `);

    console.log('\n═══════════════════════════════════════════════════');
    console.log('更新確認:');
    console.log('═══════════════════════════════════════════════════');
    console.log(`成分: ${updated.name} (${updated.nameEn})`);
    console.log(`FAQ数: ${updated.faqCount}件`);
    console.log(`参考文献数: ${updated.refCount}件`);
    console.log(`\n最初のFAQ: ${updated['faqs[0].question']}`);
    console.log(`最初の参考文献: ${updated['references[0].title']}`);
    console.log('═══════════════════════════════════════════════════');

    console.log('\n🎉 全ての修正が完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

fixVitaminBComplex();
