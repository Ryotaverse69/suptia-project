#!/usr/bin/env node

/**
 * ファンケル商品に必要な不足成分をSanityに追加するスクリプト
 *
 * 追加成分:
 * - マンガン
 * - モリブデン
 * - ビタミンP（ヘスペリジン）
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// apps/web/.env.local から環境変数を読み込み
dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const missingIngredients = [
  {
    _id: 'ingredient-manganese',
    _type: 'ingredient',
    name: 'マンガン',
    nameEn: 'Manganese',
    category: 'ミネラル',
    description:
      'マンガンは、骨の形成や糖質・脂質の代謝に関与する必須ミネラルです。抗酸化酵素の構成成分として、体内の活性酸素を除去する役割も果たします。',
    evidenceLevel: 'A',
    benefits: [
      '骨の形成をサポート',
      '糖質・脂質の代謝を助ける',
      '抗酸化酵素の構成成分',
      '成長と生殖に関与',
    ],
    recommendedDosage:
      '成人: 3.5-4.0mg/日（厚生労働省「日本人の食事摂取基準」2020年版より）',
    sideEffects:
      '通常の食事からの摂取では副作用はほとんどありません。過剰摂取（成人: 11mg/日以上）は神経系への影響が報告されています。',
  },
  {
    _id: 'ingredient-molybdenum',
    _type: 'ingredient',
    name: 'モリブデン',
    nameEn: 'Molybdenum',
    category: 'ミネラル',
    description:
      'モリブデンは、尿酸の生成や鉄の代謝に関与する必須微量ミネラルです。いくつかの酵素の構成成分として重要な役割を果たします。',
    evidenceLevel: 'A',
    benefits: [
      '尿酸の生成に関与',
      '鉄の代謝をサポート',
      '酵素の構成成分',
      '糖質・脂質の代謝を助ける',
    ],
    recommendedDosage:
      '成人: 25-30μg/日（厚生労働省「日本人の食事摂取基準」2020年版より）',
    sideEffects:
      '通常の食事やサプリメントからの適切な摂取では副作用はほとんどありません。過剰摂取（成人: 600μg/日以上）は銅の吸収を阻害する可能性があります。',
  },
  {
    _id: 'ingredient-hesperidin',
    _type: 'ingredient',
    name: 'ビタミンP（ヘスペリジン）',
    nameEn: 'Hesperidin (Vitamin P)',
    category: 'ビタミン様物質',
    description:
      'ヘスペリジン（ビタミンP）は、柑橘類に含まれるフラボノイドの一種です。ビタミンCの吸収を助け、毛細血管の健康維持に役立つとされています。',
    evidenceLevel: 'B',
    benefits: [
      'ビタミンCの吸収を助ける',
      '毛細血管の健康維持',
      '抗酸化作用',
      '血流改善をサポート',
      '冷え性の改善に役立つ可能性',
    ],
    recommendedDosage:
      '特定の推奨量は定められていませんが、一般的なサプリメントでは25-100mg/日程度が使用されています。',
    sideEffects:
      '通常の食事やサプリメントからの摂取では副作用はほとんど報告されていません。柑橘類アレルギーの方は注意が必要です。',
  },
];

async function addMissingIngredients() {
  console.log('🔄 ファンケル商品に必要な成分をSanityに追加中...\n');

  for (const ingredient of missingIngredients) {
    try {
      console.log(`📝 追加中: ${ingredient.name} (${ingredient.nameEn})`);

      const result = await client.createOrReplace(ingredient);

      console.log(`✅ 追加完了: ${result._id}\n`);
    } catch (error) {
      console.error(`❌ エラー: ${ingredient.name}の追加に失敗しました`);
      console.error(error.message);
      console.error('');
    }
  }

  console.log('✨ すべての成分の追加が完了しました！');
}

addMissingIngredients().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
