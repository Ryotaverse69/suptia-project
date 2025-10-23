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
import { TrendingUp, Award, Shield } from "lucide-react";

interface Product {
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
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

async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] | order(priceJPY asc)[0..12]{
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
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

export default async function Home() {
  const products = await getProducts();
  const ingredients = await getIngredients();

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

        {/* Stats Bar */}
        <div className="glass shadow-glass border-b border-white/30">
          <div className="mx-auto px-6 lg:px-12 xl:px-16 py-8 max-w-[1440px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-4 glass-blue rounded-2xl shadow-soft">
                  <TrendingUp className="text-primary" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-light text-primary-900 tracking-wide">
                    1,200+
                  </div>
                  <div className="text-sm font-light text-primary-700 mt-1">
                    検証済みサプリ
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 glass-mint rounded-2xl shadow-soft">
                  <Shield className="text-accent-mint" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-light text-primary-900 tracking-wide">
                    98%
                  </div>
                  <div className="text-sm font-light text-primary-700 mt-1">
                    安全性スコア平均
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 glass-purple rounded-2xl shadow-soft">
                  <Award className="text-accent-purple" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-light text-primary-900 tracking-wide">
                    50,000+
                  </div>
                  <div className="text-sm font-light text-primary-700 mt-1">
                    ユーザーレビュー
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 h-fit w-full lg:w-72 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Products Grid */}
            <main className="flex-1 min-w-0">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-light text-primary-900 tracking-wide">
                    おすすめのサプリメント
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
