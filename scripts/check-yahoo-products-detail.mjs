#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_PROJECT_ID = envContent
  .match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]
  ?.trim();
const SANITY_DATASET = envContent
  .match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]
  ?.trim();
const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkYahooProducts() {
  const query = `*[_type == "product" && source == "yahoo"] {
    _id,
    name,
    slug,
    source,
    description,
    "hasImage": defined(image),
    "imageUrl": image.asset->url,
    priceData[] {
      amount,
      source,
      shopName
    },
    "ingredientCount": count(ingredients),
    janCode,
    itemCode
  } | order(name asc)`;

  const products = await client.fetch(query);

  console.log(`\n📦 Yahoo!商品詳細レポート\n`);
  console.log(`合計: ${products.length}件\n`);
  console.log('='.repeat(80));

  for (const product of products.slice(0, 5)) {
    console.log(`\n📦 ${product.name}`);
    console.log(`   ID: ${product._id}`);
    console.log(`   Slug: ${product.slug?.current || '❌ なし'}`);
    console.log(`   Source: ${product.source}`);
    console.log(`   説明文: ${product.description ? '✅ あり' : '❌ なし'}`);
    console.log(`   画像: ${product.hasImage ? '✅ あり' : '❌ なし'}`);
    if (product.imageUrl) {
      console.log(`   画像URL: ${product.imageUrl.substring(0, 60)}...`);
    }
    console.log(`   成分数: ${product.ingredientCount}個`);
    console.log(`   価格データ: ${product.priceData?.length || 0}件`);
    if (product.priceData?.[0]) {
      console.log(`   価格例: ¥${product.priceData[0].amount} (${product.priceData[0].shopName})`);
    }
    console.log(`   JANコード: ${product.janCode || '❌ なし'}`);
    console.log(`   商品コード: ${product.itemCode || '❌ なし'}`);
  }

  console.log(`\n... 他 ${products.length - 5}件\n`);

  // 問題チェック
  const noSlug = products.filter(p => !p.slug?.current);
  const noImage = products.filter(p => !p.hasImage);
  const noDescription = products.filter(p => !p.description);
  const noIngredients = products.filter(p => p.ingredientCount === 0);

  console.log('='.repeat(80));
  console.log('\n⚠️  潜在的な問題:\n');
  console.log(`Slugなし: ${noSlug.length}件`);
  console.log(`画像なし: ${noImage.length}件`);
  console.log(`説明文なし: ${noDescription.length}件`);
  console.log(`成分情報なし: ${noIngredients.length}件`);

  if (noSlug.length > 0) {
    console.log('\n❌ Slugがない商品（フロントエンドで表示できない）:');
    noSlug.forEach(p => console.log(`   - ${p.name}`));
  }
}

checkYahooProducts().catch(console.error);
