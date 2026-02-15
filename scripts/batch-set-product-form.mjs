#!/usr/bin/env node

/**
 * 商品の剤形（form）を商品名から推定してSanityに一括設定するスクリプト
 *
 * 使い方:
 *   node scripts/batch-set-product-form.mjs          # ドライラン（変更なし）
 *   node scripts/batch-set-product-form.mjs --apply   # 実際に更新
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

if (!SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN が見つかりません");
  process.exit(1);
}

const SANITY_PROJECT_ID = "fny3jdcg";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2023-05-03";
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data`;

const DRY_RUN = !process.argv.includes("--apply");

// ─────────────────────────────────────────────
// 剤形推定ルール（商品名のキーワードマッチング）
// 優先度順：先にマッチしたものが採用される
// ─────────────────────────────────────────────

const FORM_RULES = [
  {
    form: "gummy",
    keywords: ["グミ", "gummy", "gummies", "グミサプリ"],
  },
  {
    form: "softgel",
    keywords: [
      "ソフトジェル",
      "ソフトカプセル",
      "softgel",
      "soft gel",
      "ソフトゲル",
      "オイル",
      "oil",
    ],
  },
  {
    form: "liquid",
    keywords: [
      "リキッド",
      "liquid",
      "ドリンク",
      "drink",
      "液体",
      "シロップ",
      "液状",
    ],
  },
  {
    form: "powder",
    keywords: [
      "パウダー",
      "powder",
      "粉末",
      "顆粒",
      "細粒",
      "散剤",
      "パウダータイプ",
    ],
  },
  {
    form: "tablet",
    keywords: [
      "タブレット",
      "tablet",
      "錠剤",
      "錠",
      "粒タイプ",
      "チュアブル",
      "chewable",
    ],
  },
  {
    form: "capsule",
    keywords: [
      "カプセル",
      "capsule",
      "capsules",
      "ハードカプセル",
      "veggie capsule",
      "ベジカプセル",
    ],
  },
];

/**
 * 商品名と説明文から剤形を推定
 */
function detectForm(name, description = "") {
  const text = `${name} ${description}`.toLowerCase();

  for (const rule of FORM_RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return { form: rule.form, matchedKeyword: keyword };
      }
    }
  }

  return null;
}

/**
 * Sanityから全商品を取得
 */
async function fetchAllProducts() {
  const query = encodeURIComponent(
    '*[_type == "product"]{ _id, name, form, description, allIngredients }',
  );
  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${query}`;

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
 * Sanityにバッチ更新
 */
async function applyMutations(mutations) {
  const BATCH_SIZE = 100;
  let totalApplied = 0;

  for (let i = 0; i < mutations.length; i += BATCH_SIZE) {
    const batch = mutations.slice(i, i + BATCH_SIZE);
    const response = await fetch(
      `${SANITY_API_URL}/mutate/${SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mutations: batch }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Sanity mutation failed (batch ${i / BATCH_SIZE + 1}): ${JSON.stringify(error)}`,
      );
    }

    totalApplied += batch.length;
    console.log(
      `  ✅ バッチ ${i / BATCH_SIZE + 1}: ${batch.length}件更新完了 (累計: ${totalApplied})`,
    );
  }

  return totalApplied;
}

// ─────────────────────────────────────────────
// メイン処理
// ─────────────────────────────────────────────

async function main() {
  console.log("🔍 商品の剤形推定バッチスクリプト");
  console.log(`   モード: ${DRY_RUN ? "ドライラン（--apply で実行）" : "⚠️ 本番更新"}`);
  console.log("");

  // 1. 全商品取得
  console.log("📦 Sanityから商品データを取得中...");
  const products = await fetchAllProducts();
  console.log(`   ${products.length}件の商品を取得`);

  // 2. 剤形が未設定の商品をフィルタリング
  const withoutForm = products.filter((p) => !p.form);
  const withForm = products.filter((p) => p.form);
  console.log(`   剤形設定済み: ${withForm.length}件`);
  console.log(`   剤形未設定: ${withoutForm.length}件`);
  console.log("");

  // 3. 剤形推定
  const mutations = [];
  const results = {
    capsule: [],
    tablet: [],
    softgel: [],
    powder: [],
    liquid: [],
    gummy: [],
    unknown: [],
  };

  for (const product of withoutForm) {
    const detection = detectForm(
      product.name,
      product.description || product.allIngredients || "",
    );

    if (detection) {
      results[detection.form].push({
        name: product.name.substring(0, 60),
        keyword: detection.matchedKeyword,
      });

      mutations.push({
        patch: {
          id: product._id,
          set: { form: detection.form },
        },
      });
    } else {
      results.unknown.push({
        name: product.name.substring(0, 60),
      });
    }
  }

  // 4. 結果レポート
  console.log("📊 推定結果:");
  const formLabels = {
    capsule: "カプセル",
    tablet: "タブレット",
    softgel: "ソフトジェル",
    powder: "パウダー",
    liquid: "リキッド",
    gummy: "グミ",
    unknown: "判定不能",
  };

  for (const [form, items] of Object.entries(results)) {
    if (items.length > 0) {
      console.log(`\n   ${formLabels[form]}: ${items.length}件`);
      items.slice(0, 3).forEach((item) => {
        const keyword = item.keyword ? ` [${item.keyword}]` : "";
        console.log(`     - ${item.name}${keyword}`);
      });
      if (items.length > 3) {
        console.log(`     ... 他 ${items.length - 3}件`);
      }
    }
  }

  console.log(`\n   合計: ${mutations.length}件を更新予定`);
  console.log(`   判定不能: ${results.unknown.length}件（手動設定が必要）`);

  // 5. 適用
  if (!DRY_RUN && mutations.length > 0) {
    console.log("\n🚀 Sanityに更新を適用中...");
    const applied = await applyMutations(mutations);
    console.log(`\n✅ 完了: ${applied}件の商品に剤形を設定しました`);
  } else if (DRY_RUN) {
    console.log("\n💡 ドライランのため変更は適用されていません");
    console.log("   実際に更新するには: node scripts/batch-set-product-form.mjs --apply");
  }

  // 6. 判定不能リスト出力（多い場合）
  if (results.unknown.length > 0 && results.unknown.length <= 20) {
    console.log("\n📝 判定不能な商品（手動設定推奨）:");
    results.unknown.forEach((item) => {
      console.log(`   - ${item.name}`);
    });
  }
}

main().catch((err) => {
  console.error("❌ エラー:", err.message);
  process.exit(1);
});
