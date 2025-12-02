#!/usr/bin/env node

/**
 * コンプライアンス違反自動修正スクリプト（商品のみ）
 *
 * 商品説明の違反を自動的に修正し、Sanityにアップデートします。
 *
 * ※ 成分ガイド（ingredient）は科学的情報であり、
 *    出典付きの記述は薬機法の適用対象外のため修正しません。
 *
 * 使用方法:
 *   node scripts/fix-compliance-violations.mjs
 *   node scripts/fix-compliance-violations.mjs --dry-run  # 実際には更新しない
 */

import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync } from "fs";
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

// 修正ルール（パターン → 修正後のテキスト）
const FIX_RULES = [
  // 薬機法（Critical）- 疾病治療・予防
  { pattern: /(?:がん|癌)(?:を|が|に)?(?:治す|治る|治療)/gi, replacement: "健康維持をサポート" },
  { pattern: /(?:がん|癌)(?:を|が|に)?(?:予防|防ぐ)/gi, replacement: "健やかな毎日をサポート" },
  { pattern: /糖尿病(?:を|が|に)?(?:治す|治る|治療)/gi, replacement: "糖質バランスをサポート" },
  { pattern: /糖尿病(?:を|が)?予防/gi, replacement: "健康的な生活習慣をサポート" },
  { pattern: /高血圧(?:を|が|に)?(?:治す|治る|治療|予防|改善)/gi, replacement: "めぐりをサポート" },
  { pattern: /動脈硬化(?:を|が|に)?(?:治す|治る|治療|予防|改善)/gi, replacement: "血管の健康をサポート" },
  { pattern: /うつ病(?:を|が|に)?(?:治す|治る|予防|改善)/gi, replacement: "心の健康をサポート" },
  { pattern: /認知症(?:を|が|に)?(?:治す|治る|予防|改善)/gi, replacement: "考える力をサポート" },
  { pattern: /アルツハイマー(?:を|が|に)?(?:治す|治る|予防|改善)/gi, replacement: "脳の健康をサポート" },
  { pattern: /アトピー(?:を|が|に)?(?:治す|治る|治療|改善)/gi, replacement: "肌の調子を整える" },
  { pattern: /花粉症(?:を|が|に)?(?:治す|治る|治療|改善)/gi, replacement: "季節の変化に対応" },
  { pattern: /アレルギー(?:を|が|に)?(?:治す|治る|治療|改善)/gi, replacement: "体調管理をサポート" },

  // 血圧・血糖値
  { pattern: /血圧(?:を|が)?(?:下げる|低下させる|低下)/gi, replacement: "めぐりをサポート" },
  { pattern: /血糖値(?:を|が)?(?:下げる|低下させる|低下)/gi, replacement: "糖質バランスをサポート" },
  { pattern: /血圧(?:を|が)?正常化/gi, replacement: "健康的な生活をサポート" },
  { pattern: /血糖値(?:を|が)?正常化/gi, replacement: "バランスの良い食生活をサポート" },

  // コレステロール・中性脂肪
  { pattern: /コレステロール(?:を|が)?(?:下げる|減らす|低下)/gi, replacement: "脂質バランスをサポート" },
  { pattern: /中性脂肪(?:を|が)?(?:下げる|減らす|低下)/gi, replacement: "健康的な食生活をサポート" },

  // 薬機法（High）- 医薬品的効能
  { pattern: /(?:痛み|炎症|腫れ)(?:を|が)?(?:取る|消す|抑える)/gi, replacement: "快適な毎日をサポート" },
  { pattern: /(?:痛み|炎症|腫れ)(?:を|が)?和らげる/gi, replacement: "リラックスをサポート" },
  { pattern: /免疫力(?:を|が)?(?:高める|強化|アップ)/gi, replacement: "健康維持をサポート" },
  { pattern: /抵抗力(?:を|が)?(?:高める|強化|アップ)/gi, replacement: "毎日の元気をサポート" },
  { pattern: /殺菌(?:効果|作用)?/gi, replacement: "清潔感" },
  { pattern: /抗菌(?:効果|作用)?/gi, replacement: "すっきり感" },
  { pattern: /滅菌(?:効果|作用)?/gi, replacement: "清潔な状態" },
  { pattern: /消毒(?:効果|作用)?/gi, replacement: "衛生的" },
  { pattern: /ウイルス(?:を|に)?(?:殺す|死滅|除去)/gi, replacement: "健康管理をサポート" },
  { pattern: /細菌(?:を|に)?(?:殺す|死滅|除去)/gi, replacement: "清潔を保つ" },
  { pattern: /病原菌(?:を|に)?(?:殺す|死滅|除去)/gi, replacement: "健康維持に" },

  // 脂肪燃焼・代謝
  { pattern: /脂肪燃焼/gi, replacement: "運動時のエネルギー消費をサポート" },
  { pattern: /脂肪を燃やす/gi, replacement: "運動効率をサポート" },
  { pattern: /脂肪を溶かす/gi, replacement: "スリムな毎日をサポート" },
  { pattern: /代謝(?:を|が)?(?:上げる|促進|活性化)/gi, replacement: "活動的な毎日をサポート" },
  { pattern: /新陳代謝(?:を|が)?(?:上げる|促進|活性化)/gi, replacement: "いきいきとした毎日に" },

  // ホルモン・血液
  { pattern: /ホルモン(?:を|の)?(?:調整|バランス|整える)/gi, replacement: "健やかなリズムをサポート" },
  { pattern: /ホルモンバランス/gi, replacement: "女性の健康をサポート" },
  { pattern: /内分泌(?:を|の)?(?:調整|バランス|整える)/gi, replacement: "体内バランスをサポート" },
  { pattern: /血液(?:を|が)?サラサラ/gi, replacement: "めぐりをサポート" },
  { pattern: /血液(?:を|が)?(?:浄化|きれい)/gi, replacement: "すっきりとした毎日に" },
  { pattern: /血流(?:を|が)?(?:サラサラ|浄化|きれい)/gi, replacement: "めぐりをサポート" },

  // 若返り・老化
  { pattern: /若返り/gi, replacement: "年齢に応じた美容" },
  { pattern: /若返る/gi, replacement: "いつまでも元気に" },
  { pattern: /アンチエイジング/gi, replacement: "エイジングケア" },
  { pattern: /老化(?:を|が)?(?:防ぐ|止める|遅らせる)/gi, replacement: "年齢に応じた健康をサポート" },
  { pattern: /加齢(?:を|が)?(?:防ぐ|止める|遅らせる)/gi, replacement: "いつまでも若々しく" },
  { pattern: /シワ(?:を|が)?(?:消す|なくす|改善|除去)/gi, replacement: "ハリのある毎日を" },
  { pattern: /シミ(?:を|が)?(?:消す|なくす|改善|除去)/gi, replacement: "透明感のある肌に" },
  { pattern: /たるみ(?:を|が)?(?:消す|なくす|改善|除去)/gi, replacement: "引き締まった印象に" },

  // 健康増進法 - 誇大表示
  { pattern: /絶対(?:に)?(?:効く|効果|痩せる|治る)/gi, replacement: "しっかりサポート" },
  { pattern: /確実(?:に)?(?:効く|効果|痩せる|治る)/gi, replacement: "継続的にサポート" },
  { pattern: /必ず(?:効く|効果|痩せる|治る)/gi, replacement: "毎日のサポートに" },
  { pattern: /100%(?:効く|効果|痩せる|治る)/gi, replacement: "サポート" },
  { pattern: /医師(?:が)?(?:推奨|推薦|お墨付き)/gi, replacement: "専門家も注目" },
  { pattern: /専門家(?:が)?(?:推奨|推薦|お墨付き)/gi, replacement: "多くの方に選ばれています" },
  { pattern: /学者(?:が)?(?:推奨|推薦|お墨付き)/gi, replacement: "研究されている成分" },
  { pattern: /臨床試験(?:で)?(?:証明|実証|確認)(?:済み)?/gi, replacement: "研究が行われています" },
  { pattern: /奇跡(?:の|な)?(?:効果|成分|商品)/gi, replacement: "注目の" },
  { pattern: /驚異(?:の|な)?(?:効果|成分|商品)/gi, replacement: "話題の" },
  { pattern: /画期的(?:の|な)?(?:効果|成分|商品)/gi, replacement: "新しい" },
  { pattern: /革命的(?:の|な)?(?:効果|成分|商品)/gi, replacement: "こだわりの" },

  // 痩身関連
  { pattern: /飲むだけ(?:で)?(?:痩せる|ダイエット)/gi, replacement: "ダイエットをサポート" },
  { pattern: /食べるだけ(?:で)?(?:痩せる|ダイエット)/gi, replacement: "食事管理をサポート" },
  { pattern: /塗るだけ(?:で)?(?:痩せる|ダイエット)/gi, replacement: "ボディケアをサポート" },
  { pattern: /短期間(?:で)?(?:痩せる|効果)/gi, replacement: "継続的なサポート" },
  { pattern: /たった\d+日(?:で)?(?:痩せる|効果)/gi, replacement: "毎日のサポートに" },
  { pattern: /すぐに(?:痩せる|効果)/gi, replacement: "日々のサポートに" },
  { pattern: /食事制限(?:なし|不要|いらない)(?:で)?(?:痩せる)?/gi, replacement: "バランスの良い生活と併せて" },
  { pattern: /運動(?:なし|不要|いらない)(?:で)?(?:痩せる)?/gi, replacement: "適度な運動と併せて" },

  // 食品衛生法 - 無添加表示
  { pattern: /添加物ゼロ/gi, replacement: "余計なものを加えない製法" },
  { pattern: /添加物フリー/gi, replacement: "シンプルな原材料" },
  { pattern: /保存料不使用/gi, replacement: "フレッシュな状態をお届け" },

  // 食品表示法
  { pattern: /アレルギー(?:の)?(?:心配なし|安心|大丈夫)/gi, replacement: "原材料をご確認ください" },

  // 景品表示法
  { pattern: /最安値/gi, replacement: "お求めやすい価格" },
  { pattern: /業界最安/gi, replacement: "リーズナブルな価格" },
  { pattern: /どこよりも安い/gi, replacement: "お手頃価格" },
];

