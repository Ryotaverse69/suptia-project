#!/usr/bin/env node

/**
 * 懸念される添加物を含むテスト商品を作成するスクリプト
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

async function createTestProduct() {
  console.log("🧪 添加物検出テスト用商品を作成中...\n");

  try {
    // テスト用ブランドを検索または作成
    let testBrand = await client.fetch(
      `*[_type == "brand" && name == "テストブランド"][0]`,
    );

    if (!testBrand) {
      testBrand = await client.create({
        _type: "brand",
        name: "テストブランド",
        slug: { _type: "slug", current: "test-brand" },
        description: "添加物検出機能のテスト用ブランドです。",
      });
      console.log("✅ テストブランドを作成しました");
    }

    // ビタミンC成分を検索
    const vitaminC = await client.fetch(
      `*[_type == "ingredient" && nameEn match "Vitamin C*"][0]{ _id }`,
    );

    if (!vitaminC) {
      console.error("❌ ビタミンC成分が見つかりません");
      process.exit(1);
    }

    // 懸念される添加物を多数含む全成分データ
    const allIngredientsWithAdditives = `ビタミンC、アスパルテーム（L-フェニルアラニン化合物）、安息香酸ナトリウム、赤色40号、赤色2号、黄色4号、スクラロース、BHA（ブチルヒドロキシアニソール）、BHT（ジブチルヒドロキシトルエン）、カラギーナン、パラベン、亜硝酸ナトリウム、二酸化チタン、ステアリン酸マグネシウム

【栄養成分表示（2粒あたり）】
エネルギー：5.0kcal、たんぱく質：0.02g、脂質：0.05g、炭水化物：1.0g、食塩相当量：0.002g、ビタミンC：500mg

⚠️ 注意：このテスト商品には、以下の懸念される添加物が含まれています：
- 人工甘味料（アスパルテーム、スクラロース）
- 保存料（安息香酸ナトリウム、パラベン）
- 着色料（赤色40号、赤色2号、黄色4号）
- 酸化防止剤（BHA、BHT）
- その他（カラギーナン、亜硝酸ナトリウム、二酸化チタン）

このテスト商品は、全成分表示機能の添加物検出機能をテストするために作成されました。
実際の商品ではありません。`;

    // 既存のテスト商品を検索
    const existingProduct = await client.fetch(
      `*[_type == "product" && slug.current == "test-product-with-additives"][0]`,
    );

    if (existingProduct) {
      // 既存のテスト商品を更新
      await client
        .patch(existingProduct._id)
        .set({ allIngredients: allIngredientsWithAdditives })
        .commit();

      console.log("✅ テスト商品を更新しました");
      console.log(`   商品ID: ${existingProduct._id}`);
    } else {
      // 新規テスト商品を作成
      const testProduct = await client.create({
        _type: "product",
        name: "【テスト】添加物検出テスト用ビタミンCサプリ",
        slug: { _type: "slug", current: "test-product-with-additives" },
        brand: { _type: "reference", _ref: testBrand._id },
        description:
          "⚠️ これは添加物検出機能のテスト用商品です。実際には存在しません。懸念される添加物を意図的に多数含めています。",
        allIngredients: allIngredientsWithAdditives,
        priceJPY: 1000,
        servingsPerDay: 2,
        servingsPerContainer: 30,
        availability: "in-stock",
        source: "manual",
        ingredients: [
          {
            _type: "object",
            ingredient: { _type: "reference", _ref: vitaminC._id },
            amountMgPerServing: 250,
          },
        ],
        warnings: [
          "⚠️ このテスト商品には多数の懸念される添加物が含まれています。",
          "実際の商品ではありません。添加物検出機能のテスト用です。",
        ],
      });

      console.log("✅ テスト商品を作成しました");
      console.log(`   商品ID: ${testProduct._id}`);
    }

    console.log(
      "\n📍 以下のURLでテスト商品を確認できます：",
    );
    console.log(
      "   http://localhost:3001/products/test-product-with-additives",
    );
    console.log(
      "\n💡 全成分表示セクションで、以下が表示されることを確認してください：",
    );
    console.log(
      "   - オレンジ色の警告ボックス「懸念される添加物が検出されました」",
    );
    console.log(
      "   - 検出された添加物のリスト（色分け：赤/オレンジ/黄色）",
    );
    console.log("   - 各添加物のペナルティポイント");
    console.log("   - 安全性スコアへの影響");

    console.log("\n✨ 完了しました！");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

createTestProduct();
