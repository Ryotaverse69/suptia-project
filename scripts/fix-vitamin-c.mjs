import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function fixVitaminC() {
  const data = JSON.parse(readFileSync('/tmp/ingredients-fresh.json', 'utf-8'));
  const vitaminC = data.find(i => i.slug === 'vitamin-c');
  
  const doc = {
    _id: 'ingredient.vitamin-c',
    _type: 'ingredient',
    name: vitaminC.name,
    nameEn: vitaminC.nameEn,
    slug: { _type: 'slug', current: vitaminC.slug },
    category: vitaminC.category,
    description: vitaminC.description,
    benefits: vitaminC.benefits,
    recommendedDosage: vitaminC.recommendedDosage,
    sideEffects: vitaminC.sideEffects || [],
    interactions: vitaminC.interactions || [],
    evidenceLevel: vitaminC.evidenceLevel,
    scientificBackground: vitaminC.scientificBackground,
    foodSources: vitaminC.foodSources || [],
    relatedIngredients: vitaminC.relatedIngredients || [],
    faqs: vitaminC.faqs || [],
    references: vitaminC.references || [],
  };
  
  console.log('ingredient.vitamin-c を更新中...');
  await client.createOrReplace(doc);
  console.log('✅ 更新完了');
  
  console.log('ingredient-vitamin-c を削除中...');
  await client.delete('ingredient-vitamin-c');
  console.log('✅ 削除完了');
  
  console.log('\n完了！');
}

fixVitaminC().catch(console.error);
