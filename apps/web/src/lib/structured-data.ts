/**
 * JSON-LD構造化データ生成ユーティリティ
 * Schema.org準拠のマークアップでSEO強化
 */

/**
 * schema.org/Product
 */
export interface ProductStructuredData {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description?: string;
  image?: string | string[];
  brand?: {
    "@type": "Brand" | "Organization";
    name: string;
  };
  offers?: {
    "@type": "Offer";
    url?: string;
    priceCurrency: string;
    price: number;
    priceValidUntil?: string;
    availability?:
      | "https://schema.org/InStock"
      | "https://schema.org/OutOfStock"
      | "https://schema.org/PreOrder";
    seller?: {
      "@type": "Organization";
      name: string;
    };
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: Array<{
    "@type": "Review";
    author: {
      "@type": "Person";
      name: string;
    };
    datePublished: string;
    reviewRating: {
      "@type": "Rating";
      ratingValue: number;
      bestRating?: number;
    };
    reviewBody?: string;
  }>;
  sku?: string;
  gtin?: string;
  mpn?: string;
  category?: string;
  additionalProperty?: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string | number;
  }>;
}

/**
 * schema.org/ItemList
 */
export interface ItemListStructuredData {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name?: string;
  description?: string;
  numberOfItems: number;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    url?: string;
    item?:
      | ProductStructuredData
      | {
          "@type": "Product";
          name: string;
          url?: string;
        };
  }>;
}

/**
 * schema.org/BreadcrumbList
 */
export interface BreadcrumbListStructuredData {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * schema.org/Article（成分ガイド用）
 */
export interface ArticleStructuredData {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": "Person" | "Organization";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
}

/**
 * schema.org/FAQPage
 */
export interface FAQPageStructuredData {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

/**
 * 商品用構造化データを生成
 */
export function generateProductStructuredData(params: {
  name: string;
  description?: string;
  imageUrl?: string;
  brand?: string;
  price?: number; // 単一価格（オプション）
  prices?: Array<{
    // 複数価格対応（優先）
    amount: number;
    source?: string;
  }>;
  priceCurrency?: string;
  url?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: {
    value: number;
    count: number;
  };
  sku?: string;
  gtin?: string;
  category?: string;
  ingredients?: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}): ProductStructuredData {
  const structuredData: ProductStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.name,
    description: params.description,
    image: params.imageUrl,
  };

  // ブランド情報
  if (params.brand) {
    structuredData.brand = {
      "@type": "Brand",
      name: params.brand,
    };
  }

  // オファー情報（複数価格対応）
  if (params.prices && params.prices.length > 0) {
    const validPrices = params.prices.filter((p) => p.amount > 0);
    if (validPrices.length > 0) {
      const lowestPrice = Math.min(...validPrices.map((p) => p.amount));
      const highestPrice = Math.max(...validPrices.map((p) => p.amount));

      // AggregateOffer（複数ECサイトの価格帯）
      structuredData.offers = {
        "@type": "AggregateOffer",
        priceCurrency: params.priceCurrency || "JPY",
        lowPrice: lowestPrice,
        highPrice: highestPrice,
        offerCount: validPrices.length,
        availability: params.availability
          ? `https://schema.org/${params.availability}`
          : "https://schema.org/InStock",
        url: params.url,
      } as any;
    }
  } else if (params.price) {
    // 単一価格の場合
    structuredData.offers = {
      "@type": "Offer",
      url: params.url,
      priceCurrency: params.priceCurrency || "JPY",
      price: params.price,
      availability: params.availability
        ? `https://schema.org/${params.availability}`
        : "https://schema.org/InStock",
    };
  }

  // 評価情報
  if (params.rating && params.rating.count > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: params.rating.value,
      reviewCount: params.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // 商品識別子
  if (params.sku) {
    structuredData.sku = params.sku;
  }
  if (params.gtin) {
    structuredData.gtin = params.gtin;
  }

  // カテゴリ
  if (params.category) {
    structuredData.category = params.category;
  }

  // 成分情報をadditionalPropertyとして追加
  if (params.ingredients && params.ingredients.length > 0) {
    structuredData.additionalProperty = params.ingredients.map(
      (ingredient) => ({
        "@type": "PropertyValue",
        name: ingredient.name,
        value: `${ingredient.amount}${ingredient.unit}`,
      }),
    );
  }

  return structuredData;
}

/**
 * 商品リスト用構造化データを生成
 */
export function generateItemListStructuredData(params: {
  name?: string;
  description?: string;
  items: Array<{
    name: string;
    url?: string;
    position?: number;
  }>;
}): ItemListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.name,
    description: params.description,
    numberOfItems: params.items.length,
    itemListElement: params.items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        url: item.url,
      },
    })),
  };
}

/**
 * パンくずリスト用構造化データを生成
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{
    name: string;
    url?: string;
  }>,
): BreadcrumbListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * 記事用構造化データを生成（成分ガイド用）
 */
export function generateArticleStructuredData(params: {
  headline: string;
  description?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  url?: string;
}): ArticleStructuredData {
  const structuredData: ArticleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    image: params.imageUrl,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
  };

  // 著者情報
  if (params.authorName) {
    structuredData.author = {
      "@type": "Organization",
      name: params.authorName,
    };
  }

  // 発行者情報
  if (params.publisherName) {
    structuredData.publisher = {
      "@type": "Organization",
      name: params.publisherName,
      logo: params.publisherLogoUrl
        ? {
            "@type": "ImageObject",
            url: params.publisherLogoUrl,
          }
        : undefined,
    };
  }

  // メインエンティティ
  if (params.url) {
    structuredData.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": params.url,
    };
  }

  return structuredData;
}

/**
 * FAQ用構造化データを生成
 */
export function generateFAQStructuredData(
  faqs: Array<{
    question: string;
    answer: string;
  }>,
): FAQPageStructuredData {
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
  };
}

/**
 * 構造化データをHTMLに埋め込むためのscriptタグ文字列を生成
 */
export function renderStructuredData(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Next.js Metadata用の構造化データを生成
 */
export function generateStructuredDataForMetadata(data: unknown) {
  return {
    type: "application/ld+json" as const,
    children: renderStructuredData(data),
  };
}

/**
 * 複数の構造化データを統合
 */
export function mergeStructuredData(dataArray: unknown[]): unknown[] {
  return dataArray.filter(Boolean);
}
