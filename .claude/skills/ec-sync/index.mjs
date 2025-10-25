#!/usr/bin/env node

/**
 * EC商品同期 Claude Code Skill
 *
 * このスキルは楽天・Yahoo・AmazonなどのECサイトから商品データを取得し、
 * Sanityに同期するための対話的なインターフェースを提供します。
 *
 * 使い方:
 *   node .claude/skills/ec-sync/index.mjs <source> <keyword> [options]
 *
 * 引数:
 *   source   ECサイト (rakuten | yahoo | amazon)
 *   keyword  検索キーワード
 *
 * オプション:
 *   --limit <number>    取得する商品数（デフォルト: 30）
 *   --dry-run          実際には保存せず、取得データのみ表示
 *   --update-prices    既存商品の価格のみ更新
 *   --interactive      対話モード
 *
 * 例:
 *   node .claude/skills/ec-sync/index.mjs rakuten "ビタミンC" --limit 10
 *   node .claude/skills/ec-sync/index.mjs rakuten "プロテイン" --dry-run
 *   node .claude/skills/ec-sync/index.mjs rakuten --interactive
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../..');

// スキルメタデータ読み込み
const skillMetadata = JSON.parse(
  readFileSync(join(__dirname, 'skill.json'), 'utf8')
);

console.log(`\n🔌 ${skillMetadata.name} v${skillMetadata.version}`);
console.log(`📝 ${skillMetadata.description}\n`);

// 引数解析
const args = process.argv.slice(2);
const source = args[0];
const keyword = args.find(arg => !arg.startsWith('--') && arg !== source);
const interactive = args.includes('--interactive');
const dryRun = args.includes('--dry-run');

// サポートされているECサイト
const supportedSources = {
  rakuten: {
    name: '楽天市場',
    script: 'scripts/sync-rakuten-products.mjs',
    available: true,
  },
  yahoo: {
    name: 'Yahoo!ショッピング',
    script: 'scripts/sync-yahoo-products.mjs',
    available: true,
  },
  amazon: {
    name: 'Amazon',
    script: 'scripts/sync-amazon-products.mjs',
    available: false, // 未実装
  },
};

// ヘルプ表示
function showHelp() {
  console.log('使い方:');
  console.log('  node .claude/skills/ec-sync/index.mjs <source> <keyword> [options]\n');
  console.log('サポートされているECサイト:');
  Object.entries(supportedSources).forEach(([key, config]) => {
    const status = config.available ? '✅' : '⏳ 未実装';
    console.log(`  ${key.padEnd(10)} - ${config.name} ${status}`);
  });
  console.log('\nオプション:');
  console.log('  --limit <number>    取得する商品数（デフォルト: 30）');
  console.log('  --dry-run          実際には保存せず、取得データのみ表示');
  console.log('  --update-prices    既存商品の価格のみ更新');
  console.log('  --interactive      対話モード');
  console.log('\n例:');
  skillMetadata.examples.forEach(example => {
    console.log(`  # ${example.description}`);
    console.log(`  ${example.command}\n`);
  });
}

// 環境変数チェック
function checkEnvironment(source) {
  const envPath = join(projectRoot, 'apps/web/.env.local');
  const envContent = readFileSync(envPath, 'utf8');

  const requiredVars = skillMetadata.environment.required;
  const missingVars = [];

  for (const varName of requiredVars) {
    const regex = new RegExp(`${varName}=(.+)`);
    const value = envContent.match(regex)?.[1]?.trim();
    if (!value) {
      missingVars.push(varName);
    }
  }

  // ECサイト固有の環境変数チェック
  if (source === 'rakuten') {
    const rakutenId = envContent.match(/RAKUTEN_APPLICATION_ID=(.+)/)?.[1]?.trim();
    if (!rakutenId) {
      missingVars.push('RAKUTEN_APPLICATION_ID');
    }
  } else if (source === 'yahoo') {
    const yahooId = envContent.match(/YAHOO_SHOPPING_CLIENT_ID=(.+)/)?.[1]?.trim();
    if (!yahooId) {
      missingVars.push('YAHOO_SHOPPING_CLIENT_ID');
    }
  } else if (source === 'amazon') {
    const amazonKey = envContent.match(/AMAZON_ACCESS_KEY_ID=(.+)/)?.[1]?.trim();
    if (!amazonKey) {
      missingVars.push('AMAZON_ACCESS_KEY_ID');
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ 以下の環境変数が設定されていません:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    console.log('\n💡 .env.local に必要な認証情報を追加してください');
    console.log(`📖 詳細: ${join(projectRoot, 'docs/ANALYTICS_SETUP.md')}`);
    process.exit(1);
  }

  console.log('✅ 環境変数チェック完了\n');
}

// スクリプト実行
function runScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const scriptFullPath = join(projectRoot, scriptPath);
    const child = spawn('node', [scriptFullPath, ...args], {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`スクリプトがエラーコード ${code} で終了しました`));
      }
    });

    child.on('error', err => {
      reject(err);
    });
  });
}

// メイン処理
async function main() {
  // ヘルプ表示
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // ソースチェック
  if (!source || !supportedSources[source]) {
    console.error(`❌ 不明なECサイト: ${source}\n`);
    showHelp();
    process.exit(1);
  }

  const config = supportedSources[source];

  // 実装状況チェック
  if (!config.available) {
    console.error(`❌ ${config.name}は未実装です`);
    console.log('💡 実装予定:');
    console.log('  - フェーズ2.5: 楽天API ✅');
    console.log('  - フェーズ2.5: Yahoo!ショッピング ✅');
    console.log('  - フェーズ4: Amazon PA-API ⏳');
    process.exit(1);
  }

  // 環境変数チェック
  checkEnvironment(source);

  // スクリプト実行
  console.log(`🚀 ${config.name}から商品を同期します\n`);

  try {
    const scriptArgs = args.slice(1); // sourceを除外
    await runScript(config.script, scriptArgs);
    console.log('\n✅ 同期が完了しました！');
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
