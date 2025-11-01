import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 Sanity データ検証\n');

// 全商品数
const allProducts = await client.fetch(`count(*[_type == "product"])`);
console.log(`全商品数: ${allProducts}件\n`);

// 全成分データあり
const withIngredients = await client.fetch(`count(*[_type == "product" && defined(allIngredients)])`);
console.log(`全成分データあり: ${withIngredients}件 (${Math.round(withIngredients / allProducts * 100)}%)\n`);

// 全成分データなし
const withoutIngredients = await client.fetch(`count(*[_type == "product" && !defined(allIngredients)])`);
console.log(`全成分データなし: ${withoutIngredients}件 (${Math.round(withoutIngredients / allProducts * 100)}%)\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// ソース別（全成分データなし）
const rakutenWithoutIngredients = await client.fetch(`count(*[_type == "product" && source == "rakuten" && !defined(allIngredients)])`);
const yahooWithoutIngredients = await client.fetch(`count(*[_type == "product" && source == "yahoo" && !defined(allIngredients)])`);

console.log('全成分データなし（ソース別）:');
console.log(`  楽天: ${rakutenWithoutIngredients}件`);
console.log(`  Yahoo: ${yahooWithoutIngredients}件\n`);

// 楽天商品（説明文あり＆全成分データなし）
const rakutenWithDescWithoutIngredients = await client.fetch(`count(*[_type == "product" && source == "rakuten" && defined(description) && !defined(allIngredients)])`);
console.log(`楽天（説明文あり＆全成分データなし）: ${rakutenWithDescWithoutIngredients}件\n`);

// Yahoo商品（説明文あり＆全成分データなし）
const yahooWithDescWithoutIngredients = await client.fetch(`count(*[_type == "product" && source == "yahoo" && defined(description) && !defined(allIngredients)])`);
console.log(`Yahoo（説明文あり＆全成分データなし）: ${yahooWithDescWithoutIngredients}件\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// サンプル取得（楽天商品で全成分データなし）
const rakutenSamples = await client.fetch(`*[_type == "product" && source == "rakuten" && defined(description) && !defined(allIngredients)][0...3] {
  _id,
  name,
  "descLength": length(description),
  "hasIngredients": defined(allIngredients)
}`);

console.log('楽天商品サンプル（全成分データなし）:\n');
rakutenSamples.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name?.substring(0, 60)}`);
  console.log(`   説明文長: ${p.descLength}文字`);
  console.log(`   全成分データ: ${p.hasIngredients ? 'あり' : 'なし'}\n`);
});
