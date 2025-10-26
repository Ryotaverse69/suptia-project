#!/usr/bin/env node

/**
 * 成分記事のデータクリーニングスクリプト
 *
 * 目的：全ての成分記事から不要な定型文を削除し、読みやすさを向上させる
 *
 * 削除対象フレーズ：
 * - "：優れた供給源として知られています"
 * - "：豊富に含まれています"
 * - "：良い供給源です"
 * - "研究により有効性が確認されており、"（繰り返し）
 * - "これにより健康維持に重要な役割を果たします"
 * - 二重句読点（。。）
 * - 箇条書きマーカー（◦、•、・）
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

// Sanity client setup
const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: envVars.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * テキストをクリーニングする関数
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // 1. 不自然な表現を修正
  result = result
    // 「創傷健康的な状態の維持」→「創傷治癒」
    .replace(/創傷健康的な状態の維持/g, '創傷治癒')

    // 「軟骨健康的な状態の維持」→「軟骨の健康維持」
    .replace(/軟骨健康的な状態の維持/g, '軟骨の健康維持')

    // 「健康維持時間」→「回復時間」
    .replace(/健康維持時間/g, '回復時間')

    // 「健康維持を早める」→「治癒を早める」
    .replace(/健康維持を早める/g, '治癒を早める')

    // 「健康維持を促進」→「回復を促進」
    .replace(/健康維持を促進/g, '回復を促進')

    // 「健康維持を支援」→「回復を支援」
    .replace(/健康維持を支援/g, '回復を支援')

    // 「健康維持を助ける」→「回復を助ける」
    .replace(/健康維持を助ける/g, '回復を助ける')

    // 「健康維持を加速」→「回復を加速」
    .replace(/健康維持を加速/g, '回復を加速')

    // 「健康維持をサポート」→「回復をサポート」
    .replace(/健康維持をサポート/g, '回復をサポート')

    // 「パフォーマンス健康維持」→「パフォーマンス回復」
    .replace(/パフォーマンス健康維持/g, 'パフォーマンス回復')

    // 「筋肉の成長と健康維持」→「筋肉の成長と回復」
    .replace(/筋肉の成長と健康維持/g, '筋肉の成長と回復')

    // 「筋肉の成長 修復 健康維持」→「筋肉の成長・修復・回復」
    .replace(/筋肉の成長\s*修復\s*健康維持/g, '筋肉の成長・修復・回復')

    // 「運動後の健康維持」→「運動後の回復」
    .replace(/運動後の健康維持/g, '運動後の回復')

    // 「ワークアウトセッション間の健康維持」→「ワークアウトセッション間の回復」
    .replace(/ワークアウトセッション間の健康維持/g, 'ワークアウトセッション間の回復')

    // 「健康的な状態の維持を促進」→「回復を促進」
    .replace(/健康的な状態の維持を促進/g, '回復を促進')

    // 「健康的な状態の維持を支援」→「回復を支援」
    .replace(/健康的な状態の維持を支援/g, '回復を支援')

    // その他の「健康的な状態の維持」→「健康維持」
    .replace(/健康的な状態の維持/g, '健康維持');

  // 2. 繰り返されるフレーズを削除（2回目以降を削除）
  const repeatedPhrases = [
    '複数の査読付き論文により、この知見の信頼性が確認されています。',
    '個人差があるため、少量から始めて徐々に調整することが推奨されます。',
    '研究により有効性が確認されており、',
    '研究により有効性が確認されており',
  ];

  repeatedPhrases.forEach(phrase => {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = result.match(regex);
    if (matches && matches.length > 1) {
      // 最初の出現を保持、それ以降を削除
      let count = 0;
      result = result.replace(regex, (match) => {
        count++;
        return count === 1 ? match : '';
      });
    }
  });

  // 3. 不要な定型文を削除
  result = result
    .replace(/[:：]\s*優れた供給源として知られています\.?/gi, '')
    .replace(/[:：]\s*豊富に含まれています\.?/gi, '')
    .replace(/[:：]\s*良い供給源です\.?/gi, '')
    .replace(/[:：]\s*ビタミンAが豊富です\.?/gi, '')
    .replace(/優れた供給源として知られています\.?/gi, '')
    .replace(/豊富に含まれています\.?/gi, '')
    .replace(/良い供給源です\.?/gi, '')
    .replace(/ビタミンAが豊富です\.?/gi, '')

    // 4. 繰り返しフレーズを完全削除（残っている場合）
    .replace(/、?研究により有効性が確認されており、?/g, '')
    .replace(/、?これにより健康維持に重要な役割を果たします\.?/gi, '')
    .replace(/、?この作用メカニズムは、体内の複数の生化学的経路を介して実現されます\.?/gi, '')
    .replace(/、?実際の使用においては、個人差があることを理解し、適切な用量から始めることが推奨されます\.?/gi, '')
    .replace(/、?この作用メカニズムは、体内の複数の経路を通じて実現されます\.?/gi, '')
    .replace(/、?科学的な研究により、この効果が確認されています\.?/gi, '')

    // 5. description内の定型文削除
    .replace(/長期的な使用においては、定期的な健康チェックとともに、体調の変化を観察することが重要です。\s*/g, '')
    .replace(/個人の体質や健康状態により、反応には差があることを理解しておく必要があります。\s*/g, '')
    .replace(/最適な効果を得るためには、バランスの取れた食事と健康的な生活習慣との組み合わせが推奨されます。\s*/g, '')

    // 6. 箇条書きマーカーを削除
    .replace(/^[•◦・]\s*/gm, '')
    .replace(/\s*[•◦・]\s*/g, ' ')

    // 7. 二重句読点を修正
    .replace(/。+/g, '。')
    .replace(/、+/g, '、')
    .replace(/！+/g, '！')
    .replace(/？+/g, '？')

    // 8. 複数の空白を整理
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return result;
}

