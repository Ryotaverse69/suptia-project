#!/usr/bin/env node

/**
 * ミスマッチ商品の詳細調査
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

const investigateSlugs = [
  "point20-11-1-0-00-23-59-doctor-s-best-iherb-100mg-240",  // Doctor's Best マグネシウム
  "8000-1000-off-2-30mg-120-now-foods-zinc-glycinate-120-softgels-2bottles-set",  // グリシン酸亜鉛
  "60-325",  // ニューサイエンス マグネシウム
];

console.log("🔍 ミスマッチ商品の詳細調査\n");

for (const slug of investigateSlugs) {
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      source,
      itemCode,
      affiliateUrl,
      priceJPY,
      servingsPerContainer,
      servingsPerDay,
      ingredients[]{\
        _key,
        amountMgPerServing,
        ingredient->{\
          _id,
          name,
          nameEn
        }
      }
    }`,
    { slug }
  );

  if (!product) {
    console.log(`❌ 商品が見つかりません: ${slug}\n`);
    continue;
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📦 ${product.name.substring(0, 80)}...`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`Slug: ${product.slug.current}`);
  console.log(`価格: ¥${product.priceJPY}`);
  console.log(`内容量: ${product.servingsPerContainer}回分`);
  console.log(`1日摂取回数: ${product.servingsPerDay}回`);
  
  if (product.source === 'rakuten') {
    console.log(`楽天URL: https://item.rakuten.co.jp/${product.itemCode}`);
  } else if (product.affiliateUrl) {
    console.log(`商品URL: ${product.affiliateUrl}`);
  }

  console.log(`\n📊 現在の成分配合（配合量順）:\n`);

  if (product.ingredients && product.ingredients.length > 0) {
    // 配合量でソート
    const sortedIngredients = [...product.ingredients].sort((a, b) => {
      const amountA = a.amountMgPerServing || 0;
      const amountB = b.amountMgPerServing || 0;
      return amountB - amountA;
    });

    sortedIngredients.forEach((ing, index) => {
      const isCurrent = index === 0 ? "★" : " ";
      console.log(`${isCurrent} ${index + 1}. ${ing.ingredient?.name || "未登録"}: ${ing.amountMgPerServing || 0}mg`);
    });

    console.log(`\n💡 現在の主要成分（1番目）: ${product.ingredients[0].ingredient?.name || "未登録"}`);
    console.log(`   配合量: ${product.ingredients[0].amountMgPerServing || 0}mg`);

    const maxAmount = Math.max(...product.ingredients.map(i => i.amountMgPerServing || 0));
    const actualMain = product.ingredients.find(i => (i.amountMgPerServing || 0) === maxAmount);
    
    if (actualMain && actualMain.ingredient?._id !== product.ingredients[0].ingredient?._id) {
      console.log(`\n⚠️  配合量最大の成分: ${actualMain.ingredient?.name}`);
      console.log(`   配合量: ${actualMain.amountMgPerServing}mg`);
      console.log(`   → 成分順序を修正すべきです`);
    } else {
      console.log(`\n✅ 主要成分は配合量最大の成分と一致しています`);
    }
  }

  console.log("\n");
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📝 次のステップ");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("1. 上記の楽天URLまたは商品URLにアクセス");
console.log("2. 栄養成分表示を確認");
console.log("3. 配合量が最も多い成分を特定");
console.log("4. 必要に応じて成分順序を修正\n");
