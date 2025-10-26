#!/usr/bin/env node

/**
 * タイトル類似度で楽天とYahooの商品をマッチングするスクリプト
 * product-matching.tsのロジックを使用
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動で読み込む
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
  console.warn("⚠️ .env.localファイルが見つかりません。");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * タイトルを正規化（product-matching.tsのロジック）
 */
function normalizeTitle(title) {
  let normalized = title.toLowerCase();

  // 容量・単位パターンを除去
  normalized = normalized.replace(
    /\d+\s?(mg|g|ml|l|粒|錠|カプセル|capsules?|tablets?|日分|ヶ月分)/gi,
    ""
  );

  // 記号・数字を除去
  normalized = normalized.replace(/[^\p{L}\s]/gu, "");

  // 連続スペースを1つに
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * テキストをトークン化
 */
function tokenize(text) {
  const stopWords = new Set([
    "の", "に", "を", "は", "が", "と", "で", "から",
    "a", "an", "the", "in", "on", "at", "for", "with",
    "サプリ", "サプリメント", "supplement", "送料無料", "公式",
  ]);

  return text
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .filter((word) => !stopWords.has(word));
}

/**
 * タイトル類似度を計算（Jaccard係数）
 */
function calculateTitleSimilarity(title1, title2) {
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);

  const words1 = tokenize(normalized1);
  const words2 = tokenize(normalized2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const intersection = words1.filter((word) => words2.includes(word)).length;
  const union = new Set([...words1, ...words2]).size;

  if (union === 0) return 0;

  return intersection / union;
}

/**
 * ブランド名を抽出（簡易版）
 */
function extractBrand(productName) {
  const knownBrands = [
    "DHC", "ネイチャーメイド", "ファンケル", "NOW", "Solaray", "ソラレー",
    "グロング", "マイプロテイン", "ナウフーズ", "サントリー", "ディアナチュラ",
  ];

  for (const brand of knownBrands) {
    if (productName.includes(brand)) {
      return brand;
    }
  }

  return null;
}

/**
 * メイン処理
 */
async function main() {
  console.log("🔍 タイトル類似度による商品マッチング\n");

  try {
    // 1. 楽天とYahooの商品を取得
    console.log("📊 商品データを取得中...\n");

    const rakutenProducts = await client.fetch(
      `*[_type == "product" && source == "rakuten"]{
        _id,
        name,
        priceJPY,
        itemCode,
        "ingredientIds": ingredients[].ingredient._ref
      }`
    );

    const yahooProducts = await client.fetch(
      `*[_type == "product" && source == "yahoo"]{
        _id,
        name,
        priceJPY,
        itemCode,
        janCode,
        "ingredientIds": ingredients[].ingredient._ref
      }`
    );

    console.log(`✅ 楽天: ${rakutenProducts.length}件`);
    console.log(`✅ Yahoo: ${yahooProducts.length}件\n`);

    // 2. マッチング実行
    console.log("🔗 商品をマッチング中...\n");

    const matches = [];
    const minSimilarity = 0.50; // 50%以上の類似度でマッチ（楽天はブランド情報が少ないため閾値を下げる）

    for (const rakutenProduct of rakutenProducts) {
      const rakutenBrand = extractBrand(rakutenProduct.name);

      for (const yahooProduct of yahooProducts) {
        const yahooBrand = extractBrand(yahooProduct.name);

        // ブランドが一致する場合、優先的にマッチング
        const brandBonus = rakutenBrand && yahooBrand && rakutenBrand === yahooBrand ? 0.2 : 0;

        const similarity = calculateTitleSimilarity(
          rakutenProduct.name,
          yahooProduct.name
        ) + brandBonus;

        if (similarity >= minSimilarity) {
          // 同じ成分を含むかチェック
          const commonIngredients = rakutenProduct.ingredientIds.filter((id) =>
            yahooProduct.ingredientIds.includes(id)
          );

          matches.push({
            rakutenProduct,
            yahooProduct,
            similarity,
            brand: rakutenBrand || yahooBrand,
            priceDiff: yahooProduct.priceJPY - rakutenProduct.priceJPY,
            hasCommonIngredient: commonIngredients.length > 0,
          });
        }
      }
    }

    // 類似度でソート
    matches.sort((a, b) => b.similarity - a.similarity);

    // 3. 結果を表示
    console.log("=".repeat(80));
    console.log(`✨ マッチング完了！${matches.length}件の商品ペアが見つかりました\n`);
    console.log("=".repeat(80));

    // 上位20件を表示
    const topMatches = matches.slice(0, 20);

    topMatches.forEach((match, index) => {
      const { rakutenProduct, yahooProduct, similarity, brand, priceDiff } = match;

      console.log(`\n[${index + 1}] 類似度: ${(similarity * 100).toFixed(1)}% | ブランド: ${brand || "不明"}`);
      console.log(`  楽天: ${rakutenProduct.name.substring(0, 60)}...`);
      console.log(`        ¥${rakutenProduct.priceJPY.toLocaleString()}`);
      console.log(`  Yahoo: ${yahooProduct.name.substring(0, 60)}...`);
      console.log(`        ¥${yahooProduct.priceJPY.toLocaleString()}`);

      if (priceDiff > 0) {
        console.log(`  💰 楽天が¥${Math.abs(priceDiff).toLocaleString()}安い！`);
      } else if (priceDiff < 0) {
        console.log(`  💰 Yahooが¥${Math.abs(priceDiff).toLocaleString()}安い！`);
      } else {
        console.log(`  同価格`);
      }
    });

    if (matches.length > 20) {
      console.log(`\n...他${matches.length - 20}件のマッチ`);
    }

    // 4. 統計情報
    console.log("\n" + "=".repeat(80));
    console.log("📈 統計情報:");
    console.log("=".repeat(80));

    const avgSimilarity = matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length;
    const rakutenCheaper = matches.filter((m) => m.priceDiff > 0).length;
    const yahooCheaper = matches.filter((m) => m.priceDiff < 0).length;
    const samePriceCount = matches.filter((m) => m.priceDiff === 0).length;

    console.log(`平均類似度: ${(avgSimilarity * 100).toFixed(1)}%`);
    console.log(`楽天の方が安い: ${rakutenCheaper}件`);
    console.log(`Yahooの方が安い: ${yahooCheaper}件`);
    console.log(`同価格: ${samePriceCount}件`);

    // 5. 高信頼度マッチ（70%以上）をSanityに保存するか確認
    const highConfidenceMatches = matches.filter((m) => m.similarity >= 0.70);

    console.log("\n" + "=".repeat(80));
    console.log(`✅ 高信頼度マッチ（70%以上）: ${highConfidenceMatches.length}件`);
    console.log("=".repeat(80));

    if (highConfidenceMatches.length > 0) {
      console.log("\n次のステップ:");
      console.log("1. これらの高信頼度マッチをSanityに「商品リンケージ」として保存");
      console.log("2. 商品詳細ページで複数ソースの価格を表示");
      console.log("3. 「最安値を見つける」機能を実装");
    }

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

// 実行
main();
