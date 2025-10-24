#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { z } from 'zod';
import { ComplianceChecker } from './modules/compliance-checker';
import { ContentEnhancer } from './modules/content-enhancer';
import { SEOOptimizer } from './modules/seo-optimizer';
import { InternalLinker } from './modules/internal-linker';
import { SchemaGenerator } from './modules/schema-generator';
import { ReportGenerator } from './modules/report-generator';
import type { OptimizationOptions, OptimizationResult } from './types';

// CLIオプションスキーマ
const OptionsSchema = z.object({
  file: z.union([z.string(), z.array(z.string())]),
  mode: z.enum(['check', 'fix', 'enhance', 'full']).default('full'),
  targetWordCount: z.number().default(5000),
  autoGenerateLinks: z.boolean().default(true),
  expandFAQ: z.boolean().default(true),
  addSchema: z.boolean().default(true),
  complianceLevel: z.enum(['strict', 'standard', 'lenient']).default('strict'),
  backup: z.boolean().default(true),
  output: z.string().optional()
});

class ArticleOptimizer {
  private complianceChecker: ComplianceChecker;
  private contentEnhancer: ContentEnhancer;
  private seoOptimizer: SEOOptimizer;
  private internalLinker: InternalLinker;
  private schemaGenerator: SchemaGenerator;
  private reportGenerator: ReportGenerator;
  private spinner: ora.Ora;

  constructor() {
    this.complianceChecker = new ComplianceChecker();
    this.contentEnhancer = new ContentEnhancer();
    this.seoOptimizer = new SEOOptimizer();
    this.internalLinker = new InternalLinker();
    this.schemaGenerator = new SchemaGenerator();
    this.reportGenerator = new ReportGenerator();
    this.spinner = ora();
  }

  async optimize(filePath: string, options: OptimizationOptions): Promise<OptimizationResult> {
    const startTime = Date.now();
    const results: OptimizationResult = {
      file: filePath,
      originalScore: 0,
      optimizedScore: 0,
      changes: [],
      warnings: [],
      errors: [],
      backup: null,
      duration: 0
    };

    try {
      // 1. ファイル読み込み
      this.spinner.start(`記事を読み込み中: ${path.basename(filePath)}`);
      const content = await fs.readFile(filePath, 'utf-8');
      const article = JSON.parse(content);
      this.spinner.succeed();

      // 2. バックアップ作成
      if (options.backup) {
        const backupPath = filePath.replace('.json', `.backup-${Date.now()}.json`);
        await fs.writeFile(backupPath, content);
        results.backup = backupPath;
        this.spinner.succeed(`バックアップ作成: ${path.basename(backupPath)}`);
      }

      // 3. 初期スコア計算
      results.originalScore = await this.calculateScore(article);

      // 4. モードに応じた処理
      let optimizedArticle = { ...article };

      if (options.mode === 'check') {
        // 検証のみ
        const complianceResult = await this.complianceChecker.check(article, options.complianceLevel);
        results.warnings = complianceResult.warnings;
        results.errors = complianceResult.errors;
      } else {
        // 4.1 薬機法準拠（fix, full）
        if (options.mode === 'fix' || options.mode === 'full') {
          this.spinner.start('薬機法準拠チェック・修正中...');
          const complianceResult = await this.complianceChecker.fixCompliance(optimizedArticle, options.complianceLevel);
          optimizedArticle = complianceResult.article;
          results.changes.push(...complianceResult.changes);
          results.warnings.push(...complianceResult.warnings);
          this.spinner.succeed();
        }

        // 4.2 コンテンツ拡充（enhance, full）
        if (options.mode === 'enhance' || options.mode === 'full') {
          this.spinner.start('コンテンツを拡充中...');
          const enhanceResult = await this.contentEnhancer.enhance(
            optimizedArticle,
            options.targetWordCount,
            options.expandFAQ
          );
          optimizedArticle = enhanceResult.article;
          results.changes.push(...enhanceResult.changes);
          this.spinner.succeed();
        }

        // 4.3 SEO最適化（full）
        if (options.mode === 'full') {
          this.spinner.start('SEO最適化中...');
          const seoResult = await this.seoOptimizer.optimize(optimizedArticle);
          optimizedArticle = seoResult.article;
          results.changes.push(...seoResult.changes);
          this.spinner.succeed();
        }

        // 4.4 内部リンク生成（full）
        if (options.mode === 'full' && options.autoGenerateLinks) {
          this.spinner.start('内部リンクを生成中...');
          const linkResult = await this.internalLinker.generateLinks(optimizedArticle);
          optimizedArticle = linkResult.article;
          results.changes.push(...linkResult.changes);
          this.spinner.succeed();
        }

        // 4.5 構造化データ追加（full）
        if (options.mode === 'full' && options.addSchema) {
          this.spinner.start('構造化データを生成中...');
          const schemaResult = await this.schemaGenerator.generate(optimizedArticle);
          optimizedArticle = schemaResult.article;
          results.changes.push(...schemaResult.changes);
          this.spinner.succeed();
        }

        // 5. 最適化後のスコア計算
        results.optimizedScore = await this.calculateScore(optimizedArticle);

        // 6. ファイル保存
        const outputPath = options.output || filePath;
        await fs.writeFile(outputPath, JSON.stringify(optimizedArticle, null, 2));
        this.spinner.succeed(`最適化完了: ${path.basename(outputPath)}`);
      }

      results.duration = Date.now() - startTime;
      return results;

    } catch (error) {
      this.spinner.fail(`エラー: ${error.message}`);
      results.errors.push(error.message);
      results.duration = Date.now() - startTime;
      return results;
    }
  }

