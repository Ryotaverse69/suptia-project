#!/usr/bin/env node

/**
 * Production Deployment Test Script
 * 本番デプロイ機能のテストを実行する
 */

import { execSync } from 'child_process';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_NWkcnXBay0NvP9FEZUuXAICo0514';

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN is required for testing');
  process.exit(1);
}

/**
 * Vercel APIを呼び出す
 */
async function callVercelAPI(endpoint, options = {}) {
  const url = `https://api.vercel.com${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * プロジェクト情報を取得
 */
async function getProjectInfo() {
  try {
    const project = await callVercelAPI(`/v9/projects/${VERCEL_PROJECT_ID}`);
    return project;
  } catch (error) {
    console.error('❌ Failed to get project info:', error.message);
    throw error;
  }
}

/**
 * 最新のデプロイメントを取得
 */
async function getLatestDeployments() {
  try {
    const data = await callVercelAPI(`/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=10`);
    return data.deployments;
  } catch (error) {
    console.error('❌ Failed to get deployments:', error.message);
    throw error;
  }
}

/**
 * デプロイメント情報を表示
 */
function displayDeployment(deployment, index) {
  const status = deployment.readyState;
  const statusEmoji = status === 'READY' ? '✅' : status === 'ERROR' ? '❌' : '⏳';
  
  console.log(`${index + 1}. ${statusEmoji} ${deployment.uid}`);
  console.log(`   URL: https://${deployment.url}`);
  console.log(`   Status: ${status}`);
  console.log(`   Created: ${new Date(deployment.createdAt).toLocaleString()}`);
  console.log(`   Target: ${deployment.target || 'preview'}`);
  console.log(`   Branch: ${deployment.meta?.githubCommitRef || 'unknown'}`);
  console.log(`   Commit: ${deployment.meta?.githubCommitSha?.substring(0, 7) || 'unknown'}`);
  console.log('');
}

/**
 * 本番デプロイメントの健全性をチェック
 */
async function checkProductionHealth() {
  try {
    const deployments = await getLatestDeployments();
    
    const productionDeployments = deployments.filter(d => 
      d.target === 'production' || 
      d.meta?.githubCommitRef === 'master' || 
      d.meta?.githubCommitRef === 'main'
    );

    const successfulProduction = productionDeployments.filter(d => d.readyState === 'READY');
    const failedProduction = productionDeployments.filter(d => d.readyState === 'ERROR');

    console.log('📊 Production Deployment Health Check:');
    console.log(`   Total production deployments: ${productionDeployments.length}`);
    console.log(`   Successful: ${successfulProduction.length}`);
    console.log(`   Failed: ${failedProduction.length}`);
    console.log(`   Success rate: ${productionDeployments.length > 0 ? Math.round((successfulProduction.length / productionDeployments.length) * 100) : 0}%`);
    console.log('');

    return {
      total: productionDeployments.length,
      successful: successfulProduction.length,
      failed: failedProduction.length,
      successRate: productionDeployments.length > 0 ? (successfulProduction.length / productionDeployments.length) : 0
    };
  } catch (error) {
    console.error('❌ Failed to check production health:', error.message);
    throw error;
  }
}

/**
 * 通知機能をテスト
 */
async function testNotifications() {
  console.log('🧪 Testing notification functions...');
  
  try {
    // テスト用の通知を送信
    const testData = {
      url: 'https://test.example.com',
      deploymentId: 'test-deployment-123',
      error: 'Test error message'
    };

    console.log('📢 Testing deployment success notification...');
    execSync('node scripts/notify-deployment.mjs deployment_success --url https://test.example.com --deploymentId test-123', {
      stdio: 'inherit',
      env: {
        ...process.env,
        GITHUB_SHA: 'test123',
        GITHUB_REPOSITORY: 'test/repo',
        GITHUB_RUN_ID: '123456'
      }
    });

    console.log('✅ Notification test completed');
  } catch (error) {
    console.error('❌ Notification test failed:', error.message);
  }
}

/**
 * スクリプトの存在確認
 */
function checkScripts() {
  const scripts = [
    'scripts/monitor-production-deployment.mjs',
    'scripts/rollback-production.mjs',
    'scripts/notify-deployment.mjs'
  ];

  console.log('📁 Checking required scripts...');
  
  for (const script of scripts) {
    try {
      execSync(`test -f ${script}`, { stdio: 'ignore' });
      console.log(`   ✅ ${script}`);
    } catch (error) {
      console.log(`   ❌ ${script} - Missing!`);
    }
  }
  console.log('');
}

/**
 * GitHub Actions設定の確認
 */
function checkGitHubActions() {
  console.log('⚙️ Checking GitHub Actions configuration...');
  
  try {
    const ciContent = execSync('cat .github/workflows/ci.yml', { encoding: 'utf8' });
    
    const requiredJobs = [
      'production-deployment',
      'rollback-on-failure'
    ];

    for (const job of requiredJobs) {
      if (ciContent.includes(job)) {
        console.log(`   ✅ ${job} job configured`);
      } else {
        console.log(`   ❌ ${job} job missing`);
      }
    }

    // 必要な環境変数の確認
    const requiredSecrets = [
      'VERCEL_TOKEN',
      'SLACK_WEBHOOK_URL'
    ];

    console.log('\n🔐 Required secrets (configure in GitHub repository settings):');
    for (const secret of requiredSecrets) {
      console.log(`   - ${secret}`);
    }

  } catch (error) {
    console.error('❌ Failed to check GitHub Actions:', error.message);
  }
  console.log('');
}

/**
 * メイン処理
 */
async function main() {
  console.log('🧪 Production Deployment Test Suite');
  console.log('=====================================\n');

  try {
    // プロジェクト情報を取得
    console.log('📋 Project Information:');
    const project = await getProjectInfo();
    console.log(`   Name: ${project.name}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Framework: ${project.framework || 'Not specified'}`);
    console.log('');

    // 最新のデプロイメントを表示
    console.log('📦 Recent Deployments:');
    const deployments = await getLatestDeployments();
    deployments.slice(0, 5).forEach(displayDeployment);

    // 本番デプロイメントの健全性をチェック
    const health = await checkProductionHealth();

    // スクリプトの存在確認
    checkScripts();

    // GitHub Actions設定の確認
    checkGitHubActions();

    // 通知機能のテスト
    if (process.env.TEST_NOTIFICATIONS === 'true') {
      await testNotifications();
    }

    // 結果のサマリー
    console.log('📊 Test Summary:');
    console.log(`   Production success rate: ${Math.round(health.successRate * 100)}%`);
    console.log(`   Recent deployments: ${deployments.length}`);
    console.log(`   Project status: ${project.name ? '✅ Connected' : '❌ Not found'}`);
    
    if (health.successRate < 0.8) {
      console.log('\n⚠️ Warning: Production success rate is below 80%');
    }

    console.log('\n✅ Production deployment test completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

export { main, getProjectInfo, getLatestDeployments, checkProductionHealth };