/**
 * マグネシウムサプリ Amazon商品追加スクリプト
 */
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../apps/web/.env.local") });

const sanity = createClient({
  projectId: "fny3jdcg",
  dataset: "production",
  apiVersion: "2023-05-03",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const MAGNESIUM_INGREDIENT_ID = "ingredient-magnesium";
const AFFILIATE_TAG = "suptia6902-22";

const products = [
  {
    id: "magnesium-dianatura-cazn-amazon",
    name: "ディアナチュラ カルシウム・マグネシウム・亜鉛・ビタミンD 180粒 30日分",
    nameEn: "Dear-Natura Calcium Magnesium Zinc Vitamin D 180 tablets",
    slug: "dianatura-ca-mg-zn-vitd-amazon",
    brand: "ディアナチュラ",
    asin: "B004PEHCZS",
    price: 633,
    servingSize: 6,
    servingsPerContainer: 30,
    mgPerServing: 125, // マグネシウム125mg/6粒
    affiliateUrl: "https://amzn.to/3YSMOkr",
    imageUrl: "https://m.media-amazon.com/images/I/61GlGJQYTKL._AC_SL1000_.jpg",
    description: "カルシウム、マグネシウム、亜鉛、ビタミンDをバランスよく配合。毎日の健康維持をサポートする栄養機能食品。",
  },
  {
    id: "magnesium-dhc-camg-amazon",
    name: "DHC カルシウム/マグ 30日分 90粒",
    nameEn: "DHC Calcium Magnesium 30 days 90 tablets",
    slug: "dhc-calcium-magnesium-amazon",
    brand: "DHC",
    asin: "B00AY9XY96",
    price: 391,
    servingSize: 3,
    servingsPerContainer: 30,
    mgPerServing: 187, // マグネシウム187mg/3粒
    affiliateUrl: "https://amzn.to/49zyun2",
    imageUrl: "https://m.media-amazon.com/images/I/61AYdBEOgEL._AC_SL1000_.jpg",
    description: "カルシウムとマグネシウムを2:1の理想的なバランスで配合。CPP（カゼインホスホペプチド）でミネラルの吸収をサポート。",
  },
  {
    id: "magnesium-now-citrate-amazon",
    name: "NOW Foods クエン酸マグネシウム 240ベジカプセル",
    nameEn: "NOW Foods Magnesium Citrate 240 Veg Capsules",
    slug: "now-foods-magnesium-citrate-amazon",
    brand: "NOW Foods",
    asin: "B0768GTHT5",
    price: 2180,
    servingSize: 3,
    servingsPerContainer: 80,
    mgPerServing: 400, // マグネシウム400mg/3カプセル
    affiliateUrl: "https://amzn.to/3NH9AcB",
    imageUrl: "https://m.media-amazon.com/images/I/71IbIi6RH9L._AC_SL1500_.jpg",
    description: "吸収性の高いクエン酸マグネシウムを採用。植物性カプセルでベジタリアン・ヴィーガン対応。",
  },
];

async function addProducts() {
  console.log("🚀 マグネシウムサプリ Amazon商品追加開始\n");

  for (const product of products) {
    try {
      // 既存商品チェック
      const existing = await sanity.fetch(
        `*[_type == 'product' && slug.current == $slug][0]`,
        { slug: product.slug }
      );

      if (existing) {
        console.log(`⏭️ スキップ: ${product.name} (既に存在)`);
        continue;
      }

      const doc = {
        _id: product.id,
        _type: "product",
        name: product.name,
        nameEn: product.nameEn,
        slug: { _type: "slug", current: product.slug },
        brand: product.brand,
        source: "amazon",
        asin: product.asin,
        availability: "in-stock",
        priceJPY: product.price,
        affiliateUrl: product.affiliateUrl,
        externalImageUrl: product.imageUrl,
        urls: {
          amazon: product.affiliateUrl,
        },
        servingSize: product.servingSize,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: 1, // 1日1回摂取
        description: product.description,
        ingredients: [
          {
            _key: `ing-mg-${Date.now()}`,
            _type: "object",
            ingredient: {
              _type: "reference",
              _ref: MAGNESIUM_INGREDIENT_ID,
            },
            amountMgPerServing: product.mgPerServing,
            isPrimary: true,
          },
        ],
        priceData: [
          {
            _key: `price-amazon-${Date.now()}`,
            store: "amazon",
            price: product.price,
            url: product.affiliateUrl,
            lastChecked: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await sanity.createOrReplace(doc);
      console.log(`✅ 追加: ${product.name}`);
      console.log(`   価格: ¥${product.price}`);
      console.log(`   マグネシウム: ${product.mgPerServing}mg/回`);
      console.log(`   ASIN: ${product.asin}`);
      console.log("");
    } catch (error) {
      console.error(`❌ エラー: ${product.name}`, error.message);
    }
  }

  console.log("✨ 完了!");
}

addProducts();
