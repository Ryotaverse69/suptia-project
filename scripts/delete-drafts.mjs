import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function deleteDrafts() {
  const toDelete = [
    'drafts.01d3fc3a-0b11-4ca0-a9e4-235e5e1573f5',
    'drafts.ingredient.vitamin-c',
    'ingredient.vitamin-c'
  ];

  for (const id of toDelete) {
    console.log('削除:', id);
    await client.delete(id);
    console.log('  ✅ 削除完了');
  }

  console.log('\n完了！');
}

deleteDrafts().catch(console.error);