/**
 * 推奨摂取量のフォーマット
 */
function formatRecommendedDosage(text) {
  if (!text || typeof text !== 'string') return text;

  return text
    // 【】の後に改行を追加
    .replace(/】\s*/g, '】\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * benefits配列の処理（末尾の句点確認）
 */
function cleanBenefits(benefits) {
  if (!Array.isArray(benefits)) return benefits;

  return benefits.map(benefit => {
    if (typeof benefit !== 'string') return benefit;

    let cleaned = cleanText(benefit);

    // 末尾に句点がない場合は追加
    if (cleaned && !cleaned.match(/[。！？]$/)) {
      cleaned += '。';
    }

    return cleaned;
  });
}

/**
 * 配列内の各項目をクリーニング
 */
function cleanArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => {
    if (typeof item === 'string') {
      return cleanText(item);
    } else if (typeof item === 'object' && item !== null) {
      return cleanObject(item);
    }
    return item;
  });
}

/**
 * オブジェクト内のテキストフィールドをクリーニング
 */
function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      cleaned[key] = cleanText(value);
    } else if (Array.isArray(value)) {
      cleaned[key] = cleanArray(value);
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔧 成分記事のクリーニングを開始します...\n');

  try {
    // 全ての成分記事を取得
    const ingredients = await client.fetch(
      `*[_type == "ingredient"]{
        _id,
        name,
        description,
        benefits,
        foodSources,
        sideEffects,
        interactions,
        faqs,
        recommendedDosage
      }`
    );

    console.log(`📊 ${ingredients.length}件の成分記事を取得しました\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const ingredient of ingredients) {
      console.log(`処理中: ${ingredient.name}`);

      // データをクリーニング
      const cleanedData = {
        description: cleanText(ingredient.description),
        benefits: cleanBenefits(ingredient.benefits), // 新しい関数使用
        foodSources: cleanArray(ingredient.foodSources),
        sideEffects: Array.isArray(ingredient.sideEffects)
          ? cleanArray(ingredient.sideEffects)
          : cleanText(ingredient.sideEffects),
        interactions: cleanText(ingredient.interactions),
        recommendedDosage: formatRecommendedDosage(cleanText(ingredient.recommendedDosage)), // フォーマット適用
        faqs: ingredient.faqs?.map(faq => ({
          ...faq,
          question: cleanText(faq.question),
          answer: cleanText(faq.answer),
        })),
      };

      // 変更があるかチェック
      const hasChanges = JSON.stringify(cleanedData) !== JSON.stringify({
        description: ingredient.description,
        benefits: ingredient.benefits,
        foodSources: ingredient.foodSources,
        sideEffects: ingredient.sideEffects,
        interactions: ingredient.interactions,
        recommendedDosage: ingredient.recommendedDosage,
        faqs: ingredient.faqs,
      });

      if (hasChanges) {
        // Sanityに更新
        await client
          .patch(ingredient._id)
          .set(cleanedData)
          .commit();

        console.log(`  ✅ 更新完了\n`);
        updatedCount++;
      } else {
        console.log(`  ⏭️  変更なし\n`);
        skippedCount++;
      }

      // APIレート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ クリーニング完了！');
    console.log(`   更新: ${updatedCount}件`);
    console.log(`   スキップ: ${skippedCount}件`);
    console.log(`   合計: ${ingredients.length}件`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
