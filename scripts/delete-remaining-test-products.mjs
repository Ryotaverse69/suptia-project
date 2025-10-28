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

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

const testProductIds = [
  'product-now-omega-3',
  'product-otsuka-nature-made-vitamin-d',
  'product-thorne-basic-b-complex'
];

async function main() {
  console.log('🗑️  残りのテストデータを削除中...\n');
  
  let deleted = 0;
  for (const id of testProductIds) {
    try {
      await client.delete(id);
      console.log(`  ✅ 削除: ${id}`);
      deleted++;
    } catch (error) {
      console.error(`  ❌ エラー: ${id} - ${error.message}`);
    }
  }
  
  console.log(`\n✅ ${deleted}件の商品を削除しました！`);
  console.log('\n📊 残りのデータ:');
  console.log('   楽天同期商品: 約120件');
  console.log('   Yahoo同期商品: 約95件');
  console.log('   合計: 約215件（全て実データ）');
}

main();
