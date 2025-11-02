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

const query = `*[_type == "product" && name == "DHC ビタミンC ハードカプセル 60日分 120粒"][0]{
  _id,
  name,
  slug,
  asin
}`;

const product = await sanity.fetch(query);

if (product) {
  console.log(`\n✅ 商品が見つかりました！\n`);
  console.log(`📦 商品名: ${product.name}`);
  console.log(`🔗 Slug: ${product.slug.current}`);
  console.log(`🆔 ASIN: ${product.asin}`);
  console.log(`\n🌐 商品ページURL: https://suptia.com/products/${product.slug.current}`);
  console.log(`\n📱 ローカル開発URL: http://localhost:3000/products/${product.slug.current}`);
} else {
  console.log('❌ 商品が見つかりませんでした');
}
