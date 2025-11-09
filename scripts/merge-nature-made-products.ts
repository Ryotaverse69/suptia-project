import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@sanity/client';

config({ path: resolve(__dirname, '../apps/web/.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-08-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
});

async function mergeProducts() {
  console.log('\n🔄 ネイチャーメイド スーパーマルチビタミン&ミネラルの統合を開始...\n');

  const amazonId = 'pOpoqaGNdorP1t4hBF94ss';
  const rakutenId = 'product-rakuten-sundrug-10017784';

  try {
    // 楽天版を更新（Amazon情報を追加）
    console.log('📝 楽天版にAmazon情報を追加中...');

    await sanity
      .patch(rakutenId)
      .set({
        // 商品名をよりクリーンに
        name: 'ネイチャーメイド スーパーマルチビタミン&ミネラル 120粒',
        // 正しい服用回数に修正（120粒入りなので）
        servingsPerContainer: 120,
        // prices配列を追加
        prices: [
          {
            source: 'rakuten',
            amount: 2035,
            currency: 'JPY',
            url: 'https://item.rakuten.co.jp/sundrug/4987035513711/',
            fetchedAt: new Date().toISOString(),
            inStock: true,
          },
          {
            source: 'amazon',
            amount: 2850,
            currency: 'JPY',
            url: 'https://www.amazon.co.jp/dp/B00516RULK',
            fetchedAt: new Date().toISOString(),
            inStock: true,
            itemCode: 'B00516RULK',
          },
        ],
        // Amazonの情報も保持
        amazonASIN: 'B00516RULK',
      })
      .commit();

    console.log('✅ 楽天版の更新が完了しました！');

    // Amazon版を削除
    console.log('\n🗑️  Amazon版のドキュメントを削除中...');

    await sanity.delete(amazonId);

    console.log('✅ Amazon版の削除が完了しました！');

    // 確認
    console.log('\n🔍 統合後の商品情報:');

    const merged = await sanity.fetch(
      `*[_id == "${rakutenId}"]{
        _id,
        name,
        'slug': slug.current,
        priceJPY,
        servingsPerContainer,
        servingsPerDay,
        prices
      }[0]`
    );

    console.log(`\n商品名: ${merged.name}`);
    console.log(`slug: ${merged.slug}`);
    console.log(`servingsPerContainer: ${merged.servingsPerContainer}`);
    console.log(`servingsPerDay: ${merged.servingsPerDay}`);
    console.log(`\n価格情報:`);
    merged.prices?.forEach((price: any, index: number) => {
      console.log(`  [${index + 1}] ${price.source}: ¥${price.amount}`);
      console.log(`      URL: ${price.url}`);
      console.log(`      在庫: ${price.inStock ? 'あり' : 'なし'}`);
    });

    console.log('\n✅ 統合が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  }
}

mergeProducts();
