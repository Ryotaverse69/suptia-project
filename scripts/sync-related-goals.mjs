#!/usr/bin/env node
/**
 * relatedGoals自動同期スクリプト
 *
 * 新しい成分が追加されたときに、カテゴリや成分名に基づいて
 * 適切なrelatedGoalsを自動的に設定します。
 *
 * 使用方法:
 *   node scripts/sync-related-goals.mjs
 *   node scripts/sync-related-goals.mjs --dry-run  # 実行せずに確認のみ
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを読み込む
dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// HealthGoal定義（recommendation-engine.tsと同期）
const HEALTH_GOALS = [
  "energy-recovery",
  "sleep-improvement",
  "stress-relief",
  "immune-support",
  "skin-health",
  "hair-nails",
  "eye-health",
  "bone-joint",
  "heart-health",
  "digestive-health",
  "brain-function",
  "anti-aging",
  "weight-management",
  "muscle-building",
  "hormone-balance",
];

/**
 * 成分名とカテゴリに基づいてrelatedGoalsを推論するルール
 * 優先度順に評価され、最初にマッチしたルールが適用される
 */
const INFERENCE_RULES = [
  // ビタミンB群 - エネルギー代謝
  {
    match: (ing) => /ビタミンB[0-9]|ビタミンB群|ナイアシン|パントテン酸|葉酸|ビオチン/i.test(ing.name),
    goals: ["energy-recovery", "brain-function"],
  },
  // ビタミンC - 免疫・美肌
  {
    match: (ing) => /ビタミンC|アスコルビン酸/i.test(ing.name),
    goals: ["immune-support", "skin-health", "anti-aging"],
  },
  // ビタミンD - 骨・免疫
  {
    match: (ing) => /ビタミンD/i.test(ing.name),
    goals: ["bone-joint", "immune-support"],
  },
  // ビタミンE - 抗酸化・美肌
  {
    match: (ing) => /ビタミンE|トコフェロール/i.test(ing.name),
    goals: ["anti-aging", "skin-health"],
  },
  // ビタミンA - 目・肌
  {
    match: (ing) => /ビタミンA|レチノール|βカロテン|ベータカロテン/i.test(ing.name),
    goals: ["eye-health", "skin-health", "immune-support"],
  },
  // ビタミンK - 骨
  {
    match: (ing) => /ビタミンK/i.test(ing.name),
    goals: ["bone-joint"],
  },

  // ミネラル系
  {
    match: (ing) => /カルシウム/i.test(ing.name),
    goals: ["bone-joint"],
  },
  {
    match: (ing) => /マグネシウム/i.test(ing.name),
    goals: ["sleep-improvement", "stress-relief", "bone-joint"],
  },
  {
    match: (ing) => /亜鉛/i.test(ing.name),
    goals: ["immune-support", "skin-health", "hair-nails"],
  },
  {
    match: (ing) => /鉄|ヘム鉄/i.test(ing.name),
    goals: ["energy-recovery"],
  },
  {
    match: (ing) => /セレン/i.test(ing.name),
    goals: ["anti-aging", "immune-support"],
  },
  {
    match: (ing) => /クロム/i.test(ing.name),
    goals: ["weight-management"],
  },
  {
    match: (ing) => /カリウム/i.test(ing.name),
    goals: ["heart-health"],
  },

  // オメガ3・DHA・EPA
  {
    match: (ing) => /DHA|EPA|オメガ3|オメガ-3|フィッシュオイル|魚油/i.test(ing.name),
    goals: ["heart-health", "brain-function", "anti-aging", "eye-health"],
  },

  // アミノ酸系
  {
    match: (ing) => /BCAA|分岐鎖アミノ酸/i.test(ing.name),
    goals: ["muscle-building", "energy-recovery"],
  },
  {
    match: (ing) => /グルタミン/i.test(ing.name),
    goals: ["immune-support", "digestive-health", "muscle-building"],
  },
  {
    match: (ing) => /アルギニン/i.test(ing.name),
    goals: ["muscle-building", "energy-recovery"],
  },
  {
    match: (ing) => /システイン|シスチン/i.test(ing.name),
    goals: ["skin-health", "hair-nails", "anti-aging"],
  },
  {
    match: (ing) => /トリプトファン/i.test(ing.name),
    goals: ["sleep-improvement", "stress-relief"],
  },
  {
    match: (ing) => /GABA|ギャバ/i.test(ing.name),
    goals: ["sleep-improvement", "stress-relief"],
  },
  {
    match: (ing) => /テアニン/i.test(ing.name),
    goals: ["stress-relief", "sleep-improvement", "brain-function"],
  },
  {
    match: (ing) => /グリシン/i.test(ing.name),
    goals: ["sleep-improvement"],
  },
  {
    match: (ing) => /タウリン/i.test(ing.name),
    goals: ["energy-recovery", "eye-health", "heart-health"],
  },
  {
    match: (ing) => /カルニチン/i.test(ing.name),
    goals: ["weight-management", "energy-recovery"],
  },
  {
    match: (ing) => /クレアチン/i.test(ing.name),
    goals: ["muscle-building", "energy-recovery"],
  },

  // プロテイン
  {
    match: (ing) => /プロテイン|ホエイ|カゼイン|ソイプロテイン/i.test(ing.name),
    goals: ["muscle-building"],
  },

  // コラーゲン系
  {
    match: (ing) => /コラーゲン/i.test(ing.name),
    goals: ["skin-health", "hair-nails", "bone-joint"],
  },

  // 関節サポート
  {
    match: (ing) => /グルコサミン|コンドロイチン|MSM/i.test(ing.name),
    goals: ["bone-joint"],
  },
  {
    match: (ing) => /ヒアルロン酸/i.test(ing.name),
    goals: ["skin-health", "bone-joint"],
  },

  // 消化器系
  {
    match: (ing) => /乳酸菌|ビフィズス菌|プロバイオティクス|酵素|食物繊維/i.test(ing.name),
    goals: ["digestive-health", "immune-support"],
  },

  // 目の健康
  {
    match: (ing) => /ルテイン|ゼアキサンチン|ブルーベリー|ビルベリー|アスタキサンチン/i.test(ing.name),
    goals: ["eye-health", "anti-aging"],
  },

  // 脳機能・認知
  {
    match: (ing) => /イチョウ葉|ギンコ|フォスファチジルセリン|PS|レシチン/i.test(ing.name),
    goals: ["brain-function", "anti-aging"],
  },

  // 抗酸化系
  {
    match: (ing) => /CoQ10|コエンザイムQ10|αリポ酸|アルファリポ酸|レスベラトロール/i.test(ing.name),
    goals: ["anti-aging", "energy-recovery", "heart-health"],
  },
  {
    match: (ing) => /ポリフェノール|フラボノイド|カテキン/i.test(ing.name),
    goals: ["anti-aging"],
  },

  // 女性向け
  {
    match: (ing) => /大豆イソフラボン|エクオール|プラセンタ|ザクロ/i.test(ing.name),
    goals: ["hormone-balance", "skin-health", "anti-aging"],
  },

  // 男性向け
  {
    match: (ing) => /マカ|トンカットアリ|亜鉛酵母/i.test(ing.name),
    goals: ["energy-recovery", "hormone-balance"],
  },

  // ダイエット系
  {
    match: (ing) => /ガルシニア|キトサン|難消化性デキストリン|サラシア/i.test(ing.name),
    goals: ["weight-management"],
  },

  // ハーブ系
  {
    match: (ing) => /バレリアン|カモミール|ラベンダー/i.test(ing.name),
    goals: ["sleep-improvement", "stress-relief"],
  },
  {
    match: (ing) => /アシュワガンダ|ロディオラ/i.test(ing.name),
    goals: ["stress-relief", "energy-recovery"],
  },
  {
    match: (ing) => /エキナセア/i.test(ing.name),
    goals: ["immune-support"],
  },
  {
    match: (ing) => /ノコギリヤシ/i.test(ing.name),
    goals: ["hair-nails", "hormone-balance"],
  },

  // その他の機能性成分
  {
    match: (ing) => /NMN|NAD|ニコチンアミド/i.test(ing.name),
    goals: ["anti-aging", "energy-recovery"],
  },
  {
    match: (ing) => /HMB/i.test(ing.name),
    goals: ["muscle-building"],
  },

  // カテゴリベースのフォールバック
  {
    match: (ing) => ing.category === "ビタミン",
    goals: ["energy-recovery", "immune-support"],
  },
  {
    match: (ing) => ing.category === "ミネラル",
    goals: ["bone-joint"],
  },
  {
    match: (ing) => ing.category === "アミノ酸",
    goals: ["muscle-building", "energy-recovery"],
  },
  {
    match: (ing) => ing.category === "脂肪酸",
    goals: ["heart-health", "brain-function"],
  },
  {
    match: (ing) => ing.category === "抗酸化物質",
    goals: ["anti-aging"],
  },
  {
    match: (ing) => ing.category === "ハーブ・植物成分",
    goals: ["stress-relief"],
  },
  {
    match: (ing) => ing.category === "プロバイオティクス",
    goals: ["digestive-health"],
  },
];

