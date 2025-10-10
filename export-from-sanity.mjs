import { createClient } from '@sanity/client';
import { writeFileSync, readFileSync } from 'fs';

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

const slugs = [
  'omega-3', 'magnesium', 'zinc', 'vitamin-a', 'vitamin-k', 'vitamin-b12',
  'vitamin-c', 'vitamin-d', 'vitamin-e', 'niacin', 'calcium', 'iron',
  'bcaa', 'nac', 'protein', 'probiotics', 'vitamin-b-complex', 'folic-acid',
  'coenzyme-q10', 'collagen', 'glucosamine', 'lutein', 'ashwagandha',
  'magnesium-glycinate', 'chromium', 'iodine', 'selenium', 'potassium'
];

console.log('Exporting ingredients from Sanity...\n');

for (const slug of slugs) {
  try {
    const ingredient = await client.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]{
        name,
        nameEn,
        slug,
        category,
        evidenceLevel,
        description,
        benefits,
        recommendedDosage,
        sideEffects,
        interactions,
        scientificBackground,
        foodSources,
        faqs,
        references,
        seoTitle,
        seoDescription,
        seoKeywords,
        relatedIngredients
      }`,
      { slug }
    );

    if (!ingredient) {
      console.log(`❌ Not found: ${slug}`);
      continue;
    }

    // Simplify slug format for JSON
    const data = {
      ...ingredient,
      slug: ingredient.slug.current,
    };

    const filename = `${slug}-article.json`;
    writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`✓ Exported: ${ingredient.name} -> ${filename}`);

  } catch (error) {
    console.error(`✗ Error exporting ${slug}:`, error.message);
  }
}

console.log('\n✅ Export complete!');
