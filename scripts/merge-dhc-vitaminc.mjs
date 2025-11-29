#!/usr/bin/env node

/**
 * DHC ビタミンC 重複商品マージスクリプト
 *
 * 同じ基本商品（セット違いを含む）を1つの商品に統合します。
 * 異なるセット数は priceData の quantity フィールドで区別します。
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// メインリポジトリの.env.localから読み込み
const envPath = join(__dirname, '../../../VScode/suptia-project/apps/web/.env.local');
let envContent;
try {
  envContent = readFileSync(envPath, 'utf8');
} catch {
  const altPath = join(__dirname, '../apps/web/.env.local');
  try {
    envContent = readFileSync(altPath, 'utf8');
  } catch {
    console.error('環境変数ファイルが見つかりません');
    process.exit(1);
  }
}

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * 商品名から基本的な識別情報を抽出
 */
function extractProductInfo(name) {
  if (!name) return null;

  // ブランド抽出
  const brandMatch = name.match(/(DHC|ディーエイチシー)/i);
  const brand = brandMatch ? 'dhc' : null;

  // 除外条件：別の成分が主成分の場合はビタミンC商品として扱わない
  const excludePatterns = [
    /コエンザイム\s*Q10/i,
    /マルチビタミン/i,
    /ビタミン\s*D/i,
    /ビタミン\s*E/i,
    /ビタミン\s*B/i,
    /DHA/i,
    /EPA/i,
    /葉酸/i,
    /ブルーベリー/i,
    /アスタキサンチン/i,
    /ルテイン/i,
    /セサミン/i,
    /マカ/i,
  ];

  for (const pattern of excludePatterns) {
    if (pattern.test(name)) {
      // ただし、「ビタミンC」が明示的に含まれていて、かつハードカプセルの場合は許可
      if (!/ビタミン\s*[CＣ].*ハードカプセル/i.test(name) && !/ハードカプセル.*ビタミン\s*[CＣ]/i.test(name)) {
        return null;
      }
    }
  }

  // 成分抽出（ビタミンC系）- ハードカプセルまたは明示的なビタミンC商品
  const isHardCapsuleVitaminC = /ビタミン\s*[CＣ].*ハードカプセル/i.test(name) || /ハードカプセル.*ビタミン\s*[CＣ]/i.test(name);
  const vitaminCMatch = name.match(/ビタミン\s*[CＣ]/i);
  const ingredient = (vitaminCMatch && isHardCapsuleVitaminC) ? 'vitamin-c' : null;

  // 日数抽出（複数日数表記の場合は最小値を使用）
  // 例: "20日/30日/60日分/90日分" → 20
  const multiDaysMatch = name.match(/(\d+)日.*\/.*(\d+)日/);
  const singleDaysMatch = name.match(/(\d+)\s*日\s*分?/);
  let days = null;
  if (multiDaysMatch) {
    // 複数日数表記の場合、商品はバリエーション販売なので特別扱い
    days = 'multi'; // マルチバリエーション商品
  } else if (singleDaysMatch) {
    days = parseInt(singleDaysMatch[1], 10);
  }

  // セット数抽出
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
      break;
    }
  }

  // 粒数抽出
  const pillsMatch = name.match(/(\d+)\s*(粒|錠|カプセル)/);
  const pills = pillsMatch ? parseInt(pillsMatch[1], 10) : null;

  // ハードカプセルかどうか
  const isHardCapsule = /ハードカプセル/i.test(name);

  return {
    brand,
    ingredient,
    days,
    setCount,
    pills,
    isHardCapsule,
    // 基本キー（セット数を除外）
    baseKey: brand && ingredient ? `${brand}-${ingredient}-${days || 'x'}${isHardCapsule ? '-hard' : ''}` : null,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🔍 DHC ビタミンC 重複商品マージスクリプト\n');
  console.log(`  モード: ${dryRun ? 'DRY RUN' : '本番実行'}\n`);

  // DHC ビタミンC を含む商品を取得
  const products = await client.fetch(`
    *[_type == "product" && name match "*DHC*" && (name match "*ビタミン*C*" || name match "*ビタミンC*")] {
      _id,
      name,
      slug,
      source,
      priceJPY,
      janCode,
      itemCode,
      priceData,
      identifiers,
      externalImageUrl,
      reviewStats,
      description,
      ingredients,
      brand,
      _createdAt
    } | order(name asc)
  `);

  console.log(`見つかった商品: ${products.length}件\n`);

  // 商品を基本キーでグループ化
  const groups = new Map();

  for (const product of products) {
    const info = extractProductInfo(product.name);
    if (!info || !info.baseKey) {
      console.log(`  ⚠️  解析できない商品: ${product.name.substring(0, 60)}`);
      continue;
    }

    if (!groups.has(info.baseKey)) {
      groups.set(info.baseKey, []);
    }
    groups.get(info.baseKey).push({
      ...product,
      info,
    });
  }

  console.log(`\n📦 グループ化結果:\n`);

  // 重複グループ（2件以上）を表示
  const duplicateGroups = [];
  for (const [key, group] of groups.entries()) {
    if (group.length > 1) {
      duplicateGroups.push({ key, group });
      console.log(`🔴 重複グループ: ${key}`);
      for (const p of group) {
        console.log(`   - ${p.name.substring(0, 70)}`);
        console.log(`     ID: ${p._id}, セット: ${p.info.setCount}, 日数: ${p.info.days}日, 価格: ¥${p.priceJPY}`);
      }
      console.log('');
    }
  }

  if (duplicateGroups.length === 0) {
    console.log('✅ 重複商品はありませんでした');
    return;
  }

  console.log(`\n📊 重複グループ数: ${duplicateGroups.length}件\n`);

  // マージ処理
  for (const { key, group } of duplicateGroups) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 マージ対象: ${key}\n`);

    // プライマリ商品を選択（JANコード優先、次にデータ充実度）
    const sorted = group.sort((a, b) => {
      // JANコードがある商品を優先
      if (a.janCode && !b.janCode) return -1;
      if (!a.janCode && b.janCode) return 1;

      // セット数が1の商品を優先（基本商品）
      if (a.info.setCount === 1 && b.info.setCount > 1) return -1;
      if (a.info.setCount > 1 && b.info.setCount === 1) return 1;

      // 成分データがある商品を優先
      const aHasIngredients = a.ingredients && a.ingredients.length > 0;
      const bHasIngredients = b.ingredients && b.ingredients.length > 0;
      if (aHasIngredients && !bHasIngredients) return -1;
      if (!aHasIngredients && bHasIngredients) return 1;

      // レビュー数が多い商品を優先
      const aReviews = a.reviewStats?.reviewCount || 0;
      const bReviews = b.reviewStats?.reviewCount || 0;
      if (aReviews !== bReviews) return bReviews - aReviews;

      // 作成日が古い商品を優先
      return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
    });

    const primary = sorted[0];
    const secondaries = sorted.slice(1);

    console.log(`  🏆 プライマリ: ${primary.name.substring(0, 60)}`);
    console.log(`     ID: ${primary._id}`);
    console.log(`     JAN: ${primary.janCode || 'なし'}`);
    console.log(`     セット数: ${primary.info.setCount}`);

    // priceDataをマージ
    const mergedPriceData = [...(primary.priceData || [])];

    for (const secondary of secondaries) {
      console.log(`  🗑️  削除対象: ${secondary.name.substring(0, 60)}`);
      console.log(`     ID: ${secondary._id}`);
      console.log(`     セット数: ${secondary.info.setCount}`);

      // secondaryのpriceDataを追加（重複を避ける）
      if (secondary.priceData) {
        for (const pd of secondary.priceData) {
          // セット情報を追加
          const enrichedPd = {
            ...pd,
            quantity: secondary.info.setCount,
            setLabel: secondary.info.setCount > 1 ? `${secondary.info.setCount}個セット` : null,
            originalProductId: secondary._id,
            originalProductName: secondary.name,
          };

          // 重複チェック（ソース+金額+セット数）
          const isDuplicate = mergedPriceData.some(existing =>
            existing.source === pd.source &&
            existing.amount === pd.amount &&
            (existing.quantity || 1) === secondary.info.setCount
          );

          if (!isDuplicate) {
            mergedPriceData.push(enrichedPd);
          }
        }
      }
    }

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
      if (secondary.janCode && !mergedIdentifiers.jan) {
        mergedIdentifiers.jan = secondary.janCode;
      }
    }

    console.log(`\n  📊 マージ後のpriceData: ${mergedPriceData.length}件`);
    for (const pd of mergedPriceData) {
      const setInfo = pd.quantity > 1 ? ` (${pd.quantity}個セット)` : '';
      console.log(`     - ${pd.source}: ¥${pd.amount}${setInfo}`);
    }

    if (dryRun) {
      console.log('\n  📝 DRY RUN: 実際には変更されません\n');
      continue;
    }

    // Sanity更新
    try {
      // 1. プライマリ商品を更新
      await client
        .patch(primary._id)
        .set({
          priceData: mergedPriceData,
          identifiers: mergedIdentifiers,
          ...(mergedIdentifiers.jan && !primary.janCode && { janCode: mergedIdentifiers.jan }),
        })
        .commit();
      console.log(`  ✅ プライマリ商品を更新しました`);

      // 2. セカンダリ商品を削除
      for (const secondary of secondaries) {
        await client.delete(secondary._id);
        console.log(`  ✅ 削除完了: ${secondary._id}`);
      }
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }

    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ マージ処理が完了しました！');

  if (dryRun) {
    console.log('\n💡 実際にマージするには --dry-run オプションを外して実行してください');
  }
}

main().catch(console.error);
