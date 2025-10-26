#!/usr/bin/env node

/**
 * 人気ブランド商品を楽天とYahoo両方から取得して価格比較を実現
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local読み込み
const envPath = resolve(__dirname, "../.env.local");
try {
  const envFile = readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
} catch (error) {
  console.warn("⚠️ .env.localが見つかりません");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 人気商品リストを読み込み
const popularProducts = JSON.parse(
  readFileSync(resolve(__dirname, "popular-products.json"), "utf8")
);

/**
 * 楽天APIで商品検索
 */
async function searchRakuten(keyword) {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  const params = new URLSearchParams({
    applicationId,
    keyword,
    formatVersion: "2",
    hits: "3",
    sort: "-reviewCount",
  });

  if (affiliateId) {
    params.append("affiliateId", affiliateId);
  }

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  return (data.Items || []).map((item) => ({
    name: item.itemName,
    price: item.itemPrice,
    url: item.affiliateUrl || item.itemUrl,
    itemCode: item.itemCode,
    reviewAverage: item.reviewAverage || 0,
    reviewCount: item.reviewCount || 0,
    imageUrl: item.mediumImageUrls?.[0]?.imageUrl || null,
    source: "rakuten",
  }));
}

/**
 * YahooショッピングAPIで商品検索
 */
async function searchYahoo(keyword) {
  const clientId = process.env.YAHOO_SHOPPING_CLIENT_ID;
  const affiliateId = process.env.YAHOO_AFFILIATE_ID;

  const params = new URLSearchParams({
    appid: clientId,
    query: keyword,
    results: "3",
  });

  if (affiliateId) {
    params.append("affiliate_type", "vc");
    params.append("affiliate_id", affiliateId);
  }

  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  return (data.hits || []).map((item) => ({
    name: item.name,
    price: item.priceLabel?.salePrice || item.priceLabel?.premiumPrice || item.price,
    url: item.affiliateUrl || item.url,
    itemCode: item.code,
    janCode: item.janCode || null,
    reviewAverage: item.review?.rate || 0,
    reviewCount: item.review?.count || 0,
    imageUrl: item.image?.medium || item.image?.small || null,
    source: "yahoo",
  }));
}

/**
 * タイトル類似度を計算
 */
function calculateSimilarity(title1, title2) {
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/\d+\s?(mg|g|ml|l|粒|錠|カプセル|日分|ヶ月分)/gi, "")
      .replace(/[^\p{L}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  const tokenize = (text) =>
    text
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .filter((w) => !["の", "に", "を", "は", "が", "サプリ", "サプリメント", "送料無料"].includes(w));

  const words1 = tokenize(normalize(title1));
  const words2 = tokenize(normalize(title2));

  if (words1.length === 0 || words2.length === 0) return 0;

  const intersection = words1.filter((word) => words2.includes(word)).length;
  const union = new Set([...words1, ...words2]).size;

  return union === 0 ? 0 : intersection / union;
}

/**
 * メイン処理
 */
async function main() {
  console.log("🛒 人気商品の価格比較データ取得\n");
  console.log(`📋 対象商品: ${popularProducts.length}件\n`);
  console.log("=".repeat(80) + "\n");

  const comparisonResults = [];

  for (const [index, product] of popularProducts.entries()) {
    console.log(`[${index + 1}/${popularProducts.length}] ${product.brand} ${product.productName}`);
    console.log(`  検索キーワード: "${product.searchKeyword}"`);

    try {
      // 楽天とYahoo両方から検索
      const [rakutenResults, yahooResults] = await Promise.all([
        searchRakuten(product.searchKeyword),
        searchYahoo(product.searchKeyword),
      ]);

      console.log(`  楽天: ${rakutenResults.length}件, Yahoo: ${yahooResults.length}件`);

      // 各ソースのトップ商品をマッチング
      if (rakutenResults.length > 0 && yahooResults.length > 0) {
        const rakuten = rakutenResults[0];
        const yahoo = yahooResults[0];

        const similarity = calculateSimilarity(rakuten.name, yahoo.name);

        if (similarity >= 0.40) {
          // 閾値を40%に下げる
          const priceDiff = yahoo.price - rakuten.price;
          const cheaper = priceDiff > 0 ? "rakuten" : priceDiff < 0 ? "yahoo" : "same";

          comparisonResults.push({
            brand: product.brand,
            productName: product.productName,
            similarity: (similarity * 100).toFixed(1),
            rakuten,
            yahoo,
            priceDiff: Math.abs(priceDiff),
            cheaper,
          });

          console.log(`  ✅ マッチ成功！類似度: ${(similarity * 100).toFixed(1)}%`);
          console.log(`     楽天: ¥${rakuten.price.toLocaleString()} vs Yahoo: ¥${yahoo.price.toLocaleString()}`);

          if (cheaper === "rakuten") {
            console.log(`     💰 楽天が¥${Math.abs(priceDiff).toLocaleString()}安い`);
          } else if (cheaper === "yahoo") {
            console.log(`     💰 Yahooが¥${Math.abs(priceDiff).toLocaleString()}安い`);
          } else {
            console.log(`     同価格`);
          }
        } else {
          console.log(`  ⚠️ 類似度低い (${(similarity * 100).toFixed(1)}%)`);
        }
      } else {
        console.log(`  ⚠️ 商品が見つかりませんでした`);
      }

      // APIレート制限対策
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("");
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}\n`);
    }
  }

  // 結果サマリー
  console.log("\n" + "=".repeat(80));
  console.log("📊 価格比較結果サマリー");
  console.log("=".repeat(80) + "\n");

  console.log(`✅ マッチング成功: ${comparisonResults.length}/${popularProducts.length}件\n`);

  if (comparisonResults.length > 0) {
    const rakutenCheaper = comparisonResults.filter((r) => r.cheaper === "rakuten").length;
    const yahooCheaper = comparisonResults.filter((r) => r.cheaper === "yahoo").length;
    const samePriceCount = comparisonResults.filter((r) => r.cheaper === "same").length;

    console.log(`楽天の方が安い: ${rakutenCheaper}件`);
    console.log(`Yahooの方が安い: ${yahooCheaper}件`);
    console.log(`同価格: ${samePriceCount}件\n`);

    console.log("=".repeat(80));
    console.log("💰 価格差トップ5:");
    console.log("=".repeat(80) + "\n");

    const topDiff = comparisonResults
      .filter((r) => r.priceDiff > 0)
      .sort((a, b) => b.priceDiff - a.priceDiff)
      .slice(0, 5);

    topDiff.forEach((result, i) => {
      console.log(`${i + 1}. ${result.brand} ${result.productName}`);
      console.log(`   価格差: ¥${result.priceDiff.toLocaleString()}`);
      console.log(`   ${result.cheaper === "rakuten" ? "楽天" : "Yahoo"}が安い`);
      console.log(`   楽天: ¥${result.rakuten.price.toLocaleString()} | Yahoo: ¥${result.yahoo.price.toLocaleString()}`);
      console.log("");
    });
  }

  console.log("=".repeat(80));
  console.log("✨ 完了！");
  console.log("=".repeat(80));
}

// 実行
main();
