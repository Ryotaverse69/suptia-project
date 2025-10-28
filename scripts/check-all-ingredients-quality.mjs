#!/usr/bin/env node

/**
 * 全成分記事の品質チェックスクリプト
 *
 * - FAQの言語チェック（英語混入）
 * - 参考文献のnullチェック
 * - 参考文献の不足チェック
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

// 英語文字列検出（連続した英字が多い場合）
function hasEnglishContent(text) {
  if (!text) return false;
  // 連続した英字が10文字以上ある場合を英語と判定
  return /[a-zA-Z]{10,}/.test(text);
}

// 英語比率を計算
function calculateEnglishRatio(text) {
  if (!text) return 0;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.length;
  return totalChars > 0 ? (englishChars / totalChars) * 100 : 0;
}

async function checkAllIngredients() {
  console.log('🔍 全成分記事の品質チェックを開始します...\n');

  try {
    // 全成分を取得
    const ingredients = await client.fetch(`
      *[_type == "ingredient"] | order(name asc) {
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
    `);

    if (!ingredients || ingredients.length === 0) {
      console.log('⚠️  成分データが見つかりませんでした。');
      return;
    }

    console.log(`✅ ${ingredients.length}件の成分データを取得しました。\n`);

    // 問題のある記事を格納
    const issues = {
      englishFAQ: [],
      nullReferences: [],
      insufficientReferences: [],
      noReferences: [],
      noFAQs: [],
    };

    // 各成分をチェック
    ingredients.forEach((ingredient) => {
      const problems = [];

      // FAQチェック
      if (!ingredient.faqs || ingredient.faqs.length === 0) {
        issues.noFAQs.push({ ...ingredient, problems: ['FAQなし'] });
      } else {
        const englishFAQs = ingredient.faqs.filter(
          (faq) =>
            hasEnglishContent(faq.question) ||
            calculateEnglishRatio(faq.answer) > 30 // 回答の30%以上が英語
        );

        if (englishFAQs.length > 0) {
          issues.englishFAQ.push({
            ...ingredient,
            englishFAQCount: englishFAQs.length,
            totalFAQCount: ingredient.faqs.length,
            englishFAQs: englishFAQs.map(faq => faq.question),
          });
        }
      }

      // 参考文献チェック
      if (!ingredient.references || ingredient.references.length === 0) {
        issues.noReferences.push({ ...ingredient });
      } else {
        const nullRefs = ingredient.references.filter((ref) => !ref || !ref.title || !ref.url);
        const validRefs = ingredient.references.filter((ref) => ref && ref.title && ref.url);

        if (nullRefs.length > 0) {
          issues.nullReferences.push({
            ...ingredient,
            nullCount: nullRefs.length,
            totalCount: ingredient.references.length,
            validCount: validRefs.length,
          });
        } else if (validRefs.length < 5) {
          issues.insufficientReferences.push({
            ...ingredient,
            refCount: validRefs.length,
          });
        }
      }
    });

    // 結果を表示
    console.log('═══════════════════════════════════════════════════');
    console.log('              📊 品質チェック結果');
    console.log('═══════════════════════════════════════════════════');

    const totalIssues =
      issues.englishFAQ.length +
      issues.nullReferences.length +
      issues.insufficientReferences.length +
      issues.noReferences.length +
      issues.noFAQs.length;

    if (totalIssues === 0) {
      console.log('🎉 すべての成分記事に問題はありません！');
      return;
    }

    console.log(`⚠️  合計 ${totalIssues}件の問題が見つかりました:\n`);

    // 1. 英語FAQの問題
    if (issues.englishFAQ.length > 0) {
      console.log(`❌ 英語FAQが含まれる記事: ${issues.englishFAQ.length}件`);
      console.log('───────────────────────────────────────────────────');
      issues.englishFAQ.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.nameEn})`);
        console.log(`   英語FAQ: ${item.englishFAQCount}/${item.totalFAQCount}件`);
        item.englishFAQs.forEach((q, i) => {
          console.log(`   ${i + 1}) ${q.substring(0, 80)}...`);
        });
        console.log('');
      });
    }

    // 2. null参考文献の問題
    if (issues.nullReferences.length > 0) {
      console.log(`❌ null参考文献が含まれる記事: ${issues.nullReferences.length}件`);
      console.log('───────────────────────────────────────────────────');
      issues.nullReferences.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.nameEn})`);
        console.log(`   null: ${item.nullCount}件 / 有効: ${item.validCount}件 / 合計: ${item.totalCount}件`);
        console.log(`   ID: ${item._id}`);
        console.log('');
      });
    }

    // 3. 参考文献なし
    if (issues.noReferences.length > 0) {
      console.log(`❌ 参考文献が全くない記事: ${issues.noReferences.length}件`);
      console.log('───────────────────────────────────────────────────');
      issues.noReferences.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.nameEn})`);
        console.log(`   ID: ${item._id}`);
        console.log('');
      });
    }

    // 4. 参考文献不足
    if (issues.insufficientReferences.length > 0) {
      console.log(`⚠️  参考文献が不足している記事: ${issues.insufficientReferences.length}件 (1-4件)`);
      console.log('───────────────────────────────────────────────────');
      issues.insufficientReferences.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.nameEn}) - ${item.refCount}件`);
      });
      console.log('');
    }

    // 5. FAQなし
    if (issues.noFAQs.length > 0) {
      console.log(`❌ FAQがない記事: ${issues.noFAQs.length}件`);
      console.log('───────────────────────────────────────────────────');
      issues.noFAQs.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.nameEn})`);
      });
      console.log('');
    }

    // サマリー
    console.log('═══════════════════════════════════════════════════');
    console.log('              💡 修正が必要な項目');
    console.log('═══════════════════════════════════════════════════');

    if (issues.englishFAQ.length > 0) {
      console.log(`🔴 最優先: ${issues.englishFAQ.length}件の記事のFAQを日本語に翻訳`);
    }
    if (issues.nullReferences.length > 0) {
      console.log(`🔴 最優先: ${issues.nullReferences.length}件の記事のnull参考文献を修正`);
    }
    if (issues.noReferences.length > 0) {
      console.log(`🔴 最優先: ${issues.noReferences.length}件の記事に参考文献を追加`);
    }
    if (issues.noFAQs.length > 0) {
      console.log(`🟡 中優先: ${issues.noFAQs.length}件の記事にFAQを追加`);
    }
    if (issues.insufficientReferences.length > 0) {
      console.log(`🟡 中優先: ${issues.insufficientReferences.length}件の記事の参考文献を5件以上に増やす`);
    }

    console.log('');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

checkAllIngredients();
