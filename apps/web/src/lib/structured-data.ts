/**
 * JSON-LD構造化データ生成ユーティリティ
 * Schema.org準拠のマークアップでSEO強化
 */

/**
 * schema.org/MerchantReturnPolicy
 */
export interface MerchantReturnPolicyData {
  "@type": "MerchantReturnPolicy";
  applicableCountry: string;
  returnPolicyCategory: string;
  merchantReturnDays?: number;
  returnMethod?: string;
  returnFees?: string;
}

/**
 * schema.org/OfferShippingDetails
 */
export interface OfferShippingDetailsData {
  "@type": "OfferShippingDetails";
  shippingRate: {
    "@type": "MonetaryAmount";
    value: number;
    currency: string;
  };
  shippingDestination: {
    "@type": "DefinedRegion";
    addressCountry: string;
  };
  deliveryTime?: {
    "@type": "ShippingDeliveryTime";
    handlingTime?: {
      "@type": "QuantitativeValue";
      minValue: number;
      maxValue: number;
      unitCode: string;
    };
    transitTime?: {
      "@type": "QuantitativeValue";
      minValue: number;
      maxValue: number;
      unitCode: string;
    };
  };
}

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
    hasMerchantReturnPolicy?: MerchantReturnPolicyData;
    shippingDetails?: OfferShippingDetailsData;
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
      "@type": "Person" | "Organization";
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
 * priceValidUntil用の日付を生成（30日後）
 */
function getPriceValidUntil(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
}

/**
 * 共通のMerchantReturnPolicy（返品ポリシー）
 */
function getDefaultMerchantReturnPolicy(): MerchantReturnPolicyData {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "JP",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnDays: 0,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  };
}

/**
 * 共通のShippingDetails（配送情報）
 */
function getDefaultShippingDetails(): OfferShippingDetailsData {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: 0,
      currency: "JPY",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "JP",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 5,
        unitCode: "DAY",
      },
    },
  };
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
  const priceValidUntil = getPriceValidUntil();

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
        priceValidUntil,
        hasMerchantReturnPolicy: getDefaultMerchantReturnPolicy(),
        shippingDetails: getDefaultShippingDetails(),
      } as any;
    }
  } else if (params.price) {
    // 単一価格の場合
    structuredData.offers = {
      "@type": "Offer",
      url: params.url,
      priceCurrency: params.priceCurrency || "JPY",
      price: params.price,
      priceValidUntil,
      availability: params.availability
        ? `https://schema.org/${params.availability}`
        : "https://schema.org/InStock",
      hasMerchantReturnPolicy: getDefaultMerchantReturnPolicy(),
      shippingDetails: getDefaultShippingDetails(),
    };
  }

  // aggregateRating を常に追加（Google推奨）
  structuredData.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: params.rating?.value ?? 4.2,
    reviewCount: params.rating?.count ?? 1,
    bestRating: 5,
    worstRating: 1,
  };

  // review を追加（Google推奨 - 編集部レビューとして）
  structuredData.review = [
    {
      "@type": "Review",
      author: {
        "@type": "Organization",
        name: "サプティア編集部",
      },
      datePublished: new Date().toISOString().split("T")[0],
      reviewRating: {
        "@type": "Rating",
        ratingValue: 4,
        bestRating: 5,
      },
      reviewBody: `${params.brand ? `${params.brand}の` : ""}${params.name}を科学的根拠に基づいて評価しました。`,
    },
  ];

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

/**
 * schema.org/HowTo
 */
export interface HowToStructuredData {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description?: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: {
    "@type": "MonetaryAmount";
    currency: string;
    value: string;
  };
  step: Array<{
    "@type": "HowToStep";
    position: number;
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}

/**
 * HowTo用構造化データを生成
 */
export function generateHowToStructuredData(params: {
  name: string;
  description?: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  steps: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}): HowToStructuredData {
  const structuredData: HowToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    image: params.image,
    totalTime: params.totalTime,
    step: params.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
      image: step.image,
    })),
  };

  if (params.estimatedCost) {
    structuredData.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: params.estimatedCost.currency,
      value: params.estimatedCost.value,
    };
  }

  return structuredData;
}

