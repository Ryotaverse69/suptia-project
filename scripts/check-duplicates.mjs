import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkDuplicates() {
  const data = await client.fetch('*[_type == "ingredient"] | order(slug.current asc) { _id, slug, name, description }');
  
  const slugCounts = {};
  data.forEach(doc => {
    const slug = doc.slug.current;
    if (slugCounts[slug] === undefined) slugCounts[slug] = [];
    slugCounts[slug].push({ _id: doc._id, name: doc.name, descLength: doc.description?.length || 0 });
  });
  
  console.log('重複チェック:\n');
  Object.entries(slugCounts).forEach(([slug, docs]) => {
    if (docs.length > 1) {
      console.log(`❌ ${slug}: ${docs.length}件`);
      docs.forEach(d => console.log(`   - ${d._id} (${d.name}, ${d.descLength}文字)`));
    }
  });
  
  const totalDocs = data.length;
  const uniqueSlugs = Object.keys(slugCounts).length;
  console.log(`\n合計: ${totalDocs}件のドキュメント`);
  console.log(`ユニークなスラッグ: ${uniqueSlugs}件`);
  console.log(`重複: ${totalDocs - uniqueSlugs}件`);
}

checkDuplicates().catch(console.error);
