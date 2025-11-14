#!/usr/bin/env node
/**
 * 成分量が0mgまたはnullの商品に対して、商品名から成分量を自動抽出して更新するスクリプト
 *
 * 実行方法:
 *   node scripts/update-missing-ingredient-amounts.mjs
 *   node scripts/update-missing-ingredient-amounts.mjs --fix  # 実際に更新
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: "apps/web/.env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
});

/**
 * 単位変換係数（すべてmgに正規化）
 */
const UNIT_CONVERSIONS = {
  g: 1000, // 1g = 1000mg
  mg: 1, // 基準単位
  mcg: 0.001, // 1mcg = 0.001mg
  μg: 0.001, // 1μg = 0.001mg
  ug: 0.001, // 1ug = 0.001mg（μの代替表記）
};

/**
 * 商品名から成分量（mg単位）を抽出
 */
function extractIngredientAmount(productName, ingredientName) {
  if (!productName) return 0;

  // 商品名を正規化（全角→半角、スペース統一）
  const normalizedName = productName
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // 全角数字→半角
    .replace(/[　]/g, " ") // 全角スペース→半角
    .toLowerCase();

  const extractedAmounts = [];

  // パターン1: 数値 + 単位（mg/g/mcg/μg）
  const unitPatterns = [
    /(\d+(?:\.\d+)?)\s*(mg|g|mcg|μg|ug)/gi,
    /(\d+(?:\.\d+)?)\s*ミリグラム/gi,
    /(\d+(?:\.\d+)?)\s*マイクログラム/gi,
  ];

  for (const pattern of unitPatterns) {
    let match;
    while ((match = pattern.exec(normalizedName)) !== null) {
      const value = parseFloat(match[1]);
      const unit = (match[2] || "mg").toLowerCase();

      // 単位をmgに変換
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      extractedAmounts.push(amountInMg);
    }
  }

  // パターン2: 成分名の直後の数値（単位なし）
  if (ingredientName) {
    const ingredientPattern = new RegExp(
      `${escapeRegExp(ingredientName)}[\\s　]*[\\(（]?([\\d,]+(?:\\.\\d+)?)[\\)）]?`,
      "i"
    );
    const ingredientMatch = normalizedName.match(ingredientPattern);
    if (ingredientMatch) {
      const value = parseFloat(ingredientMatch[1].replace(/,/g, ""));
      if (!isNaN(value) && value > 0 && value < 100000) {
        extractedAmounts.push(value);
      }
    }
  }

  // パターン3: 配合量・含有量キーワード
  const amountKeywords = [
    "配合量",
    "含有量",
    "成分量",
    "配合",
    "含有",
    "配合成分",
  ];
  for (const keyword of amountKeywords) {
    const keywordPattern = new RegExp(
      `${keyword}[\\s　]*[:\\:：]?[\\s　]*([\\d,]+(?:\\.\\d+)?)`,
      "i"
    );
    const keywordMatch = normalizedName.match(keywordPattern);
    if (keywordMatch) {
      const value = parseFloat(keywordMatch[1].replace(/,/g, ""));
      if (!isNaN(value) && value > 0 && value < 100000) {
        extractedAmounts.push(value);
      }
    }
  }

  // 抽出された値から最も妥当なものを選択
  if (extractedAmounts.length > 0) {
    // 異常値を除外（0.001mg未満、または100g以上）
    const validAmounts = extractedAmounts.filter(
      (amount) => amount >= 0.001 && amount <= 100000
    );

    if (validAmounts.length > 0) {
      // 複数の値がある場合は、中央値を採用（外れ値を除外）
      validAmounts.sort((a, b) => a - b);
      const medianIndex = Math.floor(validAmounts.length / 2);
      return validAmounts[medianIndex];
    }
  }

  return 0;
}

/**
 * 正規表現の特殊文字をエスケープ
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * メイン処理
 */
