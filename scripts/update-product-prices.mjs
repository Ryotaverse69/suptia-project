#!/usr/bin/env node

/**
 * 既存商品の価格データを更新するスクリプト
 *
 * 使い方:
 *   node scripts/update-product-prices.mjs [options]
 *
 * オプション:
 *   --source <rakuten|yahoo>  更新するソース（デフォルト: rakuten）
 *   --limit <number>          処理する商品数（デフォルト: 30）
 *   --dry-run                 実際には保存せず、取得データのみ表示
 *
 * 例:
 *   node scripts/update-product-prices.mjs --source rakuten --limit 20
 *   node scripts/update-product-prices.mjs --source yahoo --dry-run
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent
  .match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]
  ?.trim();
const SANITY_DATASET = envContent
  .match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]
  ?.trim();
const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();
const RAKUTEN_APPLICATION_ID = envContent
  .match(/RAKUTEN_APPLICATION_ID=(.+)/)?.[1]
  ?.trim();
const RAKUTEN_AFFILIATE_ID = envContent
  .match(/RAKUTEN_AFFILIATE_ID=(.+)/)?.[1]
  ?.trim();
const YAHOO_CLIENT_ID = envContent
  .match(/YAHOO_SHOPPING_CLIENT_ID=(.+)/)?.[1]
  ?.trim();

// Sanityクライアント初期化
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: SANITY_API_TOKEN,
});

// RakutenAdapter（簡易版）
class RakutenAdapter {
  constructor(applicationId, affiliateId) {
    this.applicationId = applicationId;
    this.affiliateId = affiliateId;
    this.baseUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';
  }

  async search(keyword, options = {}) {
    const { limit = 30, page = 1 } = options;

    const params = new URLSearchParams({
      applicationId: this.applicationId,
      keyword,
      hits: Math.min(limit, 30).toString(),
      page: page.toString(),
      sort: 'standard',
      ...(this.affiliateId && { affiliateId: this.affiliateId }),
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`楽天API エラー: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`楽天API エラー: ${data.error_description || data.error}`);
    }

    const products = (data.Items || []).map(item => this.normalizeProduct(item.Item));

    return {
      products,
      total: data.hits || 0,
      page: data.page || 1,
      totalPages: data.pageCount || 1,
    };
  }

  normalizeProduct(item) {
    let imageUrl = null;
    if (item.mediumImageUrls && item.mediumImageUrls.length > 0) {
      const originalUrl = item.mediumImageUrls[0].imageUrl;
      imageUrl = originalUrl.split('?')[0];
    }

    return {
      id: item.itemCode,
      name: item.itemName,
      price: item.itemPrice,
      currency: 'JPY',
      url: item.itemUrl,
      affiliateUrl: item.affiliateUrl,
      imageUrl,
      shopName: item.shopName,
      rating: item.reviewAverage,
      reviewCount: item.reviewCount,
      source: 'rakuten',
      description: item.itemCaption,
      inStock: item.availability === 1,
      identifiers: {
        rakutenItemCode: item.itemCode,
      },
    };
  }
}

// YahooAdapter（簡易版）
class YahooAdapter {
  constructor(clientId) {
    this.clientId = clientId;
    this.baseUrl = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch';
  }

  async search(keyword, options = {}) {
    const { limit = 30 } = options;

    const params = new URLSearchParams({
      appid: this.clientId,
      query: keyword,
      results: Math.min(limit, 50).toString(),
      sort: '-score',
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Yahoo API エラー: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Yahoo API エラー: ${data.error.message || 'Unknown error'}`);
    }

    const products = (data.hits || []).map(hit => this.normalizeProduct(hit));

    return {
      products,
      total: data.totalResultsAvailable || 0,
      page: 1,
      totalPages: Math.ceil((data.totalResultsAvailable || 0) / limit),
    };
  }

  normalizeProduct(hit) {
    const exImage = hit.exImage?.url;

    return {
      id: hit.code,
      name: hit.name,
      price: parseInt(hit.price, 10),
      currency: 'JPY',
      url: hit.url,
      affiliateUrl: hit.url,
      imageUrl: exImage || hit.image?.medium,
      brand: hit.brand?.name,
      shopName: hit.seller?.name,
      rating: parseFloat(hit.review?.rate || 0),
      reviewCount: parseInt(hit.review?.count || 0, 10),
      source: 'yahoo',
      description: hit.description,
      inStock: hit.inStock === true || hit.inStock === 1,
      identifiers: {
        yahooItemCode: hit.code,
        ...(hit.janCode && { jan: hit.janCode }),
      },
    };
  }
}

async function updatePrices() {
  // コマンドライン引数の解析
  const args = process.argv.slice(2);
  const source = args.find((arg) => arg.startsWith("--source"))?.split("=")[1] || "rakuten";
  const limit = parseInt(args.find((arg) => arg.startsWith("--limit"))?.split("=")[1] || "30");
  const dryRun = args.includes("--dry-run");

  console.log("🚀 商品価格更新スクリプト\n");
  console.log(`  ソース: ${source}`);
  console.log(`  処理件数: ${limit}件`);
  console.log(`  モード: ${dryRun ? "DRY RUN" : "本番実行"}\n`);

  try {
    // ECアダプター初期化
    let adapter;
    if (source === "rakuten") {
      if (!RAKUTEN_APPLICATION_ID) {
        console.error("❌ RAKUTEN_APPLICATION_ID が見つかりません");
        process.exit(1);
      }
      adapter = new RakutenAdapter(RAKUTEN_APPLICATION_ID, RAKUTEN_AFFILIATE_ID);
    } else if (source === "yahoo") {
      if (!YAHOO_CLIENT_ID) {
        console.error("❌ YAHOO_CLIENT_ID が見つかりません");
        process.exit(1);
      }
      adapter = new YahooAdapter(YAHOO_CLIENT_ID);
    } else {
      console.error(`❌ 未対応のソース: ${source}`);
      process.exit(1);
    }

    // Sanityから既存商品を取得
    console.log("📥 Sanityから既存商品を取得中...");
    const query = `*[_type == "product" && source == $source][0..${limit}]{
      _id,
      name,
      source,
      itemCode,
      janCode,
      priceJPY,
      priceData,
      affiliateUrl
    }`;

    const products = await client.fetch(query, { source });
    console.log(`✅ ${products.length}件の商品を取得しました\n`);

    if (products.length === 0) {
      console.log(`⚠️ ${source}の商品が見つかりませんでした`);
      return;
    }

    // 各商品の価格を更新
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      console.log(`\n📦 処理中: ${product.name.substring(0, 60)}...`);

      // API制限を考慮して待機（楽天APIは1秒間に1リクエストまで）
      await new Promise((resolve) => setTimeout(resolve, 1200));

      try {
        // itemCodeで商品を検索（ECサイトから最新の価格を取得）
        let latestPrice = null;

        if (source === "rakuten" && product.itemCode) {
          // 楽天の場合、itemCodeで再検索
          const searchResult = await adapter.search(product.name, { limit: 5 });
          const matchedProduct = searchResult.products.find(
            (p) => p.identifiers.rakutenItemCode === product.itemCode
          );

          if (matchedProduct) {
            latestPrice = {
              source: "rakuten",
              amount: matchedProduct.price,
              currency: "JPY",
              url: matchedProduct.url,
              shopName: matchedProduct.shopName,
              affiliateUrl: matchedProduct.affiliateUrl,
              itemCode: matchedProduct.identifiers.rakutenItemCode,
              productName: matchedProduct.name,
              fetchedAt: new Date().toISOString(),
            };
          }
        } else if (source === "yahoo" && product.itemCode) {
          // Yahoo!の場合、itemCodeで再検索
          const searchResult = await adapter.search(product.name, { limit: 5 });
          const matchedProduct = searchResult.products.find(
            (p) => p.identifiers.yahooItemCode === product.itemCode
          );

          if (matchedProduct) {
            latestPrice = {
              source: "yahoo",
              amount: matchedProduct.price,
              currency: "JPY",
              url: matchedProduct.url,
              shopName: matchedProduct.shopName,
              affiliateUrl: matchedProduct.affiliateUrl,
              itemCode: matchedProduct.identifiers.yahooItemCode,
              productName: matchedProduct.name,
              fetchedAt: new Date().toISOString(),
            };
          }
        }

        if (!latestPrice) {
          console.log(`  ⏭️ スキップ: 最新価格が取得できませんでした`);
          skippedCount++;
          continue;
        }

        console.log(`  💰 最新価格: ¥${latestPrice.amount}`);
        console.log(`  🏪 店舗: ${latestPrice.shopName}`);

        // priceDataに追加または更新
        const existingPriceData = Array.isArray(product.priceData)
          ? product.priceData
          : [];

        // 同じソースの既存データを削除して新しいデータを追加
        const updatedPriceData = [
          ...existingPriceData.filter((p) => p.source !== source),
          latestPrice,
        ];

        if (!dryRun) {
          // Sanityに更新
          await client
            .patch(product._id)
            .set({
              priceData: updatedPriceData,
              priceJPY: latestPrice.amount, // メイン価格も更新
              affiliateUrl: latestPrice.affiliateUrl,
            })
            .commit();

          console.log(`  ✅ 更新完了`);
          updatedCount++;
        } else {
          console.log(`  ✅ 更新予定（DRY RUN）`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`  ❌ エラー: ${error.message}`);
        errorCount++;
      }
    }

    // 結果表示
    console.log("\n\n📊 更新結果:");
    console.log(`  ✅ 更新: ${updatedCount}件`);
    console.log(`  ⏭️ スキップ: ${skippedCount}件`);
    console.log(`  ❌ エラー: ${errorCount}件`);

    if (dryRun) {
      console.log("\n💡 実際に更新するには --dry-run を外して実行してください");
    }
  } catch (error) {
    console.error("❌ エラー:", error);
    process.exit(1);
  }
}

// 実行
updatePrices();
