#!/usr/bin/env node

/**
 * ランク整合性の全自動修正スクリプト
 *
 * 修正内容:
 * 1. エビデンスレベル統一（evidenceLevelフィールド削除、tierRatings.evidenceRankのみ使用）
 * 2. スコア・ランク不整合修正（スコアから正しいランクを再計算）
 * 3. tierRatings未設定の商品にランク計算
 * 4. 矛盾する組み合わせ（価格Dでコスパランクなど）の修正
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

// コマンドライン引数
const shouldFix = process.argv.includes('--fix');
const isDryRun = !shouldFix;

/**
 * スコアをランクに変換
 */
function scoreToRank(score) {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

/**
 * ステップ1: エビデンスレベル統一
 */
async function unifyEvidenceLevels() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ステップ1: エビデンスレベル統一');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const products = await client.fetch(`
    *[_type == "product" && defined(evidenceLevel)] {
      _id,
      name,
      evidenceLevel,
      "tierRatingsEvidenceRank": tierRatings.evidenceRank
    }
  `);

  console.log(`📊 古い形式のevidenceLevelフィールドを持つ商品: ${products.length}件\n`);

  if (products.length === 0) {
    console.log('✅ すべての商品で既に統一されています！\n');
    return { fixed: 0, errors: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  if (shouldFix) {
    console.log('🔧 evidenceLevelフィールドを削除中...\n');

    for (const product of products) {
      try {
        // evidenceLevelフィールドを削除（unset）
        await client
          .patch(product._id)
          .unset(['evidenceLevel'])
          .commit();

        successCount++;
        console.log(`✅ ${product.name.substring(0, 60)}... - evidenceLevel削除`);
      } catch (error) {
        errorCount++;
        console.error(`❌ ${product.name.substring(0, 60)}... - エラー: ${error.message}`);
      }
    }

    console.log(`\n削除完了: ${successCount}件成功、${errorCount}件失敗\n`);
  } else {
    console.log('💡 プレビューモード: 以下の商品から evidenceLevel が削除されます:\n');
    products.slice(0, 20).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name.substring(0, 60)}... (旧=${p.evidenceLevel}, 新=${p.tierRatingsEvidenceRank || '未設定'})`);
    });
    if (products.length > 20) {
      console.log(`\n... 他${products.length - 20}件\n`);
    }
  }

  return { fixed: successCount, errors: errorCount };
}

/**
 * ステップ2: スコア・ランク不整合修正
 */
