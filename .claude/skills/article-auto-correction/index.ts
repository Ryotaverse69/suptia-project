#!/usr/bin/env node
/**
 * 記事自動修正ツール
 *
 * 機能:
 * 1. 薬機法NGワードの自動置換
 * 2. エビデンスレベルの自動判定
 * 3. 文字数拡張（GPT統合準備済み）
 *
 * Usage:
 *   npx tsx .claude/skills/article-auto-correction/index.ts <file.json>
 *   npx tsx .claude/skills/article-auto-correction/index.ts --batch "*.json"
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fixArticleCompliance } from './fixers/compliance-fixer';
import { addEvidenceLevelToArticle, getEvidenceLevelDescription } from './fixers/evidence-assigner';
import { expandArticleContent } from './fixers/content-expander';

interface CliOptions {
  mode: 'single' | 'batch';
  files: string[];
  skipExpansion: boolean;
  dryRun: boolean;
  output?: string;
}

/**
 * CLIオプションをパース
 */
const parseArgs = (args: string[]): CliOptions => {
  const options: CliOptions = {
    mode: 'single',
    files: [],
    skipExpansion: true, // 現在はGPT APIなしなのでデフォルトでスキップ
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--batch') {
      options.mode = 'batch';
    } else if (arg === '--with-expansion') {
      options.skipExpansion = false;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
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
 * 単一ファイルを修正
 */
const fixArticle = async (
  filePath: string,
  options: CliOptions
): Promise<{ fixed: any; changes: { compliance: number; evidenceAdded: boolean; expanded: boolean } }> => {
  // ファイル読み込み
  const fileContent = await fs.readFile(filePath, 'utf-8');
  let data = JSON.parse(fileContent);

  const changes = {
    compliance: 0,
    evidenceAdded: false,
    expanded: false,
  };

  // 1. 薬機法NGワード修正
  const { fixed: complianceFixed, totalChanges } = fixArticleCompliance(data);
  data = complianceFixed;
  changes.compliance = totalChanges;

  // 2. エビデンスレベル追加
  if (!data.evidenceLevel) {
    data = addEvidenceLevelToArticle(data);
    changes.evidenceAdded = true;
  }

  // 3. 文字数拡張（オプション）
  if (!options.skipExpansion) {
    data = await expandArticleContent(data);
    changes.expanded = true;
  }

  return { fixed: data, changes };
};

/**
 * ファイルを保存
 */
const saveArticle = async (filePath: string, data: any, dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log(`[DRY RUN] Would save to: ${filePath}`);
    return;
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

/**
 * メイン実行関数
 */
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  Single file:  npx tsx .claude/skills/article-auto-correction/index.ts <file.json>');
    console.log('  Batch mode:   npx tsx .claude/skills/article-auto-correction/index.ts --batch "**/*-article.json"');
    console.log('');
    console.log('Options:');
    console.log('  --with-expansion    Enable GPT content expansion (requires API key)');
    console.log('  --dry-run           Show changes without saving');
    console.log('  --output, -o        Save to specific file');
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

  console.log(`🔧 Auto-correcting ${files.length} file(s)...`);
  console.log('');

  let totalCompliance = 0;
  let totalEvidenceAdded = 0;
  const results: Array<{ file: string; compliance: number; evidenceAdded: boolean }> = [];

  for (const file of files) {
    try {
      console.log(`📄 Processing: ${path.basename(file)}`);

      const { fixed, changes } = await fixArticle(file, options);

      // 保存
      await saveArticle(file, fixed, options.dryRun);

      // 統計
      totalCompliance += changes.compliance;
      if (changes.evidenceAdded) totalEvidenceAdded++;

      results.push({
        file: path.basename(file),
        compliance: changes.compliance,
        evidenceAdded: changes.evidenceAdded,
      });

      // 変更内容を表示
      if (changes.compliance > 0) {
        console.log(`  ✅ 薬機法NGワード修正: ${changes.compliance}箇所`);
      }
      if (changes.evidenceAdded) {
        console.log(`  ✅ エビデンスレベル追加: ${fixed.evidenceLevel} (${getEvidenceLevelDescription(fixed.evidenceLevel)})`);
      }
      if (changes.expanded) {
        console.log(`  ✅ 文字数拡張: 完了`);
      }
      console.log('');
    } catch (error) {
      console.error(`  ❌ Error processing ${file}:`, error);
    }
  }

  // サマリー
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 Auto-Correction Summary');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Files: ${files.length}`);
  console.log(`Compliance Fixes: ${totalCompliance} 箇所`);
  console.log(`Evidence Levels Added: ${totalEvidenceAdded} 件`);
  console.log('');

  if (options.dryRun) {
    console.log('⚠️  DRY RUN MODE - No files were actually modified');
  } else {
    console.log('✅ All files have been auto-corrected!');
    console.log('');
    console.log('🔍 Next step: Run validator to check quality');
    console.log('   npx tsx .claude/skills/sanity-ingredient-validator/index.ts --batch "*-article.json"');
  }
};

// 実行
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
