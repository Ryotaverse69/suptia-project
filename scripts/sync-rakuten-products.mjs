#!/usr/bin/env node

/**
 * 楽天商品同期スクリプト
 *
 * 楽天APIから商品を取得し、Sanityに同期します。
 *
 * 使い方:
 *   node scripts/sync-rakuten-products.mjs [keyword] [options]
 *
 * オプション:
 *   --limit <number>    取得する商品数（デフォルト: 30）
 *   --dry-run          実際には保存せず、取得データのみ表示
 *   --update-prices    既存商品の価格のみ更新
 *
 * 例:
 *   node scripts/sync-rakuten-products.mjs "ビタミンC" --limit 10
 *   node scripts/sync-rakuten-products.mjs "プロテイン" --dry-run
 *   node scripts/sync-rakuten-products.mjs --update-prices
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  validateProduct,
  fetchExistingProductIds,
  checkDuplicate,
  printFilterStats,
} from './lib/product-filters.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();
const RAKUTEN_APPLICATION_ID = envContent.match(/RAKUTEN_APPLICATION_ID=(.+)/)?.[1]?.trim();
const RAKUTEN_AFFILIATE_ID = envContent.match(/RAKUTEN_AFFILIATE_ID=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

if (!RAKUTEN_APPLICATION_ID) {
  console.error('❌ RAKUTEN_APPLICATION_ID が見つかりません');
  console.log('💡 .env.local に楽天APIの認証情報を追加してください');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-03';
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data`;

// ブランド抽出ユーティリティ
/**
 * 商品名からブランド名を抽出
 */
function extractBrandFromProductName(productName) {
  if (!productName) return '';

  // 1. 括弧内の情報を除去（【】、()、[]、<>、＼/、◆、●、★など）
  let cleaned = productName
    .replace(/【[^】]*】/g, '') // 【送料無料】など
    .replace(/＼[^／]*／/g, '') // ＼ポイント5倍／など
    .replace(/\([^)]*\)/g, '') // (公式)など
    .replace(/\[[^\]]*\]/g, '') // [限定]など
    .replace(/<[^>]*>/g, '') // <新商品>など
    .replace(/◆[^◆]*◆/g, '') // ◆マーク囲み
    .replace(/●[^●]*●/g, '') // ●マーク囲み
    .replace(/★[^★]*★/g, '') // ★マーク囲み
    .replace(/^[＼◆●★■▲▼◎○☆※]/g, '') // プロモーション記号を先頭から削除
    .trim();

  // 2. 最初の単語を抽出（空白、全角空白、スラッシュ、ハイフンで区切り）
  const firstWord = cleaned.split(/[\s　/\-]/)[0].trim();

  // 3. ノイズ除去（一般的な接頭辞・サプリメント用語・プロモーション文言）
  const noisePatterns = [
    /^サプリメント$/i,
    /^サプリ$/i,
    /^supplement$/i,
    /^健康食品$/i,
    /^栄養補助食品$/i,
    /^送料無料$/i,
    /^公式$/i,
    /^正規品$/i,
    /^新品$/i,
    /ポイント[0-9０-９]+倍/i, // ポイント倍率
    /[0-9０-９]+%?OFF/i, // 割引率
    /クーポン/i,
    /タイムセール/i,
    /限定/i,
    /個セット/i,
    /まとめ買い/i,
    /メール便/i,
    /ネコポス/i,
    /ポスト投函/i,
    /定期便/i,
    /選べる/i,
    /ふるさと納税/i,
    /エントリーで/i,
    /POINT/i,
    /^第[0-9０-９]+類医薬品$/i,
  ];

  for (const pattern of noisePatterns) {
    if (pattern.test(firstWord)) {
      return '';
    }
  }

  // 4. 最小文字数チェック（1文字のブランド名は除外）
  if (firstWord.length < 2) {
    return '';
  }

  // 5. プロモーション文字列チェック（記号を含むものは除外）
  if (/[＼\\\/◆●★■▲▼◎○☆※【】（）《》「」]/.test(firstWord)) {
    return '';
  }

  return firstWord;
}

/**
 * 商品名から識別キーを生成（重複検出用）
 * ブランド名が商品名の任意位置にあっても検出可能
 */
