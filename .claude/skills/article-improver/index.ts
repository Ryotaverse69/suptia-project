#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { improveArticle } from './improver';
import { validateImprovedArticle } from './validator';
import { generateReport } from './reporter';

// コマンドライン引数を解析
const args = process.argv.slice(2);
const options = {
  batch: args.includes('--batch'),
  force: args.includes('--force'),
  model: args.includes('--model'),
  output: args.find((arg, i) => args[i - 1] === '--output'),
  pattern: args.find(arg => !arg.startsWith('--')) || '*-article.json'
};

// CoQ10記事を模範として読み込み
const modelArticlePath = path.join(process.cwd(), 'coenzyme-q10-article.json');
const modelArticle = fs.existsSync(modelArticlePath)
  ? JSON.parse(fs.readFileSync(modelArticlePath, 'utf-8'))
  : null;

async function improveAllArticles() {
  const workDir = process.cwd();

  // 対象ファイルを取得
  const files = fs.readdirSync(workDir).filter(file => {
    if (options.batch) {
      return file.match(new RegExp(options.pattern.replace('*', '.*')));
    }
    return file === options.pattern;
  });

  console.log(`\n🎯 対象記事: ${files.length}件`);

  const results = {
    success: [],
    failed: [],
    improvements: []
  };

  for (const file of files) {
    try {
      const filePath = path.join(workDir, file);
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const article = JSON.parse(originalContent);

      console.log(`\n📝 処理中: ${file}`);

      // 記事を改善
      const improved = await improveArticle(article, modelArticle);

      // 改善結果を検証
      const validation = validateImprovedArticle(improved);

      // 出力ファイルパスを決定
      let outputPath = filePath;
      if (!options.force) {
        outputPath = filePath.replace('.json', '-improved.json');
      }

      // 保存
      fs.writeFileSync(outputPath, JSON.stringify(improved, null, 2), 'utf-8');

      results.success.push({
        file,
        outputPath,
        score: validation.score,
        grade: validation.grade,
        improvements: validation.improvements
      });

      console.log(`✅ 完了: ${validation.score}/100 (${validation.grade})`);

    } catch (error) {
      console.error(`❌ エラー: ${file} - ${error.message}`);
      results.failed.push({ file, error: error.message });
    }
  }

  // レポート生成
  const report = generateReport(results);
  console.log(report);

  // レポートをファイルに保存
  const reportPath = path.join(workDir, `improvement-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n📄 レポート保存: ${reportPath}`);
}

// メイン実行
improveAllArticles().catch(console.error);