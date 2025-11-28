#!/usr/bin/env node

/**
 * 重複商品マージスクリプト v2
 *
 * 商品名から「基本単位」（単品）を識別し、同じ単品商品のみをマージします。
 * セット商品（2個セット、3袋セット等）は別商品として扱います。
 *
 * 使い方:
 *   node scripts/merge-duplicate-products-v2.mjs --dry-run    # 確認のみ
 *   node scripts/merge-duplicate-products-v2.mjs              # 実際にマージ
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
let SANITY_API_TOKEN;
try {
  const envPath = join(__dirname, '../apps/web/.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();
} catch {
  try {
    const mainRepoEnvPath = '/Users/ryota/VScode/suptia-project/apps/web/.env.local';
    const envContent = readFileSync(mainRepoEnvPath, 'utf8');
    SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();
  } catch {
    console.error('❌ SANITY_API_TOKEN が見つかりません');
    process.exit(1);
  }
}

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が空です');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data`;

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
    priceHistory,
    brand,
    externalImageUrl,
    description,
    allIngredients,
    ingredients,
    servingsPerDay,
    servingsPerContainer,
    availability,
    reviewStats,
    affiliateUrl,
    urls,
    scores,
    tierRatings
  }`;

  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

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
 * 商品名からセット数を抽出
 * セット商品の場合はセット数を返し、単品の場合はnullを返す
 */
function extractSetCount(name) {
  if (!name) return null;

  // セット数パターン
  const patterns = [
    /(\d+)\s*個\s*セット/i,
    /(\d+)\s*袋\s*セット/i,
    /(\d+)\s*本\s*セット/i,
    /(\d+)\s*箱\s*セット/i,
    /(\d+)\s*コ\s*セット/i,
    /×\s*(\d+)\s*セット/i,
    /\*\s*(\d+)\s*コセット/i,
    /×\s*(\d+)\s*(袋|本|個|箱)/i,
    /(\d+)\s*袋セット/i,
    /【(\d+)個セット】/i,
    /\[(\d+)個セット\]/i,
    // 追加パターン
    /(\d+)\s*粒\s*×\s*(\d+)/i,     // 例: 90粒×3
    /×\s*(\d+)\s*本/i,             // 例: ×3本
    /(\d+)\s*本$/i,                // 末尾が「N本」
    /(\d+)\s*(袋|箱)$/i,           // 末尾が「N袋」「N箱」
  ];

  for (const pattern of patterns) {
    const match = name.match(pattern);
    if (match) {
      // パターンによっては2番目のグループがセット数の場合がある
      let count;
      if (match[2] && /^\d+$/.test(match[2])) {
        count = parseInt(match[2], 10);
      } else {
        count = parseInt(match[1], 10);
      }
      if (count > 1) return count;
    }
  }

  return null;
}

/**
 * 商品名を正規化して基本的なキーを生成
 */
function normalizeProductName(name) {
  if (!name) return '';

  let normalized = name
    // HTMLエンティティをデコード
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // セット情報を除去
    .replace(/【[^】]*セット[^】]*】/g, '')
    .replace(/\[[^\]]*セット[^\]]*\]/g, '')
    .replace(/\([^)]*セット[^)]*\)/g, '')
    .replace(/×\s*\d+\s*(袋|個|本|箱|コ)?\s*(セット)?/gi, '')
    .replace(/\*\s*\d+\s*(袋|個|本|箱|コ)?\s*(セット)?/gi, '')
    .replace(/\d+\s*(袋|個|本|箱|コ)\s*セット/gi, '')
    // 送料無料等のプロモーション文字列除去
    .replace(/送料無料/g, '')
    .replace(/ポイント[0-9０-９]+倍/g, '')
    .replace(/[0-9０-９]+円?OFF/g, '')
    .replace(/クーポン/g, '')
    .replace(/メール便/g, '')
    .replace(/ネコポス/g, '')
    .replace(/あす楽/g, '')
    .replace(/即納/g, '')
    .replace(/在庫あり/g, '')
    .replace(/数量限定[！!]?/g, '')
    .replace(/最大[0-9,]+円引き/g, '')
    .replace(/エントリーで全品\d+倍/g, '')
    .replace(/賞味期限\d+年?\.?\d*以降?/g, '')
    .replace(/賞味期限\d+/g, '')
    // 括弧内の補足情報を除去（ただし粒数・日数は残す）
    .replace(/【[^】]*】/g, ' ')
    .replace(/＼[^／]*／/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/《[^》]*》/g, ' ')
    .replace(/「[^」]*」/g, ' ')
    // 記号を空白に変換
    .replace(/[＼\\\\/◆●★■▲▼◎○☆※◇□△▽]/g, ' ')
    // 全角英数を半角に
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    // 連続する空白を単一に
    .replace(/\s+/g, ' ')
    .trim();

  return normalized;
}

