#!/usr/bin/env node

/**
 * 日本新薬 極セレクト マルチビタミンミネラルをSanityに登録するスクリプト
 *
 * 商品情報:
 * - 商品名: 極セレクト マルチビタミンミネラル 90日分
 * - ブランド: 日本新薬（極セレクト）
 * - ASIN: B0D8KDXW2C
 * - 内容量: 180粒（90日分）
 * - 1日の摂取目安: 2粒
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

// 日本新薬ブランドを先に作成
const nipponShinyakuBrand = {
  _id: 'brand-nippon-shinyaku',
  _type: 'brand',
  name: '日本新薬（極セレクト）',
  nameEn: 'Nippon Shinyaku (KIWAMI SELECT)',
  description:
    '日本新薬株式会社は、1919年創業の老舗製薬会社です。「極セレクト」ブランドでは、製薬会社の品質基準に基づいた高品質なサプリメントを提供しています。GMP認定工場で国内製造し、厳選した成分を配合した製品を展開しています。',
  country: '日本',
  website: 'https://www.nippon-shinyaku-shop.com/',
};

const productData = {
  _type: 'product',
  name: '極セレクト マルチビタミンミネラル 90日分',
  slug: {
    _type: 'slug',
    current: 'kiwami-select-multi-vitamin-mineral-90',
  },
  brand: {
    _ref: 'brand-nippon-shinyaku',
    _type: 'reference',
  },
  source: 'amazon',
  itemCode: 'B0D8KDXW2C',
  affiliateUrl: 'https://amzn.to/43ihfDo',
  identifiers: {
    asin: 'B0D8KDXW2C',
  },
  ingredients: [
    // ビタミン12種類
    {
      ingredient: { _ref: 'ingredient-vitamin-a', _type: 'reference' },
      amountMgPerServing: 0.28, // 280μg
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b1', _type: 'reference' },
      amountMgPerServing: 1.2,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b2', _type: 'reference' },
      amountMgPerServing: 1.4,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b6', _type: 'reference' },
      amountMgPerServing: 1.3,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b12', _type: 'reference' },
      amountMgPerServing: 0.0024, // 2.4μg
    },
    {
      ingredient: { _ref: 'ingredient-niacin', _type: 'reference' },
      amountMgPerServing: 13,
    },
    {
      ingredient: { _ref: 'ingredient-pantothenic-acid', _type: 'reference' },
      amountMgPerServing: 4.8,
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
      amountMgPerServing: 100,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-d', _type: 'reference' },
      amountMgPerServing: 0.0055, // 5.5μg
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-e', _type: 'reference' },
      amountMgPerServing: 6.3,
    },
    // ミネラル9種類
    {
      ingredient: { _ref: 'ingredient-calcium', _type: 'reference' },
      amountMgPerServing: 155,
    },
    {
      ingredient: { _ref: 'ingredient-magnesium', _type: 'reference' },
      amountMgPerServing: 50,
    },
    {
      ingredient: { _ref: 'ingredient-zinc', _type: 'reference' },
      amountMgPerServing: 3.0,
    },
    {
      ingredient: { _ref: 'ingredient-iron', _type: 'reference' },
      amountMgPerServing: 3.0,
    },
    {
      ingredient: { _ref: 'ingredient-copper', _type: 'reference' },
      amountMgPerServing: 0.07,
    },
    {
      ingredient: { _ref: 'ingredient-manganese', _type: 'reference' },
      amountMgPerServing: 0.1,
    },
    {
      ingredient: { _ref: 'ingredient-selenium', _type: 'reference' },
      amountMgPerServing: 0.0025, // 2.5μg
    },
    {
      ingredient: { _ref: 'ingredient-chromium', _type: 'reference' },
      amountMgPerServing: 0.002, // 2μg
    },
    {
      ingredient: { _ref: 'ingredient-molybdenum', _type: 'reference' },
      amountMgPerServing: 0.002, // 2μg
    },
    // その他成分
    {
      ingredient: { _ref: 'ingredient-probiotics', _type: 'reference' },
      amountMgPerServing: 1, // 10億個（数値化困難のため1mgとして記録）
    },
  ],
  servingsPerDay: 2,
  servingsPerContainer: 90,
  priceJPY: 2280,
  urls: {
    amazon: 'https://amzn.to/43ihfDo',
  },
  warnings: [
    '乳成分を含みます',
    '薬を服用中または通院中の方は医師に相談してください',
    '妊娠・授乳中の方、お子様は使用を控えてください',
  ],
  references: [
    {
      title: '極セレクト マルチビタミンミネラル - 日本新薬公式オンラインショップ',
      url: 'https://www.nippon-shinyaku-shop.com/shop/products/4202T',
      source: '日本新薬公式サイト',
    },
    {
      title: '日本人の食事摂取基準（2020年版）',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html',
      source: '厚生労働省',
    },
  ],
  description:
    '製薬会社品質の国内製造サプリメント。不足しがちな必須ビタミン12種とミネラル9種を100%必要量を2粒に詰め込みました。また健康に大切な乳酸菌EC-12株を10億個配合。GMP認定工場で製造された高品質な製品です。小粒で飲みやすく、90日分の大容量でお手頃価格を実現。',
  allIngredients:
    'でんぷん(国内製造)、酵母(亜鉛含有)、ビタミンE含有植物油、デキストリン、酵母(マンガン含有)、酵母(銅含有)、酵母(セレン含有)、酵母(クロム含有)、酵母(モリブデン含有)、乳酸菌(殺菌)(乳成分を含む)/炭酸Ca、V.C、酸化Mg、セルロース、ステアリン酸Ca、ナイアシン、ピロリン酸鉄、リン酸Ca、プルラン、加工デンプン、パントテン酸Ca、V.B₆、V.B₂、V.B₁、β‐カロテン、V.A、葉酸、ビオチン、V.D、V.B₁₂',
  form: 'tablet',
  thirdPartyTested: true,
  availability: 'in-stock',
  scores: {
    safety: 92,
    evidence: 87,
    costEffectiveness: 90,
    overall: 90,
  },
  reviewStats: {
    averageRating: 4.4,
    reviewCount: 850,
  },
  tierRatings: {
    priceRank: 'A',
    costEffectivenessRank: 'A',
    contentRank: 'A',
    evidenceRank: 'A',
    safetyRank: 'A',
    overallRank: 'A',
  },
  priceData: [
    {
      source: 'amazon',
      amount: 2280,
      currency: 'JPY',
      url: 'https://amzn.to/43ihfDo',
      fetchedAt: new Date().toISOString(),
      confidence: 0.95,
    },
  ],
};

async function addNipponShinyakuProduct() {
  console.log('🔄 日本新薬 極セレクト商品をSanityに登録中...\n');

  try {
    // ブランドを先に作成
    console.log('📝 日本新薬ブランドを作成中...');
    const brandResult = await client.createOrReplace(nipponShinyakuBrand);
    console.log(`✅ ブランド作成完了: ${brandResult._id}\n`);

    // 商品を作成
    console.log('📦 商品を作成中...');
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

addNipponShinyakuProduct().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
