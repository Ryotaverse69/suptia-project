import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { HeroSearch } from "@/components/HeroSearch";
import { ProductCard } from "@/components/ProductCard";
import { IngredientCarousel } from "@/components/IngredientCarousel";
import { IngredientCoverSVG } from "@/components/IngredientCoverSVG";
import { generateItemListStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { headers } from "next/headers";
import Script from "next/script";
import {
  Search,
  BarChart3,
  CheckCircle2,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TierRank } from "@/lib/tier-colors";
import { TierRatings } from "@/lib/tier-ranking";
import { BadgeType } from "@/lib/badges";

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
  // 重複を考慮して多めに取得（30件）
  const query = `*[_type == "product"] | order(priceJPY asc)[0..29]{
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

    // slugで重複を除外（最初に見つかった商品のみ保持）
    const uniqueProducts: Product[] = [];
    const seenSlugs = new Set<string>();

    for (const product of allProducts) {
      const slugCurrent = product.slug?.current;
      if (slugCurrent && !seenSlugs.has(slugCurrent)) {
        seenSlugs.add(slugCurrent);
        // Ensure badges is always an array
        const safeProduct = {
          ...product,
          badges: Array.isArray(product.badges) ? product.badges : [],
        };
        uniqueProducts.push(safeProduct);

        // 8件集まったら終了
        if (uniqueProducts.length >= 8) break;
      }
    }

    return uniqueProducts;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getIngredients(): Promise<Ingredient[]> {
  const query = `*[_type == "ingredient" && defined(slug.current)]{
    name,
    nameEn,
    category,
    description,
    slug,
    "coverImage": coverImage{
      "asset": asset->{
        url
      }
    }
  }`;

  try {
    const ingredients = await sanity.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    return [];
  }
}

// 全商品の件数を取得
async function getTotalProductCount(): Promise<number> {
  const query = `count(*[_type == "product" && defined(priceJPY) && priceJPY > 0])`;

  try {
    const count = await sanity.fetch(query);
    return count || 0;
  } catch (error) {
    console.error("Failed to fetch product count:", error);
    return 0;
  }
}

// 商品名を正規化（重複判定用）
// より積極的なパターンマッチングで実質的に同じ商品を判定
function normalizeProductName(name: string): string {
  let normalized = name
    .toLowerCase()
    // 最初に全ての記号・括弧・空白を除去（全角・半角両方）
    .replace(/[【】\[\]（）()「」『』\s・\/／＼＼｜]/g, "")
    // 数字と単位を除去
    .replace(/約/g, "") // 「約」を除去
    .replace(/\d+\.?\d*(ヶ|ケ|か)?月分/g, "")
    .replace(/\d+日分/g, "")
    .replace(/\d+粒/g, "")
    .replace(/\d+錠/g, "")
    .replace(/\d+\.?\d*mg/g, "")
    .replace(/\d+\.?\d*g/g, "")
    .replace(/\d+\.?\d*iu/g, "")
    .replace(/\d+μg/g, "")
    // プロモーション文言を除去
    .replace(/ポイント\d+倍/g, "")
    .replace(/メール便.*$/g, "")
    .replace(/送料無料.*$/g, "")
    .replace(/楽天.*$/g, "")
    // 一般的な修飾語を除去
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
    .replace(/粒/g, ""); // 残った「粒」も除去

  // 「サプリメント」や「サプリ」も統一
  normalized = normalized.replace(/サプリメント/g, "サプリ");

  // 最初の10文字のみ比較（商品の核心部分）
  return normalized.slice(0, 10);
}

// おすすめサプリを取得（横スクロールで10件表示）
// おすすめスコア = Tierランクスコア (60%) + 成分人気度スコア (40%)
// - Tierランクスコア: S+ = 100, S = 90, A = 80, B = 70, C = 60, D = 50
// - 成分人気度: 含まれる成分の人気度スコアの平均
async function getFeaturedProducts(): Promise<Product[]> {
  // 重複を考慮して多めに取得（50件）
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

    // Tierランクをスコアに変換する関数
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

    // 成分の人気度スコアを計算する関数
    const getIngredientPopularityScore = (product: Product): number => {
      if (!product.ingredients || product.ingredients.length === 0) return 0;

      const scores = product.ingredients
        .map((ing) => {
          const popularity = ing.ingredient?.popularityScore || 0;
          const viewCount = ing.ingredient?.viewCount || 0;
          // popularityScoreを優先、なければviewCountを10で割った値を使用
          return popularity > 0 ? popularity : viewCount / 10;
        })
        .filter((score) => score > 0);

      if (scores.length === 0) return 0;

      // 平均スコアを計算
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    };

    // 各商品のおすすめスコアを計算
    type ProductWithScore = Product & { _calculatedScore: number };
    const productsWithScore: ProductWithScore[] = allProducts.map(
      (product: Product) => {
        const tierScore = getTierScore(product.tierRatings?.overallRank);
        const ingredientScore = getIngredientPopularityScore(product);

        // 総合スコア = Tierランクスコア (60%) + 成分人気度スコア (40%)
        const recommendationScore = tierScore * 0.6 + ingredientScore * 0.4;

        return {
          ...product,
          _calculatedScore: recommendationScore,
        };
      },
    );

    // スコアでソート
    productsWithScore.sort((a, b) => b._calculatedScore - a._calculatedScore);

    // 2段階の重複チェック：slug、正規化された商品名
    const uniqueProducts: Product[] = [];
    const seenSlugs = new Set<string>();
    const seenNormalizedNames = new Set<string>();

    for (const product of productsWithScore) {
      const slugCurrent = product.slug?.current;
      const normalizedName = normalizeProductName(product.name);

      // slug または正規化名が重複している場合はスキップ
      if (!slugCurrent || seenSlugs.has(slugCurrent)) {
        continue;
      }
      if (seenNormalizedNames.has(normalizedName)) {
        console.log(
          `[重複スキップ] ${product.name} → 正規化名: ${normalizedName}`,
        );
        continue;
      }

      // 重複していない場合のみ追加
      seenSlugs.add(slugCurrent);
      seenNormalizedNames.add(normalizedName);
      // Ensure badges is always an array
      const safeProduct = {
        ...product,
        badges: Array.isArray(product.badges) ? product.badges : [],
      };
      uniqueProducts.push(safeProduct);

      console.log(
        `[追加] ${product.name} (Tierスコア: ${getTierScore(product.tierRatings?.overallRank)}, 成分人気度: ${getIngredientPopularityScore(product).toFixed(1)}, 総合: ${product._calculatedScore.toFixed(1)})`,
      );

      // 10件集まったら終了
      if (uniqueProducts.length >= 10) break;
    }

    return uniqueProducts;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

// 人気の成分を取得（横スクロールで10件表示）
// 人気度スコア = (商品数 × 10) + (表示回数 × 1)
async function getPopularIngredients(): Promise<Ingredient[]> {
  const query = `*[_type == "ingredient"] | order(coalesce(popularityScore, 0) desc)[0..9]{
    name,
    nameEn,
    category,
    description,
    slug,
    viewCount,
    popularityScore,
    "productCount": count(*[_type == "product" && references(^._id)]),
    "coverImage": coverImage{
      "asset": asset->{
        url
      }
    }
  }`;

  try {
    const ingredients = await sanity.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch popular ingredients:", error);
    return [];
  }
}

// 成分ごとの統計情報を取得
async function getIngredientStats(ingredientSlug: string): Promise<{
  productCount: number;
  minPrice: number;
  sampleImageUrl?: string;
}> {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]{
    "productCount": count(*[_type == "product" && references(^._id)]),
    "minPrice": math::min(*[_type == "product" && references(^._id)].priceJPY),
    "sampleImageUrl": *[_type == "product" && references(^._id) && defined(externalImageUrl)][0].externalImageUrl
  }`;

  try {
    const stats = await sanity.fetch(query, { slug: ingredientSlug });
    return {
      productCount: stats?.productCount || 0,
      minPrice: stats?.minPrice || 0,
      sampleImageUrl: stats?.sampleImageUrl,
    };
  } catch (error) {
    console.error(
      `Failed to fetch stats for ingredient ${ingredientSlug}:`,
      error,
    );
    return {
      productCount: 0,
      minPrice: 0,
    };
  }
}

