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
  const title = lowestPrice > 0
    ? `${product.name} | 最安値¥${lowestPrice.toLocaleString()}から比較`
    : `${product.name} - ${product.brand}`;

  // 最適化されたディスクリプション（検索意図に応答）
  let description = product.description;

  if (!description && lowestPrice > 0) {
    const parts = [
      `${product.name}を徹底比較！`,
      `最安値¥${lowestPrice.toLocaleString()}`,
    ];

    if (savings > 0) {
      parts.push(`（最大¥${savings.toLocaleString()}お得）`);
    }

    if (priceCount > 1) {
      parts.push(`。楽天・Amazon・Yahoo!など${priceCount}サイトで価格比較`);
    }

    if (product.mainIngredient && product.ingredientAmount) {
      parts.push(
        `。${product.mainIngredient}配合量${product.ingredientAmount}mg/日`,
      );
    }

    parts.push("。");
    description = parts.join("");
  } else if (!description) {
    description = `${product.brand}の${product.name}。詳細な価格分析と成分情報をご覧いただけます。`;
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
      };
    } else if (validPrices.length === 1) {
      // 単一価格
      jsonLd.offers = {
        "@type": "Offer",
        price: validPrices[0].amount,
        priceCurrency: "JPY",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/products/${product.slug}`,
      };
    }
  } else if (product.priceJPY) {
    // 後方互換性：単一価格
    jsonLd.offers = {
      "@type": "Offer",
      price: product.priceJPY,
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${product.slug}`,
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
