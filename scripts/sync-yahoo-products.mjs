#!/usr/bin/env node

/**
 * Yahoo!ショッピング商品同期スクリプト
 *
 * Yahoo!ショッピングAPIから商品を取得し、Sanityに同期します。
 *
 * 使い方:
 *   node scripts/sync-yahoo-products.mjs [keyword] [options]
 *
 * オプション:
 *   --limit <number>    取得する商品数（デフォルト: 30）
 *   --dry-run          実際には保存せず、取得データのみ表示
 *   --update-prices    既存商品の価格のみ更新
 *
 * 例:
 *   node scripts/sync-yahoo-products.mjs "ビタミンC" --limit 10
 *   node scripts/sync-yahoo-products.mjs "プロテイン" --dry-run
 *   node scripts/sync-yahoo-products.mjs --update-prices
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();
const YAHOO_CLIENT_ID = envContent.match(/YAHOO_SHOPPING_CLIENT_ID=(.+)/)?.[1]?.trim();
const YAHOO_AFFILIATE_ID = envContent.match(/YAHOO_AFFILIATE_ID=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

if (!YAHOO_CLIENT_ID) {
  console.error('❌ YAHOO_SHOPPING_CLIENT_ID が見つかりません');
  console.log('💡 .env.local にYahoo!ショッピングAPIの認証情報を追加してください');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-03';
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data`;

// YahooAdapter（簡易版 - 本番ではlib/ec-adaptersを使用）
class YahooAdapter {
  constructor(clientId, affiliateId) {
    this.clientId = clientId;
    this.affiliateId = affiliateId;
    this.baseUrl = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch';
  }

  async search(keyword, options = {}) {
    const { limit = 30, page = 1 } = options;

    const hits = Math.min(limit, 100);
    const offset = (page - 1) * hits + 1;

    const params = new URLSearchParams({
      appid: this.clientId,
      query: keyword,
      hits: hits.toString(),
      offset: offset.toString(),
      sort: '-score',
    });

    console.log(`🔍 Yahoo!ショッピングAPIで検索中: "${keyword}"...`);
    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Yahoo! API エラー: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const products = (data.hits || []).map(item => this.normalizeProduct(item));

    return {
      products,
      total: data.totalResultsAvailable || 0,
      page,
      totalPages: Math.ceil((data.totalResultsAvailable || 0) / hits),
    };
  }

  normalizeProduct(item) {
    let affiliateUrl = item.url;
    if (this.affiliateId) {
      affiliateUrl = `${this.affiliateId}${encodeURIComponent(item.url)}`;
    }

    return {
      id: item.code,
      name: item.name,
      price: item.price,
      currency: 'JPY',
      url: item.url,
      affiliateUrl,
      imageUrl: item.image?.medium || item.image?.small,
      brand: item.store?.name,
      rating: item.review?.rate,
      reviewCount: item.review?.count,
      source: 'yahoo',
      description: item.description,
      inStock: item.availability === 1,
      identifiers: {
        yahooCode: item.code,
        jan: item.janCode,
      },
    };
  }
}

// Sanity操作
async function queryProducts() {
  const query = encodeURIComponent('*[_type == "product"]{ _id, name, identifiers }');
  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

async function queryBrands() {
  const query = encodeURIComponent('*[_type == "brand"]{ _id, name, slug }');
  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

async function createBrand(brandName) {
  // brandNameがundefinedまたは空の場合はデフォルト値を使用
  const safeBrandName = brandName || 'その他のブランド';

  const slug = safeBrandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const brandId = `brand-${slug}`;

  const brand = {
    _id: brandId,
    _type: 'brand',
    name: safeBrandName,
    slug: { _type: 'slug', current: slug },
    description: `${safeBrandName}の商品`,
    country: 'JP',
    trustScore: 70,
    priceRange: 'mid-range',
  };

  console.log(`  📍 新規ブランド作成: ${safeBrandName}`);

  const mutations = [{ createIfNotExists: brand }];

  const response = await fetch(`${SANITY_API_URL}/mutate/${SANITY_DATASET}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`ブランド作成失敗: ${JSON.stringify(error)}`);
  }

  return brandId;
}

async function syncProducts(products, existingProducts, existingBrands, dryRun = false) {
  const mutations = [];
  const stats = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  console.log(`\n📦 ${products.length}件の商品を処理中...\n`);

  for (const product of products) {
    try {
      // 既存商品チェック（Yahoo!商品コードまたはJANコードで照合）
      const existing = existingProducts.find(
        p =>
          p.identifiers?.yahooCode === product.identifiers.yahooCode ||
          (product.identifiers.jan && p.identifiers?.jan === product.identifiers.jan)
      );

      // ブランド取得または作成
      const brandName = product.brand || 'その他のブランド';
      let brand = existingBrands.find(b => b.name === brandName);
      if (!brand && !dryRun) {
        const brandId = await createBrand(brandName);
        brand = { _id: brandId, name: brandName };
        existingBrands.push(brand);
      }

      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 96);

      const productId = existing?._id || `product-yahoo-${product.id.replace(/[^a-z0-9]+/g, '-')}`;

      // 価格データ
      const priceData = {
        source: 'yahoo',
        amount: product.price,
        currency: 'JPY',
        url: product.affiliateUrl || product.url,
        fetchedAt: new Date().toISOString(),
        confidence: 1.0,
      };

      const sanityProduct = {
        _id: productId,
        _type: 'product',
        name: product.name,
        slug: { _type: 'slug', current: slug },
        brand: {
          _type: 'reference',
          _ref: brand?._id || 'brand-unknown',
        },
        source: 'yahoo', // 取得元ECサイト
        janCode: product.identifiers.jan, // JANコード（ショートカット）
        itemCode: product.identifiers.yahooCode, // EC商品コード
        affiliateUrl: product.affiliateUrl || product.url, // アフィリエイトURL
        identifiers: {
          yahooCode: product.identifiers.yahooCode,
          jan: product.identifiers.jan,
        },
        urls: {
          rakuten: product.affiliateUrl || product.url,
        },
        priceJPY: product.price,
        description: product.description,
        availability: product.inStock ? 'in-stock' : 'out-of-stock',
        reviewStats: {
          averageRating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
        },
        priceData: [priceData],
        // 外部画像URL（Yahoo APIから取得）
        ...(product.imageUrl && {
          externalImageUrl: product.imageUrl,
        }),
        ingredients: [],
        servingsPerDay: 1,
        servingsPerContainer: 30,
      };

      if (existing) {
        // 既存商品は価格データと価格履歴を更新
        console.log(`  🔄 更新: ${product.name.substring(0, 50)}...`);

        // 価格履歴エントリ
        const priceHistoryEntry = {
          source: 'yahoo',
          amount: product.price,
          recordedAt: new Date().toISOString(),
        };

        mutations.push({
          patch: {
            id: productId,
            set: {
              priceJPY: product.price,
              availability: product.inStock ? 'in-stock' : 'out-of-stock',
              'reviewStats.averageRating': product.rating || 0,
              'reviewStats.reviewCount': product.reviewCount || 0,
              ...(product.imageUrl && { externalImageUrl: product.imageUrl }),
            },
            insert: {
              after: 'priceData[-1]',
              items: [priceData],
            },
          },
        });

        // 価格履歴を別のmutationで追加（配列の最後に追加）
        mutations.push({
          patch: {
            id: productId,
            insert: {
              after: 'priceHistory[-1]',
              items: [priceHistoryEntry],
            },
          },
        });

        stats.updated++;
      } else {
        console.log(`  ✨ 新規: ${product.name.substring(0, 50)}...`);
        mutations.push({
          createIfNotExists: sanityProduct,
        });
        stats.created++;
      }
    } catch (error) {
      console.error(`  ❌ エラー: ${product.name}`, error.message);
      stats.errors++;
    }
  }

  if (dryRun) {
    console.log('\n🔍 DRY RUN モード - 実際には保存されません');
    console.log(`  新規作成予定: ${stats.created}件`);
    console.log(`  更新予定: ${stats.updated}件`);
    return stats;
  }

  if (mutations.length === 0) {
    console.log('\n⚠️  同期する商品がありません');
    return stats;
  }

  console.log(`\n💾 Sanityに保存中...`);

  const response = await fetch(`${SANITY_API_URL}/mutate/${SANITY_DATASET}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Sanity mutation failed: ${JSON.stringify(error)}`);
  }

  console.log('✅ 同期完了！');
  return stats;
}

// メイン処理
async function main() {
  const args = process.argv.slice(2);
  const keyword = args.find(arg => !arg.startsWith('--')) || 'サプリメント';
  const limit = parseInt(args.find(arg => arg.startsWith('--limit'))?.split('=')[1] || '30');
  const dryRun = args.includes('--dry-run');

  console.log('🚀 Yahoo!ショッピング商品同期スクリプト\n');
  console.log(`  検索キーワード: ${keyword}`);
  console.log(`  取得件数: ${limit}件`);
  console.log(`  モード: ${dryRun ? 'DRY RUN' : '本番実行'}\n`);

  try {
    // Yahoo! API初期化
    const yahoo = new YahooAdapter(YAHOO_CLIENT_ID, YAHOO_AFFILIATE_ID);

    // Yahoo!から商品取得
    const searchResult = await yahoo.search(keyword, { limit });
    console.log(`✅ ${searchResult.products.length}件の商品を取得しました\n`);

    if (searchResult.products.length === 0) {
      console.log('⚠️  商品が見つかりませんでした');
      return;
    }

    // Sanityから既存データ取得
    console.log('📥 Sanityから既存データを取得中...');
    const [existingProducts, existingBrands] = await Promise.all([
      queryProducts(),
      queryBrands(),
    ]);
    console.log(`  商品: ${existingProducts.length}件`);
    console.log(`  ブランド: ${existingBrands.length}件\n`);

    // 同期実行
    const stats = await syncProducts(
      searchResult.products,
      existingProducts,
      existingBrands,
      dryRun
    );

    // 結果表示
    console.log('\n📊 同期結果:');
    console.log(`  ✨ 新規作成: ${stats.created}件`);
    console.log(`  🔄 更新: ${stats.updated}件`);
    console.log(`  ⏭️  スキップ: ${stats.skipped}件`);
    console.log(`  ❌ エラー: ${stats.errors}件`);

    if (!dryRun) {
      console.log('\n🌐 Sanityスタジオで確認: http://localhost:3333/structure/product');
      console.log('\n💡 次のステップ:');
      console.log('  1. Sanityスタジオで各商品の成分構成を入力してください');
      console.log('  2. 1日あたりの摂取回数と1容器あたりの回数を設定してください');
      console.log('  3. 必要に応じて商品説明や画像を追加してください');
    }

  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
