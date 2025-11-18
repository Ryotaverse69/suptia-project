#!/usr/bin/env node

/**
 * Yahoo!商品一括同期スクリプト
 *
 * 複数のキーワードでYahoo!商品を一括取得します
 */

import { execSync } from 'child_process';

// 人気の成分・サプリメントキーワード
const keywords = [
  'ビタミンC',
  'ビタミンD',
  'ビタミンB',
  'オメガ3',
  'DHA',
  'EPA',
  'マグネシウム',
  'カルシウム',
  '鉄分',
  '亜鉛',
  'マルチビタミン',
  'プロテイン',
  'コラーゲン',
  'グルコサミン',
  'コエンザイムQ10',
  '葉酸',
  'ビオチン',
  'ナイアシン',
  'ビタミンE',
  'セレン',
];

// 各キーワードで取得する商品数
const LIMIT_PER_KEYWORD = 30;

console.log('🚀 Yahoo!商品一括同期を開始します\n');
console.log(`📋 キーワード数: ${keywords.length}件`);
console.log(`📦 各キーワードで取得: ${LIMIT_PER_KEYWORD}件`);
console.log(`✨ 予想取得数: 最大${keywords.length * LIMIT_PER_KEYWORD}件\n`);

let totalAdded = 0;
let totalSkipped = 0;
let totalErrors = 0;

for (let i = 0; i < keywords.length; i++) {
  const keyword = keywords[i];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${i + 1}/${keywords.length}] "${keyword}" で検索中...`);
  console.log('='.repeat(60));

  try {
    const command = `node scripts/sync-yahoo-products.mjs "${keyword}" --limit ${LIMIT_PER_KEYWORD}`;
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit' // リアルタイムで出力を表示
    });

    // 成功
    totalAdded += LIMIT_PER_KEYWORD;
    console.log(`✅ "${keyword}" の同期完了`);

    // レート制限対策: 各リクエスト後に2秒待機
    console.log('⏳ 2秒待機中...');
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.error(`❌ "${keyword}" の同期中にエラーが発生しました`);
    totalErrors++;

    // エラーが発生しても続行
    continue;
  }
}

console.log('\n' + '='.repeat(60));
console.log('🎉 一括同期完了！');
console.log('='.repeat(60));
console.log(`✅ 成功: ${keywords.length - totalErrors}件のキーワード`);
console.log(`❌ エラー: ${totalErrors}件のキーワード`);
console.log(`📦 予想追加商品数: 約${totalAdded}件`);
console.log('\n💡 次のステップ:');
console.log('  1. node scripts/count-products-by-source.mjs で商品数を確認');
console.log('  2. node scripts/auto-calculate-tier-ranks.mjs でランク計算');
console.log('  3. node scripts/calculate-badges.mjs でバッジ付与');