function generateProductKeyFromName(name) {
  if (!name) return null;

  // ブランド名を正規化（商品名の任意位置から検出）
  const brandPatterns = [
    [/(DHC|ディーエイチシー)/i, 'dhc'],
    [/(ディアナチュラ|Dear-?Natura)/i, 'dear-natura'],
    [/(ネイチャーメイド|Nature Made)/i, 'nature-made'],
    [/(FANCL|ファンケル)/i, 'fancl'],
    [/(小林製薬)/i, 'kobayashi'],
    [/(大塚製薬)/i, 'otsuka'],
    [/(アサヒ)/i, 'asahi'],
    [/(UHA味覚糖)/i, 'uha'],
    [/(NOW Foods|ナウフーズ)/i, 'now-foods'],
  ];

  let brand = '';
  for (const [pattern, brandKey] of brandPatterns) {
    if (pattern.test(name)) {
      brand = brandKey;
      break;
    }
  }

  // 日数を抽出
  const daysMatch = name.match(/(\d+)\s*日\s*分?/);
  const days = daysMatch ? parseInt(daysMatch[1], 10) : null;

  // 主要成分を抽出
  const ingredients = [];
  const ingredientPatterns = [
    /マルチビタミン/gi,
    /ビタミン\s*[A-Za-zａ-ｚ]+\d*/gi,
    /カルシウム/gi,
    /マグネシウム/gi,
    /亜鉛/gi,
    /鉄/gi,
    /葉酸/gi,
    /DHA/gi,
    /EPA/gi,
    /コラーゲン/gi,
    /グルコサミン/gi,
    /ルテイン/gi,
    /乳酸菌/gi,
  ];

  for (const pattern of ingredientPatterns) {
    const matches = name.match(pattern);
    if (matches) {
      for (const match of matches) {
        ingredients.push(match.toLowerCase().replace(/\s+/g, ''));
      }
    }
  }

  // セット数を抽出
  const setPatterns = [
    /(\d+)\s*(個|袋|本|箱|コ)\s*セット/i,
    /×\s*(\d+)\s*(袋|本|個|箱)/i,
  ];
  let setCount = 1;
  for (const pattern of setPatterns) {
    const match = name.match(pattern);
    if (match) {
      setCount = parseInt(match[1], 10);
      if (setCount > 1) break;
    }
  }

  if (!brand) return null;

  const sortedIngredients = [...new Set(ingredients)].sort();
  const mainIngredient = sortedIngredients[0] || 'unknown';

  return {
    brand,
    days,
    mainIngredient,
    setCount,
    key: `${brand}-${mainIngredient}-${days || 'x'}-${setCount}`,
  };
}

