#!/usr/bin/env node

/**
 * 商品名から配合量を抽出して自動設定
 * 例: "ビタミンD3 5000IU" → 125mcg (125mg)
 *     "マグネシウム 200mg" → 200mg
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// 配合量パターン（商品名から抽出）
const amountPatterns = [
  // ビタミンD
  { regex: /ビタミン\s*D.*?(\d+,?\d*)\s*(mcg|μg|マイクログラム)/i, unit: 'mcg', convert: (val) => parseFloat(val.replace(',', '')) / 1000 },
  { regex: /ビタミン\s*D.*?(\d+,?\d*)\s*IU/i, unit: 'IU', convert: (val) => {
    const iu = parseFloat(val.replace(',', ''));
    // 1000 IU = 25 mcg = 0.025 mg
    return (iu / 1000) * 0.025;
  }},
  
  // ビタミンC
  { regex: /ビタミン\s*C.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
  { regex: /C-(\d+)/i, unit: 'mg', convert: (val) => parseFloat(val) }, // "C-1000" 形式
  
  // マグネシウム
  { regex: /マグネシウム.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
  
  // 亜鉛
  { regex: /亜鉛.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
  
  // カルシウム
  { regex: /カルシウム.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
  
  // 葉酸
  { regex: /葉酸.*?(\d+,?\d*)\s*(mcg|μg|マイクログラム)/i, unit: 'mcg', convert: (val) => parseFloat(val.replace(',', '')) / 1000 },
  
  // ルテイン
  { regex: /ルテイン.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
  
  // DHA/EPA
  { regex: /DHA.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
  { regex: /EPA.*?(\d+,?\d*)\s*mg/i, unit: 'mg', convert: (val) => parseFloat(val.replace(',', '')) },
];

console.log("🔍 商品名から配合量を抽出中...\n");

const products = await client.fetch(
  `*[_type == "product" && availability == "in-stock"]{
    _id,
    name,
    slug,
    ingredients[]{\
      _key,
      amountMgPerServing,
      ingredient->{\
        _id,
        name
      }
    }
  }`
);

const updates = [];

for (const product of products) {
  if (!product.ingredients || product.ingredients.length === 0) continue;
  
  const mainIngredient = product.ingredients[0];
  if (!mainIngredient.ingredient) continue;
  
  // 配合量が0または未設定の場合のみ処理
  if (mainIngredient.amountMgPerServing !== 0 && mainIngredient.amountMgPerServing) continue;
  
  // 商品名から配合量を抽出
  for (const pattern of amountPatterns) {
    const match = product.name.match(pattern.regex);
    if (match) {
      const extractedValue = match[1];
      const amountMg = pattern.convert(extractedValue);
      
      if (amountMg > 0 && amountMg < 100000) { // 妥当な範囲（0〜100g）
        updates.push({
          productId: product._id,
          productName: product.name.substring(0, 70),
          slug: product.slug.current,
          ingredientName: mainIngredient.ingredient.name,
          currentAmount: mainIngredient.amountMgPerServing || 0,
          newAmount: amountMg,
          extractedText: match[0],
          unit: pattern.unit
        });
        break; // 最初にマッチしたパターンを採用
      }
    }
  }
}

console.log(`📊 抽出結果: ${updates.length}件\n`);

if (updates.length === 0) {
  console.log("✅ 商品名から配合量を抽出できる商品はありませんでした\n");
} else {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 抽出された配合量データ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  updates.forEach((u, i) => {
    console.log(`${i + 1}. ${u.productName}...`);
    console.log(`   成分: ${u.ingredientName}`);
    console.log(`   抽出: "${u.extractedText}" → ${u.newAmount}mg`);
    console.log(`   Slug: ${u.slug}\n`);
  });
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💾 データを更新しますか？ (yes/no)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // 自動実行の場合はコメントアウトを外す
  const shouldUpdate = true; // process.argv.includes('--apply');
  
  if (shouldUpdate) {
    console.log("📝 更新を実行中...\n");
    
    for (const update of updates) {
      const product = await client.fetch(
        `*[_type == "product" && _id == $id][0]{ingredients}`,
        { id: update.productId }
      );
      
      const updatedIngredients = [...product.ingredients];
      updatedIngredients[0] = {
        ...updatedIngredients[0],
        amountMgPerServing: update.newAmount
      };
      
      await client.patch(update.productId)
        .set({ ingredients: updatedIngredients })
        .commit();
      
      console.log(`✅ ${update.productName.substring(0, 50)}... → ${update.newAmount}mg`);
    }
    
    console.log(`\n✅ ${updates.length}件の商品を更新しました\n`);
  }
}
