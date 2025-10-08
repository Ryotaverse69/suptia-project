#!/usr/bin/env node

import { writeFileSync } from 'fs';

// TypeScriptファイルのパスをdynamic importで読み込む
const module = await import('../apps/web/src/data/ingredients.ts');
const ingredientsData = module.ingredientsData;

const jsonData = ingredientsData.map(ingredient => ({
  name: ingredient.name,
  nameEn: ingredient.nameEn,
  slug: ingredient.slug,
  category: ingredient.category,
  description: ingredient.description,
  benefits: ingredient.benefits,
  recommendedDosage: ingredient.recommendedDosage,
  sideEffects: ingredient.sideEffects,
  interactions: ingredient.interactions,
  evidenceLevel: ingredient.evidenceLevel,
  scientificBackground: ingredient.scientificBackground,
  foodSources: ingredient.foodSources,
  relatedIngredients: ingredient.relatedIngredients,
  faqs: ingredient.faqs,
  references: ingredient.references,
}));

writeFileSync('/tmp/ingredients-fresh.json', JSON.stringify(jsonData, null, 2));
console.log(`✅ ${jsonData.length}件の成分データを /tmp/ingredients-fresh.json にエクスポートしました`);
