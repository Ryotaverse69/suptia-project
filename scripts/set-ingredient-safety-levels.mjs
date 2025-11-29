#!/usr/bin/env node

/**
 * 成分マスタの safetyLevel を設定するスクリプト
 * evidenceLevel が設定されていて safetyLevel が未設定の成分に対して
 * 安全性レベルを設定する
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fny3jdcg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const dryRun = process.argv.includes('--dry-run');

// 安全性レベルの定義（成分名ベース）
// 基本的にビタミン・ミネラルは安全、ハーブ系は注意が必要
const safetyLevelMap = {
  // ビタミン系 - 基本的に安全（水溶性は特に安全）
  'ビタミンA': 'A',  // 過剰摂取注意あるが通常量は安全
  'ビタミンB1': 'S',
  'ビタミンB2': 'S',
  'ビタミンB6': 'S',
  'ビタミンB12': 'S',
  'ビタミンC': 'S',
  'ビタミンD': 'A',  // 過剰摂取で毒性あり
  'ビタミンE': 'A',  // 脂溶性なので若干注意
  'ビタミンK': 'A',  // 血液凝固に影響
  'ナイアシン': 'S',
  'パントテン酸': 'S',
  '葉酸': 'S',
  'ビオチン': 'S',
  'ビタミンB群': 'S',

  // ミネラル系 - 基本的に安全
  'カルシウム': 'S',
  'マグネシウム': 'S',
  '鉄': 'A',  // 過剰摂取で問題あり
  '亜鉛': 'A',  // 過剰摂取で銅欠乏
  'セレン': 'B',  // 過剰摂取注意
  'クロム': 'B',  // 過剰摂取注意
  '銅': 'B',  // 過剰摂取注意
  'マンガン': 'B',
  'カリウム': 'A',
  'ヨウ素': 'B',  // 甲状腺に影響

  // アミノ酸系 - 基本的に安全
  'BCAA': 'S',
  'アルギニン': 'S',
  'グルタミン': 'S',
  'グリシン': 'S',
  'タウリン': 'S',
  'シトルリン': 'S',
  'オルニチン': 'S',
  'カルニチン': 'S',
  'L-カルニチン': 'S',
  'トリプトファン': 'A',
  'チロシン': 'A',

  // プロテイン系 - 安全
  'プロテイン': 'S',
  'ホエイプロテイン': 'S',
  'コラーゲン': 'S',

  // 脂肪酸系 - 安全
  'オメガ3': 'S',
  'DHA': 'S',
  'EPA': 'S',
  'フィッシュオイル': 'S',
  'γ-リノレン酸': 'A',

  // 抗酸化物質系
  'コエンザイムQ10': 'S',
  'αリポ酸': 'A',
  'α-リポ酸': 'A',
  'アスタキサンチン': 'S',
  'ルテイン': 'S',
  'ゼアキサンチン': 'S',
  'レスベラトロール': 'A',
  'ポリフェノール': 'S',
  'カテキン': 'S',
  'アントシアニン': 'S',

  // 植物由来系
  'ブルーベリー': 'S',
  'ビルベリー': 'S',
  'クランベリー': 'S',
  'アサイー': 'S',
  '青汁': 'S',
  '乳酸菌': 'S',
  'プロバイオティクス': 'S',
  '酵素': 'S',
  '食物繊維': 'S',

  // 機能性成分
  'グルコサミン': 'S',
  'コンドロイチン': 'S',
  'ヒアルロン酸': 'S',
  'プラセンタ': 'A',
  '大豆イソフラボン': 'B',  // ホルモン様作用
  'エクオール': 'B',

  // ハーブ・漢方系 - 注意が必要なものが多い
  'マカ': 'B',
  '高麗人参': 'B',
  '高麗人参エキス': 'B',
  'イチョウ葉': 'B',
  'ギンコ': 'B',
  'セントジョーンズワート': 'C',  // 薬物相互作用多い
  'バレリアン': 'B',
  'エキナセア': 'B',
  'ノコギリヤシ': 'B',
  'エゾウコギ': 'B',
  'ウコン': 'B',
  'ショウガ': 'S',
  'ニンニク': 'A',

  // ダイエット系
  'キトサン': 'A',
  'ギムネマ': 'B',
  'サラシア': 'B',
  'ガルシニア': 'B',
  '白インゲン豆': 'A',
  'カプサイシン': 'B',

  // その他
  'GABA': 'S',
  'セサミン': 'S',
  'クエン酸': 'S',
  'ローヤルゼリー': 'A',
  'プロポリス': 'B',  // アレルギー注意
  'マヌカハニー': 'S',
  'ハトムギエキス': 'S',
  'エラグ酸': 'S',
  'ヘム鉄': 'A',
  'カフェイン': 'B',  // 過剰摂取注意
  'クレアチン': 'A',
  'HMB': 'A',
  'シリカ': 'S',
  'MSM': 'A',
};

// evidenceLevel から safetyLevel を推定するマッピング
// 基本的に研究が進んでいる成分ほど安全性データも揃っている
function estimateSafetyFromEvidence(evidenceLevel) {
  switch (evidenceLevel) {
    case 'S': return 'A';  // エビデンスSでも安全性は慎重に
    case 'A': return 'A';
    case 'B': return 'B';
    case 'C': return 'B';
    case 'D': return 'C';
    default: return 'B';  // 不明な場合は中間値
  }
}

async function main() {
  console.log('🔧 成分マスタの safetyLevel を設定します');
  console.log(dryRun ? '📋 ドライランモード\n' : '\n');

  // 全成分を取得
  const ingredients = await client.fetch(`
    *[_type == "ingredient"] | order(name asc) {
      _id,
      name,
      evidenceLevel,
      safetyLevel,
      riskLevel
    }
  `);

  console.log(`成分マスタ: ${ingredients.length}件\n`);

  // safetyLevel未設定の成分を抽出
  const needsUpdate = ingredients.filter(i => !i.safetyLevel);
  console.log(`safetyLevel未設定: ${needsUpdate.length}件\n`);

  if (needsUpdate.length === 0) {
    console.log('✅ 全ての成分にsafetyLevelが設定済みです');
    return;
  }

  let updatedCount = 0;
  const updates = [];

  for (const ing of needsUpdate) {
    let newSafetyLevel;
    let source;

    // 成分名で直接マッピングを試みる
    if (safetyLevelMap[ing.name]) {
      newSafetyLevel = safetyLevelMap[ing.name];
      source = '成分名マッピング';
    } else {
      // evidenceLevel から推定
      newSafetyLevel = estimateSafetyFromEvidence(ing.evidenceLevel);
      source = `evidenceLevel(${ing.evidenceLevel || '未設定'})から推定`;
    }

    updates.push({
      id: ing._id,
      name: ing.name,
      evidence: ing.evidenceLevel,
      newSafety: newSafetyLevel,
      source
    });

    console.log(`📦 ${ing.name}`);
    console.log(`   evidence: ${ing.evidenceLevel || '未設定'} → safety: ${newSafetyLevel} (${source})`);

    if (!dryRun) {
      await client.patch(ing._id)
        .set({ safetyLevel: newSafetyLevel })
        .commit();
    }

    updatedCount++;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${updatedCount}件の成分を更新${dryRun ? '予定' : '完了'}`);

  // 更新結果のサマリー
  const safetyDist = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  updates.forEach(u => {
    safetyDist[u.newSafety]++;
  });

  console.log('\n設定したsafetyLevelの分布:');
  console.log(`  S: ${safetyDist.S}件`);
  console.log(`  A: ${safetyDist.A}件`);
  console.log(`  B: ${safetyDist.B}件`);
  console.log(`  C: ${safetyDist.C}件`);
  console.log(`  D: ${safetyDist.D}件`);

  if (dryRun) {
    console.log('\n💡 実際に適用するには --dry-run なしで再実行してください');
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
