import { readFileSync } from 'fs';

const token = readFileSync('apps/web/.env.local', 'utf8')
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!token) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// テスト用商品データ
const products = [
  {
    _id: 'product-dhc-vitamin-c',
    _type: 'product',
    name: 'DHC ビタミンC ハードカプセル 60日分',
    slug: { _type: 'slug', current: 'dhc-vitamin-c-60days' },
    brand: { _type: 'reference', _ref: 'brand-dhc' },
    ingredients: [
      {
        _key: 'vc-1',
        ingredient: { _type: 'reference', _ref: 'ingredient-vitamin-c' },
        amountMgPerServing: 1000,
      },
    ],
    servingsPerDay: 2,
    servingsPerContainer: 120,
    priceJPY: 580,
    urls: {
      amazon: 'https://www.amazon.co.jp/dp/B00CM6Y5KY',
    },
    description:
      '1日2粒で1000mgのビタミンCが摂取できる。ビタミンB2も配合で、美容と健康をサポート。',
    form: 'capsule',
    thirdPartyTested: false,
    scores: {
      safety: 85,
      evidence: 90,
      costEffectiveness: 95,
      overall: 90,
    },
    reviewStats: {
      averageRating: 4.3,
      reviewCount: 1245,
    },
    availability: 'in-stock',
    warnings: ['妊娠中・授乳中の方は医師に相談してください'],
  },
  {
    _id: 'product-otsuka-nature-made-vitamin-d',
    _type: 'product',
    name: '大塚製薬 ネイチャーメイド ビタミンD 90粒',
    slug: { _type: 'slug', current: 'otsuka-nature-made-vitamin-d' },
    brand: { _type: 'reference', _ref: 'brand-otsuka' },
    ingredients: [
      {
        _key: 'vd-1',
        ingredient: { _type: 'reference', _ref: 'ingredient-vitamin-d' },
        amountMgPerServing: 0.025, // 25μg = 0.025mg
      },
    ],
    servingsPerDay: 1,
    servingsPerContainer: 90,
    priceJPY: 698,
    urls: {
      amazon: 'https://www.amazon.co.jp/dp/B00KFHWVPY',
      rakuten: 'https://item.rakuten.co.jp/sundrug/4987035261414/',
    },
    description:
      '骨の健康維持に必要なビタミンD。1日1粒で手軽に補給できる。食生活は主食、主菜、副菜を基本に、食事のバランスを。',
    form: 'tablet',
    thirdPartyTested: true,
    scores: {
      safety: 95,
      evidence: 95,
      costEffectiveness: 88,
      overall: 93,
    },
    reviewStats: {
      averageRating: 4.5,
      reviewCount: 892,
    },
    availability: 'in-stock',
    warnings: [],
  },
  {
    _id: 'product-now-omega-3',
    _type: 'product',
    name: 'NOW Foods オメガ3 フィッシュオイル 200ソフトジェル',
    slug: { _type: 'slug', current: 'now-omega-3-fish-oil' },
    brand: { _type: 'reference', _ref: 'brand-now-foods' },
    ingredients: [
      {
        _key: 'omega3-1',
        ingredient: { _type: 'reference', _ref: 'ingredient-omega-3' },
        amountMgPerServing: 1000,
      },
    ],
    servingsPerDay: 2,
    servingsPerContainer: 200,
    priceJPY: 1980,
    urls: {
      iherb: 'https://jp.iherb.com/pr/now-foods-omega-3-200-softgels/447',
    },
    description:
      '分子蒸留により水銀やPCBsを除去。EPA・DHAを豊富に含む高品質フィッシュオイル。心血管の健康をサポート。',
    form: 'softgel',
    thirdPartyTested: true,
    scores: {
      safety: 90,
      evidence: 92,
      costEffectiveness: 85,
      overall: 89,
    },
    reviewStats: {
      averageRating: 4.6,
      reviewCount: 3421,
    },
    availability: 'in-stock',
    warnings: ['魚アレルギーの方は使用しないでください', '抗凝固薬を服用中の方は医師に相談してください'],
  },
  {
    _id: 'product-thorne-basic-b-complex',
    _type: 'product',
    name: 'Thorne Research ベーシックBコンプレックス 60カプセル',
    slug: { _type: 'slug', current: 'thorne-basic-b-complex' },
    brand: { _type: 'reference', _ref: 'brand-thorne' },
    ingredients: [
      {
        _key: 'b-complex-1',
        ingredient: { _type: 'reference', _ref: 'ingredient-vitamin-b-complex' },
        amountMgPerServing: 50,
      },
    ],
    servingsPerDay: 1,
    servingsPerContainer: 60,
    priceJPY: 3280,
    urls: {
      iherb: 'https://jp.iherb.com/pr/thorne-basic-b-complex-60-capsules/14873',
    },
    description:
      '活性型ビタミンB群を配合。エネルギー代謝、神経系、細胞の健康を総合的にサポート。医療従事者推奨の高品質サプリメント。',
    form: 'capsule',
    thirdPartyTested: true,
    scores: {
      safety: 98,
      evidence: 93,
      costEffectiveness: 75,
      overall: 89,
    },
    reviewStats: {
      averageRating: 4.8,
      reviewCount: 567,
    },
    availability: 'in-stock',
    warnings: [],
  },
];

console.log(`📦 ${products.length}件の商品データを作成します...\n`);

const mutations = products.map((product) => ({
  createOrReplace: product,
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

  console.log('✅ 成功！', result.results?.length || 0, '件の商品を作成しました\n');

  // 作成された商品の一覧を表示
  products.forEach((product) => {
    console.log(`  📦 ${product.name}`);
    console.log(`     価格: ¥${product.priceJPY.toLocaleString()}`);
    console.log(`     総合スコア: ${product.scores.overall}`);
    console.log(`     平均評価: ${product.reviewStats.averageRating} (${product.reviewStats.reviewCount}件)`);
    console.log('');
  });

  console.log('✨ テスト商品の作成が完了しました！');
  console.log('🌐 Sanityスタジオで確認: http://localhost:3333/structure/product');
} catch (error) {
  console.error('❌ エラー:', error.message);
  process.exit(1);
}
