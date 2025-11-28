#!/usr/bin/env node

/**
 * 重複商品検出スクリプト
 *
 * Sanity内の重複商品を検出し、マージ候補をリストアップします。
 *
 * 検出方法:
 * 1. JANコードが同じ商品 → 確実に同一商品
 * 2. 商品名の正規化版が同一 → 高確率で同一商品
 * 3. ブランド名＋主要キーワードが一致 → 同一商品の可能性あり
 *
 * 使い方:
 *   node scripts/detect-duplicate-products.mjs
 *   node scripts/detect-duplicate-products.mjs --json  # JSON形式で出力
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

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

/**
 * 商品名を正規化（重複検出用）
 *
 * 目的: 楽天とYahoo!で微妙に異なる商品名を同一化
 */
function normalizeProductName(name) {
  if (!name) return '';

  let normalized = name
    // 括弧内の情報を除去
    .replace(/【[^】]*】/g, '')
    .replace(/＼[^／]*／/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/《[^》]*》/g, '')
    .replace(/「[^」]*」/g, '')
    // プロモーション文字列除去
    .replace(/送料無料/g, '')
    .replace(/ポイント[0-9０-９]+倍/g, '')
    .replace(/[0-9０-９]+円?OFF/g, '')
    .replace(/クーポン/g, '')
    .replace(/メール便/g, '')
    .replace(/ネコポス/g, '')
    .replace(/あす楽/g, '')
    .replace(/即納/g, '')
    .replace(/在庫あり/g, '')
    // 記号を空白に変換
    .replace(/[＼\\\/◆●★■▲▼◎○☆※]/g, ' ')
    // 全角英数を半角に
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    // 連続する空白を単一に
    .replace(/\s+/g, ' ')
    // 小文字化
    .toLowerCase()
    .trim();

  return normalized;
}

/**
 * 商品名からキー情報を抽出（重複判定用）
 */
function extractProductKey(name) {
  if (!name) return null;

  const normalized = normalizeProductName(name);

  // ブランド名候補を抽出（最初の単語）
  const words = normalized.split(/[\s\-\/]+/).filter(w => w.length > 1);
  const brand = words[0] || '';

  // 商品の特徴キーワードを抽出
  const features = [];

  // 日数表記 (例: 60日分, 30日)
  const daysMatch = normalized.match(/(\d+)\s*日/);
  if (daysMatch) features.push(`${daysMatch[1]}日`);

  // 粒数表記 (例: 120粒, 60錠)
  const pillsMatch = normalized.match(/(\d+)\s*[粒錠カプセル]/);
  if (pillsMatch) features.push(`${pillsMatch[1]}粒`);

  // mg表記 (例: 1000mg)
  const mgMatch = normalized.match(/(\d+)\s*mg/);
  if (mgMatch) features.push(`${mgMatch[1]}mg`);

  // 主要成分キーワード
  const ingredients = [
    'ビタミンc', 'ビタミンd', 'ビタミンe', 'ビタミンb',
    'vitamin c', 'vitamin d', 'vitamin e', 'vitamin b',
    'マルチビタミン', 'マルチミネラル',
    'カルシウム', 'マグネシウム', '亜鉛', '鉄',
    'dha', 'epa', 'オメガ3', 'オメガ-3', 'omega3', 'omega-3',
    'コラーゲン', 'プロテイン', 'protein',
    'ルテイン', 'ブルーベリー', 'アスタキサンチン',
    '葉酸', '乳酸菌', 'ビフィズス菌',
    'グルコサミン', 'コンドロイチン',
  ];

  for (const ing of ingredients) {
    if (normalized.includes(ing)) {
      features.push(ing);
    }
  }

  return {
    brand,
    features: features.sort(),
    normalized,
  };
}

/**
 * 2つの商品が同一かどうかを判定
 */
function areSameProducts(p1, p2) {
  // JANコードが両方あって一致 → 確実に同一
  if (p1.janCode && p2.janCode && p1.janCode === p2.janCode) {
    return { isSame: true, confidence: 'high', reason: 'JANコード一致' };
  }

  const key1 = extractProductKey(p1.name);
  const key2 = extractProductKey(p2.name);

  if (!key1 || !key2) return { isSame: false, confidence: 'low', reason: '判定不能' };

  // 正規化商品名が完全一致
  if (key1.normalized === key2.normalized) {
    return { isSame: true, confidence: 'high', reason: '正規化商品名一致' };
  }

  // ブランドが同じで特徴が一致
  if (key1.brand === key2.brand && key1.brand.length >= 2) {
    const features1 = key1.features.join(',');
    const features2 = key2.features.join(',');

    if (features1 === features2 && features1.length > 0) {
      return { isSame: true, confidence: 'medium', reason: `ブランド+特徴一致: ${key1.brand}` };
    }

    // 特徴の重複が多い場合
    const commonFeatures = key1.features.filter(f => key2.features.includes(f));
    if (commonFeatures.length >= 2 && commonFeatures.length >= key1.features.length * 0.7) {
      return { isSame: true, confidence: 'medium', reason: `ブランド+特徴類似: ${key1.brand}` };
    }
  }

  // 編集距離（レーベンシュタイン距離）で類似度判定
  const similarity = calculateSimilarity(key1.normalized, key2.normalized);
  if (similarity > 0.85) {
    return { isSame: true, confidence: 'medium', reason: `商品名類似度: ${(similarity * 100).toFixed(1)}%` };
  }

  return { isSame: false, confidence: 'low', reason: '異なる商品' };
}

