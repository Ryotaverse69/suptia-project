#!/usr/bin/env node

/**
 * Sanity商品データに参考文献・警告情報・第三者検査情報を追加するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localファイルを読み込む
function loadEnv() {
  try {
    const envPath = join(__dirname, "../apps/web/.env.local");
    const envFile = readFileSync(envPath, "utf-8");
    const env = {};
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error("⚠️  .env.localファイルが読み込めませんでした");
    return {};
  }
}

const env = loadEnv();

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

// サンプルデータ: ビタミンC商品の参考文献と警告情報
const sampleData = {
  // ビタミンC商品用のデータ
  vitaminC: {
    references: [
      {
        title: "Vitamin C and Immune Function",
        url: "https://pubmed.ncbi.nlm.nih.gov/29099763/",
        source: "PubMed",
      },
      {
        title: "厚生労働省「日本人の食事摂取基準」ビタミンC",
        url: "https://www.mhlw.go.jp/",
        source: "厚生労働省",
      },
      {
        title:
          "Vitamin C supplementation and common cold: A systematic review and meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/23440782/",
        source: "PubMed",
      },
    ],
    warnings: [
      "1日の上限摂取量（2,000mg）を超えないようにしてください",
      "腎機能障害のある方は医師に相談してください",
      "過剰摂取により下痢や腹痛が起こる可能性があります",
      "他のビタミンCサプリメントと併用する場合は総量にご注意ください",
    ],
    thirdPartyTested: true,
  },
  // ビタミンD商品用のデータ
  vitaminD: {
    references: [
      {
        title: "Vitamin D and bone health",
        url: "https://pubmed.ncbi.nlm.nih.gov/31667520/",
        source: "PubMed",
      },
      {
        title: "厚生労働省「日本人の食事摂取基準」ビタミンD",
        url: "https://www.mhlw.go.jp/",
        source: "厚生労働省",
      },
    ],
    warnings: [
      "1日の上限摂取量（4,000IU / 100μg）を超えないようにしてください",
      "高カルシウム血症の方は医師に相談してください",
      "妊娠中・授乳中の方は医師に相談してください",
    ],
    thirdPartyTested: true,
  },
};

/**
 * 商品名に基づいて適切なデータを選択
 */
function selectDataForProduct(productName) {
  const name = productName.toLowerCase();
  if (name.includes("ビタミンc") || name.includes("vitamin c")) {
    return sampleData.vitaminC;
  } else if (name.includes("ビタミンd") || name.includes("vitamin d")) {
    return sampleData.vitaminD;
  }
  return null;
}

/**
 * 商品データを更新
 */
async function updateProductData(productId, data) {
  try {
    const result = await client
      .patch(productId)
      .set({
        references: data.references,
        warnings: data.warnings,
        thirdPartyTested: data.thirdPartyTested,
      })
      .commit();

    console.log(`✅ 更新完了: ${result.name} (${productId})`);
    console.log(`   参考文献: ${data.references.length}件`);
    console.log(`   警告情報: ${data.warnings.length}件`);
    console.log(`   第三者検査: ${data.thirdPartyTested ? "あり" : "なし"}`);
    return result;
  } catch (error) {
    console.error(`❌ 更新失敗 (${productId}):`, error.message);
    throw error;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log("🚀 商品データ更新スクリプト開始\n");

  // ビタミンC、ビタミンDを含む商品を取得
  const query = `*[_type == "product" && (
    name match "*ビタミンC*" ||
    name match "*Vitamin C*" ||
    name match "*ビタミンD*" ||
    name match "*Vitamin D*"
  )][0...5]{
    _id,
    name,
    references,
    warnings,
    thirdPartyTested
  }`;

  console.log("📊 対象商品を検索中...\n");
  const products = await client.fetch(query);

  if (products.length === 0) {
    console.log("⚠️  対象商品が見つかりませんでした");
    console.log(
      "\nヒント: ビタミンCまたはビタミンDを含む商品名の商品をSanityに追加してください"
    );
    return;
  }

  console.log(`✅ 対象商品: ${products.length}件\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    console.log(`\n📦 商品: ${product.name}`);

    // 既に参考文献がある場合はスキップ
    if (product.references && product.references.length > 0) {
      console.log(`   ⏭️  スキップ（既に参考文献が登録済み）`);
      skippedCount++;
      continue;
    }

    const data = selectDataForProduct(product.name);
    if (!data) {
      console.log(`   ⏭️  スキップ（対応するデータなし）`);
      skippedCount++;
      continue;
    }

    await updateProductData(product._id, data);
    updatedCount++;

    // レート制限対策
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`\n✅ 処理完了`);
  console.log(`   更新: ${updatedCount}件`);
  console.log(`   スキップ: ${skippedCount}件`);
  console.log(`   合計: ${products.length}件\n`);
}

// スクリプト実行
main().catch((error) => {
  console.error("\n❌ エラーが発生しました:", error);
  process.exit(1);
});
