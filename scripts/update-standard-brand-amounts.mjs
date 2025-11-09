#!/usr/bin/env node

/**
 * 主要ブランドの標準配合量データベース
 * DHC、FANCLなどの標準商品の配合量を自動設定
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

// DHC標準配合量データベース（公式サイト・パッケージ表示から）
const dhcStandardAmounts = {
  "ビタミンC": 1000, // 1000mg
  "ビタミンD": 0.025, // 25μg = 0.025mg (1000IU)
  "ビタミンE": 300, // 天然ビタミンE 300mg
  "ビタミンA": 0.6, // 600μg = 0.6mg
  "カルシウム": 350, // 350mg
  "マグネシウム": 175, // カルシウム/マグ 175mg (カルシウムとセット)
  "亜鉛": 15, // 15mg
  "葉酸": 0.2, // 200μg = 0.2mg
  "鉄": 10, // ヘム鉄 10mg
  "マカ": 405, // マカエキス 405mg
  "コエンザイムQ10": 100, // CoQ10 100mg
  "ルテイン": 16, // ルテイン 16mg
  "セサミン": 10, // セサミン 10mg
  "DHA": 510, // DHA 510mg (EPA含む場合110mg)
  "グルコサミン": 1860, // グルコサミン 1860mg
};

// FANCL標準配合量
const fanclStandardAmounts = {
  "ビタミンC": 500, // 500mg
  "ビタミンD": 0.03, // 30μg
  "カルシウム": 300, // 300mg
  "亜鉛": 8.8, // 8.8mg
  "葉酸": 0.24, // 240μg (妊活用は480μg)
  "鉄": 8, // 8mg
  "コエンザイムQ10": 60, // 60mg
};

console.log("🔍 主要ブランドの標準配合量を設定中...\n");

const products = await client.fetch(
  `*[_type == "product" && availability == "in-stock"]{
    _id,
    name,
    slug,
    source,
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
  
  const productName = product.name.toUpperCase();
  const ingredientName = mainIngredient.ingredient.name;
  
  let standardAmount = null;
  let brand = null;
  
  // DHC商品
  if (productName.includes('DHC')) {
    brand = 'DHC';
    
    // 成分名から標準配合量を取得
    for (const [key, amount] of Object.entries(dhcStandardAmounts)) {
      if (ingredientName.includes(key)) {
        standardAmount = amount;
        break;
      }
    }
  }
  
  // FANCL商品
  if (productName.includes('FANCL') || productName.includes('ファンケル')) {
    brand = 'FANCL';
    
    for (const [key, amount] of Object.entries(fanclStandardAmounts)) {
      if (ingredientName.includes(key)) {
        standardAmount = amount;
        break;
      }
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
  console.log("✅ 主要ブランドで標準配合量を設定できる商品はありませんでした\n");
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
    items.slice(0, 5).forEach((u, i) => {
      console.log(`${i + 1}. ${u.productName}...`);
      console.log(`   成分: ${u.ingredientName} → ${u.newAmount}mg`);
    });
    if (items.length > 5) {
      console.log(`   ... 他${items.length - 5}件\n`);
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
