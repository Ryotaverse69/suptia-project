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

  const ingredientsData = JSON.parse(readFileSync('/tmp/ingredients-fresh.json', 'utf-8'));

  // Get all ingredient slugs to validate references
  const allSlugs = ingredientsData.map(ing => ing.slug);

  for (const ingredient of ingredientsData) {
    try {
      console.log(`📝 インポート中: ${ingredient.name} (${ingredient.slug})`);

      const docId = `ingredient-${ingredient.slug}`;

      // Convert relatedIngredients from slug strings to references
      // Only include references that exist in our data
      const relatedIngredients = (ingredient.relatedIngredients || [])
        .filter(slug => allSlugs.includes(slug))
        .map(slug => ({
          _type: 'reference',
          _ref: `ingredient-${slug}`,
          _key: slug,
        }));

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
        relatedIngredients,
        faqs: ingredient.faqs || [],
        references: ingredient.references || [],
      };

      await client.createOrReplace(doc);
      console.log(`✅ 成功: ${ingredient.name}\n`);
    } catch (error) {
      console.error(`❌ エラー (${ingredient.name}):`, error.message);
    }
  }

  console.log('🎉 インポート完了！');
}

importIngredients().catch(console.error);