/**
 * 文字列の類似度を計算（ジャカード係数）
 */
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;

  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 1));
  const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 1));

  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Sanityから全商品を取得
 */
async function fetchAllProducts() {
  const query = `*[_type == "product"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    source,
    janCode,
    itemCode,
    identifiers,
    priceData,
    priceJPY,
    brand->{name}
  }`;

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_API_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }

  const data = await response.json();
  return data.result || [];
}

/**
 * 重複グループを検出
 */
function detectDuplicateGroups(products) {
  const groups = [];
  const processed = new Set();

  for (let i = 0; i < products.length; i++) {
    if (processed.has(products[i]._id)) continue;

    const group = {
      primary: products[i],
      duplicates: [],
      reasons: [],
    };

    for (let j = i + 1; j < products.length; j++) {
      if (processed.has(products[j]._id)) continue;

      const result = areSameProducts(products[i], products[j]);

      if (result.isSame) {
        group.duplicates.push(products[j]);
        group.reasons.push(result.reason);
        processed.add(products[j]._id);
      }
    }

    if (group.duplicates.length > 0) {
      processed.add(products[i]._id);
      groups.push(group);
    }
  }

  return groups;
}

/**
 * 重複グループの中からマスター商品を選定
 *
 * 優先順位:
 * 1. priceDataが最も多い（複数EC価格がある）
 * 2. JANコードがある
 * 3. 古い商品（先に登録された）
 */
function selectMasterProduct(group) {
  const allProducts = [group.primary, ...group.duplicates];

  // スコアリング
  const scored = allProducts.map(p => {
    let score = 0;

    // priceDataの数
    const priceCount = Array.isArray(p.priceData) ? p.priceData.length : 0;
    score += priceCount * 10;

    // JANコードの有無
    if (p.janCode) score += 5;

    // IDの古さ（ID順で判定）
    // product-rakuten-xxx より product-yahoo-xxx の方が新しいとは限らない

    return { product: p, score };
  });

  // スコア降順でソート
  scored.sort((a, b) => b.score - a.score);

  return scored[0].product;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');

  console.log('🔍 重複商品検出スクリプト\n');

  try {
    // 全商品取得
    console.log('📥 Sanityから商品データを取得中...');
    const products = await fetchAllProducts();
    console.log(`  取得: ${products.length}件\n`);

    // 重複検出
    console.log('🔍 重複商品を検出中...');
    const duplicateGroups = detectDuplicateGroups(products);
    console.log(`  重複グループ: ${duplicateGroups.length}件\n`);

    if (duplicateGroups.length === 0) {
      console.log('✅ 重複商品は検出されませんでした');
      return;
    }

    // 結果の整形
    const results = duplicateGroups.map((group, index) => {
      const master = selectMasterProduct(group);
      const allProducts = [group.primary, ...group.duplicates];
      const toDelete = allProducts.filter(p => p._id !== master._id);

      return {
        groupId: index + 1,
        master: {
          _id: master._id,
          name: master.name,
          slug: master.slug,
          source: master.source,
          janCode: master.janCode,
          priceDataCount: Array.isArray(master.priceData) ? master.priceData.length : 0,
        },
        duplicates: toDelete.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          source: p.source,
          janCode: p.janCode,
          priceDataCount: Array.isArray(p.priceData) ? p.priceData.length : 0,
        })),
        reasons: [...new Set(group.reasons)],
        pricesToMerge: toDelete.flatMap(p => Array.isArray(p.priceData) ? p.priceData : []),
      };
    });

    if (jsonOutput) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    // 人間が読める形式で出力
    console.log('━'.repeat(80));
    console.log('📋 重複商品一覧\n');

    for (const result of results) {
      console.log(`\n【グループ ${result.groupId}】`);
      console.log(`  理由: ${result.reasons.join(', ')}`);
      console.log(`\n  🏆 マスター商品:`);
      console.log(`     ID: ${result.master._id}`);
      console.log(`     名前: ${result.master.name.substring(0, 60)}...`);
      console.log(`     Slug: ${result.master.slug}`);
      console.log(`     ソース: ${result.master.source || 'N/A'}`);
      console.log(`     JANコード: ${result.master.janCode || 'なし'}`);
      console.log(`     価格データ数: ${result.master.priceDataCount}`);

      console.log(`\n  🗑️  削除予定の重複商品 (${result.duplicates.length}件):`);
      for (const dup of result.duplicates) {
        console.log(`     - ID: ${dup._id}`);
        console.log(`       名前: ${dup.name.substring(0, 50)}...`);
        console.log(`       Slug: ${dup.slug}`);
        console.log(`       ソース: ${dup.source || 'N/A'}`);
        console.log(`       価格データ数: ${dup.priceDataCount}`);
      }

      if (result.pricesToMerge.length > 0) {
        console.log(`\n  📊 マージする価格データ: ${result.pricesToMerge.length}件`);
      }

      console.log('─'.repeat(80));
    }

    // サマリー
    const totalDuplicates = results.reduce((sum, r) => sum + r.duplicates.length, 0);
    const totalPricesToMerge = results.reduce((sum, r) => sum + r.pricesToMerge.length, 0);

    console.log('\n📊 サマリー:');
    console.log(`  重複グループ数: ${results.length}`);
    console.log(`  重複商品数: ${totalDuplicates}`);
    console.log(`  マージ対象価格データ数: ${totalPricesToMerge}`);
    console.log(`\n💡 次のステップ:`);
    console.log('  node scripts/merge-duplicate-products.mjs --dry-run');
    console.log('  node scripts/merge-duplicate-products.mjs');

  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
