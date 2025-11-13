#!/usr/bin/env node

/**
 * 全商品のスコアとランクを自動計算してSanityに同期するスクリプト
 *
 * 実行内容：
 * 1. 全商品を取得
 * 2. 各商品のエビデンススコアと安全性スコアを計算
 * 3. スコアからランクを計算（S/A/B/C/D）
 * 4. Sanityに保存（scores, tierRatings）
 *
 * 使い方:
 *   node scripts/sync-product-scores.mjs [options]
 *
 * オプション:
 *   --limit <number>  処理する商品数（デフォルト: 全件）
 *   --dry-run        実際には保存せず、計算結果のみ表示
 *   --force          既存のスコアを上書き
 *
 * 例:
 *   node scripts/sync-product-scores.mjs --limit 10 --dry-run
 *   node scripts/sync-product-scores.mjs --force
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent
  .match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]
  ?.trim();
const SANITY_DATASET = envContent
  .match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]
  ?.trim();
const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

// Sanityクライアント初期化
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: SANITY_API_TOKEN,
});

/**
 * スコアからランクに変換
 */
function scoreToRank(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

/**
 * エビデンスレベルからスコアに変換（統一仕様準拠）
 * S = 90点（大規模RCT・メタ解析で確立）
 * A = 80点（良質な査読研究で再現性あり）
 * B = 70点（小規模RCT・観察研究）
 * C = 60点（動物・in vitroレベル）
 * D = 50点（理論・未検証）
 */
function evidenceLevelToScore(level) {
  const mapping = {
    S: 90,
    A: 80,
    B: 70,
    C: 60,
    D: 50,
  };
  return mapping[level] || 50;
}

/**
 * 配合率ベースのエビデンススコア計算
 */
function calculateEvidenceScore(ingredients) {
  if (!ingredients || ingredients.length === 0) {
    return 50; // デフォルトスコア
  }

  // 総成分量を計算
  const totalAmount = ingredients.reduce(
    (sum, ing) => sum + (ing.amountMgPerServing || 0),
    0
  );

  if (totalAmount === 0) {
    return 50;
  }

  // 各成分のエビデンススコアを配合率で重み付け
  let weightedScore = 0;
  ingredients.forEach((ing) => {
    const amount = ing.amountMgPerServing || 0;
    const ratio = amount / totalAmount;
    const evidenceLevel = ing.ingredient?.evidenceLevel || "D";
    const score = evidenceLevelToScore(evidenceLevel);
    weightedScore += score * ratio;
  });

  return Math.round(weightedScore * 100) / 100;
}

/**
 * カテゴリ別基本安全性スコア（細分化版）
 */
function getBaseSafetyScoreByCategory(category) {
  const cat = category.toLowerCase();

  // 脂溶性ビタミン（蓄積リスクあり）- 先にチェック
  if (
    cat.includes("ビタミンa") ||
    cat.includes("ビタミンd") ||
    cat.includes("ビタミンe") ||
    cat.includes("ビタミンk")
  ) {
    return 90;
  }

  // 水溶性ビタミン（最も安全 - 過剰摂取しても排出される）
  // 一般的な「ビタミン」カテゴリも水溶性として扱う
  if (
    cat.includes("ビタミン") ||
    cat.includes("葉酸") ||
    cat.includes("ナイアシン") ||
    cat.includes("パントテン酸") ||
    cat.includes("ビオチン")
  ) {
    return 95;
  }

  // ミネラル（一般的に安全）
  if (
    cat.includes("ミネラル") ||
    cat.includes("カルシウム") ||
    cat.includes("マグネシウム") ||
    cat.includes("亜鉛") ||
    cat.includes("鉄") ||
    cat.includes("セレン") ||
    cat.includes("カリウム")
  ) {
    return 92;
  }

  // 一般ハーブ・植物抽出物
  if (cat.includes("ハーブ") || cat.includes("植物")) {
    return 88;
  }

  // アミノ酸・タンパク質
  if (cat.includes("アミノ酸") || cat.includes("タンパク質")) {
    return 93;
  }

  // 脂肪酸（オメガ3等）
  if (cat.includes("脂肪酸") || cat.includes("オメガ")) {
    return 90;
  }

  // 強作用成分（カフェイン・アルカロイド等）
  if (cat.includes("アルカロイド") || cat.includes("刺激物")) {
    return 80;
  }

  // デフォルト
  return 90;
}

/**
 * 重大度判定（ハイブリッド構成：キーワード + 文脈考慮）
 */
function assessSeverity(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  const lowerText = text.toLowerCase();

  // 高重大度キーワード（5点）
  const highSeverityKeywords = [
    "禁忌",
    "致命的",
    "肝障害",
    "腎障害",
    "出血",
    "溶血",
    "アナフィラキシー",
    "重篤",
    "中毒",
    "死亡",
    "生命",
    "危険",
  ];

  // 中重大度キーワード（3点）
  const mediumSeverityKeywords = [
    "注意",
    "胃腸障害",
    "めまい",
    "頭痛",
    "吐き気",
    "下痢",
    "不眠",
    "併用注意",
    "医師に相談",
    "悪化",
    "増加",
    "減弱",
    "影響",
  ];

  // 低重大度キーワード（1点）
  const lowSeverityKeywords = [
    "軽微",
    "発疹",
    "かゆみ",
    "不快感",
    "まれに",
    "一時的",
    "可能性",
    "ごくまれ",
    "軽度",
  ];

  // 条件付き表現（重大度-1）
  const conditionalPhrases = [
    "の方は",
    "の場合",
    "がある方",
    "既往歴がある",
    "体質の",
    "に該当する",
  ];

  // 希少疾患キーワード（重大度-1）
  const rareDiseaseKeywords = [
    "g6pd欠損症",
    "グルコース-6-リン酸脱水素酵素欠損症",
    "ヘモクロマトーシス",
    "鉄過剰症",
    "ウィルソン病",
    "先天性",
  ];

  // 基本重大度を判定
  let baseSeverity = 2; // デフォルト

  for (const keyword of highSeverityKeywords) {
    if (lowerText.includes(keyword)) {
      baseSeverity = 5;
      break;
    }
  }

  if (baseSeverity === 2) {
    for (const keyword of mediumSeverityKeywords) {
      if (lowerText.includes(keyword)) {
        baseSeverity = 3;
        break;
      }
    }
  }

  if (baseSeverity === 2) {
    for (const keyword of lowSeverityKeywords) {
      if (lowerText.includes(keyword)) {
        baseSeverity = 1;
        break;
      }
    }
  }

  // 調整ファクター適用
  let adjustment = 0;

  // 条件付き表現があれば -1
  for (const phrase of conditionalPhrases) {
    if (lowerText.includes(phrase)) {
      adjustment -= 1;
      break;
    }
  }

  // 希少疾患キーワードがあれば -1
  for (const disease of rareDiseaseKeywords) {
    if (lowerText.includes(disease)) {
      adjustment -= 1;
      break;
    }
  }

  // 最終重大度を計算（最小0、最大3点キャップ）
  const finalSeverity = Math.max(0, Math.min(3, baseSeverity + adjustment));

  return finalSeverity;
}

/**
 * 重大度ベースのペナルティ計算
 */
function calculateSeverityPenalty(data, type) {
  if (!data) return 0;

  let totalSeverity = 0;
  let items = [];

  // データ形式の正規化
  if (Array.isArray(data)) {
    items = data;
  } else if (typeof data === "string" && data.trim()) {
    // 文字列を行で分割
    items = data.split("\n").filter((line) => line.trim());
  }

  // 各項目の重大度を判定
  items.forEach((item) => {
    const severity = assessSeverity(item);
    totalSeverity += severity;
  });

  // ペナルティ計算（相互作用は1.2倍）
  const multiplier = type === "interaction" ? 1.2 : 1.0;
  const penalty = totalSeverity * multiplier;

  // 上限設定（相互作用: 9点、副作用: 15点）
  const cap = type === "interaction" ? 9 : 15;
  return Math.min(penalty, cap);
}

/**
 * 配合率ベースの安全性スコア計算（改善版）
 */
function calculateSafetyScore(ingredients) {
  if (!ingredients || ingredients.length === 0) {
    return 50;
  }

  const totalAmount = ingredients.reduce(
    (sum, ing) => sum + (ing.amountMgPerServing || 0),
    0
  );

  if (totalAmount === 0) {
    return 50;
  }

  let weightedScore = 0;

  ingredients.forEach((ing) => {
    const amount = ing.amountMgPerServing || 0;
    const ratio = amount / totalAmount;
    const category = ing.ingredient?.category || "";

    // カテゴリ別基本スコア（細分化）
    const baseScore = getBaseSafetyScoreByCategory(category);

    // 重大度ベースの副作用ペナルティ
    const sideEffectPenalty = calculateSeverityPenalty(
      ing.ingredient?.sideEffects,
      "sideEffect"
    );

    // 重大度ベースの相互作用ペナルティ
    const interactionPenalty = calculateSeverityPenalty(
      ing.ingredient?.interactions,
      "interaction"
    );

    // 最終スコア
    const ingredientScore = Math.max(
      baseScore - sideEffectPenalty - interactionPenalty,
      0
    );

    weightedScore += ingredientScore * ratio;
  });

  return Math.round(weightedScore * 100) / 100;
}

/**
 * メイン処理
 */
async function syncProductScores() {
  // コマンドライン引数の解析
  const args = process.argv.slice(2);
  const limitArg = args.find((arg) => arg.startsWith("--limit"));
  const limit = limitArg ? parseInt(limitArg.split("=")[1]) : null;
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  console.log("🚀 商品スコア自動同期スクリプト\n");
  console.log(`  処理件数: ${limit ? `${limit}件` : "全件"}`);
  console.log(`  モード: ${dryRun ? "DRY RUN" : "本番実行"}`);
  console.log(`  上書き: ${force ? "有効" : "無効"}\n`);

  try {
    // 全商品を取得（成分データ含む）
    console.log("📥 Sanityから商品データを取得中...");
    const query = `*[_type == "product"]${limit ? `[0...${limit}]` : ""}{
      _id,
      name,
      slug,
      scores,
      servingsPerDay,
      servingsPerContainer,
      ingredients[]{
        amountMgPerServing,
        ingredient->{
          _id,
          name,
          evidenceLevel,
          category,
          sideEffects,
          interactions
        }
      }
    }`;

    const products = await client.fetch(query);
    console.log(`✅ ${products.length}件の商品を取得しました\n`);

    if (products.length === 0) {
      console.log("⚠️ 商品が見つかりませんでした");
      return;
    }

    // 各商品のスコアを計算・更新
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      console.log(`\n📦 処理中: ${product.name.substring(0, 60)}...`);

      try {
        // 既存スコアがあり、forceフラグがない場合はスキップ
        if (
          !force &&
          product.scores?.evidence &&
          product.scores?.safety
        ) {
          console.log(
            `  ⏭️ スキップ: 既存スコアあり（Evidence: ${product.scores.evidence}点, Safety: ${product.scores.safety}点）`
          );
          skippedCount++;
          continue;
        }

        // エビデンススコア計算
        const evidenceScore = calculateEvidenceScore(product.ingredients || []);
        const evidenceRank = scoreToRank(evidenceScore);

        // 安全性スコア計算
        const safetyScore = calculateSafetyScore(product.ingredients || []);
        const safetyRank = scoreToRank(safetyScore);

        console.log(`  💡 エビデンススコア: ${evidenceScore}点 → ${evidenceRank}ランク`);
        console.log(`  🛡️ 安全性スコア: ${safetyScore}点 → ${safetyRank}ランク`);

        if (!dryRun) {
          // Sanityに保存（自動公開）
          await client
            .patch(product._id)
            .set({
              scores: {
                evidence: evidenceScore,
                safety: safetyScore,
              },
              "tierRatings.evidenceRank": evidenceRank,
              "tierRatings.safetyRank": safetyRank,
            })
            .commit({ autoPublish: true });

          console.log(`  ✅ 更新完了`);
          updatedCount++;
        } else {
          console.log(`  ✅ 更新予定（DRY RUN）`);
          updatedCount++;
        }

        // API制限を考慮して少し待機
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ❌ エラー: ${error.message}`);
        errorCount++;
      }
    }

    // 結果表示
    console.log("\n\n📊 同期結果:");
    console.log(`  ✅ 更新: ${updatedCount}件`);
    console.log(`  ⏭️ スキップ: ${skippedCount}件`);
    console.log(`  ❌ エラー: ${errorCount}件`);

    if (dryRun) {
      console.log("\n💡 実際に更新するには --dry-run を外して実行してください");
    }

    if (!force && skippedCount > 0) {
      console.log("\n💡 既存スコアを上書きするには --force オプションを使用してください");
    }
  } catch (error) {
    console.error("❌ エラー:", error);
    process.exit(1);
  }
}

// 実行
syncProductScores();
