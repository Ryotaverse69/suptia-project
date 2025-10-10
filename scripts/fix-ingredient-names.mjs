import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

const updates = [
  {
    id: 'ingredient.ashwagandha',
    name: 'アシュワガンダ',
  },
  {
    id: 'ingredient.magnesium-glycinate',
    name: 'マグネシウムグリシネート',
  },
];

async function fixNames() {
  console.log('名前を修正します...\n');

  for (const update of updates) {
    try {
      console.log(`Updating: ${update.id}...`);

      await client
        .patch(update.id)
        .set({ name: update.name })
        .commit();

      console.log(`  ✓ Updated to: ${update.name}\n`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
    }
  }

  console.log('完了しました！');
}

fixNames();
