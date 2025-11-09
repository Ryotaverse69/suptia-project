import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@sanity/client';

config({ path: resolve(__dirname, '../apps/web/.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-08-21',
  useCdn: false,
});

async function checkNatureMadePrices() {
  console.log('\n🔍 ネイチャーメイド スーパーマルチビタミンの価格情報：\n');

  const query = `*[_type == "product" && slug.current == "nature-made-super-multi-vitamin-mineral-120"]{
    _id,
    name,
    "slug": slug.current,
    source,
    itemCode,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    amazonASIN,
    prices
  }[0]`;

  const product = await sanity.fetch(query);

  if (!product) {
    console.log('❌ 商品が見つかりません');
    return;
  }

  console.log(`商品名: ${product.name}`);
  console.log(`_id: ${product._id}`);
  console.log(`slug: ${product.slug}`);
  console.log(`source: ${product.source}`);
  console.log(`itemCode: ${product.itemCode}`);
  console.log(`servingsPerContainer: ${product.servingsPerContainer}`);
  console.log(`servingsPerDay: ${product.servingsPerDay || 'なし'}`);
  console.log(`amazonASIN: ${product.amazonASIN || 'なし'}`);
  console.log(`\n💰 価格情報：`);
  console.log(`priceJPY: ${product.priceJPY || 'なし'}`);

  if (product.prices && Array.isArray(product.prices)) {
    console.log(`\nprices配列 (${product.prices.length}件):`);
    product.prices.forEach((price: any, index: number) => {
      console.log(`\n  [${index + 1}] ${price.source}`);
      console.log(`      金額: ¥${price.amount}`);
      console.log(`      URL: ${price.url || 'なし'}`);
      console.log(`      在庫: ${price.inStock ? '✅' : '❌'}`);
      console.log(`      取得日時: ${price.fetchedAt || 'なし'}`);
    });
  } else {
    console.log('\n⚠️ prices配列が存在しないか、空です');
  }

  console.log(`\n🖼️ 画像URL: ${product.externalImageUrl || 'なし'}`);
}

checkNatureMadePrices();
