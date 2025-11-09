import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@sanity/client';

// Load environment variables from apps/web/.env.local
config({ path: resolve(__dirname, '../apps/web/.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-08-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
});

async function fixDuplicateSlug() {
  console.log('\n🔧 重複slug "120" を修正します...\n');

  // 1. 重複しているネイチャーメイド商品のslugを変更
  const natureMadeProductId = 'product-rakuten-sundrug-10017784';
  const newSlug = 'nature-made-super-multi-vitamin-mineral-120-rakuten';

  try {
    console.log(`📝 商品 ${natureMadeProductId} のslugを "${newSlug}" に変更中...`);

    await sanity
      .patch(natureMadeProductId)
      .set({
        slug: {
          _type: 'slug',
          current: newSlug,
        },
      })
      .commit();

    console.log('✅ slugの変更が完了しました！');

    // 2. 変更後の確認
    console.log('\n🔍 変更後の確認：');

    const query = `*[_type == "product" && slug.current == "120"]{
      _id,
      name,
      slug
    }`;

    const products = await sanity.fetch(query);

    console.log(`\nslug "120" を持つ商品数: ${products.length}`);
    products.forEach((product: any) => {
      console.log(`  - ${product.name} (_id: ${product._id})`);
    });

    if (products.length === 1) {
      console.log('\n✅ 重複が解消されました！');
    } else {
      console.log('\n⚠️ まだ重複が残っています');
    }

    // 3. 変更した商品の確認
    const updatedProduct = await sanity.fetch(
      `*[_id == "${natureMadeProductId}"]{
        _id,
        name,
        slug
      }[0]`
    );

    console.log('\n📋 変更された商品:');
    console.log(`  商品名: ${updatedProduct.name}`);
    console.log(`  新しいslug: ${updatedProduct.slug.current}`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  }
}

fixDuplicateSlug();
