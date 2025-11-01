#!/usr/bin/env node

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

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('🔍 priceDataに店舗名・数量情報を追加中...\n');

// priceDataを持つ全商品を取得
const query = `*[_type == "product" && defined(priceData) && count(priceData) > 0] {
  _id,
  name,
  priceData,
  source
}`;

const products = await client.fetch(query);

console.log(`📦 priceDataを持つ商品: ${products.length}件\n`);

if (products.length === 0) {
  console.log('⚠️  priceDataを持つ商品がありません');
  process.exit(0);
}

/**
 * 商品名からセット数量を検出
 */
function extractQuantity(productName) {
  const setPattern = /(\d+)(個|袋|本|缶|箱|パック)セット/;
  const setMatch = productName.match(setPattern);
  if (setMatch) {
    return parseInt(setMatch[1], 10);
  }

  const multiplyPattern = /[×*xX](\d+)(個|袋|本|缶|箱|パック)/;
  const multiplyMatch = productName.match(multiplyPattern);
  if (multiplyMatch) {
    return parseInt(multiplyMatch[1], 10);
  }

  const bracketPattern = /[（(【](\d+)(個|袋|本|缶|箱|パック)[）)】]/;
  const bracketMatch = productName.match(bracketPattern);
  if (bracketMatch) {
    return parseInt(bracketMatch[1], 10);
  }

  return 1;
}

/**
 * 商品名から販売元名を抽出
 */
function extractStoreName(productName, source) {
  const bracketMatch = productName.match(/【(.+?)】/);
  if (bracketMatch) {
    return bracketMatch[1];
  }

  const slashMatch = productName.match(/＼(.+?)／/);
  if (slashMatch) {
    return slashMatch[1];
  }

  const knownStores = {
    rakuten: [
      'ツルハドラッグ',
      'tsuruha',
      '楽天24',
      'rakuten24',
      'コスメ21',
      'アットライフ',
      'at-life',
      'くすりのフクタロウ',
      'DHC',
    ],
    yahoo: ['エクセレント', 'ekuserennto', 'セルニック', 'selnic', 'ヤフーショッピング'],
  };

  const storeKeywords = knownStores[source] || [];
  for (const keyword of storeKeywords) {
    const regex = new RegExp(keyword, 'i');
    if (regex.test(productName)) {
      return keyword;
    }
  }

  const sourceNames = {
    rakuten: '楽天市場',
    yahoo: 'Yahoo!ショッピング',
    amazon: 'Amazon',
    iherb: 'iHerb',
  };

  return sourceNames[source] || source;
}

let totalUpdated = 0;
let totalErrors = 0;

for (const product of products) {
  console.log(`\n処理中: ${product.name.substring(0, 60)}...`);
  console.log(`  現在のpriceData件数: ${product.priceData.length}件`);

  // 各priceDataエントリーを更新
  const updatedPriceData = product.priceData.map((pd) => {
    // 既に詳細情報がある場合はスキップ
    if (pd.productName && pd.storeName && pd.quantity && pd.unitPrice) {
      return pd;
    }

    // productNameから情報を抽出（priceDataにproductNameがない場合は親商品名を使用）
    const productName = pd.productName || product.name;
    const quantity = extractQuantity(productName);
    const storeName = extractStoreName(productName, pd.source);
    const unitPrice = Math.round(pd.amount / quantity);

    return {
      ...pd,
      productName,
      storeName,
      quantity,
      unitPrice,
    };
  });

  // 更新を適用
  try {
    await client.patch(product._id).set({ priceData: updatedPriceData }).commit();
    totalUpdated++;
    console.log(`  ✅ 更新完了`);

    // 更新後の情報を表示
    updatedPriceData.forEach((pd, index) => {
      const quantityLabel = pd.quantity > 1 ? ` (${pd.quantity}個セット, ¥${pd.unitPrice}/個)` : '';
      console.log(
        `    ${index + 1}. [${pd.source}] ${pd.storeName} - ¥${pd.amount.toLocaleString()}${quantityLabel}`
      );
    });
  } catch (error) {
    console.error(`  ❌ 更新失敗: ${error.message}`);
    totalErrors++;
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n✅ 更新完了: ${totalUpdated}件の商品のpriceDataを更新しました`);
if (totalErrors > 0) {
  console.log(`❌ エラー: ${totalErrors}件`);
}
console.log('');

console.log('💡 確認方法:');
console.log('   商品詳細ページで店舗名と単位価格が表示されることを確認してください');
console.log('   例: http://localhost:3000/products/dhc-dhc-c-60-120\n');
