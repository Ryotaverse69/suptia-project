import { readFileSync } from 'fs';

const token = readFileSync('apps/web/.env.local', 'utf8')
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

const articles = [
  { file: 'creatine-article.json', slug: 'creatine' },
  { file: 'turmeric-article.json', slug: 'turmeric' },
  { file: 'ginkgo-article.json', slug: 'ginkgo' },
  { file: 'l-carnitine-article.json', slug: 'l-carnitine' },
  { file: 'astaxanthin-article.json', slug: 'astaxanthin' }
];

const mutations = [];

for (const article of articles) {
  const data = JSON.parse(readFileSync(article.file, 'utf8'));

  const doc = {
    _type: 'ingredient',
    _id: `ingredient-${article.slug}`,
    name: data.name,
    nameEn: data.nameEn,
    slug: { _type: 'slug', current: data.slug },
    category: data.category,
    evidenceLevel: data.evidenceLevel,
    description: data.description,
    benefits: data.benefits,
    recommendedDosage: data.recommendedDosage,
    sideEffects: data.sideEffects,
    interactions: data.interactions,
    scientificBackground: data.scientificBackground,
    foodSources: data.foodSources,
    faqs: data.faqs,
    references: data.references,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoKeywords: data.seoKeywords,
    relatedIngredients: data.relatedIngredients?.map(ref => ({
      _type: 'reference',
      _ref: ref
    })) || []
  };

  mutations.push({
    createOrReplace: doc
  });

  console.log(`✓ Prepared: ${data.name} (${article.slug})`);
}

console.log(`\n✓ Created mutations for ${mutations.length} new articles`);
console.log('Sending to Sanity...\n');

try {
  const response = await fetch('https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Error response:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('✅ Success! Imported', result.results?.length || 0, 'new articles');
  console.log('\nTransaction ID:', result.transactionId);

  console.log('\n=== Imported Articles ===');
  articles.forEach(article => {
    const data = JSON.parse(readFileSync(article.file, 'utf8'));
    console.log(`✓ ${data.name} (${article.slug})`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
