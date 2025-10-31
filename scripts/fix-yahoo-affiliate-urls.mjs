#!/usr/bin/env node

/**
 * Yahoo!商品のアフィリエイトリンクを修正
 *
 * 目的: 古い認証情報を使用しているaffiliateUrlを新しい認証情報で更新
 *
 * 処理内容:
 * 1. 古いSID/PIDを使用している商品を検出
 * 2. 元のURLを抽出
 * 3. 新しいSID/PIDで再生成
 * 4. Sanityを更新
 *
 * 使用方法:
 *   node scripts/fix-yahoo-affiliate-urls.mjs
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

// 旧認証情報（不正解）
const OLD_SID = '3756214';
const OLD_PID = '892196964';

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  console.error('❌ Error: Sanity credentials not found in .env.local');
  process.exit(1);
}

if (!VALUE_COMMERCE_SID || !VALUE_COMMERCE_PID) {
  console.error('❌ Error: ValueCommerce credentials not found in .env.local');
  process.exit(1);
}

console.log(`✅ 新しい認証情報: SID=${VALUE_COMMERCE_SID}, PID=${VALUE_COMMERCE_PID}`);
console.log(`⚠️  旧認証情報: SID=${OLD_SID}, PID=${OLD_PID}\n`);

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * バリューコマースのアフィリエイトリンクから元のURLを抽出
 */
function extractOriginalUrl(affiliateUrl) {
  if (!affiliateUrl) return null;

  // vc_url=... の部分を抽出
  const match = affiliateUrl.match(/vc_url=([^&]+)/);
  if (!match) return null;

  return decodeURIComponent(match[1]);
}

/**
 * バリューコマースのアフィリエイトリンクを生成
 */
function generateValueCommerceUrl(originalUrl) {
  if (!VALUE_COMMERCE_SID || !VALUE_COMMERCE_PID) {
    return originalUrl;
  }

  const encodedUrl = encodeURIComponent(originalUrl);
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${VALUE_COMMERCE_SID}&pid=${VALUE_COMMERCE_PID}&vc_url=${encodedUrl}`;
}

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
 * URLが旧認証情報を使っているかチェック
 */
function hasOldCredentials(url) {
  const creds = extractCredentials(url);
  if (!creds) return false;

  return creds.sid === OLD_SID || creds.pid === OLD_PID;
}

/**
 * URLが正しい認証情報を使っているかチェック
 */
function hasCorrectCredentials(url) {
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
 * 商品のaffiliateUrlを更新
 */
async function updateProductAffiliateUrl(productId, newAffiliateUrl) {
  await client
    .patch(productId)
    .set({ affiliateUrl: newAffiliateUrl })
    .commit();
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔧 Yahoo!商品のアフィリエイトリンクを修正中...\n');

  const products = await getYahooProducts();
  console.log(`📦 対象商品数: ${products.length}件\n`);

  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // affiliateUrlをチェック
      if (!product.affiliateUrl) {
        console.log(`⏭️  スキップ: ${product.name} - affiliateUrlなし`);
        skippedCount++;
        continue;
      }

      // すでに正しい認証情報を使用している場合はスキップ
      if (hasCorrectCredentials(product.affiliateUrl)) {
        console.log(`✅ OK: ${product.name} - すでに正しい認証情報を使用`);
        skippedCount++;
        continue;
      }

      // 旧認証情報を使用している場合は修正
      if (hasOldCredentials(product.affiliateUrl)) {
        const originalUrl = extractOriginalUrl(product.affiliateUrl);
        if (!originalUrl) {
          console.error(`❌ エラー: ${product.name} - 元のURLを抽出できませんでした`);
          errorCount++;
          continue;
        }

        const newAffiliateUrl = generateValueCommerceUrl(originalUrl);

        console.log(`🔧 修正中: ${product.name}`);
        console.log(`   元URL: ${originalUrl}`);
        console.log(`   旧: ${product.affiliateUrl.substring(0, 80)}...`);
        console.log(`   新: ${newAffiliateUrl.substring(0, 80)}...`);

        await updateProductAffiliateUrl(product._id, newAffiliateUrl);

        console.log(`   ✅ 更新完了\n`);
        fixedCount++;
      } else {
        console.log(`⚠️  不明: ${product.name} - 認証情報が想定外の形式`);
        const creds = extractCredentials(product.affiliateUrl);
        console.log(`   SID: ${creds?.sid}, PID: ${creds?.pid}\n`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ エラー: ${product.name} - ${error.message}\n`);
      errorCount++;
    }
  }

  // 結果サマリー
  console.log('='.repeat(80));
  console.log('📊 修正結果サマリー');
  console.log('='.repeat(80));
  console.log(`✅ 修正完了: ${fixedCount}件`);
  console.log(`⏭️  スキップ: ${skippedCount}件`);
  console.log(`❌ エラー: ${errorCount}件`);
  console.log(`📦 合計: ${products.length}件\n`);

  if (fixedCount > 0) {
    console.log('💡 次のステップ:');
    console.log('   node scripts/check-all-yahoo-links.mjs でチェックしてください\n');
  }
}

main().catch(console.error);