  private async calculateScore(article: any): Promise<number> {
    let score = 0;

    // 基本構造（25点）
    if (article.name && article.nameEn) score += 10;
    if (article.description?.length > 400) score += 10;
    if (article.benefits?.length >= 10) score += 5;

    // 薬機法準拠（30点）
    const complianceResult = await this.complianceChecker.check(article, 'strict');
    score += Math.max(0, 30 - complianceResult.errors.length * 5);

    // 文字数（20点）
    const totalChars = this.countTotalCharacters(article);
    if (totalChars >= 5000) score += 20;
    else if (totalChars >= 4000) score += 15;
    else if (totalChars >= 3000) score += 10;

    // SEO要素（15点）
    if (article.metaDescription) score += 5;
    if (article.keywords?.length > 0) score += 5;
    if (article.internalLinks?.length > 0) score += 5;

    // エビデンス（10点）
    if (article.references?.length >= 10) score += 10;
    else if (article.references?.length >= 5) score += 5;

    return Math.min(100, score);
  }

  private countTotalCharacters(article: any): number {
    let total = 0;

    // 各フィールドの文字数をカウント
    if (article.description) total += article.description.length;
    if (article.benefits) {
      article.benefits.forEach((b: any) => {
        total += (b.title?.length || 0) + (b.description?.length || 0);
      });
    }
    if (article.recommendedDosage) total += article.recommendedDosage.length;
    if (article.sideEffects) total += article.sideEffects.length;
    if (article.interactions) {
      article.interactions.forEach((i: any) => {
        total += (i.substance?.length || 0) + (i.description?.length || 0);
      });
    }
    if (article.faqs) {
      article.faqs.forEach((faq: any) => {
        total += (faq.question?.length || 0) + (faq.answer?.length || 0);
      });
    }

    return total;
  }

  async optimizeBatch(files: string[], options: OptimizationOptions): Promise<void> {
    console.log(chalk.blue.bold('\n📊 記事最適化バッチ処理を開始\n'));

    const results: OptimizationResult[] = [];

    for (const file of files) {
      const result = await this.optimize(file, options);
      results.push(result);
    }

    // レポート生成
    const report = await this.reportGenerator.generateBatchReport(results);

    // サマリー表示
    console.log(chalk.green.bold('\n✅ 最適化完了\n'));
    console.log(report.summary);

    // レポート保存
    if (options.output) {
      const reportPath = `${options.output}/optimization-report-${Date.now()}.json`;
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(chalk.gray(`レポート保存: ${reportPath}`));
    }
  }
}

// CLI実行
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
${chalk.bold('Article Optimizer - 成分記事統合最適化ツール')}

使用法:
  article-optimizer <file> [options]

オプション:
  --mode <mode>        動作モード (check|fix|enhance|full) [default: full]
  --target <number>    目標文字数 [default: 5000]
  --compliance <level> 薬機法準拠レベル (strict|standard|lenient) [default: strict]
  --no-backup         バックアップを作成しない
  --no-links          内部リンク生成をスキップ
  --no-schema         構造化データ生成をスキップ
  --no-faq            FAQ拡充をスキップ
  --output <path>     出力先パス
  --batch             バッチモード（複数ファイル処理）

例:
  article-optimizer vitamin-c-article.json
  article-optimizer --batch "*.json" --mode enhance
  article-optimizer vitamin-d-article.json --mode check
`);
    process.exit(0);
  }

  try {
    const optimizer = new ArticleOptimizer();

    // オプション解析
    const options: OptimizationOptions = {
      mode: 'full',
      targetWordCount: 5000,
      autoGenerateLinks: !args.includes('--no-links'),
      expandFAQ: !args.includes('--no-faq'),
      addSchema: !args.includes('--no-schema'),
      complianceLevel: 'strict',
      backup: !args.includes('--no-backup')
    };

    // モード設定
    const modeIndex = args.indexOf('--mode');
    if (modeIndex !== -1 && args[modeIndex + 1]) {
      options.mode = args[modeIndex + 1] as any;
    }

    // ターゲット文字数
    const targetIndex = args.indexOf('--target');
    if (targetIndex !== -1 && args[targetIndex + 1]) {
      options.targetWordCount = parseInt(args[targetIndex + 1]);
    }

    // コンプライアンスレベル
    const complianceIndex = args.indexOf('--compliance');
    if (complianceIndex !== -1 && args[complianceIndex + 1]) {
      options.complianceLevel = args[complianceIndex + 1] as any;
    }

    // 出力先
    const outputIndex = args.indexOf('--output');
    if (outputIndex !== -1 && args[outputIndex + 1]) {
      options.output = args[outputIndex + 1];
    }

    // バッチモード
    if (args.includes('--batch')) {
      const pattern = args[0];
      const glob = await import('glob');
      const files = await glob.glob(pattern);

      if (files.length === 0) {
        console.error(chalk.red('ファイルが見つかりません'));
        process.exit(1);
      }

      await optimizer.optimizeBatch(files, options);
    } else {
      // 単一ファイル処理
      const result = await optimizer.optimize(args[0], options);

      // 結果表示
      console.log(chalk.green.bold('\n✅ 最適化完了\n'));
      console.log(`📁 ファイル: ${result.file}`);
      console.log(`📊 スコア: ${result.originalScore} → ${result.optimizedScore}`);
      console.log(`✏️  変更数: ${result.changes.length}`);
      console.log(`⚠️  警告: ${result.warnings.length}`);
      console.log(`❌ エラー: ${result.errors.length}`);
      console.log(`⏱  処理時間: ${result.duration}ms`);

      if (result.backup) {
        console.log(`💾 バックアップ: ${result.backup}`);
      }
    }

  } catch (error) {
    console.error(chalk.red(`エラー: ${error.message}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { ArticleOptimizer, OptionsSchema };