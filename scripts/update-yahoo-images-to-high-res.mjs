#!/usr/bin/env node

/**
 * Yahoo商品の画像を高解像度版に更新
 *
 * 既存のYahoo商品の画像URLをmedium → largeに更新します。
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fny3jdcg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const YAHOO_CLIENT_ID = process.env.YAHOO_SHOPPING_CLIENT_ID;

if (!YAHOO_CLIENT_ID) {
  console.error('❌ YAHOO_SHOPPING_CLIENT_ID が見つかりません');
  process.exit(1);
}

async function updateYahooImages() {
  console.log('🔍 Yahoo商品の画像を高解像度版に更新中...\n');

  try {
    // Yahoo商品を取得
    const yahooProducts = await client.fetch(`
      *[_type == "product" && source == "yahoo"]{
        _id,
        name,
        itemCode,
        externalImageUrl
      }
    `);

    console.log(`📊 Yahoo商品: ${yahooProducts.length}件\n`);

    if (yahooProducts.length === 0) {
      console.log('⚠️  Yahoo商品が見つかりませんでした');
      return;
    }

    const mutations = [];
    let updated = 0;
    let skipped = 0;

    for (const product of yahooProducts) {
      console.log(`処理中: ${product.name.substring(0, 60)}...`);

      // Yahoo APIから最新の商品情報を取得
      const params = new URLSearchParams({
        appid: YAHOO_CLIENT_ID,
        itemcode: product.itemCode,
      });

      const response = await fetch(
        `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`
      );

      if (!response.ok) {
        console.log(`  ⚠️  APIエラー: ${response.status}`);
        skipped++;
        continue;
      }

      const data = await response.json();
      const item = data.hits?.[0];

      if (!item) {
        console.log(`  ⚠️  商品が見つかりません`);
        skipped++;
        continue;
      }

      // large → medium → small の優先順位で画像URL取得
      const newImageUrl = item.image?.large || item.image?.medium || item.image?.small;

      if (!newImageUrl) {
        console.log(`  ⚠️  画像URLが見つかりません`);
        skipped++;
        continue;
      }

      // 既存のURLと比較
      if (product.externalImageUrl === newImageUrl) {
        console.log(`  ✓ 既に最新の画像URL`);
        skipped++;
        continue;
      }

      console.log(`  🔄 更新: ${product.externalImageUrl?.substring(0, 50) || '(なし)'}...`);
      console.log(`       → ${newImageUrl.substring(0, 50)}...`);

      // 更新
      mutations.push({
        patch: {
          id: product._id,
          set: {
            externalImageUrl: newImageUrl,
          },
        },
      });

      updated++;

      // APIレート制限対策（1秒待機）
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Sanityに一括更新
    if (mutations.length > 0) {
      console.log(`\n💾 Sanityに保存中... (${mutations.length}件)`);
      await client
        .transaction(mutations.map((m) => client.patch(m.patch.id).set(m.patch.set)))
        .commit();
      console.log('✅ 保存完了\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 更新結果');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`  🔄 更新: ${updated}件`);
    console.log(`  ⏭️  スキップ: ${skipped}件`);
    console.log(`  合計: ${yahooProducts.length}件\n`);

  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

updateYahooImages()
  .then(() => {
    console.log('✅ 完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラー:', error);
    process.exit(1);
  });
