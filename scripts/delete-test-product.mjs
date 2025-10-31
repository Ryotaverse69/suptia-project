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

const testProductId = 'xPxjX6TJ9RKJ7uoHkwukRI';

console.log('🗑️  テスト商品を削除中...\n');

try {
  const result = await client.delete(testProductId);
  console.log('✅ テスト商品を削除しました');
  console.log(`   ID: ${testProductId}`);
  console.log(`   名前: 【テスト】添加物検出テスト用ビタミンCサプリ\n`);
} catch (error) {
  console.error('❌ 削除に失敗しました:', error.message);
  process.exit(1);
}
