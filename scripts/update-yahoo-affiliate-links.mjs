#!/usr/bin/env node

/**
 * Yahoo!商品のアフィリエイトリンク更新スクリプト
 *
 * 既存のYahoo!商品にバリューコマースのアフィリエイトリンクを追加します。
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();
const VALUE_COMMERCE_SID = envContent.match(/VALUE_COMMERCE_SID=(.+)/)?.[1]?.trim();
const VALUE_COMMERCE_PID = envContent.match(/VALUE_COMMERCE_PID=(.+)/)?.[1]?.trim();

/**
 * バリューコマースのアフィリエイトリンクを生成
 */
function generateValueCommerceUrl(itemUrl) {
  if (!VALUE_COMMERCE_SID || !VALUE_COMMERCE_PID) {
    console.warn('⚠️  VALUE_COMMERCE_SID or VALUE_COMMERCE_PID not set');
    return itemUrl;
  }

  const encodedUrl = encodeURIComponent(itemUrl);
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${VALUE_COMMERCE_SID}&pid=${VALUE_COMMERCE_PID}&vc_url=${encodedUrl}`;
}

/**
 * Yahoo!商品を取得
 */
async function getYahooProducts() {
  const query = `*[_type == "product" && source == "yahoo" && defined(priceData)] {
    _id,
    name,
    priceData[] {
      source,
      url,
      amount,
      shopName
    }
  }`;

  const response = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/production?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * 商品のアフィリエイトリンクを更新
 */
async function updateProductAffiliateLinks(product) {
  const updatedPriceData = product.priceData.map(price => {
    if (price.source === 'yahoo' && price.url) {
      const affiliateUrl = generateValueCommerceUrl(price.url);
      return {
        ...price,
        url: affiliateUrl,
      };
    }
    return price;
  });

  // Sanityに更新をパッチ
  const mutations = [
    {
      patch: {
        id: product._id,
        set: { priceData: updatedPriceData },
      },
    },
  ];

  const response = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/production`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutations }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update product: ${JSON.stringify(error)}`);
  }

  return updatedPriceData.filter(p => p.source === 'yahoo').length;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Yahoo!商品のアフィリエイトリンク更新を開始します...\n');

  // 環境変数チェック
  if (!SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN が設定されていません');
    console.error('📝 .env.localに環境変数を追加してください。');
    process.exit(1);
  }

  if (!VALUE_COMMERCE_SID || !VALUE_COMMERCE_PID) {
    console.error('❌ VALUE_COMMERCE_SID または VALUE_COMMERCE_PID が設定されていません');
    console.error('📝 .env.localに環境変数を追加してください。');
    process.exit(1);
  }

  console.log('✅ 環境変数チェック完了');
  console.log(`   SID: ${VALUE_COMMERCE_SID}`);
  console.log(`   PID: ${VALUE_COMMERCE_PID}\n`);

  // Yahoo!商品を取得
  console.log('📦 Yahoo!商品を取得中...');
  const products = await getYahooProducts();
  console.log(`   取得した商品数: ${products.length}件\n`);

  if (products.length === 0) {
    console.log('ℹ️  更新対象の商品がありません。');
    return;
  }

  // 各商品のアフィリエイトリンクを更新
  console.log('🔄 アフィリエイトリンクを更新中...\n');
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      const updatedCount = await updateProductAffiliateLinks(product);
      console.log(`✅ ${product.name} (${updatedCount}件のYahoo!価格を更新)`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${product.name} の更新に失敗:`, error.message);
      errorCount++;
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(60));
  console.log('📊 更新結果サマリー');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${successCount}件`);
  console.log(`❌ 失敗: ${errorCount}件`);
  console.log(`📦 合計: ${products.length}件`);
  console.log('='.repeat(60));

  if (successCount > 0) {
    console.log('\n🎉 アフィリエイトリンクの更新が完了しました！');
    console.log('\n📋 次のステップ:');
    console.log('   1. ローカル環境で動作確認（npm run dev）');
    console.log('   2. 商品詳細ページでYahoo!リンクをクリック');
    console.log('   3. バリューコマース管理画面でクリック数を確認');
  }
}

// スクリプト実行
main().catch(error => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
