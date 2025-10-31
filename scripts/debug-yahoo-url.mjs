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

const query = `*[_type == 'product' && source == 'yahoo'][0] {
  name,
  priceData[0] {
    url
  }
}`;

const product = await client.fetch(query);

const url = product.priceData?.url || '';

console.log('テスト対象商品:', product.name);
console.log('');
console.log('テスト対象URL:');
console.log(url);
console.log('');

console.log('URLに「vc_url=」が含まれる:', url.includes('vc_url='));

// パターンマッチテスト
const pattern1 = /vc_url=.*vc_url=/;
const match1 = url.match(pattern1);
console.log('パターン1 (vc_url=.*vc_url=):', match1 ? 'マッチ' : 'マッチなし');

// より具体的なパターン
const pattern2 = /vc_url=https%3A%2F%2Fck\.jp\.ap\.valuecommerce\.com/;
const match2 = url.match(pattern2);
console.log('パターン2 (vc_url内にvaluecommerce):', match2 ? 'マッチ' : 'マッチなし');

// vc_urlの値を抽出
const vcUrlMatch = url.match(/vc_url=([^&]+)/);
if (vcUrlMatch) {
  const vcUrlValue = decodeURIComponent(vcUrlMatch[1]);
  console.log('');
  console.log('vc_urlの中身（デコード後）:');
  console.log(vcUrlValue);
  console.log('');
  console.log('vc_urlの中身にvaluecommerceが含まれる:', vcUrlValue.includes('valuecommerce'));
}
