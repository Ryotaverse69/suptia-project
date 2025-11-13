#!/usr/bin/env node

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]?.trim();
const SANITY_DATASET = envContent.match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]?.trim();
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: SANITY_API_TOKEN,
});

function assessSeverity(text) {
  if (!text || typeof text !== "string") return 0;
  const lowerText = text.toLowerCase();

  const highSeverityKeywords = ["禁忌", "致命的", "肝障害", "腎障害", "出血", "溶血", "アナフィラキシー", "重篤", "中毒", "死亡", "生命", "危険"];
  const mediumSeverityKeywords = ["注意", "胃腸障害", "めまい", "頭痛", "吐き気", "下痢", "不眠", "併用注意", "医師に相談", "悪化", "増加", "減弱", "影響"];
  const lowSeverityKeywords = ["軽微", "発疹", "かゆみ", "不快感", "まれに", "一時的", "可能性", "ごくまれ", "軽度"];
  const conditionalPhrases = ["の方は", "の場合", "がある方", "既往歴がある", "体質の", "に該当する"];
  const rareDiseaseKeywords = ["g6pd欠損症", "グルコース-6-リン酸脱水素酵素欠損症", "ヘモクロマトーシス", "鉄過剰症", "ウィルソン病", "先天性"];

  let baseSeverity = 2;
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

  let adjustment = 0;
  for (const phrase of conditionalPhrases) {
    if (lowerText.includes(phrase)) {
      adjustment -= 1;
      break;
    }
  }
  for (const disease of rareDiseaseKeywords) {
    if (lowerText.includes(disease)) {
      adjustment -= 1;
      break;
    }
  }

  const finalSeverity = Math.max(0, Math.min(3, baseSeverity + adjustment));
  return finalSeverity;
}

function calculateSeverityPenalty(data, type) {
  if (!data) return 0;

  let items = [];
  let totalSeverity = 0;

  if (Array.isArray(data)) {
    items = data.filter((item) => item && typeof item === "string");
  } else if (typeof data === "string") {
    items = data.split("\n").filter((line) => line.trim());
  }

  items.forEach((item) => {
    const severity = assessSeverity(item);
    console.log(`    "${item.substring(0, 50)}..." → 重大度: ${severity}点`);
    totalSeverity += severity;
  });

  const multiplier = type === "interaction" ? 1.2 : 1.0;
  const penalty = totalSeverity * multiplier;
  const cap = type === "interaction" ? 9 : 15;
  const finalPenalty = Math.min(penalty, cap);

  console.log(`  → 合計重大度: ${totalSeverity}点`);
  console.log(`  → 倍率適用後: ${penalty}点 (${multiplier}倍)`);
  console.log(`  → キャップ適用後: ${finalPenalty}点 (上限${cap})`);

  return finalPenalty;
}

async function debugCalc() {
  try {
    const query = `*[_type == "product" && name match "*ビタミンC*"][0]{
      _id,
      name,
      scores,
      ingredients[]{
        amountMgPerServing,
        ingredient->{
          _id,
          name,
          category,
          sideEffects,
          interactions
        }
      }
    }`;

    const product = await client.fetch(query);

    console.log("🔍 ビタミンC商品の安全性スコア計算デバッグ\n");
    console.log(`📦 商品: ${product.name.substring(0, 80)}...\n`);
    console.log(`📊 現在のスコア: ${product.scores?.safety || '未設定'}点\n`);

    const totalAmount = product.ingredients.reduce((sum, ing) => sum + (ing.amountMgPerServing || 0), 0);
    console.log(`📏 総配合量: ${totalAmount}mg\n`);

    let weightedScore = 0;

    product.ingredients.forEach((ing, idx) => {
      const amount = ing.amountMgPerServing || 0;
      const ratio = amount / totalAmount;
      const baseScore = 95; // ビタミンの基本スコア

      console.log(`\n🧪 成分 ${idx + 1}: ${ing.ingredient?.name}`);
      console.log(`  配合量: ${amount}mg (比率: ${(ratio * 100).toFixed(2)}%)`);
      console.log(`  カテゴリ: ${ing.ingredient?.category || '不明'}`);
      console.log(`  基本スコア: ${baseScore}点`);

      console.log(`\n  📋 副作用ペナルティ:`);
      const sideEffectPenalty = calculateSeverityPenalty(ing.ingredient?.sideEffects, "sideEffect");

      console.log(`\n  📋 相互作用ペナルティ:`);
      const interactionPenalty = calculateSeverityPenalty(ing.ingredient?.interactions, "interaction");

      const ingredientScore = Math.max(baseScore - sideEffectPenalty - interactionPenalty, 0);
      console.log(`\n  最終スコア: ${baseScore} - ${sideEffectPenalty} - ${interactionPenalty} = ${ingredientScore}点`);

      weightedScore += ingredientScore * ratio;
      console.log(`  加重スコア: ${ingredientScore} × ${ratio.toFixed(4)} = ${(ingredientScore * ratio).toFixed(2)}点`);
    });

    const finalScore = Math.round(weightedScore * 100) / 100;
    console.log(`\n\n🎯 最終安全性スコア: ${finalScore}点`);
    console.log(`ランク: ${finalScore >= 80 ? "A" : finalScore >= 70 ? "B" : finalScore >= 60 ? "C" : "D"}`);

  } catch (error) {
    console.error("❌ エラー:", error);
    process.exit(1);
  }
}

debugCalc();
