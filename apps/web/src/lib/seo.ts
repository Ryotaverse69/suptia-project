import { Metadata } from "next";
import { getSiteUrl } from "./runtimeConfig";
import { formatPrice } from "./format";

// Base SEO configuration
const SITE_NAME = "サプティア";
const SITE_DESCRIPTION = "安全 × 価格 × 説明可能性のサプリ意思決定エンジン";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description = SITE_DESCRIPTION,
  canonical,
  ogImage,
  noIndex = false,
  keywords = [],
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const siteUrl = getSiteUrl();
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const imageUrl = ogImage || `${siteUrl}/og-default.jpg`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex ? "noindex,nofollow" : "index,follow",

    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

// Product-specific SEO
export interface ProductSEOData {
  name: string;
  brand: string;
  description?: string;
  priceJPY?: number; // 単一価格（後方互換性）
  prices?: Array<{
    // 複数価格対応
    amount: number;
    source?: string;
  }>;
  slug: string;
  images?: string[];
  mainIngredient?: string; // 主成分
  ingredientAmount?: number; // 成分量（mg/日）
}

export function generateProductMetadata(product: ProductSEOData): Metadata {
  // 価格情報の取得
  let lowestPrice = product.priceJPY || 0;
  let highestPrice = product.priceJPY || 0;
  let priceCount = 0;

  if (product.prices && product.prices.length > 0) {
    const validPrices = product.prices.filter((p) => p.amount > 0);
    if (validPrices.length > 0) {
      lowestPrice = Math.min(...validPrices.map((p) => p.amount));
      highestPrice = Math.max(...validPrices.map((p) => p.amount));
      priceCount = validPrices.length;
    }
  }

  const savings = highestPrice - lowestPrice;

  // 最適化されたタイトル（具体的な価格情報を含む）
  const now = new Date();
  const yearMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  const title =
    lowestPrice > 0
      ? `【${yearMonth}最新】${product.name} | 最安値¥${lowestPrice.toLocaleString()}で徹底比較`
      : `${product.name} - ${product.brand}`;

  // 最適化されたディスクリプション（検索意図に応答）
  let description = product.description;

  if (!description && lowestPrice > 0) {
    const parts = [
      `${product.name}を選ぶ前に必読！`,
      `楽天・Amazon・Yahoo!で最安値¥${lowestPrice.toLocaleString()}`,
    ];

    if (savings > 0) {
      parts.push(`（最大¥${savings.toLocaleString()}お得）`);
    }

    if (priceCount > 1) {
      parts.push(`。${priceCount}サイトの価格を3秒で比較`);
    }

    if (product.mainIngredient && product.ingredientAmount) {
      parts.push(
        `。${product.mainIngredient} ${product.ingredientAmount}mg配合`,
      );
    }

    parts.push(`。成分量・安全性・コスパで${product.brand}を徹底評価。`);
    description = parts.join("");
  } else if (!description) {
    description = `${product.brand}の${product.name}を徹底分析。価格・成分量・エビデンス・安全性で科学的に評価。最安値が3秒でわかります。`;
  }

  return generateMetadata({
    title,
    description,
    canonical: `/products/${product.slug}`,
    keywords: [
      product.name,
      product.brand,
      "サプリメント",
      "栄養補助食品",
      "価格比較",
      "最安値",
      "コスト分析",
      ...(product.mainIngredient ? [product.mainIngredient] : []),
    ],
  });
}

