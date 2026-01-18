#!/usr/bin/env node

/**
 * NMN Amazon商品をSanityに追加するスクリプト
 * 閲覧数が取れる成分として選定
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

// NMN Amazon人気商品 3件
const nmnProducts = [
  {
    name: 'レバンテ NMN プレミアムサプリ 22050mg 90粒',
    brand: 'レバンテ',
    asin: 'B0CSF5GGS9',
    price: 2290,
    servingsPerContainer: 90,
    servingsPerDay: 1,
    description: '高純度100%β-NMN使用。1粒あたり245mgのNMN配合。耐酸性カプセルで腸まで届く。国内GMP認定工場製造。αリポ酸配合でエイジングケアをサポート。',
    ingredientName: 'NMN',
    amountMgPerServing: 245,
    imageUrl: 'https://m.media-amazon.com/images/I/61YqPQZPo6L._AC_SL1200_.jpg',
  },
  {
    name: 'HOMARE NMN サプリメント 18000mg 90粒',
    brand: 'ビクトリーロード',
    asin: 'B09SV8RG3Y',
    price: 3598,
    servingsPerContainer: 90,
    servingsPerDay: 1,
    description: '酵母発酵による高純度99%以上のNMN。1粒200mg配合。ビタミンB3由来、二酸化チタン不使用。クロレラ配合で栄養バランスも考慮。国内GMP認定工場製造。',
    ingredientName: 'NMN',
    amountMgPerServing: 200,
    imageUrl: 'https://m.media-amazon.com/images/I/71mYhPQZPwL._AC_SL1500_.jpg',
  },
  {
    name: 'SIMPLE+ NMN サプリ 日本製 4500mg 30粒',
    brand: 'モノコーポレーション',
    asin: 'B09QM13RQ1',
    price: 1280,
    servingsPerContainer: 30,
    servingsPerDay: 1,
    description: '純度100%のNMNを1粒150mg配合。30日分でお試しに最適。国内製造で安心品質。コストパフォーマンスに優れたエントリーモデル。',
    ingredientName: 'NMN',
    amountMgPerServing: 150,
    imageUrl: 'https://m.media-amazon.com/images/I/61AYqPZxPwL._AC_SL1200_.jpg',
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
    console.log(`  ✓ 成分「${ingredientName}」が見つかりました`);
    return existingIngredient._id;
  }

  const ingredient = await sanity.create({
    _type: 'ingredient',
    name: ingredientName,
    nameEn: 'NMN (Nicotinamide Mononucleotide)',
    slug: { _type: 'slug', current: 'nmn' },
    evidenceLevel: 'B', // NMNはまだ研究段階
    category: 'anti-aging',
    description: 'NMN（ニコチンアミドモノヌクレオチド）は、体内でNAD+に変換される物質。NAD+は細胞のエネルギー産生や代謝に関与し、加齢とともに減少することが知られています。',
  });

  console.log(`  ✨ 成分「${ingredientName}」を作成しました`);
  return ingredient._id;
}

async function addNMNProduct(productData) {
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
  const productSlug = generateSlug(`${productData.brand}-nmn-${productData.asin}`);

  // コスパ計算（円/mg）
  const daysSupply = productData.servingsPerContainer / productData.servingsPerDay;
  const totalMg = productData.amountMgPerServing * productData.servingsPerContainer;
  const costPerMg = productData.price / totalMg;
  const costPerDay = productData.price / daysSupply;

  console.log(`  💰 コスパ: ¥${costPerMg.toFixed(2)}/mg, ¥${costPerDay.toFixed(0)}/日`);

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
    externalImageUrl: productData.imageUrl,
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
    tierRatings: {
      priceRank: costPerDay < 50 ? 'S' : costPerDay < 100 ? 'A' : 'B',
      costEffectivenessRank: costPerMg < 0.15 ? 'S' : costPerMg < 0.25 ? 'A' : 'B',
      contentRank: productData.amountMgPerServing >= 200 ? 'A' : 'B',
      evidenceRank: 'B', // NMNは研究段階
      safetyRank: 'A',
      overallRank: 'A',
    },
  };

  const result = await sanity.create(product);
  console.log(`  ✅ 追加完了: ${result.name}`);
  console.log(`     URL: https://suptia.com/products/${result.slug.current}`);
  return result;
}

async function main() {
  console.log('🚀 NMN Amazon商品の追加を開始します...\n');
  console.log('📋 追加予定: 3件（閲覧数が取れる成分として選定）\n');
  console.log('──────────────────────────────────────────────────');

  const results = [];
  for (const product of nmnProducts) {
    try {
      const result = await addNMNProduct(product);
      results.push(result);
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log(`✅ 完了: ${results.length}/${nmnProducts.length}件を追加しました`);
  console.log('══════════════════════════════════════════════════\n');

  console.log('📋 追加された商品:');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.name}`);
    console.log(`     🔗 https://suptia.com/products/${r.slug.current}`);
    console.log(`     🛒 Amazon: https://www.amazon.co.jp/dp/${nmnProducts[i].asin}?tag=${AMAZON_TAG}`);
  });

  console.log('\n📝 次のステップ: note記事を作成してください');
}

main().catch(console.error);
