#!/usr/bin/env node

/**
 * 複数ECサイト価格比較スクリプト
 *
 * 楽天・Yahoo!・Amazon等の複数ECサイトから商品を検索し、価格比較を行います。
 *
 * 使い方:
 *   node scripts/compare-prices.mjs <keyword> [options]
 *
 * オプション:
 *   --limit <number>    各サイトから取得する商品数（デフォルト: 10）
 *   --sources <list>    比較対象（rakuten,yahoo,amazon）デフォルト: rakuten,yahoo
 *   --threshold <num>   商品名の類似度しきい値（0-1、デフォルト: 0.7）
 *   --json              JSON形式で出力
 *
 * 例:
 *   node scripts/compare-prices.mjs "ビタミンC"
 *   node scripts/compare-prices.mjs "プロテイン" --limit 20
 *   node scripts/compare-prices.mjs "亜鉛" --sources rakuten,yahoo --threshold 0.8
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const RAKUTEN_APPLICATION_ID = envContent.match(/RAKUTEN_APPLICATION_ID=(.+)/)?.[1]?.trim();
const RAKUTEN_AFFILIATE_ID = envContent.match(/RAKUTEN_AFFILIATE_ID=(.+)/)?.[1]?.trim();
const YAHOO_CLIENT_ID = envContent.match(/YAHOO_SHOPPING_CLIENT_ID=(.+)/)?.[1]?.trim();
const YAHOO_AFFILIATE_ID = envContent.match(/YAHOO_AFFILIATE_ID=(.+)/)?.[1]?.trim();

// RakutenAdapter（簡易版）
class RakutenAdapter {
  constructor(applicationId, affiliateId) {
    this.applicationId = applicationId;
    this.affiliateId = affiliateId;
    this.baseUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';
  }

  async search(keyword, options = {}) {
    const { limit = 10 } = options;

    const params = new URLSearchParams({
      applicationId: this.applicationId,
      keyword,
      hits: Math.min(limit, 30).toString(),
      sort: 'standard',
      ...(this.affiliateId && { affiliateId: this.affiliateId }),
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Rakuten API Error: ${response.status}`);
    }

    const data = await response.json();
    return (data.Items || []).map(item => ({
      source: 'rakuten',
      id: item.Item.itemCode,
      name: item.Item.itemName,
      price: item.Item.itemPrice,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls?.[0]?.imageUrl,
      brand: item.Item.shopName,
      rating: item.Item.reviewAverage,
      reviewCount: item.Item.reviewCount,
    }));
  }
}

// YahooAdapter（簡易版）
class YahooAdapter {
  constructor(clientId, affiliateId) {
    this.clientId = clientId;
    this.affiliateId = affiliateId;
    this.baseUrl = 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch';
  }

  async search(keyword, options = {}) {
    const { limit = 10 } = options;

    const params = new URLSearchParams({
      appid: this.clientId,
      query: keyword,
      hits: Math.min(limit, 100).toString(),
      sort: '-score',
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Yahoo API Error: ${response.status}`);
    }

    const data = await response.json();
    return (data.hits || []).map(item => ({
      source: 'yahoo',
      id: item.code,
      name: item.name,
      price: item.price,
      url: this.affiliateId
        ? `${this.affiliateId}${encodeURIComponent(item.url)}`
        : item.url,
      imageUrl: item.image?.medium,
      brand: item.store?.name,
      rating: item.review?.rate,
      reviewCount: item.review?.count,
    }));
  }
}

/**
 * 文字列の類似度を計算（Levenshtein距離ベース）
 */
function calculateSimilarity(str1, str2) {
  // 正規化：小文字化、記号除去、空白除去
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[（）()【】\[\]「」『』、。,.\s]/g, '')
      .replace(/\d+/g, ''); // 数字も除去

  const s1 = normalize(str1);
  const s2 = normalize(str2);

  // Levenshtein距離
  const matrix = Array.from({ length: s1.length + 1 }, (_, i) =>
    Array.from({ length: s2.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // 削除
        matrix[i][j - 1] + 1, // 挿入
        matrix[i - 1][j - 1] + cost // 置換
      );
    }
  }

  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

/**
 * 商品をマッチング
 */
