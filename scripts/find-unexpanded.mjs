import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function findUnexpanded() {
  const data = await client.fetch('*[_type == "ingredient"] | order(slug.current asc) { slug, name, description, benefits }');
  
  const expandedSlugs = ['vitamin-c', 'vitamin-d', 'omega-3', 'vitamin-e', 'zinc', 'magnesium', 'iron', 'calcium', 'vitamin-b-complex', 'folic-acid', 'collagen', 'protein', 'probiotics'];
  
  console.log('未拡張の記事:\n');
  const unexpanded = [];
  data.forEach(doc => {
    const slug = doc.slug.current;
    if (!expandedSlugs.includes(slug)) {
      const descLength = doc.description?.length || 0;
      const benefitsCount = doc.benefits?.length || 0;
      console.log(`  - ${slug} (${doc.name}, 説明:${descLength}文字, 効果:${benefitsCount}個)`);
      unexpanded.push({ slug, name: doc.name, descLength, benefitsCount });
    }
  });
  
  console.log(`\n合計: ${unexpanded.length}件の未拡張記事`);
}

findUnexpanded().catch(console.error);
