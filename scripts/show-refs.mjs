import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
});

const slugs = ['potassium', 'glucosamine', 'collagen', 'probiotics', 'magnesium-glycinate', 'iodine', 'lutein', 'folic-acid'];

const data = await client.fetch(`*[_type == 'ingredient' && slug.current in $slugs]{
  name,
  'slug': slug.current,
  references
}`, { slugs });

data.forEach(ing => {
  console.log(`\n=== ${ing.name} (${ing.slug}) ===`);
  if (ing.references) {
    ing.references.forEach((ref, i) => {
      const title = typeof ref === 'string' ? ref : ref.title;
      console.log(`${i+1}. ${title}`);
    });
  }
});