// 人気の成分と統計情報を取得
async function getPopularIngredientsWithStats(): Promise<
  IngredientWithStats[]
> {
  const ingredients = await getPopularIngredients();

  const ingredientsWithStats = await Promise.all(
    ingredients.map(async (ingredient) => {
      const stats = await getIngredientStats(ingredient.slug.current);
      return {
        ...ingredient,
        ...stats,
      };
    }),
  );

  return ingredientsWithStats;
}

export default async function Home() {
  const products = await getProducts();
  const ingredients = await getIngredients();
  const featuredProducts = await getFeaturedProducts();
  const popularIngredientsWithStats = await getPopularIngredientsWithStats();
  const totalProductCount = await getTotalProductCount();

  // Calculate effective cost for each product
  const productsWithCost = products.map((product, index) => {
    let effectiveCostPerDay = 0;
    try {
      effectiveCostPerDay = calculateEffectiveCostPerDay({
        priceJPY: product.priceJPY,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: product.servingsPerDay,
      });
    } catch (error) {
      // If calculation fails, set to 0
    }

    return {
      ...product,
      effectiveCostPerDay,
      rating: 4.2 + Math.random() * 0.8, // Mock rating
      reviewCount: Math.floor(50 + Math.random() * 200), // Mock review count
      isBestValue: index < 3, // Mark first 3 as best value
      safetyScore: 85 + Math.floor(Math.random() * 15), // Mock safety score
    };
  });

  // おすすめサプリのコスト計算
  const featuredProductsWithCost = featuredProducts.map((product, index) => {
    let effectiveCostPerDay = 0;
    try {
      effectiveCostPerDay = calculateEffectiveCostPerDay({
        priceJPY: product.priceJPY,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: product.servingsPerDay,
      });
    } catch (error) {
      // If calculation fails, set to 0
    }

    return {
      ...product,
      effectiveCostPerDay,
      rating: 4.5 + Math.random() * 0.5, // Mock rating (higher for featured)
      reviewCount: Math.floor(100 + Math.random() * 300), // Mock review count
      isBestValue: true, // All featured products are marked as best value
      safetyScore: 90 + Math.floor(Math.random() * 10), // Mock safety score (higher)
    };
  });

  // Generate JSON-LD structured data for product list
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

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD Structured Data for Product List */}
      <Script id="itemlist-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <div className="min-h-screen relative overflow-hidden bg-slate-50">
        {/* Global Background - Light & Clean */}
        <div className="absolute inset-0 bg-slate-50 -z-30" />

        {/* Hero Section Wrapper - Cloud/Mist Animation */}
        <div className="relative w-full bg-[#3b66e0] overflow-hidden py-20 sm:py-24 md:py-32">
          {/* Layer 1: Main Drift (Blue -> Mint -> Blue) */}
          <div
            className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-[#3b66e0] via-[#f1faf9] to-[#3b66e0] -z-20 opacity-90"
            style={{ animationDuration: "15s" }}
          />

          {/* Layer 2: Secondary Drift (Reverse, slightly different phase) - Creates turbulence */}
          <div
            className="absolute inset-0 animate-gradient-drift bg-gradient-to-br from-transparent via-[#f1faf9]/40 to-transparent -z-19 mix-blend-overlay"
            style={{
              animationDuration: "20s",
              animationDirection: "reverse",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Contrast Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 -z-15 pointer-events-none" />

          {/* Hero Mist Animation Layers - Cloud-like */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Large White Cloud Blob 1 */}
            <div
              className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] bg-white/20 blur-[120px] rounded-full animate-mist-flow"
              style={{ animationDuration: "45s" }}
            />

            {/* Large Mint Cloud Blob 2 */}
            <div
              className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-[#f1faf9]/30 blur-[100px] rounded-full animate-mist-flow"
              style={{
                animationDuration: "35s",
                animationDirection: "reverse",
              }}
            />

            {/* Blue Mist Overlay */}
            <div
              className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] bg-[#3b66e0]/40 blur-[90px] rounded-full animate-pulse"
              style={{ animationDuration: "8s" }}
            />

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#3b66e0]/80 to-transparent opacity-80" />
          </div>

          {/* Hero Content */}
          <HeroSearch popularSearches={popularIngredientsWithStats} />
        </div>

        {/* How to Use Suptia - 3 Steps */}
        <div className="glass border-b border-white/30 relative z-10">
          <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-6xl">
            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group relative perspective-1000">
                {/* グロー効果レイヤー（ホバー時） */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-blue-400/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="glass-blue rounded-2xl p-8 shadow-soft hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center gap-6 relative border border-white/40 group-hover:border-blue-300/50 group-hover:scale-[1.02] group-hover:-translate-y-2 hover:backdrop-blur-3xl">
                  {/* Step Number Badge */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl rotate-3 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <span className="text-white font-black text-2xl">1</span>
                  </div>

                  {/* Icon */}
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    <Search
                      className="text-blue-600 group-hover:text-blue-500 transition-colors duration-300"
                      size={48}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      検索・発見
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Tierランク（S+〜D）で
                      <br />
                      瞬時にサプリの実力を把握
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative perspective-1000">
                {/* グロー効果レイヤー（ホバー時） */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-emerald-400/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="glass-mint rounded-2xl p-8 shadow-soft hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center gap-6 relative border border-white/40 group-hover:border-emerald-300/50 group-hover:scale-[1.02] group-hover:-translate-y-2 hover:backdrop-blur-3xl">
                  {/* Step Number Badge */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl -rotate-3 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                    <span className="text-white font-black text-2xl">2</span>
                  </div>

                  {/* Icon */}
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    <BarChart3
                      className="text-emerald-600 group-hover:text-emerald-500 transition-colors duration-300"
                      size={48}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                      比較・分析
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      成分・コスパ・安全性を
                      <br />
                      5軸チャートで徹底比較
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative perspective-1000">
                {/* グロー効果レイヤー（ホバー時） */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="glass-purple rounded-2xl p-8 shadow-soft hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center gap-6 relative border border-white/40 group-hover:border-purple-300/50 group-hover:scale-[1.02] group-hover:-translate-y-2 hover:backdrop-blur-3xl">
                  {/* Step Number Badge */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl rotate-3 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <span className="text-white font-black text-2xl">3</span>
                  </div>

                  {/* Icon */}
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    <CheckCircle2
                      className="text-purple-600 group-hover:text-purple-500 transition-colors duration-300"
                      size={48}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      選択・購入
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      最適なサプリを見つけて
                      <br />
                      最安値で賢く購入
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* おすすめサプリセクション */}
        {featuredProductsWithCost.length > 0 && (
          <section className="py-16 relative z-10">
            <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                    おすすめのサプリメント
                  </h2>
                  <p className="text-slate-500 font-medium">
                    科学的根拠と人気度に基づいた厳選セレクション
                  </p>
                </div>
                <Link
                  href="/products"
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 hover:bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">
                    全て見る
                  </span>
                  <TrendingUp
                    size={16}
                    className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              {/* 横スクロール可能なカルーセル */}
              <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16 py-4">
                <div className="flex gap-6 pb-4">
                  {featuredProductsWithCost.map((product) => (
                    <div
                      key={product.slug.current}
                      className="group relative perspective-1000 flex-shrink-0 w-[300px]"
                    >
                      {/* グロー効果レイヤー（ホバー時） */}
                      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                      <Link
                        href={`/products/${product.slug.current}`}
                        className="block h-full bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 relative"
                      >
                        {/* 商品画像 */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          {product.externalImageUrl ? (
                            <Image
                              src={product.externalImageUrl}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <Award
                                size={48}
                                strokeWidth={1}
                                className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"
                              />
                            </div>
                          )}

                          {/* Tierランクラベル（左上） - 視認性向上版 */}
                          {product.tierRatings &&
                            product.tierRatings.overallRank && (
                              <div className="absolute top-3 left-3 z-10">
                                <div className="relative">
                                  <div
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-black text-lg shadow-lg border border-white/40 backdrop-blur-md ${
                                      {
                                        "S+": "bg-gradient-to-br from-purple-600 to-pink-600 text-white",
                                        S: "bg-gradient-to-br from-purple-600 to-indigo-600 text-white",
                                        A: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
                                        B: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
                                        C: "bg-gradient-to-br from-yellow-400 to-orange-400 text-white",
                                        D: "bg-gradient-to-br from-slate-400 to-slate-500 text-white",
                                      }[
                                        product.tierRatings
                                          .overallRank as TierRank
                                      ]
                                    }`}
                                  >
                                    <span className="text-xs font-bold opacity-90 mr-0.5">
                                      RANK
                                    </span>
                                    {product.tierRatings.overallRank}
                                  </div>
                                  {/* キラキラエフェクト */}
                                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none" />
                                </div>
                              </div>
                            )}

                          {/* 成分タグ（画像下部） */}
                          {product.ingredients &&
                            product.ingredients.length > 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent px-4 py-3 pt-8">
                                <div className="flex flex-wrap gap-1.5">
                                  {product.ingredients.slice(0, 2).map(
                                    (item, index) =>
                                      item.ingredient && (
                                        <div
                                          key={index}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                                        >
                                          {item.ingredient.name}
                                        </div>
                                      ),
                                  )}
                                  {product.ingredients.length > 2 && (
                                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/10 backdrop-blur-sm">
                                      +{product.ingredients.length - 2}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* 商品情報 */}
                        <div className="p-5">
                          {/* 商品名 */}
                          <h3 className="text-base font-bold text-slate-800 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors leading-relaxed">
                            {product.name}
                          </h3>

                          {/* 評価 */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                              <Star
                                size={12}
                                className="fill-emerald-600 text-emerald-600"
                              />
                              <span className="text-xs font-bold">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                              {product.reviewCount}件のレビュー
                            </span>
                          </div>

                          {/* 価格情報 */}
                          <div className="flex items-end justify-between mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                            {/* 商品価格 */}
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 mb-0.5">
                                価格
                              </div>
                              <div className="text-lg font-bold text-slate-700">
                                ¥{product.priceJPY.toLocaleString()}
                              </div>
                            </div>

                            {/* 1日あたり */}
                            <div className="text-right">
                              <div className="text-[10px] font-bold text-slate-400 mb-0.5">
                                1日あたり
                              </div>
                              <div className="text-xl font-black text-blue-600">
                                ¥{product.effectiveCostPerDay.toFixed(0)}
                              </div>
                            </div>
                          </div>

                          {/* 比較するボタン */}
                          <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn">
                            詳細を見る
                            <TrendingUp
                              size={14}
                              className="group-hover/btn:translate-x-1 transition-transform"
                            />
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 人気の成分セクション */}
        {popularIngredientsWithStats.length > 0 && (
          <section className="py-12 border-b border-primary-100 bg-white/50">
            <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">
                  人気の成分
                </h2>
                <Link
                  href="/ingredients"
                  className="text-primary hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  すべての成分を見る
                  <TrendingUp size={16} />
                </Link>
              </div>

              {/* 横スクロール可能なカルーセル */}
              <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16">
                <div className="flex gap-4 pb-4">
                  {popularIngredientsWithStats.map((ingredient) => (
                    <div
                      key={ingredient.slug.current}
                      className="group relative perspective-1000 flex-shrink-0 w-[280px]"
                    >
                      {/* グロー効果レイヤー（ホバー時） */}
                      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-br from-accent-mint/30 via-primary/30 to-accent-purple/30 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
                      <Link
                        href={`/search?q=${encodeURIComponent(ingredient.name)}`}
                        className="block bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-2 hover:border-primary-300 relative"
                      >
                        {/* SVGアイキャッチ画像 */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <div className="group-hover:scale-110 transition-transform duration-700">
                            <IngredientCoverSVG
                              name={ingredient.name}
                              nameEn={ingredient.nameEn}
                              category={ingredient.category}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* 商品情報 */}
                        <div className="p-4">
                          {/* 成分名 */}
                          <h3 className="text-base font-bold text-primary-900 mb-1 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors duration-300">
                            {ingredient.name}
                          </h3>
                          <p className="text-xs text-primary-600 mb-3 group-hover:text-primary transition-colors duration-300">
                            {ingredient.nameEn}
                          </p>

                          {/* 統計情報 */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                              <span className="text-sm font-semibold text-primary-900">
                                {ingredient.productCount}種類
                              </span>
                            </div>
                            <div className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                              <span className="text-xs text-primary-600">
                                最安値
                              </span>
                              <span className="text-sm font-bold text-primary-900 group-hover:text-green-600 transition-colors duration-300">
                                ¥{ingredient.minPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* 料金プランをチェックボタン */}
                          <button className="w-full mt-2 px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary-700 transition-all duration-300 group-hover:shadow-lg">
                            商品を見る
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content - すべてのサプリメント */}
        {productsWithCost.length > 0 && (
          <section className="py-12 border-b border-primary-100">
            <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-light text-primary-900 tracking-wide">
                    すべてのサプリメント
                  </h2>
                  <p className="text-primary-600 mt-2 font-light">
                    {totalProductCount}件の商品
                  </p>
                </div>
              </div>

              {/* 4列グリッド表示 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productsWithCost.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>

              {/* もっと見るボタン */}
              <div className="mt-10 text-center">
                <Link
                  href="/products"
                  className="inline-block px-10 py-4 glass-blue rounded-xl text-primary-800 font-medium shadow-glass hover:shadow-glass-hover transition-all duration-300"
                >
                  もっと見る
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Ingredient Carousel */}
        <IngredientCarousel ingredients={ingredients} />
      </div>
    </>
  );
}
