import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const query = `*[_type == 'ingredient']{ 'slug': slug.current } | order(slug asc)`;
const ingredients = await client.fetch(query);
console.log(ingredients.map(i => i.slug).join('\n'));
