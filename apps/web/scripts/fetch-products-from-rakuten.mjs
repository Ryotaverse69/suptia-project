#!/usr/bin/env node

/**
 * 楽天APIから成分の商品を検索してSanityに保存するスクリプト
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
  console.warn("⚠️ .env.localファイルが見つかりません。環境変数を確認してください。");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * 楽天APIで商品を検索
 */
async function searchRakutenProducts(keyword, limit = 10) {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  if (!applicationId) {
    throw new Error("RAKUTEN_APPLICATION_IDが設定されていません");
  }

  // サプリメントに絞り込むため、キーワードに「サプリ」を追加
  const searchKeyword = `${keyword} サプリメント`;

  const params = new URLSearchParams({
    applicationId,
    keyword: searchKeyword,
    formatVersion: "2",
    hits: limit.toString(),
    sort: "-reviewCount", // レビュー数が多い順
  });

  if (affiliateId) {
    params.append("affiliateId", affiliateId);
  }

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params.toString()}`;

  console.log(`  🔍 検索キーワード: "${searchKeyword}"`);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`楽天API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`楽天API Error: ${data.error} - ${data.error_description}`);
  }

  return data.Items || [];
}

/**
 * 楽天商品データをSanity商品スキーマに変換
 */
function convertToSanityProduct(rakutenItem, ingredientRef) {
  const item = rakutenItem;

  // ブランド名を商品名から抽出（簡易的に最初の単語を使用）
  const brandName = item.itemName.split(/[\s　]/).find((word) => word.length > 1) || "不明";

  // 容量と摂取量をitemNameから推定（簡易版）
  let servingsPerContainer = 30; // デフォルト30日分
  let servingsPerDay = 1; // デフォルト1日1回

  // 「30日分」「60粒」などのパターンをチェック
  const daysMatch = item.itemName.match(/(\d+)日分/);
  const tabletsMatch = item.itemName.match(/(\d+)粒/);

  if (daysMatch) {
    servingsPerContainer = parseInt(daysMatch[1], 10);
  } else if (tabletsMatch) {
    const tablets = parseInt(tabletsMatch[1], 10);
    servingsPerContainer = tablets; // 仮に1粒=1回分とする
  }

  // Slug生成（商品コードを使用）
  const slug = item.itemCode.replace(/:/g, "-").toLowerCase();

  return {
    _type: "product",
    name: item.itemName,
    slug: {
      _type: "slug",
      current: slug,
    },
    brand: {
      _type: "reference",
      _ref: "brand-unknown", // 後で適切なbrandドキュメントを作成する必要がある
      _weak: true,
    },
    priceJPY: item.itemPrice,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl: item.mediumImageUrls?.[0]?.imageUrl || null,
    rating: item.reviewAverage || 0,
    reviewCount: item.reviewCount || 0,
    janCode: item.janCode || null,
    itemCode: item.itemCode,
    affiliateUrl: item.affiliateUrl || item.itemUrl,
    source: "rakuten",
    availability: "in-stock", // 楽天APIから取得した商品は在庫ありとする
    ingredients: [
      {
        _type: "ingredientRef",
        _key: ingredientRef._id,
        ingredient: {
          _type: "reference",
          _ref: ingredientRef._id,
        },
        amountMgPerServing: 0, // 後で手動で設定する必要がある
      },
    ],
  };
}

/**
 * Sanityに商品を保存
 */
async function saveProductToSanity(product) {
  try {
    const result = await client.create(product);
    return result;
  } catch (error) {
    // 既に存在する場合はスキップ
    if (error.message.includes("already exists")) {
      console.log(`    ⚠️ 商品が既に存在: ${product.name}`);
      return null;
    }
    throw error;
  }
}

/**
 * メイン処理
 */
async function main() {
  // コマンドライン引数でテストモードを指定
  const args = process.argv.slice(2);
  const testMode = args.includes("--test");
  const maxIngredients = testMode ? 3 : Infinity; // テストモードでは最初の3成分のみ

  console.log("🚀 楽天APIから商品データを取得してSanityに保存します");
  if (testMode) {
    console.log("⚠️ テストモード: 最初の3成分のみ処理します\n");
  } else {
    console.log("\n");
  }

  try {
    // 1. 商品が0件の成分を取得
    console.log("📊 Sanityから商品が0件の成分を取得中...\n");

    const ingredients = await client.fetch(
      `*[_type == "ingredient"] {
        _id,
        name,
        nameEn,
        "productCount": count(*[_type == "product" && references(^._id)])
      } | order(productCount asc)`
    );

    const ingredientsWithNoProducts = ingredients.filter((i) => i.productCount === 0);

    console.log(`✅ ${ingredientsWithNoProducts.length}件の成分が見つかりました\n`);

    if (ingredientsWithNoProducts.length === 0) {
      console.log("✨ すべての成分に商品が紐付いています！");
      return;
    }

    // 2. 各成分について楽天APIで商品検索
    let totalProductsAdded = 0;
    const maxProductsPerIngredient = 5; // 1成分あたり最大5商品を取得

    // テストモードの場合は最初のN件のみ処理
    const ingredientsToProcess = ingredientsWithNoProducts.slice(0, maxIngredients);

    console.log(`📝 処理対象: ${ingredientsToProcess.length}件の成分\n`);

    for (const [index, ingredient] of ingredientsToProcess.entries()) {
      console.log(
        `\n[${index + 1}/${ingredientsToProcess.length}] 🔍 成分: ${ingredient.name} (${ingredient.nameEn})`
      );

      try {
        // 楽天APIで商品検索
        const rakutenItems = await searchRakutenProducts(
          ingredient.name,
          maxProductsPerIngredient
        );

        console.log(`  ✅ ${rakutenItems.length}件の商品が見つかりました`);

        if (rakutenItems.length === 0) {
          console.log(`  ⚠️ 商品が見つかりませんでした`);
          continue;
        }

        // 3. Sanityに商品を保存
        let savedCount = 0;
        for (const rakutenItem of rakutenItems) {
          const product = convertToSanityProduct(rakutenItem, ingredient);

          console.log(`    💾 保存中: ${product.name.substring(0, 50)}...`);

          const saved = await saveProductToSanity(product);
          if (saved) {
            savedCount++;
            totalProductsAdded++;
          }

          // APIレート制限対策: 200msの待機
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        console.log(`  ✅ ${savedCount}件の商品を保存しました`);

        // 成分間のAPI呼び出しに1秒の待機
        if (index < ingredientsToProcess.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`  ❌ エラー: ${error.message}`);
        continue;
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log(`✨ 完了！合計 ${totalProductsAdded}件の商品を追加しました`);
    console.log("=".repeat(80));
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

// 実行
main();
