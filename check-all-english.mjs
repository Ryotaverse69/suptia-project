import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// Read token directly from .env.local
const envFile = readFileSync('apps/web/.env.local', 'utf8');
const tokenMatch = envFile.match(/SANITY_API_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token,
  useCdn: false,
});

const slugs = [
  'omega-3', 'magnesium', 'zinc', 'vitamin-a', 'vitamin-k', 'vitamin-b12',
  'vitamin-c', 'vitamin-d', 'vitamin-e', 'niacin', 'calcium', 'iron',
  'bcaa', 'nac', 'protein', 'probiotics', 'vitamin-b-complex', 'folic-acid',
  'coenzyme-q10', 'collagen', 'glucosamine', 'lutein', 'ashwagandha',
  'magnesium-glycinate', 'chromium', 'iodine', 'selenium', 'potassium'
];

// Check if a string contains substantial English content
// Ignores common abbreviations, units, and technical terms mixed in Japanese text
function hasEnglish(text) {
  if (!text) return false;
  if (typeof text === 'string') {
    // Check for English sentences (at least 5 common English words)
    // This is more strict and focuses on actual English sentences
    const commonEnglishWords = /\b(the|is|are|was|were|been|being|have|has|had|do|does|did|will|would|should|could|may|might|can|must|of|in|on|at|to|for|with|from|by|about|through|during|before|after|above|below|between|among|under|over|into|onto|upon|within|without|against|towards|toward|throughout)\b/gi;
    const matches = text.match(commonEnglishWords);
    // Consider it English if there are 5+ common English words
    return matches && matches.length >= 5;
  }
  if (Array.isArray(text)) {
    return text.some(item => hasEnglish(item));
  }
  return false;
}

async function checkAllIngredients() {
  console.log('Checking all ingredients for English content...\n');

  const results = [];

  for (const slug of slugs) {
    const ingredient = await client.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]{
        slug,
        name,
        benefits,
        recommendedDosage,
        sideEffects,
        interactions,
        scientificBackground,
        foodSources,
        faqs
      }`,
      { slug }
    );

    if (!ingredient) {
      console.log(`❌ Not found: ${slug}`);
      continue;
    }

    const englishFields = [];

    if (hasEnglish(ingredient.benefits)) englishFields.push('benefits');
    if (hasEnglish(ingredient.recommendedDosage)) englishFields.push('recommendedDosage');
    if (hasEnglish(ingredient.sideEffects)) englishFields.push('sideEffects');
    if (hasEnglish(ingredient.interactions)) englishFields.push('interactions');
    if (hasEnglish(ingredient.scientificBackground)) englishFields.push('scientificBackground');
    if (hasEnglish(ingredient.foodSources)) englishFields.push('foodSources');
    if (hasEnglish(ingredient.faqs)) englishFields.push('faqs');

    if (englishFields.length > 0) {
      console.log(`🔴 ${ingredient.name} (${slug}): ${englishFields.join(', ')}`);
      results.push({ slug, name: ingredient.name, fields: englishFields });
    } else {
      console.log(`✅ ${ingredient.name} (${slug}): All Japanese`);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Total ingredients checked: ${slugs.length}`);
  console.log(`Ingredients with English: ${results.length}`);

  if (results.length > 0) {
    console.log('\nIngredients needing translation:');
    results.forEach(r => {
      console.log(`  - ${r.name} (${r.slug}): ${r.fields.join(', ')}`);
    });
  }

  return results;
}

checkAllIngredients().catch(console.error);
