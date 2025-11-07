#!/usr/bin/env node

/**
 * 成分量のデータ検証・修正スクリプト
 *
 * 目的:
 * 1. 異常な成分量データを検出（1000mgのデフォルト値など）
 * 2. 修正が必要な商品をリスト化
 * 3. 自動修正可能なものは修正提案
 * 4. --fixオプションで実際に修正を適用
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

// コマンドライン引数
const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

// 検証ルール（TypeScriptファイルから移植）
const INGREDIENT_VALIDATION_RULES = {
  "ingredient-vitamin-d": {
    name: "ビタミンD",
    minAmountMg: 0.005,
    maxAmountMg: 0.125,
    typicalAmountMg: 0.025,
    unit: "μg",
  },
  "ingredient-vitamin-c": {
    name: "ビタミンC（アスコルビン酸）",
    minAmountMg: 100,
    maxAmountMg: 2000,
    typicalAmountMg: 1000,
    unit: "mg",
  },
  "ingredient-calcium": {
    name: "カルシウム",
    minAmountMg: 100,
    maxAmountMg: 600,
    typicalAmountMg: 200,
    unit: "mg",
  },
  "ingredient-magnesium": {
    name: "マグネシウム",
    minAmountMg: 50,
    maxAmountMg: 350,
    typicalAmountMg: 100,
    unit: "mg",
  },
  "ingredient-omega-3": {
    name: "DHA・EPA（オメガ3脂肪酸）",
    minAmountMg: 200,
    maxAmountMg: 3000,
    typicalAmountMg: 1000,
    unit: "mg",
  },
  "ingredient-zinc": {
    name: "亜鉛",
    minAmountMg: 5,
    maxAmountMg: 40,
    typicalAmountMg: 10,
    unit: "mg",
  },
  "ingredient-folic-acid": {
    name: "葉酸",
    minAmountMg: 0.2,
    maxAmountMg: 1.0,
    typicalAmountMg: 0.4,
    unit: "μg",
  },
  "ingredient-iron": {
    name: "鉄",
    minAmountMg: 2,
    maxAmountMg: 40,
    typicalAmountMg: 10,
    unit: "mg",
  },
  "ingredient-lutein": {
    name: "ルテイン",
    minAmountMg: 6,
    maxAmountMg: 40,
    typicalAmountMg: 20,
    unit: "mg",
  },
  "ingredient-vitamin-e": {
    name: "ビタミンE（トコフェロール）",
    minAmountMg: 6,
    maxAmountMg: 600,
    typicalAmountMg: 100,
    unit: "mg",
  },
  "ingredient-vitamin-a": {
    name: "ビタミンA（レチノール）",
    minAmountMg: 0.3,
    maxAmountMg: 2.7,
    typicalAmountMg: 0.6,
    unit: "μg",
  },
};

/**
 * ブランド別の標準的な成分量（よく使われる量）
 */
const BRAND_STANDARD_AMOUNTS = {
  "DHC": {
    "ingredient-vitamin-d": 0.025, // 25μg (1000IU)
    "ingredient-calcium": 300, // 300mg
    "ingredient-vitamin-c": 1000, // 1000mg
    "ingredient-vitamin-e": 100, // 100mg
  },
  "ネイチャーメイド": {
    "ingredient-vitamin-d": 0.025, // 25μg
    "ingredient-calcium": 200, // 200mg
  },
  "FANCL": {
    "ingredient-vitamin-d": 0.03, // 30μg
    "ingredient-calcium": 300, // 300mg
  },
};

/**
 * 成分量を商品名から再抽出（改善版）
 */
