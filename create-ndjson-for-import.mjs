import { readFileSync, writeFileSync } from 'fs';

const articleFiles = [
  { file: 'omega3-article.json', id: 'ingredient-omega-3' },
  { file: 'magnesium-article.json', id: 'ingredient-magnesium' },
  { file: 'zinc-article.json', id: 'ingredient-zinc' },
  { file: 'vitamin-a-article.json', id: 'pRlcpvz6Xc5z2Mc0MBzKZo' },
  { file: 'vitamin-k-article.json', id: '7MAYpyO4GR94MtR0V9EtGp' },
  { file: 'vitamin-b12-article.json', id: '7MAYpyO4GR94MtR0V9EtND' },
  { file: 'vitamin-c-article.json', id: 'ingredient-vitamin-c' },
  { file: 'vitamin-d-article.json', id: 'ingredient-vitamin-d' },
  { file: 'vitamin-e-article.json', id: 'ingredient-vitamin-e' },
  { file: 'niacin-article.json', id: 'pRlcpvz6Xc5z2Mc0MBzKvk' },
  { file: 'calcium-article.json', id: 'ingredient-calcium' },
  { file: 'iron-article.json', id: 'ingredient-iron' },
  { file: 'bcaa-article.json', id: 'ingredient-bcaa' },
  { file: 'nac-article.json', id: 'ingredient-nac' },
  { file: 'protein-article.json', id: 'ingredient-protein' },
  { file: 'probiotics-article.json', id: 'ingredient-probiotics' },
  { file: 'vitamin-b-complex-article.json', id: 'ingredient-vitamin-b-complex' },
  { file: 'folic-acid-article.json', id: 'ingredient-folic-acid' },
  { file: 'coenzyme-q10-article.json', id: 'ingredient-coenzyme-q10' },
  { file: 'collagen-article.json', id: 'ingredient-collagen' },
  { file: 'glucosamine-article.json', id: 'P1Z7m8fgwpF7BuhejyHKwp' },
  { file: 'lutein-article.json', id: 'P1Z7m8fgwpF7BuhejyHKyQ' },
  { file: 'chromium-article.json', id: '5v8OuqFn5O4X8PYE5dNIcu' },
  { file: 'iodine-article.json', id: '5v8OuqFn5O4X8PYE5dNHii' },
  { file: 'selenium-article.json', id: 'pRlcpvz6Xc5z2Mc0MDNC2G' },
  { file: 'potassium-article.json', id: '5v8OuqFn5O4X8PYE5dNHcE' },
];

const mutations = [];

for (const article of articleFiles) {
  try {
    const data = JSON.parse(readFileSync(article.file, 'utf8'));

    mutations.push({
      patch: {
        id: article.id,
        set: {
          benefits: data.benefits,
          recommendedDosage: data.recommendedDosage,
          sideEffects: data.sideEffects,
          interactions: data.interactions,
          scientificBackground: data.scientificBackground,
          foodSources: data.foodSources,
          faqs: data.faqs,
        }
      }
    });

    console.log(`✓ Added: ${data.name}`);
  } catch (error) {
    console.error(`✗ Error reading ${article.file}:`, error.message);
  }
}

// Write to NDJSON file
const ndjson = mutations.map(m => JSON.stringify(m)).join('\n');
writeFileSync('update-all-ingredients.ndjson', ndjson);

console.log(`\n✓ Created update-all-ingredients.ndjson with ${mutations.length} mutations`);
console.log('\nTo import, run:');
console.log('curl -X POST https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production \\');
console.log('  -H "Authorization: Bearer $SANITY_API_TOKEN" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d @update-all-ingredients.ndjson');
