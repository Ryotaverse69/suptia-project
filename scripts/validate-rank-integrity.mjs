#!/usr/bin/env node

/**
 * ランク整合性検証スクリプト
 *
 * 使用方法:
 *   npm run validate:ranks               # 検証のみ
 *   npm run validate:ranks -- --fix      # 自動修正も実行
 *   npm run validate:ranks -- --report   # レポート生成
 */

import { config } from 'dotenv';
import { createClient } from '@sanity/client';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

// コマンドライン引数の解析
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const shouldGenerateReport = args.includes('--report');
const isQuiet = args.includes('--quiet');
const isVerbose = args.includes('--verbose');

// ログユーティリティ
const log = {
  info: (msg) => !isQuiet && console.log(chalk.blue('ℹ'), msg),
  success: (msg) => !isQuiet && console.log(chalk.green('✓'), msg),
  warning: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  verbose: (msg) => isVerbose && console.log(chalk.gray('▸'), msg),
  section: (title) => !isQuiet && console.log(chalk.bold.cyan(`\n━━━ ${title} ━━━`))
};

/**
 * ランクの妥当性検証ルール
 */
const VALIDATION_RULES = {
  // ランクの有効値
  VALID_RANKS: ['S+', 'S', 'A', 'B', 'C', 'D'],

  // スコアとランクのマッピング
  SCORE_TO_RANK: {
    90: 'S',
    80: 'A',
    70: 'B',
    60: 'C',
    0: 'D'
  },

  // 不可能な組み合わせ
  IMPOSSIBLE_COMBINATIONS: [
    {
      condition: (tr) => tr.overallRank === 'S+' &&
        !(tr.priceRank === 'S' && tr.costEffectivenessRank === 'S' &&
          tr.contentRank === 'S' && tr.evidenceRank === 'S' && tr.safetyRank === 'S'),
      message: 'S+ランクは5冠達成時のみ付与可能'
    },
    {
      condition: (tr) => tr.priceRank === 'D' && tr.costEffectivenessRank === 'S',
      message: '価格Dランクでコスパランクは通常ありえません'
    }
  ],

  // データ鮮度（日数）
  MAX_AGE_DAYS: 7,

  // 異常値の閾値
  ANOMALY_THRESHOLDS: {
    MIN_COST_PER_MG: 0.001,
    MAX_COST_PER_MG: 10,
    MAX_SERVINGS_PER_DAY: 10,
    MAX_PRICE: 999999
  }
};

/**
 * 商品データの検証
 */
