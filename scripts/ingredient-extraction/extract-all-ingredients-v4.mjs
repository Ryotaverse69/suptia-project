import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n📝 全成分データの自動抽出 v4（閾値改善版）\n');

// 全商品のdescriptionを取得（既にallIngredientsがないもの）
const products = await client.fetch(`*[_type == "product" && defined(description) && !defined(allIngredients)] {
  _id,
  name,
  description
}`);

console.log(`対象商品: ${products.length}件\n`);

/**
 * 説明文から全成分データを抽出（v4 閾値改善版）
 */
function extractAllIngredients(description) {
  if (!description) return null;

  let allIngredientsText = '';

  // 1. 「原材料名」「原材料」「全成分」を探す
  const ingredientPatterns = [
    // 「原材料名」パターン
    /原材料名[：:\s]*(.*?)(?=\s+内容量|\s+賞味期限|\s+保存方法|\s+区分|\s+お召し上がり方|\s+摂取|\s+使用上|\s+【|$)/is,
    // 「〜の原材料」パターン（商品名が入るケース）
    /の原材料[】：:\s]*(.*?)(?=\s+内容量|\s+賞味期限|\s+保存方法|\s+区分|\s+お召し上がり方|\s+摂取|\s+使用上|\s+【|$)/is,
    // 「原材料」パターン（単独）- 終了パターンから「内容量」を除外
    /原材料[】：:\s]+(.*?)(?=\s+保存方法|\s+お召し上がり方|\s+摂取|\s+使用上|\s+【|$)/is,
    // 「全成分」パターン
    /全成分[：:\s]*(.*?)(?=\s+【|\s+使用上|\s+内容量|$)/is,
  ];

  for (const pattern of ingredientPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      let ingredients = match[1].trim();

      // 不要な文字を除去
      ingredients = ingredients
        .replace(/^[】：:\s]+/, '') // 先頭の閉じ括弧、コロン、スペース
        .replace(/\s{2,}/g, ' ') // 連続スペースを1つに
        .replace(/\n+/g, '\n') // 連続改行を1つに
        .trim();

      // 最低20文字以上、かつカンマを含む場合のみ有効
      // （カンマがあれば成分リストの可能性が高い）
      if (ingredients.length >= 20 && ingredients.includes('、')) {
        allIngredientsText = ingredients;
        break;
      } else if (ingredients.length >= 20) {
        // カンマがなくても20文字以上あれば一応保持
        allIngredientsText = ingredients;
        break;
      }
    }
  }

  // 2. 「栄養成分表示」「栄養成分」を探す
  const nutritionPatterns = [
    // 「栄養成分表示」パターン（括弧付きも対応）
    /栄養成分表示[】（(：:\s]*(.*?)(?=\s+【|\s+原材料|\s+保存方法|\s+規格|\s+お召し上がり|$)/is,
    // 「栄養成分】」パターン（閉じ括弧の後に直接続く）
    /栄養成分[】]+(.*?)(?=\s+【|\s+原材料|\s+保存方法|\s+規格|\s+アレルギー|$)/is,
    // 「栄養成分」パターン（一般）
    /栄養成分[：:\s]*(.*?)(?=\s+【|\s+原材料|\s+保存方法|\s+規格|$)/is,
  ];

  let nutritionText = '';
  for (const pattern of nutritionPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      let nutrition = match[1].trim();
      nutrition = nutrition
        .replace(/^[】）)：:\s]+/, '') // 先頭の閉じ括弧、コロン
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

    if (extractedCount <= 20) {
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
  fs.writeFileSync('extracted-all-ingredients-v4.ndjson', ndjson);

  console.log(`✅ extracted-all-ingredients-v4.ndjson を作成しました（${extractedData.length}件）\n`);
  console.log('次のステップ:');
  console.log('  1. node merge-all-ingredients-v4.mjs を実行してマージ');
  console.log('  2. npx sanity dataset import merged-products-with-ingredients.ndjson production --replace\n');
}