// No.1表記の修正
const NO1_FIX_RULES = [
  { pattern: /売上No\.?1/gi, replacement: "人気商品" },
  { pattern: /人気No\.?1/gi, replacement: "多くの方に選ばれています" },
  { pattern: /No\.?1/gi, replacement: "人気" },
  { pattern: /ナンバーワン/gi, replacement: "人気" },
  { pattern: /売上第1位/gi, replacement: "人気商品" },
];

// 無添加の修正（説明文のみ）
const MUTENKA_FIX_RULES = [
  { pattern: /無添加(?!だし)/gi, replacement: "厳選素材使用" },
];

function fixText(text, isProductName = false) {
  if (!text || typeof text !== "string") {
    return { text, changed: false };
  }

  let result = text;
  let changed = false;

  for (const rule of FIX_RULES) {
    const newText = result.replace(rule.pattern, rule.replacement);
    if (newText !== result) {
      changed = true;
      result = newText;
    }
  }

  // 商品名以外でNo.1と無添加を修正
  if (!isProductName) {
    for (const rule of NO1_FIX_RULES) {
      const newText = result.replace(rule.pattern, rule.replacement);
      if (newText !== result) {
        changed = true;
        result = newText;
      }
    }
    for (const rule of MUTENKA_FIX_RULES) {
      const newText = result.replace(rule.pattern, rule.replacement);
      if (newText !== result) {
        changed = true;
        result = newText;
      }
    }
  }

  return { text: result, changed };
}

