import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const articleFiles = [
  { file: 'omega3-article.json', slug: 'omega-3', id: 'ingredient-omega-3' },
  { file: 'magnesium-article.json', slug: 'magnesium', id: 'ingredient-magnesium' },
  { file: 'zinc-article.json', slug: 'zinc', id: 'ingredient-zinc' },
  { file: 'vitamin-a-article.json', slug: 'vitamin-a', id: 'pRlcpvz6Xc5z2Mc0MBzKZo' },
  { file: 'vitamin-k-article.json', slug: 'vitamin-k', id: '7MAYpyO4GR94MtR0V9EtGp' },
  { file: 'vitamin-b12-article.json', slug: 'vitamin-b12', id: '7MAYpyO4GR94MtR0V9EtND' },
  { file: 'vitamin-c-article.json', slug: 'vitamin-c', id: 'ingredient-vitamin-c' },
  { file: 'vitamin-d-article.json', slug: 'vitamin-d', id: 'ingredient-vitamin-d' },
  { file: 'vitamin-e-article.json', slug: 'vitamin-e', id: 'ingredient-vitamin-e' },
  { file: 'niacin-article.json', slug: 'niacin', id: 'pRlcpvz6Xc5z2Mc0MBzKvk' },
  { file: 'calcium-article.json', slug: 'calcium', id: 'ingredient-calcium' },
  { file: 'iron-article.json', slug: 'iron', id: 'ingredient-iron' },
  { file: 'bcaa-article.json', slug: 'bcaa', id: 'ingredient-bcaa' },
  { file: 'nac-article.json', slug: 'nac', id: 'ingredient-nac' },
  { file: 'protein-article.json', slug: 'protein', id: 'ingredient-protein' },
  { file: 'probiotics-article.json', slug: 'probiotics', id: 'ingredient-probiotics' },
  { file: 'vitamin-b-complex-article.json', slug: 'vitamin-b-complex', id: 'ingredient-vitamin-b-complex' },
  { file: 'folic-acid-article.json', slug: 'folic-acid', id: 'ingredient-folic-acid' },
  { file: 'coenzyme-q10-article.json', slug: 'coenzyme-q10', id: 'ingredient-coenzyme-q10' },
  { file: 'collagen-article.json', slug: 'collagen', id: 'ingredient-collagen' },
  { file: 'glucosamine-article.json', slug: 'glucosamine', id: 'P1Z7m8fgwpF7BuhejyHKwp' },
  { file: 'lutein-article.json', slug: 'lutein', id: 'P1Z7m8fgwpF7BuhejyHKyQ' },
  { file: 'chromium-article.json', slug: 'chromium', id: '5v8OuqFn5O4X8PYE5dNIcu' },
  { file: 'iodine-article.json', slug: 'iodine', id: '5v8OuqFn5O4X8PYE5dNHii' },
  { file: 'selenium-article.json', slug: 'selenium', id: 'pRlcpvz6Xc5z2Mc0MDNC2G' },
  { file: 'potassium-article.json', slug: 'potassium', id: '5v8OuqFn5O4X8PYE5dNHcE' },
];

async function updateAllArticles() {
  console.log('Updating all 26 articles in Sanity...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const article of articleFiles) {
    try {
      const data = JSON.parse(readFileSync(article.file, 'utf8'));

      console.log(`Processing: ${data.name} (${article.slug})...`);

      // Prepare update data
      const updateData = {
        benefits: data.benefits,
        recommendedDosage: data.recommendedDosage,
        sideEffects: data.sideEffects,
        interactions: data.interactions,
        scientificBackground: data.scientificBackground,
        foodSources: data.foodSources,
        faqs: data.faqs,
      };

      // Update using patch
      await client
        .patch(article.id)
        .set(updateData)
        .commit();

      console.log(`✓ Updated: ${data.name}\n`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Error updating ${article.slug}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

updateAllArticles().catch(console.error);
