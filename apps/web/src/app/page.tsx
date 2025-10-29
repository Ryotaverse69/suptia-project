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

interface Product {
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
    };
  }>;
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
    }
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
        uniqueProducts.push(product);

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
  const query = `*[_type == "ingredient"]{
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
    // まず全ての数字と単位を除去
    .replace(/\d+\.?\d*(ヶ|ケ|か)?月分/g, "")
    .replace(/\d+日分/g, "")
    .replace(/\d+粒/g, "")
    .replace(/\d+錠/g, "")
    .replace(/\d+\.?\d*mg/g, "")
    .replace(/\d+\.?\d*g/g, "")
    .replace(/\d+\.?\d*iu/g, "")
    .replace(/\d+μg/g, "")
    // 記号・括弧・空白を全て除去
    .replace(/[【】\[\]（）()「」『』\s・\/＼｜]/g, "")
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
    .replace(/摂取量/g, "");

  // 「サプリメント」や「サプリ」も統一
  normalized = normalized.replace(/サプリメント/g, "サプリ");

  // 最初の10文字のみ比較（商品の核心部分）
  return normalized.slice(0, 10);
}

// おすすめサプリを取得（横スクロールで10件表示）
// おすすめスコア = (キャンペーン: 100点) + (割引率 × 2)
// キャンペーン商品と割引率が高い商品を優先表示
async function getFeaturedProducts(): Promise<Product[]> {
  // 重複を考慮して多めに取得（50件）
  const query = `*[_type == "product" && availability == "in-stock"] {
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
        category
      }
    },
    // おすすめスコアを計算
    "recommendationScore": select(
      isCampaign == true && campaignEndDate > now() => 100 + coalesce(discountPercentage, 0) * 2,
      isCampaign == true => 100 + coalesce(discountPercentage, 0) * 2,
      coalesce(discountPercentage, 0) > 0 => coalesce(discountPercentage, 0) * 2,
      0
    )
  } | order(recommendationScore desc, discountPercentage desc)[0..49]`;

  try {
    const allProducts = await sanity.fetch(query);
    if (!allProducts || allProducts.length === 0) return [];

    // 2段階の重複チェック：slug、正規化された商品名
    const uniqueProducts: Product[] = [];
    const seenSlugs = new Set<string>();
    const seenNormalizedNames = new Set<string>();

    for (const product of allProducts) {
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
      uniqueProducts.push(product);

      console.log(`[追加] ${product.name} → 正規化名: ${normalizedName}`);

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

      <div className="min-h-screen bg-gradient-pastel">
        {/* Hero Section with Search */}
        <HeroSearch popularSearches={popularIngredientsWithStats} />

        {/* How to Use Suptia - 3 Steps */}
        <div className="glass shadow-glass border-b border-white/30">
          <div className="mx-auto px-6 lg:px-12 xl:px-16 py-8 max-w-6xl">
            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="group relative">
                <div className="glass-blue rounded-xl p-6 shadow-soft hover:shadow-glass transition-all duration-300 h-full flex items-center gap-5">
                  {/* Step Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-blue rounded-full flex items-center justify-center shadow-glass group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-primary-900 mb-1">
                      検索・発見
                    </h3>
                    <p className="text-xs text-primary-700 font-light leading-relaxed">
                      目的や成分でサプリを検索
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Search
                      className="text-primary/30"
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="glass-mint rounded-xl p-6 shadow-soft hover:shadow-glass transition-all duration-300 h-full flex items-center gap-5">
                  {/* Step Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-mint rounded-full flex items-center justify-center shadow-glass group-hover:scale-110 transition-transform">
                    <span className="text-primary-900 font-bold text-lg">
                      2
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-primary-900 mb-1">
                      比較・分析
                    </h3>
                    <p className="text-xs text-primary-700 font-light leading-relaxed">
                      科学的根拠と価格を比較
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BarChart3
                      className="text-accent-mint/30"
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="glass-purple rounded-xl p-6 shadow-soft hover:shadow-glass transition-all duration-300 h-full flex items-center gap-5">
                  {/* Step Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-glass group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-primary-900 mb-1">
                      選択・購入
                    </h3>
                    <p className="text-xs text-primary-700 font-light leading-relaxed">
                      エビデンス重視で選択
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2
                      className="text-accent-purple/30"
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* おすすめサプリセクション */}
        {featuredProductsWithCost.length > 0 && (
          <section className="py-12 border-b border-primary-100">
            <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">
                  おすすめのサプリメント
                </h2>
                <Link
                  href="/products"
                  className="text-primary hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  他の商品を見る
                  <TrendingUp size={16} />
                </Link>
              </div>

              {/* 横スクロール可能なカルーセル */}
              <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16">
                <div className="flex gap-4 pb-4">
                  {featuredProductsWithCost.map((product) => (
                    <Link
                      key={product.slug.current}
                      href={`/products/${product.slug.current}`}
                      className="group flex-shrink-0 w-[280px] bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* 商品画像 */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-blue">
                        {product.externalImageUrl ? (
                          <Image
                            src={product.externalImageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-primary-300/60">
                            <Award size={48} strokeWidth={1} />
                          </div>
                        )}
                        {/* キャンペーン・割引バッジ */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                          {product.isCampaign && (
                            <div className="px-3 py-1 bg-red-500 rounded text-white text-xs font-bold shadow-md">
                              🎉 キャンペーン中
                            </div>
                          )}
                          {product.discountPercentage &&
                            product.discountPercentage > 0 && (
                              <div className="px-3 py-1 bg-orange-500 rounded text-white text-xs font-bold shadow-md">
                                {product.discountPercentage.toFixed(0)}% OFF
                              </div>
                            )}
                        </div>
                        {/* 成分タグ（画像下部） */}
                        {product.ingredients &&
                          product.ingredients.length > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm px-3 py-2">
                              <div className="flex flex-wrap gap-1.5">
                                {product.ingredients.slice(0, 2).map(
                                  (item, index) =>
                                    item.ingredient && (
                                      <div
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white/90 text-primary-900 shadow-sm"
                                      >
                                        {item.ingredient.name}
                                      </div>
                                    ),
                                )}
                                {product.ingredients.length > 2 && (
                                  <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-white/70 text-primary-700">
                                    +{product.ingredients.length - 2}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* 商品情報 */}
                      <div className="p-4">
                        {/* 商品名 */}
                        <h3 className="text-base font-bold text-primary-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        {/* 評価 */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-0.5 px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">
                            {product.rating.toFixed(1)}
                          </div>
                          <span className="text-xs text-primary-600">
                            ({product.reviewCount}件)
                          </span>
                        </div>

                        {/* 価格（割引前価格がある場合は表示） */}
                        <div className="mb-3">
                          {product.originalPrice &&
                            product.originalPrice > product.priceJPY && (
                              <div className="text-sm text-gray-500 line-through">
                                ¥{product.originalPrice.toLocaleString()}
                              </div>
                            )}
                        </div>

                        {/* 現在価格 */}
                        <div className="flex items-end justify-between mb-3">
                          {/* 左側: 商品価格 */}
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              商品価格
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              ¥{product.priceJPY.toLocaleString()}
                            </div>
                          </div>

                          {/* 右側: 1日あたりの価格 */}
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              最安値
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              ¥{product.effectiveCostPerDay.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              1日あたり
                            </div>
                          </div>
                        </div>

                        {/* 比較するボタン */}
                        <button className="w-full px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary-700 transition-colors">
                          比較する
                        </button>
                      </div>
                    </Link>
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
                    <Link
                      key={ingredient.slug.current}
                      href={`/search?q=${encodeURIComponent(ingredient.name)}`}
                      className="group flex-shrink-0 w-[280px] bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* SVGアイキャッチ画像 */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <IngredientCoverSVG
                          name={ingredient.name}
                          nameEn={ingredient.nameEn}
                          category={ingredient.category}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 商品情報 */}
                      <div className="p-4">
                        {/* 成分名 */}
                        <h3 className="text-base font-bold text-primary-900 mb-1 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                          {ingredient.name}
                        </h3>
                        <p className="text-xs text-primary-600 mb-3">
                          {ingredient.nameEn}
                        </p>

                        {/* 統計情報 */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-primary-900">
                              {ingredient.productCount}種類
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-primary-600">
                              最安値
                            </span>
                            <span className="text-sm font-bold text-primary-900">
                              ¥{ingredient.minPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* 料金プランをチェックボタン */}
                        <button className="w-full mt-2 px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary-700 transition-colors">
                          商品を見る
                        </button>
                      </div>
                    </Link>
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
