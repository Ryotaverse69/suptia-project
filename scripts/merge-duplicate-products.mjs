#!/usr/bin/env node

/**
 * 重複商品マージスクリプト
 *
 * 同じ商品が複数のECサイトから別々のレコードとして登録されている場合に、
 * それらを1つのレコードに統合します。
 *
 * 使い方:
 *   node scripts/merge-duplicate-products.mjs [options]
 *
 * オプション:
 *   --dry-run    実際にはマージせず、検出された重複のみ表示
 *   --verbose    詳細なログを出力
 *
 * 例:
 *   node scripts/merge-duplicate-products.mjs --dry-run
 *   node scripts/merge-duplicate-products.mjs
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
const SANITY_API_VERSION = '2023-05-03';
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data`;

/**
 * 商品名から正規化キーを生成（重複検出用）
 * 改善版: セット数を無視してマージ対象を検出
 */
function normalizeProductName(name) {
  if (!name) return null;

  // ブランド名を検出（商品名の任意位置から）
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
    [/(Doctor's Best|ドクターズベスト)/i, 'doctors-best'],
    [/(California Gold)/i, 'california-gold'],
    [/(Life Extension)/i, 'life-extension'],
    [/(Solgar|ソルガー)/i, 'solgar'],
    [/(Jarrow|ジャロウ)/i, 'jarrow'],
    [/(Swanson)/i, 'swanson'],
    [/(オリヒロ)/i, 'orihiro'],
    [/(AFC)/i, 'afc'],
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

  // 粒数を抽出
  const pillsMatch = name.match(/(\d+)\s*(粒|錠|カプセル)/);
  const pills = pillsMatch ? parseInt(pillsMatch[1], 10) : null;

  // 主要成分を抽出（より詳細に）
  const ingredients = [];
  const ingredientPatterns = [
    // ビタミン系
    /ビタミン\s*[A-Za-zａ-ｚ]+\d*/gi,
    /マルチビタミン/gi,
    // ミネラル系
    /カルシウム/gi,
    /マグネシウム/gi,
    /亜鉛/gi,
    /鉄/gi,
    /セレン/gi,
    /クロム/gi,
    // 脂肪酸系
    /DHA/gi,
    /EPA/gi,
    /DPA/gi,
    /オメガ\s*3/gi,
    // タンパク質・アミノ酸系
    /コラーゲン/gi,
    /プロテイン/gi,
    /BCAA/gi,
    // 関節系
    /グルコサミン/gi,
    /コンドロイチン/gi,
    // その他
    /葉酸/gi,
    /ルテイン/gi,
    /乳酸菌/gi,
    /コエンザイム\s*Q10/gi,
    /セサミン/gi,
    /アスタキサンチン/gi,
    /ブルーベリー/gi,
    /ナットウキナーゼ/gi,
    /プロポリス/gi,
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
    /\*\s*(\d+)\s*(袋|本|個|箱)/i,
  ];
  let setCount = 1;
  for (const pattern of setPatterns) {
    const match = name.match(pattern);
    if (match) {
      setCount = parseInt(match[1], 10);
      if (setCount > 1) break;
    }
  }

  // 形態を抽出（ハードカプセル、パウダーなど）
  let form = '';
  if (/ハードカプセル/i.test(name)) form = 'hard-capsule';
  else if (/ソフトカプセル/i.test(name)) form = 'soft-capsule';
  else if (/パウダー|粉末/i.test(name)) form = 'powder';
  else if (/タブレット|錠剤/i.test(name)) form = 'tablet';
  else if (/液体|リキッド|ドリンク/i.test(name)) form = 'liquid';

  if (!brand) return null;

  const sortedIngredients = [...new Set(ingredients)].sort();
  const mainIngredient = sortedIngredients[0] || 'unknown';

  // マージキー（セット数を除外して生成 - セット違いの同一商品をマージするため）
  const mergeKey = `${brand}-${mainIngredient}-${days || 'x'}${form ? `-${form}` : ''}`;

  return {
    brand,
    days,
    pills,
    mainIngredient,
    ingredients: sortedIngredients,
    setCount,
    form,
    // key: セット数を含む完全キー（従来互換）
    key: `${brand}-${mainIngredient}-${days || 'x'}-${setCount}`,
    // mergeKey: セット数を除外したマージ用キー
    mergeKey,
  };
}

/**
 * Sanityから全商品を取得
 */
async function fetchAllProducts() {
  const query = `*[_type == "product"]{
    _id,
    name,
    slug,
    source,
    janCode,
    itemCode,
    identifiers,
    priceData,
    priceJPY,
    ingredients,
    servingsPerDay,
    servingsPerContainer,
    externalImageUrl,
    reviewStats,
    scores,
    tierRatings,
    badges,
    safetyScore,
    references,
    warnings,
    brand,
    description,
    availability,
    _createdAt,
    _updatedAt
  }`;

  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

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

/**
 * 重複商品グループを検出
 * 改善版: mergeKeyを使用してセット違いの同一商品もマージ対象に
 */
function findDuplicateGroups(products) {
  const groups = new Map();

  for (const product of products) {
    const normalized = normalizeProductName(product.name);

    if (normalized) {
      // mergeKeyを使用（セット数を除外）
      const key = normalized.mergeKey;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push({
        ...product,
        normalized,
      });
    }
  }

  // 2つ以上の商品がある重複グループのみを返す
  const duplicates = [];
  for (const [key, group] of groups.entries()) {
    if (group.length > 1) {
      duplicates.push({
        key,
        products: group,
      });
    }
  }

  return duplicates;
}

/**
 * マージ先の商品を決定（優先度: データ充実度）
 */
function selectPrimaryProduct(products) {
  // スコア計算
  const scored = products.map(p => {
    let score = 0;

    // JANコードがある場合はボーナス
    if (p.janCode || p.identifiers?.jan) score += 100;

    // 成分データが充実している場合はボーナス
    if (p.ingredients && p.ingredients.length > 0) {
      score += p.ingredients.length * 10;
      // 成分量が設定されているかチェック
      const hasAmounts = p.ingredients.some(i => i.amountMgPerServing > 0);
      if (hasAmounts) score += 50;
    }

    // スコア・ランク情報がある場合はボーナス
    if (p.scores) score += 30;
    if (p.tierRatings) score += 30;
    if (p.badges && p.badges.length > 0) score += 20;

    // レビュー数が多い場合はボーナス
    if (p.reviewStats?.reviewCount) score += Math.min(p.reviewStats.reviewCount / 10, 50);

    // 参考文献・警告がある場合はボーナス
    if (p.references && p.references.length > 0) score += 20;
    if (p.warnings && p.warnings.length > 0) score += 10;

    // 作成日が古い場合は若干のボーナス（元のデータを優先）
    const createdAt = new Date(p._createdAt).getTime();
    score += Math.max(0, (Date.now() - createdAt) / (1000 * 60 * 60 * 24 * 30)); // 月数

    return { product: p, score };
  });

  // スコアでソート（降順）
  scored.sort((a, b) => b.score - a.score);

  return scored[0].product;
}

/**
 * 商品データをマージ
 * 改善版: セット情報を保持してpriceDataにマージ
 */
function mergeProducts(primary, secondaries) {
  const merged = { ...primary };

  // priceDataをマージ（セット情報を付加）
  const allPriceData = [...(primary.priceData || [])];

  // プライマリの既存priceDataにはセット数1を明示
  for (const pd of allPriceData) {
    if (!pd.quantity) {
      pd.quantity = primary.normalized?.setCount || 1;
    }
  }

  for (const secondary of secondaries) {
    if (secondary.priceData) {
      for (const pd of secondary.priceData) {
        const setCount = secondary.normalized?.setCount || 1;

        // セット情報を付加
        const enrichedPd = {
          ...pd,
          quantity: setCount,
          setLabel: setCount > 1 ? `${setCount}個セット` : null,
          originalProductId: secondary._id,
          originalProductName: secondary.name,
        };

        // 同じソース+価格+セット数の組み合わせがない場合のみ追加
        const exists = allPriceData.some(
          existing =>
            existing.source === pd.source &&
            existing.amount === pd.amount &&
            (existing.quantity || 1) === setCount
        );
        if (!exists) {
          allPriceData.push(enrichedPd);
        }
      }
    }
  }
  merged.priceData = allPriceData;

  // identifiersをマージ
  const mergedIdentifiers = { ...(primary.identifiers || {}) };
  for (const secondary of secondaries) {
    if (secondary.identifiers) {
      for (const [key, value] of Object.entries(secondary.identifiers)) {
        if (value && !mergedIdentifiers[key]) {
          mergedIdentifiers[key] = value;
        }
      }
    }
    // janCodeをidentifiersにも追加
    if (secondary.janCode && !mergedIdentifiers.jan) {
      mergedIdentifiers.jan = secondary.janCode;
    }
  }
  merged.identifiers = mergedIdentifiers;

  // janCodeをトップレベルにも設定
  if (!merged.janCode && mergedIdentifiers.jan) {
    merged.janCode = mergedIdentifiers.jan;
  }

  // urlsをマージ
  const mergedUrls = { ...(primary.urls || {}) };
  for (const secondary of secondaries) {
    if (secondary.source && secondary.affiliateUrl) {
      mergedUrls[secondary.source] = secondary.affiliateUrl;
    }
    if (secondary.urls) {
      for (const [key, value] of Object.entries(secondary.urls)) {
        if (value && !mergedUrls[key]) {
          mergedUrls[key] = value;
        }
      }
    }
  }
  merged.urls = mergedUrls;

  return merged;
}

/**
 * Sanityにマージ結果を保存
 */
async function saveMergedProduct(primary, secondaries, merged, dryRun = false) {
  if (dryRun) {
    console.log(`\n  📝 DRY RUN: マージ結果`);
    console.log(`     プライマリ: ${primary._id} (${primary.source})`);
    console.log(`     削除対象: ${secondaries.map(s => `${s._id} (${s.source})`).join(', ')}`);
    console.log(`     マージ後のpriceData: ${merged.priceData?.length || 0}件`);
    console.log(`     マージ後のidentifiers: ${JSON.stringify(merged.identifiers)}`);
    return { success: true, dryRun: true };
  }

  const mutations = [];

  // プライマリ商品を更新
  mutations.push({
    patch: {
      id: primary._id,
      set: {
        priceData: merged.priceData,
        identifiers: merged.identifiers,
        urls: merged.urls,
        ...(merged.janCode && { janCode: merged.janCode }),
      },
    },
  });

  // セカンダリ商品を削除
  for (const secondary of secondaries) {
    mutations.push({
      delete: {
        id: secondary._id,
      },
    });
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

  return { success: true };
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  console.log('🔄 重複商品マージスクリプト\n');
  console.log(`  モード: ${dryRun ? 'DRY RUN（シミュレーション）' : '本番実行'}`);

  try {
    // 全商品を取得
    console.log('\n📥 Sanityから商品データを取得中...');
    const products = await fetchAllProducts();
    console.log(`  ${products.length}件の商品を取得しました`);

    // 重複グループを検出
    console.log('\n🔍 重複商品を検出中...');
    const duplicateGroups = findDuplicateGroups(products);
    console.log(`  ${duplicateGroups.length}件の重複グループを検出しました`);

    if (duplicateGroups.length === 0) {
      console.log('\n✅ 重複商品は見つかりませんでした');
      return;
    }

    // 各グループをマージ
    let mergedCount = 0;
    let deletedCount = 0;

    for (const group of duplicateGroups) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📦 グループ: ${group.key}`);
      console.log(`  商品数: ${group.products.length}件`);

      for (const product of group.products) {
        console.log(`  - ${product.name.substring(0, 60)}...`);
        console.log(`    ID: ${product._id}`);
        console.log(`    ソース: ${product.source}`);
        console.log(`    JAN: ${product.janCode || product.identifiers?.jan || 'なし'}`);
        if (verbose) {
          console.log(`    価格: ¥${product.priceJPY}`);
          console.log(`    成分数: ${product.ingredients?.length || 0}`);
        }
      }

      // プライマリ商品を選択
      const primary = selectPrimaryProduct(group.products);
      const secondaries = group.products.filter(p => p._id !== primary._id);

      console.log(`\n  🏆 プライマリ: ${primary._id} (${primary.source})`);
      console.log(`  🗑️  削除対象: ${secondaries.length}件`);

      // マージ
      const merged = mergeProducts(primary, secondaries);

      // 保存
      const result = await saveMergedProduct(primary, secondaries, merged, dryRun);

      if (result.success) {
        mergedCount++;
        deletedCount += secondaries.length;
        console.log(`  ✅ マージ${dryRun ? '予定' : '完了'}`);
      }
    }

    // 結果サマリー
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 マージ結果:');
    console.log(`  マージ${dryRun ? '予定' : '完了'}: ${mergedCount}グループ`);
    console.log(`  削除${dryRun ? '予定' : '完了'}: ${deletedCount}件の重複商品`);

    if (dryRun) {
      console.log('\n💡 実際にマージするには --dry-run オプションを外して実行してください');
    } else {
      console.log('\n✅ 重複商品のマージが完了しました！');
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
