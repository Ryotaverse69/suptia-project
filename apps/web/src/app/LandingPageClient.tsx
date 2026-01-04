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
import { appleWebColors, fontStack } from "@/lib/design-system";

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
  coverImage?: {
    asset: {
      url: string;
    };
  };
  sampleImageUrl?: string;
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
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
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
          subtitle="エビデンスに基づいた厳選商品"
        />
      )}

      {/* Popular Ingredients - Masonry Grid */}
      {popularIngredients.length > 0 && (
        <MasonryIngredients
          ingredients={popularIngredients}
          title="人気の成分"
          subtitle="各成分の効果と含有商品を確認"
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
        href="/concierge"
        text="AIに相談する"
        subtext="理由・注意点まで一緒に整理"
        buttonText="相談してみる"
      />
    </div>
  );
}