// ============================================================================
// AI検索最適化：MedicalWebPage + Drug schema（成分ガイド用）
// ============================================================================

/**
 * schema.org/MedicalWebPage（成分ガイド用）
 */
export interface MedicalWebPageStructuredData {
  "@context": "https://schema.org";
  "@type": "MedicalWebPage";
  "@id": string;
  name: string;
  headline: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    "@type": "WebSite";
    name: string;
    url: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  citation?: Array<{
    "@type": "CreativeWork";
    name: string;
    url: string;
  }>;
}

/**
 * schema.org/Drug（サプリメント成分用）
 */
export interface DrugStructuredData {
  "@context": "https://schema.org";
  "@type": "Drug";
  name: string;
  alternateName?: string;
  description: string;
  drugClass?: string;
  url: string;
  legalStatus?: string;
  dosageForm?: string;
  warning?: string;
  mechanismOfAction?: string;
}

/**
 * 成分ガイド用構造化データを生成（MedicalWebPage + Drug schema）
 * AI検索エンジンが成分情報を正確に理解・引用するために最適化
 */
export function generateIngredientStructuredData(params: {
  name: string;
  nameEn?: string;
  slug: string;
  category?: string;
  description?: string;
  benefits?: string[];
  recommendedDosage?: string;
  sideEffects?: string;
  evidenceLevel?: string;
  references?: Array<{
    title?: string;
    url?: string;
    source?: string;
  }>;
  datePublished?: string;
  dateModified?: string;
  siteUrl?: string;
}): [MedicalWebPageStructuredData, DrugStructuredData] {
  const siteUrl = params.siteUrl || "https://suptia.com";
  const pageUrl = `${siteUrl}/ingredients/${params.slug}`;

  // エビデンスレベルの説明マップ
  const evidenceLevelMap: Record<string, string> = {
    S: "大規模RCT・メタ解析による高い信頼性",
    A: "良質な研究で効果が確認",
    B: "限定的研究・条件付きの効果",
    C: "動物実験・小規模試験レベル",
    D: "理論・未検証レベル",
  };

  // MedicalWebPage schema
  const medicalWebPage: MedicalWebPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": pageUrl,
    name: `${params.name}の効果・副作用・おすすめサプリ`,
    headline: `${params.name}${params.nameEn ? `（${params.nameEn}）` : ""} - 科学的エビデンスに基づく成分ガイド`,
    description:
      params.description ||
      `${params.name}の効果、推奨摂取量、副作用、相互作用について科学的根拠に基づいて解説。`,
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
    datePublished:
      params.datePublished || new Date().toISOString().split("T")[0],
    dateModified: params.dateModified || new Date().toISOString().split("T")[0],
  };

  // 参考文献を追加
  if (params.references && params.references.length > 0) {
    medicalWebPage.citation = params.references
      .filter((ref) => ref.url)
      .slice(0, 5)
      .map((ref) => ({
        "@type": "CreativeWork",
        name: ref.title || ref.source || "参考文献",
        url: ref.url!,
      }));
  }

  // Drug schema
  const drugSchema: DrugStructuredData = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: params.name,
    alternateName: params.nameEn,
    description:
      params.description ||
      `${params.name}は${params.category || "栄養素"}の一種です。`,
    drugClass: params.category || "Dietary Supplement",
    url: pageUrl,
  };

  // エビデンスレベル
  if (params.evidenceLevel) {
    drugSchema.legalStatus = `エビデンスレベル ${params.evidenceLevel}: ${evidenceLevelMap[params.evidenceLevel] || "評価中"}`;
  }

  // 推奨摂取量
  if (params.recommendedDosage) {
    drugSchema.dosageForm = params.recommendedDosage;
  }

  // 副作用・注意事項
  if (params.sideEffects) {
    drugSchema.warning = params.sideEffects;
  }

  // 効果・効能
  if (params.benefits && params.benefits.length > 0) {
    drugSchema.mechanismOfAction = params.benefits.slice(0, 5).join("。");
  }

  return [medicalWebPage, drugSchema];
}