/**
 * 商品名から識別キーを抽出（ブランド + 商品名 + 日数/粒数）
 */
function extractProductKey(name) {
  if (!name) return null;

  const normalized = normalizeProductName(name);

  // ブランド名を抽出
  const brandPatterns = [
    /^(DHC|ディーエイチシー)/i,
    /^(ディアナチュラ|Dear-?Natura)/i,
    /^(ネイチャーメイド|Nature Made)/i,
    /^(FANCL|ファンケル)/i,
    /^(小林製薬)/i,
    /^(大塚製薬)/i,
    /^(アサヒ)/i,
    /^(UHA味覚糖)/i,
    /^(Mama Lula|ママルラ)/i,
    /^(mitete)/i,
    /^(エレビット)/i,
  ];

  let brand = '';
  for (const pattern of brandPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      brand = match[1].toLowerCase();
      break;
    }
  }

  // 日数を抽出
  const daysMatch = normalized.match(/(\d+)\s*日\s*分?/);
  const days = daysMatch ? parseInt(daysMatch[1], 10) : null;

  // 粒数を抽出
  const pillsMatch = normalized.match(/(\d+)\s*(粒|錠|カプセル)/);
  const pills = pillsMatch ? parseInt(pillsMatch[1], 10) : null;

  // 主要キーワードを抽出
  const keywords = [];

  // 成分名
  const ingredientPatterns = [
    /ビタミン\s*[A-Za-zａ-ｚ]+\d*/gi,
    /vitamin\s*[A-Za-z]+\d*/gi,
    /マルチビタミン/gi,
    /マルチミネラル/gi,
    /カルシウム/gi,
    /マグネシウム/gi,
    /亜鉛/gi,
    /鉄/gi,
    /葉酸/gi,
    /DHA/gi,
    /EPA/gi,
    /オメガ\s*-?\s*3/gi,
    /omega\s*-?\s*3/gi,
    /コラーゲン/gi,
    /プロテイン/gi,
    /ルテイン/gi,
    /ブルーベリー/gi,
    /アスタキサンチン/gi,
    /乳酸菌/gi,
    /ビフィズス菌/gi,
    /グルコサミン/gi,
    /コンドロイチン/gi,
    /ナットウキナーゼ/gi,
    /持続型/gi,
    /ハードカプセル/gi,
    /マカ/gi,
    /イソフラボン/gi,
    /コエンザイム/gi,
  ];

  for (const pattern of ingredientPatterns) {
    const matches = normalized.match(pattern);
    if (matches) {
      for (const match of matches) {
        keywords.push(match.toLowerCase().replace(/\s+/g, ''));
      }
    }
  }

  // キーを生成
  const key = {
    brand,
    days,
    pills,
    keywords: [...new Set(keywords)].sort(),
    normalized,
  };

  return key;
}

/**
 * 商品名から年齢・性別ターゲットを抽出
 */