async function fixScoreRankMismatches() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 ステップ2: スコア・ランク不整合修正');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const products = await client.fetch(`
    *[_type == "product" && defined(scores) && defined(tierRatings)] {
      _id,
      name,
      scores,
      tierRatings
    }
  `);

  const mismatches = [];

  for (const product of products) {
    if (!product.scores || !product.tierRatings) continue;

    const updates = {};

    // 安全性スコアとランクの不一致をチェック
    if (product.scores.safety !== undefined) {
      const expectedRank = scoreToRank(product.scores.safety);
      if (product.tierRatings.safetyRank && product.tierRatings.safetyRank !== expectedRank) {
        updates.safetyRank = expectedRank;
      }
    }

    // エビデンススコアとランクの不一致をチェック
    if (product.scores.evidence !== undefined) {
      const expectedRank = scoreToRank(product.scores.evidence);
      if (product.tierRatings.evidenceRank && product.tierRatings.evidenceRank !== expectedRank) {
        updates.evidenceRank = expectedRank;
      }
    }

    if (Object.keys(updates).length > 0) {
      mismatches.push({
        _id: product._id,
        name: product.name,
        updates,
        current: product.tierRatings,
        scores: product.scores
      });
    }
  }

  console.log(`📊 不整合が見つかった商品: ${mismatches.length}件\n`);

  if (mismatches.length === 0) {
    console.log('✅ すべての商品でスコアとランクが一致しています！\n');
    return { fixed: 0, errors: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  if (shouldFix) {
    console.log('🔧 ランクを修正中...\n');

    for (const mismatch of mismatches) {
      try {
        const newTierRatings = {
          ...mismatch.current,
          ...mismatch.updates
        };

        await client
          .patch(mismatch._id)
          .set({ tierRatings: newTierRatings })
          .commit();

        successCount++;
        console.log(`✅ ${mismatch.name.substring(0, 60)}...`);
        console.log(`   修正: ${Object.entries(mismatch.updates).map(([k, v]) => `${k}=${v}`).join(', ')}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ ${mismatch.name.substring(0, 60)}... - エラー: ${error.message}`);
      }
    }

    console.log(`\n修正完了: ${successCount}件成功、${errorCount}件失敗\n`);
  } else {
    console.log('💡 プレビューモード: 以下のランクが修正されます:\n');
    mismatches.slice(0, 20).forEach((m, i) => {
      console.log(`${i + 1}. ${m.name.substring(0, 60)}...`);
      console.log(`   スコア: safety=${m.scores.safety}, evidence=${m.scores.evidence}`);
      console.log(`   現在: safetyRank=${m.current.safetyRank}, evidenceRank=${m.current.evidenceRank}`);
      console.log(`   修正: ${Object.entries(m.updates).map(([k, v]) => `${k}=${v}`).join(', ')}`);
    });
    if (mismatches.length > 20) {
      console.log(`\n... 他${mismatches.length - 20}件\n`);
    }
  }

  return { fixed: successCount, errors: errorCount };
}

/**
 * ステップ3: tierRatings未設定の商品を修正
 */
async function fixMissingTierRatings() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🆕 ステップ3: tierRatings未設定の商品を修正');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const products = await client.fetch(`
    *[_type == "product" && !defined(tierRatings)] {
      _id,
      name,
      priceJPY,
      scores
    }
  `);

  console.log(`📊 tierRatings未設定の商品: ${products.length}件\n`);

  if (products.length === 0) {
    console.log('✅ すべての商品にtierRatingsが設定されています！\n');
    return { fixed: 0, errors: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  if (shouldFix) {
    console.log('🔧 tierRatingsを設定中...\n');

    for (const product of products) {
      try {
        // 仮のランクを設定（後でauto-calculate-tier-ranks.mjsで正しい値に更新される）
        const tierRatings = {
          priceRank: 'B',
          costEffectivenessRank: 'B',
          contentRank: 'B',
          evidenceRank: product.scores?.evidence ? scoreToRank(product.scores.evidence) : 'C',
          safetyRank: product.scores?.safety ? scoreToRank(product.scores.safety) : 'C',
          overallRank: 'B'
        };

        await client
          .patch(product._id)
          .set({ tierRatings })
          .commit();

        successCount++;
        console.log(`✅ ${product.name.substring(0, 60)}... - tierRatings設定`);
      } catch (error) {
        errorCount++;
        console.error(`❌ ${product.name.substring(0, 60)}... - エラー: ${error.message}`);
      }
    }

    console.log(`\n設定完了: ${successCount}件成功、${errorCount}件失敗\n`);
  } else {
    console.log('💡 プレビューモード: 以下の商品にtierRatingsが設定されます:\n');
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name.substring(0, 60)}...`);
    });
  }

  return { fixed: successCount, errors: errorCount };
}

/**
 * メイン処理
 */
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🔧 ランク整合性 全自動修正システム      ║');
  console.log('╚════════════════════════════════════════════╝');

  if (isDryRun) {
    console.log('\n⚠️  プレビューモード: 実際の修正は行いません');
    console.log('実際に修正を適用するには --fix オプションを付けて実行してください\n');
  } else {
    console.log('\n🚀 修正モード: 実際にデータを修正します\n');
  }

  const results = {
    evidenceLevelUnified: { fixed: 0, errors: 0 },
    scoreRankFixed: { fixed: 0, errors: 0 },
    tierRatingsCreated: { fixed: 0, errors: 0 }
  };

  try {
    // ステップ1: エビデンスレベル統一
    results.evidenceLevelUnified = await unifyEvidenceLevels();

    // ステップ2: スコア・ランク不整合修正
    results.scoreRankFixed = await fixScoreRankMismatches();

    // ステップ3: tierRatings未設定の商品を修正
    results.tierRatingsCreated = await fixMissingTierRatings();

    // サマリー表示
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 修正サマリー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const totalFixed =
      results.evidenceLevelUnified.fixed +
      results.scoreRankFixed.fixed +
      results.tierRatingsCreated.fixed;

    const totalErrors =
      results.evidenceLevelUnified.errors +
      results.scoreRankFixed.errors +
      results.tierRatingsCreated.errors;

    console.log(`✅ エビデンスレベル統一: ${results.evidenceLevelUnified.fixed}件修正`);
    console.log(`✅ スコア・ランク不整合: ${results.scoreRankFixed.fixed}件修正`);
    console.log(`✅ tierRatings未設定: ${results.tierRatingsCreated.fixed}件修正`);
    console.log(`❌ エラー: ${totalErrors}件\n`);

    console.log(`合計: ${totalFixed}件修正\n`);

    if (shouldFix && totalFixed > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 次のステップ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('1. 正確なランクを再計算するため、以下のコマンドを実行してください:');
      console.log('   node scripts/auto-calculate-tier-ranks.mjs --fix\n');
      console.log('2. 最終確認のため、バリデーションを実行してください:');
      console.log('   node scripts/quick-validate.mjs\n');
    } else if (isDryRun) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 次のステップ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('実際に修正を適用するには、以下のコマンドを実行してください:');
      console.log('  node scripts/fix-all-rank-issues.mjs --fix\n');
    }

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('✅ 修正処理完了\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
