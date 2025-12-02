#!/usr/bin/env node

/**
 * 成分ガイドの表現を科学的表現に復元するスクリプト
 *
 * コンプライアンス修正で置換された表現を、
 * 成分ガイドに適した科学的表現に戻します。
 *
 * 使用方法:
 *   node scripts/restore-ingredients-approximate.mjs          # 確認のみ
 *   node scripts/restore-ingredients-approximate.mjs --fix    # 実際に修正
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localをパース
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

// 逆変換ルール（商品用の表現 → 科学的表現）
const REVERSE_RULES = [
  // 代謝・エネルギー関連
  { pattern: /運動時のエネルギー消費をサポート/g, replacement: "脂肪燃焼を促進" },
  { pattern: /運動効率をサポート/g, replacement: "脂肪代謝を促進" },
  { pattern: /スリムな毎日をサポート/g, replacement: "体脂肪の減少に寄与" },
  { pattern: /活動的な毎日をサポート/g, replacement: "代謝を促進" },
  { pattern: /いきいきとした毎日に/g, replacement: "新陳代謝を活性化" },

  // 血液・循環関連
  { pattern: /めぐりをサポート/g, replacement: "血流を改善" },
  { pattern: /すっきりとした毎日に/g, replacement: "血液の健康を維持" },
  { pattern: /血管の健康をサポート/g, replacement: "血管機能を維持" },

  // 血糖・コレステロール関連
  { pattern: /糖質バランスをサポート/g, replacement: "血糖値の調節に関与" },
  { pattern: /健康的な生活習慣をサポート/g, replacement: "代謝機能の維持に貢献" },
  { pattern: /脂質バランスをサポート/g, replacement: "コレステロール代謝に関与" },
  { pattern: /健康的な食生活をサポート/g, replacement: "脂質代謝を助ける" },
  { pattern: /バランスの良い食生活をサポート/g, replacement: "血糖調節に寄与" },

  // 免疫・健康関連
  { pattern: /健康維持をサポート/g, replacement: "免疫機能を調節" },
  { pattern: /毎日の元気をサポート/g, replacement: "抵抗力の維持に寄与" },
  { pattern: /健やかな毎日をサポート/g, replacement: "免疫系の健康を維持" },
  { pattern: /健康管理をサポート/g, replacement: "免疫応答に関与" },

  // 抗菌・清潔関連
  { pattern: /清潔感/g, replacement: "抗菌作用" },
  { pattern: /すっきり感/g, replacement: "抗菌特性" },
  { pattern: /清潔な状態/g, replacement: "殺菌効果" },
  { pattern: /衛生的/g, replacement: "消毒作用" },
  { pattern: /清潔を保つ/g, replacement: "細菌の増殖を抑制" },

  // ホルモン・神経関連
  { pattern: /健やかなリズムをサポート/g, replacement: "ホルモンバランスを調節" },
  { pattern: /女性の健康をサポート/g, replacement: "ホルモンバランスの維持に寄与" },
  { pattern: /体内バランスをサポート/g, replacement: "内分泌系の調節に関与" },

  // 精神・認知関連
  { pattern: /心の健康をサポート/g, replacement: "精神的健康の維持に寄与" },
  { pattern: /考える力をサポート/g, replacement: "認知機能を維持" },
  { pattern: /脳の健康をサポート/g, replacement: "脳機能の維持に寄与" },
  { pattern: /快適な毎日をサポート/g, replacement: "炎症反応を調節" },
  { pattern: /リラックスをサポート/g, replacement: "ストレス応答を調節" },

  // 老化・美容関連
  { pattern: /年齢に応じた美容/g, replacement: "抗酸化作用による老化予防" },
  { pattern: /いつまでも元気に/g, replacement: "加齢に伴う機能低下を抑制" },
  { pattern: /エイジングケア/g, replacement: "抗酸化作用" },
  { pattern: /年齢に応じた健康をサポート/g, replacement: "老化に伴う変化を緩和" },
  { pattern: /いつまでも若々しく/g, replacement: "細胞の老化を遅延" },
  { pattern: /ハリのある毎日を/g, replacement: "皮膚の弾力性を維持" },
  { pattern: /透明感のある肌に/g, replacement: "色素沈着を抑制" },
  { pattern: /引き締まった印象に/g, replacement: "皮膚のたるみを予防" },

  // アレルギー・その他
  { pattern: /季節の変化に対応/g, replacement: "アレルギー反応を緩和" },
  { pattern: /体調管理をサポート/g, replacement: "免疫応答を調節" },
  { pattern: /肌の調子を整える/g, replacement: "皮膚の健康を維持" },
];

// テキストを科学的表現に変換
function restoreScientificText(text) {
  if (!text || typeof text !== "string") {
    return { text, changed: false, changes: [] };
  }

  let result = text;
  let changed = false;
  const changes = [];

  for (const rule of REVERSE_RULES) {
    if (rule.pattern.test(result)) {
      const original = result.match(rule.pattern)?.[0];
      result = result.replace(rule.pattern, rule.replacement);
      changed = true;
      changes.push({ from: original, to: rule.replacement });
      // Reset regex lastIndex
      rule.pattern.lastIndex = 0;
    }
  }

  return { text: result, changed, changes };
}

// 成分の全テキストフィールドを処理
function restoreIngredient(ingredient) {
  const updates = {};
  let hasChanges = false;
  const allChanges = [];

  // description
  if (ingredient.description) {
    const { text, changed, changes } = restoreScientificText(ingredient.description);
    if (changed) {
      updates.description = text;
      hasChanges = true;
      allChanges.push(...changes.map(c => ({ field: "description", ...c })));
    }
  }

  // benefits (配列)
  if (ingredient.benefits && Array.isArray(ingredient.benefits)) {
    const newBenefits = ingredient.benefits.map((benefit, idx) => {
      const { text, changed, changes } = restoreScientificText(benefit);
      if (changed) {
        hasChanges = true;
        allChanges.push(...changes.map(c => ({ field: `benefits[${idx}]`, ...c })));
      }
      return text;
    });
    if (hasChanges) {
      updates.benefits = newBenefits;
    }
  }

  // recommendedDosage
  if (ingredient.recommendedDosage) {
    const { text, changed, changes } = restoreScientificText(ingredient.recommendedDosage);
    if (changed) {
      updates.recommendedDosage = text;
      hasChanges = true;
      allChanges.push(...changes.map(c => ({ field: "recommendedDosage", ...c })));
    }
  }

  // sideEffects
  if (ingredient.sideEffects) {
    const { text, changed, changes } = restoreScientificText(ingredient.sideEffects);
    if (changed) {
      updates.sideEffects = text;
      hasChanges = true;
      allChanges.push(...changes.map(c => ({ field: "sideEffects", ...c })));
    }
  }

  // interactions
  if (ingredient.interactions) {
    if (typeof ingredient.interactions === "string") {
      const { text, changed, changes } = restoreScientificText(ingredient.interactions);
      if (changed) {
        updates.interactions = text;
        hasChanges = true;
        allChanges.push(...changes.map(c => ({ field: "interactions", ...c })));
      }
    } else if (Array.isArray(ingredient.interactions)) {
      const newInteractions = ingredient.interactions.map((item, idx) => {
        const { text, changed, changes } = restoreScientificText(item);
        if (changed) {
          hasChanges = true;
          allChanges.push(...changes.map(c => ({ field: `interactions[${idx}]`, ...c })));
        }
        return text;
      });
      if (hasChanges) {
        updates.interactions = newInteractions;
      }
    }
  }

  // faqs
  if (ingredient.faqs && Array.isArray(ingredient.faqs)) {
    let faqsChanged = false;
    const newFaqs = ingredient.faqs.map((faq, idx) => {
      const newFaq = { ...faq };
      if (faq.question) {
        const { text, changed, changes } = restoreScientificText(faq.question);
        if (changed) {
          newFaq.question = text;
          faqsChanged = true;
          allChanges.push(...changes.map(c => ({ field: `faqs[${idx}].question`, ...c })));
        }
      }
      if (faq.answer) {
        const { text, changed, changes } = restoreScientificText(faq.answer);
        if (changed) {
          newFaq.answer = text;
          faqsChanged = true;
          allChanges.push(...changes.map(c => ({ field: `faqs[${idx}].answer`, ...c })));
        }
      }
      return newFaq;
    });
    if (faqsChanged) {
      updates.faqs = newFaqs;
      hasChanges = true;
    }
  }

  return { updates, hasChanges, changes: allChanges };
}

async function main() {
  const args = process.argv.slice(2);
  const doFix = args.includes("--fix");

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   成分ガイド 科学的表現への復元                            ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  if (doFix) {
    console.log("⚠️  修正モード: 科学的表現に置換します\n");
  } else {
    console.log("🔍 確認モード: 変更対象を表示します\n");
  }

  try {
    console.log("🔍 Sanityから成分データを取得中...");
    const ingredients = await client.fetch(`
      *[_type == "ingredient"] {
        _id,
        name,
        description,
        benefits,
        recommendedDosage,
        sideEffects,
        interactions,
        faqs
      }
    `);
    console.log(`   → ${ingredients.length}件の成分を取得\n`);

    const toFix = [];

    for (const ingredient of ingredients) {
      const { updates, hasChanges, changes } = restoreIngredient(ingredient);
      if (hasChanges) {
        toFix.push({
          id: ingredient._id,
          name: ingredient.name,
          updates,
          changes,
        });
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📋 修正対象: ${toFix.length}件\n`);

    if (toFix.length === 0) {
      console.log("✅ 修正が必要な成分はありません。\n");
      process.exit(0);
    }

    // 詳細を表示
    for (const item of toFix) {
      console.log(`📄 ${item.name}`);
      for (const change of item.changes.slice(0, 3)) {
        console.log(`   「${change.from}」→「${change.to}」`);
      }
      if (item.changes.length > 3) {
        console.log(`   ... 他 ${item.changes.length - 3}件の変更`);
      }
      console.log("");
    }

    if (doFix) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 修正を実行中...\n");

      let fixedCount = 0;
      let errorCount = 0;

      for (const item of toFix) {
        try {
          await client.patch(item.id).set(item.updates).commit();
          console.log(`✅ ${item.name}`);
          fixedCount++;
        } catch (error) {
          console.log(`❌ ${item.name}: ${error.message}`);
          errorCount++;
        }
      }

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 修正結果\n");
      console.log(`   ✅ 成功: ${fixedCount}件`);
      console.log(`   ❌ エラー: ${errorCount}件\n`);

      if (fixedCount > 0) {
        console.log("🎉 成分ガイドが科学的表現に復元されました！\n");
      }
    } else {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💡 次のステップ\n");
      console.log("   修正を実行するには:");
      console.log("   node scripts/restore-ingredients-approximate.mjs --fix\n");
    }

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

main();
