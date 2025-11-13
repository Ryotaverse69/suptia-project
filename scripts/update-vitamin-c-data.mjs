import "dotenv/config";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

console.log("🔧 ビタミンC成分データの更新");
console.log("");

// 本当に重要な副作用のみ（一般的な摂取量では安全）
const updatedSideEffects = [
  "G6PD欠損症（グルコース-6-リン酸脱水素酵素欠損症）の方は、高用量摂取により溶血性貧血を引き起こす恐れ",
  "鉄過剰症（ヘモクロマトーシス）の方は、鉄の吸収を促進するため症状が悪化する可能性",
  "腎結石の既往歴がある方は、高用量摂取（2,000mg/日以上）により結石リスクが増加する可能性",
];

// 本当に重要な相互作用のみ（深刻な影響があるもの）
const updatedInteractions = `ワルファリン（抗凝固薬）：高用量のビタミンC（1,000mg/日以上）が効果を減弱させる可能性があるため、併用時は医師に相談

化学療法薬：抗酸化作用が健康維持効果に影響する可能性があるため、がん医療ケア中の高用量摂取は医師に相談

アルミニウム含有制酸剤：ビタミンCがアルミニウムの吸収を増加させる可能性があるため、併用を避ける（特に腎機能低下者）`;

async function updateVitaminCData() {
  try {
    console.log("📝 ビタミンC成分データを更新中...");
    console.log("");

    const result = await client
      .patch("ingredient-vitamin-c")
      .set({
        sideEffects: updatedSideEffects,
        interactions: updatedInteractions,
      })
      .commit({ autoPublish: true });

    console.log("✅ ビタミンC成分データの更新が完了しました");
    console.log("");
    console.log("📊 更新内容:");
    console.log(`  副作用: ${updatedSideEffects.length}項目（旧: 7項目）`);
    console.log(`  相互作用: 3項目（旧: 8項目）`);
    console.log("");
    console.log("💡 予想される新しい安全性スコア:");
    console.log("  基本スコア: 95点（ビタミン）");
    console.log(
      `  副作用ペナルティ: ${updatedSideEffects.length} × 2点 = ${updatedSideEffects.length * 2}点`
    );
    console.log("  相互作用ペナルティ: 3 × 3点 = 9点");
    console.log(
      `  最終スコア: 95 - ${updatedSideEffects.length * 2} - 9 = ${95 - updatedSideEffects.length * 2 - 9}点 （${95 - updatedSideEffects.length * 2 - 9 >= 80 ? "Aランク" : 95 - updatedSideEffects.length * 2 - 9 >= 70 ? "Bランク" : "Cランク"}）`
    );
    console.log("");
    console.log("次のステップ:");
    console.log("  1. node scripts/sync-vitamin-c-scores.mjs --force");
    console.log("  2. ブラウザをリロードして確認");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

updateVitaminCData();