function matchProducts(rakutenProducts, yahooProducts, threshold = 0.7) {
  const matches = [];
  const matched = new Set();

  for (const rakutenProduct of rakutenProducts) {
    let bestMatch = null;
    let bestSimilarity = 0;

    for (let i = 0; i < yahooProducts.length; i++) {
      if (matched.has(i)) continue;

      const yahooProduct = yahooProducts[i];
      const similarity = calculateSimilarity(rakutenProduct.name, yahooProduct.name);

      if (similarity > bestSimilarity && similarity >= threshold) {
        bestSimilarity = similarity;
        bestMatch = { product: yahooProduct, index: i };
      }
    }

    if (bestMatch) {
      matched.add(bestMatch.index);
      matches.push({
        name: rakutenProduct.name,
        similarity: bestSimilarity,
        rakuten: rakutenProduct,
        yahoo: bestMatch.product,
        cheapest:
          rakutenProduct.price < bestMatch.product.price ? 'rakuten' : 'yahoo',
        priceDiff: Math.abs(rakutenProduct.price - bestMatch.product.price),
      });
    }
  }

  return matches;
}

/**
 * 結果を表示
 */
function displayResults(matches, jsonOutput = false) {
  if (jsonOutput) {
    console.log(JSON.stringify(matches, null, 2));
    return;
  }

  console.log(`\n📊 価格比較結果: ${matches.length}件のマッチング\n`);

  matches
    .sort((a, b) => b.priceDiff - a.priceDiff)
    .forEach((match, index) => {
      console.log(`${index + 1}. ${match.name.substring(0, 60)}...`);
      console.log(`   類似度: ${(match.similarity * 100).toFixed(1)}%`);
      console.log(
        `   楽天: ¥${match.rakuten.price.toLocaleString()} ${match.cheapest === 'rakuten' ? '🏆 最安値' : ''}`
      );
      console.log(
        `   Yahoo: ¥${match.yahoo.price.toLocaleString()} ${match.cheapest === 'yahoo' ? '🏆 最安値' : ''}`
      );
      console.log(`   価格差: ¥${match.priceDiff.toLocaleString()}`);
      console.log('');
    });

  // 統計情報
  const rakutenCheaper = matches.filter(m => m.cheapest === 'rakuten').length;
  const yahooCheaper = matches.filter(m => m.cheapest === 'yahoo').length;
  const avgPriceDiff =
    matches.reduce((sum, m) => sum + m.priceDiff, 0) / matches.length;

  console.log('📈 統計:');
  console.log(`  楽天が安い: ${rakutenCheaper}件`);
  console.log(`  Yahoo!が安い: ${yahooCheaper}件`);
  console.log(`  平均価格差: ¥${Math.round(avgPriceDiff).toLocaleString()}`);
}

// メイン処理
async function main() {
  const args = process.argv.slice(2);
  const keyword = args.find(arg => !arg.startsWith('--'));
  const limit = parseInt(
    args.find(arg => arg.startsWith('--limit'))?.split('=')[1] || '10'
  );
  const sources = (
    args.find(arg => arg.startsWith('--sources'))?.split('=')[1] || 'rakuten,yahoo'
  ).split(',');
  const threshold = parseFloat(
    args.find(arg => arg.startsWith('--threshold'))?.split('=')[1] || '0.7'
  );
  const jsonOutput = args.includes('--json');

  if (!keyword) {
    console.error('❌ 検索キーワードを指定してください');
    console.log('\n使い方:');
    console.log('  node scripts/compare-prices.mjs <keyword> [options]');
    process.exit(1);
  }

  if (!jsonOutput) {
    console.log('🚀 複数ECサイト価格比較\n');
    console.log(`  キーワード: ${keyword}`);
    console.log(`  取得件数: ${limit}件/サイト`);
    console.log(`  比較対象: ${sources.join(', ')}`);
    console.log(`  類似度しきい値: ${threshold}\n`);
  }

  try {
    const results = {};

    // 楽天から検索
    if (sources.includes('rakuten') && RAKUTEN_APPLICATION_ID) {
      if (!jsonOutput) console.log('🔍 楽天市場で検索中...');
      const rakuten = new RakutenAdapter(RAKUTEN_APPLICATION_ID, RAKUTEN_AFFILIATE_ID);
      results.rakuten = await rakuten.search(keyword, { limit });
      if (!jsonOutput)
        console.log(`✅ 楽天: ${results.rakuten.length}件取得\n`);
    }

    // Yahoo!から検索
    if (sources.includes('yahoo') && YAHOO_CLIENT_ID) {
      if (!jsonOutput) console.log('🔍 Yahoo!ショッピングで検索中...');
      const yahoo = new YahooAdapter(YAHOO_CLIENT_ID, YAHOO_AFFILIATE_ID);
      results.yahoo = await yahoo.search(keyword, { limit });
      if (!jsonOutput) console.log(`✅ Yahoo!: ${results.yahoo.length}件取得\n`);
    }

    // 商品マッチング＆価格比較
    if (results.rakuten && results.yahoo) {
      const matches = matchProducts(results.rakuten, results.yahoo, threshold);
      displayResults(matches, jsonOutput);
    } else {
      console.error('❌ 2つ以上のECサイトが必要です');
      process.exit(1);
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