/**
 * 成分に対して適切なrelatedGoalsを推論する
 */
function inferRelatedGoals(ingredient) {
  for (const rule of INFERENCE_RULES) {
    if (rule.match(ingredient)) {
      // ルールで定義されたgoalsのみを返す（HEALTH_GOALSに含まれるものだけ）
      return rule.goals.filter(g => HEALTH_GOALS.includes(g));
    }
  }
  // マッチしない場合は空配列
  return [];
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('=== relatedGoals自動同期スクリプト ===');
  console.log(`モード: ${isDryRun ? 'ドライラン（変更なし）' : '本番実行'}`);
  console.log('');

  // relatedGoalsが未設定の成分を取得
  const query = `*[_type == "ingredient" && (!defined(relatedGoals) || count(relatedGoals) == 0)]{
    _id,
    name,
    nameEn,
    category
  }`;

  const ingredientsWithoutGoals = await client.fetch(query);

  if (ingredientsWithoutGoals.length === 0) {
    console.log('✅ relatedGoalsが未設定の成分はありません。');
    return;
  }

  console.log(`📋 relatedGoalsが未設定の成分: ${ingredientsWithoutGoals.length}件`);
  console.log('');

  const updates = [];
  const unmatched = [];

  for (const ing of ingredientsWithoutGoals) {
    const inferredGoals = inferRelatedGoals(ing);

    if (inferredGoals.length > 0) {
      updates.push({
        ingredient: ing,
        goals: inferredGoals,
      });
      console.log(`✓ ${ing.name}: ${inferredGoals.join(', ')}`);
    } else {
      unmatched.push(ing);
      console.log(`⚠ ${ing.name}: マッチするルールがありません`);
    }
  }

  console.log('');
  console.log(`更新対象: ${updates.length}件`);
  console.log(`マッチなし: ${unmatched.length}件`);

  if (unmatched.length > 0) {
    console.log('');
    console.log('⚠ マッチしなかった成分（手動設定が必要）:');
    for (const ing of unmatched) {
      console.log(`  - ${ing.name} (${ing.category || 'カテゴリなし'})`);
    }
  }

  if (isDryRun) {
    console.log('');
    console.log('ドライランのため、実際の更新は行いません。');
    console.log('本番実行するには --dry-run オプションを外してください。');
    return;
  }

  if (updates.length === 0) {
    console.log('更新対象がありません。');
    return;
  }

  console.log('');
  console.log('Sanityに更新を適用中...');

  let successCount = 0;
  let errorCount = 0;

  for (const { ingredient, goals } of updates) {
    try {
      await client
        .patch(ingredient._id)
        .set({ relatedGoals: goals })
        .commit();
      successCount++;
    } catch (error) {
      console.error(`❌ ${ingredient.name}の更新に失敗: ${error.message}`);
      errorCount++;
    }
  }

  console.log('');
  console.log('=== 結果 ===');
  console.log(`✅ 成功: ${successCount}件`);
  if (errorCount > 0) {
    console.log(`❌ 失敗: ${errorCount}件`);
  }
}

main().catch(console.error);
