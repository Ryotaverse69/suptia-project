#!/usr/bin/env node

/**
 * 新規成分の自動検出・追加スクリプト
 *
 * 商品で使用されているがRDAデータベース/エイリアスに未登録の成分を
 * 検出し、オプションで自動追加します。
 *
 * Usage:
 *   node scripts/auto-add-missing-ingredients.mjs         # チェックのみ
 *   node scripts/auto-add-missing-ingredients.mjs --fix   # 自動追加
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

const FIX_MODE = process.argv.includes("--fix");

// カテゴリー推定用のキーワード
const CATEGORY_KEYWORDS = {
  ビタミン: ["ビタミン", "Vitamin", "葉酸", "ナイアシン", "パントテン", "ビオチン"],
  ミネラル: ["カルシウム", "マグネシウム", "鉄", "亜鉛", "銅", "セレン", "クロム", "ヨウ素", "カリウム", "マンガン", "モリブデン"],
  アミノ酸: ["アミノ", "グルタミン", "アルギニン", "リジン", "ロイシン", "バリン", "イソロイシン", "メチオニン", "トリプトファン", "システイン", "チロシン", "スレオニン", "フェニルアラニン", "ヒスチジン", "グリシン", "プロリン", "アラニン", "セリン", "タウリン"],
  "オメガ3脂肪酸": ["EPA", "DHA", "オメガ", "Omega", "α-リノレン"],
  ハーブ: ["エキス", "抽出物", "葉", "根", "マカ", "ジンセン", "高麗人参", "エキナセア", "バレリアン", "アシュワガンダ", "ロディオラ"],
  プロバイオティクス: ["乳酸菌", "ビフィズス菌", "プロバイオ", "善玉菌"],
  カロテノイド: ["ルテイン", "アスタキサンチン", "リコピン", "カロテン", "ゼアキサンチン"],
  タンパク質: ["プロテイン", "コラーゲン", "ホエイ"],
  その他: [],
};

/**
 * 成分名からカテゴリーを推定
 */
function guessCategory(name) {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => name.includes(kw))) {
      return category;
    }
  }
  return "その他";
}

/**
 * 成分名から英語名を推定
 */
