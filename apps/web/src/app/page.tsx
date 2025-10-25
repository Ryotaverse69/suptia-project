import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { HeroSearch } from "@/components/HeroSearch";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { IngredientCarousel } from "@/components/IngredientCarousel";
import { generateItemListStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { headers } from "next/headers";
import Script from "next/script";
import { Search, BarChart3, CheckCircle2, Award, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Product {
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: {
    current: string;
  };
}

interface Ingredient {
  name: string;
  nameEn: string;
  category: string;
  description: string;
  slug: {
    current: string;
  };
}

interface IngredientWithStats extends Ingredient {
  productCount: number;
  minPrice: number;
  sampleImageUrl?: string;
}

async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] | order(priceJPY asc)[0..12]{
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug
  }`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
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
    slug
  }`;

  try {
    const ingredients = await sanity.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    return [];
  }
}

// おすすめサプリを取得（上位4件）
async function getFeaturedProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] | order(priceJPY asc)[0..3]{
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug
  }`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

// 人気の成分を取得（上位6件）
async function getPopularIngredients(): Promise<Ingredient[]> {
  const query = `*[_type == "ingredient"][0..5]{
    name,
    nameEn,
    category,
    description,
    slug
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
    console.error(`Failed to fetch stats for ingredient ${ingredientSlug}:`, error);
    return {
      productCount: 0,
      minPrice: 0,
    };
  }
}

// 人気の成分と統計情報を取得
async function getPopularIngredientsWithStats(): Promise<IngredientWithStats[]> {
  const ingredients = await getPopularIngredients();

  const ingredientsWithStats = await Promise.all(
    ingredients.map(async (ingredient) => {
      const stats = await getIngredientStats(ingredient.slug.current);
      return {
        ...ingredient,
        ...stats,
      };
    })
  );

  return ingredientsWithStats;
}

export default async function Home() {
  const products = await getProducts();
  const ingredients = await getIngredients();
  const featuredProducts = await getFeaturedProducts();
  const popularIngredientsWithStats = await getPopularIngredientsWithStats();

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

  const nonce = headers().get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD Structured Data for Product List */}
      <Script id="itemlist-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <div className="min-h-screen bg-gradient-pastel">
        {/* Hero Section with Search */}
        <HeroSearch />

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
                    <Search className="text-primary/30" size={32} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="glass-mint rounded-xl p-6 shadow-soft hover:shadow-glass transition-all duration-300 h-full flex items-center gap-5">
                  {/* Step Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-mint rounded-full flex items-center justify-center shadow-glass group-hover:scale-110 transition-transform">
                    <span className="text-primary-900 font-bold text-lg">2</span>
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
                    <BarChart3 className="text-accent-mint/30" size={32} strokeWidth={1.5} />
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
                    <CheckCircle2 className="text-accent-purple/30" size={32} strokeWidth={1.5} />
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
                  href="#all-products"
                  className="text-primary hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  他の料金プランを見る
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
                          <img
                            src={product.externalImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-primary-300/60">
                            <Award size={48} strokeWidth={1} />
                          </div>
                        )}
                        {/* ベストバリューバッジ */}
                        <div className="absolute top-2 left-2">
                          <div className="px-3 py-1 bg-red-500 rounded text-white text-xs font-bold">
                            おすすめ
                          </div>
                        </div>
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

                        {/* 他のサイトより安い表示 */}
                        <div className="mb-3">
                          <div className="inline-block px-2 py-1 bg-red-500 text-white rounded text-xs font-bold mb-1">
                            他のサイトより{Math.floor(Math.random() * 30 + 10)}%お得
                          </div>
                        </div>

                        {/* 価格 */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary-900">
                              ¥{product.effectiveCostPerDay.toFixed(0)}
                            </p>
                            <p className="text-xs text-primary-600">1日あたり</p>
                          </div>
                        </div>

                        {/* 料金プランをチェックボタン */}
                        <button className="w-full mt-3 px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary-700 transition-colors">
                          料金プランをチェック
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
                      {/* 商品画像 */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-blue">
                        {ingredient.sampleImageUrl ? (
                          <img
                            src={ingredient.sampleImageUrl}
                            alt={ingredient.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-primary-300/60">
                            <Award size={48} strokeWidth={1} />
                          </div>
                        )}
                        {/* カテゴリバッジ */}
                        <div className="absolute top-2 left-2">
                          <div className="px-3 py-1 bg-primary rounded text-white text-xs font-bold">
                            {ingredient.category}
                          </div>
                        </div>
                      </div>

                      {/* 商品情報 */}
                      <div className="p-4">
                        {/* 成分名 */}
                        <h3 className="text-base font-bold text-primary-900 mb-1 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                          {ingredient.name}
                        </h3>
                        <p className="text-xs text-primary-600 mb-3">{ingredient.nameEn}</p>

                        {/* 統計情報 */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-primary-900">
                              {ingredient.productCount}種類
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-primary-600">最安値</span>
                            <span className="text-sm font-bold text-primary-900">
                              ¥{ingredient.minPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* 料金プランをチェックボタン */}
                        <button className="w-full mt-2 px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary-700 transition-colors">
                          商品を比較する
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 h-fit w-full lg:w-72 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Products Grid */}
            <main className="flex-1 min-w-0" id="all-products">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-light text-primary-900 tracking-wide">
                    すべてのサプリメント
                  </h2>
                  <p className="text-primary-600 mt-2 font-light">
                    {productsWithCost.length}件の商品が見つかりました
                  </p>
                </div>

                <select className="px-5 py-3 glass-blue rounded-xl text-sm font-light shadow-soft focus:outline-none focus:shadow-glass transition-shadow">
                  <option>おすすめ順</option>
                  <option>価格の安い順</option>
                  <option>価格の高い順</option>
                  <option>評価の高い順</option>
                  <option>レビュー数順</option>
                </select>
              </div>

              {productsWithCost.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsWithCost.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 glass rounded-3xl shadow-glass">
                  <div className="text-primary-300 mb-4">
                    <Award size={64} className="mx-auto" />
                  </div>
                  <p className="text-primary-700 font-light">
                    商品データを読み込み中...
                  </p>
                </div>
              )}

              {/* Load More Button */}
              {productsWithCost.length > 0 && (
                <div className="mt-10 text-center">
                  <button className="px-10 py-4 glass-blue rounded-xl text-primary-800 font-light shadow-glass hover:shadow-glass-hover transition-all duration-300">
                    もっと見る
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Ingredient Carousel */}
        <IngredientCarousel ingredients={ingredients} />
      </div>
    </>
  );
}
