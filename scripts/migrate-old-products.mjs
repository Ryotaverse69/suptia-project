import { readFileSync } from 'fs';

const token = readFileSync('apps/web/.env.local', 'utf8')
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!token) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

console.log('🔍 古い商品データを検索しています...\n');

// 古い商品データ（brandがstring型またはnull）を取得
const oldProductsQuery = `*[_type == "product" && (!defined(brand._ref) || brand._type != "reference")]{
  _id,
  name,
  brand,
  priceJPY,
  _updatedAt
} | order(name asc)`;

try {
  const response = await fetch(
    `https://fny3jdcg.api.sanity.io/v2023-05-03/data/query/production?query=${encodeURIComponent(oldProductsQuery)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!data.result || data.result.length === 0) {
    console.log('✅ マイグレーションが必要な古い商品はありません');
    process.exit(0);
  }

  console.log(`⚠️ ${data.result.length}件の古い商品が見つかりました\n`);

  data.result.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   ID: ${product._id}`);
    console.log(`   旧brand: ${product.brand || '未設定'}`);
    console.log(`   価格: ¥${product.priceJPY?.toLocaleString() || '未設定'}`);
    console.log('');
  });

  console.log('📋 マイグレーション方針:');
  console.log('   これらは古いテストデータのため、削除します。');
  console.log('   新しいスキーマに対応した商品データは別途作成済みです。\n');

  console.log('🗑️ 古い商品データを削除しています...\n');

  // 削除用のミューテーション作成
  const mutations = data.result.map((product) => ({
    delete: {
      id: product._id,
    },
  }));

  const deleteResponse = await fetch(
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

  const deleteResult = await deleteResponse.json();

  if (!deleteResponse.ok) {
    console.error('❌ 削除エラー:', JSON.stringify(deleteResult, null, 2));
    process.exit(1);
  }

  console.log(`✅ 成功！ ${deleteResult.results?.length || 0}件の古い商品を削除しました`);

  data.result.forEach((product) => {
    console.log(`   🗑️ ${product.name}`);
  });

  console.log('\n✨ マイグレーションが完了しました！');
  console.log('📊 現在の商品一覧（新スキーマ対応）:');
  console.log('   - DHC ビタミンC ハードカプセル 60日分');
  console.log('   - 大塚製薬 ネイチャーメイド ビタミンD 90粒');
  console.log('   - NOW Foods オメガ3 フィッシュオイル 200ソフトジェル');
  console.log('   - Thorne Research ベーシックBコンプレックス 60カプセル');
  console.log('\n🌐 Sanityスタジオで確認: http://localhost:3333/structure/product');

} catch (error) {
  console.error('❌ エラー:', error.message);
  process.exit(1);
}
