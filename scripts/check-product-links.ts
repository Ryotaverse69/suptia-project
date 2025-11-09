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
});

async function checkProductLinks() {
  // まず、ネイチャーメイドとユーグレナの商品を検索
  const specificQuery = `*[_type == "product" && (
    name match "*ネイチャーメイド*マルチビタミン*" ||
    name match "*ユーグレナ*"
  )]{
    _id,
    name,
    slug,
    source,
    itemCode
  } | order(name asc)`;

  const specificProducts = await sanity.fetch(specificQuery);

  console.log('\n📦 ネイチャーメイド & ユーグレナ商品：');
  console.log('='.repeat(80));
  specificProducts.forEach((product: any) => {
    console.log(`\n商品名: ${product.name}`);
    console.log(`slug: ${product.slug?.current || 'なし'}`);
    console.log(`source: ${product.source}`);
    console.log(`itemCode: ${product.itemCode || 'なし'}`);
    console.log(`_id: ${product._id}`);
  });

  // ネイチャーメイドが見つからない場合は、もっと広く検索
  console.log('\n\n🔍 ネイチャーメイド全商品を検索：');
  console.log('='.repeat(80));
  const natureMadeQuery = `*[_type == "product" && name match "*ネイチャーメイド*"]{
    _id,
    name,
    slug,
    source,
    itemCode
  } | order(name asc)`;

  const natureMadeProducts = await sanity.fetch(natureMadeQuery);
  if (natureMadeProducts.length === 0) {
    console.log('⚠️ ネイチャーメイド商品が見つかりません');
  } else {
    natureMadeProducts.forEach((product: any) => {
      console.log(`\n商品名: ${product.name}`);
      console.log(`slug: ${product.slug?.current || 'なし'}`);
    });
  }

  // 重複slugチェック（全商品対象）
  console.log('\n\n🔍 重複slugチェック（全商品）：');
  const allSlugsQuery = `*[_type == "product" && defined(slug.current)]{
    _id,
    name,
    "slug": slug.current
  }`;
  const allProducts = await sanity.fetch(allSlugsQuery);
  const slugMap = new Map<string, any[]>();

  allProducts.forEach((product: any) => {
    const slug = product.slug;
    if (!slugMap.has(slug)) {
      slugMap.set(slug, []);
    }
    slugMap.get(slug)!.push(product);
  });

  const duplicateSlugs = Array.from(slugMap.entries()).filter(([, products]) => products.length > 1);

  if (duplicateSlugs.length > 0) {
    console.log('⚠️ 重複しているslug:');
    duplicateSlugs.forEach(([slug, products]) => {
      console.log(`\n  slug: "${slug}" (${products.length}件)`);
      products.forEach((p: any) => {
        console.log(`    - ${p.name} (_id: ${p._id})`);
      });
    });
  } else {
    console.log('✅ 重複なし');
  }
}

async function checkDuplicateProducts() {
  console.log('\n\n📋 重複slug "120" の詳細情報：');
  console.log('='.repeat(80));

  const query = `*[_type == "product" && slug.current == "120"]{
    _id,
    name,
    slug,
    source,
    itemCode,
    price,
    servingsPerContainer,
    "ingredients": mainIngredients[]{
      name,
      amountPerServing
    }
  }`;

  const products = await sanity.fetch(query);

  products.forEach((product: any, index: number) => {
    console.log(`\n【商品${index + 1}】`);
    console.log(`_id: ${product._id}`);
    console.log(`商品名: ${product.name}`);
    console.log(`source: ${product.source}`);
    console.log(`itemCode: ${product.itemCode}`);
    console.log(`価格: ${product.price?.amount || 'なし'}`);
    console.log(`servingsPerContainer: ${product.servingsPerContainer || 'なし'}`);
    console.log('主要成分:');
    if (product.ingredients && product.ingredients.length > 0) {
      product.ingredients.forEach((ing: any) => {
        console.log(`  - ${ing.name}: ${ing.amountPerServing || 'なし'}`);
      });
    } else {
      console.log('  なし');
    }
  });

  console.log('\n\n📋 正しいslugを持つネイチャーメイド スーパーマルチビタミン：');
  console.log('='.repeat(80));

  const correctSlugQuery = `*[_type == "product" && slug.current == "nature-made-super-multi-vitamin-mineral-120"]{
    _id,
    name,
    slug,
    source,
    itemCode,
    price,
    servingsPerContainer
  }`;

  const correctProduct = await sanity.fetch(correctSlugQuery);

  if (correctProduct.length > 0) {
    correctProduct.forEach((product: any) => {
      console.log(`\n_id: ${product._id}`);
      console.log(`商品名: ${product.name}`);
      console.log(`source: ${product.source}`);
      console.log(`itemCode: ${product.itemCode}`);
      console.log(`価格: ${product.price?.amount || 'なし'}`);
      console.log(`servingsPerContainer: ${product.servingsPerContainer || 'なし'}`);
    });
  }
}

checkProductLinks().then(() => checkDuplicateProducts());
