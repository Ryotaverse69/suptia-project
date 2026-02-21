#!/usr/bin/env node

/**
 * 成分ガイドFAQ一括生成スクリプト
 *
 * Anthropic SDK (Haiku) を使用して、全成分ページにFAQ Q&Aペアを自動生成。
 * AEO（Answer Engine Optimization）対応 — AI検索エンジンが引用しやすい構造化FAQを作成。
 *
 * 使い方:
 *   node scripts/generate-ingredient-faqs.mjs                    # FAQ未設定の成分のみ
 *   node scripts/generate-ingredient-faqs.mjs --all              # 全成分を再生成
 *   node scripts/generate-ingredient-faqs.mjs --slug=vitamin-d   # 特定成分のみ
 *   node scripts/generate-ingredient-faqs.mjs --dry-run          # 実行確認のみ（書き込みなし）
 */

import { createClient } from "@sanity/client";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ========== 設定 ==========

const BATCH_DELAY_MS = 1000; // API呼び出し間の待機時間
const FAQ_COUNT = { min: 5, max: 7 }; // 生成するFAQ数

// 薬機法NGワード
const PROHIBITED_WORDS = [
  "治る",
  "治す",
  "治療",
  "予防",
  "防ぐ",
  "効く",
  "効果がある",
  "改善する",
  "治癒",
  "根治",
  "完治",
  "特効",
  "万能",
  "必ず",
  "絶対",
  "確実に",
  "医薬品",
  "薬",
];

// 薬機法OK表現（プロンプトで指示）
const COMPLIANT_EXPRESSIONS = [
  "〜をサポートする可能性があります",
  "〜に役立つと報告されています",
  "研究では〜という結果が示されています",
  "〜の維持に寄与すると考えられています",
  "〜が期待されています",
];

// ========== 環境変数読み込み ==========

const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

// ========== クライアント初期化 ==========

const sanity = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
});

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

// ========== コマンドライン引数 ==========

const args = process.argv.slice(2);
const flags = {
  all: args.includes("--all"),
  dryRun: args.includes("--dry-run"),
  slug: args.find((a) => a.startsWith("--slug="))?.split("=")[1] || null,
};

// ========== メイン処理 ==========

