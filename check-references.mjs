import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

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

async function checkReferences() {
  console.log('Checking references for all ingredients...\n');

  const results = [];

  for (const slug of slugs) {
    const ingredient = await client.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]{
        name,
        slug,
        references
      }`,
      { slug }
    );

    if (!ingredient) {
      console.log(`❌ Not found: ${slug}`);
      continue;
    }

    if (!ingredient.references || ingredient.references.length === 0) {
      console.log(`🔴 ${ingredient.name} (${slug}): No references`);
      results.push({ slug, name: ingredient.name, count: 0, issue: 'missing' });
    } else {
      // Check for missing URLs
      const missingUrls = ingredient.references.filter(ref => !ref.url);
      if (missingUrls.length > 0) {
        console.log(`⚠️  ${ingredient.name} (${slug}): ${ingredient.references.length} references, ${missingUrls.length} missing URLs`);
        missingUrls.forEach((ref, i) => {
          console.log(`   ${i + 1}. ${ref.title || 'No title'}`);
        });
        results.push({
          slug,
          name: ingredient.name,
          count: ingredient.references.length,
          missingUrls: missingUrls.length,
          issue: 'incomplete'
        });
      } else {
        console.log(`✅ ${ingredient.name} (${slug}): ${ingredient.references.length} references with URLs`);
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Total ingredients checked: ${slugs.length}`);
  console.log(`Ingredients with missing references: ${results.filter(r => r.issue === 'missing').length}`);
  console.log(`Ingredients with incomplete references: ${results.filter(r => r.issue === 'incomplete').length}`);

  if (results.length > 0) {
    console.log('\nIngredients needing references:');
    results.forEach(r => {
      if (r.issue === 'missing') {
        console.log(`  - ${r.name} (${r.slug}): No references`);
      } else {
        console.log(`  - ${r.name} (${r.slug}): ${r.missingUrls} missing URLs out of ${r.count}`);
      }
    });
  }

  return results;
}

checkReferences().catch(console.error);
