#!/usr/bin/env node

/**
 * Yahoo!商品一括同期テストスクリプト（少数のキーワードで試す）
 */

import { execSync } from 'child_process';

// テスト用の少数キーワード
const keywords = [
  'ビタミンC',
  'ビタミンD',
  'オメガ3',
  'マグネシウム',
  'マルチビタミン',
];

const LIMIT_PER_KEYWORD = 30;

console.log('🧪 Yahoo!商品一括同期テストを開始します\n');
console.log(`📋 キーワード数: ${keywords.length}件`);
console.log(`📦 各キーワードで取得: ${LIMIT_PER_KEYWORD}件`);
console.log(`✨ 予想取得数: 最大${keywords.length * LIMIT_PER_KEYWORD}件\n`);

let totalErrors = 0;

for (let i = 0; i < keywords.length; i++) {
  const keyword = keywords[i];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${i + 1}/${keywords.length}] "${keyword}" で検索中...`);
  console.log('='.repeat(60));

  try {
    const command = `node scripts/sync-yahoo-products.mjs "${keyword}" --limit ${LIMIT_PER_KEYWORD}`;
    execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit'
    });

    console.log(`✅ "${keyword}" の同期完了`);

    // レート制限対策: 各リクエスト後に2秒待機
    if (i < keywords.length - 1) {
      console.log('⏳ 2秒待機中...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

  } catch (error) {
    console.error(`❌ "${keyword}" の同期中にエラーが発生しました`);
    totalErrors++;
    continue;
  }
}

console.log('\n' + '='.repeat(60));
console.log('🎉 テスト同期完了！');
console.log('='.repeat(60));
console.log(`✅ 成功: ${keywords.length - totalErrors}件のキーワード`);
console.log(`❌ エラー: ${totalErrors}件のキーワード`);

// Helper function for delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
