#!/usr/bin/env node
/**
 * 本当のダミー商品を特定するスクリプト（改善版）
 *
 * 判定基準：
 * 1. priceData配列が空、または存在しない
 * 2. identifiersにrakutenItemCodeもyahooCodeもない
 * 3. urls（Amazon/楽天/iHerb）が全て空
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const products = await client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      _id,
      name,
      priceJPY,
      externalImageUrl,
      priceData,
      identifiers,
      urls,
      _createdAt
    }
  `);

  console.log('═'.repeat(80));
  console.log('📊 商品データ詳細分析（改善版）');
  console.log('═'.repeat(80));
  console.log(`合計商品数: ${products.length}件\n`);

  // 1. priceDataがあり、購入URLを持つ商品（Yahoo!/楽天からの実データ）
  const withPriceData = products.filter(p =>
    p.priceData && p.priceData.length > 0
  );
  console.log(`✅ priceDataあり（EC API同期データ）: ${withPriceData.length}件`);

  // 2. 楽天商品コードを持つ商品
  const withRakutenCode = products.filter(p =>
    p.identifiers?.rakutenItemCode
  );
  console.log(`✅ 楽天商品コードあり: ${withRakutenCode.length}件`);

  // 3. Yahoo!商品コードを持つ商品
  const withYahooCode = products.filter(p =>
    p.identifiers?.yahooCode
  );
  console.log(`✅ Yahoo!商品コードあり: ${withYahooCode.length}件`);

  // 4. urls（Amazon/楽天/iHerb）のいずれかがある商品
  const withUrls = products.filter(p =>
    p.urls?.amazon || p.urls?.rakuten || p.urls?.iherb
  );
  console.log(`✅ 購入リンク（urls）あり: ${withUrls.length}件`);

  // 5. 本当のダミー商品：上記すべてが空
  const realDummies = products.filter(p =>
    (!p.priceData || p.priceData.length === 0) &&
    !p.identifiers?.rakutenItemCode &&
    !p.identifiers?.yahooCode &&
    !p.urls?.amazon &&
    !p.urls?.rakuten &&
    !p.urls?.iherb
  );

  console.log(`\n❌ 本当のダミー商品（削除対象）: ${realDummies.length}件`);
  console.log('   判定基準: priceData、identifiers、urlsが全て空');

  // 詳細表示
  if (realDummies.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log('📋 ダミー商品の詳細（最初の20件）:');
    console.log('─'.repeat(80));
    realDummies.slice(0, 20).forEach((p, i) => {
      const createdDate = new Date(p._createdAt).toLocaleString('ja-JP');
      console.log(`\n${(i+1).toString().padStart(2)}. ${p.name.substring(0, 70)}`);
      console.log(`    ID: ${p._id}`);
      console.log(`    作成日: ${createdDate}`);
      console.log(`    価格: ${p.priceJPY ? '¥' + p.priceJPY.toLocaleString() : 'なし'}`);
      console.log(`    画像URL: ${p.externalImageUrl ? '✅' : '❌'}`);
    });
    if (realDummies.length > 20) {
      console.log(`\n    ... 他 ${realDummies.length - 20}件`);
    }
  }

  // 実データ商品の数
  const realProducts = products.length - realDummies.length;
  console.log('\n' + '═'.repeat(80));
  console.log('📊 サマリー:');
  console.log('═'.repeat(80));
  console.log(`実データ商品: ${realProducts}件`);
  console.log(`ダミー商品: ${realDummies.length}件`);
  console.log(`合計: ${products.length}件`);
  console.log('');

  // ダミー商品のIDリストを出力（削除スクリプト用）
  if (realDummies.length > 0) {
    console.log('\n💾 ダミー商品IDリスト（削除用）:');
    console.log('─'.repeat(80));
    console.log(JSON.stringify(realDummies.map(p => p._id), null, 2));
  }
}

main().catch(console.error);
