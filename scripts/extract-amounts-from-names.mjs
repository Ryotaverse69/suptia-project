#!/usr/bin/env node

/**
 * 商品名から成分量を抽出して更新するスクリプト
 *
 * 商品名に含まれる成分量情報（例: 「ビタミンC 1000mg」→ 1000mg）を抽出し、
 * 成分量が0mgの商品を自動更新します。
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * 商品名から成分量を抽出
 * @param {string} productName - 商品名
 * @param {string} ingredientName - 成分名
 * @returns {number|null} - 抽出された成分量（mg単位）またはnull
 */
function extractAmountFromName(productName, ingredientName) {
  if (!productName || !ingredientName) return null;

  // ノイズ除去: 「約X日分」「Xヶ月分」などの期間表記のみを削除
  // 注意: mgやμgの「分」は削除しない
  let cleanedName = productName
    .replace(/[約]*[0-9０-９]+\s*日\s*分/g, '[DURATION]')
    .replace(/[約]*[0-9０-９]+\s*[ヶケか]+\s*月\s*分/g, '[DURATION]')
    .replace(/[約]*[0-9０-９]+\s*週\s*間\s*分/g, '[DURATION]')
    .replace(/[約]*[0-9０-９]+\s*年\s*分/g, '[DURATION]');

  const name = cleanedName.toLowerCase();
  const ingredient = ingredientName.toLowerCase();

  // パターン1: 「ビタミンC 1000mg」「ビタミンC1000mg」
  const mgPattern = new RegExp(`${ingredient}.*?(\\d+(?:\\.\\d+)?)\\s*mg`, 'i');
  const mgMatch = name.match(mgPattern);
  if (mgMatch) {
    const amount = parseFloat(mgMatch[1]);
    // 妥当な範囲チェック（0.001mg ~ 100,000mg）
    if (amount >= 0.001 && amount <= 100000) {
      return amount;
    }
  }

  // パターン2: 「ビタミンD 25μg」「ビタミンD25μg」→ 0.025mg
  const ugPattern = new RegExp(`${ingredient}.*?(\\d+(?:\\.\\d+)?)\\s*(?:μg|mcg|ug)`, 'i');
  const ugMatch = name.match(ugPattern);
  if (ugMatch) {
    const amount = parseFloat(ugMatch[1]) / 1000; // μg → mg
    if (amount >= 0.001 && amount <= 10000) {
      return amount;
    }
  }

  // パターン3: 「1000mgのビタミンC」のように数値が先の場合
  const reverseMgPattern = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*mg.*?${ingredient}`, 'i');
  const reverseMgMatch = name.match(reverseMgPattern);
  if (reverseMgMatch) {
    const amount = parseFloat(reverseMgMatch[1]);
    if (amount >= 0.001 && amount <= 100000) {
      return amount;
    }
  }

  // パターン4: 「25μgのビタミンD」
  const reverseUgPattern = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:μg|mcg|ug).*?${ingredient}`, 'i');
  const reverseUgMatch = name.match(reverseUgPattern);
  if (reverseUgMatch) {
    const amount = parseFloat(reverseUgMatch[1]) / 1000;
    if (amount >= 0.001 && amount <= 10000) {
      return amount;
    }
  }

  // パターン5: IU単位（ビタミンD、ビタミンEなど）
  const iuPattern = new RegExp(`${ingredient}.*?(\\d+(?:\\.\\d+)?)\\s*(?:iu|IU)`, 'i');
  const iuMatch = name.match(iuPattern);
  if (iuMatch) {
    const iu = parseFloat(iuMatch[1]);
    // IU → mg 変換（成分による）
    if (ingredientName.includes('ビタミンD')) {
      // 1 IU = 0.025 μg = 0.000025 mg
      return (iu * 0.000025);
    } else if (ingredientName.includes('ビタミンE')) {
      // 1 IU = 0.67 mg (dl-α-tocopherol)
      return (iu * 0.67);
    } else if (ingredientName.includes('ビタミンA')) {
      // 1 IU = 0.0003 mg (retinol)
      return (iu * 0.0003);
    }
  }

  return null;
}

/**
 * 成分名の主要キーワードを抽出（マッチング精度向上）
 */
