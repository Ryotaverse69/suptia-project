/**
 * ビタミンDサプリ Amazon商品追加スクリプト
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

const VITAMIN_D_INGREDIENT_ID = "ingredient-vitamin-d";

const products = [
  {
    id: "vitamin-d-naturemade-super-amazon",
    name: "大塚製薬 ネイチャーメイド スーパービタミンD 90粒",
    nameEn: "Otsuka Nature Made Super Vitamin D 90 tablets",
    slug: "naturemade-super-vitamin-d-amazon",
    brand: "ネイチャーメイド",
    asin: "B009OB2FVS",
    price: 680,
    servingSize: 1,
    servingsPerContainer: 90,
    mcgPerServing: 25, // 1000IU = 25mcg
    affiliateUrl: "https://amzn.to/4k48TX4",
    imageUrl: "https://m.media-amazon.com/images/I/71TlKQvp6CL._AC_SL1500_.jpg",
    description: "1粒で1000IU（25μg）のビタミンDを摂取。国内大手メーカーの安心品質。90日分のお得なサイズ。",
  },
  {
    id: "vitamin-d3-cgn-5000iu-amazon",
    name: "California Gold Nutrition ビタミンD3 5000IU 90粒",
    nameEn: "California Gold Nutrition Vitamin D3 5000IU 90 Softgels",
    slug: "cgn-vitamin-d3-5000iu-amazon",
    brand: "California Gold Nutrition",
    asin: "B084R75RL3",
    price: 850,
    servingSize: 1,
    servingsPerContainer: 90,
    mcgPerServing: 125, // 5000IU = 125mcg
    affiliateUrl: "https://amzn.to/49ZAzYi",
    imageUrl: "https://m.media-amazon.com/images/I/61y5k5Y0jYL._AC_SL1500_.jpg",
    description: "高含有5000IU（125μg）のビタミンD3。iHerb人気ブランドがAmazonでも購入可能。",
  },
  {
    id: "vitamin-d-dhc-30days-amazon",
    name: "DHC ビタミンD 30日分",
    nameEn: "DHC Vitamin D 30 days",
    slug: "dhc-vitamin-d-30days-amazon",
    brand: "DHC",
    asin: "B07S376VHR",
    price: 400,
    servingSize: 1,
    servingsPerContainer: 30,
    mcgPerServing: 25, // 1000IU = 25mcg
    affiliateUrl: "https://amzn.to/3NEwLo4",
    imageUrl: "https://m.media-amazon.com/images/I/61KxQ8zO7ML._AC_SL1500_.jpg",
    description: "1日1粒で25μg（1000IU）のビタミンD。手頃な価格で始めやすいDHCのビタミンDサプリ。",
  },
];

async function addProducts() {
  console.log("🚀 ビタミンDサプリ Amazon商品追加開始\n");

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
            _key: `ing-vitd-${Date.now()}`,
            _type: "object",
            ingredient: {
              _type: "reference",
              _ref: VITAMIN_D_INGREDIENT_ID,
            },
            amountMcgPerServing: product.mcgPerServing,
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
      console.log(`   ビタミンD: ${product.mcgPerServing}μg/回 (${product.mcgPerServing * 40}IU)`);
      console.log(`   ASIN: ${product.asin}`);
      console.log("");
    } catch (error) {
      console.error(`❌ エラー: ${product.name}`, error.message);
    }
  }

  console.log("✨ 完了!");
}

addProducts();
