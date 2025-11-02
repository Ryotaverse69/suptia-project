#!/usr/bin/env node

/**
 * Amazon商品をSanityに追加するスクリプト
 *
 * 使用方法:
 * node scripts/add-amazon-product.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

// Sanityクライアントを初期化
const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * slugを生成
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字を削除
    .replace(/\s+/g, '-') // スペースをハイフンに
    .replace(/--+/g, '-') // 連続するハイフンを1つに
    .substring(0, 96); // 最大96文字
}

/**
 * ブランドを取得または作成
 */
async function getOrCreateBrand(brandName) {
  // 既存のブランドを検索
  const existingBrand = await sanity.fetch(
    `*[_type == "brand" && name == $brandName][0]`,
    { brandName }
  );

  if (existingBrand) {
    console.log(`✅ ブランド「${brandName}」が見つかりました`);
    return existingBrand._id;
  }

  // 新規作成
  const brandSlug = generateSlug(brandName);
  const brand = await sanity.create({
    _type: 'brand',
    name: brandName,
    slug: {
      _type: 'slug',
      current: brandSlug,
    },
  });

  console.log(`✨ ブランド「${brandName}」を作成しました`);
  return brand._id;
}

/**
 * Amazon商品を追加
 */
async function addAmazonProduct() {
  console.log('🚀 Amazon商品の登録を開始します...\n');

  // 商品情報（手動で設定）
  const productData = {
    name: 'DHC ビタミンC ハードカプセル 60日分 120粒',
    brand: 'DHC',
    asin: 'B008S6QCZK',
    price: 398, // Amazonの現在価格（要確認）
    servingsPerContainer: 120, // 120粒
    servingsPerDay: 2, // 1日2粒
    amazonUrl: 'https://www.amazon.co.jp/dp/B008S6QCZK?tag=suptia69-22',
    imageUrl: 'https://m.media-amazon.com/images/I/71qZ8Z9ZQJL._AC_SL1500_.jpg', // Amazon画像URL
    description: 'DHCのビタミンC。1日2粒で500mgのビタミンCを摂取できます。60日分の大容量でコストパフォーマンスに優れています。',
  };

  try {
    // ブランドを取得または作成
    const brandId = await getOrCreateBrand(productData.brand);

    // 商品slugを生成
    const productSlug = generateSlug(`${productData.brand}-vitamin-c-60days`);

    // 商品ドキュメントを作成
    const product = {
      _type: 'product',
      name: productData.name,
      slug: {
        _type: 'slug',
        current: productSlug,
      },
      brand: {
        _type: 'reference',
        _ref: brandId,
      },
      priceJPY: productData.price,
      servingsPerContainer: productData.servingsPerContainer,
      servingsPerDay: productData.servingsPerDay,
      externalImageUrl: productData.imageUrl,
      description: productData.description,
      source: 'amazon',
      prices: [
        {
          _type: 'productPrice',
          _key: `amazon-${Date.now()}`,
          source: 'amazon',
          amount: productData.price,
          currency: 'JPY',
          url: productData.amazonUrl,
          inStock: true,
          fetchedAt: new Date().toISOString(),
        },
      ],
      // Amazon固有のフィールド
      asin: productData.asin,
    };

    // Sanityに保存
    const result = await sanity.create(product);

    console.log('\n✅ 商品の登録が完了しました！');
    console.log(`📦 商品名: ${result.name}`);
    console.log(`🔗 slug: ${result.slug.current}`);
    console.log(`💰 価格: ¥${result.priceJPY}`);
    console.log(`🏪 ソース: Amazon`);
    console.log(`\n🌐 商品ページURL: https://suptia.com/products/${result.slug.current}`);

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    if (error.response) {
      console.error('詳細:', error.response);
    }
    process.exit(1);
  }
}

// スクリプト実行
addAmazonProduct();
