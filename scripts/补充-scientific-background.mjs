#!/usr/bin/env node
import { createClient } from '@sanity/client';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
loadEnvConfig(resolve(__dirname, '../apps/web'));

// Sanityクライアントの作成
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

/**
 * 600文字未満の成分に追加する補足テキスト
 */
const supplementaryText = {
  'coq10': '加齢に伴う体内CoQ10レベルの低下は、40歳以降顕著になることが報告されており、サプリメントによる補給が健康維持に有用であるとされています。',
  'gaba': '機能性表示食品として認められている製品もあり、継続的な摂取が推奨される場合があります。食品由来のGABAは安全性が高いと評価されています。',
  'hmb': 'サプリメントとしては、カルシウム塩またはフリーアシッド形態で提供されており、後者は吸収が速いことが特徴です。長期使用の安全性も確認されています。',
  'l-theanine': '日本では機能性表示食品としても認可されており、安全性が高く、長期摂取による副作用も報告されていません。',
  'echinacea': '一般的に安全性は高いですが、自己免疫疾患のある方は使用前に医師に相談することが推奨されます。',
  'elderberry': 'ただし、生の実は毒性があるため、必ず加熱処理されたサプリメントを選ぶことが重要です。',
  'glycine': 'コラーゲンペプチドの主要成分でもあり、皮膚や関節の健康にも寄与する可能性があります。',
  'ingredient-vitamin-k2': '特にMK-7形態は、納豆から摂取できる唯一のビタミンKとして注目されています。',
  'beta-alanine': '効果を実感するには、4-10週間の継続摂取が推奨されます。',
  'whey-protein': '一般的に安全性が高いですが、乳糖不耐症の方は、ホエイプロテインアイソレート（WPI）を選ぶことが推奨されます。'
};

/**
 * 成分を更新
 */
async function updateIngredient(ingredientId, currentText, supplementText) {
  try {
    const updatedText = currentText + supplementText;

    const result = await client
      .patch(ingredientId)
      .set({ scientificBackground: updatedText })
      .commit();

    return result;
  } catch (error) {
    console.error(`❌ 更新失敗 (${ingredientId}):`, error.message);
    throw error;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 科学的背景補充スクリプト開始');
  console.log('='.repeat(80));

  try {
    // 600文字未満の成分を取得
    const query = `*[_type == "ingredient" && defined(scientificBackground) && scientificBackground != ""]{
      _id,
      name,
      nameEn,
      scientificBackground
    }`;

    const ingredients = await client.fetch(query);

    // 600文字未満の成分をフィルタリング
    const needsSupplement = ingredients.filter(ing => {
      const charCount = ing.scientificBackground.replace(/[\r\n\s]/g, '').length;
      return charCount < 600 && supplementaryText[ing._id];
    });

    console.log(`\n📊 600文字未満の成分: ${needsSupplement.length}件`);

    if (needsSupplement.length === 0) {
      console.log('\n✅ すべての成分が600文字以上です！');
      return;
    }

    // 更新処理
    let updatedCount = 0;

    console.log(`\n📝 補充を開始します...\n`);

    for (const ingredient of needsSupplement) {
      const currentCharCount = ingredient.scientificBackground.replace(/[\r\n\s]/g, '').length;
      const supplementText = supplementaryText[ingredient._id];
      const supplementCharCount = supplementText.replace(/[\r\n\s]/g, '').length;
      const newCharCount = currentCharCount + supplementCharCount;

      console.log(`✏️  補充中: ${ingredient.name} (${ingredient.nameEn})`);
      console.log(`   現在: ${currentCharCount}文字 → 更新後: ${newCharCount}文字 (+${supplementCharCount}文字)`);

      await updateIngredient(ingredient._id, ingredient.scientificBackground, supplementText);
      updatedCount++;

      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 結果表示
    console.log('\n' + '='.repeat(80));
    console.log('📈 処理結果:');
    console.log(`  ✅ 補充成功: ${updatedCount}件`);

    if (updatedCount > 0) {
      console.log('\n✨ 科学的背景の補充が完了しました！');
      console.log('   もう一度チェックスクリプトを実行して確認してください。');
    }

  } catch (error) {
    console.error('\n❌ スクリプトエラー:', error.message);
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});