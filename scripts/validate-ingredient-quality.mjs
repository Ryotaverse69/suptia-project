#!/usr/bin/env node
/**
 * 成分データ品質バリデーション
 *
 * チェック項目:
 * 1. エビデンス・安全性レベルの設定
 * 2. RDA/UL値の設定
 * 3. 成分名の重複・表記ゆれ
 * 4. 商品との紐付け状況
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../apps/web/.env.local');
const envFile = readFileSync(envPath, 'utf-8');
const env = {};
envFile.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
});

// 必須成分（これらは必ずRDA/ULが設定されているべき）
const ESSENTIAL_INGREDIENTS = [
  'ビタミンC', 'ビタミンD', 'ビタミンE', 'ビタミンA', 'ビタミンK',
  'ビタミンB1', 'ビタミンB2', 'ビタミンB6', 'ビタミンB12',
  '葉酸', 'ビオチン', 'ナイアシン', 'パントテン酸',
  'カルシウム', 'マグネシウム', '亜鉛', '鉄', 'セレン', '銅',
  'DHA', 'EPA', 'オメガ3'
];

// 科学的に確立されたエビデンスレベル（参照用）
const EXPECTED_EVIDENCE = {
  // S (確立済み)
  'ビタミンC': 'S', 'ビタミンD': 'S', 'ビタミンB12': 'S',
  'カルシウム': 'S', 'マグネシウム': 'S', '亜鉛': 'S',
  '葉酸': 'S', 'DHA': 'S', 'EPA': 'S', 'クレアチン': 'S',
  // A (強いエビデンス)
  'ビタミンE': 'A', 'ビタミンB6': 'A', 'ビオチン': 'A',
  'ルテイン': 'A', 'プロバイオティクス': 'A',
  // B (中程度のエビデンス)
  'コラーゲン': 'B', 'グルコサミン': 'B', 'コエンザイムQ10': 'B',
};

async function main() {
  const outputJson = process.argv.includes('--json');
  const results = {
    timestamp: new Date().toISOString(),
    summary: {},
    issues: {
      critical: [],
      warning: [],
      info: []
    },
    recommendations: []
  };

  console.log('=== 成分データ品質バリデーション ===\n');

  // 1. 全成分データを取得
  const ingredients = await client.fetch(`
    *[_type == 'ingredient'] {
      _id,
      name,
      nameEn,
      evidenceLevel,
      safetyLevel,
      rda,
      ul,
      category,
      sideEffects,
      interactions
    }
  `);

  // 2. 商品データを取得（成分の使用状況確認用）
  const products = await client.fetch(`
    *[_type == 'product'] {
      _id,
      name,
      ingredients[] {
        ingredient-> { _id, name }
      }
    }
  `);

  // 成分の使用回数をカウント
  const ingredientUsage = new Map();
  for (const product of products) {
    if (!product.ingredients) continue;
    for (const ing of product.ingredients) {
      if (ing.ingredient?._id) {
        const count = ingredientUsage.get(ing.ingredient._id) || 0;
        ingredientUsage.set(ing.ingredient._id, count + 1);
      }
    }
  }

  console.log(`総成分数: ${ingredients.length}件`);
  console.log(`総商品数: ${products.length}件\n`);

  // 3. バリデーションチェック
  const issues = {
    noEvidenceLevel: [],
    noSafetyLevel: [],
    noRda: [],
    noUl: [],
    unusedIngredients: [],
    evidenceMismatch: [],
    duplicateName: [],
    noCategory: []
  };

  // 名前の重複チェック用
  const nameMap = new Map();

  for (const ing of ingredients) {
    const usage = ingredientUsage.get(ing._id) || 0;

    // エビデンスレベル未設定
    if (!ing.evidenceLevel) {
      issues.noEvidenceLevel.push({ name: ing.name, usage });
    }

    // 安全性レベル未設定
    if (!ing.safetyLevel) {
      issues.noSafetyLevel.push({ name: ing.name, usage });
    }

    // 必須成分のRDA未設定
    const isEssential = ESSENTIAL_INGREDIENTS.some(e => ing.name.includes(e));
    if (isEssential && !ing.rda) {
      issues.noRda.push({ name: ing.name, usage });
    }

    // カテゴリ未設定
    if (!ing.category) {
      issues.noCategory.push({ name: ing.name, usage });
    }

    // 未使用成分
    if (usage === 0) {
      issues.unusedIngredients.push({ name: ing.name });
    }

    // エビデンスレベルの妥当性チェック
    const expected = EXPECTED_EVIDENCE[ing.name];
    if (expected && ing.evidenceLevel && ing.evidenceLevel !== expected) {
      const rankOrder = ['D', 'C', 'B', 'A', 'S'];
      const currentIdx = rankOrder.indexOf(ing.evidenceLevel);
      const expectedIdx = rankOrder.indexOf(expected);
      // 2ランク以上の差がある場合のみ警告
      if (Math.abs(currentIdx - expectedIdx) >= 2) {
        issues.evidenceMismatch.push({
          name: ing.name,
          current: ing.evidenceLevel,
          expected
        });
      }
    }

    // 名前の重複チェック
    const normalizedName = ing.name.toLowerCase().replace(/[（）()]/g, '');
    if (nameMap.has(normalizedName)) {
      issues.duplicateName.push({
        name: ing.name,
        duplicate: nameMap.get(normalizedName)
      });
    } else {
      nameMap.set(normalizedName, ing.name);
    }
  }

  // 4. 結果出力
  console.log('━'.repeat(60));
  console.log('📊 バリデーション結果');
  console.log('━'.repeat(60));

  // Critical Issues
  if (issues.noEvidenceLevel.length > 0) {
    const critical = issues.noEvidenceLevel.filter(i => i.usage > 0);
    if (critical.length > 0) {
      console.log(`\n❌ エビデンスレベル未設定（使用中）: ${critical.length}件`);
      critical.slice(0, 5).forEach(i => console.log(`   - ${i.name} (${i.usage}商品で使用)`));
      results.issues.critical.push({
        type: 'no_evidence_level',
        count: critical.length,
        items: critical
      });
    }
  }

  if (issues.noSafetyLevel.length > 0) {
    const critical = issues.noSafetyLevel.filter(i => i.usage > 0);
    if (critical.length > 0) {
      console.log(`\n❌ 安全性レベル未設定（使用中）: ${critical.length}件`);
      critical.slice(0, 5).forEach(i => console.log(`   - ${i.name} (${i.usage}商品で使用)`));
      results.issues.critical.push({
        type: 'no_safety_level',
        count: critical.length,
        items: critical
      });
    }
  }

  // Warning Issues
  if (issues.noRda.length > 0) {
    console.log(`\n⚠️ 必須成分のRDA未設定: ${issues.noRda.length}件`);
    issues.noRda.slice(0, 5).forEach(i => console.log(`   - ${i.name}`));
    results.issues.warning.push({
      type: 'no_rda',
      count: issues.noRda.length,
      items: issues.noRda
    });
  }

  if (issues.evidenceMismatch.length > 0) {
    console.log(`\n⚠️ エビデンスレベル要確認: ${issues.evidenceMismatch.length}件`);
    issues.evidenceMismatch.forEach(i => {
      console.log(`   - ${i.name}: 現在=${i.current}, 推奨=${i.expected}`);
    });
    results.issues.warning.push({
      type: 'evidence_mismatch',
      count: issues.evidenceMismatch.length,
      items: issues.evidenceMismatch
    });
  }

  if (issues.duplicateName.length > 0) {
    console.log(`\n⚠️ 成分名の重複: ${issues.duplicateName.length}件`);
    issues.duplicateName.forEach(i => {
      console.log(`   - ${i.name} ≈ ${i.duplicate}`);
    });
    results.issues.warning.push({
      type: 'duplicate_name',
      count: issues.duplicateName.length,
      items: issues.duplicateName
    });
  }

  // Info
  if (issues.unusedIngredients.length > 0) {
    console.log(`\nℹ️ 未使用成分: ${issues.unusedIngredients.length}件`);
    results.issues.info.push({
      type: 'unused_ingredients',
      count: issues.unusedIngredients.length,
      items: issues.unusedIngredients.map(i => i.name)
    });
  }

  if (issues.noCategory.length > 0) {
    console.log(`ℹ️ カテゴリ未設定: ${issues.noCategory.length}件`);
    results.issues.info.push({
      type: 'no_category',
      count: issues.noCategory.length
    });
  }

  // サマリー
  const criticalCount = results.issues.critical.reduce((sum, i) => sum + i.count, 0);
  const warningCount = results.issues.warning.reduce((sum, i) => sum + i.count, 0);

  results.summary = {
    totalIngredients: ingredients.length,
    totalProducts: products.length,
    criticalIssues: criticalCount,
    warningIssues: warningCount,
    healthScore: Math.max(0, 100 - criticalCount * 10 - warningCount * 2)
  };

  console.log('\n' + '═'.repeat(60));
  console.log('📈 品質スコア');
  console.log('═'.repeat(60));
  console.log(`\n重大な問題: ${criticalCount}件`);
  console.log(`警告: ${warningCount}件`);
  console.log(`品質スコア: ${results.summary.healthScore}/100`);

  if (results.summary.healthScore < 80) {
    console.log('\n⚠️ 品質スコアが80未満です。修正を推奨します。');
    results.recommendations.push('品質スコアが低いため、成分データの見直しを推奨');
  }

  // JSON出力
  if (outputJson) {
    const outputPath = join(__dirname, '../reports/ingredient-quality-report.json');
    writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 レポートを出力: ${outputPath}`);
  }

  // 終了コード（CI用）
  if (criticalCount > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('エラー:', err);
  process.exit(1);
});
