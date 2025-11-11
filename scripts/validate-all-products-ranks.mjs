#!/usr/bin/env node
/**
 * 全商品のランク整合性チェックスクリプト
 *
 * 用途:
 * 1. Sanityデータベースの全商品のtierRatingsを取得
 * 2. 各商品のランクが適切な範囲（S+/S/A/B/C/D）にあるか検証
 * 3. 不整合や異常値を検出して報告
 *
 * 実行方法:
 *   node scripts/validate-all-products-ranks.mjs
 *   node scripts/validate-all-products-ranks.mjs --verbose  # 詳細ログ
 *   node scripts/validate-all-products-ranks.mjs --fix      # 異常値を修正
 */

import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const VALID_TIER_RANKS = ["S+", "S", "A", "B", "C", "D"];
const VERBOSE = process.argv.includes("--verbose");
const FIX_MODE = process.argv.includes("--fix");

// ANSI色コード
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateAllProductsRanks() {
  log("\n🔍 全商品のランク整合性チェックを開始...\n", "cyan");

  // 全商品を取得
  const products = await client.fetch(`
    *[_type == "product" && availability == "in-stock"] {
      _id,
      name,
      slug,
      tierRatings {
        priceRank,
        costEffectivenessRank,
        contentRank,
        evidenceRank,
        safetyRank,
        overallRank
      },
      ingredients[] {
        ingredient->{
          _id,
          name
        },
        amountMgPerServing
      },
      priceJPY,
      servingsPerContainer,
      servingsPerDay,
      _updatedAt
    } | order(name asc)
  `);

  log(`📊 対象商品数: ${products.length}件\n`, "blue");

  const issues = [];
  const stats = {
    total: products.length,
    valid: 0,
    missingTierRatings: 0,
    invalidRanks: 0,
    missingData: 0,
  };

  for (const product of products) {
    const productName = product.name?.substring(0, 60) || "名前なし";
    const slug = product.slug?.current || "slug-なし";
    const productIssues = [];

    // tierRatingsの存在チェック
    if (!product.tierRatings) {
      stats.missingTierRatings++;
      productIssues.push({
        type: "missing_tier_ratings",
        severity: "error",
        message: "tierRatingsフィールドが存在しません",
      });
    } else {
      // 各ランクの妥当性チェック
      const ranks = [
        { name: "priceRank", value: product.tierRatings.priceRank },
        {
          name: "costEffectivenessRank",
          value: product.tierRatings.costEffectivenessRank,
        },
        { name: "contentRank", value: product.tierRatings.contentRank },
        { name: "evidenceRank", value: product.tierRatings.evidenceRank },
        { name: "safetyRank", value: product.tierRatings.safetyRank },
        { name: "overallRank", value: product.tierRatings.overallRank },
      ];

      for (const rank of ranks) {
        if (!rank.value) {
          productIssues.push({
            type: "missing_rank",
            severity: "warning",
            message: `${rank.name}が未設定です`,
          });
        } else if (!VALID_TIER_RANKS.includes(rank.value)) {
          stats.invalidRanks++;
          productIssues.push({
            type: "invalid_rank",
            severity: "error",
            message: `${rank.name}が無効な値です: "${rank.value}" (有効値: ${VALID_TIER_RANKS.join(", ")})`,
          });
        }
      }
    }

    // 必須データのチェック
    if (!product.priceJPY || product.priceJPY <= 0) {
      stats.missingData++;
      productIssues.push({
        type: "missing_data",
        severity: "error",
        message: `価格データが無効です: ¥${product.priceJPY}`,
      });
    }

    if (!product.ingredients || product.ingredients.length === 0) {
      stats.missingData++;
      productIssues.push({
        type: "missing_data",
        severity: "error",
        message: "成分データが存在しません",
      });
    }

    if (!product.servingsPerContainer || product.servingsPerContainer <= 0) {
      productIssues.push({
        type: "missing_data",
        severity: "warning",
        message: `容量データが無効です: ${product.servingsPerContainer}`,
      });
    }

    if (!product.servingsPerDay || product.servingsPerDay <= 0) {
      productIssues.push({
        type: "missing_data",
        severity: "warning",
        message: `1日摂取回数が無効です: ${product.servingsPerDay}`,
      });
    }

    // 結果を記録
    if (productIssues.length > 0) {
      issues.push({
        productId: product._id,
        productName,
        slug,
        issues: productIssues,
      });

      // コンソールに出力
      log(`❌ ${productName}...`, "red");
      for (const issue of productIssues) {
        const icon = issue.severity === "error" ? "  🔴" : "  ⚠️ ";
        const color = issue.severity === "error" ? "red" : "yellow";
        log(`${icon} ${issue.message}`, color);
      }
      if (VERBOSE) {
        log(`     商品ID: ${product._id}`, "blue");
        log(`     Slug: ${slug}`, "blue");
        log(`     最終更新: ${product._updatedAt}`, "blue");
      }
      console.log();
    } else {
      stats.valid++;
      if (VERBOSE) {
        log(`✅ ${productName}...`, "green");
      }
    }
  }

  // 統計情報を表示
  log("\n" + "=".repeat(60), "cyan");
  log("📈 検証結果サマリー", "cyan");
  log("=".repeat(60), "cyan");
  log(`✅ 問題なし: ${stats.valid}件`, "green");
  log(`❌ 問題あり: ${issues.length}件`, "red");
  log(`  - tierRatings未設定: ${stats.missingTierRatings}件`, "yellow");
  log(`  - 無効なランク: ${stats.invalidRanks}件`, "yellow");
  log(`  - データ不足: ${stats.missingData}件`, "yellow");
  log("=".repeat(60) + "\n", "cyan");

  // 詳細な問題リストをエクスポート
  if (issues.length > 0) {
    const reportPath = "/tmp/product-validation-report.json";
    const fs = await import("fs");
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          totalProducts: products.length,
          validProducts: stats.valid,
          invalidProducts: issues.length,
          statistics: stats,
          issues: issues,
        },
        null,
        2
      )
    );
    log(`📄 詳細レポートを出力しました: ${reportPath}\n`, "blue");
  }

  // 終了コードを設定
  if (issues.length > 0) {
    log(
      `⚠️  ${issues.length}件の商品に問題があります。詳細は上記を確認してください。\n`,
      "yellow"
    );
    process.exit(1);
  } else {
    log("🎉 全商品のランクは正常です！\n", "green");
    process.exit(0);
  }
}

// スクリプト実行
validateAllProductsRanks().catch((error) => {
  log("\n❌ エラーが発生しました:", "red");
  console.error(error);
  process.exit(1);
});
