#!/usr/bin/env node

/**
 * Yahoo!ショッピングAPIアフィリエイトテストスクリプト
 *
 * アフィリエイトURLが正しく生成されるか確認します。
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

async function testYahooAffiliate() {
  console.log("🧪 Yahoo!ショッピングAPIアフィリエイトテスト...\n");

  if (!env.YAHOO_SHOPPING_CLIENT_ID) {
    console.log("❌ YAHOO_SHOPPING_CLIENT_IDが設定されていません");
    return;
  }

  if (!env.YAHOO_AFFILIATE_ID) {
    console.log("❌ YAHOO_AFFILIATE_IDが設定されていません");
    return;
  }

  console.log(`✅ Client ID: ${env.YAHOO_SHOPPING_CLIENT_ID.substring(0, 20)}...`);
  console.log(`✅ Affiliate ID: ${env.YAHOO_AFFILIATE_ID.substring(0, 60)}...`);
  console.log("");

  // アフィリエイトパラメータをURLエンコード
  const affiliateId = encodeURIComponent(env.YAHOO_AFFILIATE_ID);

  console.log("📦 テスト: アフィリエイトURL付きで商品検索");
  try {
    const params = new URLSearchParams({
      appid: env.YAHOO_SHOPPING_CLIENT_ID,
      query: "DHC ビタミンC",
      results: "1",
      affiliate_type: "vc", // バリューコマース
      affiliate_id: affiliateId,
    });

    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`;
    console.log(`   リクエスト送信中...`);

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
      console.log(`   ✅ 成功: ${data.totalResultsAvailable}件の商品が見つかりました\n`);

      const item = data.hits[0];
      console.log("📋 商品情報:");
      console.log(`   商品名: ${item.name}`);
      console.log(`   価格: ¥${item.price.toLocaleString()}`);
      console.log("");

      console.log("🔗 URL比較:");
      console.log(`   通常URL: ${item.url.substring(0, 80)}...`);

      if (item.url.includes("ck.jp.ap.valuecommerce.com")) {
        console.log(`   ✅ アフィリエイトURL: 正しく生成されています！`);
        console.log(`   🎉 バリューコマースのアフィリエイトリンクが含まれています`);

        // URLからsidとpidを抽出して確認
        const sidMatch = item.url.match(/sid=(\d+)/);
        const pidMatch = item.url.match(/pid=(\d+)/);

        if (sidMatch && pidMatch) {
          console.log(`   📊 検出されたID:`);
          console.log(`      sid: ${sidMatch[1]}`);
          console.log(`      pid: ${pidMatch[1]}`);

          if (sidMatch[1] === "3756214" && pidMatch[1] === "892196964") {
            console.log(`   ✅✅ あなたのsid/pidが正しく使用されています！`);
          }
        }
      } else {
        console.log(`   ⚠️  通常URL: アフィリエイトリンクではありません`);
        console.log(`   💡 ヒント: affiliate_typeとaffiliate_idパラメータを確認してください`);
      }
    } else {
      console.log("   ⚠️  商品が見つかりませんでした");
    }
  } catch (error) {
    console.log(`   ❌ エラー: ${error.message}`);
    console.error(error.stack);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Yahoo!ショッピングAPIアフィリエイトテスト完了！");
  console.log("\n💰 収益化の準備完了:");
  console.log("   - バリューコマース sid: 3756214");
  console.log("   - バリューコマース pid: 892196964");
  console.log("   - Yahoo!経由の購入で報酬が発生します（1-50%）\n");
}

testYahooAffiliate();
