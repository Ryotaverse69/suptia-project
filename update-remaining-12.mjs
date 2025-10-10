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

const articlesToUpdate = [
  { file: 'magnesium-article.json', id: 'ingredient-magnesium', fields: ['scientificBackground'] },
  { file: 'vitamin-a-article.json', id: 'pRlcpvz6Xc5z2Mc0MBzKZo', fields: ['scientificBackground'] },
  { file: 'vitamin-b12-article.json', id: '7MAYpyO4GR94MtR0V9EtND', fields: ['scientificBackground'] },
  { file: 'vitamin-d-article.json', id: 'ingredient-vitamin-d', fields: ['scientificBackground'] },
  { file: 'vitamin-e-article.json', id: 'ingredient-vitamin-e', fields: ['scientificBackground'] },
  { file: 'niacin-article.json', id: 'pRlcpvz6Xc5z2Mc0MBzKvk', fields: ['scientificBackground'] },
  { file: 'calcium-article.json', id: 'ingredient-calcium', fields: ['scientificBackground'] },
  { file: 'bcaa-article.json', id: 'ingredient-bcaa', fields: ['scientificBackground'] },
  { file: 'nac-article.json', id: 'ingredient-nac', fields: ['scientificBackground'] },
  { file: 'protein-article.json', id: 'ingredient-protein', fields: ['benefits', 'recommendedDosage', 'sideEffects', 'interactions', 'scientificBackground', 'foodSources'] },
  { file: 'probiotics-article.json', id: 'ingredient-probiotics', fields: ['benefits', 'recommendedDosage', 'sideEffects', 'interactions', 'scientificBackground', 'foodSources'] },
  { file: 'vitamin-b-complex-article.json', id: 'ingredient-vitamin-b-complex', fields: ['benefits', 'recommendedDosage', 'sideEffects', 'interactions', 'scientificBackground', 'foodSources'] },
];

const mutations = [];

for (const article of articlesToUpdate) {
  try {
    const data = JSON.parse(readFileSync(article.file, 'utf8'));

    const updateData = {};
    article.fields.forEach(field => {
      if (data[field]) {
        updateData[field] = data[field];
      }
    });

    mutations.push({
      patch: {
        id: article.id,
        set: updateData
      }
    });

    console.log(`✓ Prepared: ${data.name} (${article.fields.join(', ')})`);
  } catch (error) {
    console.error(`✗ Error reading ${article.file}:`, error.message);
  }
}

console.log(`\n✓ Created mutations for ${mutations.length} articles`);
console.log('Sending to Sanity...\n');

try {
  const response = await fetch('https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error response:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('✅ Success! Updated', result.results?.length || 0, 'documents');
  console.log('\nTransaction ID:', result.transactionId);

} catch (error) {
  console.error('Error executing mutations:', error.message);
  process.exit(1);
}
