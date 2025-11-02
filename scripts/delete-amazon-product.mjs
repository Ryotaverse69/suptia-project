#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

const sanity = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

async function deleteAmazonProduct() {
  console.log('🗑️  Amazon商品を削除します...\n');

  // dhc-vitamin-c-60daysの商品を取得
  const query = `*[_type == "product" && slug.current == "dhc-vitamin-c-60days"][0]{
    _id,
    name,
    slug
  }`;

  const product = await sanity.fetch(query);

  if (!product) {
    console.log('❌ 商品が見つかりませんでした');
    return;
  }

  console.log(`📦 削除対象商品: ${product.name}`);
  console.log(`🔗 Slug: ${product.slug.current}`);
  console.log(`🆔 ID: ${product._id}\n`);

  // 削除実行
  await sanity.delete(product._id);

  console.log('✅ 商品を削除しました！');
}

deleteAmazonProduct();
