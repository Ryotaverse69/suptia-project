import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n📝 全成分データの自動抽出 v2\n');

// 全商品のdescriptionを取得（既にallIngredientsがないもの）
const products = await client.fetch(`*[_type == "product" && defined(description) && !defined(allIngredients)] {
  _id,
  name,
  description
}`);

console.log(`対象商品: ${products.length}件\n`);

/**
 * 説明文から全成分データを抽出（改善版）
 */
function extractAllIngredients(description) {
  if (!description) return null;

  let allIngredientsText = '';

  // 1. 「原材料名」または「原材料」を探す
  const ingredientPatterns = [
    /原材料名\s*(.*?)(?=\s+内容量|\s+賞味期限|\s+保存方法|\s+区分|\s+お召し上がり方|\s+摂取|\s+使用上|$)/is,
    /原材料\s*(.*?)(?=\s+内容量|\s+賞味期限|\s+保存方法|\s+区分|\s+お召し上がり方|\s+摂取|\s+使用上|$)/is,
    /全成分\s*(.*?)(?=\s+【|\s+使用上|\s+内容量|$)/is,
  ];

  for (const pattern of ingredientPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      let ingredients = match[1].trim();

      // 不要な文字を除去
      ingredients = ingredients
        .replace(/^[：:\s]+/, '') // 先頭のコロンやスペース
        .replace(/\s{2,}/g, ' ') // 連続スペースを1つに
        .replace(/\n+/g, '\n') // 連続改行を1つに
        .trim();

      // 最低30文字以上ある場合のみ有効とみなす
      if (ingredients.length >= 30) {
        allIngredientsText = ingredients;
        break;
      }
    }
  }

  // 2. 「栄養成分表示」を探す
  const nutritionPatterns = [
    /栄養成分表示\s*(.*?)(?=\s+【|\s+原材料|\s+保存方法|\s+規格|$)/is,
    /栄養成分\s*(.*?)(?=\s+【|\s+原材料|\s+保存方法|\s+規格|$)/is,
  ];

  let nutritionText = '';
  for (const pattern of nutritionPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      let nutrition = match[1].trim();
      nutrition = nutrition
        .replace(/^[：:\s]+/, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      if (nutrition.length >= 20) {
        nutritionText = nutrition;
        break;
      }
    }
  }

  // 3. 結合
  if (allIngredientsText) {
    if (nutritionText) {
      return `${allIngredientsText}\n\n【栄養成分表示】\n${nutritionText}`;
    }
    return allIngredientsText;
  }

  return null;
}

let extractedCount = 0;
let failedCount = 0;
const extractedData = [];

products.forEach((product) => {
  const allIngredients = extractAllIngredients(product.description);

  if (allIngredients) {
    extractedCount++;
    extractedData.push({
      _id: product._id,
      _type: 'product',
      allIngredients: allIngredients,
    });

    if (extractedCount <= 10) {
      console.log(`✅ ${extractedCount}. ${product.name?.substring(0, 50)}`);
      console.log(`   抽出データ(最初の150文字): ${allIngredients.substring(0, 150).replace(/\n/g, ' ')}...\n`);
    }
  } else {
    failedCount++;
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 抽出結果:');
console.log(`  ✅ 成功: ${extractedCount}件 (${Math.round(extractedCount / products.length * 100)}%)`);
console.log(`  ❌ 失敗: ${failedCount}件\n`);

if (extractedData.length > 0) {
  // NDJSONファイルに出力
  const ndjson = extractedData.map(item => JSON.stringify(item)).join('\n');

  console.log('💾 NDJSONファイルを作成中...');

  const fs = await import('fs');
  fs.writeFileSync('extracted-all-ingredients-v2.ndjson', ndjson);

  console.log(`✅ extracted-all-ingredients-v2.ndjson を作成しました（${extractedData.length}件）\n`);
  console.log('次のステップ:');
  console.log('  npx sanity dataset import extracted-all-ingredients-v2.ndjson production --replace\n');
}