function validateProduct(product) {
  const issues = {
    errors: [],
    warnings: [],
    suggestions: []
  };

  // 1. tierRatingsの存在チェック
  if (!product.tierRatings) {
    issues.errors.push({
      field: 'tierRatings',
      message: 'Tierランク情報が未設定',
      severity: 'critical'
    });
    return issues;
  }

  const tr = product.tierRatings;

  // 2. 各ランクの有効性チェック
  const rankFields = ['priceRank', 'costEffectivenessRank', 'contentRank', 'evidenceRank', 'safetyRank', 'overallRank'];

  for (const field of rankFields) {
    if (!tr[field]) {
      issues.errors.push({
        field: `tierRatings.${field}`,
        message: `${field}が未設定`,
        severity: 'high'
      });
    } else if (!VALIDATION_RULES.VALID_RANKS.includes(tr[field])) {
      issues.errors.push({
        field: `tierRatings.${field}`,
        message: `無効なランク値: ${tr[field]}`,
        currentValue: tr[field],
        expectedValues: VALIDATION_RULES.VALID_RANKS,
        severity: 'critical'
      });
    }
  }

  // 3. 旧形式と新形式の整合性
  if (product.evidenceLevel && tr.evidenceRank) {
    if (product.evidenceLevel !== tr.evidenceRank) {
      issues.warnings.push({
        field: 'evidenceLevel',
        message: `旧形式(${product.evidenceLevel})と新形式(${tr.evidenceRank})が不一致`,
        suggestion: `evidenceLevelを${tr.evidenceRank}に更新`
      });
    }
  }

  // 4. スコアとランクの整合性
  if (product.scores) {
    // 安全性スコアチェック
    if (product.scores.safety !== undefined && tr.safetyRank) {
      const expectedRank = getExpectedRankFromScore(product.scores.safety);
      if (expectedRank !== tr.safetyRank) {
        issues.warnings.push({
          field: 'scores.safety',
          message: `スコア${product.scores.safety}に対してランク${tr.safetyRank}は不整合（期待値: ${expectedRank}）`,
          currentValue: tr.safetyRank,
          expectedValue: expectedRank
        });
      }
    }

    // エビデンススコアチェック
    if (product.scores.evidence !== undefined && tr.evidenceRank) {
      const expectedRank = getExpectedRankFromScore(product.scores.evidence);
      if (expectedRank !== tr.evidenceRank) {
        issues.warnings.push({
          field: 'scores.evidence',
          message: `スコア${product.scores.evidence}に対してランク${tr.evidenceRank}は不整合（期待値: ${expectedRank}）`,
          currentValue: tr.evidenceRank,
          expectedValue: expectedRank
        });
      }
    }
  }

  // 5. 不可能な組み合わせチェック
  for (const rule of VALIDATION_RULES.IMPOSSIBLE_COMBINATIONS) {
    if (rule.condition(tr)) {
      issues.errors.push({
        field: 'tierRatings',
        message: rule.message,
        severity: 'high'
      });
    }
  }

  // 6. データ鮮度チェック
  if (product._updatedAt && product.lastCalculatedAt) {
    const daysSinceCalculation = getDaysDifference(product.lastCalculatedAt, new Date());
    if (daysSinceCalculation > VALIDATION_RULES.MAX_AGE_DAYS) {
      issues.warnings.push({
        field: 'lastCalculatedAt',
        message: `ランクが${Math.floor(daysSinceCalculation)}日前に計算されています`,
        suggestion: 'ランクの再計算を実行'
      });
    }
  }

  // 7. 異常値チェック
  if (product.priceJPY) {
    if (product.priceJPY <= 0 || product.priceJPY > VALIDATION_RULES.ANOMALY_THRESHOLDS.MAX_PRICE) {
      issues.errors.push({
        field: 'priceJPY',
        message: `価格が異常値: ¥${product.priceJPY}`,
        severity: 'high'
      });
    }
  }

  if (product.servingsPerDay) {
    if (product.servingsPerDay > VALIDATION_RULES.ANOMALY_THRESHOLDS.MAX_SERVINGS_PER_DAY) {
      issues.warnings.push({
        field: 'servingsPerDay',
        message: `1日摂取回数が異常: ${product.servingsPerDay}回`,
        suggestion: 'データ入力ミスの可能性'
      });
    }
  }

  // 8. コスト計算の妥当性
  if (product.priceJPY && product.ingredientAmount && product.servingsPerContainer) {
    const costPerMg = product.priceJPY / (product.ingredientAmount * product.servingsPerContainer);

    if (costPerMg < VALIDATION_RULES.ANOMALY_THRESHOLDS.MIN_COST_PER_MG) {
      issues.warnings.push({
        field: 'calculated costPerMg',
        message: `mgあたりコストが異常に低い: ¥${costPerMg.toFixed(6)}`,
        suggestion: 'データ入力ミスの確認'
      });
    } else if (costPerMg > VALIDATION_RULES.ANOMALY_THRESHOLDS.MAX_COST_PER_MG) {
      issues.warnings.push({
        field: 'calculated costPerMg',
        message: `mgあたりコストが異常に高い: ¥${costPerMg.toFixed(2)}`,
        suggestion: 'データ入力ミスの確認'
      });
    }
  }

  return issues;
}

/**
 * スコアから期待されるランクを取得
 */
