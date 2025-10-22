#!/usr/bin/env node

/**
 * 成分メタデータ更新スクリプト
 *
 * 診断機能で使用する relatedGoals と contraindications を追加します。
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

// 成分メタデータマッピング（slug → metadata）
const INGREDIENT_METADATA = {
  "vitamin-c": {
    relatedGoals: ["immune-boost", "skin-health", "anti-aging"],
    contraindications: [],
  },
  "vitamin-d": {
    relatedGoals: ["bone-health", "immune-boost"],
    contraindications: [],
  },
  "omega-3": {
    relatedGoals: ["heart-health", "brain-health", "anti-aging"],
    contraindications: ["anticoagulant-use", "surgery", "bleeding-risk"],
  },
  "magnesium": {
    relatedGoals: ["sleep-improvement", "stress-relief", "muscle-building"],
    contraindications: ["kidney-disease"],
  },
  "magnesium-glycinate": {
    relatedGoals: ["sleep-improvement", "stress-relief", "muscle-building"],
    contraindications: ["kidney-disease"],
  },
  "vitamin-b-complex": {
    relatedGoals: ["energy-boost", "brain-health", "stress-relief"],
    contraindications: [],
  },
  "vitamin-b12": {
    relatedGoals: ["energy-boost", "brain-health"],
    contraindications: [],
  },
  "zinc": {
    relatedGoals: ["immune-boost", "skin-health"],
    contraindications: [],
  },
  "iron": {
    relatedGoals: ["energy-boost"],
    contraindications: [], // 鉄過剰症は追加しない（一般的ではない）
  },
  "calcium": {
    relatedGoals: ["bone-health"],
    contraindications: ["kidney-disease"],
  },
  "probiotics": {
    relatedGoals: ["digestive-health", "immune-boost"],
    contraindications: ["immunosuppressant-use"],
  },
  "coenzyme-q10": {
    relatedGoals: ["heart-health", "energy-boost", "anti-aging"],
    contraindications: ["anticoagulant-use"],
  },
  "vitamin-e": {
    relatedGoals: ["skin-health", "anti-aging", "heart-health"],
    contraindications: ["anticoagulant-use", "bleeding-risk"],
  },
  "vitamin-k": {
    relatedGoals: ["bone-health", "heart-health"],
    contraindications: ["anticoagulant-use"],
  },
  "vitamin-a": {
    relatedGoals: ["eye-health", "skin-health", "immune-boost"],
    contraindications: ["pregnant", "liver-disease"],
  },
  "selenium": {
    relatedGoals: ["immune-boost", "anti-aging"],
    contraindications: [],
  },
  "l-carnitine": {
    relatedGoals: ["weight-management", "energy-boost", "athletic-performance"],
    contraindications: [],
  },
  "creatine": {
    relatedGoals: ["muscle-building", "athletic-performance", "brain-health"],
    contraindications: ["kidney-disease"],
  },
  "protein": {
    relatedGoals: ["muscle-building", "weight-management", "athletic-performance"],
    contraindications: [],
  },
  "bcaa": {
    relatedGoals: ["muscle-building", "athletic-performance"],
    contraindications: [],
  },
  "ashwagandha": {
    relatedGoals: ["stress-relief", "sleep-improvement", "energy-boost"],
    contraindications: [
      "pregnant",
      "breastfeeding",
      "autoimmune-disease",
      "thyroid-disorder",
    ],
  },
  "turmeric": {
    relatedGoals: ["joint-health", "anti-aging", "digestive-health"],
    contraindications: ["anticoagulant-use", "bleeding-risk", "liver-disease"],
  },
  "ginkgo": {
    relatedGoals: ["brain-health", "eye-health"],
    contraindications: ["anticoagulant-use", "bleeding-risk", "surgery"],
  },
  "astaxanthin": {
    relatedGoals: ["skin-health", "eye-health", "anti-aging"],
    contraindications: [],
  },
  "collagen": {
    relatedGoals: ["skin-health", "joint-health", "bone-health"],
    contraindications: ["shellfish-allergy"], // 魚由来の場合
  },
  "glucosamine": {
    relatedGoals: ["joint-health"],
    contraindications: ["shellfish-allergy"],
  },
  "lutein": {
    relatedGoals: ["eye-health", "skin-health"],
    contraindications: [],
  },
  "nac": {
    relatedGoals: ["immune-boost", "anti-aging"],
    contraindications: [],
  },
  "folic-acid": {
    relatedGoals: ["heart-health", "brain-health"],
    contraindications: [],
  },
  "niacin": {
    relatedGoals: ["heart-health", "energy-boost", "skin-health"],
    contraindications: ["liver-disease", "diabetes"],
  },
  "potassium": {
    relatedGoals: ["heart-health"],
    contraindications: ["kidney-disease", "hypertension"],
  },
  "chromium": {
    relatedGoals: ["weight-management", "energy-boost"],
    contraindications: ["diabetes", "kidney-disease"],
  },
  "iodine": {
    relatedGoals: ["energy-boost"],
    contraindications: ["thyroid-disorder"],
  },
};

async function updateIngredientMetadata() {
  console.log("🚀 成分メタデータ更新を開始します...\n");

  try {
    // 全成分を取得
    const ingredients = await client.fetch(
      `*[_type == "ingredient"] {
        _id,
        name,
        "slug": slug.current,
        relatedGoals,
        contraindications
      }`
    );

    console.log(`📋 対象成分: ${ingredients.length}件\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const ingredient of ingredients) {
      const metadata = INGREDIENT_METADATA[ingredient.slug];

      if (!metadata) {
        console.log(`⏭️  スキップ: ${ingredient.name} (${ingredient.slug}) - メタデータなし`);
        skippedCount++;
        continue;
      }

      // 既にデータがある場合はスキップ
      if (
        ingredient.relatedGoals?.length > 0 ||
        ingredient.contraindications?.length > 0
      ) {
        console.log(
          `⏭️  スキップ: ${ingredient.name} - 既にデータあり (goals: ${ingredient.relatedGoals?.length || 0}, contraindications: ${ingredient.contraindications?.length || 0})`
        );
        skippedCount++;
        continue;
      }

      // 更新実行
      await client
        .patch(ingredient._id)
        .set({
          relatedGoals: metadata.relatedGoals,
          contraindications: metadata.contraindications,
        })
        .commit();

      console.log(
        `✅ 更新: ${ingredient.name} (${ingredient.slug})`
      );
      console.log(`   健康目標: ${metadata.relatedGoals.join(", ")}`);
      if (metadata.contraindications.length > 0) {
        console.log(
          `   禁忌: ${metadata.contraindications.join(", ")}`
        );
      }
      console.log("");

      updatedCount++;
    }

    console.log("\n📊 更新完了:");
    console.log(`   更新: ${updatedCount}件`);
    console.log(`   スキップ: ${skippedCount}件`);
    console.log(`   合計: ${ingredients.length}件`);
  } catch (error) {
    console.error("❌ エラー:", error.message);
    throw error;
  }
}

updateIngredientMetadata();
