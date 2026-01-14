/**
 * Next.js Metadata API ヘルパー
 * 構造化データとメタタグを統合管理
 */

import type { Metadata } from "next";
import {
  generateProductStructuredData,
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  renderStructuredData,
  mergeStructuredData,
  type ProductStructuredData,
  type ItemListStructuredData,
  type BreadcrumbListStructuredData,
  type ArticleStructuredData,
  type FAQPageStructuredData,
} from "./structured-data";

/**
 * サイト基本情報
 */
export const SITE_CONFIG = {
  name: "サプティア（Suptia）",
  description:
    "科学的エビデンスに基づく、安全で信頼できるサプリメント比較・推薦プラットフォーム",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com",
  ogImage: "/og-image.jpg",
  twitterHandle: "@suptia_official",
  locale: "ja_JP",
};

/**
 * 基本メタデータを生成
 */
export function generateBasicMetadata(params: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    path = "",
    ogImage = SITE_CONFIG.ogImage,
    noIndex = false,
  } = params;

  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title: fullTitle,
    description,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: SITE_CONFIG.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 商品詳細ページのメタデータを生成
 */
export function generateProductMetadata(params: {
  name: string;
  description?: string;
  imageUrl?: string;
  brand?: string;
  price: number;
  rating?: {
    value: number;
    count: number;
  };
  slug: string;
  ingredients?: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}): Metadata {
  const {
    name,
    description,
    imageUrl,
    brand,
    price,
    rating,
    slug,
    ingredients,
  } = params;

  const path = `/products/${slug}`;
  const url = `${SITE_CONFIG.url}${path}`;

  // 構造化データ生成
  const productData = generateProductStructuredData({
    name,
    description,
    imageUrl,
    brand,
    price,
    rating,
    url,
    availability: "InStock",
    ingredients,
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: SITE_CONFIG.url },
    { name: "商品一覧", url: `${SITE_CONFIG.url}/products` },
    { name, url },
  ]);

  const structuredData = mergeStructuredData([productData, breadcrumbData]);

  return {
    ...generateBasicMetadata({
      title: `${name}${brand ? ` - ${brand}` : ""}`,
      description:
        description ||
        `${name}の詳細情報。価格、成分、レビュー、科学的根拠を確認できます。`,
      path,
      ogImage: imageUrl,
    }),
    other: {
      "product:price:amount": price.toString(),
      "product:price:currency": "JPY",
    },
    // Next.js 14の新しいMetadata API
    ...{
      // @ts-ignore - Next.js 14+ supports this
      jsonLd: structuredData,
    },
  };
}

/**
 * 成分ガイドページのメタデータを生成
 */
export function generateIngredientMetadata(params: {
  name: string;
  nameEn?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  slug: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}): Metadata {
  const { name, nameEn, description, category, imageUrl, slug, faqs } = params;

  const path = `/ingredients/${slug}`;
  const url = `${SITE_CONFIG.url}${path}`;

  // 記事の構造化データ
  const articleData = generateArticleStructuredData({
    headline: `${name}${nameEn ? `（${nameEn}）` : ""} - 完全ガイド`,
    description:
      description ||
      `${name}の効果、推奨摂取量、副作用、科学的根拠を徹底解説。`,
    imageUrl,
    datePublished: new Date().toISOString(),
    authorName: SITE_CONFIG.name,
    publisherName: SITE_CONFIG.name,
    publisherLogoUrl: `${SITE_CONFIG.url}/logo.png`,
    url,
  });

  // FAQの構造化データ
  const faqData =
    faqs && faqs.length > 0 ? generateFAQStructuredData(faqs) : null;

  // パンくずリスト
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: SITE_CONFIG.url },
    { name: "成分ガイド", url: `${SITE_CONFIG.url}/ingredients` },
    ...(category
      ? [
          {
            name: category,
            url: `${SITE_CONFIG.url}/ingredients?category=${category}`,
          },
        ]
      : []),
    { name, url },
  ]);

  const structuredData = mergeStructuredData([
    articleData,
    faqData,
    breadcrumbData,
  ]);

  return {
    ...generateBasicMetadata({
      title: `${name}${nameEn ? `（${nameEn}）` : ""} - 効果・摂取量・副作用`,
      description:
        description ||
        `${name}の効果、推奨摂取量、副作用、科学的エビデンスを徹底解説。信頼できる情報源に基づいた成分ガイド。`,
      path,
      ogImage: imageUrl,
    }),
    ...{
      // @ts-ignore
      jsonLd: structuredData,
    },
  };
}

/**
 * 商品一覧ページのメタデータを生成
 */
export function generateProductListMetadata(params: {
  title: string;
  description?: string;
  products: Array<{
    name: string;
    slug: string;
  }>;
  category?: string;
  path?: string;
}): Metadata {
  const { title, description, products, category, path = "/products" } = params;

  const url = `${SITE_CONFIG.url}${path}`;

  // 商品リストの構造化データ
  const itemListData = generateItemListStructuredData({
    name: title,
    description,
    items: products.map((product, index) => ({
      name: product.name,
      url: `${SITE_CONFIG.url}/products/${product.slug}`,
      position: index + 1,
    })),
  });

  // パンくずリスト
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: SITE_CONFIG.url },
    ...(category
      ? [
          { name: "商品一覧", url: `${SITE_CONFIG.url}/products` },
          { name: category, url },
        ]
      : [{ name: "商品一覧", url }]),
  ]);

  const structuredData = mergeStructuredData([itemListData, breadcrumbData]);

  return {
    ...generateBasicMetadata({
      title,
      description:
        description ||
        `${title}の一覧。科学的根拠に基づいて厳選されたサプリメント。`,
      path,
    }),
    ...{
      // @ts-ignore
      jsonLd: structuredData,
    },
  };
}

// Note: For Next.js 14+, use the Metadata API's jsonLd field instead of this component
