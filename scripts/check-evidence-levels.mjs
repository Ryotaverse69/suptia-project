#!/usr/bin/env node

/**
 * 成分のevidenceLevelを確認するスクリプト
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// __dirnameの取得（ESモジュール対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// apps/web/.env.localを読み込み
config({ path: join(__dirname, "../apps/web/.env.local") });

// Sanity設定
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

async function checkEvidenceLevels() {
  console.log('🔍 成分のevidenceLevelを確認中...\n');

  try {
    const ingredients = await client.fetch(
      `*[_type == "ingredient"]{
        _id,
        name,
        "slug": slug.current,
        evidenceLevel,
        safetyScore
      } | order(name asc)`
    );

    console.log(`📊 全${ingredients.length}件の成分を確認\n`);

    // evidenceLevelが無効な成分をカウント
    const invalidEvidenceLevels = ingredients.filter(
      ing => !['S', 'A', 'B', 'C', 'D'].includes(ing.evidenceLevel)
    );

    // safetyScoreが未設定の成分をカウント
    const missingSafetyScores = ingredients.filter(
      ing => ing.safetyScore === null || ing.safetyScore === undefined
    );

    // 統計を表示
    console.log('📈 統計:');
    console.log(`  ✅ evidenceLevelが有効: ${ingredients.length - invalidEvidenceLevels.length}件`);
    console.log(`  ❌ evidenceLevelが無効: ${invalidEvidenceLevels.length}件`);
    console.log(`  ✅ safetyScoreが設定済み: ${ingredients.length - missingSafetyScores.length}件`);
    console.log(`  ❌ safetyScoreが未設定: ${missingSafetyScores.length}件\n`);

    // 無効なevidenceLevelを持つ成分を表示
    if (invalidEvidenceLevels.length > 0) {
      console.log('⚠️  evidenceLevelが無効な成分:');
      invalidEvidenceLevels.forEach(ing => {
        console.log(`  - ${ing.name} (${ing.slug}): evidenceLevel="${ing.evidenceLevel}"`);
      });
      console.log();
    }

    // safetyScoreが未設定の成分を表示
    if (missingSafetyScores.length > 0) {
      console.log('⚠️  safetyScoreが未設定の成分:');
      missingSafetyScores.forEach(ing => {
        console.log(`  - ${ing.name} (${ing.slug})`);
      });
      console.log();
    }

    // すべて正常な場合
    if (invalidEvidenceLevels.length === 0 && missingSafetyScores.length === 0) {
      console.log('✅ すべての成分データが正常です！');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
checkEvidenceLevels()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