function extractTargetAudience(name) {
  if (!name) return null;

  // 年齢ターゲット
  const ageMatch = name.match(/(\d+)代/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : null;

  // 性別ターゲット
  let gender = null;
  if (/女性|レディース|ウーマン/i.test(name)) {
    gender = 'female';
  } else if (/男性|メンズ|マン/i.test(name)) {
    gender = 'male';
  }

  return { age, gender };
}

/**
 * 2つの商品が同一かどうかを判定
 */
function areSameProducts(p1, p2) {
  // セット商品は除外
  const set1 = extractSetCount(p1.name);
  const set2 = extractSetCount(p2.name);

  if (set1 !== null || set2 !== null) {
    // 両方がセット商品でセット数が同じならマージ可能
    if (set1 === set2 && set1 !== null) {
      // セット数が同じ場合は続行
    } else {
      return { isSame: false, reason: 'セット数が異なる' };
    }
  }

  // 商品キーを抽出
  const key1 = extractProductKey(p1.name);
  const key2 = extractProductKey(p2.name);

  if (!key1 || !key2) {
    return { isSame: false, reason: '商品キー抽出失敗' };
  }

  // 日数が両方あって異なれば別商品（これを最優先でチェック）
  if (key1.days && key2.days && key1.days !== key2.days) {
    return { isSame: false, reason: '日数不一致' };
  }

  // 粒数が両方あって大きく異なれば別商品（10%以上の差）
  if (key1.pills && key2.pills) {
    const diff = Math.abs(key1.pills - key2.pills);
    const avg = (key1.pills + key2.pills) / 2;
    if (diff / avg > 0.1) {
      return { isSame: false, reason: '粒数不一致' };
    }
  }

  // 年齢・性別ターゲットが異なれば別商品
  const target1 = extractTargetAudience(p1.name);
  const target2 = extractTargetAudience(p2.name);

  if (target1.age && target2.age && target1.age !== target2.age) {
    return { isSame: false, reason: '対象年齢不一致' };
  }

  if (target1.gender && target2.gender && target1.gender !== target2.gender) {
    return { isSame: false, reason: '対象性別不一致' };
  }

  // JANコードが両方あって一致 → 同一の可能性が高い
  // ただし、上記のチェックで日数・粒数・ターゲットが一致していることが前提
  if (p1.janCode && p2.janCode) {
    if (p1.janCode === p2.janCode) {
      return { isSame: true, confidence: 'high', reason: 'JANコード一致' };
    }
    // JANコードが両方あるが異なる → 別商品
    return { isSame: false, reason: 'JANコード不一致' };
  }

  // ブランドが異なれば別商品
  if (key1.brand && key2.brand && key1.brand !== key2.brand) {
    return { isSame: false, reason: 'ブランド不一致' };
  }

  // キーワードの一致度をチェック
  if (key1.keywords.length > 0 && key2.keywords.length > 0) {
    const common = key1.keywords.filter(k => key2.keywords.includes(k));

    // キーワードが完全に異なる場合は別商品
    if (common.length === 0) {
      return { isSame: false, reason: 'キーワード不一致' };
    }

    // 主要キーワードが2つ以上一致していれば同一商品の可能性が高い
    if (common.length >= 2) {
      // ブランド + 日数/粒数 + キーワードが一致
      if (key1.brand === key2.brand && key1.brand) {
        if (key1.days === key2.days && key1.days) {
          return { isSame: true, confidence: 'high', reason: `ブランド+日数+成分一致: ${key1.brand} ${key1.days}日分` };
        }
        if (key1.pills === key2.pills && key1.pills) {
          return { isSame: true, confidence: 'high', reason: `ブランド+粒数+成分一致: ${key1.brand} ${key1.pills}粒` };
        }
      }
    }

    // キーワードが1つ以上一致 + ブランド一致 + 日数または粒数が一致
    // ただし、対象年齢・性別が両方ないか、または一致している場合のみ
    if (common.length >= 1 && key1.brand === key2.brand && key1.brand) {
      const targetOk =
        (!target1.age && !target2.age) ||
        (target1.age === target2.age && (!target1.gender && !target2.gender || target1.gender === target2.gender));

      if (targetOk) {
        if (key1.days === key2.days && key1.days) {
          return { isSame: true, confidence: 'medium', reason: `ブランド+日数+成分類似: ${key1.brand} ${key1.days}日分` };
        }
        if (key1.pills === key2.pills && key1.pills) {
          return { isSame: true, confidence: 'medium', reason: `ブランド+粒数+成分類似: ${key1.brand} ${key1.pills}粒` };
        }
      }
    }
  }

  return { isSame: false, reason: '一致条件を満たさない' };
}

/**
 * 重複グループを検出
 */
function detectDuplicateGroups(products) {
  const groups = [];
  const processed = new Set();

  // まず単品商品のみを抽出
  const singleProducts = products.filter(p => {
    const setCount = extractSetCount(p.name);
    return setCount === null;
  });

  console.log(`  単品商品: ${singleProducts.length}件`);
  console.log(`  セット商品: ${products.length - singleProducts.length}件`);

  for (let i = 0; i < singleProducts.length; i++) {
    if (processed.has(singleProducts[i]._id)) continue;

    const group = {
      primary: singleProducts[i],
      duplicates: [],
      reasons: [],
    };

    for (let j = i + 1; j < singleProducts.length; j++) {
      if (processed.has(singleProducts[j]._id)) continue;

      const result = areSameProducts(singleProducts[i], singleProducts[j]);

      if (result.isSame) {
        group.duplicates.push(singleProducts[j]);
        group.reasons.push(result.reason);
        processed.add(singleProducts[j]._id);
      }
    }

    if (group.duplicates.length > 0) {
      processed.add(singleProducts[i]._id);
      groups.push(group);
    }
  }

  return groups;
}

/**
 * マスター商品を選定
 */
function selectMasterProduct(group) {
  const allProducts = [group.primary, ...group.duplicates];

  const scored = allProducts.map(p => {
    let score = 0;

    // JANコードの有無（優先度高）
    if (p.janCode) score += 100;

    // priceDataの数
    const priceCount = Array.isArray(p.priceData) ? p.priceData.length : 0;
    score += priceCount * 10;

    // scoresの有無
    if (p.scores) score += 20;

    // tierRatingsの有無
    if (p.tierRatings) score += 20;

    // ingredientsの有無
    if (p.ingredients && p.ingredients.length > 0) score += 30;

    // 画像の有無
    if (p.externalImageUrl) score += 5;

    return { product: p, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.product._id.localeCompare(b.product._id);
  });

  return scored[0].product;
}

/**
 * 商品データをマージ
 */
function mergeProductData(master, duplicates) {
  // priceDataをマージ（重複を除去）
  const allPriceData = [];
  const priceKeys = new Set();

  const addPriceData = priceDataArray => {
    if (!Array.isArray(priceDataArray)) return;
    for (const pd of priceDataArray) {
      if (!pd) continue;
      // キーを生成（ソース＋金額＋店舗名）
      const key = `${pd.source || ''}-${pd.amount || 0}-${pd.storeName || pd.shopName || ''}`;
      if (!priceKeys.has(key) && pd.amount && pd.amount > 0) {
        priceKeys.add(key);
        allPriceData.push(pd);
      }
    }
  };

  addPriceData(master.priceData);
  for (const dup of duplicates) {
    addPriceData(dup.priceData);
  }

  // priceHistoryをマージ
  const allPriceHistory = [];
  const historyKeys = new Set();

  const addPriceHistory = priceHistoryArray => {
    if (!Array.isArray(priceHistoryArray)) return;
    for (const ph of priceHistoryArray) {
      if (!ph) continue;
      const key = `${ph.source || ''}-${ph.amount || 0}-${ph.recordedAt || ''}`;
      if (!historyKeys.has(key)) {
        historyKeys.add(key);
        allPriceHistory.push(ph);
      }
    }
  };

  addPriceHistory(master.priceHistory);
  for (const dup of duplicates) {
    addPriceHistory(dup.priceHistory);
  }

  // urlsをマージ
  const mergedUrls = { ...(master.urls || {}) };
  for (const dup of duplicates) {
    if (dup.urls) {
      Object.assign(mergedUrls, dup.urls);
    }
  }

  // identifiersをマージ
  const mergedIdentifiers = { ...(master.identifiers || {}) };
  for (const dup of duplicates) {
    if (dup.identifiers) {
      Object.assign(mergedIdentifiers, dup.identifiers);
    }
  }

  // JANコードをマージ（どれか1つでも持っていれば）
  let janCode = master.janCode;
  if (!janCode) {
    for (const dup of duplicates) {
      if (dup.janCode) {
        janCode = dup.janCode;
        break;
      }
    }
  }

  return {
    priceData: allPriceData,
    priceHistory: allPriceHistory,
    urls: mergedUrls,
    identifiers: mergedIdentifiers,
    janCode,
  };
}

/**
 * Sanityに変更を適用
 */
async function applyMerge(masterId, mergedData, duplicateIds, dryRun = false) {
  const mutations = [];

  // マスター商品を更新
  const setData = {
    priceData: mergedData.priceData,
    priceHistory: mergedData.priceHistory,
    urls: mergedData.urls,
    identifiers: mergedData.identifiers,
  };

  // JANコードがあれば追加
  if (mergedData.janCode) {
    setData.janCode = mergedData.janCode;
  }

  mutations.push({
    patch: {
      id: masterId,
      set: setData,
    },
  });

  // 重複商品を削除
  for (const dupId of duplicateIds) {
    mutations.push({
      delete: { id: dupId },
    });
  }

  if (dryRun) {
    return { success: true, mutations };
  }

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

  return { success: true, mutations };
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🔄 重複商品マージスクリプト v2（単品商品のみ）\n');
  console.log(`  モード: ${dryRun ? 'DRY RUN (確認のみ)' : '本番実行'}\n`);

  try {
    // 全商品取得
    console.log('📥 Sanityから商品データを取得中...');
    const products = await fetchAllProducts();
    console.log(`  取得: ${products.length}件`);

    // 重複検出
    console.log('\n🔍 重複商品を検出中...');
    const duplicateGroups = detectDuplicateGroups(products);
    console.log(`  重複グループ: ${duplicateGroups.length}件\n`);

    if (duplicateGroups.length === 0) {
      console.log('✅ 重複商品は検出されませんでした');
      return;
    }

    // 結果を保存
    const results = [];

    console.log('━'.repeat(80));

    for (let i = 0; i < duplicateGroups.length; i++) {
      const group = duplicateGroups[i];
      const master = selectMasterProduct(group);
      const allProducts = [group.primary, ...group.duplicates];
      const duplicates = allProducts.filter(p => p._id !== master._id);

      console.log(`\n【グループ ${i + 1}/${duplicateGroups.length}】`);
      console.log(`  理由: ${[...new Set(group.reasons)].join(', ')}`);
      console.log(`  商品数: ${allProducts.length}件`);

      console.log(`\n  🏆 マスター商品:`);
      console.log(`     ID: ${master._id}`);
      console.log(`     名前: ${master.name.substring(0, 70)}...`);
      console.log(`     Slug: ${master.slug}`);
      console.log(`     ソース: ${master.source || 'N/A'}`);
      console.log(`     JANコード: ${master.janCode || 'なし'}`);
      console.log(`     価格データ数: ${Array.isArray(master.priceData) ? master.priceData.length : 0}`);

      console.log(`\n  🗑️  マージ・削除対象 (${duplicates.length}件):`);
      for (const dup of duplicates) {
        console.log(`     - ${dup._id}`);
        console.log(`       名前: ${dup.name.substring(0, 60)}...`);
        console.log(`       ソース: ${dup.source || 'N/A'}`);
        console.log(`       価格データ数: ${Array.isArray(dup.priceData) ? dup.priceData.length : 0}`);
      }

      // マージ
      const mergedData = mergeProductData(master, duplicates);
      const duplicateIds = duplicates.map(d => d._id);

      try {
        const result = await applyMerge(master._id, mergedData, duplicateIds, dryRun);

        results.push({
          groupId: i + 1,
          reason: [...new Set(group.reasons)].join(', '),
          masterId: master._id,
          masterName: master.name,
          masterSlug: master.slug,
          duplicateIds,
          priceDataCount: mergedData.priceData.length,
          success: result.success,
        });

        if (dryRun) {
          console.log(`\n  ✓ マージ予定: 価格データ ${mergedData.priceData.length}件に統合`);
        } else {
          console.log(`\n  ✅ マージ完了: 価格データ ${mergedData.priceData.length}件に統合`);
        }
      } catch (error) {
        console.error(`\n  ❌ マージ失敗: ${error.message}`);
        results.push({
          groupId: i + 1,
          reason: [...new Set(group.reasons)].join(', '),
          masterId: master._id,
          masterName: master.name,
          duplicateIds,
          success: false,
          error: error.message,
        });
      }

      console.log('─'.repeat(80));
    }

    // サマリー
    const successCount = results.filter(r => r.success).length;
    const totalDeleted = results.reduce((sum, r) => sum + (r.success ? r.duplicateIds.length : 0), 0);

    console.log('\n📊 サマリー:');
    console.log(`  処理グループ数: ${duplicateGroups.length}`);
    console.log(`  成功: ${successCount}件`);
    console.log(`  失敗: ${results.length - successCount}件`);
    console.log(`  削除${dryRun ? '予定' : ''}商品数: ${totalDeleted}件`);

    if (dryRun) {
      console.log('\n💡 実際にマージを実行するには:');
      console.log('  node scripts/merge-duplicate-products-v2.mjs');
    } else {
      console.log('\n✅ マージ完了！');
      console.log('🌐 Sanityスタジオで確認: http://localhost:3333/structure/product');
    }

    // 結果をファイルに保存
    const reportPath = join(__dirname, 'merge-report-v2.json');
    writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📝 レポート保存: ${reportPath}`);
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
