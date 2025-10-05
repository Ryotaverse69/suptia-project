import { createClient } from '@sanity/client';
import fs from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixIngredients() {
  const correctData = fs.readFileSync('scripts/popular-ingredients.ndjson', 'utf-8')
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));

  console.log('Loaded', correctData.length, 'correct ingredient records');

  const slugs = correctData.map(item => item.slug.current);

  const ingredients = await client.fetch(
    '*[_type == "ingredient" && slug.current in $slugs]',
    { slugs }
  );

  console.log('Found', ingredients.length, 'ingredient documents to update');

  const mutations = [];

  for (const ingredient of ingredients) {
    const correctItem = correctData.find(
      item => item.slug.current === ingredient.slug.current
    );

    if (!correctItem) continue;

    const needsUpdate =
      typeof ingredient.sideEffects === 'string' ||
      typeof ingredient.interactions === 'string';

    if (needsUpdate) {
      console.log('Adding mutation for:', ingredient.name);

      mutations.push({
        patch: {
          id: ingredient._id,
          set: {
            sideEffects: Array.isArray(correctItem.sideEffects)
              ? correctItem.sideEffects
              : [correctItem.sideEffects],
            interactions: Array.isArray(correctItem.interactions)
              ? correctItem.interactions
              : [correctItem.interactions],
          }
        }
      });
    }
  }

  if (mutations.length === 0) {
    console.log('No updates needed!');
    return;
  }

  console.log('Executing', mutations.length, 'mutations...');

  const result = await client.mutate(mutations);

  console.log('Successfully updated ingredients!');
  console.log('Updated:', mutations.length, 'documents');
}

fixIngredients().catch(err => {
  console.error('Error:', err.message);
  if (err.response) {
    console.error('Response:', JSON.stringify(err.response.body, null, 2));
  }
  process.exit(1);
});
