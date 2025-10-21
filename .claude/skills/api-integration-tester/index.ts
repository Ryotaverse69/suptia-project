#!/usr/bin/env node

/**
 * API Integration Tester - エントリーポイント
 *
 * 使用例:
 * npx tsx .claude/skills/api-integration-tester/index.ts --provider amazon --test-type auth
 * npx tsx .claude/skills/api-integration-tester/index.ts --provider rakuten --test-type all --test-product rakuten:item-123
 * npx tsx .claude/skills/api-integration-tester/index.ts --provider all --generate-mock --mock-count 20
 */

import { AmazonAdapter } from './adapters/amazon-adapter';
import { RakutenAdapter } from './adapters/rakuten-adapter';
import { calculateQualityScore, calculateResponseTimeScore } from './validators/quality-validator';
import { outputReport, OutputFormat } from './reporters/reporter';
import { TestReport, APIProvider, TestType } from './types';

interface CLIOptions {
  provider: 'amazon' | 'rakuten' | 'all';
  testType: TestType;
  testProduct?: string;
  generateMock: boolean;
  mockCount: number;
  format: OutputFormat;
  save?: string;
}

/**
 * CLI引数をパース
 */
const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    provider: 'amazon',
    testType: 'all',
    generateMock: false,
    mockCount: 10,
    format: 'console',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--provider':
      case '-p':
        options.provider = args[++i] as 'amazon' | 'rakuten' | 'all';
        break;
      case '--test-type':
      case '-t':
        options.testType = args[++i] as TestType;
        break;
      case '--test-product':
        options.testProduct = args[++i];
        break;
      case '--generate-mock':
      case '-m':
        options.generateMock = true;
        break;
      case '--mock-count':
        options.mockCount = parseInt(args[++i], 10);
        break;
      case '--format':
      case '-f':
        options.format = args[++i] as OutputFormat;
        break;
      case '--save':
      case '-o':
        options.save = args[++i];
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

  return options;
};

/**
 * ヘルプを表示
 */
const printHelp = () => {
  console.log(`
API Integration Tester - Amazon PA-API・楽天API連携テスター

使用法:
  npx tsx .claude/skills/api-integration-tester/index.ts --provider <provider> [options]

オプション:
  --provider, -p <provider>   テスト対象のAPIプロバイダー（amazon/rakuten/all）
  --test-type, -t <type>      テストタイプ（auth/fetch/quality/rate-limit/all）
                              デフォルト: all
  --test-product <id>         テスト用の商品ID（ASIN、楽天商品コードなど）
  --generate-mock, -m         モックデータを生成
  --mock-count <count>        生成するモックデータの数（デフォルト: 10）
  --format, -f <format>       出力フォーマット（console/json/markdown）
                              デフォルト: console
  --save, -o <path>           レポートをファイルに保存
  --help, -h                  ヘルプを表示

使用例:
  # Amazon PA-API の認証テスト
  npx tsx .claude/skills/api-integration-tester/index.ts --provider amazon --test-type auth

  # 楽天API の全テスト
  npx tsx .claude/skills/api-integration-tester/index.ts --provider rakuten --test-type all

  # 商品データ取得テスト
  npx tsx .claude/skills/api-integration-tester/index.ts --provider amazon --test-type fetch --test-product B000123456

  # モックデータ生成（20件）
  npx tsx .claude/skills/api-integration-tester/index.ts --provider amazon --generate-mock --mock-count 20

  # Markdownレポート生成
  npx tsx .claude/skills/api-integration-tester/index.ts --provider all --format markdown --save api-test-report.md
`);
};

/**
 * 単一プロバイダーのテスト実行
 */