// RakutenAdapter（簡易版 - 本番ではlib/ec-adaptersを使用）
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

    console.log(`🔍 楽天APIで検索中: "${keyword}"...`);
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
    // 楽天APIの画像URLから高解像度版を取得
    // mediumImageUrlsには ?_ex=128x128 のようなサイズ指定がついているので削除
    let imageUrl = null;
    if (item.mediumImageUrls && item.mediumImageUrls.length > 0) {
      const originalUrl = item.mediumImageUrls[0].imageUrl;
      // ?_ex=128x128 などのクエリパラメータを削除してフルサイズ画像を取得
      imageUrl = originalUrl.split('?')[0];
    }

    // itemCaptionからJANコードを抽出
    const janCode = this.extractJanCode(item.itemCaption);

    // 商品名からブランド名（発売元・メーカー）を抽出
    const brandName = extractBrandFromProductName(item.itemName);

    return {
      id: item.itemCode,
      name: item.itemName,
      price: item.itemPrice,
      currency: 'JPY',
      url: item.itemUrl,
      affiliateUrl: item.affiliateUrl,
      imageUrl,
      brand: brandName, // 商品名から抽出したブランド名（発売元）
      shopName: item.shopName, // 楽天市場内の店舗名（販売元）
      rating: item.reviewAverage,
      reviewCount: item.reviewCount,
      source: 'rakuten',
      description: item.itemCaption,
      inStock: item.availability === 1,
      identifiers: {
        rakutenItemCode: item.itemCode,
        ...(janCode && { jan: janCode }),
      },
    };
  }

  /**
   * 商品説明文からJANコードを抽出
   *
   * @param {string} caption 商品説明文
   * @returns {string|undefined} JANコード（8桁または13桁）
   */
  extractJanCode(caption) {
    if (!caption) return undefined;

    // JANコードのパターン: 8桁または13桁の数字
    const patterns = [
      /JAN\s*コード\s*[:：]\s*(\d{8,13})/i,
      /JAN\s*[:：]\s*(\d{8,13})/i,
      /JAN\s+(\d{8,13})/i,
      /JAN\s*コード\s+(\d{8,13})/i,
    ];

    for (const pattern of patterns) {
      const match = caption.match(pattern);
      if (match && match[1]) {
        const code = match[1];
        // 8桁または13桁のみ許可
        if (code.length === 8 || code.length === 13) {
          return code;
        }
      }
    }

    return undefined;
  }

  /**
   * 商品名からセット数量を検出（高度化版）
   *
   * @param {string} productName 商品名
   * @returns {number} セット数量（単品の場合は1）
   */
  extractQuantity(productName) {
    // パターン1: "90粒×3袋", "120錠×2本" (複雑セット表記)
    const complexSetPattern = /\d+[粒錠カプセル]+[×*xX](\d+)[個袋本缶箱パック]/;
    const complexMatch = productName.match(complexSetPattern);
    if (complexMatch) {
      return parseInt(complexMatch[1], 10);
    }

    // パターン2: "120粒/2袋" (スラッシュ区切り)
    const slashPattern = /\d+[粒錠カプセル]+\/(\d+)[個袋本缶箱パック]/;
    const slashMatch = productName.match(slashPattern);
    if (slashMatch) {
      return parseInt(slashMatch[1], 10);
    }

    // パターン3: "30日分×3箱", "3ヶ月分×2袋" (期間ベースセット)
    const durationSetPattern = /\d+[ヶ日週月]+分[×*xX](\d+)[個袋本缶箱パック]/;
    const durationMatch = productName.match(durationSetPattern);
    if (durationMatch) {
      return parseInt(durationMatch[1], 10);
    }

    // パターン4: "まとめ買い3個", "お得な5個セット" (まとめ買い表記)
    const bulkPattern = /(?:まとめ買い|お得な|大容量)(\d+)[個袋本缶箱パック]/;
    const bulkMatch = productName.match(bulkPattern);
    if (bulkMatch) {
      return parseInt(bulkMatch[1], 10);
    }

    // パターン5: "3個セット", "3袋セット", "3本セット" (基本セット表記)
    const setPattern = /(\d+)(個|袋|本|缶|箱|パック)セット/;
    const setMatch = productName.match(setPattern);
    if (setMatch) {
      return parseInt(setMatch[1], 10);
    }

    // パターン6: "×3袋", "*3袋", "x3袋" (倍率表記)
    const multiplyPattern = /[×*xX](\d+)(個|袋|本|缶|箱|パック)/;
    const multiplyMatch = productName.match(multiplyPattern);
    if (multiplyMatch) {
      return parseInt(multiplyMatch[1], 10);
    }

    // パターン7: "(3袋)", "【3袋】" (括弧表記)
    const bracketPattern = /[（(【](\d+)(個|袋|本|缶|箱|パック)[）)】]/;
    const bracketMatch = productName.match(bracketPattern);
    if (bracketMatch) {
      return parseInt(bracketMatch[1], 10);
    }

    // デフォルト: 単品として扱う
    return 1;
  }
}

