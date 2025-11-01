import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 抽出失敗商品の分析\n');

// 全商品のdescriptionを取得（既にallIngredientsがないもの）
const products = await client.fetch(`*[_type == "product" && defined(description) && !defined(allIngredients)][0...10] {
  _id,
  name,
  description
}`);

console.log(`サンプル商品: ${products.length}件\n`);

products.forEach((product, index) => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📦 商品 ${index + 1}: ${product.name?.substring(0, 60)}\n`);

  // 説明文で「成分」「原材料」に関連するキーワードを探す
  const keywords = ['原材料', '全成分', '成分', '栄養成分', '配合', 'アレルギー'];
  const foundKeywords = keywords.filter(kw => product.description?.includes(kw));

  console.log(`キーワード検出: ${foundKeywords.length > 0 ? foundKeywords.join(', ') : 'なし'}\n`);

  if (foundKeywords.length > 0) {
    // キーワード周辺のテキストを表示
    const keyword = foundKeywords[0];
    const index = product.description.indexOf(keyword);
    const snippet = product.description.substring(Math.max(0, index - 50), index + 300);
    console.log(`周辺テキスト:\n${snippet}\n`);
  } else {
    // 説明文全体の最初の300文字を表示
    console.log(`説明文（最初の300文字）:\n${product.description?.substring(0, 300)}\n`);
  }
});