function getExpectedRankFromScore(score) {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

/**
 * 日付の差分を計算
 */
function getDaysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * 自動修正を実行
 */
async function autoFixProduct(productId, fixes) {
  try {
    await client
      .patch(productId)
      .set(fixes)
      .commit();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * HTMLレポートを生成
 */
function generateHTMLReport(results, stats) {
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ランク整合性検証レポート</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
    .stat-value { font-size: 2em; font-weight: bold; }
    .stat-label { opacity: 0.9; margin-top: 5px; }
    .error { background: #fee; border-left: 4px solid #f44; padding: 10px; margin: 10px 0; }
    .warning { background: #ffeaa7; border-left: 4px solid #fdcb6e; padding: 10px; margin: 10px 0; }
    .success { background: #d1f2eb; border-left: 4px solid #00b894; padding: 10px; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 600; }
    .badge-critical { background: #ff4757; color: white; }
    .badge-high { background: #ff6348; color: white; }
    .badge-medium { background: #ffa502; color: white; }
    .badge-low { background: #5352ed; color: white; }
    .timestamp { color: #999; font-size: 0.9em; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 ランク整合性検証レポート</h1>
    <p class="timestamp">生成日時: ${new Date().toLocaleString('ja-JP')}</p>

    <h2>📊 統計サマリー</h2>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${stats.totalProducts}</div>
        <div class="stat-label">総商品数</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);">
        <div class="stat-value">${stats.validProducts}</div>
        <div class="stat-label">正常 (${((stats.validProducts / stats.totalProducts) * 100).toFixed(1)}%)</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);">
        <div class="stat-value">${stats.totalErrors}</div>
        <div class="stat-label">エラー総数</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);">
        <div class="stat-value">${stats.totalWarnings}</div>
        <div class="stat-label">警告総数</div>
      </div>
    </div>

    <h2>⚠️ 重大エラー</h2>
    ${stats.criticalErrors.length > 0 ? `
      <table>
        <thead>
          <tr>
            <th>商品名</th>
            <th>フィールド</th>
            <th>エラー内容</th>
            <th>重要度</th>
          </tr>
        </thead>
        <tbody>
          ${stats.criticalErrors.map(error => `
            <tr>
              <td>${error.productName}</td>
              <td><code>${error.field}</code></td>
              <td>${error.message}</td>
              <td><span class="badge badge-critical">CRITICAL</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p class="success">重大エラーはありません ✓</p>'}

    <h2>📝 詳細結果</h2>
    <table>
      <thead>
        <tr>
          <th>商品名</th>
          <th>エラー数</th>
          <th>警告数</th>
          <th>ステータス</th>
        </tr>
      </thead>
      <tbody>
        ${results.slice(0, 50).map(r => `
          <tr>
            <td>${r.productName}</td>
            <td>${r.errorCount > 0 ? `<span style="color: red; font-weight: bold;">${r.errorCount}</span>` : '0'}</td>
            <td>${r.warningCount > 0 ? `<span style="color: orange; font-weight: bold;">${r.warningCount}</span>` : '0'}</td>
            <td>${r.errorCount === 0 && r.warningCount === 0 ?
              '<span style="color: green;">✓ 正常</span>' :
              '<span style="color: red;">要確認</span>'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${results.length > 50 ? `<p style="color: #999;">... 他 ${results.length - 50} 件</p>` : ''}

    <h2>🔧 推奨アクション</h2>
    <ol>
      <li>重大エラーのある商品のデータを手動で修正</li>
      <li><code>npm run calculate:tier-ranks</code> でランクを再計算</li>
      <li><code>npm run validate:ranks</code> で再検証</li>
      <li>必要に応じて <code>--fix</code> オプションで自動修正</li>
    </ol>
  </div>
</body>
</html>`;

  return html;
}

/**
 * メイン処理
 */
async function main() {
  log.section('ランク整合性検証開始');

  try {
    // 商品データ取得
    log.info('商品データを取得中...');
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        priceJPY,
        tierRatings,
        evidenceLevel,
        scores,
        ingredientAmount,
        servingsPerDay,
        servingsPerContainer,
        references,
        warnings,
        thirdPartyTested,
        _updatedAt,
        lastCalculatedAt
      }
    `);

    log.success(`${products.length}件の商品を取得`);

    // 検証実行
    log.section('検証実行中');
    const results = [];
    const stats = {
      totalProducts: products.length,
      validProducts: 0,
      totalErrors: 0,
      totalWarnings: 0,
      criticalErrors: []
    };

    for (const product of products) {
      log.verbose(`検証中: ${product.name}`);

      const issues = validateProduct(product);
      const errorCount = issues.errors.length;
      const warningCount = issues.warnings.length;

      if (errorCount === 0 && warningCount === 0) {
        stats.validProducts++;
      }

      stats.totalErrors += errorCount;
      stats.totalWarnings += warningCount;

      // 重大エラーを収集
      issues.errors.forEach(error => {
        if (error.severity === 'critical') {
          stats.criticalErrors.push({
            productName: product.name,
            productId: product._id,
            field: error.field,
            message: error.message
          });
        }
      });

      results.push({
        productId: product._id,
        productName: product.name,
        errorCount,
        warningCount,
        issues
      });
    }

    // 結果表示
    log.section('検証結果');
    log.info(`総商品数: ${stats.totalProducts}`);
    log.success(`正常: ${stats.validProducts} (${((stats.validProducts / stats.totalProducts) * 100).toFixed(1)}%)`);

    if (stats.totalErrors > 0) {
      log.error(`エラー総数: ${stats.totalErrors}`);
    }

    if (stats.totalWarnings > 0) {
      log.warning(`警告総数: ${stats.totalWarnings}`);
    }

    if (stats.criticalErrors.length > 0) {
      log.section('重大エラー（要対応）');
      stats.criticalErrors.forEach(error => {
        log.error(`${error.productName}: ${error.field} - ${error.message}`);
      });
    }

    // 自動修正
    if (shouldFix) {
      log.section('自動修正');
      let fixCount = 0;

      for (const result of results) {
        if (result.issues.warnings.length > 0) {
          const fixes = {};

          // 警告の中で修正可能なものを処理
          result.issues.warnings.forEach(warning => {
            if (warning.suggestion && warning.field === 'evidenceLevel') {
              fixes.evidenceLevel = result.issues.warnings.find(w => w.field === 'evidenceLevel')?.expectedValue;
            }
          });

          if (Object.keys(fixes).length > 0) {
            log.verbose(`修正中: ${result.productName}`);
            const fixResult = await autoFixProduct(result.productId, fixes);
            if (fixResult.success) {
              fixCount++;
              log.success(`✓ ${result.productName} を修正`);
            } else {
              log.error(`✗ ${result.productName} の修正に失敗: ${fixResult.error}`);
            }
          }
        }
      }

      log.success(`${fixCount}件の商品を自動修正しました`);
    }

    // レポート生成
    if (shouldGenerateReport) {
      log.section('レポート生成');

      const reportHTML = generateHTMLReport(results, stats);
      const reportPath = path.join(process.cwd(), 'reports', `rank-integrity-${Date.now()}.html`);

      await fs.mkdir(path.dirname(reportPath), { recursive: true });
      await fs.writeFile(reportPath, reportHTML);

      log.success(`レポートを生成しました: ${reportPath}`);
    }

    // 終了メッセージ
    if (stats.totalErrors > 0 || stats.totalWarnings > 0) {
      log.section('次のステップ');

      if (!shouldFix) {
        log.info('自動修正を実行するには --fix オプションを使用してください');
      }

      if (!shouldGenerateReport) {
        log.info('詳細レポートを生成するには --report オプションを使用してください');
      }

      log.info('ランクを再計算するには: npm run calculate:tier-ranks');
    }

    process.exit(stats.criticalErrors.length > 0 ? 1 : 0);

  } catch (error) {
    log.error(`エラーが発生しました: ${error.message}`);
    if (isVerbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// 実行
main();