// Sanity操作
async function queryProducts() {
  const query = encodeURIComponent('*[_type == "product"]{ _id, name, janCode, identifiers, priceData }');
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
      // 既存商品チェック（複数の方法で照合）
      let existing = null;

      // 1. JANコード照合（最も信頼性が高い）
      if (product.identifiers.jan) {
        existing = existingProducts.find(
          p => p.janCode === product.identifiers.jan || p.identifiers?.jan === product.identifiers.jan
        );
      }

      // 2. 楽天商品コード照合
      if (!existing) {
        existing = existingProducts.find(
          p => p.identifiers?.rakutenItemCode === product.identifiers.rakutenItemCode
        );
      }

      // 3. 商品名ベースの重複チェック（ブランド+成分+日数）
      if (!existing) {
        const productKey = generateProductKeyFromName(product.name);
        if (productKey) {
          existing = existingProducts.find(p => {
            const existingKey = generateProductKeyFromName(p.name);
            return existingKey && existingKey.key === productKey.key;
          });
          if (existing) {
            console.log(`    💡 商品名ベースで既存商品を検出: ${productKey.key}`);
          }
        }
      }

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

      const productId = existing?._id || `product-rakuten-${product.id.replace(/[^a-z0-9]+/g, '-')}`;

      // 価格データ
      // セット数量検出（商品名から自動判定）
      const quantity = this.extractQuantity(product.name);
      const unitPrice = quantity > 1 ? Math.round(product.price / quantity) : product.price;

      // 送料とポイント還元率（楽天のデフォルト値）
      const shippingFee = product.price >= 3980 ? 0 : 500; // ¥3,980以上で送料無料
      const pointRate = 0.05; // 楽天SPU 5%と仮定

      // 在庫状況
      const stockStatus = product.inStock ? 'in_stock' : 'out_of_stock';

      const priceData = {
        source: 'rakuten',
        storeName: product.shopName, // 楽天市場内の店舗名（販売元）
        shopName: product.shopName, // 後方互換性のため保持
        productName: product.name, // 商品名（セット数量検出用）
        itemCode: product.identifiers.rakutenItemCode, // 商品コード
        amount: product.price,
        currency: 'JPY',
        url: product.affiliateUrl || product.url,
        fetchedAt: new Date().toISOString(),
        confidence: 1.0,
        quantity: quantity, // セット数量
        unitPrice: unitPrice, // 単位価格
        shippingFee: shippingFee, // 送料
        pointRate: pointRate, // ポイント還元率
        stockStatus: stockStatus, // 在庫状況
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
        source: 'rakuten', // 取得元ECサイト
        itemCode: product.identifiers.rakutenItemCode, // EC商品コード
        affiliateUrl: product.affiliateUrl || product.url, // アフィリエイトURL
        ...(product.identifiers.jan && {
          janCode: product.identifiers.jan, // JANコード（ショートカット）
        }),
        identifiers: {
          rakutenItemCode: product.identifiers.rakutenItemCode,
          ...(product.identifiers.jan && { jan: product.identifiers.jan }),
        },
        urls: {
          rakuten: product.affiliateUrl || product.url,
        },
        priceJPY: product.price,
        description: product.description,
        allIngredients: product.description, // 成分量抽出スクリプト用（itemCaptionから取得）
        availability: product.inStock ? 'in-stock' : 'out-of-stock',
        reviewStats: {
          averageRating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
        },
        priceData: [priceData],
        // 外部画像URL（楽天APIから取得）
        ...(product.imageUrl && {
          externalImageUrl: product.imageUrl,
        }),
        // 以下は手動入力が必要
        ingredients: [], // Sanityで手動入力
        servingsPerDay: 1, // デフォルト値
        servingsPerContainer: 30, // デフォルト値
      };

      if (existing) {
        // 既存商品は価格データと価格履歴を更新
        console.log(`  🔄 更新: ${product.name.substring(0, 50)}...`);

        // 既存のpriceDataから楽天のエントリを全て削除（shopNameやstoreNameの不一致を考慮）
        let existingPriceData = existing.priceData || [];

        // priceDataがオブジェクト形式の場合は配列に正規化
        if (!Array.isArray(existingPriceData)) {
          existingPriceData = [];
        }

        const filteredPriceData = existingPriceData.filter(
          pd => pd.source !== 'rakuten'
        );

        // 新しいpriceDataを追加
        const updatedPriceData = [...filteredPriceData, priceData];

        // 価格履歴エントリ
        const priceHistoryEntry = {
          source: 'rakuten',
          shopName: product.shopName, // 楽天市場内の店舗名（販売元）
          amount: product.price,
          recordedAt: new Date().toISOString(),
        };

        mutations.push({
          patch: {
            id: productId,
            set: {
              itemCode: product.identifiers.rakutenItemCode, // 追加: EC商品コード
              affiliateUrl: product.affiliateUrl || product.url, // 追加: アフィリエイトURL
              priceJPY: product.price,
              description: product.description, // 商品説明を更新
              allIngredients: product.description, // 成分量抽出スクリプト用
              availability: product.inStock ? 'in-stock' : 'out-of-stock',
              'reviewStats.averageRating': product.rating || 0,
              'reviewStats.reviewCount': product.reviewCount || 0,
              ...(product.imageUrl && { externalImageUrl: product.imageUrl }),
              priceData: updatedPriceData, // priceData全体を置き換え
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
        // 新規商品作成
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
  const updatePrices = args.includes('--update-prices');

  console.log('🚀 楽天商品同期スクリプト\n');
  console.log(`  検索キーワード: ${keyword}`);
  console.log(`  取得件数: ${limit}件`);
  console.log(`  モード: ${dryRun ? 'DRY RUN' : '本番実行'}\n`);

  try {
    // 楽天API初期化
    const rakuten = new RakutenAdapter(RAKUTEN_APPLICATION_ID, RAKUTEN_AFFILIATE_ID);

    // 楽天から商品取得
    const searchResult = await rakuten.search(keyword, { limit });
    console.log(`✅ ${searchResult.products.length}件の商品を取得しました\n`);

    if (searchResult.products.length === 0) {
      console.log('⚠️  商品が見つかりませんでした');
      return;
    }

    // ========================================
    // フィルタリング: 非サプリメント商品を除外
    // ========================================
    console.log('🔍 商品をフィルタリング中...');
    const validProducts = [];
    const invalidProducts = [];

    for (const product of searchResult.products) {
      const validation = validateProduct(product);

      if (validation.isValid) {
        validProducts.push(product);
        console.log(`  ✅ ${product.name.substring(0, 60)}...`);
      } else {
        invalidProducts.push({ product, reason: validation.reason });
        console.log(`  ❌ 除外: ${product.name.substring(0, 50)}... (${validation.reason})`);
      }
    }

    if (validProducts.length === 0) {
      console.log('\n⚠️  サプリメント商品が見つかりませんでした');
      console.log(`  除外された商品: ${invalidProducts.length}件`);
      return;
    }

    console.log(`\n✅ フィルタリング結果: ${validProducts.length}/${searchResult.products.length}件が有効\n`);

    // Sanityから既存データ取得
    console.log('📥 Sanityから既存データを取得中...');
    const [existingProducts, existingBrands, existingProductIds] = await Promise.all([
      queryProducts(),
      queryBrands(),
      fetchExistingProductIds(SANITY_API_TOKEN),
    ]);
    console.log(`  商品: ${existingProducts.length}件`);
    console.log(`  ブランド: ${existingBrands.length}件\n`);

    // ========================================
    // 重複チェック
    // ========================================
    console.log('🔍 重複チェック中...');
    const uniqueProducts = [];
    const duplicateProducts = [];

    for (const product of validProducts) {
      const duplicateCheck = checkDuplicate({
        itemCode: product.identifiers.rakutenItemCode,
        janCode: product.identifiers.jan,
        source: 'rakuten',
      }, existingProductIds);

      if (duplicateCheck.isDuplicate) {
        duplicateProducts.push({ product, reason: duplicateCheck.reason });
        console.log(`  ⚠️  重複: ${product.name.substring(0, 50)}... (${duplicateCheck.reason})`);
      } else {
        uniqueProducts.push(product);
      }
    }

    console.log(`\n✅ 重複チェック完了: ${uniqueProducts.length}件の新規商品、${duplicateProducts.length}件の重複\n`);

    // 同期実行（uniqueProductsのみ）
    const stats = await syncProducts(
      uniqueProducts,
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

    // フィルタリング統計
    console.log('\n📊 フィルタリング統計:');
    console.log(`  📦 取得商品数: ${searchResult.products.length}件`);
    console.log(`  ✅ 有効商品数: ${validProducts.length}件`);
    console.log(`  ❌ 除外商品数: ${invalidProducts.length}件`);
    console.log(`  ⚠️  重複商品数: ${duplicateProducts.length}件`);
    console.log(`  🎯 最終登録数: ${stats.created}件`);

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
