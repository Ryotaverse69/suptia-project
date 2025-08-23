#!/usr/bin/env node

/**
 * Preview環境ワークフローのテストスクリプト
 * dev ブランチのpushからPreview URLの生成までの流れをテストする
 */

import { execSync } from 'child_process';
import fs from 'fs';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * 現在のブランチを確認
 */
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (error) {
    log(colors.red, '❌ Failed to get current branch');
    return null;
  }
}

/**
 * Gitの状態を確認
 */
function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length === 0;
  } catch (error) {
    log(colors.red, '❌ Failed to check git status');
    return false;
  }
}

/**
 * vercel.jsonの設定を確認
 */
function checkVercelConfig() {
  try {
    const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    const devEnabled = config.git?.deploymentEnabled?.dev;
    
    if (devEnabled) {
      log(colors.green, '✅ dev branch deployment is enabled in vercel.json');
      return true;
    } else {
      log(colors.red, '❌ dev branch deployment is not enabled in vercel.json');
      return false;
    }
  } catch (error) {
    log(colors.red, '❌ Failed to read vercel.json');
    return false;
  }
}

/**
 * GitHub Actionsワークフローの設定を確認
 */
function checkGitHubActions() {
  try {
    const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
    
    const checks = [
      { name: 'preview-deployment job', pattern: /preview-deployment:/ },
      { name: 'dev branch trigger', pattern: /github\.ref == 'refs\/heads\/dev'/ },
      { name: 'get-preview-url script', pattern: /get-preview-url\.mjs/ },
      { name: 'PR comment functionality', pattern: /gh pr comment/ }
    ];

    let allPassed = true;
    
    for (const check of checks) {
      if (check.pattern.test(workflow)) {
        log(colors.green, `✅ ${check.name} is configured`);
      } else {
        log(colors.red, `❌ ${check.name} is missing`);
        allPassed = false;
      }
    }
    
    return allPassed;
  } catch (error) {
    log(colors.red, '❌ Failed to read GitHub Actions workflow');
    return false;
  }
}

/**
 * 必要なスクリプトファイルの存在確認
 */
function checkScriptFiles() {
  const requiredScripts = [
    'scripts/get-preview-url.mjs',
    'scripts/verify-preview-env.mjs'
  ];

  let allExist = true;
  
  for (const script of requiredScripts) {
    if (fs.existsSync(script)) {
      log(colors.green, `✅ ${script} exists`);
    } else {
      log(colors.red, `❌ ${script} is missing`);
      allExist = false;
    }
  }
  
  return allExist;
}

/**
 * package.jsonのスクリプト確認
 */
function checkPackageScripts() {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const webPkg = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
    
    const requiredRootScripts = ['preview:verify', 'preview:url'];
    const requiredWebScripts = ['preview:verify', 'preview:url'];
    
    let allPresent = true;
    
    for (const script of requiredRootScripts) {
      if (pkg.scripts[script]) {
        log(colors.green, `✅ Root package.json has ${script} script`);
      } else {
        log(colors.red, `❌ Root package.json missing ${script} script`);
        allPresent = false;
      }
    }
    
    for (const script of requiredWebScripts) {
      if (webPkg.scripts[script]) {
        log(colors.green, `✅ Web package.json has ${script} script`);
      } else {
        log(colors.red, `❌ Web package.json missing ${script} script`);
        allPresent = false;
      }
    }
    
    return allPresent;
  } catch (error) {
    log(colors.red, '❌ Failed to check package.json scripts');
    return false;
  }
}

/**
 * 環境変数の確認
 */
function checkEnvironmentVariables() {
  const requiredVars = [
    'VERCEL_TOKEN',
    'GITHUB_TOKEN'
  ];

  const optionalVars = [
    'VERCEL_PROJECT_ID'
  ];

  log(colors.blue, '📋 Checking environment variables for testing...');
  
  let hasRequired = true;
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log(colors.green, `✅ ${varName} is set`);
    } else {
      log(colors.yellow, `⚠️  ${varName} is not set (required for full functionality)`);
      hasRequired = false;
    }
  }
  
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      log(colors.green, `✅ ${varName} is set`);
    } else {
      log(colors.blue, `ℹ️  ${varName} is not set (will use default)`);
    }
  }
  
  return hasRequired;
}

/**
 * テスト用のコミットを作成（実際にはコミットしない）
 */
function simulateDevPush() {
  const currentBranch = getCurrentBranch();
  
  if (currentBranch !== 'dev') {
    log(colors.yellow, `⚠️  Current branch is '${currentBranch}', not 'dev'`);
    log(colors.yellow, '   To test the full workflow, switch to dev branch and push changes');
    return false;
  }
  
  const isClean = checkGitStatus();
  if (isClean) {
    log(colors.blue, 'ℹ️  Working directory is clean - no changes to push');
    log(colors.blue, '   To test the full workflow, make a change and push to dev branch');
    return false;
  } else {
    log(colors.yellow, '⚠️  There are uncommitted changes');
    log(colors.yellow, '   Commit and push to dev branch to trigger the Preview deployment workflow');
    return false;
  }
}

/**
 * メインテスト処理
 */
async function main() {
  log(colors.blue, '🧪 Testing Vercel Preview Environment Workflow...');
  log(colors.blue, '');

  const checks = [
    { name: 'Vercel Configuration', fn: checkVercelConfig },
    { name: 'GitHub Actions Workflow', fn: checkGitHubActions },
    { name: 'Script Files', fn: checkScriptFiles },
    { name: 'Package Scripts', fn: checkPackageScripts },
    { name: 'Environment Variables', fn: checkEnvironmentVariables }
  ];

  let allPassed = true;
  
  for (const check of checks) {
    log(colors.blue, `🔍 Checking ${check.name}...`);
    const result = check.fn();
    if (!result) {
      allPassed = false;
    }
    log(colors.blue, '');
  }

  // Git状態の確認
  log(colors.blue, '🔍 Checking Git status...');
  const currentBranch = getCurrentBranch();
  if (currentBranch) {
    log(colors.blue, `📋 Current branch: ${currentBranch}`);
  }
  simulateDevPush();
  log(colors.blue, '');

  // 結果サマリー
  if (allPassed) {
    log(colors.green, '🎉 All checks passed!');
    log(colors.green, '');
    log(colors.green, '✅ Preview environment workflow is properly configured');
    log(colors.green, '✅ All required files and scripts are in place');
    log(colors.green, '✅ GitHub Actions workflow includes Preview URL generation');
    log(colors.green, '');
    log(colors.blue, '�� To test the full workflow:');
    log(colors.blue, '   1. Switch to dev branch: git switch dev');
    log(colors.blue, '   2. Make a change and commit it');
    log(colors.blue, '   3. Push to dev branch: git push origin dev');
    log(colors.blue, '   4. Check GitHub Actions for Preview URL generation');
    log(colors.blue, '   5. Verify Preview URL is commented on related PRs');
  } else {
    log(colors.red, '❌ Some checks failed');
    log(colors.red, '   Please fix the issues above before testing the workflow');
    process.exit(1);
  }

  // 手動テストの提案
  log(colors.blue, '');
  log(colors.blue, '🔧 Manual testing commands:');
  log(colors.blue, '   npm run preview:verify  # Verify Preview environment configuration');
  log(colors.blue, '   npm run preview:url     # Get Preview URL for current commit (requires VERCEL_TOKEN)');
}

// スクリプトが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log(colors.red, `❌ Test failed: ${error.message}`);
    process.exit(1);
  });
}

export { main as testPreviewWorkflow };