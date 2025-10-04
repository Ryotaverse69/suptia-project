import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { HeroSearch } from "@/components/HeroSearch";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
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

export default async function Home() {
  const products = await getProducts();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <HeroSearch />

      {/* Stats Bar */}
      <div className="bg-white border-b border-primary-200">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-6 max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">
                  1,200+
                </div>
                <div className="text-sm text-primary-700">検証済みサプリ</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-mint/20 rounded-lg">
                <Shield className="text-accent-mint" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">98%</div>
                <div className="text-sm text-primary-700">安全性スコア平均</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-purple/20 rounded-lg">
                <Award className="text-accent-purple" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">
                  50,000+
                </div>
                <div className="text-sm text-primary-700">ユーザーレビュー</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-8 max-w-[1440px]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 h-fit w-full lg:w-72 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">
                  おすすめのサプリメント
                </h2>
                <p className="text-primary-700 mt-1">
                  {productsWithCost.length}件の商品が見つかりました
                </p>
              </div>

              <select className="px-4 py-2 border border-primary-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>おすすめ順</option>
                <option>価格の安い順</option>
                <option>価格の高い順</option>
                <option>評価の高い順</option>
                <option>レビュー数順</option>
              </select>
            </div>

            {productsWithCost.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {productsWithCost.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-primary-300 mb-4">
                  <Award size={64} className="mx-auto" />
                </div>
                <p className="text-primary-700">商品データを読み込み中...</p>
              </div>
            )}

            {/* Load More Button */}
            {productsWithCost.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-white border-2 border-primary-300 text-primary-800 font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors">
                  もっと見る
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
