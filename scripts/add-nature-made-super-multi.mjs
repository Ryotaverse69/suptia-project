#!/usr/bin/env node

/**
 * ネイチャーメイド スーパーマルチビタミン&ミネラルをSanityに登録するスクリプト
 *
 * 商品情報:
 * - 商品名: ネイチャーメイド スーパーマルチビタミン&ミネラル
 * - ブランド: ネイチャーメイド（大塚製薬）
 * - JANコード: 4987035513711
 * - ASIN: B00516RULK
 * - 内容量: 120粒（120日分）
 * - 1日の摂取目安: 1粒
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// apps/web/.env.local から環境変数を読み込み
dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const productData = {
  _type: 'product',
  name: 'ネイチャーメイド スーパーマルチビタミン&ミネラル 120粒',
  slug: {
    _type: 'slug',
    current: 'nature-made-super-multi-vitamin-mineral-120',
  },
  brand: {
    _ref: 'brand-44on44kk44ob44oj44o8', // ネイチャーメイド
    _type: 'reference',
  },
  source: 'amazon',
  janCode: '4987035513711',
  itemCode: 'B00516RULK',
  affiliateUrl: 'https://amzn.to/3WIdkfk',
  identifiers: {
    jan: '4987035513711',
    asin: 'B00516RULK',
  },
  ingredients: [
    // ビタミン12種類
    {
      ingredient: { _ref: 'ingredient-vitamin-a', _type: 'reference' },
      amountMgPerServing: 0.3, // 300μg
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b1', _type: 'reference' },
      amountMgPerServing: 1.5,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b2', _type: 'reference' },
      amountMgPerServing: 1.7,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b6', _type: 'reference' },
      amountMgPerServing: 2,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b12', _type: 'reference' },
      amountMgPerServing: 0.003, // 3μg
    },
    {
      ingredient: { _ref: 'ingredient-niacin', _type: 'reference' },
      amountMgPerServing: 15,
    },
    {
      ingredient: { _ref: 'ingredient-pantothenic-acid', _type: 'reference' },
      amountMgPerServing: 6,
    },
    {
      ingredient: { _ref: 'ingredient-folic-acid', _type: 'reference' },
      amountMgPerServing: 0.24, // 240μg
    },
    {
      ingredient: { _ref: 'ingredient-biotin', _type: 'reference' },
      amountMgPerServing: 0.05, // 50μg
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-c', _type: 'reference' },
      amountMgPerServing: 125,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-d', _type: 'reference' },
      amountMgPerServing: 0.01, // 10μg
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-e', _type: 'reference' },
      amountMgPerServing: 9,
    },
    // ミネラル7種類
    {
      ingredient: { _ref: 'ingredient-calcium', _type: 'reference' },
      amountMgPerServing: 200,
    },
    {
      ingredient: { _ref: 'ingredient-magnesium', _type: 'reference' },
      amountMgPerServing: 100,
    },
    {
      ingredient: { _ref: 'ingredient-zinc', _type: 'reference' },
      amountMgPerServing: 6,
    },
    {
      ingredient: { _ref: 'ingredient-iron', _type: 'reference' },
      amountMgPerServing: 4,
    },
    {
      ingredient: { _ref: 'ingredient-copper', _type: 'reference' },
      amountMgPerServing: 0.6,
    },
    {
      ingredient: { _ref: 'ingredient-selenium', _type: 'reference' },
      amountMgPerServing: 0.05, // 50μg
    },
    {
      ingredient: { _ref: 'ingredient-chromium', _type: 'reference' },
      amountMgPerServing: 0.02, // 20μg
    },
  ],
  servingsPerDay: 1,
  servingsPerContainer: 120,
  priceJPY: 2850,
  urls: {
    amazon: 'https://amzn.to/3WIdkfk',
  },
  warnings: ['アレルギー物質（28品目中）: ゼラチン、乳成分'],
  references: [
    {
      title: 'スーパーマルチビタミン&ミネラル - ネイチャーメイド公式',
      url: 'https://www.otsuka.co.jp/nmd/product/item_115/',
      source: '大塚製薬公式サイト',
    },
    {
      title: '日本人の食事摂取基準（2020年版）',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html',
      source: '厚生労働省',
    },
  ],
  description:
    'ビタミン12種類とミネラル7種類をギュッと1粒に凝縮した基礎的なサプリメント。毎日の栄養補給を目的としたベースサプリメントとして、健康づくりの基本に最適です。1日1粒で手軽に摂取でき、美容・健康維持、食生活のサポート、身体・体型管理に役立ちます。栄養機能食品（亜鉛、銅、ビオチン）。',
  allIngredients:
    'セレン酵母、クロム酵母、サンゴカルシウム、セルロース、酸化Mg、V.C、グルコン酸亜鉛、ショ糖脂肪酸エステル、ナイアシンアミド、硫酸鉄、酢酸V.E(乳成分を含む)、ヒドロキシプロピルメチルセルロース、パントテン酸Ca、グルコン酸銅、V.B6、V.B1、V.B2、β-カロテン（ゼラチンを含む）、V.A、葉酸、ビオチン、V.D、V.B12',
  form: 'capsule',
  thirdPartyTested: true,
  availability: 'in-stock',
  scores: {
    safety: 92,
    evidence: 88,
    costEffectiveness: 95,
    overall: 92,
  },
  reviewStats: {
    averageRating: 4.3,
    reviewCount: 8500,
  },
  tierRatings: {
    priceRank: 'S',
    costEffectivenessRank: 'S',
    contentRank: 'A',
    evidenceRank: 'A',
    safetyRank: 'A',
    overallRank: 'S',
  },
  priceData: [
    {
      source: 'amazon',
      amount: 1623,
      currency: 'JPY',
      url: 'https://amzn.to/3WIdkfk',
      fetchedAt: new Date().toISOString(),
      confidence: 0.95,
    },
  ],
};

async function addProduct() {
  console.log('🔄 ネイチャーメイド スーパーマルチビタミン&ミネラルをSanityに登録中...\n');

  try {
    const result = await client.create(productData);

    console.log('✅ 商品登録完了！');
    console.log(`📦 商品ID: ${result._id}`);
    console.log(`🔗 スラッグ: ${result.slug.current}`);
    console.log(`💰 価格: ¥${result.priceJPY.toLocaleString()}`);
    console.log(`📊 成分数: ${result.ingredients.length}種類`);
    console.log(`⭐ 総合評価: ${result.tierRatings.overallRank}ランク`);
    console.log('');
    console.log(
      `🌐 商品ページURL: http://localhost:3000/products/${result.slug.current}`
    );
  } catch (error) {
    console.error('❌ 商品登録エラー:', error.message);
    if (error.response) {
      console.error('詳細:', error.response);
    }
    process.exit(1);
  }
}

addProduct().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