async function main() {
  console.log("=== 成分ガイドFAQ一括生成 ===\n");
  console.log(`モード: ${flags.dryRun ? "DRY RUN（書き込みなし）" : "本番"}`);
  console.log(
    `対象: ${flags.slug ? flags.slug : flags.all ? "全成分（再生成含む）" : "FAQ未設定の成分のみ"}\n`,
  );

  // 成分データ取得
  const query = flags.slug
    ? `*[_type == "ingredient" && slug.current == $slug][0]{
        _id, name, nameEn, "slug": slug.current, category,
        description, benefits, sideEffects, interactions,
        recommendedDosage, evidenceLevel, faqs
      }`
    : `*[_type == "ingredient"] | order(name asc) {
        _id, name, nameEn, "slug": slug.current, category,
        description, benefits, sideEffects, interactions,
        recommendedDosage, evidenceLevel, faqs
      }`;

  const result = flags.slug
    ? await sanity.fetch(query, { slug: flags.slug })
    : await sanity.fetch(query);

  const ingredients = flags.slug ? (result ? [result] : []) : result;

  if (ingredients.length === 0) {
    console.log("対象の成分が見つかりません。");
    return;
  }

  // FAQ未設定の成分をフィルタ
  const targets = flags.all
    ? ingredients
    : ingredients.filter(
        (ing) => !ing.faqs || ing.faqs.length === 0 || ing.faqs.length < 3,
      );

  console.log(`全成分数: ${ingredients.length}`);
  console.log(`FAQ生成対象: ${targets.length}\n`);

  if (targets.length === 0) {
    console.log("全成分にFAQが設定済みです。--all フラグで再生成できます。");
    return;
  }

  // 生成ループ
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const ingredient = targets[i];
    const progress = `[${i + 1}/${targets.length}]`;

    try {
      console.log(
        `${progress} ${ingredient.name}（${ingredient.nameEn || ingredient.slug}）...`,
      );

      const faqs = await generateFAQs(ingredient);

      // 薬機法チェック
      const cleanedFaqs = faqs.map((faq) => ({
        question: faq.question,
        answer: sanitizeAnswer(faq.answer),
      }));

      // バリデーション
      const validFaqs = cleanedFaqs.filter(
        (faq) =>
          faq.question.length > 0 &&
          faq.answer.length >= 150 &&
          !hasProhibitedWords(faq.answer),
      );

      if (validFaqs.length < 3) {
        console.log(
          `  ⚠ バリデーション後のFAQ数が不足（${validFaqs.length}/3以上必要）。スキップ。`,
        );
        errorCount++;
        continue;
      }

      if (flags.dryRun) {
        console.log(`  ✓ ${validFaqs.length}件のFAQ生成完了（dry-run）`);
        validFaqs.forEach((faq, j) => {
          console.log(`    Q${j + 1}: ${faq.question}`);
          console.log(`    A${j + 1}: ${faq.answer.substring(0, 80)}...`);
        });
      } else {
        await sanity
          .patch(ingredient._id)
          .set({ faqs: validFaqs })
          .commit();
        console.log(`  ✓ ${validFaqs.length}件のFAQをSanityに保存`);
      }

      successCount++;
    } catch (err) {
      console.error(`  ✗ エラー: ${err.message}`);
      errorCount++;
    }

    // レート制限回避
    if (i < targets.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  // サマリー
  console.log("\n=== 完了 ===");
  console.log(`成功: ${successCount}件`);
  console.log(`エラー: ${errorCount}件`);
  if (flags.dryRun) {
    console.log("\n※ dry-runモードのため、Sanityへの書き込みは行われていません。");
  }
}

// ========== FAQ生成（Anthropic Haiku） ==========

async function generateFAQs(ingredient) {
  const context = buildIngredientContext(ingredient);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `あなたはサプリメントの専門知識を持つ健康情報ライターです。
以下の成分情報をもとに、${FAQ_COUNT.min}〜${FAQ_COUNT.max}個のFAQ（よくある質問と回答）を作成してください。

## 成分情報
${context}

## 作成ルール
1. 質問は消費者が実際に検索しそうな自然な疑問形にする
2. 回答は200〜350文字で具体的に書く
3. 必ず以下の薬機法ルールを守る:
   - ❌ 禁止: 「治る」「治す」「治療」「予防」「防ぐ」「効く」「改善する」
   - ⭕ 推奨: 「〜をサポートする可能性があります」「研究では〜と報告されています」「〜の維持に寄与すると考えられています」
4. エビデンスレベルや具体的な数値（推奨摂取量、研究結果）を含める
5. 安全性・副作用に関する質問を最低1つ含める
6. 他のサプリメントとの相互作用に関する質問を含める（相互作用情報がある場合）

## 出力形式
JSON配列で出力してください。他のテキストは一切不要です。
[
  {"question": "質問文", "answer": "回答文"},
  ...
]`,
      },
    ],
  });

  const text = message.content[0].text.trim();

  // JSON抽出（```json ... ``` にも対応）
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("FAQ JSONの抽出に失敗しました");
  }

  return JSON.parse(jsonMatch[0]);
}

// ========== ヘルパー関数 ==========

function buildIngredientContext(ingredient) {
  const parts = [];

  parts.push(`名前: ${ingredient.name}（${ingredient.nameEn || ""}）`);
  parts.push(`カテゴリ: ${ingredient.category || "未分類"}`);

  if (ingredient.evidenceLevel) {
    parts.push(`エビデンスレベル: ${ingredient.evidenceLevel}`);
  }

  if (ingredient.description) {
    parts.push(`概要: ${ingredient.description}`);
  }

  if (ingredient.benefits) {
    const benefits = Array.isArray(ingredient.benefits)
      ? ingredient.benefits.join("、")
      : ingredient.benefits;
    parts.push(`期待される効果: ${benefits}`);
  }

  if (ingredient.recommendedDosage) {
    parts.push(`推奨摂取量: ${ingredient.recommendedDosage}`);
  }

  if (ingredient.sideEffects) {
    const sideEffects = Array.isArray(ingredient.sideEffects)
      ? ingredient.sideEffects.join("、")
      : ingredient.sideEffects;
    parts.push(`副作用: ${sideEffects}`);
  }

  if (ingredient.interactions) {
    const interactions = Array.isArray(ingredient.interactions)
      ? ingredient.interactions.join("、")
      : ingredient.interactions;
    parts.push(`相互作用: ${interactions}`);
  }

  return parts.join("\n");
}

function hasProhibitedWords(text) {
  return PROHIBITED_WORDS.some((word) => text.includes(word));
}

function sanitizeAnswer(answer) {
  let text = answer;

  // 禁止表現の自動置換
  const replacements = [
    [/効果があります/g, "効果が期待されています"],
    [/改善します/g, "サポートする可能性があります"],
    [/治ります/g, "ケアに役立つと報告されています"],
    [/予防できます/g, "リスク低減に寄与すると考えられています"],
    [/防ぎます/g, "リスク低減をサポートすると報告されています"],
    [/効きます/g, "作用すると報告されています"],
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  return text;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ========== 実行 ==========

main().catch((err) => {
  console.error("致命的エラー:", err);
  process.exit(1);
});
