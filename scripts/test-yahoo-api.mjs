#!/usr/bin/env node

/**
 * Yahoo!ショッピングAPIテストスクリプト
 *
 * Yahoo!ショッピングAPIが正しく動作するか確認します。
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動でパース
const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

async function testYahooAPI() {
  console.log("🧪 Yahoo!ショッピングAPIをテストします...\n");

  if (!env.YAHOO_SHOPPING_CLIENT_ID) {
    console.log("❌ YAHOO_SHOPPING_CLIENT_IDが設定されていません");
    return;
  }

  console.log(`✅ Client ID: ${env.YAHOO_SHOPPING_CLIENT_ID.substring(0, 20)}...`);
  console.log("");

  // テスト1: ビタミンCで検索
  console.log("📦 テスト1: ビタミンCで商品検索");
  try {
    const params = new URLSearchParams({
      appid: env.YAHOO_SHOPPING_CLIENT_ID,
      query: "DHC ビタミンC",
      results: "3",
    });

    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`;
    console.log(`   URL: ${url.substring(0, 100)}...`);

    const response = await fetch(url);
    console.log(`   ステータス: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.log(`   ❌ APIエラー: ${response.status}`);
      const text = await response.text();
      console.log(`   レスポンス: ${text.substring(0, 500)}`);
      return;
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      console.log(`   ✅ 成功: ${data.totalResultsAvailable}件の商品が見つかりました`);
      console.log(`   返却件数: ${data.totalResultsReturned}件\n`);

      console.log("📋 検索結果:");
      data.hits.forEach((item, index) => {
        console.log(`\n   ${index + 1}. ${item.name}`);
        console.log(`      価格: ¥${item.price.toLocaleString()}`);
        console.log(`      在庫: ${item.inStock ? "あり" : "なし"}`);
        console.log(`      URL: ${item.url}`);
        if (item.review) {
          console.log(`      レビュー: ${item.review.rate}点 (${item.review.count}件)`);
        }
        if (item.janCode) {
          console.log(`      JANコード: ${item.janCode}`);
        }
      });
    } else {
      console.log("   ⚠️  商品が見つかりませんでした");
    }
  } catch (error) {
    console.log(`   ❌ エラー: ${error.message}`);
    console.error(error.stack);
  }

  console.log("\n" + "=".repeat(60));

  // テスト2: JANコードで検索
  console.log("\n📦 テスト2: JANコードで検索");
  try {
    const params = new URLSearchParams({
      appid: env.YAHOO_SHOPPING_CLIENT_ID,
      jan_code: "4511413404133", // DHC ビタミンC
      results: "1",
    });

    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`;
    const response = await fetch(url);
    console.log(`   ステータス: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.log(`   ❌ APIエラー: ${response.status}`);
      return;
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      console.log(`   ✅ 成功: ${data.totalResultsAvailable}件の商品が見つかりました`);
      const item = data.hits[0];
      console.log(`\n   商品名: ${item.name}`);
      console.log(`   価格: ¥${item.price.toLocaleString()}`);
      console.log(`   在庫: ${item.inStock ? "あり" : "なし"}`);
      console.log(`   商品コード: ${item.code}`);
    } else {
      console.log("   ⚠️  商品が見つかりませんでした");
    }
  } catch (error) {
    console.log(`   ❌ エラー: ${error.message}`);
  }

  console.log("\n" + "=".repeat(60));

  // テスト3: ヘルスチェック
  console.log("\n🏥 テスト3: APIヘルスチェック");
  try {
    const params = new URLSearchParams({
      appid: env.YAHOO_SHOPPING_CLIENT_ID,
      query: "test",
      results: "1",
    });

    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`;
    const response = await fetch(url);

    if (response.ok) {
      console.log("   ✅ ヘルスチェック成功: APIは正常に動作しています");
    } else {
      console.log(`   ❌ ヘルスチェック失敗: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ ヘルスチェック失敗: ${error.message}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Yahoo!ショッピングAPIテスト完了！");
  console.log("\n💡 次のステップ:");
  console.log("   1. バッチ同期APIでテスト");
  console.log("   2. Vercelにデプロイ");
  console.log("   3. 本番環境で動作確認\n");
}

testYahooAPI();
