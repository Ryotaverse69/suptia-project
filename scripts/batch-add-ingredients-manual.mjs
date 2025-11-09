#!/usr/bin/env node

/**
 * 残り15件の商品に手動で成分を追加するスクリプト
 *
 * 商品名から推測される成分を初期値として提案します。
 * 楽天ページで確認後、必要に応じて修正してください。
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

const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

// 商品slug と成分のマッピング（手動で確認・修正してください）
const manualIngredientMapping = {
  "dhc-20-80-6-dhc": {
    // DHC フォースコリー
    name: "DHC フォースコリー",
    url: "https://item.rakuten.co.jp/rakuten24:11130403",
    ingredients: [
      // フォルスコリンは未登録のため、類似成分または作成が必要
      // 今回はL-カルニチンで代用（ダイエットサポート系）
      { ref: "ingredient-l-carnitine", amount: 0 },
    ],
    note: "フォルスコリン成分は未登録。要確認",
  },
  "dhc-20-120-6-dhc": {
    // DHC 極らくらく
    name: "DHC 極らくらく",
    url: "https://item.rakuten.co.jp/rakuten24:11130455",
    ingredients: [
      { ref: "ingredient-glucosamine", amount: 0 },
      // コンドロイチンは未登録
    ],
    note: "グルコサミン・コンドロイチン系と推測。要確認",
  },
  "fancl-60-30-30-2027-05": {
    // FANCL 60代からのサプリメント 女性
    name: "FANCL 60代からのサプリメント 女性",
    url: "https://item.rakuten.co.jp/manro-store:10000238",
    ingredients: [
      { ref: "ingredient-vitamin-c", amount: 0 },
      { ref: "ingredient-vitamin-d", amount: 0 },
      { ref: "ingredient-vitamin-e", amount: 0 },
      { ref: "ingredient-calcium", amount: 0 },
    ],
    note: "マルチ栄養素。楽天ページで詳細確認が必要",
  },
  "120": {
    // 大塚製薬ネイチャーメイドスーパーマルチビタミン&ミネラル
    name: "大塚製薬ネイチャーメイドスーパーマルチビタミン&ミネラル",
    url: "https://item.rakuten.co.jp/sundrug:10017784",
    ingredients: [
      { ref: "ingredient-vitamin-c", amount: 0 },
      { ref: "ingredient-vitamin-d", amount: 0 },
      { ref: "ingredient-vitamin-e", amount: 0 },
      { ref: "ingredient-vitamin-b-complex", amount: 0 },
      { ref: "ingredient-calcium", amount: 0 },
      { ref: "ingredient-magnesium", amount: 0 },
      { ref: "ingredient-zinc", amount: 0 },
      { ref: "ingredient-iron", amount: 0 },
    ],
    note: "マルチビタミン・ミネラル。詳細は楽天ページ確認",
  },
  "5-6-time-sale-6-600-4-620-vitalbeautie-60-30-x2": {
    // VITALBEAUTIE スーパー レチノール
    name: "VITALBEAUTIE スーパー レチノール",
    url: "https://item.rakuten.co.jp/amorepacific:10003028",
    ingredients: [{ ref: "ingredient-vitamin-a", amount: 0 }],
    note: "レチノール（ビタミンA）。楽天ページで詳細確認",
  },
  "10-27-298-1-1": {
    // まいにち酵素
    name: "まいにち酵素",
    url: "https://item.rakuten.co.jp/seedcoms:10007435",
    ingredients: [
      // 酵素は汎用的すぎてスキップ
      // プロバイオティクスで代用
      { ref: "ingredient-probiotics", amount: 0 },
    ],
    note: "酵素サプリ。具体的な成分は楽天ページで確認",
  },
  "50-off-3-90-3mg-bmi-ex-90": {
    // 体脂ガードEX（エラグ酸）
    name: "体脂ガードEX（エラグ酸）",
    url: "https://item.rakuten.co.jp/duen1102:10000122",
    ingredients: [
      { ref: "ingredient-l-carnitine", amount: 3 },
      // エラグ酸は未登録
    ],
    note: "エラグ酸 3mg、L-カルニチン配合。要確認",
  },
  "dhc-30-12-360-11-sf014-016": {
    // DHC マルチビタミン
    name: "DHC マルチビタミン",
    url: "https://item.rakuten.co.jp/f222101-fuji:10000643",
    ingredients: [
      { ref: "ingredient-vitamin-c", amount: 0 },
      { ref: "ingredient-vitamin-d", amount: 0 },
      { ref: "ingredient-vitamin-e", amount: 0 },
      { ref: "ingredient-vitamin-b-complex", amount: 0 },
      { ref: "ingredient-vitamin-a", amount: 0 },
    ],
    note: "11種類のビタミン。楽天ページで詳細確認",
  },
  "dhc-30-4-sf014-002": {
    // DHC 血糖値ダブル対策
    name: "DHC 血糖値ダブル対策",
    url: "https://item.rakuten.co.jp/f222101-fuji:10001049",
    ingredients: [
      // 桑の葉、バナバ葉、サラシアは未登録
      // 代わりにクロムを使用（血糖値関連）
      { ref: "ingredient-chromium", amount: 0 },
    ],
    note: "桑の葉イミノシュガー、バナバ葉コロソリン酸、サラシアエキス。新規成分作成が必要",
  },
  "fancl-30-3-6": {
    // FANCL 大人のカロリミット
    name: "FANCL 大人のカロリミット",
    url: "https://item.rakuten.co.jp/f222062-mishima:10000453",
    ingredients: [
      // ギムネマ、桑の葉、キトサンは未登録
      // 代わりにクロムを使用
      { ref: "ingredient-chromium", amount: 0 },
    ],
    note: "ギムネマ、桑の葉、キトサン配合。新規成分作成が必要",
  },
  "sale-1": {
    // コレウス フォルスコリ
    name: "コレウス フォルスコリ",
    url: "https://item.rakuten.co.jp/oga:10215797",
    ingredients: [
      // フォルスコリンは未登録
      { ref: "ingredient-l-carnitine", amount: 0 },
    ],
    note: "フォルスコリン、イヌリン配合。要確認",
  },
  "q10-90-5": {
    // サトウQ10
    name: "サトウQ10",
    url: "https://item.rakuten.co.jp/rakuten24:10976713",
    ingredients: [{ ref: "ingredient-coenzyme-q10", amount: 0 }],
    note: "CoQ10。楽天ページで配合量確認",
  },
  "fancl-40": {
    // プレミアムカロリミット（重複商品の1つ目）
    name: "プレミアムカロリミット",
    url: "https://item.rakuten.co.jp/fancl-shop:10010207",
    ingredients: [{ ref: "ingredient-chromium", amount: 0 }],
    note: "ギムネマ、桑の葉、キトサン配合。新規成分作成が必要",
  },
  "34-off-vitalbeautie-new-or": {
    // VITALBEAUTIE メタグリーン
    name: "VITALBEAUTIE メタグリーン",
    url: "https://item.rakuten.co.jp/amorepacific:10002635",
    ingredients: [
      // 成分不明（韓国製品）
      { ref: "ingredient-chromium", amount: 0 },
    ],
    note: "韓国製品。楽天ページで成分確認が必要",
  },
};

// _keyを生成
function generateKey() {
  return `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function batchAddIngredients() {
  console.log(`📝 残り15件の商品に成分を手動登録${isDryRun ? '（プレビュー）' : ''}...\n`);

  const results = {
    success: [],
    skipped: [],
    failed: [],
  };

  for (const [slug, data] of Object.entries(manualIngredientMapping)) {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📦 ${data.name}`);
      console.log(`   slug: ${slug}`);
      console.log(`   URL: ${data.url}`);
      console.log(`   📝 備考: ${data.note}\n`);

      // 商品を取得
      const product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{_id, name}`,
        { slug }
      );

      if (!product) {
        console.log(`   ⚠️ 商品が見つかりません\n`);
        results.skipped.push({ slug, reason: "商品が見つかりません" });
        continue;
      }

      // 成分配列を構築
      const ingredients = data.ingredients.map((ing) => {
        console.log(`   ✅ 追加: ${ing.ref} (${ing.amount}mg)`);
        return {
          _key: generateKey(),
          amountMgPerServing: ing.amount,
          ingredient: {
            _ref: ing.ref,
            _type: "reference",
          },
        };
      });

      if (isDryRun) {
        console.log(`   ✅ 登録予定: ${ingredients.length}件の成分\n`);
      } else {
        await client.patch(product._id).set({ ingredients }).commit();
        console.log(`   💾 Sanityに保存しました\n`);
      }

      results.success.push({
        slug,
        name: data.name,
        ingredientCount: ingredients.length,
      });
    } catch (error) {
      console.error(`   ❌ エラー: ${error.message}\n`);
      results.failed.push({ slug, error: error.message });
    }
  }

  // サマリー
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 登録結果サマリー");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`✅ 登録成功: ${results.success.length}件`);
  console.log(`⏭️  スキップ: ${results.skipped.length}件`);
  console.log(`❌ 失敗: ${results.failed.length}件\n`);

  if (results.success.length > 0) {
    console.log("✅ 登録した商品:\n");
    results.success.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name}`);
      console.log(`     成分数: ${item.ingredientCount}件`);
    });
    console.log();
  }

  if (isDryRun) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 次のステップ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("1. 楽天ページで各商品の成分を確認");
    console.log("2. このスクリプト内のmanualIngredientMappingを修正");
    console.log("3. 実際に登録を実行:");
    console.log("   node scripts/batch-add-ingredients-manual.mjs --fix\n");
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ 完了");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("次のステップ:");
    console.log("1. 全商品チェックスクリプトを再実行");
    console.log("  node scripts/check-all-products-ingredients.mjs\n");
    console.log("2. 楽天ページで実際の配合量を確認・更新\n");
  }
}

batchAddIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
