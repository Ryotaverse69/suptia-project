import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function deleteDuplicates() {
  const slugs = ['calcium', 'folic-acid', 'iron', 'magnesium', 'vitamin-b-complex', 'vitamin-e', 'zinc'];
  
  for (const slug of slugs) {
    const docs = await client.fetch('*[_type == "ingredient" && slug.current == $slug]{ _id, description }', { slug });
    
    if (docs.length > 1) {
      const toDelete = docs.find(d => d.description.length < 150);
      if (toDelete) {
        console.log(`削除: ${slug} (${toDelete._id})`);
        await client.delete(toDelete._id);
        console.log('  ✅ 削除完了');
      }
    }
  }
  
  console.log('\n完了！');
}

deleteDuplicates().catch(console.error);
