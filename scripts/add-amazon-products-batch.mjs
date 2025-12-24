#!/usr/bin/env node

/**
 * Amazon商品を一括でSanityに追加するスクリプト
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

const sanity = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: SANITY_API_TOKEN,
  useCdn: false,
});

const AMAZON_TAG = 'suptia6902-22';

// 追加する5件のAmazon商品
const amazonProducts = [
  {
    name: 'DHC ビタミンC ハードカプセル 90日分 180粒',
    brand: 'DHC',
    asin: 'B01FW9LG74',
    price: 633,
    servingsPerContainer: 180,
    servingsPerDay: 2,
    description: 'DHCのビタミンC。1日2粒で1,000mgのビタミンCを摂取。ビタミンB2配合で効率的に働きます。',
    ingredientName: 'ビタミンC',
    amountMgPerServing: 500, // 1粒あたり
  },
  {
    name: 'UHAグミサプリ ビタミンC 30日分 60粒',
    brand: 'UHA味覚糖',
    asin: 'B01FHREIKI',
    price: 608,
    servingsPerContainer: 60,
    servingsPerDay: 2,
    description: 'おいしく手軽にビタミンC補給。レモン味のグミタイプで続けやすいサプリメント。',
    ingredientName: 'ビタミンC',
    amountMgPerServing: 250,
  },
  {
    name: 'ディアナチュラ ビタミンC・亜鉛・乳酸菌・ビタミンB2・ビタミンB6 120粒 60日分',
    brand: 'ディアナチュラ',
    asin: 'B07GSD97L2',
    price: 491,
    servingsPerContainer: 120,
    servingsPerDay: 2,
    description: 'ビタミンCに亜鉛、乳酸菌、ビタミンB群を配合。健康維持をサポート。',
    ingredientName: 'ビタミンC',
    amountMgPerServing: 525,
  },
  {
    name: 'ディアナチュラスタイル ビタミンC MIX 120粒 60日分',
    brand: 'ディアナチュラ',
    asin: 'B07GSDJ6T2',
    price: 464,
    servingsPerContainer: 120,
    servingsPerDay: 2,
    description: 'ビタミンCと亜鉛のミックス。パウチタイプで持ち運びに便利。',
    ingredientName: 'ビタミンC',
    amountMgPerServing: 525,
  },
  {
    name: 'ディアナチュラスタイル ビタミンC 120粒 60日分',
    brand: 'ディアナチュラ',
    asin: 'B01B74CAB4',
    price: 354,
    servingsPerContainer: 120,
    servingsPerDay: 2,
    description: 'シンプルなビタミンCサプリ。1日2粒で1,050mgのビタミンCを摂取できます。',
    ingredientName: 'ビタミンC',
    amountMgPerServing: 525,
  },
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .substring(0, 96);
}

async function getOrCreateBrand(brandName) {
  const existingBrand = await sanity.fetch(
    `*[_type == "brand" && name == $brandName][0]`,
    { brandName }
  );

  if (existingBrand) {
    console.log(`  ✓ ブランド「${brandName}」が見つかりました`);
    return existingBrand._id;
  }

  const brandSlug = generateSlug(brandName);
  const brand = await sanity.create({
    _type: 'brand',
    name: brandName,
    slug: { _type: 'slug', current: brandSlug },
  });

  console.log(`  ✨ ブランド「${brandName}」を作成しました`);
  return brand._id;
}

async function getOrCreateIngredient(ingredientName) {
  const existingIngredient = await sanity.fetch(
    `*[_type == "ingredient" && name == $ingredientName][0]`,
    { ingredientName }
  );

  if (existingIngredient) {
    return existingIngredient._id;
  }

  const ingredient = await sanity.create({
    _type: 'ingredient',
    name: ingredientName,
    nameEn: ingredientName === 'ビタミンC' ? 'Vitamin C' : ingredientName,
    slug: { _type: 'slug', current: generateSlug(ingredientName) },
    evidenceLevel: 'A',
    category: 'vitamin',
  });

  console.log(`  ✨ 成分「${ingredientName}」を作成しました`);
  return ingredient._id;
}

async function addAmazonProduct(productData) {
  console.log(`\n📦 追加中: ${productData.name}`);

  // 既存チェック
  const existing = await sanity.fetch(
    `*[_type == "product" && identifiers.asin == $asin][0]`,
    { asin: productData.asin }
  );

  if (existing) {
    console.log(`  ⚠️ 既に存在します: ${existing.name}`);
    return existing;
  }

  const brandId = await getOrCreateBrand(productData.brand);
  const ingredientId = await getOrCreateIngredient(productData.ingredientName);

  const amazonUrl = `https://www.amazon.co.jp/dp/${productData.asin}?tag=${AMAZON_TAG}`;
  const productSlug = generateSlug(`${productData.brand}-${productData.name}-amazon`);

  const product = {
    _type: 'product',
    name: productData.name,
    slug: { _type: 'slug', current: productSlug },
    brand: { _type: 'reference', _ref: brandId },
    source: 'amazon',
    priceJPY: productData.price,
    servingsPerContainer: productData.servingsPerContainer,
    servingsPerDay: productData.servingsPerDay,
    description: productData.description,
    availability: 'in-stock',
    identifiers: {
      asin: productData.asin,
    },
    urls: {
      amazon: amazonUrl,
    },
    affiliateUrl: amazonUrl,
    ingredients: [
      {
        _key: `ing-${Date.now()}`,
        ingredient: { _type: 'reference', _ref: ingredientId },
        amountMgPerServing: productData.amountMgPerServing,
        isPrimary: true,
      },
    ],
    priceData: [
      {
        _key: `pd-${Date.now()}`,
        source: 'amazon',
        amount: productData.price,
        currency: 'JPY',
        url: amazonUrl,
        fetchedAt: new Date().toISOString(),
        confidence: 0.95,
      },
    ],
    // 初期Tierランク（後で自動計算スクリプトで更新）
    tierRatings: {
      priceRank: 'A',
      costEffectivenessRank: 'A',
      contentRank: 'B',
      evidenceRank: 'A',
      safetyRank: 'A',
      overallRank: 'A',
    },
  };

  const result = await sanity.create(product);
  console.log(`  ✅ 追加完了: ${result.name}`);
  console.log(`     slug: ${result.slug.current}`);
  return result;
}

async function main() {
  console.log('🚀 Amazon商品の一括追加を開始します...\n');
  console.log(`📋 追加予定: ${amazonProducts.length}件\n`);

  const results = [];
  for (const product of amazonProducts) {
    try {
      const result = await addAmazonProduct(product);
      results.push(result);
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`✅ 完了: ${results.length}/${amazonProducts.length}件を追加しました`);
  console.log('========================================\n');

  console.log('📋 追加された商品:');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.name}`);
    console.log(`     URL: https://suptia.com/products/${r.slug.current}`);
  });
}

main().catch(console.error);
