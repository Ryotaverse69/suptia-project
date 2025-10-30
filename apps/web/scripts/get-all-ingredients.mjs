import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

async function getAllIngredients() {
  console.log("🔍 Sanityから全成分データを取得中...\n");

  const ingredients = await client.fetch(
    `*[_type == "ingredient"] | order(name asc) {
      _id,
      name,
      nameEn,
      slug,
      category,
      riskLevel,
      contraindications,
      description
    }`
  );

  console.log(`📊 登録されている成分: ${ingredients.length}件\n`);

  console.log("📋 成分一覧:");
  ingredients.forEach((ingredient, index) => {
    console.log(`\n${index + 1}. ${ingredient.name} (${ingredient.nameEn})`);
    console.log(`   カテゴリ: ${ingredient.category || "未設定"}`);
    console.log(`   リスクレベル: ${ingredient.riskLevel || "未設定"}`);
    console.log(
      `   禁忌タグ: ${ingredient.contraindications?.length ? ingredient.contraindications.join(", ") : "なし"}`
    );
  });

  return ingredients;
}

getAllIngredients().catch(console.error);
