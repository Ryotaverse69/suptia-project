import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
});

const ingredients = await client.fetch(`*[_type == 'ingredient' && (!defined(references) || count(references) == 0)]{
  _id,
  name,
  nameEn,
  'slug': slug.current
} | order(name asc)`);

console.log('=== 参考文献なし成分一覧 ===\n');
ingredients.forEach((ing, i) => {
  const nameEn = ing.nameEn || 'N/A';
  const slug = ing.slug || 'null';
  console.log((i+1) + '. ' + ing.name + ' (' + nameEn + ')');
  console.log('   _id: ' + ing._id);
  console.log('   slug: ' + slug + '\n');
});
