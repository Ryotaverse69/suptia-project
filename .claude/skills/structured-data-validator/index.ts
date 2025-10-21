#!/usr/bin/env node

/**
 * Structured Data Validator - エントリーポイント
 *
 * 使用例:
 * npx tsx .claude/skills/structured-data-validator/index.ts --target "test-structured-data.json"
 * npx tsx .claude/skills/structured-data-validator/index.ts --target "apps/web/src/app/**\/*.tsx" --mode file
 */

import * as fs from 'fs';
import { validateStructuredData } from './validators/schema-validator';
import { ValidationReport, ValidationResult, StructuredData } from './types';

interface CLIOptions {
  target: string;
  mode: 'url' | 'file';
  format: 'console' | 'json' | 'markdown';
  save?: string;
}

/**
 * CLI引数をパース
 */
const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    target: '',
    mode: 'file',
    format: 'console',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--target':
      case '-t':
        options.target = args[++i];
        break;
      case '--mode':
      case '-m':
        options.mode = args[++i] as 'url' | 'file';
        break;
      case '--format':
      case '-f':
        options.format = args[++i] as 'console' | 'json' | 'markdown';
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
        if (!options.target) {
          options.target = args[i];
        }
        break;
    }
  }

  if (!options.target) {
    console.error('❌ Error: --target is required');
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
Structured Data Validator - JSON-LD構造化データ検証ツール

使用法:
  npx tsx .claude/skills/structured-data-validator/index.ts --target <path> [options]

オプション:
  --target, -t <path>         検証対象のファイルパス（必須）
  --mode, -m <mode>           検証モード（url/file）デフォルト: file
  --format, -f <format>       出力フォーマット（console/json/markdown）デフォルト: console
  --save, -o <path>           レポートをファイルに保存
  --help, -h                  ヘルプを表示

使用例:
  # JSONファイルを検証
  npx tsx .claude/skills/structured-data-validator/index.ts --target "product-schema.json"

  # Markdownレポート生成
  npx tsx .claude/skills/structured-data-validator/index.ts --target "product-schema.json" --format markdown --save report.md
`);
};

/**
 * JSONファイルから構造化データを読み取る
 */
const loadStructuredData = (filePath: string): StructuredData[] => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // 配列かどうかチェック
    if (Array.isArray(data)) {
      return data;
    } else if (data['@type']) {
      return [data];
    } else {
      console.error(`❌ ファイル "${filePath}" には有効な構造化データが含まれていません`);
      return [];
    }
  } catch (error) {
    console.error(`❌ ファイル "${filePath}" の読み取りに失敗しました:`, error);
    return [];
  }
};

/**
 * レポートを生成
 */
const generateReport = (results: ValidationResult[]): ValidationReport => {
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const averageScore = results.length > 0
    ? results.reduce((sum, r) => sum + r.score, 0) / results.length
    : 0;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  const overallStatus =
    totalErrors === 0 && averageScore >= 70
      ? 'pass'
      : totalErrors > 0
      ? 'fail'
      : 'warning';

  return {
    timestamp: new Date().toISOString(),
    targetCount: results.length,
    results,
    summary: {
      totalErrors,
      totalWarnings,
      averageScore,
      passedCount,
      failedCount,
    },
    overallStatus,
  };
};

/**
 * コンソール出力
 */
const printConsoleReport = (report: ValidationReport) => {
  const RESET = '\x1b[0m';
  const RED = '\x1b[31m';
  const YELLOW = '\x1b[33m';
  const GREEN = '\x1b[32m';
  const BOLD = '\x1b[1m';

  console.log(`\n${BOLD}┌─────────────────────────────────────────────────────────┐${RESET}`);
  console.log(`${BOLD}│         Structured Data Validator Report               │${RESET}`);
  console.log(`${BOLD}├─────────────────────────────────────────────────────────┤${RESET}`);
  console.log(`${BOLD}│ Validated: ${report.targetCount} schema(s)                              │${RESET}`);
  console.log(`${BOLD}│ Errors: ${RED}${report.summary.totalErrors}${RESET}${BOLD}                                            │${RESET}`);
  console.log(`${BOLD}│ Warnings: ${YELLOW}${report.summary.totalWarnings}${RESET}${BOLD}                                          │${RESET}`);
  console.log(`${BOLD}│ Average Score: ${report.summary.averageScore.toFixed(1)}/100                        │${RESET}`);
  console.log(`${BOLD}│ Status: ${report.overallStatus === 'pass' ? `${GREEN}PASS ✅${RESET}${BOLD}` : report.overallStatus === 'warning' ? `${YELLOW}WARNING ⚠️${RESET}${BOLD}` : `${RED}FAIL ❌${RESET}${BOLD}`}                                   │${RESET}`);
  console.log(`${BOLD}└─────────────────────────────────────────────────────────┘${RESET}\n`);

  report.results.forEach((result, index) => {
    console.log(`${BOLD}[${index + 1}] Schema Type: ${result.schemaType}${RESET}`);
    console.log(`    Score: ${result.score}/100 ${result.passed ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`}`);

    if (result.errors.length > 0) {
      console.log(`    ${RED}${BOLD}Errors (${result.errors.length}):${RESET}`);
      result.errors.forEach((error) => {
        console.log(`      ${RED}• ${error.field}: ${error.message}${RESET}`);
        if (error.suggestion) {
          console.log(`        💡 ${error.suggestion}`);
        }
      });
    }

    if (result.warnings.length > 0) {
      console.log(`    ${YELLOW}${BOLD}Warnings (${result.warnings.length}):${RESET}`);
      result.warnings.forEach((warning) => {
        console.log(`      ${YELLOW}• ${warning.field}: ${warning.message}${RESET}`);
        if (warning.suggestion) {
          console.log(`        💡 ${warning.suggestion}`);
        }
      });
    }
    console.log('');
  });

  console.log(`${BOLD}───────────────────────────────────────────────────────${RESET}`);
  if (report.overallStatus === 'pass') {
    console.log(`${GREEN}${BOLD}✅ すべての構造化データが schema.org に準拠しています！${RESET}\n`);
  } else if (report.overallStatus === 'warning') {
    console.log(`${YELLOW}${BOLD}⚠️ いくつかの推奨フィールドが不足しています。${RESET}\n`);
  } else {
    console.log(`${RED}${BOLD}❌ 構造化データに問題があります。修正してください。${RESET}\n`);
  }
};

/**
 * メイン処理
 */
const main = () => {
  const options = parseArgs();

  console.log('🔍 Structured Data Validator を実行中...\n');
  console.log(`Target: ${options.target}`);
  console.log(`Mode: ${options.mode}\n`);

  // 構造化データを読み込む
  const structuredDataList = loadStructuredData(options.target);

  if (structuredDataList.length === 0) {
    console.error('❌ 検証対象の構造化データが見つかりません');
    process.exit(1);
  }

  // 検証実行
  const results = structuredDataList.map((data) =>
    validateStructuredData(data, options.target)
  );

  // レポート生成
  const report = generateReport(results);

  // 出力
  if (options.format === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printConsoleReport(report);
  }

  // ファイル保存
  if (options.save) {
    const content = options.format === 'json'
      ? JSON.stringify(report, null, 2)
      : JSON.stringify(report, null, 2);
    fs.writeFileSync(options.save, content, 'utf-8');
    console.log(`📄 Report saved to: ${options.save}\n`);
  }

  // 終了コード
  process.exit(report.overallStatus === 'fail' ? 1 : 0);
};

main();
