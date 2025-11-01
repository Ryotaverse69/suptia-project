import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 残り商品の詳細分析\n');

// 全成分データがない商品を取得
const products = await client.fetch(`*[_type == "product" && !defined(allIngredients)] {
  _id,
  name,
  description,
  source
}`);

console.log(`全成分データなし: ${products.length}件\n`);

// ソース別に分類
const bySource = {
  rakuten: products.filter(p => p.source === 'rakuten'),
  yahoo: products.filter(p => p.source === 'yahoo'),
  other: products.filter(p => p.source !== 'rakuten' && p.source !== 'yahoo'),
};

// 説明文の有無別に分類
const rakutenWithDesc = bySource.rakuten.filter(p => p.description && p.description.length > 0);
const rakutenWithoutDesc = bySource.rakuten.filter(p => !p.description || p.description.length === 0);
const yahooWithDesc = bySource.yahoo.filter(p => p.description && p.description.length > 0);
const yahooWithoutDesc = bySource.yahoo.filter(p => !p.description || p.description.length === 0);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 ソース別統計:');
console.log(`  楽天: ${bySource.rakuten.length}件`);
console.log(`    - 説明文あり: ${rakutenWithDesc.length}件`);
console.log(`    - 説明文なし: ${rakutenWithoutDesc.length}件`);
console.log(`  Yahoo: ${bySource.yahoo.length}件`);
console.log(`    - 説明文あり: ${yahooWithDesc.length}件`);
console.log(`    - 説明文なし: ${yahooWithoutDesc.length}件`);
console.log(`  その他: ${bySource.other.length}件\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 楽天商品で説明文ありの最初の10件をサンプル表示
console.log('🔍 楽天商品（説明文あり）のサンプル（10件）:\n');

const keywords = ['原材料', '全成分', '栄養成分', '配合成分', '成分表'];

rakutenWithDesc.slice(0, 10).forEach((product, index) => {
  const hasKeyword = keywords.some(kw => product.description.includes(kw));
  const descLength = product.description.length;

  console.log(`${index + 1}. ${product.name?.substring(0, 60)}`);
  console.log(`   説明文長: ${descLength}文字`);
  console.log(`   キーワード: ${hasKeyword ? '✅ あり' : '❌ なし'}`);

  if (hasKeyword) {
    const keyword = keywords.find(kw => product.description.includes(kw));
    const keywordIndex = product.description.indexOf(keyword);
    const before = product.description.substring(Math.max(0, keywordIndex - 30), keywordIndex);
    const after = product.description.substring(keywordIndex, Math.min(product.description.length, keywordIndex + 150));
    console.log(`   【${keyword}周辺】 ...${before}${after}...\n`);
  } else {
    console.log(`   【説明文（最初の200文字）】 ${product.description.substring(0, 200)}...\n`);
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 説明文ありでキーワードを含む商品の数
const rakutenWithKeyword = rakutenWithDesc.filter(p =>
  keywords.some(kw => p.description.includes(kw))
);

console.log('📌 重要な統計:');
console.log(`  楽天（説明文あり）: ${rakutenWithDesc.length}件`);
console.log(`  うちキーワード含む: ${rakutenWithKeyword.length}件`);
console.log(`  キーワード含むが未抽出: ${rakutenWithKeyword.length}件 ← 改善の余地\n`);
console.log(`  キーワードなし: ${rakutenWithDesc.length - rakutenWithKeyword.length}件 ← 抽出不可能\n`);