async function main() {
  const isDryRun = !process.argv.includes("--fix");

  console.log("\n🔍 成分量が欠損している商品を検索中...\n");

  // 配合量が0mgまたはnullの商品を取得
  const query = `*[_type == 'product' && availability == 'in-stock']{
    _id,
    name,
    source,
    'ingredientCount': count(ingredients),
    ingredients[]{
      _key,
      amountMgPerServing,
      ingredient->{
        _id,
        name,
        nameEn
      }
    }
  }`;

  const products = await client.fetch(query);

  // 配合量が0または未設定の商品をフィルタリング
  const productsWithMissingAmounts = products.filter((p) => {
    if (!p.ingredients || p.ingredients.length === 0) return false;

    // 少なくとも1つの成分で配合量が0または未設定
    return p.ingredients.some(
      (ing) => !ing.amountMgPerServing || ing.amountMgPerServing === 0
    );
  });

  console.log(`対象商品数: ${productsWithMissingAmounts.length}件\n`);

  if (productsWithMissingAmounts.length === 0) {
    console.log("✅ 成分量が欠損している商品はありません。");
    return;
  }

  if (isDryRun) {
    console.log(
      "⚠️ Dry Run モード（--fix フラグを付けると実際に更新します）\n"
    );
  } else {
    console.log("✅ 更新モード（実際にSanityを更新します）\n");
  }

  let updatedCount = 0;
  let extractedCount = 0;
  let failedCount = 0;

  for (const product of productsWithMissingAmounts) {
    console.log(`📦 処理中: ${product.name.substring(0, 60)}...`);

    let hasUpdate = false;
    const updates = [];

    for (const ing of product.ingredients) {
      if (!ing.amountMgPerServing || ing.amountMgPerServing === 0) {
        const ingredientName = ing.ingredient?.name || ing.ingredient?.nameEn;

        if (!ingredientName) {
          console.log(`  ⚠️ 成分名が未登録: スキップ`);
          continue;
        }

        // 商品名から成分量を抽出
        const extractedAmount = extractIngredientAmount(
          product.name,
          ingredientName
        );

        if (extractedAmount > 0) {
          console.log(
            `  ✅ 成分量を抽出: ${ingredientName} → ${extractedAmount}mg`
          );

          updates.push({
            ingredientKey: ing._key,
            newAmount: extractedAmount,
          });

          hasUpdate = true;
          extractedCount++;
        } else {
          console.log(
            `  ❌ 成分量を抽出できませんでした: ${ingredientName}`
          );
          failedCount++;
        }
      }
    }

    if (hasUpdate && !isDryRun) {
      try {
        // Sanityにパッチ適用
        for (const update of updates) {
          await client
            .patch(product._id)
            .set({
              [`ingredients[_key=="${update.ingredientKey}"].amountMgPerServing`]:
                update.newAmount,
            })
            .commit();
        }

        console.log(`  💾 更新完了\n`);
        updatedCount++;
      } catch (error) {
        console.error(`  ❌ 更新エラー: ${error.message}\n`);
      }
    } else if (hasUpdate) {
      console.log(`  💡 Dry Run: 更新をスキップ\n`);
    } else {
      console.log(`  ⏭️ 更新不要\n`);
    }
  }

  // サマリー
  console.log("\n📊 実行結果サマリー");
  console.log(`   対象商品: ${productsWithMissingAmounts.length}件`);
  console.log(`   ✅ 成分量を抽出できた成分: ${extractedCount}個`);
  console.log(`   ❌ 抽出できなかった成分: ${failedCount}個`);

  if (!isDryRun) {
    console.log(`   💾 更新した商品: ${updatedCount}件`);
  } else {
    console.log(
      `\n💡 実際に更新するには、--fix フラグを付けて再実行してください：`
    );
    console.log(
      `   node scripts/update-missing-ingredient-amounts.mjs --fix\n`
    );
  }
}

main().catch((error) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});
