import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(dirname(__dirname), "apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function verifyHomepageData() {
  console.log("🔍 トップページで使用されるデータを検証中...\n");

  // トップページのクエリ（getProducts）
  const productsQuery = `*[_type == "product"] | order(priceJPY asc)[0..29]{
    _id,
    name,
    badges
  }`;

  // トップページのクエリ（getFeaturedProducts）
  const featuredQuery = `*[_type == "product" && availability == "in-stock"][0..99]{
    _id,
    name,
    badges
  }`;

  const [products, featuredProducts] = await Promise.all([
    client.fetch(productsQuery),
    client.fetch(featuredQuery),
  ]);

  console.log("📊 通常商品 (getProducts):");
  console.log(`  総数: ${products.length}`);
  const productsWithNullBadges = products.filter((p) => p.badges === null);
  const productsWithUndefinedBadges = products.filter((p) => p.badges === undefined);
  console.log(`  - badges が null: ${productsWithNullBadges.length}`);
  console.log(`  - badges が undefined: ${productsWithUndefinedBadges.length}`);
  if (productsWithNullBadges.length > 0) {
    console.log("  ❌ NULL badges の商品:");
    productsWithNullBadges.forEach((p) => {
      console.log(`    - ${p.name} (${p._id})`);
    });
  }

  console.log("\n📊 おすすめ商品 (getFeaturedProducts):");
  console.log(`  総数: ${featuredProducts.length}`);
  const featuredWithNullBadges = featuredProducts.filter((p) => p.badges === null);
  const featuredWithUndefinedBadges = featuredProducts.filter((p) => p.badges === undefined);
  console.log(`  - badges が null: ${featuredWithNullBadges.length}`);
  console.log(`  - badges が undefined: ${featuredWithUndefinedBadges.length}`);
  if (featuredWithNullBadges.length > 0) {
    console.log("  ❌ NULL badges の商品:");
    featuredWithNullBadges.forEach((p) => {
      console.log(`    - ${p.name} (${p._id})`);
    });
  }

  if (productsWithNullBadges.length === 0 && featuredWithNullBadges.length === 0) {
    console.log("\n✅ すべての商品の badges フィールドが正常です！");
  } else {
    console.log("\n⚠️ まだ null badges が残っています。修正が必要です。");
  }
}

verifyHomepageData().catch(console.error);
