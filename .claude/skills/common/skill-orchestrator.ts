/**
 * Skill Orchestrator - Skills間の連携を管理
 * 複数のSkillsをパイプライン的に実行し、結果を統合
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getLogger } from './logger';

const logger = getLogger('skill-orchestrator');

// パイプライン定義の型
export interface SkillPipeline {
  name: string;
  description: string;
  skills: SkillStep[];
  config?: PipelineConfig;
}

export interface SkillStep {
  skillName: string;
  command?: string;
  args?: string[];
  input?: 'previous' | 'file' | 'none';
  outputPath?: string;
  condition?: (previousResult: any) => boolean;
  transform?: (data: any) => any;
}

export interface PipelineConfig {
  stopOnError?: boolean;
  saveIntermediateResults?: boolean;
  outputDir?: string;
  parallel?: boolean;
  timeout?: number;
}

export interface PipelineResult {
  success: boolean;
  duration: number;
  steps: StepResult[];
  finalOutput?: any;
  errors: string[];
}

export interface StepResult {
  skillName: string;
  success: boolean;
  output?: any;
  error?: string;
  duration: number;
}

/**
 * 事前定義されたパイプライン
 */
export const PREDEFINED_PIPELINES: Record<string, SkillPipeline> = {
  // 記事作成・最適化パイプライン
  'article-complete': {
    name: '記事完全最適化',
    description: '記事の検証 → 最適化 → Sanityインポート',
    skills: [
      {
        skillName: 'sanity-ingredient-validator',
        input: 'file',
        condition: (prev) => true
      },
      {
        skillName: 'article-optimizer',
        args: ['--mode', 'full'],
        input: 'previous',
        condition: (prev) => prev.score >= 60
      },
      {
        skillName: 'sanity-bulk-import',
        args: ['--dry-run', 'false'],
        input: 'previous',
        condition: (prev) => prev.optimizedScore >= 80
      }
    ],
    config: {
      stopOnError: true,
      saveIntermediateResults: true
    }
  },

  // 価格分析パイプライン
  'price-analysis': {
    name: '価格分析フルレポート',
    description: 'API同期 → 価格計算 → レポート生成',
    skills: [
      {
        skillName: 'api-sync-manager',
        command: 'sync',
        args: ['--sources', 'amazon,rakuten']
      },
      {
        skillName: 'price-calculator',
        args: ['--mode', 'report'],
        input: 'previous'
      }
    ],
    config: {
      stopOnError: false,
      saveIntermediateResults: true
    }
  },

  // デプロイ準備パイプライン
  'deploy-preparation': {
    name: 'デプロイ準備',
    description: 'テスト → ビルド → デプロイチェック',
    skills: [
      {
        skillName: 'test-generator',
        args: ['--type', 'all'],
        condition: () => true
      },
      {
        skillName: 'sanity-dev-helper',
        command: 'test',
        condition: (prev) => prev.testFiles?.length > 0
      },
      {
        skillName: 'sanity-dev-helper',
        command: 'build',
        condition: (prev) => prev.success
      },
      {
        skillName: 'sanity-dev-helper',
        command: 'deploy:check',
        condition: (prev) => prev.success
      }
    ],
    config: {
      stopOnError: true,
      timeout: 600000 // 10分
    }
  },

  // SEOコンテンツ作成パイプライン
  'seo-content': {
    name: 'SEO最適化コンテンツ作成',
    description: 'コンテンツ生成 → SEO最適化 → 薬機法チェック',
    skills: [
      {
        skillName: 'seo-content-writer',
        input: 'file'
      },
      {
        skillName: 'content-seo-scorer',
        input: 'previous'
      },
      {
        skillName: 'compliance-checker',
        input: 'previous',
        condition: (prev) => prev.seoScore >= 70
      },
      {
        skillName: 'article-optimizer',
        args: ['--mode', 'fix'],
        input: 'previous',
        condition: (prev) => !prev.isCompliant
      }
    ],
    config: {
      saveIntermediateResults: true
    }
  }
};

