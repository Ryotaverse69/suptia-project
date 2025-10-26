#!/usr/bin/env node
/**
 * Sanity内の全商品データを一覧表示するスクリプト
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const products = await client.fetch(`
    *[_type == "product"] | order(name asc) {
      _id,
      name,
      slug,
      brand->{name},
      priceJPY,
      availability,
      externalImageUrl,
      "hasIngredients": count(ingredients) > 0,
      "ingredientCount": count(ingredients),
      _createdAt,
      _updatedAt
    }
  `);

  console.log('═'.repeat(80));
  console.log('📦 Sanity商品データ一覧');
  console.log('═'.repeat(80));
  console.log(`合計: ${products.length}件\n`);

  // 楽天商品
  const rakutenProducts = products.filter(p => p.externalImageUrl?.includes('thumbnail.image.rakuten'));
  console.log(`\n🛒 楽天商品: ${rakutenProducts.length}件`);
  console.log('─'.repeat(80));
  rakutenProducts.forEach((p, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${p.name.substring(0, 50).padEnd(52)} | ¥${p.priceJPY?.toLocaleString() || 'N/A'} | ${p.brand?.name || 'N/A'}`);
  });

  // Yahoo!商品
  const yahooProducts = products.filter(p => p.externalImageUrl?.includes('shopping.c.yimg.jp'));
  console.log(`\n🛍️  Yahoo!商品: ${yahooProducts.length}件`);
  console.log('─'.repeat(80));
  yahooProducts.forEach((p, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${p.name.substring(0, 50).padEnd(52)} | ¥${p.priceJPY?.toLocaleString() || 'N/A'} | ${p.brand?.name || 'N/A'}`);
  });

  // ダミー/テスト商品（画像URLがない、または特定のパターン）
  const dummyProducts = products.filter(p =>
    !p.externalImageUrl ||
    p.externalImageUrl.includes('placeholder') ||
    p.externalImageUrl.includes('example.com') ||
    p.name.includes('テスト') ||
    p.name.includes('ダミー')
  );
  console.log(`\n🧪 ダミー/テスト商品: ${dummyProducts.length}件`);
  console.log('─'.repeat(80));
  dummyProducts.forEach((p, i) => {
    const createdDate = new Date(p._createdAt).toLocaleDateString('ja-JP');
    console.log(`${(i+1).toString().padStart(2)}. ${p.name.substring(0, 50).padEnd(52)} | 作成: ${createdDate}`);
    console.log(`    ID: ${p._id}`);
  });

  console.log('\n' + '═'.repeat(80));
  console.log('📊 サマリー');
  console.log('═'.repeat(80));
  console.log(`楽天:        ${rakutenProducts.length}件`);
  console.log(`Yahoo!:      ${yahooProducts.length}件`);
  console.log(`ダミー:      ${dummyProducts.length}件`);
  console.log(`─────────────────`);
  console.log(`合計:        ${products.length}件`);
  console.log('');
}

main().catch(console.error);