// 成分ガイドは科学的情報（出典付き）のため修正対象外
// function fixIngredient() は削除しました

function fixProduct(product) {
  const updates = {};
  let hasChanges = false;

  if (product.name) {
    const { text, changed } = fixText(product.name, true);
    if (changed) { updates.name = text; hasChanges = true; }
  }
  if (product.description) {
    const { text, changed } = fixText(product.description);
    if (changed) { updates.description = text; hasChanges = true; }
  }
  return { updates, hasChanges };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   コンプライアンス違反 自動修正スクリプト（商品のみ）     ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  console.log("ℹ️  成分ガイドは科学的情報（出典付き）のため修正対象外です\n");

  if (dryRun) {
    console.log("🔍 ドライランモード（実際には更新しません）\n");
  }

  try {
    console.log("🔍 Sanityから商品データを取得中...");
    const products = await client.fetch(`
      *[_type == "product"] { _id, name, description }
    `);
    console.log(`   → ${products.length}件の商品を取得\n`);

    let productsFixed = 0;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📦 商品の修正\n");

    for (const product of products) {
      const { updates, hasChanges } = fixProduct(product);
      if (hasChanges) {
        productsFixed++;
        const shortName = (product.name || "").substring(0, 40);
        console.log(`✏️  ${shortName}...`);
        for (const [field] of Object.entries(updates)) {
          console.log(`   - ${field} を修正`);
        }
        if (!dryRun) {
          await client.patch(product._id).set(updates).commit();
        }
      }
    }
    console.log(`\n✅ 商品: ${productsFixed}件を修正\n`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 修正結果サマリー\n");
    console.log(`   商品: ${productsFixed}件 / ${products.length}件\n`);

    if (dryRun) {
      console.log("💡 実際に修正を適用するには --dry-run を外して再実行してください\n");
    } else {
      console.log("🎉 修正が完了しました！\n");
    }

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

main();
