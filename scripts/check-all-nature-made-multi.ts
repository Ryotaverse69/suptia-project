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

async function checkAllNatureMadeMulti() {
  console.log('\n🔍 すべてのネイチャーメイド スーパーマルチビタミン商品：\n');

  const query = `*[_type == "product" && name match "*ネイチャーメイド*スーパーマルチビタミン*"]{
    _id,
    name,
    "slug": slug.current,
    source,
    itemCode,
    "url": prices[0].url
  } | order(name asc)`;

  const products = await sanity.fetch(query);

  console.log(`見つかった商品数: ${products.length}\n`);

  products.forEach((product: any, index: number) => {
    console.log(`【商品${index + 1}】`);
    console.log(`  _id: ${product._id}`);
    console.log(`  商品名: ${product.name}`);
    console.log(`  slug: ${product.slug || 'なし'}`);
    console.log(`  source: ${product.source}`);
    console.log(`  itemCode: ${product.itemCode || 'なし'}`);
    console.log(`  URL: ${product.url || 'なし'}`);
    console.log('');
  });
}

checkAllNatureMadeMulti();
