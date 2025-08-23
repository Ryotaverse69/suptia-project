#!/usr/bin/env node

/**
 * Definition of Done (DoD) Checker
 * 
 * このスクリプトは、プルリクエストが完了の定義（Definition of Done）を満たしているかを確認します。
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DOD_CRITERIA = [
  {
    name: "Code Quality",
    checks: [
      {
        name: "Format Check",
        command: "cd apps/web && pnpm run format:check",
        description: "コードが適切にフォーマットされている"
      },
      {
        name: "Lint Check", 
        command: "cd apps/web && pnpm run lint",
        description: "ESLintルールに準拠している"
      },
      {
        name: "Type Check",
        command: "cd apps/web && pnpm run typecheck", 
        description: "TypeScriptの型エラーがない"
      }
    ]
  },
  {
    name: "Testing",
    checks: [
      {
        name: "Unit Tests",
        command: "cd apps/web && pnpm run test",
        description: "すべてのテストが通過している"
      }
    ]
  },
  {
    name: "Build & Deploy",
    checks: [
      {
        name: "Build Check",
        command: "cd apps/web && pnpm run build",
        description: "アプリケーションが正常にビルドできる"
      }
    ]
  },
  {
    name: "Documentation",
    checks: [
      {
        name: "README Update",
        function: checkReadmeUpdate,
        description: "必要に応じてREADMEが更新されている"
      },
      {
        name: "Changelog Update", 
        function: checkChangelogUpdate,
        description: "重要な変更がCHANGELOGに記録されている"
      }
    ]
  },
  {
    name: "Git Standards",
    checks: [
      {
        name: "Commit Message Format",
        function: checkCommitMessages,
        description: "コミットメッセージが規約に従っている"
      },
      {
        name: "Branch Naming",
        function: checkBranchNaming,
        description: "ブランチ名が規約に従っている"
      }
    ]
  }
];

async function runDoDCheck() {
  console.log('🔍 Running Definition of Done (DoD) Check...\n');
  
  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;
  let skippedChecks = 0;
  
  for (const category of DOD_CRITERIA) {
    console.log(`📋 ${category.name}`);
    console.log('─'.repeat(50));
    
    for (const check of category.checks) {
      totalChecks++;
      
      try {
        let result;
        
        if (check.command) {
          // コマンド実行チェック
          result = await runCommandCheck(check);
        } else if (check.function) {
          // カスタム関数チェック
          result = await check.function();
        }
        
        if (result.success) {
          console.log(`  ✅ ${check.name}: ${check.description}`);
          passedChecks++;
        } else if (result.skipped) {
          console.log(`  ⏭️  ${check.name}: ${result.reason || 'Skipped'}`);
          skippedChecks++;
        } else {
          console.log(`  ❌ ${check.name}: ${result.error || 'Failed'}`);
          if (result.details) {
            console.log(`     ${result.details}`);
          }
          failedChecks++;
        }
        
      } catch (error) {
        console.log(`  ❌ ${check.name}: ${error.message}`);
        failedChecks++;
      }
    }
    
    console.log('');
  }
  
  // 結果サマリー
  console.log('📊 DoD Check Summary');
  console.log('═'.repeat(50));
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`✅ Passed: ${passedChecks}`);
  console.log(`❌ Failed: ${failedChecks}`);
  console.log(`⏭️  Skipped: ${skippedChecks}`);
  
  const successRate = ((passedChecks + skippedChecks) / totalChecks * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (failedChecks > 0) {
    console.log('\n❌ Definition of Done check failed!');
    console.log('Please fix the failing checks before merging this PR.');
    process.exit(1);
  } else {
    console.log('\n✅ All Definition of Done criteria are satisfied!');
    console.log('This PR is ready for review and merge.');
  }
}

async function runCommandCheck(check) {
  try {
    execSync(check.command, { 
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 60000 // 1分タイムアウト
    });
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: 'Command failed',
      details: error.message
    };
  }
}

async function checkReadmeUpdate() {
  try {
    // git diffでREADMEの変更を確認
    const diffOutput = execSync('git diff origin/master...HEAD --name-only', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const changedFiles = diffOutput.split('\n').filter(Boolean);
    const hasSignificantChanges = changedFiles.some(file => 
      file.includes('src/') || 
      file.includes('components/') ||
      file.includes('pages/') ||
      file.includes('app/')
    );
    
    const hasReadmeUpdate = changedFiles.some(file => 
      file.toLowerCase().includes('readme')
    );
    
    if (hasSignificantChanges && !hasReadmeUpdate) {
      return {
        success: false,
        error: 'Significant code changes detected but README not updated'
      };
    }
    
    return { success: true };
    
  } catch (error) {
    return { 
      skipped: true, 
      reason: 'Could not check README update (not in git repository or no changes)'
    };
  }
}

async function checkChangelogUpdate() {
  try {
    const changelogPath = 'CHANGELOG.md';
    
    if (!existsSync(changelogPath)) {
      return { 
        skipped: true, 
        reason: 'CHANGELOG.md not found'
      };
    }
    
    // git diffでCHANGELOGの変更を確認
    const diffOutput = execSync('git diff origin/master...HEAD --name-only', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const changedFiles = diffOutput.split('\n').filter(Boolean);
    const hasFeatureChanges = changedFiles.some(file => 
      file.includes('src/') || 
      file.includes('components/') ||
      file.includes('pages/') ||
      file.includes('app/')
    );
    
    const hasChangelogUpdate = changedFiles.includes(changelogPath);
    
    if (hasFeatureChanges && !hasChangelogUpdate) {
      return {
        success: false,
        error: 'Feature changes detected but CHANGELOG.md not updated'
      };
    }
    
    return { success: true };
    
  } catch (error) {
    return { 
      skipped: true, 
      reason: 'Could not check CHANGELOG update'
    };
  }
}

async function checkCommitMessages() {
  try {
    // 最新のコミットメッセージを取得
    const commitMessages = execSync('git log origin/master..HEAD --pretty=format:"%s"', { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).split('\n').filter(Boolean);
    
    if (commitMessages.length === 0) {
      return { 
        skipped: true, 
        reason: 'No new commits found'
      };
    }
    
    const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}/;
    
    const invalidCommits = commitMessages.filter(msg => 
      !conventionalCommitPattern.test(msg)
    );
    
    if (invalidCommits.length > 0) {
      return {
        success: false,
        error: 'Some commit messages do not follow conventional commit format',
        details: `Invalid commits: ${invalidCommits.slice(0, 3).join(', ')}${invalidCommits.length > 3 ? '...' : ''}`
      };
    }
    
    return { success: true };
    
  } catch (error) {
    return { 
      skipped: true, 
      reason: 'Could not check commit messages'
    };
  }
}

async function checkBranchNaming() {
  try {
    const currentBranch = execSync('git branch --show-current', { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
    
    // dev ブランチは常に有効
    if (currentBranch === 'dev') {
      return { success: true };
    }
    
    // ブランチ命名規約: feature/*, fix/*, hotfix/*, docs/*, refactor/*, test/*
    const validBranchPattern = /^(feature|fix|hotfix|docs|refactor|test|chore)\/[a-z0-9-]+$/;
    
    if (!validBranchPattern.test(currentBranch)) {
      return {
        success: false,
        error: `Branch name "${currentBranch}" does not follow naming convention`,
        details: 'Expected format: type/description (e.g., feature/user-auth, fix/login-bug)'
      };
    }
    
    return { success: true };
    
  } catch (error) {
    return { 
      skipped: true, 
      reason: 'Could not check branch name'
    };
  }
}

// スクリプトが直接実行された場合のみ実行
if (import.meta.url === `file://${process.argv[1]}`) {
  runDoDCheck().catch(error => {
    console.error('❌ DoD check failed with error:', error.message);
    process.exit(1);
  });
}

export { runDoDCheck };