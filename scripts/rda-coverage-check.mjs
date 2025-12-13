#!/usr/bin/env node

/**
 * RDAデータベースと商品で使用されている成分の照合チェック
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * エイリアス辞書を使って成分名を正規化
 */
function normalizeIngredientName(name, aliasData) {
  // 括弧書きを除去
  const nameWithoutParens = name.replace(/[（(][^）)]*[）)]/g, "").trim();

  // エイリアス辞書から正規化名を検索
  for (const [standardName, data] of Object.entries(aliasData)) {
    if (nameWithoutParens === standardName) {
      return standardName;
    }
    if (
      data.aliases &&
      Array.isArray(data.aliases) &&
      data.aliases.some((alias) => alias === name || alias === nameWithoutParens)
    ) {
      return standardName;
    }
  }

  return nameWithoutParens;
}

async function checkRdaCoverage() {
  console.log("🔍 RDAデータベースカバレッジチェック\n");

  // RDAデータを読み込み
  const rdaPath = join(__dirname, "../apps/web/src/data/rda-standards.json");
  const rdaData = JSON.parse(fs.readFileSync(rdaPath, "utf8"));
  const rdaNames = Object.keys(rdaData.ingredients);

  // エイリアスデータを読み込み
  const aliasPath = join(
    __dirname,
    "../apps/web/src/data/ingredient-aliases.json"
  );
  const aliasData = JSON.parse(fs.readFileSync(aliasPath, "utf8"));

  // Sanityから成分一覧を取得
  const sanityIngredients = await client.fetch(`
    *[_type == "ingredient"] {
      _id,
      name,
      slug
    }
  `);

  // 商品で使われている成分を取得
  const usedIngredients = await client.fetch(`
    *[_type == "product" && defined(ingredients)] {
      ingredients[] {
        ingredient-> {
          _id,
          name
        }
      }
    }
  `);

  // 使われている成分のユニークリスト
  const usedSet = new Set();
  usedIngredients.forEach((p) => {
    (p.ingredients || []).forEach((i) => {
      if (i.ingredient?.name) {
        usedSet.add(i.ingredient.name);
      }
    });
  });

  console.log("📊 統計:");
  console.log(`  商品で使用中の成分数: ${usedSet.size}件`);
  console.log(`  RDAデータベース登録数: ${rdaNames.length}件`);
  console.log(`  Sanity成分マスター: ${sanityIngredients.length}件\n`);

  // RDAに未登録の成分を探す（エイリアス正規化を使用）
  const missing = [];
  usedSet.forEach((name) => {
    // エイリアス辞書で正規化
    const normalizedName = normalizeIngredientName(name, aliasData);

    // RDAに存在するかチェック
    const found = rdaNames.includes(normalizedName) ||
      rdaNames.some((rdaName) => {
        // 正規化名の部分一致もチェック
        const rdaBase = rdaName.replace(/[（(][^）)]*[）)]/g, "").trim();
        return (
          rdaBase === normalizedName ||
          rdaName.includes(normalizedName) ||
          normalizedName.includes(rdaBase)
        );
      });

    if (!found) {
      missing.push({ original: name, normalized: normalizedName });
    }
  });

  if (missing.length > 0) {
    console.log("⚠️  RDAデータベースに未登録の成分:");
    missing.forEach((m) =>
      console.log(`  - ${m.original} (正規化: ${m.normalized})`)
    );
    console.log("");
  } else {
    console.log("✅ すべての使用中成分がRDAデータベースに登録済み\n");
  }

  // Sanityにあるが商品に使われていない成分
  const sanityNames = sanityIngredients.map((i) => i.name);
  const unusedInProducts = sanityNames.filter((name) => !usedSet.has(name));

  if (unusedInProducts.length > 0) {
    console.log(`📋 Sanity登録済みだが商品未使用: ${unusedInProducts.length}件`);
    unusedInProducts.forEach((m) => console.log(`  - ${m}`));
  }

  return { missing, sanityIngredients, rdaNames, aliasData };
}

checkRdaCoverage()
  .then(({ missing }) => {
    if (missing.length > 0) {
      console.log("\n💡 未登録成分を追加するには:");
      console.log("   1. エイリアス追加: apps/web/src/data/ingredient-aliases.json");
      console.log("   2. RDA追加: apps/web/src/data/rda-standards.json");
    }
  })
  .catch(console.error);
