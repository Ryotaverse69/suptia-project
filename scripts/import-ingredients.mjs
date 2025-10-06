#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function importIngredients() {
  console.log('🚀 Sanityに成分データをインポートします...\n');

  // JSONファイルを読み込み
  const ingredientsData = JSON.parse(readFileSync('/tmp/ingredients.json', 'utf-8'));

  for (const ingredient of ingredientsData) {
    try {
      console.log(`📝 インポート中: ${ingredient.name} (${ingredient.slug})`);

      // スラッグからドキュメントIDを生成
      const docId = `ingredient-${ingredient.slug}`;

      // Sanity用のデータ構造に変換
      const doc = {
        _id: docId,
        _type: 'ingredient',
        name: ingredient.name,
        nameEn: ingredient.nameEn,
        slug: {
          _type: 'slug',
          current: ingredient.slug,
        },
        category: ingredient.category,
        description: ingredient.description,
        benefits: ingredient.benefits,
        recommendedDosage: ingredient.recommendedDosage,
        sideEffects: ingredient.sideEffects || [],
        interactions: ingredient.interactions || [],
        evidenceLevel: ingredient.evidenceLevel,
        scientificBackground: ingredient.scientificBackground,
        foodSources: ingredient.foodSources || [],
        faqs: ingredient.faqs || [],
        references: ingredient.references || [],
      };

      // createOrReplaceでドキュメントを作成または更新
      await client.createOrReplace(doc);
      console.log(`✅ 成功: ${ingredient.name}\n`);
    } catch (error) {
      console.error(`❌ エラー (${ingredient.name}):`, error.message);
    }
  }

  console.log('🎉 インポート完了！');
}

// 実行
importIngredients().catch(console.error);
