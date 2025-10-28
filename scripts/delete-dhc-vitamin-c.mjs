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

async function main() {
  const productId = 'product-dhc-vitamin-c';
  
  console.log('🗑️  商品を削除中: ' + productId);
  console.log('   商品名: DHC ビタミンC ハードカプセル 60日分\n');
  
  try {
    await client.delete(productId);
    console.log('✅ 削除完了！');
    console.log('\n📝 この商品の代わりに、楽天から同期された');
    console.log('   DHCビタミンC商品が30件利用可能です。');
  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

main();