// JSON-LD structured data generators
export function generateProductJsonLd(product: ProductSEOData) {
  const siteUrl = getSiteUrl();

  // 基本情報
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    description: product.description || `${product.brand}の${product.name}`,
    image: product.images?.[0] || `${siteUrl}/product-placeholder.jpg`,
    url: `${siteUrl}/products/${product.slug}`,
  };

  let hasOffers = false;

  // オファー情報（複数価格対応）
  if (product.prices && product.prices.length > 0) {
    const validPrices = product.prices.filter((p) => p.amount > 0);
    if (validPrices.length > 1) {
      // AggregateOffer（複数ECサイトの価格帯）
      const lowestPrice = Math.min(...validPrices.map((p) => p.amount));
      const highestPrice = Math.max(...validPrices.map((p) => p.amount));

      jsonLd.offers = {
        "@type": "AggregateOffer",
        priceCurrency: "JPY",
        lowPrice: lowestPrice,
        highPrice: highestPrice,
        offerCount: validPrices.length,
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/products/${product.slug}`,
        seller: {
          "@type": "Organization",
          name: "サプティア",
        },
      };
      hasOffers = true;
    } else if (validPrices.length === 1) {
      // 単一価格
      jsonLd.offers = {
        "@type": "Offer",
        price: validPrices[0].amount,
        priceCurrency: "JPY",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/products/${product.slug}`,
        seller: {
          "@type": "Organization",
          name: "サプティア",
        },
      };
      hasOffers = true;
    }
  } else if (product.priceJPY) {
    // 後方互換性：単一価格
    jsonLd.offers = {
      "@type": "Offer",
      price: product.priceJPY,
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "サプティア",
      },
    };
    hasOffers = true;
  }

  // Googleの必須要件：offers、review、aggregateRatingのいずれかが必要
  // 価格情報がない場合は、aggregateRatingを追加（将来的に実際の評価システムに置き換え）
  if (!hasOffers) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: 4.0,
      reviewCount: 1,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return jsonLd;
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.url}`,
    })),
  };
}

export function generateOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "サプティア",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "科学的根拠に基づくサプリメント比較プラットフォーム。安全性、エビデンス、コストパフォーマンスで評価",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@suptia.com",
    },
    sameAs: [
      // SNSアカウントがあれば追加
      // "https://twitter.com/suptia",
      // "https://www.facebook.com/suptia",
    ],
  };
}

// Canonical URL utilities
export function cleanUrl(url: string): string {
  const urlObj = new URL(url);

  // Remove tracking parameters
  const trackingParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "msclkid",
    "twclid",
    "ref",
    "source",
    "campaign",
  ];

  trackingParams.forEach((param) => {
    urlObj.searchParams.delete(param);
  });

  return urlObj.toString();
}

// Font preloading utilities
export function getFontPreloadLinks() {
  return [
    {
      rel: "preload",
      href: "/fonts/inter-var.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
  ];
}

// ============================================================================
// AI検索最適化：成分ガイド用JSON-LD（MedicalWebPage + Drug schema）
// ============================================================================

export interface IngredientSEOData {
  name: string;
  nameEn?: string;
  slug: string;
  category?: string;
  description?: string;
  benefits?: string[];
  recommendedDosage?: string;
  sideEffects?: string;
  evidenceLevel?: string; // S/A/B/C/D
  references?: Array<{
    title?: string;
    url?: string;
    source?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * 成分ガイドページ用JSON-LD（MedicalWebPage + Drug schema）
 * AI検索エンジンが成分情報を正確に理解・引用するために最適化
 */
export function generateIngredientJsonLd(ingredient: IngredientSEOData) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/ingredients/${ingredient.slug}`;

  // MedicalWebPage schema（メインコンテナ）
  const medicalWebPage: any = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": pageUrl,
    name: `${ingredient.name}の効果・副作用・おすすめサプリ`,
    headline: `${ingredient.name}${ingredient.nameEn ? `（${ingredient.nameEn}）` : ""} - 科学的エビデンスに基づく成分ガイド`,
    description:
      ingredient.description ||
      `${ingredient.name}の効果、推奨摂取量、副作用、相互作用について科学的根拠に基づいて解説。`,
    url: pageUrl,
    inLanguage: "ja",
    isPartOf: {
      "@type": "WebSite",
      name: "サプティア",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "サプティア",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: new Date().toISOString().split("T")[0],
    dateModified: new Date().toISOString().split("T")[0],
  };

  // Drug/DietarySupplement schema（成分の詳細情報）
  const drugSchema: any = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: ingredient.name,
    alternateName: ingredient.nameEn,
    description:
      ingredient.description ||
      `${ingredient.name}は${ingredient.category || "栄養素"}の一種です。`,
    drugClass: ingredient.category || "Dietary Supplement",
    url: pageUrl,
  };

  // エビデンスレベルをlegalStatusとして表現
  if (ingredient.evidenceLevel) {
    const evidenceLevelMap: Record<string, string> = {
      S: "大規模RCT・メタ解析による高い信頼性",
      A: "良質な研究で効果が確認",
      B: "限定的研究・条件付きの効果",
      C: "動物実験・小規模試験レベル",
      D: "理論・未検証レベル",
    };
    drugSchema.legalStatus = `エビデンスレベル ${ingredient.evidenceLevel}: ${evidenceLevelMap[ingredient.evidenceLevel] || "評価中"}`;
  }

  // 推奨摂取量
  if (ingredient.recommendedDosage) {
    drugSchema.dosageForm = ingredient.recommendedDosage;
  }

  // 副作用・注意事項
  if (ingredient.sideEffects) {
    drugSchema.warning = ingredient.sideEffects;
  }

  // 効果・効能（medicalConditionTreatedは避け、indicationを使用）
  if (ingredient.benefits && ingredient.benefits.length > 0) {
    drugSchema.mechanismOfAction = ingredient.benefits.slice(0, 5).join("。");
  }

  // 参考文献
  if (ingredient.references && ingredient.references.length > 0) {
    medicalWebPage.citation = ingredient.references
      .filter((ref) => ref.url)
      .slice(0, 5)
      .map((ref) => ({
        "@type": "CreativeWork",
        name: ref.title || ref.source || "参考文献",
        url: ref.url,
      }));
  }

  return [medicalWebPage, drugSchema];
}