/**
 * Skill Orchestratorクラス
 */
export class SkillOrchestrator {
  private spinner: ora.Ora;
  private skillsDir: string;

  constructor() {
    this.spinner = ora();
    this.skillsDir = path.join(process.cwd(), '.claude/skills');
  }

  /**
   * パイプラインを実行
   */
  async runPipeline(
    pipelineName: string,
    inputData?: any,
    customConfig?: PipelineConfig
  ): Promise<PipelineResult> {
    const pipeline = PREDEFINED_PIPELINES[pipelineName];

    if (!pipeline) {
      throw new Error(`パイプライン '${pipelineName}' が見つかりません`);
    }

    return this.executePipeline(pipeline, inputData, customConfig);
  }

  /**
   * カスタムパイプラインを実行
   */
  async executeCustomPipeline(
    pipeline: SkillPipeline,
    inputData?: any,
    customConfig?: PipelineConfig
  ): Promise<PipelineResult> {
    return this.executePipeline(pipeline, inputData, customConfig);
  }

  /**
   * パイプライン実行の実装
   */
  private async executePipeline(
    pipeline: SkillPipeline,
    inputData?: any,
    customConfig?: PipelineConfig
  ): Promise<PipelineResult> {
    const startTime = Date.now();
    const config = { ...pipeline.config, ...customConfig };
    const result: PipelineResult = {
      success: true,
      duration: 0,
      steps: [],
      errors: []
    };

    console.log(chalk.blue.bold(`\n🚀 パイプライン実行: ${pipeline.name}\n`));
    console.log(chalk.gray(pipeline.description));
    console.log(chalk.gray('─'.repeat(50)));

    let previousOutput = inputData;
    const outputDir = config.outputDir || path.join(process.cwd(), '.pipeline-output');

    // 出力ディレクトリ作成
    if (config.saveIntermediateResults) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // 各ステップを実行
    for (let i = 0; i < pipeline.skills.length; i++) {
      const step = pipeline.skills[i];
      const stepNumber = i + 1;

      console.log(chalk.cyan(`\n[${stepNumber}/${pipeline.skills.length}] ${step.skillName}`));

      // 条件チェック
      if (step.condition && !step.condition(previousOutput)) {
        console.log(chalk.yellow('⏭  条件を満たさないためスキップ'));
        continue;
      }

      // ステップ実行
      const stepResult = await this.executeSkillStep(
        step,
        previousOutput,
        config
      );

      result.steps.push(stepResult);

      if (!stepResult.success) {
        result.errors.push(stepResult.error || `${step.skillName} failed`);

        if (config.stopOnError) {
          result.success = false;
          console.log(chalk.red('\n❌ エラーによりパイプラインを中断'));
          break;
        }
      }

      // 中間結果を保存
      if (config.saveIntermediateResults && stepResult.output) {
        const outputPath = path.join(
          outputDir,
          `step-${stepNumber}-${step.skillName}.json`
        );
        await fs.writeFile(outputPath, JSON.stringify(stepResult.output, null, 2));
        logger.debug(`中間結果を保存: ${outputPath}`);
      }

      // 出力の変換
      if (step.transform && stepResult.output) {
        previousOutput = step.transform(stepResult.output);
      } else {
        previousOutput = stepResult.output;
      }
    }

    result.duration = Date.now() - startTime;
    result.finalOutput = previousOutput;

    // 結果サマリー表示
    this.displayPipelineSummary(result, pipeline);

    // 最終結果を保存
    if (config.saveIntermediateResults) {
      const finalPath = path.join(outputDir, 'final-result.json');
      await fs.writeFile(finalPath, JSON.stringify(result, null, 2));
      console.log(chalk.gray(`\n📁 結果保存: ${finalPath}`));
    }

    return result;
  }

