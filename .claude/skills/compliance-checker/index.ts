#!/usr/bin/env node

/**
 * Compliance Checker - エントリーポイント
 *
 * 使用例:
 * npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src/**\/*.tsx"
 * npx tsx .claude/skills/compliance-checker/index.ts --target "*-article.json" --severity critical
 * npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src" --format markdown --save report.md
 */

import { checkCompliance, CheckOptions } from './checker';
import { outputReport, OutputFormat } from './reporter';

interface CLIOptions {
  target: string | string[];
  fileTypes: string[];
  severity: 'critical' | 'warning' | 'all';
  format: OutputFormat;
  save?: string;
  exclude?: string[];
}

/**
 * CLI引数をパース
 */
const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    target: '',
    fileTypes: ['tsx', 'ts', 'json', 'md'],
    severity: 'all',
    format: 'console',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--target':
      case '-t':
        options.target = args[++i];
        break;
      case '--file-types':
      case '-f':
        options.fileTypes = args[++i].split(',');
        break;
      case '--severity':
      case '-s':
        options.severity = args[++i] as 'critical' | 'warning' | 'all';
        break;
      case '--format':
        options.format = args[++i] as OutputFormat;
        break;
      case '--save':
      case '-o':
        options.save = args[++i];
        break;
      case '--exclude':
      case '-e':
        options.exclude = args[++i].split(',');
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        // オプションなしの場合はtargetとして扱う
        if (!options.target) {
          options.target = args[i];
        }
        break;
    }
  }

  // targetが指定されていない場合はエラー
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
Compliance Checker - 薬機法・景品表示法コンプライアンスチェッカー

使用法:
  npx tsx .claude/skills/compliance-checker/index.ts --target <path> [options]

オプション:
  --target, -t <path>         チェック対象のファイル/ディレクトリ（必須、glob対応）
  --file-types, -f <types>    チェック対象のファイルタイプ（カンマ区切り）
                              デフォルト: tsx,ts,json,md
  --severity, -s <level>      表示する違反の重要度（critical/warning/all）
                              デフォルト: all
  --format <format>           出力フォーマット（console/json/markdown）
                              デフォルト: console
  --save, -o <path>           レポートをファイルに保存
  --exclude, -e <patterns>    除外パターン（カンマ区切り）
  --help, -h                  ヘルプを表示

使用例:
  # TSXファイルをチェック
  npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src/**/*.tsx"

  # JSON記事ファイルをチェック（Criticalのみ）
  npx tsx .claude/skills/compliance-checker/index.ts --target "*-article.json" --severity critical

  # Markdownレポートを生成
  npx tsx .claude/skills/compliance-checker/index.ts --target "apps/web/src" --format markdown --save report.md

  # 特定のディレクトリを除外
  npx tsx .claude/skills/compliance-checker/index.ts --target "**/*.tsx" --exclude "**/__tests__/**,**/stories/**"
`);
};

/**
 * メイン処理
 */
const main = async () => {
  try {
    const cliOptions = parseArgs();

    console.log('🔍 Compliance Checker を実行中...\n');
    console.log(`Target: ${cliOptions.target}`);
    console.log(`File Types: ${cliOptions.fileTypes.join(', ')}`);
    console.log(`Severity: ${cliOptions.severity}`);
    console.log('');

    // チェック実行
    const checkOptions: CheckOptions = {
      target: cliOptions.target,
      fileTypes: cliOptions.fileTypes,
      severityThreshold: cliOptions.severity,
      excludePatterns: cliOptions.exclude,
    };

    const result = await checkCompliance(checkOptions);

    // レポート出力
    outputReport(result, cliOptions.format, cliOptions.save);

    // 終了コード
    if (!result.passThreshold) {
      process.exit(1); // 失敗
    } else {
      process.exit(0); // 成功
    }
  } catch (error) {
    console.error('❌ Compliance Checker でエラーが発生しました:');
    console.error(error);
    process.exit(1);
  }
};

// 実行
main();
