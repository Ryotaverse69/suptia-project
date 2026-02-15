"use client";

import { useState, useMemo } from "react";
import { ProductListItem } from "@/components/ProductListItem";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Package, ChevronDown } from "lucide-react";
import { TierRatings } from "@/lib/tier-ranking";
import { BadgeType, isPerfectSupplement } from "@/lib/badges";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  source?: string;
  brand?: string;
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
  badges?: BadgeType[];
  form?: string;
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

const PRODUCTS_PER_PAGE = 20;

export function ProductsSection({ products }: ProductsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [evidenceLevelFilter, setEvidenceLevelFilter] = useState<string | null>(
    null,
  );
  const [ecSiteFilter, setEcSiteFilter] = useState<string | null>(null);
  const [badgeFilters, setBadgeFilters] = useState<string[]>([]);
  const [ingredientFilter, setIngredientFilter] = useState<string | null>(null);
  const [formTypeFilter, setFormTypeFilter] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);

  // フィルターカウントを計算
  const filterCounts = useMemo(() => {
    const counts = {
      ingredients: {} as Record<string, number>,
      sources: {} as Record<string, number>,
      priceRanges: {} as Record<string, number>,
      tiers: {} as Record<string, number>,
      forms: {} as Record<string, number>,
    };

    products.forEach((product) => {
      // 成分カウント
      product.ingredients?.forEach((ing) => {
        if (ing.ingredient?.name) {
          counts.ingredients[ing.ingredient.name] =
            (counts.ingredients[ing.ingredient.name] || 0) + 1;
        }
      });

      // ソースカウント
      if (product.source) {
        counts.sources[product.source] =
          (counts.sources[product.source] || 0) + 1;
      }

      // 価格帯カウント
      if (product.priceJPY <= 2000) {
        counts.priceRanges["0-2000"] = (counts.priceRanges["0-2000"] || 0) + 1;
      } else if (product.priceJPY <= 5000) {
        counts.priceRanges["2000-5000"] =
          (counts.priceRanges["2000-5000"] || 0) + 1;
      } else if (product.priceJPY <= 10000) {
        counts.priceRanges["5000-10000"] =
          (counts.priceRanges["5000-10000"] || 0) + 1;
      } else {
        counts.priceRanges["10000+"] = (counts.priceRanges["10000+"] || 0) + 1;
      }

      // Tierカウント
      if (product.tierRatings?.overallRank) {
        counts.tiers[product.tierRatings.overallRank] =
          (counts.tiers[product.tierRatings.overallRank] || 0) + 1;
      }

      // 剤形カウント
      if (product.form) {
        counts.forms[product.form] = (counts.forms[product.form] || 0) + 1;
      } else {
        counts.forms["unknown"] = (counts.forms["unknown"] || 0) + 1;
      }
    });

    return counts;
  }, [products]);

  // フィルタリングとソート
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // 検索クエリフィルター（商品名、ブランド名、成分名に対応）
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        // 商品名
        if (product.name.toLowerCase().includes(query)) return true;
        // ブランド名
        if (product.brand?.toLowerCase().includes(query)) return true;
        // 成分名
        if (
          product.ingredients?.some(
            (ing) =>
              ing.ingredient?.name.toLowerCase().includes(query) ||
              ing.ingredient?.nameEn?.toLowerCase().includes(query),
          )
        )
          return true;
        return false;
      });
    }

    // 成分フィルター
    if (ingredientFilter) {
      filtered = filtered.filter((product) =>
        product.ingredients?.some(
          (ing) => ing.ingredient?.name === ingredientFilter,
        ),
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

    // 剤形フィルター
    if (formTypeFilter) {
      if (formTypeFilter === "unknown") {
        filtered = filtered.filter((product) => !product.form);
      } else {
        filtered = filtered.filter(
          (product) => product.form === formTypeFilter,
        );
      }
    }

    // バッジフィルター（複数選択対応）
    if (badgeFilters.length > 0) {
      filtered = filtered.filter((product) => {
        // 5冠達成が選択されている場合
        if (badgeFilters.includes("perfect")) {
          return isPerfectSupplement(product.badges || []);
        }

        // 複数のバッジが選択されている場合、すべてのバッジを持つ商品のみ表示（AND条件）
        return badgeFilters.every((badgeFilter) =>
          product.badges?.includes(badgeFilter as BadgeType),
        );
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
    badgeFilters,
    ingredientFilter,
    formTypeFilter,
  ]);

  const handleFilterChange = (filters: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    ecSite?: string | null;
    badges?: string[];
    ingredient?: string | null;
    formType?: string | null;
  }) => {
    if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
    if (filters.priceRange !== undefined) setPriceRange(filters.priceRange);
    if (filters.evidenceLevel !== undefined)
      setEvidenceLevelFilter(filters.evidenceLevel);
    if (filters.ecSite !== undefined) setEcSiteFilter(filters.ecSite);
    if (filters.badges !== undefined) setBadgeFilters(filters.badges);
    if (filters.ingredient !== undefined)
      setIngredientFilter(filters.ingredient);
    if (filters.formType !== undefined) setFormTypeFilter(filters.formType);
    // フィルター変更時は表示件数をリセット
    setDisplayCount(PRODUCTS_PER_PAGE);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange(null);
    setEvidenceLevelFilter(null);
    setEcSiteFilter(null);
    setBadgeFilters([]);
    setIngredientFilter(null);
    setFormTypeFilter(null);
    setDisplayCount(PRODUCTS_PER_PAGE);
  };

  const handleShowMore = () => {
    setDisplayCount((prev) =>
      Math.min(prev + PRODUCTS_PER_PAGE, filteredAndSortedProducts.length),
    );
  };

  const displayedProducts = filteredAndSortedProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSortedProducts.length;
  const remainingCount = filteredAndSortedProducts.length - displayCount;

  return (
    <div
      className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]"
      style={{ fontFamily: fontStack }}
    >
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
              badges: badgeFilters,
              ingredient: ingredientFilter,
              formType: formTypeFilter,
            }}
            filterCounts={filterCounts}
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1 min-w-0" id="all-products">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2
                className="text-[28px] md:text-[32px] font-bold leading-tight tracking-[-0.015em]"
                style={{ color: appleWebColors.textPrimary }}
              >
                すべてのサプリメント
              </h2>
              <p
                className="text-[15px] mt-2"
                style={{ color: appleWebColors.textSecondary }}
              >
                {filteredAndSortedProducts.length}件の商品が見つかりました
              </p>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`appearance-none px-5 py-3 pr-10 rounded-xl text-[15px] font-medium cursor-pointer transition-all duration-300 min-h-[44px] ${liquidGlassClasses.light}`}
                style={{
                  color: appleWebColors.textPrimary,
                }}
              >
                <option value="recommended">おすすめ順</option>
                <option value="price-asc">価格の安い順</option>
                <option value="price-desc">価格の高い順</option>
                <option value="rating">評価の高い順</option>
                <option value="reviews">レビュー数順</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: appleWebColors.textSecondary }}
              />
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {displayedProducts.map((product, index) => (
                <ProductListItem key={index} product={product} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-20 ${liquidGlassClasses.light}`}>
              <div className="mb-4">
                <Package
                  size={64}
                  className="mx-auto"
                  style={{ color: appleWebColors.borderSubtle }}
                />
              </div>
              <p
                className="text-[17px] font-medium mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                条件に一致する商品が見つかりませんでした
              </p>
              <p
                className="text-[15px] mb-6"
                style={{ color: appleWebColors.textSecondary }}
              >
                フィルター条件を変更してお試しください
              </p>
              <button
                onClick={handleClearFilters}
                className="px-8 py-3 rounded-full text-[15px] font-semibold transition-all duration-300 min-h-[44px]"
                style={{
                  backgroundColor: systemColors.blue,
                  color: "white",
                }}
              >
                フィルターをクリア
              </button>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={handleShowMore}
                className={`px-10 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 min-h-[44px] hover:opacity-80 ${liquidGlassClasses.light}`}
                style={{
                  color: appleWebColors.textPrimary,
                }}
              >
                もっと見る（残り{remainingCount}件）
              </button>
            </div>
          )}

          {/* 表示件数 */}
          {filteredAndSortedProducts.length > 0 && (
            <div className="mt-4 text-center">
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textTertiary }}
              >
                {displayedProducts.length}件 / 全
                {filteredAndSortedProducts.length}件を表示中
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
