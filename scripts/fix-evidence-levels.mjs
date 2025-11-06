#!/usr/bin/env node

/**
 * 無効なevidenceLevelを修正し、safetyScoreを設定するスクリプト
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

// evidenceLevelのマッピング
const evidenceLevelMapping = {
  '高': 'A',
  '中': 'B',
  '低': 'C',
};

// デフォルトのsafetyScore（一般的な安全性）
const defaultSafetyScore = 75; // Bランク相当

async function fixData() {
  console.log('🔧 成分データを修正中...\n');

  let updatedCount = 0;

  try {
    const ingredients = await client.fetch(
      `*[_type == "ingredient"]{
        _id,
        name,
        "slug": slug.current,
        evidenceLevel,
        safetyScore
      }`
    );

    for (const ingredient of ingredients) {
      const updates = {};

      // evidenceLevelの修正
      if (evidenceLevelMapping[ingredient.evidenceLevel]) {
        updates.evidenceLevel = evidenceLevelMapping[ingredient.evidenceLevel];
        console.log(`📝 ${ingredient.name}: evidenceLevel "${ingredient.evidenceLevel}" → "${updates.evidenceLevel}"`);
      } else if (!['S', 'A', 'B', 'C', 'D'].includes(ingredient.evidenceLevel)) {
        // 無効な値の場合はBをデフォルトに設定
        updates.evidenceLevel = 'B';
        console.log(`📝 ${ingredient.name}: evidenceLevel "${ingredient.evidenceLevel}" → "B" (デフォルト)`);
      }

      // safetyScoreの設定
      if (ingredient.safetyScore === null || ingredient.safetyScore === undefined) {
        updates.safetyScore = defaultSafetyScore;
        console.log(`📝 ${ingredient.name}: safetyScore 未設定 → ${defaultSafetyScore}`);
      }

      // 更新が必要な場合のみSanityに反映
      if (Object.keys(updates).length > 0) {
        await client
          .patch(ingredient._id)
          .set(updates)
          .commit();
        updatedCount++;
      }
    }

    console.log(`\n✅ 完了: ${updatedCount}件の成分を更新しました`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
fixData()
  .then(() => {
    console.log('\n✨ すべての修正が完了しました！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
