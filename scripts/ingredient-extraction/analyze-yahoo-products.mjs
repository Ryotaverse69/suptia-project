import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 Yahoo商品の分析\n');

// Yahoo商品（説明文あり＆全成分データなし）
const products = await client.fetch(`*[_type == "product" && source == "yahoo" && defined(description) && !defined(allIngredients)][0...10] {
  _id,
  name,
  description
}`);

console.log(`対象商品: ${products.length}件\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const keywords = ['原材料', '全成分', '栄養成分', '配合成分', '成分表'];

products.forEach((product, index) => {
  const hasKeyword = keywords.some(kw => product.description?.includes(kw));
  const descLength = product.description?.length || 0;

  console.log(`\n${index + 1}. ${product.name?.substring(0, 70)}`);
  console.log(`   説明文長: ${descLength}文字`);
  console.log(`   キーワード: ${hasKeyword ? '✅ あり' : '❌ なし'}`);

  if (hasKeyword) {
    const keyword = keywords.find(kw => product.description.includes(kw));
    const keywordIndex = product.description.indexOf(keyword);
    const before = product.description.substring(Math.max(0, keywordIndex - 50), keywordIndex);
    const after = product.description.substring(keywordIndex, Math.min(product.description.length, keywordIndex + 200));
    console.log(`   【${keyword}周辺】 ...${before}${after}...\n`);
  } else {
    console.log(`   【説明文（最初の200文字）】 ${product.description?.substring(0, 200)}...\n`);
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 全Yahoo商品でキーワードを含む商品数
const allYahooProducts = await client.fetch(`*[_type == "product" && source == "yahoo" && defined(description) && !defined(allIngredients)] {
  _id,
  description
}`);

const yahooWithKeyword = allYahooProducts.filter(p =>
  keywords.some(kw => p.description?.includes(kw))
);

console.log('📌 統計:');
console.log(`  Yahoo商品（説明文あり）: ${allYahooProducts.length}件`);
console.log(`  うちキーワード含む: ${yahooWithKeyword.length}件`);
console.log(`  キーワードなし: ${allYahooProducts.length - yahooWithKeyword.length}件\n`);
