import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

const articles = [
  'omega3-article.json',
  'magnesium-article.json',
  'zinc-article.json',
  'vitamin-a-article.json',
  'vitamin-k-article.json',
  'vitamin-b12-article.json',
  'vitamin-c-article.json',
  'vitamin-d-article.json',
  'vitamin-e-article.json',
  'niacin-article.json',
  'calcium-article.json',
  'iron-article.json',
  'bcaa-article.json',
  'nac-article.json',
  'protein-article.json',
  'probiotics-article.json',
  'vitamin-b-complex-article.json',
  'folic-acid-article.json',
  'coenzyme-q10-article.json',
  'collagen-article.json',
  'glucosamine-article.json',
  'lutein-article.json',
  'ashwagandha-article.json',
  'magnesium-glycinate-article.json',
  'chromium-article.json',
  'iodine-article.json',
  'selenium-article.json',
  'potassium-article.json',
];

async function updateArticle(filename) {
  try {
    console.log(`\nProcessing: ${filename}...`);

    const data = JSON.parse(readFileSync(filename, 'utf8'));
    const slug = data.slug;

    // 既存のドキュメントを検索
    const existing = await client.fetch(
      `*[_type == "ingredient" && slug.current == $slug][0]`,
      { slug }
    );

    if (!existing) {
      console.log(`  ⚠️  Not found in Sanity: ${slug}`);
      console.log(`  Creating new document...`);

      // 新規作成
      const newDoc = {
        _type: 'ingredient',
        name: data.name,
        nameEn: data.nameEn,
        slug: {
          _type: 'slug',
          current: slug,
        },
        category: data.category,
        description: data.description,
        benefits: data.benefits,
        recommendedDosage: data.recommendedDosage,
        sideEffects: data.sideEffects,
        interactions: data.interactions,
        evidenceLevel: data.evidenceLevel,
        scientificBackground: data.scientificBackground,
        foodSources: data.foodSources,
        faqs: data.faqs,
        references: data.references,
      };

      const result = await client.create(newDoc);
      console.log(`  ✓ Created: ${data.name} (${result._id})`);
      return;
    }

    console.log(`  Found existing: ${existing.name} (${existing._id})`);
    console.log(`  Updating...`);

    // 既存のドキュメントを更新
    await client
      .patch(existing._id)
      .set({
        description: data.description,
        benefits: data.benefits,
        recommendedDosage: data.recommendedDosage,
        sideEffects: data.sideEffects,
        interactions: data.interactions,
        evidenceLevel: data.evidenceLevel,
        scientificBackground: data.scientificBackground,
        foodSources: data.foodSources,
        faqs: data.faqs,
        references: data.references,
      })
      .commit();

    console.log(`  ✓ Updated: ${data.name}`);

    // 文字数をカウント
    const totalChars =
      data.description.length +
      data.benefits.join('').length +
      data.recommendedDosage.length +
      data.scientificBackground.length +
      data.foodSources.join('').length +
      data.faqs.map(f => f.question + f.answer).join('').length;

    console.log(`  📊 Total characters: 約${totalChars}文字`);

  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
  }
}

async function importAll() {
  console.log('拡充された記事をSanityに投入します...\n');
  console.log('対象ファイル:', articles.length, '件\n');

  for (const article of articles) {
    await updateArticle(article);
    // APIレート制限対策で少し待機
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n完了しました！');
  console.log('Sanity Studio (http://localhost:3333) で確認してください。');
}

importAll();