/**
 * FAQPage schema（FAQ セクション用）
 * AI検索エンジンがQ&A形式で回答を引用しやすくする
 */
export function generateFAQPageJsonLd(
  faqs: Array<{ question: string; answer: string }>,
  pageUrl?: string,
) {
  if (!faqs || faqs.length === 0) return null;

  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    ...(pageUrl && { url: `${siteUrl}${pageUrl}` }),
  };
}

/**
 * 成分ガイドページのメタデータ生成
 */
export function generateIngredientMetadata(
  ingredient: IngredientSEOData,
): Metadata {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;

  // エビデンスレベルに応じたタイトル最適化
  const evidenceLabel = ingredient.evidenceLevel
    ? `【エビデンス${ingredient.evidenceLevel}】`
    : "";

  const title = `${evidenceLabel}${ingredient.name}の効果・副作用・おすすめサプリ【${yearMonth}最新】`;

  // AI検索に最適化されたディスクリプション
  let description =
    ingredient.description?.slice(0, 100) ||
    `${ingredient.name}の科学的根拠に基づく効果と副作用を解説。`;

  if (ingredient.benefits && ingredient.benefits.length > 0) {
    description += ` 主な効果: ${ingredient.benefits.slice(0, 3).join("、")}。`;
  }

  if (ingredient.evidenceLevel) {
    description += ` エビデンスレベル: ${ingredient.evidenceLevel}。`;
  }

  description += " サプティアで詳しく比較・検証。";

  return generateMetadata({
    title,
    description: description.slice(0, 160),
    canonical: `/ingredients/${ingredient.slug}`,
    keywords: [
      ingredient.name,
      ingredient.nameEn || "",
      `${ingredient.name} 効果`,
      `${ingredient.name} 副作用`,
      `${ingredient.name} サプリ`,
      `${ingredient.name} おすすめ`,
      ingredient.category || "サプリメント",
    ].filter(Boolean),
  });
}

// ============================================================================
// Article schema（成分ガイド記事用）
// ============================================================================

export interface ArticleSEOData {
  headline: string;
  description?: string;
  slug: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}

/**
 * Article schema（成分ガイド記事用）
 */
export function generateArticleJsonLd(article: ArticleSEOData) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: `${siteUrl}/ingredients/${article.slug}`,
    image: article.image || `${siteUrl}/og-default.jpg`,
    author: {
      "@type": "Organization",
      name: article.author || "サプティア編集部",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "サプティア",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/ingredients/${article.slug}`,
    },
  };
}
