#!/usr/bin/env node

/**
 * 商品同期後の自動検証スクリプト
 *
 * 同期スクリプト実行後に自動的に呼び出され、
 * データ品質の問題を早期に検出・修正します。
 *
 * 実行内容:
 * 1. 成分リンクの自動補完
 * 2. 成分量の異常値チェック・修正
 * 3. Tierランクの計算・更新
 * 4. 問題サマリーの出力
 *
 * 使い方:
 *   node scripts/post-sync-validation.mjs [options]
 *
 * オプション:
 *   --fix           問題を自動修正（デフォルト: プレビューのみ）
 *   --quick         高速モード（Tierランク計算をスキップ）
 *   --silent        サマリーのみ出力
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../apps/web/.env.local') });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fny3jdcg';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error('❌ エラー: SANITY_API_TOKEN環境変数が設定されていません');
  process.exit(1);
}

// コマンドライン引数
const shouldFix = process.argv.includes('--fix');
const quickMode = process.argv.includes('--quick');
const silentMode = process.argv.includes('--silent');

// 子プロセスでスクリプトを実行
function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], {
      cwd: join(__dirname, '..'),
      stdio: silentMode ? 'pipe' : 'inherit',
    });

    let output = '';
    if (silentMode) {
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      child.stderr.on('data', (data) => {
        output += data.toString();
      });
    }

    child.on('close', (code) => {
      resolve({ code, output });
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('━'.repeat(60));
  console.log('🔍 商品同期後の自動検証');
  console.log('━'.repeat(60));
  console.log(`モード: ${shouldFix ? '修正実行' : 'プレビュー'}`);
  console.log(`時刻: ${new Date().toISOString()}`);
  console.log('');

  const results = {
    ingredientLink: { success: false, count: 0 },
    zeroAmountFix: { success: false, fixed: 0 },
    amountValidation: { success: false, fixed: 0 },
    tierRank: { success: false, updated: 0 },
    errors: [],
  };

  // 1. 成分リンクの自動補完
  console.log('📌 Step 1: 成分リンクの自動補完...');
  try {
    const args = shouldFix ? ['--fix'] : [];
    const result = await runScript('scripts/auto-link-ingredients.mjs', args);

    if (result.code === 0) {
      results.ingredientLink.success = true;
      // 出力からリンク数を抽出
      const match = result.output?.match(/紐付け実行: (\d+)件/);
      if (match) {
        results.ingredientLink.count = parseInt(match[1], 10);
      }
      console.log(`   ✅ 完了${results.ingredientLink.count > 0 ? ` (${results.ingredientLink.count}件リンク)` : ''}`);
    } else {
      console.log('   ⚠️ 一部エラーあり');
    }
  } catch (error) {
    results.errors.push(`成分リンク: ${error.message}`);
    console.log(`   ❌ エラー: ${error.message}`);
  }

  // 2. ゼロ含有量の自動修正（allIngredientsと商品名から抽出）
  console.log('📌 Step 2: ゼロ含有量の自動修正...');
  try {
    let totalFixed = 0;

    // 2a. allIngredientsから成分量を抽出
    const args1 = shouldFix ? ['--execute'] : [];
    const result1 = await runScript('scripts/extract-amounts-from-all-ingredients.mjs', args1);

    if (result1.code === 0) {
      const match1 = result1.output?.match(/(\d+)件の成分量を更新/);
      if (match1) {
        totalFixed += parseInt(match1[1], 10);
      }
    }

    // 2b. 商品名から成分量を抽出
    const args2 = shouldFix ? ['--execute'] : [];
    const result2 = await runScript('scripts/extract-amounts-from-names.mjs', args2);

    if (result2.code === 0) {
      const match2 = result2.output?.match(/(\d+)件の商品を更新/);
      if (match2) {
        totalFixed += parseInt(match2[1], 10);
      }
    }

    results.zeroAmountFix.success = true;
    results.zeroAmountFix.fixed = totalFixed;
    console.log(`   ✅ 完了${totalFixed > 0 ? ` (${totalFixed}件修正)` : ''}`);
  } catch (error) {
    results.errors.push(`ゼロ含有量修正: ${error.message}`);
    console.log(`   ❌ エラー: ${error.message}`);
  }

  // 3. 成分量の異常値チェック・修正
  console.log('📌 Step 3: 成分量の異常値チェック...');
  try {
    const args = shouldFix ? ['--fix'] : [];
    const result = await runScript('scripts/validate-and-fix-ingredient-amounts.mjs', args);

    if (result.code === 0) {
      results.amountValidation.success = true;
      // 出力から修正数を抽出
      const match = result.output?.match(/修正完了: (\d+)件成功/);
      if (match) {
        results.amountValidation.fixed = parseInt(match[1], 10);
      }
      console.log(`   ✅ 完了${results.amountValidation.fixed > 0 ? ` (${results.amountValidation.fixed}件修正)` : ''}`);
    } else {
      console.log('   ⚠️ 一部エラーあり');
    }
  } catch (error) {
    results.errors.push(`成分量検証: ${error.message}`);
    console.log(`   ❌ エラー: ${error.message}`);
  }

  // 4. Tierランクの計算・更新（quickモードではスキップ）
  if (!quickMode) {
    console.log('📌 Step 4: Tierランクの計算・更新...');
    try {
      const args = shouldFix ? ['--fix'] : [];
      const result = await runScript('scripts/auto-calculate-tier-ranks.mjs', args);

      if (result.code === 0) {
        results.tierRank.success = true;
        // 出力から更新数を抽出
        const match = result.output?.match(/更新完了: (\d+)件成功/);
        if (match) {
          results.tierRank.updated = parseInt(match[1], 10);
        }
        console.log(`   ✅ 完了${results.tierRank.updated > 0 ? ` (${results.tierRank.updated}件更新)` : ''}`);
      } else {
        console.log('   ⚠️ 一部エラーあり');
      }
    } catch (error) {
      results.errors.push(`Tierランク: ${error.message}`);
      console.log(`   ❌ エラー: ${error.message}`);
    }
  } else {
    console.log('📌 Step 4: Tierランクの計算・更新... スキップ (--quick)');
  }

  // サマリー出力
  console.log('');
  console.log('━'.repeat(60));
  console.log('📊 検証結果サマリー');
  console.log('━'.repeat(60));

  const allSuccess = results.ingredientLink.success &&
    results.zeroAmountFix.success &&
    results.amountValidation.success &&
    (quickMode || results.tierRank.success);

  if (allSuccess && results.errors.length === 0) {
    console.log('✅ すべての検証が正常に完了しました');
  } else {
    console.log('⚠️ 一部の検証で問題が発生しました');
    if (results.errors.length > 0) {
      console.log('');
      console.log('エラー:');
      results.errors.forEach((e) => console.log(`   - ${e}`));
    }
  }

  console.log('');
  console.log('処理件数:');
  console.log(`   成分リンク: ${results.ingredientLink.count}件`);
  console.log(`   ゼロ含有量修正: ${results.zeroAmountFix.fixed}件`);
  console.log(`   成分量異常値修正: ${results.amountValidation.fixed}件`);
  if (!quickMode) {
    console.log(`   Tierランク更新: ${results.tierRank.updated}件`);
  }

  console.log('');
  console.log('━'.repeat(60));

  if (!shouldFix && (results.ingredientLink.count > 0 || results.zeroAmountFix.fixed > 0 || results.amountValidation.fixed > 0 || results.tierRank.updated > 0)) {
    console.log('💡 実際に修正を適用するには --fix オプションを付けて実行してください');
    console.log('   node scripts/post-sync-validation.mjs --fix');
  }

  return allSuccess ? 0 : 1;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error('❌ 予期しないエラー:', error);
    process.exit(1);
  });
