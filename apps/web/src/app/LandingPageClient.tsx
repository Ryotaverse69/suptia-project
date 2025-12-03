"use client";

import {
  HeroRevolution,
  AnimatedStats,
  CompactSteps,
  FlatCarousel,
  MasonryIngredients,
  SpringAccordion,
  StickyCTA,
} from "@/components/landing";

interface Product {
  name: string;
  priceJPY: number;
  effectiveCostPerDay: number;
  externalImageUrl?: string;
  slug: { current: string };
  tierRatings?: {
    overallRank?: string;
  };
  badges?: string[];
  ingredients?: Array<{
    ingredient?: {
      name: string;
    };
  }>;
}

interface IngredientWithStats {
  name: string;
  nameEn: string;
  category: string;
  description: string;
  slug: { current: string };
  productCount: number;
  minPrice: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface LandingPageClientProps {
  featuredProducts: Product[];
  popularIngredients: IngredientWithStats[];
  totalProductCount: number;
  faqData: FAQItem[];
}

export function LandingPageClient({
  featuredProducts,
  popularIngredients,
  totalProductCount,
  faqData,
}: LandingPageClientProps) {
  return (
    <div className="relative bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroRevolution popularSearches={popularIngredients} />

      {/* Animated Stats */}
      <AnimatedStats totalProducts={totalProductCount} />

      {/* How It Works - Compact Steps */}
      <CompactSteps />

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <FlatCarousel
          products={featuredProducts}
          title="おすすめのサプリメント"
          subtitle="科学的根拠と人気度に基づいた厳選セレクション"
        />
      )}

      {/* Popular Ingredients - Masonry Grid */}
      {popularIngredients.length > 0 && (
        <MasonryIngredients
          ingredients={popularIngredients}
          title="人気の成分"
          subtitle="科学的根拠に基づいた成分ガイド"
        />
      )}

      {/* FAQ Section */}
      <SpringAccordion
        items={faqData}
        title="よくある質問"
        subtitle="Suptiaについてよくいただくご質問をまとめました"
      />

      {/* Sticky CTA */}
      <StickyCTA
        showAfterScroll={0.3}
        href="/diagnosis"
        text="あなたに最適なサプリを診断"
        subtext="無料で今すぐ診断"
      />
    </div>
  );
}