function guessEnglishName(name) {
  // 括弧内に英語名があれば抽出
  const match = name.match(/[（(]([A-Za-z][A-Za-z\s-]+)[）)]/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * エイリアス辞書を使って成分名を正規化
 */
function normalizeIngredientName(name, aliasData) {
  const nameWithoutParens = name.replace(/[（(][^）)]*[）)]/g, "").trim();

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

async function autoAddMissingIngredients() {
  console.log("🔍 新規成分の自動検出・追加\n");
  console.log(`モード: ${FIX_MODE ? "自動追加" : "チェックのみ"}\n`);

  // データファイル読み込み
  const rdaPath = join(__dirname, "../apps/web/src/data/rda-standards.json");
  const aliasPath = join(__dirname, "../apps/web/src/data/ingredient-aliases.json");

  const rdaData = JSON.parse(fs.readFileSync(rdaPath, "utf8"));
  const aliasData = JSON.parse(fs.readFileSync(aliasPath, "utf8"));

  const rdaNames = Object.keys(rdaData.ingredients);
  const aliasNames = Object.keys(aliasData);

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
  console.log(`  エイリアス辞書登録数: ${aliasNames.length}件\n`);

  // 未登録の成分を検出
  const missingFromRda = [];
  const missingFromAlias = [];

  usedSet.forEach((name) => {
    const normalizedName = normalizeIngredientName(name, aliasData);

    // RDAにない場合
    const inRda =
      rdaNames.includes(normalizedName) ||
      rdaNames.some((rdaName) => {
        const rdaBase = rdaName.replace(/[（(][^）)]*[）)]/g, "").trim();
        return (
          rdaBase === normalizedName ||
          rdaName.includes(normalizedName) ||
          normalizedName.includes(rdaBase)
        );
      });

    if (!inRda) {
      missingFromRda.push({ original: name, normalized: normalizedName });
    }

    // エイリアスにない場合
    if (!aliasNames.includes(normalizedName) && normalizedName !== name) {
      // 正規化後の名前がエイリアスになければ、元の名前もチェック
      const nameWithoutParens = name.replace(/[（(][^）)]*[）)]/g, "").trim();
      if (!aliasNames.includes(nameWithoutParens)) {
        missingFromAlias.push({ original: name, normalized: nameWithoutParens });
      }
    }
  });

  // 結果表示
  if (missingFromRda.length > 0) {
    console.log(`⚠️  RDAデータベースに未登録: ${missingFromRda.length}件`);
    missingFromRda.forEach((m) =>
      console.log(`  - ${m.original} (正規化: ${m.normalized})`)
    );
    console.log("");
  } else {
    console.log("✅ すべての使用中成分がRDAデータベースに登録済み\n");
  }

  if (missingFromAlias.length > 0) {
    console.log(`⚠️  エイリアス辞書に未登録: ${missingFromAlias.length}件`);
    missingFromAlias.forEach((m) =>
      console.log(`  - ${m.original} (正規化: ${m.normalized})`)
    );
    console.log("");
  }

  // 自動追加モード
  if (FIX_MODE && (missingFromRda.length > 0 || missingFromAlias.length > 0)) {
    console.log("🔧 自動追加を開始...\n");

    let rdaAdded = 0;
    let aliasAdded = 0;

    // RDAに追加
    for (const { original, normalized } of missingFromRda) {
      const category = guessCategory(normalized);
      const englishName = guessEnglishName(original) || normalized;

      // プレースホルダーエントリを作成
      rdaData.ingredients[normalized] = {
        nameEn: englishName,
        category: category,
        rda: {
          male: null,
          female: null,
          unit: "mg",
          type: "AI",
          note: "自動追加 - 要確認",
        },
        ul: null,
        deficiencyRisks: [],
        excessRisks: [],
      };

      console.log(`  ✅ RDA追加: ${normalized} (${category})`);
      rdaAdded++;
    }

    // エイリアスに追加
    for (const { original, normalized } of missingFromAlias) {
      // 既存のエントリがあれば、そこにエイリアスを追加
      if (aliasData[normalized]) {
        if (!aliasData[normalized].aliases.includes(original)) {
          aliasData[normalized].aliases.push(original);
          console.log(`  ✅ エイリアス追加: ${original} → ${normalized}`);
          aliasAdded++;
        }
      } else {
        // 新規エントリ作成
        const category = guessCategory(normalized);
        aliasData[normalized] = {
          aliases: [original],
          category: category,
        };
        console.log(`  ✅ エイリアス新規: ${normalized} (${category})`);
        aliasAdded++;
      }
    }

    // ファイル書き込み
    if (rdaAdded > 0) {
      rdaData.lastUpdated = new Date().toISOString().split("T")[0];
      fs.writeFileSync(rdaPath, JSON.stringify(rdaData, null, 2) + "\n", "utf8");
      console.log(`\n📝 RDAデータベース更新: ${rdaAdded}件追加`);
    }

    if (aliasAdded > 0) {
      fs.writeFileSync(aliasPath, JSON.stringify(aliasData, null, 2) + "\n", "utf8");
      console.log(`📝 エイリアス辞書更新: ${aliasAdded}件追加`);
    }

    console.log("\n✅ 自動追加完了");
    console.log("⚠️  追加されたエントリは要確認です（RDA値など）");
  }

  return {
    missingFromRda,
    missingFromAlias,
    stats: {
      usedCount: usedSet.size,
      rdaCount: rdaNames.length,
      aliasCount: aliasNames.length,
    },
  };
}

autoAddMissingIngredients()
  .then(({ missingFromRda, missingFromAlias }) => {
    if (missingFromRda.length > 0 || missingFromAlias.length > 0) {
      if (!FIX_MODE) {
        console.log("\n💡 自動追加するには:");
        console.log("   node scripts/auto-add-missing-ingredients.mjs --fix");
      }
      process.exit(1); // 未登録がある場合はエラー終了（CI用）
    }
  })
  .catch((err) => {
    console.error("エラー:", err);
    process.exit(1);
  });
