import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 抽出失敗の詳細分析\n');

// 全成分データがない商品を取得
const products = await client.fetch(`*[_type == "product" && defined(description) && !defined(allIngredients)][0...20] {
  _id,
  name,
  description,
  source
}`);

console.log(`対象商品: ${products.length}件\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const keywords = ['原材料名', '原材料', '全成分', '成分表示', '栄養成分', '配合成分'];

let withKeywords = 0;
let withoutKeywords = 0;
let yahooCount = 0;
let rakutenCount = 0;

products.forEach((product, index) => {
  const foundKeywords = keywords.filter(kw => product.description?.includes(kw));

  if (product.source === 'yahoo') {
    yahooCount++;
  } else if (product.source === 'rakuten') {
    rakutenCount++;
  }

  if (foundKeywords.length > 0) {
    withKeywords++;
    console.log(`\n📦 商品 ${index + 1}: ${product.name?.substring(0, 60)}`);
    console.log(`   ソース: ${product.source}`);
    console.log(`   キーワード: ${foundKeywords.join(', ')}\n`);

    // キーワード周辺を表示
    const keyword = foundKeywords[0];
    const keywordIndex = product.description.indexOf(keyword);
    const before = product.description.substring(Math.max(0, keywordIndex - 50), keywordIndex);
    const after = product.description.substring(keywordIndex, Math.min(product.description.length, keywordIndex + 200));

    console.log(`   【${keyword}周辺】`);
    console.log(`   ...${before}${after}...\n`);
    console.log('   ─'.repeat(60));
  } else {
    withoutKeywords++;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 統計:');
console.log(`  キーワードあり: ${withKeywords}件`);
console.log(`  キーワードなし: ${withoutKeywords}件`);
console.log(`  楽天: ${rakutenCount}件`);
console.log(`  Yahoo: ${yahooCount}件\n`);
