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

// 商品一覧ページと同じクエリ
const query = `*[_type == "product"] | order(priceJPY asc){
  name,
  priceJPY,
  servingsPerContainer,
  servingsPerDay,
  source,
  slug
}`;

const products = await client.fetch(query);

// フィルター適用（商品一覧ページと同じロジック）
const filtered = products.filter(
  (p) =>
    p.priceJPY &&
    typeof p.priceJPY === 'number' &&
    p.priceJPY > 0 &&
    p.servingsPerContainer &&
    p.servingsPerDay,
);

const yahooProducts = filtered.filter((p) => p.source === 'yahoo');
const rakutenProducts = filtered.filter((p) => p.source === 'rakuten');
const otherProducts = filtered.filter(
  (p) => p.source !== 'yahoo' && p.source !== 'rakuten',
);

console.log('📊 商品一覧ページのフィルター結果:\n');
console.log(`総商品数: ${products.length}件`);
console.log(`フィルター後: ${filtered.length}件`);
console.log(`  - Yahoo!商品: ${yahooProducts.length}件`);
console.log(`  - 楽天商品: ${rakutenProducts.length}件`);
console.log(`  - その他: ${otherProducts.length}件\n`);

if (yahooProducts.length > 0) {
  console.log('✅ Yahoo!商品がフィルター通過しています:\n');
  yahooProducts.slice(0, 10).forEach((p, index) => {
    console.log(
      `${index + 1}. ${p.name.substring(0, 70)}${p.name.length > 70 ? '...' : ''}`,
    );
    console.log(`   価格: ¥${p.priceJPY} | 摂取: ${p.servingsPerDay}回/日 | 容量: ${p.servingsPerContainer}回分`);
    console.log(`   Slug: ${p.slug?.current || '❌ なし'}\n`);
  });

  if (yahooProducts.length > 10) {
    console.log(`   ... 他 ${yahooProducts.length - 10}件\n`);
  }
} else {
  console.log('❌ Yahoo!商品がフィルターで除外されています\n');

  // フィルターで除外されたYahoo!商品を調査
  const excludedYahoo = products.filter(
    (p) =>
      p.source === 'yahoo' &&
      (!p.priceJPY ||
        typeof p.priceJPY !== 'number' ||
        p.priceJPY <= 0 ||
        !p.servingsPerContainer ||
        !p.servingsPerDay),
  );

  if (excludedYahoo.length > 0) {
    console.log('🔍 除外されたYahoo!商品の理由:\n');
    excludedYahoo.slice(0, 5).forEach((p) => {
      console.log(`- ${p.name.substring(0, 60)}...`);
      console.log(`  priceJPY: ${p.priceJPY || '❌ なし'}`);
      console.log(`  servingsPerContainer: ${p.servingsPerContainer || '❌ なし'}`);
      console.log(`  servingsPerDay: ${p.servingsPerDay || '❌ なし'}\n`);
    });
  }
}
