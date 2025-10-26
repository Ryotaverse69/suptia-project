#!/usr/bin/env node

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../apps/web/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: envVars.SANITY_API_TOKEN,
  useCdn: false,
});

async function comprehensiveCheck() {
  console.log('🔍 包括的品質チェックを開始します...\n');

  const ingredients = await client.fetch(
    '*[_type == "ingredient"] | order(name asc) { name, description, benefits, recommendedDosage }'
  );

  console.log(`📊 ${ingredients.length}件の記事をチェック中...\n`);

  const issues = [];

  // チェックパターン
  const problematicPatterns = [
    { pattern: /健康的な状態の維持/, description: '健康的な状態の維持（不自然な表現）' },
    { pattern: /健康維持時間/, description: '健康維持時間' },
    { pattern: /健康維持を/, description: '健康維持を〜' },
    { pattern: /[◦•・]/, description: '箇条書きマーカー' },
    { pattern: /。。/, description: '二重句読点' },
    { pattern: /、、/, description: '二重読点' },
    { pattern: /\s{3,}/, description: '過剰な空白' },
    {
      pattern: /複数の査読付き論文により、この知見の信頼性が確認されています。.*複数の査読付き論文/,
      description: '繰り返しフレーズ（複数の査読付き論文）',
    },
    {
      pattern: /個人差があるため、少量から始めて徐々に調整することが推奨されます。.*個人差があるため/,
      description: '繰り返しフレーズ（個人差）',
    },
  ];

  for (const ingredient of ingredients) {
    let ingredientIssues = [];

    // description チェック
    problematicPatterns.forEach((check) => {
      if (check.pattern.test(ingredient.description)) {
        ingredientIssues.push(`description: ${check.description}`);
      }
    });

    // benefits チェック
    ingredient.benefits.forEach((benefit, index) => {
      // 末尾句点チェック
      if (!benefit.match(/[。！？]$/)) {
        ingredientIssues.push(`効果${index + 1}: 末尾に句点がありません`);
      }

      // パターンチェック
      problematicPatterns.forEach((check) => {
        if (check.pattern.test(benefit)) {
          ingredientIssues.push(`効果${index + 1}: ${check.description}`);
        }
      });

      // 長すぎる文（300文字以上）
      if (benefit.length > 300) {
        ingredientIssues.push(`効果${index + 1}: 長すぎる（${benefit.length}文字）`);
      }
    });

    // recommendedDosage チェック
    if (ingredient.recommendedDosage) {
      // 【】の後に改行がない
      if (ingredient.recommendedDosage.includes('】') && !ingredient.recommendedDosage.includes('】\n')) {
        ingredientIssues.push(`推奨摂取量: 【】の後に改行がありません`);
      }
    }

    if (ingredientIssues.length > 0) {
      issues.push({
        name: ingredient.name,
        issues: ingredientIssues,
      });
    }
  }

  if (issues.length === 0) {
    console.log('✅ すべての記事で問題は検出されませんでした');
  } else {
    console.log(`⚠️  ${issues.length}件の記事で問題が検出されました\n`);

    issues.forEach((item) => {
      console.log('='.repeat(80));
      console.log(`📄 ${item.name}`);
      console.log('='.repeat(80));
      item.issues.forEach((issue) => {
        console.log(`  ⚠️  ${issue}`);
      });
      console.log('');
    });
  }

  console.log('='.repeat(80));
  console.log('✅ チェック完了');
  console.log('='.repeat(80));
}

comprehensiveCheck().catch((error) => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
