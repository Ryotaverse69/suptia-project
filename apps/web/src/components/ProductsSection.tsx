"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Award } from "lucide-react";
import { TierRatings } from "@/lib/tier-ranking";

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  source?: string;
  slug: {
    current: string;
  };
  priceData?: Array<{
    source: string;
    amount: number;
    currency: string;
    url: string;
  }>;
  effectiveCostPerDay: number;
  rating: number;
  reviewCount: number;
  isBestValue: boolean;
  safetyScore: number;
  imageUrl?: string;
  externalImageUrl?: string;
  servingsPerDay?: number;
  servingsPerContainer?: number;
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: {
      name: string;
      nameEn: string;
      category?: string;
    };
  }>;
  tierRatings?: TierRatings;
}

interface ProductsSectionProps {
  products: Product[];
}

type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "reviews";

export function ProductsSection({ products }: ProductsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [evidenceLevelFilter, setEvidenceLevelFilter] = useState<string | null>(
    null,
  );
  const [ecSiteFilter, setEcSiteFilter] = useState<string | null>(null);

  // フィルタリングとソート
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // 検索クエリフィルター
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 価格帯フィルター
    if (priceRange) {
      filtered = filtered.filter((product) => {
        if (priceRange === "0-2000")
          return product.priceJPY >= 0 && product.priceJPY <= 2000;
        if (priceRange === "2000-5000")
          return product.priceJPY > 2000 && product.priceJPY <= 5000;
        if (priceRange === "5000-10000")
          return product.priceJPY > 5000 && product.priceJPY <= 10000;
        if (priceRange === "10000+") return product.priceJPY > 10000;
        return true;
      });
    }

    // Tierランクフィルター（選択したランクと完全一致）
    if (evidenceLevelFilter) {
      filtered = filtered.filter(
        (product) => product.tierRatings?.overallRank === evidenceLevelFilter,
      );
    }

    // ECサイトフィルター
    if (ecSiteFilter) {
      filtered = filtered.filter((product) => {
        // メインのsourceがマッチする場合
        if (product.source === ecSiteFilter) {
          return true;
        }
        // または、priceData配列に指定されたECサイトが含まれる場合
        if (product.priceData && product.priceData.length > 0) {
          return product.priceData.some(
            (price) => price.source === ecSiteFilter,
          );
        }
        return false;
      });
    }

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.priceJPY - b.priceJPY;
        case "price-desc":
          return b.priceJPY - a.priceJPY;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "recommended":
        default:
          // おすすめ順：ベストバリュー優先、次に評価、次に価格
          if (a.isBestValue !== b.isBestValue) {
            return a.isBestValue ? -1 : 1;
          }
          if (Math.abs(a.rating - b.rating) > 0.1) {
            return b.rating - a.rating;
          }
          return a.priceJPY - b.priceJPY;
      }
    });

    return filtered;
  }, [
    products,
    sortBy,
    searchQuery,
    priceRange,
    evidenceLevelFilter,
    ecSiteFilter,
  ]);

  const handleFilterChange = (filters: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    ecSite?: string | null;
  }) => {
    if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
    if (filters.priceRange !== undefined) setPriceRange(filters.priceRange);
    if (filters.evidenceLevel !== undefined)
      setEvidenceLevelFilter(filters.evidenceLevel);
    if (filters.ecSite !== undefined) setEcSiteFilter(filters.ecSite);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange(null);
    setEvidenceLevelFilter(null);
    setEcSiteFilter(null);
  };

  return (
    <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit w-full lg:w-72 flex-shrink-0">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFilters={{
              searchQuery,
              priceRange,
              evidenceLevel: evidenceLevelFilter,
              ecSite: ecSiteFilter,
            }}
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1 min-w-0" id="all-products">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-light text-primary-900 tracking-wide">
                すべてのサプリメント
              </h2>
              <p className="text-primary-600 mt-2 font-light">
                {filteredAndSortedProducts.length}件の商品が見つかりました
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-5 py-3 glass-blue rounded-xl text-sm font-light shadow-soft focus:outline-none focus:shadow-glass transition-shadow cursor-pointer"
            >
              <option value="recommended">おすすめ順</option>
              <option value="price-asc">価格の安い順</option>
              <option value="price-desc">価格の高い順</option>
              <option value="rating">評価の高い順</option>
              <option value="reviews">レビュー数順</option>
            </select>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl shadow-glass">
              <div className="text-primary-300 mb-4">
                <Award size={64} className="mx-auto" />
              </div>
              <p className="text-primary-700 font-light mb-2">
                条件に一致する商品が見つかりませんでした
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                フィルターをクリア
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredAndSortedProducts.length > 0 && (
            <div className="mt-10 text-center">
              <button className="px-10 py-4 glass-blue rounded-xl text-primary-800 font-light shadow-glass hover:shadow-glass-hover transition-all duration-300">
                もっと見る
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
