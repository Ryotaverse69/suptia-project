#!/usr/bin/env node

/**
 * 残りの主要ブランドの標準配合量設定
 * AFC、サントリー、ネイチャーメイド等
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

// 追加ブランドの標準配合量データベース
const brandStandardAmounts = {
  AFC: {
    "葉酸": 0.4, // 400μg
    "カルシウム": 200,
    "マグネシウム": 100,
    "ルテイン": 30, // めぐみのルテイン30
    "亜鉛": 10,
  },
  "サントリー": {
    "DHA": 300, // DHA&EPA+セサミンEX
    "オメガ3": 300,
    "ビタミンE": 55,
    "セサミン": 10,
    "イチョウ葉": 120,
  },
  "ネイチャーメイド": {
    "ビタミンC": 500,
    "ビタミンD": 0.025, // 1000IU
    "カルシウム": 500,
    "マグネシウム": 200,
    "亜鉛": 10,
    "鉄": 6,
  },
  "ピジョン": {
    "葉酸": 0.4,
    "カルシウム": 160,
    "鉄": 10,
  },
  "小林製薬": {
    "亜鉛": 15,
    "カルシウム": 300,
    "鉄": 10,
  },
  "ディアナチュラ": {
    "セサミン": 10,
    "ビタミンE": 60,
    "葉酸": 0.24,
    "カルシウム": 300,
  },
  "オリヒロ": {
    "ビタミンD": 0.025,
    "葉酸": 0.24,
    "カルシウム": 300,
  },
  "大塚製薬": {
    "エクオール": 0.01, // 10mg
    "大豆イソフラボン": 0.01,
  },
};

console.log("🔍 残りのブランド標準配合量を設定中...\n");

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
  
  const productName = product.name;
  const ingredientName = mainIngredient.ingredient.name;
  
  let standardAmount = null;
  let brand = null;
  
  // ブランド判定と配合量取得
  for (const [brandName, amounts] of Object.entries(brandStandardAmounts)) {
    if (productName.includes(brandName) || 
        (brandName === "サントリー" && productName.includes("サントリー")) ||
        (brandName === "ネイチャーメイド" && (productName.includes("ネイチャーメイド") || productName.includes("Nature Made"))) ||
        (brandName === "ディアナチュラ" && productName.includes("Dear-Natura"))) {
      
      brand = brandName;
      
      // 成分名から標準配合量を取得
      for (const [key, amount] of Object.entries(amounts)) {
        if (ingredientName.includes(key)) {
          standardAmount = amount;
          break;
        }
      }
      
      if (standardAmount) break;
    }
  }
  
  if (standardAmount && brand) {
    updates.push({
      productId: product._id,
      productName: product.name.substring(0, 70),
      slug: product.slug.current,
      brand,
      ingredientName,
      newAmount: standardAmount
    });
  }
}

console.log(`📊 抽出結果: ${updates.length}件\n`);

if (updates.length === 0) {
  console.log("✅ 追加で設定できる標準配合量の商品はありませんでした\n");
} else {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 設定される標準配合量");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  const byBrand = {};
  updates.forEach(u => {
    if (!byBrand[u.brand]) byBrand[u.brand] = [];
    byBrand[u.brand].push(u);
  });
  
  Object.entries(byBrand).forEach(([brand, items]) => {
    console.log(`【${brand}】 ${items.length}件\n`);
    items.slice(0, 3).forEach((u, i) => {
      console.log(`${i + 1}. ${u.productName}...`);
      console.log(`   成分: ${u.ingredientName} → ${u.newAmount}mg`);
    });
    if (items.length > 3) {
      console.log(`   ... 他${items.length - 3}件`);
    }
    console.log();
  });
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💾 更新を実行中...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
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
    
    console.log(`✅ [${update.brand}] ${update.productName.substring(0, 40)}... → ${update.newAmount}mg`);
  }
  
  console.log(`\n✅ ${updates.length}件の商品を更新しました\n`);
}
