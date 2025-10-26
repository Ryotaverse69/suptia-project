#!/usr/bin/env node
/**
 * 商品データを詳細分析して、本当のダミー商品を特定するスクリプト
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
      slug,
      brand->{name},
      priceJPY,
      externalImageUrl,
      externalUrl,
      "source": externalUrl,
      _createdAt,
      _updatedAt
    }
  `);

  console.log('═'.repeat(80));
  console.log('📊 商品データ詳細分析');
  console.log('═'.repeat(80));
  console.log(`合計商品数: ${products.length}件\n`);

  // 1. Yahoo!ショッピング商品（externalUrlにshopping.yahoo.co.jpが含まれる）
  const yahooProducts = products.filter(p =>
    p.externalUrl?.includes('shopping.yahoo.co.jp')
  );
  console.log(`\n🛍️  Yahoo!ショッピング商品: ${yahooProducts.length}件`);
  console.log('   判定基準: externalUrlに"shopping.yahoo.co.jp"を含む');

  // 2. 楽天市場商品（externalUrlにrakuten.co.jpが含まれる）
  const rakutenProducts = products.filter(p =>
    p.externalUrl?.includes('rakuten.co.jp') ||
    p.externalUrl?.includes('item.rakuten')
  );
  console.log(`\n🛒 楽天市場商品: ${rakutenProducts.length}件`);
  console.log('   判定基準: externalUrlに"rakuten.co.jp"を含む');

  // 3. Amazon商品（将来用）
  const amazonProducts = products.filter(p =>
    p.externalUrl?.includes('amazon.co.jp')
  );
  console.log(`\n📦 Amazon商品: ${amazonProducts.length}件`);
  console.log('   判定基準: externalUrlに"amazon.co.jp"を含む');

  // 4. ECサイトのURL情報がない商品（本当のダミーの可能性が高い）
  const noExternalUrl = products.filter(p =>
    !p.externalUrl ||
    p.externalUrl === '' ||
    p.externalUrl.includes('example.com') ||
    p.externalUrl.includes('placeholder')
  );
  console.log(`\n❓ ECサイトURL情報がない商品: ${noExternalUrl.length}件`);
  console.log('   判定基準: externalUrlが空、または"example.com"/"placeholder"を含む');
  console.log('   → これらが本当のダミー商品の可能性が高い');

  // 5. 画像URLがない商品（ダミーとは限らない）
  const noImageUrl = products.filter(p => !p.externalImageUrl);
  console.log(`\n🖼️  画像URLがない商品: ${noImageUrl.length}件`);
  console.log('   ※ 注意: Yahoo!/楽天の実データでも画像が取得できなかった可能性あり');

  // 6. 詳細表示（ECサイトURL情報がない商品）
  if (noExternalUrl.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log('📋 ECサイトURL情報がない商品（削除候補）の詳細:');
    console.log('─'.repeat(80));
    noExternalUrl.slice(0, 20).forEach((p, i) => {
      const createdDate = new Date(p._createdAt).toLocaleString('ja-JP');
      console.log(`\n${(i+1).toString().padStart(2)}. ${p.name.substring(0, 70)}`);
      console.log(`    ID: ${p._id}`);
      console.log(`    作成日: ${createdDate}`);
      console.log(`    ブランド: ${p.brand?.name || 'なし'}`);
      console.log(`    価格: ${p.priceJPY ? '¥' + p.priceJPY.toLocaleString() : 'なし'}`);
      console.log(`    画像URL: ${p.externalImageUrl ? '✅ あり' : '❌ なし'}`);
      console.log(`    外部URL: ${p.externalUrl || '❌ なし'}`);
    });
    if (noExternalUrl.length > 20) {
      console.log(`\n    ... 他 ${noExternalUrl.length - 20}件`);
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('📊 推奨される削除対象:');
  console.log('═'.repeat(80));
  console.log(`ECサイトURL情報がない商品: ${noExternalUrl.length}件`);
  console.log('');
  console.log('✅ 保持すべき商品:');
  console.log(`   Yahoo!ショッピング: ${yahooProducts.length}件`);
  console.log(`   楽天市場: ${rakutenProducts.length}件`);
  console.log(`   Amazon: ${amazonProducts.length}件`);
  console.log(`   合計: ${yahooProducts.length + rakutenProducts.length + amazonProducts.length}件`);
  console.log('');
}

main().catch(console.error);
