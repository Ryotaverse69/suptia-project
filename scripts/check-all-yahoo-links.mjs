#!/usr/bin/env node

/**
 * Yahoo!商品のアフィリエイトリンクを全チェック
 *
 * 目的: すべてのYahoo!商品で正しいバリューコマース認証情報が使われているか確認
 *
 * チェック内容:
 * 1. affiliateUrl フィールド（商品レベル）
 * 2. priceData[].url フィールド（価格レベル）
 *
 * 使用方法:
 *   node scripts/check-all-yahoo-links.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localから環境変数を読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_PROJECT_ID = envContent
  .match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]
  ?.trim();
const SANITY_DATASET = envContent
  .match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]
  ?.trim();
const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

const VALUE_COMMERCE_SID = envContent
  .match(/VALUE_COMMERCE_SID=(.+)/)?.[1]
  ?.trim();
const VALUE_COMMERCE_PID = envContent
  .match(/VALUE_COMMERCE_PID=(.+)/)?.[1]
  ?.trim();

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  console.error('❌ Error: Sanity credentials not found in .env.local');
  process.exit(1);
}

if (!VALUE_COMMERCE_SID || !VALUE_COMMERCE_PID) {
  console.error('❌ Error: ValueCommerce credentials not found in .env.local');
  process.exit(1);
}

console.log(`✅ Using ValueCommerce credentials: SID=${VALUE_COMMERCE_SID}, PID=${VALUE_COMMERCE_PID}`);

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * SIDとPIDをURLから抽出
 */
function extractCredentials(url) {
  if (!url) return null;

  const sidMatch = url.match(/sid=(\d+)/);
  const pidMatch = url.match(/pid=(\d+)/);

  return {
    sid: sidMatch ? sidMatch[1] : null,
    pid: pidMatch ? pidMatch[1] : null,
  };
}

/**
 * URLが正しい認証情報を使っているかチェック
 */
function isCorrectCredentials(url) {
  const creds = extractCredentials(url);
  if (!creds || !creds.sid || !creds.pid) return false;

  return creds.sid === VALUE_COMMERCE_SID && creds.pid === VALUE_COMMERCE_PID;
}

/**
 * Yahoo!商品を全取得
 */
async function getYahooProducts() {
  const query = `*[_type == "product" && source == "yahoo"] {
    _id,
    name,
    slug,
    affiliateUrl,
    priceData[] {
      source,
      url,
      amount,
      shopName
    }
  }`;

  return await client.fetch(query);
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔍 Yahoo!商品のアフィリエイトリンクをチェック中...\n');

  const products = await getYahooProducts();
  console.log(`📦 対象商品数: ${products.length}件\n`);

  let totalLinks = 0;
  let correctLinks = 0;
  let incorrectLinks = 0;
  const issues = [];

  for (const product of products) {
    const productIssues = [];

    // 1. affiliateUrlをチェック
    if (product.affiliateUrl) {
      totalLinks++;
      if (isCorrectCredentials(product.affiliateUrl)) {
        correctLinks++;
      } else {
        incorrectLinks++;
        const creds = extractCredentials(product.affiliateUrl);
        productIssues.push({
          field: 'affiliateUrl',
          url: product.affiliateUrl,
          sid: creds?.sid || 'N/A',
          pid: creds?.pid || 'N/A',
        });
      }
    }

    // 2. priceData[].urlをチェック
    if (product.priceData) {
      for (const price of product.priceData) {
        if (price.url) {
          totalLinks++;
          if (isCorrectCredentials(price.url)) {
            correctLinks++;
          } else {
            incorrectLinks++;
            const creds = extractCredentials(price.url);
            productIssues.push({
              field: `priceData[${price.shopName || price.source}].url`,
              url: price.url,
              sid: creds?.sid || 'N/A',
              pid: creds?.pid || 'N/A',
            });
          }
        }
      }
    }

    if (productIssues.length > 0) {
      issues.push({
        _id: product._id,
        name: product.name,
        slug: product.slug?.current || 'N/A',
        issues: productIssues,
      });
    }
  }

  // レポート出力
  console.log('=' .repeat(80));
  console.log('📊 チェック結果サマリー');
  console.log('='.repeat(80));
  console.log(`✅ 正常なリンク: ${correctLinks}件`);
  console.log(`❌ 問題のあるリンク: ${incorrectLinks}件`);
  console.log(`📦 合計: ${totalLinks}件\n`);

  if (issues.length > 0) {
    console.log('⚠️  問題のある商品:\n');
    for (const issue of issues) {
      console.log(`📦 ${issue.name} (${issue._id})`);
      console.log(`   Slug: ${issue.slug}`);
      for (const detail of issue.issues) {
        console.log(`   - ${detail.field}:`);
        console.log(`     SID: ${detail.sid} (期待値: ${VALUE_COMMERCE_SID})`);
        console.log(`     PID: ${detail.pid} (期待値: ${VALUE_COMMERCE_PID})`);
        console.log(`     URL: ${detail.url.substring(0, 100)}...`);
      }
      console.log('');
    }

    console.log('💡 修正方法:');
    console.log('   node scripts/fix-yahoo-affiliate-urls.mjs\n');
  } else {
    console.log('✅ すべてのYahoo!商品のアフィリエイトリンクが正しい認証情報を使用しています！\n');
  }
}

main().catch(console.error);
