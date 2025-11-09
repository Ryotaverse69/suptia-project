#!/usr/bin/env node

/**
 * ファンケル マルチビタミン&ミネラル Base POWERをSanityに登録するスクリプト
 *
 * 商品情報:
 * - 商品名: ファンケル マルチビタミン&ミネラル Base POWER
 * - ブランド: ファンケル（FANCL）
 * - JANコード: 4908049652562
 * - ASIN: B0D3ZYKXM3
 * - 内容量: 90粒（30日分）
 * - 1日の摂取目安: 3粒
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

// ファンケルブランドを先に作成
const fanclBrand = {
  _id: 'brand-fancl',
  _type: 'brand',
  name: 'ファンケル',
  nameEn: 'FANCL',
  description:
    'ファンケルは、無添加化粧品・サプリメントを展開する日本の健康食品・化粧品メーカーです。「正直品質。」をモットーに、高品質で安全性の高い製品を提供しています。',
  country: '日本',
  website: 'https://www.fancl.co.jp/',
};

const productData = {
  _type: 'product',
  name: 'ファンケル マルチビタミン&ミネラル Base POWER 30日分',
  slug: {
    _type: 'slug',
    current: 'fancl-multi-vitamin-mineral-base-power-30',
  },
  brand: {
    _ref: 'brand-fancl',
    _type: 'reference',
  },
  source: 'amazon',
  janCode: '4908049652562',
  itemCode: 'B0D3ZYKXM3',
  affiliateUrl: 'https://amzn.to/3JBtx31',
  identifiers: {
    jan: '4908049652562',
    asin: 'B0D3ZYKXM3',
  },
  ingredients: [
    // ビタミン13種類
    {
      ingredient: { _ref: 'ingredient-vitamin-a', _type: 'reference' },
      amountMgPerServing: 1.54, // ベータカロテンとして
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b1', _type: 'reference' },
      amountMgPerServing: 12.0,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b2', _type: 'reference' },
      amountMgPerServing: 14.0,
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-b6', _type: 'reference' },
      amountMgPerServing: 13.0,
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
      amountMgPerServing: 0.01, // 10.0μg
    },
    {
      ingredient: { _ref: 'ingredient-vitamin-e', _type: 'reference' },
      amountMgPerServing: 80.0,
    },
    {
      ingredient: { _ref: 'ingredient-hesperidin', _type: 'reference' },
      amountMgPerServing: 25, // ビタミンP
    },
    // ミネラル7種類
    {
      ingredient: { _ref: 'ingredient-calcium', _type: 'reference' },
      amountMgPerServing: 100,
    },
    {
      ingredient: { _ref: 'ingredient-magnesium', _type: 'reference' },
      amountMgPerServing: 50,
    },
    {
      ingredient: { _ref: 'ingredient-zinc', _type: 'reference' },
      amountMgPerServing: 8.8,
    },
    {
      ingredient: { _ref: 'ingredient-iron', _type: 'reference' },
      amountMgPerServing: 2.04,
    },
    {
      ingredient: { _ref: 'ingredient-copper', _type: 'reference' },
      amountMgPerServing: 0.27,
    },
    {
      ingredient: { _ref: 'ingredient-manganese', _type: 'reference' },
      amountMgPerServing: 1.14,
    },
    {
      ingredient: { _ref: 'ingredient-molybdenum', _type: 'reference' },
      amountMgPerServing: 0.0075, // 7.5μg
    },
    // その他成分
    {
      ingredient: { _ref: 'ingredient-coenzyme-q10', _type: 'reference' },
      amountMgPerServing: 5,
    },
    {
      ingredient: { _ref: 'ingredient-probiotics', _type: 'reference' },
      amountMgPerServing: 1, // 50億個（数値化困難のため1mgとして記録）
    },
  ],
  servingsPerDay: 3,
  servingsPerContainer: 30,
  priceJPY: 1230,
  urls: {
    amazon: 'https://amzn.to/3JBtx31',
  },
  warnings: [
    'ビタミンB2により一時的に尿が黄色くなる可能性があります',
    '乳幼児・小児は摂取を避けてください',
  ],
  references: [
    {
      title:
        'マルチビタミン＆ミネラル Base POWER - ファンケル公式オンラインストア',
      url: 'https://www.fancl.co.jp/healthy/item/5561',
      source: 'ファンケル公式サイト',
    },
    {
      title: '日本人の食事摂取基準（2020年版）',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html',
      source: '厚生労働省',
    },
  ],
  description:
    '毎日の健康維持に必要なビタミン、ミネラル、乳酸菌など23種類の成分を3粒に凝縮したサプリメント。現代の食生活に対応し、炭水化物のエネルギー変換を助けるビタミンB1に加えて、ビタミンB2、B6、ビタミンE、亜鉛の配合量を強化。飲みやすい丸い錠剤タイプ。栄養機能食品（ビタミンB1、亜鉛、ビタミンE）。',
  allIngredients:
    '還元麦芽糖水飴（国内製造）、寒天、マンガン酵母、コエンザイムQ10、モリブデン酵母、植物性乳酸菌殺菌末、藤茶エキス、炭酸カルシウム、セルロース、ビタミンC、酢酸ビタミンE、酸化マグネシウム、ヒドロキシプロピルセルロース、グルコン酸亜鉛、ビタミンP、カルボキシメチルセルロースナトリウム、ビタミンB6、ビタミンB2、ナイアシンアミド、微粒二酸化ケイ素、ステアリン酸マグネシウム、ヒドロキシプロピルメチルセルロース、ビタミンB1、ピロリン酸鉄、パントテン酸カルシウム、環状オリゴ糖、グルコン酸銅、ベータカロテン、葉酸、ビオチン、ビタミンD、ビタミンB12',
  form: 'tablet',
  thirdPartyTested: true,
  availability: 'in-stock',
  scores: {
    safety: 90,
    evidence: 85,
    costEffectiveness: 88,
    overall: 88,
  },
  reviewStats: {
    averageRating: 4.2,
    reviewCount: 1200,
  },
  tierRatings: {
    priceRank: 'A',
    costEffectivenessRank: 'A',
    contentRank: 'S',
    evidenceRank: 'A',
    safetyRank: 'A',
    overallRank: 'A',
  },
  priceData: [
    {
      source: 'amazon',
      amount: 1230,
      currency: 'JPY',
      url: 'https://amzn.to/3JBtx31',
      fetchedAt: new Date().toISOString(),
      confidence: 0.95,
    },
  ],
};

async function addFanclProduct() {
  console.log('🔄 ファンケル商品をSanityに登録中...\n');

  try {
    // ブランドを先に作成
    console.log('📝 ファンケルブランドを作成中...');
    const brandResult = await client.createOrReplace(fanclBrand);
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

addFanclProduct().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
