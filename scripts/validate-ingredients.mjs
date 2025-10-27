import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2025-08-21',
  useCdn: false,
});

const requiredFields = [
  'name',
  'nameEn',
  'slug',
  'category',
  'description',
  'evidenceLevel',
  'scientificBackground',
  'recommendedDosage'
];

try {
  const ingredients = await client.fetch(`*[_type == "ingredient"]{
    name,
    nameEn,
    "slug": slug.current,
    category,
    description,
    evidenceLevel,
    scientificBackground,
    recommendedDosage
  }`);

  console.log('🔍 必須フィールドチェック中...\n');

  let errorCount = 0;

  ingredients.forEach((ing, index) => {
    const missing = [];
    requiredFields.forEach(field => {
      if (!ing[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      errorCount++;
      console.log(`❌ ${index + 1}. ${ing.name || '(名前なし)'} (/ingredients/${ing.slug || 'no-slug'})`);
      console.log(`   不足フィールド: ${missing.join(', ')}\n`);
    }
  });

  if (errorCount === 0) {
    console.log('✅ すべての成分に必須フィールドが揃っています！');
  } else {
    console.log(`\n⚠️  ${errorCount}件の成分に不足フィールドがあります`);
  }

} catch (error) {
  console.error('❌ エラー:', error.message);
}