  /**
   * 個別のSkillステップを実行
   */
  private async executeSkillStep(
    step: SkillStep,
    input: any,
    config: PipelineConfig
  ): Promise<StepResult> {
    const startTime = Date.now();
    const result: StepResult = {
      skillName: step.skillName,
      success: false,
      duration: 0
    };

    this.spinner.start(`${step.skillName} を実行中...`);

    try {
      // 入力データの準備
      let inputPath: string | undefined;
      if (step.input === 'previous' && input) {
        inputPath = path.join(process.cwd(), `.tmp-input-${Date.now()}.json`);
        await fs.writeFile(inputPath, JSON.stringify(input, null, 2));
      } else if (step.input === 'file') {
        inputPath = input; // ファイルパスが直接渡される
      }

      // Skillコマンドの構築
      const skillPath = path.join(this.skillsDir, step.skillName, 'index.ts');
      const args = ['tsx', skillPath];

      if (step.command) {
        args.push(step.command);
      }

      if (inputPath) {
        args.push(inputPath);
      }

      if (step.args) {
        args.push(...step.args);
      }

      // Skill実行
      const output = await this.runSkillCommand(args, config.timeout);

      result.success = true;
      result.output = this.parseSkillOutput(output);

      this.spinner.succeed(`${step.skillName} 完了`);

      // 一時ファイルのクリーンアップ
      if (inputPath?.includes('.tmp-input-')) {
        await fs.unlink(inputPath).catch(() => {});
      }

    } catch (error) {
      result.success = false;
      result.error = error.message;
      this.spinner.fail(`${step.skillName} 失敗`);
      logger.error(`Skill実行エラー: ${step.skillName}`, error as Error);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Skillコマンドを実行
   */
  private async runSkillCommand(
    args: string[],
    timeout?: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn('npx', args, {
        cwd: this.skillsDir,
        timeout: timeout || 60000
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || stdout || 'Skill execution failed'));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Skill出力を解析
   */
  private parseSkillOutput(output: string): any {
    // JSON出力を探す
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // JSONパースに失敗した場合は文字列として返す
      }
    }

    return output;
  }

  /**
   * パイプライン結果のサマリー表示
   */
  private displayPipelineSummary(
    result: PipelineResult,
    pipeline: SkillPipeline
  ): void {
    console.log(chalk.bold('\n📊 パイプライン実行結果\n'));
    console.log(chalk.gray('='.repeat(50)));

    const status = result.success ? chalk.green('✅ 成功') : chalk.red('❌ 失敗');
    console.log(`ステータス: ${status}`);
    console.log(`実行時間: ${(result.duration / 1000).toFixed(2)}秒`);
    console.log(`実行ステップ: ${result.steps.length}/${pipeline.skills.length}`);

    if (result.steps.length > 0) {
      console.log('\nステップ詳細:');
      result.steps.forEach((step, index) => {
        const icon = step.success ? '✅' : '❌';
        const duration = (step.duration / 1000).toFixed(2);
        console.log(`  ${index + 1}. ${icon} ${step.skillName} (${duration}秒)`);

        if (step.error) {
          console.log(chalk.red(`     エラー: ${step.error}`));
        }
      });
    }

    if (result.errors.length > 0) {
      console.log(chalk.red('\nエラー:'));
      result.errors.forEach(error => {
        console.log(chalk.red(`  • ${error}`));
      });
    }
  }

  /**
   * 利用可能なパイプライン一覧を表示
   */
  static listPipelines(): void {
    console.log(chalk.blue.bold('\n📋 利用可能なパイプライン\n'));

    Object.entries(PREDEFINED_PIPELINES).forEach(([key, pipeline]) => {
      console.log(chalk.cyan(`• ${key}`));
      console.log(`  ${pipeline.description}`);
      console.log(chalk.gray(`  ステップ数: ${pipeline.skills.length}`));
      console.log(chalk.gray(`  Skills: ${pipeline.skills.map(s => s.skillName).join(' → ')}`));
      console.log();
    });
  }
}

// エクスポート
export default new SkillOrchestrator();