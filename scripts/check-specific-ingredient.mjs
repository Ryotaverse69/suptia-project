#!/usr/bin/env node

/**
 * 特定の成分記事の詳細チェックスクリプト
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

async function checkIngredient(slug) {
  console.log(`📚 「${slug}」の記事をチェックします...\n`);

  try {
    const ingredient = await client.fetch(`
      *[_type == "ingredient" && slug.current == $slug][0] {
        _id,
        name,
        nameEn,
        slug,
        faqs[] {
          question,
          answer
        },
        references[] {
          title,
          url,
          source
        }
      }
    `, { slug });

    if (!ingredient) {
      console.log('❌ 該当する成分が見つかりませんでした。');
      return;
    }

    console.log('═══════════════════════════════════════════════════');
    console.log(`成分: ${ingredient.name} (${ingredient.nameEn})`);
    console.log(`ID: ${ingredient._id}`);
    console.log('═══════════════════════════════════════════════════\n');

    // FAQチェック
    console.log('📝 FAQチェック:');
    console.log('───────────────────────────────────────────────────');
    if (!ingredient.faqs || ingredient.faqs.length === 0) {
      console.log('❌ FAQが存在しません');
    } else {
      console.log(`✅ FAQ数: ${ingredient.faqs.length}件\n`);

      ingredient.faqs.forEach((faq, index) => {
        const hasEnglish = /[a-zA-Z]{10,}/.test(faq.question) || /[a-zA-Z]{20,}/.test(faq.answer);
        const status = hasEnglish ? '⚠️  英語混入' : '✅';

        console.log(`${index + 1}. ${status} ${faq.question}`);
        if (hasEnglish) {
          console.log(`   質問: ${faq.question.substring(0, 100)}...`);
          console.log(`   回答: ${faq.answer.substring(0, 100)}...`);
        }
        console.log('');
      });
    }

    // 参考文献チェック
    console.log('📚 参考文献チェック:');
    console.log('───────────────────────────────────────────────────');
    if (!ingredient.references || ingredient.references.length === 0) {
      console.log('❌ 参考文献が存在しません');
    } else {
      console.log(`✅ 参考文献数: ${ingredient.references.length}件\n`);

      ingredient.references.forEach((ref, index) => {
        if (!ref) {
          console.log(`${index + 1}. ❌ null または undefined`);
        } else {
          console.log(`${index + 1}. ${ref.title || '（タイトルなし）'}`);
          console.log(`   URL: ${ref.url || '（URLなし）'}`);
          console.log(`   ソース: ${ref.source || '（ソースなし）'}`);
        }
        console.log('');
      });
    }

    // 完全なデータをJSON出力
    console.log('═══════════════════════════════════════════════════');
    console.log('完全なFAQデータ:');
    console.log('═══════════════════════════════════════════════════');
    console.log(JSON.stringify(ingredient.faqs, null, 2));

    console.log('\n═══════════════════════════════════════════════════');
    console.log('完全な参考文献データ:');
    console.log('═══════════════════════════════════════════════════');
    console.log(JSON.stringify(ingredient.references, null, 2));

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

const slug = process.argv[2] || 'vitamin-b-complex';
checkIngredient(slug);
