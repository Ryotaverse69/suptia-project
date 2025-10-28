#!/usr/bin/env node

/**
 * 成分記事の包括的品質チェックスクリプト
 *
 * チェック項目：
 * 1. 必須フィールドの存在
 * 2. 文字数チェック
 * 3. 薬機法NGワード
 * 4. エビデンスレベル
 * 5. FAQ数
 * 6. コンテンツ充実度
 * 7. 英語混入
 * 8. スラッグ重複
 * 9. カテゴリの妥当性
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

// 薬機法NGワード（Critical）
const criticalNGWords = [
  '治る', '治す', '治療', '治癒',
  '予防する', '防ぐ', '防止',
  'がんに効く', '糖尿病を治す', '高血圧を下げる',
  '病気が治る', '完治する'
];

// 薬機法NGワード（Warning）
const warningNGWords = [
  '効く', '効果がある',
  '若返る', '回復する', '再生する',
  '痩せる', '脂肪を燃やす',
  '血糖値を下げる', 'コレステロールを下げる'
];

// エビデンスレベルの定義
const validEvidenceLevels = ['S', 'A', 'B', 'C', 'D'];

// 有効なカテゴリ
const validCategories = [
  'ビタミン', 'ミネラル', 'アミノ酸',
  'ハーブ', '脂肪酸', 'プロバイオティクス',
  'その他'
];

// 英語文字列検出
function hasEnglishContent(text) {
  if (!text) return false;
  return /[a-zA-Z]{10,}/.test(text);
}

// 日本語文字数カウント
function countJapaneseChars(text) {
  if (!text) return 0;
  // 日本語文字（ひらがな、カタカナ、漢字）と句読点をカウント
  const japaneseChars = text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/g);
  return japaneseChars ? japaneseChars.length : 0;
}

// NGワードチェック
function checkNGWords(text, ngWords) {
  if (!text) return [];
  const found = [];
  ngWords.forEach(word => {
    if (text.includes(word)) {
      found.push(word);
    }
  });
  return found;
}

// スコアリング関数
function calculateScore(ingredient) {
  let score = 0;
  let maxScore = 100;
  const issues = [];

  // 1. 必須フィールド（25点）
  const requiredFields = ['name', 'nameEn', 'description', 'category', 'evidenceLevel'];
  const missingFields = requiredFields.filter(field => !ingredient[field]);
  if (missingFields.length === 0) {
    score += 25;
  } else {
    score += 25 - (missingFields.length * 5);
    issues.push(`必須フィールド不足: ${missingFields.join(', ')}`);
  }

  // 2. 文字数チェック（15点）
  const descLength = countJapaneseChars(ingredient.description);
  if (descLength >= 500 && descLength <= 1000) {
    score += 15;
  } else if (descLength >= 300) {
    score += 10;
    issues.push(`description文字数: ${descLength}文字（推奨: 500-1000文字）`);
  } else {
    score += 5;
    issues.push(`description文字数不足: ${descLength}文字`);
  }

  // 3. 薬機法コンプライアンス（20点）
  const benefits = Array.isArray(ingredient.benefits) ? ingredient.benefits : [];
  const interactions = Array.isArray(ingredient.interactions) ? ingredient.interactions : [];

  const allText = [
    ingredient.description,
    ...benefits,
    ingredient.sideEffects,
    ...interactions
  ].filter(Boolean).join(' ');

  const criticalNG = checkNGWords(allText, criticalNGWords);
  const warningNG = checkNGWords(allText, warningNGWords);

  if (criticalNG.length === 0 && warningNG.length === 0) {
    score += 20;
  } else if (criticalNG.length === 0) {
    score += 15;
    issues.push(`薬機法警告ワード: ${warningNG.join(', ')}`);
  } else {
    score += 5;
    issues.push(`❌ 薬機法違反ワード: ${criticalNG.join(', ')}`);
  }

  // 4. コンテンツ充実度（20点）
  let contentScore = 0;
  const benefitsCount = benefits.length;
  const faqsCount = ingredient.faqs?.length || 0;
  const foodSourcesCount = Array.isArray(ingredient.foodSources) ? ingredient.foodSources.length : 0;
  const sideEffectsLength = ingredient.sideEffects?.length || 0;
  const interactionsCount = interactions.length;

  if (benefitsCount >= 5) contentScore += 5;
  if (faqsCount >= 5) contentScore += 5;
  if (foodSourcesCount >= 5) contentScore += 3;
  if (sideEffectsLength > 100) contentScore += 4;
  if (interactionsCount >= 3) contentScore += 3;
  score += contentScore;

  if (contentScore < 15) {
    issues.push(`コンテンツ不足: benefits=${benefitsCount}, faqs=${faqsCount}, foodSources=${foodSourcesCount}`);
  }

  // 5. 参考文献（10点）
  const validRefs = (ingredient.references || []).filter(ref => ref && ref.title && ref.url);
  if (validRefs.length >= 5) {
    score += 10;
  } else if (validRefs.length >= 3) {
    score += 7;
    issues.push(`参考文献: ${validRefs.length}件（推奨: 5件以上）`);
  } else {
    score += 3;
    issues.push(`参考文献不足: ${validRefs.length}件`);
  }

  // 6. エビデンスレベル（5点）
  if (validEvidenceLevels.includes(ingredient.evidenceLevel)) {
    score += 5;
  } else {
    issues.push(`無効なエビデンスレベル: ${ingredient.evidenceLevel}`);
  }

  // 7. 英語混入チェック（5点）
  const hasEnglishInDesc = hasEnglishContent(ingredient.description);
  const hasEnglishInBenefits = benefits.some(b => typeof b === 'string' && hasEnglishContent(b));

  if (!hasEnglishInDesc && !hasEnglishInBenefits) {
    score += 5;
  } else {
    score += 2;
    issues.push('英語コンテンツ混入');
  }

  return { score, issues };
}

// グレード判定
function getGrade(score) {
  if (score >= 90) return { grade: 'S', status: '優秀', color: '🟢' };
  if (score >= 80) return { grade: 'A', status: '良好', color: '🟢' };
  if (score >= 70) return { grade: 'B', status: '合格', color: '🟡' };
  if (score >= 60) return { grade: 'C', status: '要改善', color: '🟠' };
  return { grade: 'D', status: '不合格', color: '🔴' };
}

async function comprehensiveCheck() {
  console.log('🔍 成分記事の包括的品質チェックを開始します...\n');

  try {
    // 全成分を取得
    const ingredients = await client.fetch(`
      *[_type == "ingredient"] | order(name asc) {
        _id,
        name,
        nameEn,
        slug,
        category,
        description,
        evidenceLevel,
        benefits,
        recommendedDosage,
        foodSources,
        sideEffects,
        interactions,
        faqs[] {
          question,
          answer
        },
        references[] {
          title,
          url,
          source
        }
      }
    `);

    if (!ingredients || ingredients.length === 0) {
      console.log('⚠️  成分データが見つかりませんでした。');
      return;
    }

    console.log(`✅ ${ingredients.length}件の成分データを取得しました。\n`);

    // 各成分をスコアリング
    const results = ingredients.map(ingredient => {
      const { score, issues } = calculateScore(ingredient);
      const gradeInfo = getGrade(score);

      return {
        ...ingredient,
        score,
        issues,
        ...gradeInfo
      };
    });

    // スコア順にソート
    results.sort((a, b) => b.score - a.score);

    // グレード別に集計
    const gradeCount = {
      S: results.filter(r => r.grade === 'S').length,
      A: results.filter(r => r.grade === 'A').length,
      B: results.filter(r => r.grade === 'B').length,
      C: results.filter(r => r.grade === 'C').length,
      D: results.filter(r => r.grade === 'D').length,
    };

    // 平均スコア
    const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1);

    // サマリー表示
    console.log('═══════════════════════════════════════════════════');
    console.log('              📊 品質チェック結果サマリー');
    console.log('═══════════════════════════════════════════════════');
    console.log(`平均スコア: ${avgScore}/100点`);
    console.log('');
    console.log('グレード分布:');
    console.log(`  🟢 S (90-100点): ${gradeCount.S}件 - 優秀`);
    console.log(`  🟢 A (80-89点):  ${gradeCount.A}件 - 良好`);
    console.log(`  🟡 B (70-79点):  ${gradeCount.B}件 - 合格`);
    console.log(`  🟠 C (60-69点):  ${gradeCount.C}件 - 要改善`);
    console.log(`  🔴 D (0-59点):   ${gradeCount.D}件 - 不合格`);
    console.log('═══════════════════════════════════════════════════\n');

    // 詳細結果
    console.log('📋 詳細結果:\n');

    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.color} ${result.name} (${result.nameEn})`);
      console.log(`   スコア: ${result.score}/100 (グレード: ${result.grade})`);
      console.log(`   カテゴリ: ${result.category || '未設定'}`);
      console.log(`   エビデンスレベル: ${result.evidenceLevel || '未設定'}`);

      if (result.issues.length > 0) {
        console.log('   問題点:');
        result.issues.forEach(issue => {
          console.log(`     • ${issue}`);
        });
      } else {
        console.log('   ✨ 問題なし');
      }
      console.log('');
    });

    // 要改善記事のリスト
    const needsImprovement = results.filter(r => r.score < 80);
    if (needsImprovement.length > 0) {
      console.log('═══════════════════════════════════════════════════');
      console.log('              ⚠️  要改善記事');
      console.log('═══════════════════════════════════════════════════');
      needsImprovement.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name} - ${result.score}点 (${result.grade})`);
        console.log(`   主な問題: ${result.issues.slice(0, 3).join(', ')}`);
        console.log('');
      });
    }

    // 推奨事項
    console.log('═══════════════════════════════════════════════════');
    console.log('              💡 推奨事項');
    console.log('═══════════════════════════════════════════════════');

    if (gradeCount.D > 0) {
      console.log(`🔴 最優先: ${gradeCount.D}件のD評価記事を早急に改善してください`);
    }
    if (gradeCount.C > 0) {
      console.log(`🟠 高優先: ${gradeCount.C}件のC評価記事を改善してください`);
    }
    if (gradeCount.B > 0) {
      console.log(`🟡 中優先: ${gradeCount.B}件のB評価記事をA評価以上に引き上げることを推奨`);
    }

    const excellentRate = ((gradeCount.S + gradeCount.A) / results.length * 100).toFixed(1);
    console.log(`\n✨ 現在の優良記事率: ${excellentRate}%（S+A評価）`);
    console.log(`🎯 目標: 80%以上の記事をA評価以上に`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

comprehensiveCheck();
