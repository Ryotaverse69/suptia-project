#!/usr/bin/env node

/**
 * 成分に安全性スコアを追加するスクリプト
 *
 * 使用方法:
 * node scripts/add-safety-scores.mjs
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
  console.error("\napps/web/.env.local ファイルに SANITY_API_TOKEN を設定してください");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// 成分ごとの安全性スコア（0-100点）
const safetyScores = {
  'vitamin-a': 75,  // Bランク - 過剰摂取リスクあり
  'vitamin-d': 80,  // Aランク - 一般的に安全だが上限管理必要
  'vitamin-c': 95,  // Sランク - 水溶性で安全性高い
  'vitamin-e': 85,  // Aランク - 脂溶性だが比較的安全
  'vitamin-b12': 98, // Sランク - 水溶性で過剰摂取リスク低い
  'calcium': 80,    // Aランク - 適量で安全
  'magnesium': 85,  // Aランク - 腎機能正常なら安全
  'zinc': 75,       // Bランク - 過剰摂取で副作用あり
  'iron': 70,       // Bランク - 過剰摂取リスク、相互作用注意
  'omega-3': 88,    // Aランク - 一般的に安全
};

async function updateSafetyScores() {
  console.log('🔄 安全性スコアを追加中...\n');

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const [slug, score] of Object.entries(safetyScores)) {
    try {
      // スラッグから成分を検索
      const ingredients = await client.fetch(
        `*[_type == "ingredient" && slug.current == $slug]`,
        { slug }
      );

      if (ingredients.length === 0) {
        console.log(`⚠️  成分が見つかりません: ${slug}`);
        notFoundCount++;
        continue;
      }

      const ingredient = ingredients[0];

      // 安全性スコアを更新
      await client
        .patch(ingredient._id)
        .set({ safetyScore: score })
        .commit();

      // ランク判定
      let rank = 'D';
      if (score >= 90) rank = 'S';
      else if (score >= 80) rank = 'A';
      else if (score >= 70) rank = 'B';
      else if (score >= 60) rank = 'C';

      console.log(`✅ ${ingredient.name} (${slug}): ${score}点 → ${rank}ランク`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ エラー (${slug}):`, error.message);
    }
  }

  console.log(`\n📊 完了: ${updatedCount}件更新、${notFoundCount}件スキップ`);
}

// 実行
updateSafetyScores()
  .then(() => {
    console.log('\n✨ 安全性スコアの追加が完了しました！');
    console.log('💡 ブラウザで成分詳細ページを確認してください。');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
