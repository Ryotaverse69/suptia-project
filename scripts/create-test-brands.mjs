import { readFileSync } from 'fs';

const token = readFileSync('apps/web/.env.local', 'utf8')
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!token) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// テスト用ブランドデータ
const brands = [
  {
    _id: 'brand-dhc',
    _type: 'brand',
    name: 'DHC',
    slug: { _type: 'slug', current: 'dhc' },
    description: '日本を代表するサプリメントブランド。厳しい品質管理と手頃な価格が特徴。',
    country: 'JP',
    website: 'https://www.dhc.co.jp/',
    certifications: ['GMP認証', 'ISO9001'],
    trustScore: 85,
    foundedYear: 1972,
    specialties: ['ビタミン', 'ミネラル', 'コラーゲン'],
    priceRange: 'economy',
  },
  {
    _id: 'brand-otsuka',
    _type: 'brand',
    name: '大塚製薬',
    slug: { _type: 'slug', current: 'otsuka' },
    description: '医薬品メーカーとしての信頼性と科学的根拠を重視したサプリメント開発。',
    country: 'JP',
    website: 'https://www.otsuka.co.jp/',
    certifications: ['GMP認証', 'ISO14001', '医薬品製造許可'],
    trustScore: 95,
    foundedYear: 1921,
    specialties: ['ビタミン', 'ミネラル', '機能性表示食品'],
    priceRange: 'mid-range',
  },
  {
    _id: 'brand-now-foods',
    _type: 'brand',
    name: 'NOW Foods',
    slug: { _type: 'slug', current: 'now-foods' },
    description: 'アメリカの老舗サプリメントブランド。幅広い製品ラインナップとコスパの良さが魅力。',
    country: 'US',
    website: 'https://www.nowfoods.com/',
    certifications: ['GMP認証', 'NSF認証', 'Non-GMO Project認証'],
    trustScore: 88,
    foundedYear: 1968,
    specialties: ['ビタミン', 'ミネラル', 'ハーブ', 'アミノ酸'],
    priceRange: 'economy',
  },
  {
    _id: 'brand-thorne',
    _type: 'brand',
    name: 'Thorne',
    slug: { _type: 'slug', current: 'thorne' },
    description: '医療従事者向けの高品質サプリメント。厳格な品質管理と科学的根拠に基づく製品開発。',
    country: 'US',
    website: 'https://www.thorne.com/',
    certifications: ['GMP認証', 'NSF Sport認証', 'TGA認証'],
    trustScore: 98,
    foundedYear: 1984,
    specialties: ['ビタミン', 'ミネラル', 'プロバイオティクス', '専門処方'],
    priceRange: 'premium',
  },
  {
    _id: 'brand-life-extension',
    _type: 'brand',
    name: 'Life Extension',
    slug: { _type: 'slug', current: 'life-extension' },
    description: '長寿科学研究に基づいたサプリメント開発。最先端の科学的エビデンスを製品に反映。',
    country: 'US',
    website: 'https://www.lifeextension.com/',
    certifications: ['GMP認証', 'NSF認証'],
    trustScore: 92,
    foundedYear: 1980,
    specialties: ['アンチエイジング', '抗酸化物質', '心血管サポート'],
    priceRange: 'premium',
  },
];

console.log(`📦 ${brands.length}件のブランドデータを作成します...\n`);

const mutations = brands.map((brand) => ({
  createOrReplace: brand,
}));

try {
  const response = await fetch(
    'https://fny3jdcg.api.sanity.io/v2023-05-03/data/mutate/production',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutations }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error('❌ エラーレスポンス:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('✅ 成功！', result.results?.length || 0, '件のブランドを作成しました\n');

  // 作成されたブランドの一覧を表示
  brands.forEach((brand) => {
    console.log(`  📍 ${brand.name}`);
    console.log(`     国: ${brand.country === 'JP' ? '日本' : 'アメリカ'}`);
    console.log(`     信頼度: ${brand.trustScore}`);
    console.log(`     価格帯: ${brand.priceRange}`);
    console.log('');
  });

  console.log('✨ テストブランドの作成が完了しました！');
  console.log('🌐 Sanityスタジオで確認: http://localhost:3333/structure/brand');
} catch (error) {
  console.error('❌ エラー:', error.message);
  process.exit(1);
}
