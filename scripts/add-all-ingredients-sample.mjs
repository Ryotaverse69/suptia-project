#!/usr/bin/env node

/**
 * 全成分表示のサンプルデータを既存商品に追加するスクリプト
 *
 * 使用方法:
 *   node scripts/add-all-ingredients-sample.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local を手動で読み込み
const envPath = resolve(__dirname, "../apps/web/.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim();
      }
    }
  });
} catch (error) {
  console.error("⚠️  .env.localの読み込みに失敗しました:", error.message);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// サンプル全成分データ
const sampleAllIngredients = {
  // DHC ビタミンC
  "dhc-dhc-c-60-120": `ビタミンC、ビタミンB2、セルロース、ステアリン酸カルシウム、微粒二酸化ケイ素

【栄養成分表示（2粒1,010mgあたり）】
エネルギー：3.86kcal、たんぱく質：0.01g、脂質：0.04g、炭水化物：0.87g、食塩相当量：0.001g、ビタミンB2：2.0mg、ビタミンC：1,000mg`,

  // マグネシウムサプリ（例）
  "product-rakuten-tsuruha-10020349": `酸化マグネシウム、セルロース、ステアリン酸カルシウム、微粒二酸化ケイ素、ヒドロキシプロピルメチルセルロース

【栄養成分表示（5粒あたり）】
エネルギー：4.2kcal、たんぱく質：0g、脂質：0.03g、炭水化物：0.94g、食塩相当量：0.001g、マグネシウム：250mg`,

  // 葉酸サプリ mitete
  "mitete-30-afc": `乾燥酵母、貝カルシウム、セルロース、酵母(亜鉛、銅、セレン含有)、ステアリン酸カルシウム、ビタミンC、ピロリン酸第二鉄、ナイアシン、微粒二酸化ケイ素、パントテン酸カルシウム、ビタミンB6、ビタミンB1、ビタミンB2、葉酸、ビタミンD、ビタミンB12

【栄養成分表示（4粒1.52gあたり）】
エネルギー：3.6kcal、たんぱく質：0.13g、脂質：0.05g、炭水化物：0.68g、食塩相当量：0.006g、葉酸：400μg、カルシウム：200mg、鉄：15mg、ビタミンB1：1.3mg、ビタミンB2：1.5mg、ビタミンB6：1.4mg、ビタミンB12：2.8μg、ビタミンC：100mg、ビタミンD：7.0μg`,

  // DHA&EPA+ビタミンD
  "dha-epa-d-120-57-2g-1-477mg-120-30-3": `DHA含有精製魚油、EPA含有精製魚油、ゼラチン、グリセリン、ビタミンE、ビタミンD

【栄養成分表示（4粒1,908mgあたり）】
エネルギー：13.4kcal、たんぱく質：0.51g、脂質：1.19g、炭水化物：0.20g、食塩相当量：0.01g、DHA：500mg、EPA：100mg、ビタミンD：10.0μg`,
};

// 懸念される添加物を含むサンプル（テスト用）
const sampleWithAdditives = {
  test: `グルコース、果糖ブドウ糖液糖、アスパルテーム（L-フェニルアラニン化合物）、安息香酸ナトリウム、赤色40号、スクラロース、カラギーナン、BHA（ブチルヒドロキシアニソール）

※このサンプルは添加物検出機能のテストデータです。`,
};

async function addAllIngredientsToProducts() {
  console.log("🔧 全成分データを商品に追加中...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const [slug, allIngredients] of Object.entries(sampleAllIngredients)) {
    try {
      // slugから商品を検索
      const products = await client.fetch(
        `*[_type == "product" && slug.current == $slug]`,
        { slug },
      );

      if (products.length === 0) {
        console.log(`⚠️  商品が見つかりません: ${slug}`);
        errorCount++;
        continue;
      }

      const product = products[0];

      // 全成分データを追加
      await client
        .patch(product._id)
        .set({ allIngredients })
        .commit();

      console.log(`✅ ${product.name}`);
      console.log(`   → 全成分データを追加しました\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ エラー (${slug}):`, error.message);
      errorCount++;
    }
  }

  console.log("\n📊 結果:");
  console.log(`   成功: ${successCount}件`);
  console.log(`   失敗: ${errorCount}件`);
  console.log("\n✨ 完了しました！");
  console.log(
    "\n💡 商品詳細ページで「全成分表示」セクションが表示されることを確認してください。",
  );
  console.log(
    "   http://localhost:3001/products/dhc-dhc-c-60-120 などで確認できます。",
  );
}

// 実行
addAllIngredientsToProducts().catch((error) => {
  console.error("❌ スクリプト実行中にエラーが発生しました:", error);
  process.exit(1);
});
