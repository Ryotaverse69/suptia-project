import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { contraindicationData } from "./contraindication-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動で読み込み
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
});

const client = createClient({
  projectId:
    envVars.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:
    envVars.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: envVars.SANITY_API_VERSION || "2024-01-01",
  token: envVars.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function updateContraindications(dryRun = true) {
  console.log("🔍 Sanityから全成分データを取得中...\n");

  const ingredients = await client.fetch(
    `*[_type == "ingredient"] | order(name asc) {
      _id,
      name,
      nameEn,
      riskLevel,
      contraindications
    }`
  );

  console.log(`📊 登録されている成分: ${ingredients.length}件\n`);

  const updates = [];
  const skipped = [];

  ingredients.forEach((ingredient) => {
    const updateData = contraindicationData[ingredient.name];

    if (!updateData) {
      skipped.push(ingredient.name);
      return;
    }

    const hasChanges =
      ingredient.riskLevel !== updateData.riskLevel ||
      JSON.stringify(ingredient.contraindications || []) !==
        JSON.stringify(updateData.contraindications);

    if (hasChanges) {
      updates.push({
        _id: ingredient._id,
        name: ingredient.name,
        current: {
          riskLevel: ingredient.riskLevel || "未設定",
          contraindications: ingredient.contraindications || [],
        },
        new: {
          riskLevel: updateData.riskLevel,
          contraindications: updateData.contraindications,
        },
      });
    }
  });

  console.log(`✅ 更新対象: ${updates.length}件`);
  console.log(`⏭️  スキップ: ${skipped.length}件\n`);

  if (updates.length > 0) {
    console.log("📝 更新内容:\n");
    updates.forEach((update, index) => {
      console.log(`${index + 1}. ${update.name}`);
      console.log(
        `   リスクレベル: ${update.current.riskLevel} → ${update.new.riskLevel}`
      );
      console.log(
        `   禁忌タグ (現在): ${update.current.contraindications.length}件 [${update.current.contraindications.join(", ") || "なし"}]`
      );
      console.log(
        `   禁忌タグ (更新): ${update.new.contraindications.length}件 [${update.new.contraindications.join(", ") || "なし"}]`
      );
      console.log();
    });
  }

  if (skipped.length > 0) {
    console.log(`\n⏭️  マッピングデータがない成分（スキップ）:`);
    skipped.forEach((name) => console.log(`   - ${name}`));
    console.log();
  }

  if (dryRun) {
    console.log("🔍 ドライランモード: 実際の更新は行いません");
    console.log(
      '💡 実際に更新するには、引数に "--apply" を付けて実行してください:\n'
    );
    console.log("   node scripts/update-contraindications.mjs --apply\n");
    return;
  }

  // 実際の更新処理
  console.log("🚀 Sanityへの更新を開始します...\n");

  for (const update of updates) {
    try {
      await client
        .patch(update._id)
        .set({
          riskLevel: update.new.riskLevel,
          contraindications: update.new.contraindications,
        })
        .commit();

      console.log(`✅ 更新完了: ${update.name}`);
    } catch (error) {
      console.error(`❌ 更新失敗: ${update.name}`, error.message);
    }
  }

  console.log(`\n🎉 ${updates.length}件の成分を更新しました！`);

  // 更新後の検証
  console.log("\n🔍 更新結果を確認中...\n");
  await verifyUpdates();
}

async function verifyUpdates() {
  const pregnantIngredients = await client.fetch(
    `*[_type == "ingredient" && "pregnant" in contraindications] | order(name asc) {
      name,
      riskLevel,
      contraindications
    }`
  );

  const breastfeedingIngredients = await client.fetch(
    `*[_type == "ingredient" && "breastfeeding" in contraindications] | order(name asc) {
      name,
      riskLevel
    }`
  );

  const highRiskIngredients = await client.fetch(
    `*[_type == "ingredient" && riskLevel in ["critical", "high"]] | order(riskLevel desc, name asc) {
      name,
      riskLevel,
      contraindications
    }`
  );

  console.log(`🤰 妊娠中に注意が必要な成分: ${pregnantIngredients.length}件`);
  pregnantIngredients.forEach((i) => {
    console.log(`   - ${i.name} (リスク: ${i.riskLevel})`);
  });

  console.log(
    `\n🤱 授乳中に注意が必要な成分: ${breastfeedingIngredients.length}件`
  );
  breastfeedingIngredients.forEach((i) => {
    console.log(`   - ${i.name} (リスク: ${i.riskLevel})`);
  });

  console.log(
    `\n🚨 高リスク成分 (critical/high): ${highRiskIngredients.length}件`
  );
  highRiskIngredients.forEach((i) => {
    console.log(`   - ${i.name} (リスク: ${i.riskLevel})`);
    console.log(
      `     禁忌: ${i.contraindications?.join(", ") || "なし"}`
    );
  });
}

// コマンドライン引数の確認
const args = process.argv.slice(2);
const shouldApply = args.includes("--apply");

updateContraindications(!shouldApply).catch(console.error);
