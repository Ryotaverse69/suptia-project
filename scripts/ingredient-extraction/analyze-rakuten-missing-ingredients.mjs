import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 楽天商品の全成分データ未抽出分析\n');

// 楽天商品で説明文はあるが全成分データがない商品
const products = await client.fetch(`*[_type == "product" && source == "rakuten" && defined(description) && !defined(allIngredients)][0...10] {
  _id,
  name,
  description
}`);

console.log(`対象商品: ${products.length}件\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

products.forEach((product, index) => {
  console.log(`\n📦 商品 ${index + 1}: ${product.name?.substring(0, 60)}\n`);

  // キーワード検索
  const keywords = ['原材料名', '原材料', '全成分', '成分表示', '栄養成分', '配合成分'];
  const foundKeywords = keywords.filter(kw => product.description?.includes(kw));

  console.log(`キーワード検出: ${foundKeywords.length > 0 ? foundKeywords.join(', ') : 'なし'}\n`);

  if (foundKeywords.length > 0) {
    // キーワード周辺を表示
    const keyword = foundKeywords[0];
    const keywordIndex = product.description.indexOf(keyword);
    const before = product.description.substring(Math.max(0, keywordIndex - 30), keywordIndex);
    const after = product.description.substring(keywordIndex, Math.min(product.description.length, keywordIndex + 400));

    console.log(`【${keyword}周辺のテキスト】`);
    console.log(`...${before}${after}...\n`);
  } else {
    // キーワードなし - 説明文の最初の300文字
    console.log(`【説明文（最初の300文字）】`);
    console.log(`${product.description?.substring(0, 300)}\n`);
  }

  console.log('─'.repeat(60));
});

console.log('\n');
