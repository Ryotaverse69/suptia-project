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
 * 既存商品を検索
 */
async function findExistingProduct(productData) {
  console.log(`🔍 既存商品を検索中: ${productData.name}...`);

  // ブランド名と商品名で検索
  const query = `*[_type == "product" &&
    brand->name == $brandName &&
    (name match $searchName || name == $exactName)
  ][0...10]{
    _id,
    name,
    brand->{name},
    servingsPerContainer,
    servingsPerDay,
    prices[]{source, amount},
    asin
  }`;

  const searchName = `*ビタミンC*60日*`;
  const results = await sanity.fetch(query, {
    brandName: productData.brand,
    searchName,
    exactName: productData.name,
  });

  if (results.length === 0) {
    console.log('❌ 既存商品が見つかりませんでした');
    return null;
  }

  console.log(`\n📋 ${results.length}件の候補が見つかりました:\n`);
  results.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   容量: ${p.servingsPerContainer}粒, 1日: ${p.servingsPerDay}粒`);
    console.log(`   既存価格: ${p.prices?.map(pr => `${pr.source}:¥${pr.amount}`).join(', ') || 'なし'}`);
    console.log(`   ASIN: ${p.asin || 'なし'}\n`);
  });

  // 完全一致を優先、次に容量一致
  const exactMatch = results.find(p =>
    p.name === productData.name &&
    p.servingsPerContainer === productData.servingsPerContainer
  );

  if (exactMatch) {
    console.log(`✅ 完全一致商品を発見: ${exactMatch.name}`);
    return exactMatch;
  }

  // 容量のみ一致
  const capacityMatch = results.find(p =>
    p.servingsPerContainer === productData.servingsPerContainer &&
    p.servingsPerDay === productData.servingsPerDay
  );

  if (capacityMatch) {
    console.log(`✅ 容量一致商品を発見: ${capacityMatch.name}`);
    return capacityMatch;
  }

  // 最初の候補を返す
  console.log(`⚠️  完全一致なし、最初の候補を使用: ${results[0].name}`);
  return results[0];
}

/**
 * Amazon価格を既存商品に追加
 */
async function addAmazonPriceToProduct(productId, productData) {
  console.log(`\n💰 Amazon価格を追加中...`);

  const amazonPrice = {
    _type: 'productPrice',
    _key: `amazon-${Date.now()}`,
    source: 'amazon',
    amount: productData.price,
    currency: 'JPY',
    url: productData.amazonUrl,
    inStock: true,
    fetchedAt: new Date().toISOString(),
  };

  // 既存のprices配列にAmazon価格を追加
  await sanity
    .patch(productId)
    .setIfMissing({ prices: [] })
    .append('prices', [amazonPrice])
    .set({ asin: productData.asin }) // ASINも追加
    .commit();

  console.log('✅ Amazon価格を追加しました！');
}

/**
 * 新規商品を作成
 */
async function createNewProduct(productData, brandId) {
  console.log('\n📦 新規商品を作成中...');

  const productSlug = generateSlug(`${productData.brand}-vitamin-c-60days-${Date.now()}`);

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
    asin: productData.asin,
  };

  const result = await sanity.create(product);
  console.log(`✅ 新規商品を作成しました: ${result.name}`);
  return result;
}

/**
 * Amazon商品を追加または更新
 */
async function addAmazonProduct() {
  console.log('🚀 Amazon商品の登録を開始します...\n');

  // 商品情報（手動で設定）
  const productData = {
    name: 'DHC ビタミンC ハードカプセル 60日分 120粒',
    brand: 'DHC',
    asin: 'B008S6QCZK',
    price: 398, // Amazonの現在価格
    servingsPerContainer: 120, // 120粒
    servingsPerDay: 2, // 1日2粒
    amazonUrl: 'https://www.amazon.co.jp/dp/B008S6QCZK?tag=suptia6902-22',
    imageUrl: 'https://m.media-amazon.com/images/I/71qZ8Z9ZQJL._AC_SL1500_.jpg',
    description: 'DHCのビタミンC。1日2粒で500mgのビタミンCを摂取できます。60日分の大容量でコストパフォーマンスに優れています。',
  };

  try {
    // ブランドを取得または作成
    const brandId = await getOrCreateBrand(productData.brand);

    // 既存商品を検索
    const existingProduct = await findExistingProduct(productData);

    if (existingProduct) {
      // 既存商品にAmazon価格を追加
      await addAmazonPriceToProduct(existingProduct._id, productData);

      console.log('\n✅ 商品の更新が完了しました！');
      console.log(`📦 商品名: ${existingProduct.name}`);
      console.log(`💰 Amazon価格: ¥${productData.price}`);
      console.log(`🔗 ASIN: ${productData.asin}`);
    } else {
      // 新規商品を作成
      const result = await createNewProduct(productData, brandId);

      console.log('\n✅ 商品の登録が完了しました！');
      console.log(`📦 商品名: ${result.name}`);
      console.log(`🔗 slug: ${result.slug.current}`);
      console.log(`💰 価格: ¥${result.priceJPY}`);
      console.log(`🏪 ソース: Amazon`);
      console.log(`\n🌐 商品ページURL: https://suptia.com/products/${result.slug.current}`);
    }

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
