import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

console.log('\n🔬 v4パターンでのデバッグ抽出\n');

// キーワードを含む楽天商品を取得
const keywords = ['原材料', '全成分', '栄養成分'];

const products = await client.fetch(`*[_type == "product" && source == "rakuten" && !defined(allIngredients) && (description match "*原材料*" || description match "*全成分*")][0...5] {
  _id,
  name,
  description
}`);

console.log(`テスト対象: ${products.length}件\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

function extractAllIngredients(description, productName) {
  if (!description) return null;

  console.log(`\n📦 ${productName?.substring(0, 70)}`);
  console.log('━'.repeat(80));

  let allIngredientsText = '';
  let matchedPattern = null;

  // パターン1: 原材料名
  const pattern1 = /原材料名[：:\s]*(.*?)(?=\s+内容量|\s+賞味期限|\s+保存方法|\s+区分|\s+お召し上がり方|\s+摂取|\s+使用上|\s+【|$)/is;
  const match1 = description.match(pattern1);
  if (match1 && match1[1]) {
    const extracted = match1[1].trim().replace(/^[】：:\s]+/, '').replace(/\s{2,}/g, ' ').trim();
    console.log(`✓ パターン1（原材料名）マッチ`);
    console.log(`  抽出: "${extracted.substring(0, 150)}..."`);
    console.log(`  長さ: ${extracted.length}文字`);
    console.log(`  カンマあり: ${extracted.includes('、') ? 'はい' : 'いいえ'}`);

    if (extracted.length >= 20 && extracted.includes('、')) {
      allIngredientsText = extracted;
      matchedPattern = 'pattern1';
      console.log(`  ✅ 採用（20文字以上＆カンマあり）`);
    } else if (extracted.length >= 20) {
      allIngredientsText = extracted;
      matchedPattern = 'pattern1_no_comma';
      console.log(`  ✅ 採用（20文字以上、カンマなし）`);
    } else {
      console.log(`  ❌ 不採用（20文字未満）`);
    }
  }

  // パターン2: 〜の原材料
  if (!allIngredientsText) {
    const pattern2 = /の原材料[】：:\s]*(.*?)(?=\s+内容量|\s+賞味期限|\s+保存方法|\s+区分|\s+お召し上がり方|\s+摂取|\s+使用上|\s+【|$)/is;
    const match2 = description.match(pattern2);
    if (match2 && match2[1]) {
      const extracted = match2[1].trim().replace(/^[】：:\s]+/, '').replace(/\s{2,}/g, ' ').trim();
      console.log(`✓ パターン2（〜の原材料）マッチ`);
      console.log(`  抽出: "${extracted.substring(0, 150)}..."`);
      console.log(`  長さ: ${extracted.length}文字`);
      console.log(`  カンマあり: ${extracted.includes('、') ? 'はい' : 'いいえ'}`);

      if (extracted.length >= 20) {
        allIngredientsText = extracted;
        matchedPattern = 'pattern2';
        console.log(`  ✅ 採用`);
      } else {
        console.log(`  ❌ 不採用（20文字未満）`);
      }
    }
  }

  // パターン3: 原材料（単独）
  if (!allIngredientsText) {
    const pattern3 = /原材料[】：:\s]+(.*?)(?=\s+保存方法|\s+お召し上がり方|\s+摂取|\s+使用上|\s+【|$)/is;
    const match3 = description.match(pattern3);
    if (match3 && match3[1]) {
      const extracted = match3[1].trim().replace(/^[】：:\s]+/, '').replace(/\s{2,}/g, ' ').trim();
      console.log(`✓ パターン3（原材料）マッチ`);
      console.log(`  抽出: "${extracted.substring(0, 150)}..."`);
      console.log(`  長さ: ${extracted.length}文字`);
      console.log(`  カンマあり: ${extracted.includes('、') ? 'はい' : 'いいえ'}`);

      if (extracted.length >= 20) {
        allIngredientsText = extracted;
        matchedPattern = 'pattern3';
        console.log(`  ✅ 採用`);
      } else {
        console.log(`  ❌ 不採用（20文字未満）`);
      }
    }
  }

  if (!allIngredientsText) {
    console.log(`\n❌ 最終結果: 抽出失敗`);
  } else {
    console.log(`\n✅ 最終結果: 抽出成功（${matchedPattern}）`);
    console.log(`   全成分データ: ${allIngredientsText.length}文字\n`);
  }

  return allIngredientsText || null;
}

let successCount = 0;
let failCount = 0;

products.forEach((product) => {
  const result = extractAllIngredients(product.description, product.name);
  if (result) {
    successCount++;
  } else {
    failCount++;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 デバッグ結果:');
console.log(`  成功: ${successCount}件`);
console.log(`  失敗: ${failCount}件\n`);