function getIngredientKeywords(ingredientName) {
  const keywords = [];

  // 括弧内を除いた主要部分
  const mainPart = ingredientName.replace(/[（(][^）)]*[）)]/g, '').trim();
  keywords.push(mainPart);

  // 一般的な別名
  const aliases = {
    'ビタミンC（アスコルビン酸）': ['ビタミンc', 'vitamin c', 'アスコルビン'],
    'ビタミンD': ['ビタミンd', 'vitamin d'],
    'ビタミンE': ['ビタミンe', 'vitamin e'],
    'ビタミンA（レチノール）': ['ビタミンa', 'vitamin a', 'レチノール'],
    'カルシウム': ['ca', 'calcium', 'カルシウム'],
    'マグネシウム': ['mg', 'magnesium', 'マグネシウム'],
    '亜鉛': ['zinc', '亜鉛', 'zn'],
    '葉酸': ['folic', '葉酸', 'folate'],
    '鉄分': ['iron', '鉄', 'fe'],
    'オメガ3脂肪酸（EPA・DHA）': ['dha', 'epa', 'omega', 'オメガ'],
    'CoQ10（コエンザイムQ10）': ['coq10', 'q10', 'コエンザイム'],
  };

  if (aliases[ingredientName]) {
    keywords.push(...aliases[ingredientName]);
  }

  return keywords;
}

async function extractAndUpdate() {
  console.log('🔍 成分量が0mgの商品から商品名で量を抽出中...\n');

  try {
    // 成分量が0以下の商品を取得
    const products = await client.fetch(
      `*[_type == "product" && availability == "in-stock"] | order(name asc){
        _id,
        name,
        source,
        brand->{
          name
        },
        ingredients[]{
          _key,
          amountMgPerServing,
          ingredient->{
            _id,
            name,
            nameEn
          }
        }
      }`
    );

    console.log(`📊 全${products.length}件の商品を分析\n`);

    const updates = [];

    for (const product of products) {
      if (!product.ingredients || product.ingredients.length === 0) continue;

      for (const ing of product.ingredients) {
        // 成分量が0以下の場合のみ処理
        if (!ing.ingredient || !ing.ingredient.name) continue;
        if (ing.amountMgPerServing > 0) continue;

        const ingredientName = ing.ingredient.name;
        const keywords = getIngredientKeywords(ingredientName);

        // 各キーワードで成分量を抽出試行
        let extractedAmount = null;
        for (const keyword of keywords) {
          extractedAmount = extractAmountFromName(product.name, keyword);
          if (extractedAmount && extractedAmount > 0) break;
        }

        if (extractedAmount && extractedAmount > 0) {
          updates.push({
            productId: product._id,
            productName: product.name,
            source: product.source || 'unknown',
            brand: product.brand?.name || '不明',
            ingredientKey: ing._key,
            ingredientName,
            currentAmount: ing.amountMgPerServing || 0,
            newAmount: extractedAmount,
          });
        }
      }
    }

    console.log(`📊 抽出結果: ${updates.length}件\n`);

    if (updates.length === 0) {
      console.log("✅ 商品名から成分量を抽出できる商品はありませんでした\n");
      return;
    }

    // 結果表示
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 抽出された成分量（確認）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    updates.slice(0, 20).forEach((update, index) => {
      console.log(`${index + 1}. ${update.productName.substring(0, 70)}...`);
      console.log(`   成分: ${update.ingredientName}`);
      console.log(`   抽出量: ${update.currentAmount}mg → ${update.newAmount}mg`);
      console.log(`   ブランド: ${update.brand} | ECサイト: ${update.source}`);
      console.log('');
    });

    if (updates.length > 20) {
      console.log(`   ... 他${updates.length - 20}件\n`);
    }

    // 確認プロンプト（自動実行の場合はスキップ）
    if (process.argv.includes('--execute')) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 更新を実行中...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      for (const update of updates) {
        // 商品の最新データを取得
        const product = await client.fetch(
          `*[_type == "product" && _id == $id][0]{ingredients}`,
          { id: update.productId }
        );

        // 該当する成分の配合量を更新
        const updatedIngredients = product.ingredients.map((ing) => {
          if (ing._key === update.ingredientKey) {
            return {
              ...ing,
              amountMgPerServing: update.newAmount,
            };
          }
          return ing;
        });

        // Sanityに更新をコミット
        await client.patch(update.productId)
          .set({ ingredients: updatedIngredients })
          .commit();

        console.log(`✅ ${update.ingredientName}: ${update.currentAmount}mg → ${update.newAmount}mg`);
        console.log(`   ${update.productName.substring(0, 60)}...\n`);
      }

      console.log(`\n✅ ${updates.length}件の商品を更新しました\n`);
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 実行方法');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('  上記の更新を実行する場合は、以下のコマンドを実行してください:');
      console.log('  node scripts/extract-amounts-from-names.mjs --execute\n');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

extractAndUpdate()
  .then(() => {
    console.log('✅ 抽出完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
