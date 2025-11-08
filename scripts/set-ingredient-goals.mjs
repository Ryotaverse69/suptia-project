/**
 * 成分にrelatedGoals（健康目標）を一括設定
 * 各成分の特性に基づいて適切な健康目標を設定します
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/web/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// 成分名 → 健康目標のマッピング
const INGREDIENT_GOALS = {
  // ビタミン類
  'ビタミンC（アスコルビン酸）': ['immune-boost', 'skin-health', 'anti-aging'],
  'ビタミンD': ['bone-health', 'immune-boost', 'general-wellness'],
  'ビタミンE': ['anti-aging', 'skin-health', 'heart-health'],
  'ビタミンA（レチノール）': ['skin-health', 'eye-health', 'immune-boost'],
  'ビタミンK': ['bone-health', 'heart-health'],
  'ビタミンK2（メナキノン）': ['bone-health', 'heart-health'],
  'ナイアシン（ビタミンB3）': ['energy-recovery', 'brain-function', 'skin-health'],
  'ビタミンB6（ピリドキシン）': ['energy-recovery', 'brain-function', 'immune-boost'],
  'ビタミンB12（コバラミン）': ['energy-recovery', 'brain-function', 'general-wellness'],
  'ビタミンB群': ['energy-recovery', 'brain-function', 'stress-relief'],
  'ビオチン（ビタミンB7）': ['skin-health', 'energy-recovery'],
  '葉酸': ['heart-health', 'brain-function', 'general-wellness'],

  // ミネラル類
  'カルシウム': ['bone-health', 'muscle-growth', 'general-wellness'],
  'マグネシウム': ['muscle-growth', 'sleep-quality', 'stress-relief', 'bone-health'],
  'マグネシウムグリシネート': ['muscle-growth', 'sleep-quality', 'stress-relief', 'bone-health'],
  '鉄分': ['energy-recovery', 'general-wellness'],
  '亜鉛': ['immune-boost', 'skin-health', 'muscle-growth'],
  'カリウム': ['heart-health', 'muscle-growth'],
  'クロム': ['weight-management', 'general-wellness'],
  'セレン': ['immune-boost', 'anti-aging'],
  'ヨウ素': ['energy-recovery', 'general-wellness'],

  // オメガ3・脂肪酸
  'オメガ3脂肪酸（EPA・DHA）': ['heart-health', 'brain-function', 'anti-aging', 'joint-health'],
  'DHA・EPA（オメガ3脂肪酸）': ['heart-health', 'brain-function', 'anti-aging', 'joint-health'],

  // アミノ酸・プロテイン
  'プロテイン': ['muscle-growth', 'energy-recovery', 'weight-management'],
  'ホエイプロテイン': ['muscle-growth', 'energy-recovery', 'weight-management'],
  'BCAA(分岐鎖アミノ酸)': ['muscle-growth', 'energy-recovery'],
  'グルタミン': ['muscle-growth', 'digestive-health', 'immune-boost'],
  'グリシン': ['sleep-quality', 'muscle-growth'],
  'L-カルニチン': ['energy-recovery', 'weight-management'],
  'L-テアニン': ['stress-relief', 'sleep-quality', 'brain-function'],
  'ベータアラニン（β-アラニン）': ['muscle-growth', 'energy-recovery'],
  'HMB（β-ヒドロキシ-β-メチル酪酸）': ['muscle-growth', 'anti-aging'],
  'クレアチン': ['muscle-growth', 'energy-recovery', 'brain-function'],

  // 抗酸化・美容
  'アスタキサンチン': ['anti-aging', 'skin-health', 'eye-health', 'energy-recovery'],
  'ルテイン': ['eye-health', 'skin-health', 'anti-aging'],
  'コエンザイムQ10': ['energy-recovery', 'heart-health', 'anti-aging'],
  'CoQ10（コエンザイムQ10）': ['energy-recovery', 'heart-health', 'anti-aging'],
  'コラーゲン': ['skin-health', 'joint-health', 'anti-aging'],
  'NAC（N-アセチルシステイン）': ['immune-boost', 'anti-aging'],

  // ハーブ・植物由来
  'ギンコ（イチョウ葉）': ['brain-function', 'anti-aging'],
  'ギンコビロバ（イチョウ葉エキス）': ['brain-function', 'anti-aging'],
  'ウコン（ターメリック）': ['digestive-health', 'anti-aging', 'joint-health'],
  'アシュワガンダ': ['stress-relief', 'energy-recovery', 'brain-function'],
  'ロディオラ・ロゼア（イワベンケイ）': ['stress-relief', 'energy-recovery', 'brain-function'],
  'バレリアン（セイヨウカノコソウ）': ['sleep-quality', 'stress-relief'],
  'エキナセア': ['immune-boost'],
  'エルダーベリー': ['immune-boost', 'anti-aging'],
  'ブラックコホシュ': ['general-wellness'],
  'レッドクローバー': ['general-wellness'],
  '大豆イソフラボン': ['bone-health', 'general-wellness'],

  // 関節・骨
  'グルコサミン': ['joint-health', 'general-wellness'],

  // その他
  'GABA（γ-アミノ酪酸）': ['stress-relief', 'sleep-quality'],
  'メラトニン': ['sleep-quality'],
  'カフェイン': ['energy-recovery', 'brain-function'],
  'プロバイオティクス': ['digestive-health', 'immune-boost'],
};

async function setIngredientGoals() {
  console.log('🔄 成分にrelatedGoalsを設定中...\n');

  // すべての成分を取得
  const ingredients = await client.fetch(`*[_type == "ingredient"] {
    _id,
    name,
    relatedGoals
  }`);

  console.log(`📊 対象成分数: ${ingredients.length}件\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const ingredient of ingredients) {
    const goals = INGREDIENT_GOALS[ingredient.name];

    if (!goals) {
      console.log(`⚠️  マッピング未定義: ${ingredient.name}`);
      notFound++;
      continue;
    }

    // すでに設定されている場合はスキップ
    if (ingredient.relatedGoals && ingredient.relatedGoals.length > 0) {
      console.log(`⏭️  スキップ（設定済み）: ${ingredient.name}`);
      skipped++;
      continue;
    }

    try {
      await client
        .patch(ingredient._id)
        .set({ relatedGoals: goals })
        .commit();

      console.log(`✅ 更新: ${ingredient.name} → ${goals.join(', ')}`);
      updated++;
    } catch (error) {
      console.error(`❌ エラー: ${ingredient.name}`, error.message);
    }
  }

  console.log('\n📈 結果:');
  console.log(`  ✅ 更新: ${updated}件`);
  console.log(`  ⏭️  スキップ: ${skipped}件`);
  console.log(`  ⚠️  マッピング未定義: ${notFound}件`);
  console.log('\n✨ 完了');
}

setIngredientGoals().catch(console.error);
