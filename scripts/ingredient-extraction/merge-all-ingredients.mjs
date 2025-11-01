import { createClient } from '@sanity/client';
import fs from 'fs';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n📝 全成分データを既存データとマージ中...\n');

// NDJSONファイルを読み込む
const ndjsonContent = fs.readFileSync('extracted-all-ingredients-v2.ndjson', 'utf-8');
const extractedProducts = ndjsonContent
  .trim()
  .split('\n')
  .map(line => JSON.parse(line));

const extractedMap = new Map();
extractedProducts.forEach(product => {
  extractedMap.set(product._id, product.allIngredients);
});

console.log(`抽出した全成分データ: ${extractedProducts.length}件\n`);

// Sanityから既存の商品データを取得
const existingProducts = await client.fetch(`*[_type == "product" && _id in $ids] {
  ...
}`, {
  ids: Array.from(extractedMap.keys()),
});

console.log(`既存の商品データ: ${existingProducts.length}件\n`);

// マージ
const mergedProducts = existingProducts.map(product => {
  const allIngredients = extractedMap.get(product._id);
  if (allIngredients) {
    return {
      ...product,
      allIngredients,
    };
  }
  return product;
});

// NDJSONに出力
const ndjson = mergedProducts.map(product => JSON.stringify(product)).join('\n');
fs.writeFileSync('merged-products-with-ingredients.ndjson', ndjson);

console.log(`✅ merged-products-with-ingredients.ndjson を作成しました（${mergedProducts.length}件）\n`);
console.log('次のステップ:');
console.log('  npx sanity dataset import merged-products-with-ingredients.ndjson production --replace\n');
