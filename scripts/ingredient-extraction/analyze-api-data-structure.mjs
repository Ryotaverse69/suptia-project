import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 API取得データの構造分析\n');

// 楽天とYahooから取得した商品のdescriptionを確認
const products = await client.fetch(`*[_type == "product" && (source == "rakuten" || source == "yahoo")] {
  _id,
  name,
  source,
  description,
  allIngredients,
  "descriptionLength": length(description)
} | order(descriptionLength desc)[0...10]`);

console.log(`サンプル商品: ${products.length}件\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

products.forEach((product, index) => {
  console.log(`\n📦 商品 ${index + 1}:`);
  console.log(`   ソース: ${product.source}`);
  console.log(`   名前: ${product.name?.substring(0, 60)}`);
  console.log(`   説明文の長さ: ${product.descriptionLength}文字`);
  console.log(`   全成分データ: ${product.allIngredients ? '✅ あり' : '❌ なし'}`);

  // 「原材料」「成分」などのキーワードを探す
  const keywords = ['原材料名', '原材料', '全成分', '成分表示', '栄養成分'];
  const foundKeywords = keywords.filter(kw => product.description?.includes(kw));

  console.log(`   キーワード検出: ${foundKeywords.length > 0 ? foundKeywords.join(', ') : 'なし'}`);

  if (foundKeywords.length > 0 && !product.allIngredients) {
    // 全成分情報がありそうなのに抽出できていない
    console.log(`   ⚠️  抽出可能だが未抽出！`);

    // 原材料名周辺のテキストを表示
    const keyword = foundKeywords[0];
    const index = product.description.indexOf(keyword);
    const snippet = product.description.substring(index, index + 300);
    console.log(`\n   【抽出対象テキスト】\n   ${snippet}\n`);
  }

  console.log('\n' + '─'.repeat(60));
});

// 統計情報
const stats = await client.fetch(`{
  "total": count(*[_type == "product"]),
  "rakuten": count(*[_type == "product" && source == "rakuten"]),
  "yahoo": count(*[_type == "product" && source == "yahoo"]),
  "withDescription": count(*[_type == "product" && defined(description)]),
  "withIngredients": count(*[_type == "product" && defined(allIngredients)]),
  "rakutenWithIngredients": count(*[_type == "product" && source == "rakuten" && defined(allIngredients)]),
  "yahooWithIngredients": count(*[_type == "product" && source == "yahoo" && defined(allIngredients)])
}`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 全体統計:');
console.log(`  全商品: ${stats.total}件`);
console.log(`  　楽天: ${stats.rakuten}件`);
console.log(`  　Yahoo: ${stats.yahoo}件`);
console.log(`  説明文あり: ${stats.withDescription}件`);
console.log(`  全成分データあり: ${stats.withIngredients}件`);
console.log(`  　楽天（全成分あり）: ${stats.rakutenWithIngredients}件`);
console.log(`  　Yahoo（全成分あり）: ${stats.yahooWithIngredients}件`);
console.log('\n');