const runTest = async (
  provider: APIProvider,
  testType: TestType,
  testProduct?: string
): Promise<TestReport> => {
  const adapter = provider === 'amazon' ? new AmazonAdapter() : new RakutenAdapter();

  const report: TestReport = {
    provider,
    timestamp: new Date().toISOString(),
    testsRun: {
      auth: testType === 'auth' || testType === 'all',
      fetch: testType === 'fetch' || testType === 'all',
      quality: testType === 'quality' || testType === 'all',
      rateLimit: testType === 'rate-limit' || testType === 'all',
    },
    results: {},
    overallStatus: 'pass',
    summary: '',
  };

  // 認証テスト
  if (report.testsRun.auth) {
    report.results.auth = await adapter.testAuth();
    if (!report.results.auth.success) {
      report.overallStatus = 'fail';
    }
  }

  // データ取得テスト
  if (report.testsRun.fetch) {
    const productId =
      testProduct || (provider === 'amazon' ? 'B000MOCK123' : 'rakuten-mock-123');
    report.results.fetch = await adapter.testFetch(productId);

    if (!report.results.fetch.success) {
      report.overallStatus = 'fail';
    }

    // 品質スコア計算
    if (report.testsRun.quality && report.results.fetch.data) {
      const qualityScore = calculateQualityScore(
        provider,
        productId,
        report.results.fetch.data
      );

      // レスポンスタイムスコアを追加
      qualityScore.breakdown.responseTime = calculateResponseTimeScore(
        report.results.fetch.responseTime
      );
      qualityScore.totalScore =
        Object.values(qualityScore.breakdown).reduce((sum, score) => sum + score, 0);

      report.results.quality = qualityScore;

      if (qualityScore.totalScore < 70) {
        report.overallStatus = report.overallStatus === 'fail' ? 'fail' : 'warning';
      }
    }
  }

  // レート制限ステータス
  if (report.testsRun.rateLimit) {
    report.results.rateLimit = adapter.getRateLimitStatus();
  }

  // サマリー生成
  if (report.overallStatus === 'pass') {
    report.summary = `✅ すべてのテストに合格しました（${provider.toUpperCase()}）`;
  } else if (report.overallStatus === 'warning') {
    report.summary = `⚠️ いくつかの警告があります（${provider.toUpperCase()}）`;
  } else {
    report.summary = `❌ テストに失敗しました（${provider.toUpperCase()}）`;
  }

  return report;
};

/**
 * モックデータ生成
 */
const generateMockData = (provider: APIProvider, count: number) => {
  const adapter = provider === 'amazon' ? new AmazonAdapter() : new RakutenAdapter();
  const mockData = adapter.generateMockData(count);

  console.log(`\n🎲 モックデータを ${count} 件生成しました（${provider.toUpperCase()}）\n`);
  console.log(JSON.stringify(mockData, null, 2));
};

/**
 * メイン処理
 */
const main = async () => {
  try {
    const options = parseArgs();

    console.log('🔍 API Integration Tester を実行中...\n');
    console.log(`Provider: ${options.provider}`);
    console.log(`Test Type: ${options.testType}`);
    console.log('');

    // モックデータ生成モード
    if (options.generateMock) {
      if (options.provider === 'all') {
        generateMockData('amazon', options.mockCount);
        generateMockData('rakuten', options.mockCount);
      } else {
        generateMockData(options.provider, options.mockCount);
      }
      process.exit(0);
    }

    // テスト実行
    if (options.provider === 'all') {
      const amazonReport = await runTest('amazon', options.testType, options.testProduct);
      outputReport(amazonReport, options.format, options.save ? `amazon-${options.save}` : null);

      const rakutenReport = await runTest('rakuten', options.testType, options.testProduct);
      outputReport(rakutenReport, options.format, options.save ? `rakuten-${options.save}` : null);

      const overallFail =
        amazonReport.overallStatus === 'fail' || rakutenReport.overallStatus === 'fail';
      process.exit(overallFail ? 1 : 0);
    } else {
      const report = await runTest(options.provider, options.testType, options.testProduct);
      outputReport(report, options.format, options.save);

      process.exit(report.overallStatus === 'fail' ? 1 : 0);
    }
  } catch (error) {
    console.error('❌ API Integration Tester でエラーが発生しました:');
    console.error(error);
    process.exit(1);
  }
};

// 実行
main();
