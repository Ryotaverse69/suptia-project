import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔍 商品説明文の分析\n');

// 全商品のdescriptionを取得
const products = await client.fetch(`*[_type == "product" && defined(description)] {
  _id,
  name,
  description,
  allIngredients
}`);

console.log(`全商品: ${products.length}件\n`);

// 全成分情報のキーワード
const ingredientKeywords = [
  '全成分',
  '原材料',
  '原材料名',
  '成分',
  '栄養成分',
  '配合成分',
  'アレルギー',
];

let withIngredientInfo = 0;
let alreadyHasAllIngredients = 0;
let sampleProducts = [];

products.forEach((product) => {
  const hasIngredientKeyword = ingredientKeywords.some(keyword =>
    product.description?.includes(keyword)
  );

  if (product.allIngredients) {
    alreadyHasAllIngredients++;
  }

  if (hasIngredientKeyword && !product.allIngredients) {
    withIngredientInfo++;
    if (sampleProducts.length < 5) {
      sampleProducts.push({
        id: product._id,
        name: product.name?.substring(0, 50),
        description: product.description?.substring(0, 300),
      });
    }
  }
});

console.log('📊 統計情報:');
console.log(`  全商品数: ${products.length}件`);
console.log(`  既に全成分データあり: ${alreadyHasAllIngredients}件`);
console.log(`  説明文に成分情報を含む: ${withIngredientInfo}件`);
console.log(`  成分情報なし: ${products.length - alreadyHasAllIngredients - withIngredientInfo}件\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📦 サンプル商品（成分情報を含む説明文）:\n');
sampleProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   説明文の一部: ${product.description}\n`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
