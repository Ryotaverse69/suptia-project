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
  console.log('🔍 テストデータを検索中...\n');
  
  // source == null の商品を取得
  const products = await client.fetch(`*[_type == "product" && source == null]{_id, name, slug, externalImageUrl}`);
  
  // 楽天/Yahoo以外の商品（手動作成されたテストデータ）
  const testProducts = products.filter(p => 
    !p._id.includes('rakuten') && 
    !p._id.includes('yahoo')
  );
  
  console.log(`📋 見つかった商品:`);
  console.log(`   全体: ${products.length}件`);
  console.log(`   テストデータ: ${testProducts.length}件\n`);
  
  if (testProducts.length > 0) {
    console.log('🗑️  削除対象のテストデータ:\n');
    testProducts.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name}`);
      console.log(`     ID: ${p._id}`);
      console.log(`     Slug: ${p.slug?.current || 'なし'}`);
      console.log(`     画像: ${p.externalImageUrl ? 'あり' : 'なし'}`);
      console.log('');
    });
  } else {
    console.log('✅ テストデータは見つかりませんでした');
  }
}

main();
