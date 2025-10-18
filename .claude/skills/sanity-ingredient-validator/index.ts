#!/usr/bin/env node
/**
 * Sanity Ingredient Validator - Entry Point
 *
 * Usage:
 *   npx tsx .claude/skills/sanity-ingredient-validator/index.ts <file.json>
 *   npx tsx .claude/skills/sanity-ingredient-validator/index.ts --batch "*.json"
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { validateFile, validateBatch, printReport, saveReport } from './validator';
import { generateBatchSummary } from './reporter';

interface CliOptions {
  mode: 'single' | 'batch';
  files: string[];
  showOnlyErrors: boolean;
  output?: string;
}

/**
 * CLIオプションをパース
 */
const parseArgs = (args: string[]): CliOptions => {
  const options: CliOptions = {
    mode: 'single',
    files: [],
    showOnlyErrors: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--batch') {
      options.mode = 'batch';
    } else if (arg === '--errors-only') {
      options.showOnlyErrors = true;
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (!arg.startsWith('--')) {
      options.files.push(arg);
    }
  }

  return options;
};

/**
 * ファイルパターンからファイルリストを取得
 */
const expandFilePatterns = async (patterns: string[]): Promise<string[]> => {
  const files: string[] = [];

  for (const pattern of patterns) {
    // パターンマッチング
    if (pattern.includes('*')) {
      const matches = await glob(pattern, {
        ignore: ['node_modules/**', '.next/**', 'dist/**'],
      });
      files.push(...matches);
    } else {
      files.push(pattern);
    }
  }

  return files;
};

/**
 * メイン実行関数
 */
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  Single file:  npx tsx .claude/skills/sanity-ingredient-validator/index.ts <file.json>');
    console.log('  Batch mode:   npx tsx .claude/skills/sanity-ingredient-validator/index.ts --batch "**/*-article.json"');
    console.log('');
    console.log('Options:');
    console.log('  --errors-only    Show only files with errors');
    console.log('  --output, -o     Save report to file');
    process.exit(1);
  }

  const options = parseArgs(args);

  if (options.files.length === 0) {
    console.error('Error: No files specified');
    process.exit(1);
  }

  // ファイルリスト展開
  const files = await expandFilePatterns(options.files);

  if (files.length === 0) {
    console.error('Error: No files found matching the pattern');
    process.exit(1);
  }

  console.log(`🔍 Validating ${files.length} file(s)...\n`);

  if (options.mode === 'single' || files.length === 1) {
    // シングルモード
    const report = await validateFile(files[0], { showOnlyErrors: options.showOnlyErrors });
    printReport(report, options.showOnlyErrors);

    // レポート保存
    if (options.output) {
      await saveReport(report, options.output);
      console.log(`📄 Report saved to: ${options.output}`);
    } else {
      // デフォルトでlogsディレクトリに保存
      const logsDir = path.join(process.cwd(), 'logs');
      await fs.mkdir(logsDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(logsDir, `validation-${timestamp}.json`);
      await saveReport(report, reportPath);
      console.log(`📄 Report saved to: ${reportPath}`);
    }

    // 終了コード
    process.exit(report.status === 'error' ? 1 : 0);
  } else {
    // バッチモード
    const reports = await validateBatch(files, { showOnlyErrors: options.showOnlyErrors });

    reports.forEach((report) => {
      printReport(report, options.showOnlyErrors);
    });

    // サマリー生成
    const summary = generateBatchSummary(reports);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 Batch Validation Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Files: ${summary.totalFiles}`);
    console.log(`Pass Rate: ${summary.passRate}`);
    console.log('');
    console.log('Grade Distribution:');
    console.log(`  S (90+):  ${summary.summary.S} files`);
    console.log(`  A (80+):  ${summary.summary.A} files`);
    console.log(`  B (70+):  ${summary.summary.B} files`);
    console.log(`  C (60+):  ${summary.summary.C} files`);
    console.log(`  D (<60):  ${summary.summary.D} files`);
    console.log('');
    console.log(`⚠️  Critical Issues: ${summary.criticalIssues}`);

    // サマリー保存
    const logsDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logsDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const summaryPath = path.join(logsDir, `summary-${timestamp}.json`);
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`📄 Summary saved to: ${summaryPath}`);

    // 終了コード
    const hasErrors = reports.some((r) => r.status === 'error');
    process.exit(hasErrors ? 1 : 0);
  }
};

// 実行
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
