#!/usr/bin/env node

/**
 * Skill Pipeline Runner
 * 複数のSkillsを連携させて実行するCLIツール
 */

import chalk from 'chalk';
import { SkillOrchestrator, PREDEFINED_PIPELINES, SkillPipeline } from './common/skill-orchestrator';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    displayHelp();
    process.exit(0);
  }

  if (args[0] === 'list') {
    SkillOrchestrator.listPipelines();
    process.exit(0);
  }

  const orchestrator = new SkillOrchestrator();
  const pipelineName = args[0];
  const inputFile = args[1];

  // オプション解析
  const options: any = {};
  if (args.includes('--save')) {
    options.saveIntermediateResults = true;
  }
  if (args.includes('--no-stop')) {
    options.stopOnError = false;
  }

  try {
    let inputData;
    if (inputFile) {
      const fs = await import('fs/promises');
      const content = await fs.readFile(inputFile, 'utf-8');
      inputData = JSON.parse(content);
    }

    const result = await orchestrator.runPipeline(pipelineName, inputData, options);

    if (result.success) {
      console.log(chalk.green.bold('\n✅ パイプライン実行成功！'));
    } else {
      console.log(chalk.red.bold('\n❌ パイプライン実行失敗'));
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red(`\nエラー: ${error.message}`));
    process.exit(1);
  }
}

function displayHelp() {
  console.log(`
${chalk.bold('Skill Pipeline Runner')}

使用法:
  run-pipeline <pipeline-name> [input-file] [options]
  run-pipeline list

パイプライン:
  article-complete    記事の検証→最適化→インポート
  price-analysis      価格同期→分析→レポート生成
  deploy-preparation  テスト→ビルド→デプロイチェック
  seo-content        SEOコンテンツ生成→最適化

オプション:
  --save             中間結果を保存
  --no-stop          エラーでも継続
  --help             ヘルプを表示

例:
  run-pipeline article-complete vitamin-c-article.json
  run-pipeline price-analysis --save
  run-pipeline deploy-preparation --no-stop
  run-pipeline list
`);
}

main().catch(console.error);