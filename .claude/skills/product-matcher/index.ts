#!/usr/bin/env node

/**
 * Product Matcher - エントリーポイント
 *
 * 使用例:
 * npx tsx .claude/skills/product-matcher/index.ts --source amazon-products.json --target rakuten-products.json
 * npx tsx .claude/skills/product-matcher/index.ts --source amazon.json --target rakuten.json --threshold 0.90
 */

import * as fs from 'fs';
import { Product, MatchReport, MatchStrategy } from './types';
import { matchProducts, getUnmatchedProducts } from './matchers/matcher';
import { calculateStatistics, determineOverallStatus } from './scorers/statistics';
import { outputReport, OutputFormat } from './reporters/reporter';

interface CLIOptions {
  source: string;
  target: string;
  threshold: number;
  strategy: MatchStrategy;
  format: OutputFormat;
  save?: string;
  generateReviewList: boolean;
}

/**
 * CLI引数をパース
 */
const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    source: '',
    target: '',
    threshold: 0.92,
    strategy: 'auto',
    format: 'console',
    generateReviewList: true,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':
      case '-s':
        options.source = args[++i];
        break;
      case '--target':
      case '-t':
        options.target = args[++i];
        break;
      case '--threshold':
        options.threshold = parseFloat(args[++i]);
        break;
      case '--strategy':
        options.strategy = args[++i] as MatchStrategy;
        break;
      case '--format':
      case '-f':
        options.format = args[++i] as OutputFormat;
        break;
      case '--save':
      case '-o':
        options.save = args[++i];
        break;
      case '--no-review-list':
        options.generateReviewList = false;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        break;
    }
  }

  if (!options.source || !options.target) {
    console.error('❌ Error: --source and --target are required');
    printHelp();
    process.exit(1);
  }

  return options;
};

/**
 * ヘルプを表示
 */
const printHelp = () => {
  console.log(`
Product Matcher - 複数ECサイトの商品を正確にマッチング

使用法:
  npx tsx .claude/skills/product-matcher/index.ts --source <file> --target <file> [options]

オプション:
  --source, -s <file>     マッチング元の商品データファイル（JSON）（必須）
  --target, -t <file>     マッチング先の商品データファイル（JSON）（必須）
  --threshold <number>    類似度の閾値（0.0-1.0）デフォルト: 0.92
  --strategy <strategy>   マッチング戦略（auto/jan-only/asin-only/title-only/all）
                          デフォルト: auto
  --format, -f <format>   出力フォーマット（console/json/markdown）デフォルト: console
  --save, -o <path>       レポートをファイルに保存
  --no-review-list        未マッチ商品のレビューリストを生成しない
  --help, -h              ヘルプを表示

使用例:
  # 基本的な使い方
  npx tsx .claude/skills/product-matcher/index.ts \\
    --source amazon-products.json \\
    --target rakuten-products.json

  # 閾値を下げてより多くマッチング
  npx tsx .claude/skills/product-matcher/index.ts \\
    --source amazon.json \\
    --target rakuten.json \\
    --threshold 0.85

  # Markdownレポート生成
  npx tsx .claude/skills/product-matcher/index.ts \\
    --source amazon.json \\
    --target rakuten.json \\
    --format markdown \\
    --save match-report.md
`);
};

/**
 * JSONファイルから商品データを読み込む
 */
const loadProducts = (filePath: string): Product[] => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // 配列かどうかチェック
    if (Array.isArray(data)) {
      return data as Product[];
    } else {
      console.error(`❌ ファイル "${filePath}" は商品データの配列ではありません`);
      return [];
    }
  } catch (error) {
    console.error(`❌ ファイル "${filePath}" の読み取りに失敗しました:`, error);
    return [];
  }
};

/**
 * 未マッチ商品のレビューリストを保存
 */
const saveReviewList = (report: MatchReport) => {
  if (report.unmatched.length === 0) {
    console.log('✅ すべての商品がマッチしました。レビューリストは不要です。');
    return;
  }

  const reviewListPath = `unmatched-review-list-${Date.now()}.json`;
  const reviewList = report.unmatched.map((u) => ({
    product: u.product,
    reason: u.reason,
    candidates: u.candidates,
  }));

  try {
    fs.writeFileSync(reviewListPath, JSON.stringify(reviewList, null, 2), 'utf-8');
    console.log(`\n📋 未マッチ商品のレビューリストを保存しました: ${reviewListPath}`);
  } catch (error) {
    console.error(`Failed to save review list:`, error);
  }
};

/**
 * メイン処理
 */
const main = () => {
  const options = parseArgs();

  console.log('🔍 Product Matcher を実行中...\n');
  console.log(`Source: ${options.source}`);
  console.log(`Target: ${options.target}`);
  console.log(`Threshold: ${options.threshold}`);
  console.log(`Strategy: ${options.strategy}\n`);

  // 商品データを読み込む
  const sourceProducts = loadProducts(options.source);
  const targetProducts = loadProducts(options.target);

  if (sourceProducts.length === 0 || targetProducts.length === 0) {
    console.error('❌ 商品データが見つかりません');
    process.exit(1);
  }

  console.log(`Loaded ${sourceProducts.length} source products`);
  console.log(`Loaded ${targetProducts.length} target products\n`);

  // マッチング実行
  const matches = matchProducts(
    sourceProducts,
    targetProducts,
    options.threshold,
    options.strategy
  );

  // 未マッチ商品を取得
  const unmatched = getUnmatchedProducts(
    sourceProducts,
    targetProducts,
    matches,
    options.threshold
  );

  // 統計計算
  const statistics = calculateStatistics(sourceProducts, targetProducts, matches);
  const overallStatus = determineOverallStatus(statistics);

  // レポート生成
  const report: MatchReport = {
    timestamp: new Date().toISOString(),
    source: options.source,
    target: options.target,
    strategy: options.strategy,
    threshold: options.threshold,
    matches,
    unmatched,
    statistics,
    overallStatus,
  };

  // 出力
  outputReport(report, options.format, options.save);

  // 未マッチ商品のレビューリスト生成
  if (options.generateReviewList && unmatched.length > 0) {
    saveReviewList(report);
  }

  // 終了コード
  process.exit(overallStatus === 'needs-review' ? 1 : 0);
};

main();
