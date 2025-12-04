import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import {
  generateItemListStructuredData,
  generateFAQStructuredData,
} from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { headers } from "next/headers";
import Script from "next/script";
import { TierRatings } from "@/lib/tier-ranking";
import { BadgeType } from "@/lib/badges";

import { LandingPageClient } from "./LandingPageClient";

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  originalPrice?: number;
  discountPercentage?: number;
  isCampaign?: boolean;
  campaignEndDate?: string;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: {
    current: string;
  };
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: {
      name: string;
      nameEn: string;
      category?: string;
      popularityScore?: number;
      viewCount?: number;
    };
  }>;
  tierRatings?: TierRatings;
  badges?: BadgeType[];
}

interface Ingredient {
  name: string;
  nameEn: string;
  category: string;
  description: string;
  slug: {
    current: string;
  };
  coverImage?: {
    asset: {
      url: string;
    };
  };
}

interface IngredientWithStats extends Ingredient {
  productCount: number;
  minPrice: number;
  sampleImageUrl?: string;
}

async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock"] | order(priceJPY asc)[0..29]{
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        name,
        nameEn,
        category
      }
    },
    tierRatings {
      priceRank,
      costEffectivenessRank,
      contentRank,
      evidenceRank,
      safetyRank,
      overallRank
    },
    badges
  }`;

  try {
    const allProducts = await sanity.fetch(query);
    if (!allProducts || allProducts.length === 0) return [];

    const uniqueProducts: Product[] = [];
    const seenSlugs = new Set<string>();

    for (const product of allProducts) {
      const slugCurrent = product.slug?.current;
      if (slugCurrent && !seenSlugs.has(slugCurrent)) {
        seenSlugs.add(slugCurrent);
        const safeProduct = {
          ...product,
          badges: Array.isArray(product.badges) ? product.badges : [],
        };
        uniqueProducts.push(safeProduct);
        if (uniqueProducts.length >= 8) break;
      }
    }

    return uniqueProducts;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getTotalProductCount(): Promise<number> {
  const query = `count(*[_type == "product" && availability == "in-stock" && defined(priceJPY) && priceJPY > 0])`;

  try {
    const count = await sanity.fetch(query);
    return count || 0;
  } catch (error) {
    console.error("Failed to fetch product count:", error);
    return 0;
  }
}

function normalizeProductName(name: string): string {
  let normalized = name
    .toLowerCase()
    .replace(/[【】\[\]（）()「」『』\s・\/／＼＼｜]/g, "")
    .replace(/約/g, "")
    .replace(/\d+\.?\d*(ヶ|ケ|か)?月分/g, "")
    .replace(/\d+日分/g, "")
    .replace(/\d+粒/g, "")
    .replace(/\d+錠/g, "")
    .replace(/\d+\.?\d*mg/g, "")
    .replace(/\d+\.?\d*g/g, "")
    .replace(/\d+\.?\d*iu/g, "")
    .replace(/\d+μg/g, "")
    .replace(/ポイント\d+倍/g, "")
    .replace(/メール便.*$/g, "")
    .replace(/送料無料.*$/g, "")
    .replace(/楽天.*$/g, "")
    .replace(/だけの/g, "")
    .replace(/高吸収/g, "")
    .replace(/栄養機能食品/g, "")
    .replace(/カルシウム不使用/g, "")
    .replace(/日本製/g, "")
    .replace(/手軽/g, "")
    .replace(/ハロウィン/g, "")
    .replace(/ミネラル類/g, "")
    .replace(/配合/g, "")
    .replace(/ダイエット/g, "")
    .replace(/diet/g, "")
    .replace(/摂取量/g, "")
    .replace(/粒/g, "");

  normalized = normalized.replace(/サプリメント/g, "サプリ");
  return normalized.slice(0, 10);
}

async function getFeaturedProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock"] {
    _id,
    name,
    priceJPY,
    originalPrice,
    discountPercentage,
    isCampaign,
    campaignEndDate,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        name,
        nameEn,
        category,
        popularityScore,
        viewCount
      }
    },
    tierRatings {
      priceRank,
      costEffectivenessRank,
      contentRank,
      evidenceRank,
      safetyRank,
      overallRank
    },
    badges
  }[0..99]`;

  try {
    const allProducts = await sanity.fetch(query);
    if (!allProducts || allProducts.length === 0) return [];

    const getTierScore = (rank?: string): number => {
      const scores: Record<string, number> = {
        "S+": 100,
        S: 90,
        A: 80,
        B: 70,
        C: 60,
        D: 50,
      };
      return scores[rank || "D"] || 50;
    };

    const getIngredientPopularityScore = (product: Product): number => {
      if (!product.ingredients || product.ingredients.length === 0) return 0;

      const scores = product.ingredients
        .map((ing) => {
          const popularity = ing.ingredient?.popularityScore || 0;
          const viewCount = ing.ingredient?.viewCount || 0;
          return popularity > 0 ? popularity : viewCount / 10;
        })
        .filter((score) => score > 0);

      if (scores.length === 0) return 0;
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    };

    type ProductWithScore = Product & { _calculatedScore: number };
    const productsWithScore: ProductWithScore[] = allProducts.map(
      (product: Product) => {
        const tierScore = getTierScore(product.tierRatings?.overallRank);
        const ingredientScore = getIngredientPopularityScore(product);
        const recommendationScore = tierScore * 0.6 + ingredientScore * 0.4;

        return {
          ...product,
          _calculatedScore: recommendationScore,
        };
      },
    );

    productsWithScore.sort((a, b) => b._calculatedScore - a._calculatedScore);

    const uniqueProducts: Product[] = [];
    const seenSlugs = new Set<string>();
    const seenNormalizedNames = new Set<string>();

    for (const product of productsWithScore) {
      const slugCurrent = product.slug?.current;
      const normalizedName = normalizeProductName(product.name);

      if (!slugCurrent || seenSlugs.has(slugCurrent)) {
        continue;
      }
      if (seenNormalizedNames.has(normalizedName)) {
        continue;
      }

      seenSlugs.add(slugCurrent);
      seenNormalizedNames.add(normalizedName);
      const safeProduct = {
        ...product,
        badges: Array.isArray(product.badges) ? product.badges : [],
      };
      uniqueProducts.push(safeProduct);

      if (uniqueProducts.length >= 10) break;
    }

    return uniqueProducts;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

async function getPopularIngredientsWithStats(): Promise<
  IngredientWithStats[]
> {
  const query = `*[_type == "ingredient"] | order(coalesce(popularityScore, 0) desc)[0..9]{
    name,
    nameEn,
    category,
    description,
    slug,
    viewCount,
    popularityScore,
    "coverImage": coverImage{
      "asset": asset->{
        url
      }
    },
    "productCount": count(*[_type == "product" && availability == "in-stock" && references(^._id)]),
    "minPrice": math::min(*[_type == "product" && availability == "in-stock" && references(^._id)].priceJPY),
    "sampleImageUrl": *[_type == "product" && availability == "in-stock" && references(^._id) && defined(externalImageUrl)][0].externalImageUrl
  }`;

  try {
    const ingredients = await sanity.fetch(query);
    return (ingredients || []).map(
      (ing: IngredientWithStats & { minPrice?: number | null }) => ({
        ...ing,
        productCount: ing.productCount || 0,
        minPrice: ing.minPrice || 0,
      }),
    );
  } catch (error) {
    console.error("Failed to fetch popular ingredients with stats:", error);
    return [];
  }
}

const faqData = [
  {
    question: "Suptia（サプティア）とは何ですか？",
    answer:
      "Suptiaは科学的エビデンスに基づいてサプリメントを比較・評価できる無料サービスです。価格、成分量、コストパフォーマンス、エビデンスレベル、安全性の5つの軸で商品を評価し、あなたに最適なサプリメント選びをサポートします。",
  },
  {
    question: "Tierランク（S+〜D）とは何ですか？",
    answer:
      "Tierランクは、価格・成分量・コスパ・エビデンス・安全性の5項目を総合的に評価した独自のランキングシステムです。S+が最高評価で、科学的根拠と実際のデータに基づいて算出されます。同じ成分を含む商品を公平に比較できます。",
  },
  {
    question: "サプリメントの価格比較はどのように行われていますか？",
    answer:
      "楽天市場、Yahoo!ショッピング、Amazonなど複数のECサイトから価格データを収集し、同一商品の最安値を表示しています。また、1日あたりのコスト（実効価格）も計算し、容量や服用回数が異なる商品でも公平に比較できます。",
  },
  {
    question: "エビデンスレベルはどのように決まりますか？",
    answer:
      "エビデンスレベルは、PubMedやCochrane Reviewなどの信頼できる医学データベースの研究結果に基づいて評価しています。大規模な臨床試験やメタ解析で効果が確認されている成分ほど高い評価となります。",
  },
  {
    question: "Suptiaは無料で利用できますか？",
    answer:
      "はい、Suptiaのすべての機能は完全無料でご利用いただけます。商品の検索、比較、成分ガイドの閲覧、診断機能など、すべて無料です。アフィリエイトリンク経由で購入いただくことで、サービスの運営を支援していただけます。",
  },
];

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = await getFeaturedProducts();
  const popularIngredientsWithStats = await getPopularIngredientsWithStats();
  const totalProductCount = await getTotalProductCount();

  const productsWithCost = products.map((product) => {
    let effectiveCostPerDay = 0;
    try {
      effectiveCostPerDay = calculateEffectiveCostPerDay({
        priceJPY: product.priceJPY,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: product.servingsPerDay,
      });
    } catch {
      // If calculation fails, set to 0
    }

    return {
      ...product,
      effectiveCostPerDay,
    };
  });

  const featuredProductsWithCost = featuredProducts.map((product) => {
    let effectiveCostPerDay = 0;
    try {
      effectiveCostPerDay = calculateEffectiveCostPerDay({
        priceJPY: product.priceJPY,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: product.servingsPerDay,
      });
    } catch {
      // If calculation fails, set to 0
    }

    return {
      ...product,
      effectiveCostPerDay,
    };
  });

  const siteUrl = getSiteUrl();
  const itemListJsonLd = generateItemListStructuredData({
    name: "おすすめのサプリメント",
    description: "科学的根拠に基づいて評価された厳選サプリメント",
    items: productsWithCost.map((product, index) => ({
      name: product.name,
      url: `${siteUrl}/products/${product.slug.current}`,
      position: index + 1,
    })),
  });

  const faqJsonLd = generateFAQStructuredData(faqData);

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      <Script id="itemlist-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <Script id="faq-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(faqJsonLd)}
      </Script>

      <LandingPageClient
        featuredProducts={featuredProductsWithCost}
        popularIngredients={popularIngredientsWithStats}
        totalProductCount={totalProductCount}
        faqData={faqData}
      />
    </>
  );
}
