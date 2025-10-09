import { readFileSync, writeFileSync } from 'fs';

const articlesMetadata = [
  {
    file: 'bcaa-article.json',
    name: 'BCAA（分岐鎖アミノ酸）',
    nameEn: 'BCAA',
    slug: 'bcaa',
    category: 'amino-acid',
    evidenceLevel: 'A',
  },
  {
    file: 'nac-article.json',
    name: 'NAC（N-アセチルシステイン）',
    nameEn: 'NAC',
    slug: 'nac',
    category: 'amino-acid',
    evidenceLevel: 'B',
  },
  {
    file: 'protein-article.json',
    name: 'プロテイン',
    nameEn: 'Protein',
    slug: 'protein',
    category: 'amino-acid',
    evidenceLevel: 'A',
  },
  {
    file: 'probiotics-article.json',
    name: 'プロバイオティクス',
    nameEn: 'Probiotics',
    slug: 'probiotics',
    category: 'other',
    evidenceLevel: 'A',
  },
  {
    file: 'vitamin-b-complex-article.json',
    name: 'ビタミンB群',
    nameEn: 'Vitamin B Complex',
    slug: 'vitamin-b-complex',
    category: 'vitamin',
    evidenceLevel: 'A',
  },
  {
    file: 'folic-acid-article.json',
    name: '葉酸（ビタミンB9）',
    nameEn: 'Folic Acid',
    slug: 'folic-acid',
    category: 'vitamin',
    evidenceLevel: 'A',
  },
  {
    file: 'coenzyme-q10-article.json',
    name: 'コエンザイムQ10',
    nameEn: 'Coenzyme Q10',
    slug: 'coenzyme-q10',
    category: 'other',
    evidenceLevel: 'B',
  },
  {
    file: 'collagen-article.json',
    name: 'コラーゲン',
    nameEn: 'Collagen',
    slug: 'collagen',
    category: 'amino-acid',
    evidenceLevel: 'B',
  },
  {
    file: 'glucosamine-article.json',
    name: 'グルコサミン',
    nameEn: 'Glucosamine',
    slug: 'glucosamine',
    category: 'other',
    evidenceLevel: 'B',
  },
  {
    file: 'lutein-article.json',
    name: 'ルテイン',
    nameEn: 'Lutein',
    slug: 'lutein',
    category: 'other',
    evidenceLevel: 'B',
  },
  {
    file: 'ashwagandha-article.json',
    name: 'アシュワガンダ',
    nameEn: 'Ashwagandha',
    slug: 'ashwagandha',
    category: 'herb',
    evidenceLevel: 'B',
  },
  {
    file: 'magnesium-glycinate-article.json',
    name: 'マグネシウムグリシネート',
    nameEn: 'Magnesium Glycinate',
    slug: 'magnesium-glycinate',
    category: 'mineral',
    evidenceLevel: 'A',
  },
  {
    file: 'chromium-article.json',
    name: 'クロム',
    nameEn: 'Chromium',
    slug: 'chromium',
    category: 'mineral',
    evidenceLevel: 'B',
  },
  {
    file: 'iodine-article.json',
    name: 'ヨウ素',
    nameEn: 'Iodine',
    slug: 'iodine',
    category: 'mineral',
    evidenceLevel: 'A',
  },
  {
    file: 'selenium-article.json',
    name: 'セレン',
    nameEn: 'Selenium',
    slug: 'selenium',
    category: 'mineral',
    evidenceLevel: 'A',
  },
  {
    file: 'potassium-article.json',
    name: 'カリウム',
    nameEn: 'Potassium',
    slug: 'potassium',
    category: 'mineral',
    evidenceLevel: 'A',
  },
];

for (const meta of articlesMetadata) {
  try {
    console.log(`Processing: ${meta.file}...`);

    const data = JSON.parse(readFileSync(meta.file, 'utf8'));

    const updatedData = {
      name: meta.name,
      nameEn: meta.nameEn,
      slug: meta.slug,
      category: meta.category,
      evidenceLevel: meta.evidenceLevel,
      ...data,
    };

    writeFileSync(meta.file, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log(`  ✓ Added metadata to ${meta.name}`);
  } catch (error) {
    console.error(`  ✗ Error processing ${meta.file}:`, error.message);
  }
}

console.log('\n完了しました！');