function extractAmountFromProductName(productName, ingredientId) {
  const rule = INGREDIENT_VALIDATION_RULES[ingredientId];
  if (!rule) return null;

  const name = productName.toLowerCase();

  // より包括的な抽出パターン（「配合」「含有」「含む」などに対応）
  const patterns = {
    "ingredient-vitamin-d": [
      // マイクログラム表記（配合/含有/含む などの後）
      { regex: /(\d+(?:\.\d+)?)\s*(?:μg|mcg|ug|マイクログラム)(?:配合|含有|含む|の|が)?/i, converter: (v) => parseFloat(v) / 1000 },
      // IU表記
      { regex: /(\d+(?:,\d+)?)\s*iu/i, converter: (v) => parseFloat(v.replace(/,/g, '')) * 0.025 / 1000 },
      // 成分名の近くの数値
      { regex: /(?:ビタミン|vitamin)\s*d[3]?\s*[：:・\s]+(\d+(?:\.\d+)?)\s*(?:μg|mcg|ug)/i, converter: (v) => parseFloat(v) / 1000 },
    ],
    "ingredient-vitamin-c": [
      { regex: /(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:mg|ミリグラム)(?:配合|含有|含む)?/i, converter: (v) => parseFloat(v.replace(/,/g, '')) },
      { regex: /(?:ビタミン|vitamin)\s*c\s*[：:・\s]+(\d+(?:,\d+)?)\s*mg/i, converter: (v) => parseFloat(v.replace(/,/g, '')) },
    ],
    "ingredient-calcium": [
      { regex: /カルシウム[：:・\s]*(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v) },
      { regex: /calcium[：:・\s]*(\d+)\s*mg/i, converter: (v) => parseFloat(v) },
    ],
    "ingredient-magnesium": [
      { regex: /マグネシウム[：:・\s]*(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v) },
      { regex: /magnesium[：:・\s]*(\d+)\s*mg/i, converter: (v) => parseFloat(v) },
    ],
    "ingredient-omega-3": [
      { regex: /(?:dha|epa)[+&・]?(?:dha|epa)?[：:・\s]*(\d+(?:,\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v.replace(/,/g, '')) },
      { regex: /(\d+(?:,\d+)?)\s*mg.*(?:dha|epa)/i, converter: (v) => parseFloat(v.replace(/,/g, '')) },
    ],
    "ingredient-zinc": [
      { regex: /亜鉛[：:・\s]*(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v) },
      { regex: /zinc[：:・\s]*(\d+)\s*mg/i, converter: (v) => parseFloat(v) },
    ],
    "ingredient-folic-acid": [
      { regex: /葉酸[：:・\s]*(\d+(?:\.\d+)?)\s*(?:μg|mcg|ug|マイクログラム)/i, converter: (v) => parseFloat(v) / 1000 },
      { regex: /folic\s*acid[：:・\s]*(\d+)\s*(?:μg|mcg)/i, converter: (v) => parseFloat(v) / 1000 },
    ],
    "ingredient-iron": [
      { regex: /鉄[：:・\s]*(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v) },
      { regex: /iron[：:・\s]*(\d+)\s*mg/i, converter: (v) => parseFloat(v) },
    ],
    "ingredient-lutein": [
      { regex: /ルテイン[：:・\s]*(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v) },
      { regex: /lutein[：:・\s]*(\d+)\s*mg/i, converter: (v) => parseFloat(v) },
    ],
    "ingredient-vitamin-e": [
      { regex: /(?:ビタミン|vitamin)\s*e[：:・\s]*(\d+(?:\.\d+)?)\s*(?:mg|ミリグラム)/i, converter: (v) => parseFloat(v) },
    ],
    "ingredient-vitamin-a": [
      { regex: /(?:ビタミン|vitamin)\s*a[：:・\s]*(\d+(?:\.\d+)?)\s*(?:μg|mcg|ug)/i, converter: (v) => parseFloat(v) / 1000 },
    ],
  };

  const extractPatterns = patterns[ingredientId];
  if (!extractPatterns) {
    // パターンが未定義の場合、典型的な量を返す
    return rule.typicalAmountMg;
  }

  // パターンマッチングを試行
  for (const { regex, converter } of extractPatterns) {
    const match = name.match(regex);
    if (match) {
      const extractedAmount = converter(match[1]);
      // 妥当な範囲内かチェック
      if (extractedAmount >= rule.minAmountMg && extractedAmount <= rule.maxAmountMg) {
        return extractedAmount;
      }
    }
  }

  // ブランド別の標準量を試す
  for (const [brandName, brandAmounts] of Object.entries(BRAND_STANDARD_AMOUNTS)) {
    if (productName.includes(brandName) && brandAmounts[ingredientId]) {
      return brandAmounts[ingredientId];
    }
  }

  // それでも抽出できない場合、典型的な量を返す
  return rule.typicalAmountMg;
}

/**
 * 検証と修正提案
 */
async function validateAndFixIngredients() {
  console.log(`🔍 成分量のデータ検証を開始${isDryRun ? '（プレビューモード）' : ''}...\n`);

  try {
    // 全商品を取得
    const products = await client.fetch(
      `*[_type == "product" && availability == "in-stock"] | order(name asc){
        _id,
        name,
        source,
        ingredients[]{
          amountMgPerServing,
          ingredient->{
            _id,
            name
          },
          _key
        }
      }`
    );

    console.log(`📊 全${products.length}件の商品を検証\n`);

    const issues = {
      outOfRange: [], // 範囲外
      defaultValue: [], // デフォルト値の疑い
      fixable: [], // 自動修正可能
      manualReview: [], // 手動確認が必要
    };

    for (const product of products) {
      if (!product.ingredients || product.ingredients.length === 0) continue;

      for (const ing of product.ingredients) {
        if (!ing.ingredient || !ing.ingredient._id) continue;
        if (!ing.amountMgPerServing || ing.amountMgPerServing <= 0) continue;

        const ingredientId = ing.ingredient._id;
        const rule = INGREDIENT_VALIDATION_RULES[ingredientId];
        if (!rule) continue;

        const amount = ing.amountMgPerServing;
        let issueType = null;
        let suggestedAmount = null;

        // 範囲外チェック
        if (amount < rule.minAmountMg || amount > rule.maxAmountMg) {
          issueType = "outOfRange";

          // 商品名から再抽出を試みる
          const extracted = extractAmountFromProductName(product.name, ingredientId);
          if (extracted) {
            suggestedAmount = extracted;
            issueType = "fixable";
          }
        }

        // デフォルト値（1000mg）チェック
        if (amount === 1000) {
          if (rule.unit === "μg" || Math.abs(rule.typicalAmountMg - 1000) / rule.typicalAmountMg > 0.5) {
            issueType = "defaultValue";

            // 商品名から再抽出を試みる
            const extracted = extractAmountFromProductName(product.name, ingredientId);
            if (extracted) {
              suggestedAmount = extracted;
              issueType = "fixable";
            }
          }
        }

        if (issueType) {
          const issue = {
            productId: product._id,
            productName: product.name,
            ingredientId,
            ingredientName: ing.ingredient.name,
            ingredientKey: ing._key,
            currentAmount: amount,
            suggestedAmount,
            rule,
            issueType,
          };

          issues[issueType].push(issue);
          if (suggestedAmount) {
            issues.fixable.push(issue);
          } else {
            issues.manualReview.push(issue);
          }
        }
      }
    }

    // 結果表示
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 検証結果サマリー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`❌ 範囲外の値: ${issues.outOfRange.length}件`);
    console.log(`⚠️  デフォルト値の疑い: ${issues.defaultValue.length}件`);
    console.log(`✅ 自動修正可能: ${issues.fixable.length}件`);
    console.log(`🔍 手動確認が必要: ${issues.manualReview.length}件\n`);

    // 自動修正可能な問題
    if (issues.fixable.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ 自動修正可能な問題（商品名から成分量を再抽出）');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      for (const [index, issue] of issues.fixable.entries()) {
        if (index >= 30) {
          console.log(`\n... 他${issues.fixable.length - 30}件\n`);
          break;
        }

        console.log(`${index + 1}. ${issue.productName.substring(0, 80)}...`);
        console.log(`   成分: ${issue.ingredientName}`);
        console.log(`   現在: ${formatAmount(issue.currentAmount, issue.rule)} ❌`);
        console.log(`   修正: ${formatAmount(issue.suggestedAmount, issue.rule)} ✅`);
        console.log('');
      }
    }

    // 手動確認が必要な問題
    if (issues.manualReview.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 手動確認が必要な問題（商品名から抽出不可）');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      for (const [index, issue] of issues.manualReview.entries()) {
        if (index >= 20) {
          console.log(`\n... 他${issues.manualReview.length - 20}件\n`);
          break;
        }

        console.log(`${index + 1}. ${issue.productName.substring(0, 80)}...`);
        console.log(`   成分: ${issue.ingredientName}`);
        console.log(`   現在: ${formatAmount(issue.currentAmount, issue.rule)} ❌`);
        console.log(`   妥当な範囲: ${formatAmount(issue.rule.minAmountMg, issue.rule)} 〜 ${formatAmount(issue.rule.maxAmountMg, issue.rule)}`);
        console.log(`   ID: ${issue.productId}`);
        console.log('');
      }
    }

    // 修正実行
    if (shouldFix && issues.fixable.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔧 修正を実行中...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      let successCount = 0;
      let errorCount = 0;

      for (const issue of issues.fixable) {
        try {
          // 商品の全成分を取得
          const product = await client.fetch(
            `*[_type == "product" && _id == $productId][0]{
              ingredients[]
            }`,
            { productId: issue.productId }
          );

          // 対象成分のみ更新
          const updatedIngredients = product.ingredients.map(ing => {
            if (ing._key === issue.ingredientKey) {
              return {
                ...ing,
                amountMgPerServing: issue.suggestedAmount,
              };
            }
            return ing;
          });

          // Sanityに更新
          await client
            .patch(issue.productId)
            .set({ ingredients: updatedIngredients })
            .commit();

          successCount++;
          console.log(`✅ ${issue.productName.substring(0, 60)}... - ${issue.ingredientName} を修正`);
        } catch (error) {
          errorCount++;
          console.error(`❌ ${issue.productName.substring(0, 60)}... - エラー: ${error.message}`);
        }
      }

      console.log(`\n修正完了: ${successCount}件成功、${errorCount}件失敗\n`);
    } else if (isDryRun && issues.fixable.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 次のステップ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('実際に修正を適用するには、--fix オプションを付けて実行してください:');
      console.log('  node scripts/validate-and-fix-ingredient-amounts.mjs --fix\n');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

function formatAmount(amountMg, rule) {
  if (rule.unit === "μg") {
    return `${(amountMg * 1000).toFixed(1)}μg`;
  }
  return `${amountMg.toFixed(2)}mg`;
}

validateAndFixIngredients()
  .then(() => {
    console.log('✅ 検証完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
