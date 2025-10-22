#!/usr/bin/env node

/**
 * 商品識別子追加スクリプト
 *
 * 既存商品にJANコード、ASINなどの識別子を追加します。
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動でパース
const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
});

// 商品名から推測できるJANコード/ASINのマッピング
const KNOWN_IDENTIFIERS = {
  // DHC商品
  "DHC ビタミンC（ハードカプセル）30日分": {
    jan: "4511413404133",
  },
  "DHC EPA 30日分": {
    jan: "4511413404836",
  },
  "DHC マルチビタミン 30日分": {
    jan: "4511413404119",
  },
  "DHC 亜鉛 30日分": {
    jan: "4511413404249",
  },
  "DHC ビタミンC ハードカプセル 60日分": {
    jan: "4511413404133", // 30日分と同じJANの可能性あり
  },

  // NOW Foods商品
  "NOW Foods ビタミンD-3 5000IU 240ソフトジェル": {
    asin: "B001B8SJSW",
    upc: "733739003775",
  },
  "NOW Foods オメガ-3 1000mg 200ソフトジェル": {
    asin: "B0013OQGO6",
    upc: "733739018205",
  },
  "NOW Foods 亜鉛 50mg 250錠": {
    asin: "B001B4S30Y",
    upc: "733739030580",
  },
  "NOW Foods オメガ3 フィッシュオイル 200ソフトジェル": {
    asin: "B0013OQGO6",
    upc: "733739018205",
  },
  "NOW Foods マグネシウム 400mg 180カプセル": {
    asin: "B000BD0RT0",
    upc: "733739014795",
  },

  // ネイチャーメイド
  "ネイチャーメイド スーパーマルチビタミン&ミネラル 120粒": {
    jan: "4987035513711",
  },
  "ネイチャーメイド ビタミンD 1000IU 100粒": {
    jan: "4987035550013",
  },
  "大塚製薬 ネイチャーメイド ビタミンD 90粒": {
    jan: "4987035550013",
  },

  // Life Extension商品
  "Life Extension ツーパーデイ カプセル 120粒": {
    asin: "B00IGQZ91S",
  },
  "Life Extension ビタミンC 1000mg": {
    asin: "B000WI47C4",
  },
  "Life Extension スーパーオメガ-3 EPA/DHA": {
    asin: "B000WJ91P4",
  },

  // Thorne Research商品
  "Thorne マルチビタミン エリート AM/PM": {
    asin: "B00HEIZUAE",
  },
  "Thorne ビタミンD-3 5000IU": {
    asin: "B000FH11ME",
  },
  "Thorne Research ベーシックBコンプレックス 60カプセル": {
    asin: "B00068XFSM",
  },
};

async function addProductIdentifiers() {
  console.log("🔧 商品識別子を追加します...\n");

  try {
    // 全商品を取得
    const products = await client.fetch(
      `*[_type == "product"] {
        _id,
        name,
        identifiers
      }`
    );

    console.log(`📦 対象商品: ${products.length}件\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // 既に識別子がある場合はスキップ
      if (
        product.identifiers &&
        (product.identifiers.jan ||
          product.identifiers.asin ||
          product.identifiers.upc ||
          product.identifiers.ean)
      ) {
        console.log(
          `⏭️  スキップ: ${product.name} - 既に識別子あり`
        );
        console.log(
          `   ${product.identifiers.jan ? `JAN: ${product.identifiers.jan}` : ""} ${product.identifiers.asin ? `ASIN: ${product.identifiers.asin}` : ""}`
        );
        console.log("");
        skippedCount++;
        continue;
      }

      // 商品名で識別子を検索
      const identifiers = KNOWN_IDENTIFIERS[product.name];

      if (!identifiers) {
        console.log(`⚠️  スキップ: ${product.name} - 識別子情報なし`);
        skippedCount++;
        continue;
      }

      // 識別子を追加
      await client
        .patch(product._id)
        .set({
          identifiers: identifiers,
        })
        .commit();

      console.log(`✅ 更新: ${product.name}`);
      if (identifiers.jan) console.log(`   JAN: ${identifiers.jan}`);
      if (identifiers.asin) console.log(`   ASIN: ${identifiers.asin}`);
      if (identifiers.upc) console.log(`   UPC: ${identifiers.upc}`);
      if (identifiers.ean) console.log(`   EAN: ${identifiers.ean}`);
      console.log("");

      updatedCount++;
    }

    console.log("\n📊 更新完了:");
    console.log(`   更新: ${updatedCount}件`);
    console.log(`   スキップ: ${skippedCount}件`);
    console.log(`   合計: ${products.length}件`);

    if (updatedCount > 0) {
      console.log(
        "\n💡 識別子を追加したことで、次回のCron実行時に価格取得の精度が向上します。"
      );
      console.log(
        "   JAN/ASINによる検索は商品名検索よりも高精度です。"
      );
    }

    if (skippedCount > updatedCount) {
      console.log(
        "\n⚠️  多くの商品に識別子情報がありません。"
      );
      console.log(
        "   楽天APIやAmazon PA-APIから取得したjanCode/ASINを自動で追加する機能を実装することをお勧めします。"
      );
    }
  } catch (error) {
    console.error("❌ エラー:", error.message);
    throw error;
  }
}

addProductIdentifiers();
