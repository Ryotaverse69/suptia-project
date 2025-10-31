#!/usr/bin/env node

/**
 * Yahoo!商品のpriceData.urlを修正
 *
 * 問題: priceData.urlが二重エンコードされている
 * 原因: 既にバリューコマースURLになっているものをさらにラップした
 *
 * 解決策:
 * 1. 二重エンコードされたURLから元のYahoo!ショッピングURLを抽出
 * 2. 正しいバリューコマースリンクを再生成
 *
 * 使用方法:
 *   node scripts/fix-yahoo-pricedata-urls.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * URLから元のYahoo!ショッピングURLを抽出
 */
function extractOriginalYahooUrl(url) {
  if (!url) return null;

  // パターン1: 二重エンコード（バリューコマース → バリューコマース → Yahoo）
  // https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=X&pid=Y&vc_url=https%3A%2F%2Fck.jp.ap.valuecommerce.com%2Fservlet%2Freferral%3Fsid%3DX%26pid%3DY%26vc_url%3Dhttps%253A%252F%252Fstore.shopping.yahoo.co.jp%252F...
  const doubleEncodedMatch = url.match(/vc_url=.*vc_url=([^&]+)/);
  if (doubleEncodedMatch) {
    return decodeURIComponent(decodeURIComponent(doubleEncodedMatch[1]));
  }

  // パターン2: 単一エンコード（バリューコマース → Yahoo）
  // https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=X&pid=Y&vc_url=https%3A%2F%2Fstore.shopping.yahoo.co.jp%2F...
  const singleEncodedMatch = url.match(/vc_url=([^&]+)/);
  if (singleEncodedMatch) {
    const decoded = decodeURIComponent(singleEncodedMatch[1]);
    // 既にバリューコマースURLの場合は再帰的に抽出
    if (decoded.includes('valuecommerce.com')) {
      return extractOriginalYahooUrl(decoded);
    }
    return decoded;
  }

  // パターン3: 既にYahoo!ショッピングURLの場合
  if (url.includes('shopping.yahoo.co.jp')) {
    return url;
  }

  return null;
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
 * Yahoo!商品を取得
 */
async function getYahooProducts() {
  const query = `*[_type == "product" && source == "yahoo"] {
    _id,
    name,
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
 * 商品のpriceDataを更新
 */
async function updateProductPriceData(productId, newPriceData) {
  await client.patch(productId).set({ priceData: newPriceData }).commit();
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔧 Yahoo!商品のpriceData.urlを修正中...\n');

  const products = await getYahooProducts();
  console.log(`📦 対象商品数: ${products.length}件\n`);

  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      if (!product.priceData || product.priceData.length === 0) {
        console.log(`⏭️  スキップ: ${product.name} - priceDataなし`);
        skippedCount++;
        continue;
      }

      let needsUpdate = false;
      const updatedPriceData = product.priceData.map((price) => {
        // 二重エンコードチェック: vc_urlの中身にvaluecommerceが含まれているか
        if (price.url && price.url.includes('vc_url=')) {
          const vcUrlMatch = price.url.match(/vc_url=([^&]+)/);
          if (vcUrlMatch) {
            const vcUrlValue = decodeURIComponent(vcUrlMatch[1]);
            // vc_urlの中身がバリューコマースURLの場合は二重エンコード
            if (vcUrlValue.includes('valuecommerce.com')) {
              const originalUrl = extractOriginalYahooUrl(price.url);
              if (originalUrl) {
                needsUpdate = true;
                console.log(`🔧 修正: ${product.name.substring(0, 40)}...`);
                console.log(`   元URL: ${originalUrl.substring(0, 80)}...`);
                const newUrl = generateValueCommerceUrl(originalUrl);
                console.log(`   新URL: ${newUrl.substring(0, 80)}...`);
                return { ...price, url: newUrl };
              }
            }
          }
        }
        return price;
      });

      if (needsUpdate) {
        await updateProductPriceData(product._id, updatedPriceData);
        console.log(`   ✅ 更新完了\n`);
        fixedCount++;
      } else {
        console.log(`✅ OK: ${product.name.substring(0, 40)}... - 問題なし`);
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
    console.log('   Yahoo!商品の購入リンクを再度テストしてください\n');
  }
}

main().catch(console.error);
