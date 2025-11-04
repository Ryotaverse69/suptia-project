import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { RelatedProducts } from "@/components/RelatedProducts";
import { IngredientContent } from "@/components/IngredientContent";
import { IngredientCoverSVG } from "@/components/IngredientCoverSVG";
import { IngredientSummary } from "@/components/IngredientWarnings";
import { IngredientViewTracker } from "@/components/IngredientViewTracker";
import { formatTextWithParagraphs, formatList } from "@/lib/text-formatter";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
} from "@/lib/structured-data";
import {
  generateInternalLinks,
  type LinkableIngredient,
} from "@/lib/internal-links";
import {
  BookOpen,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Scale,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Pill,
} from "lucide-react";
import "./ingredient-styles.css";

// 開発中は常に最新データを取得
export const dynamic = "force-dynamic";

// 簡易的なマークダウンをHTMLに変換する関数
function parseMarkdown(text: string | string[] | undefined | null): string {
  if (!text) return "";

  // 配列の場合は結合
  if (Array.isArray(text)) {
    text = text.join(", ");
  }

  // 文字列でない場合は文字列に変換
  if (typeof text !== "string") {
    text = String(text);
  }

  return (
    text
      // 太字: **text** または __text__ → <strong>text</strong>
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      // イタリック: *text* または _text_ → <em>text</em>
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      // コード: `code` → <code>code</code>
      .replace(/`(.+?)`/g, "<code>$1</code>")
  );
}

interface Ingredient {
  name: string;
  nameEn: string;
  slug: {
    current: string;
  };
  category: string;
  description: string;
  benefits: string[];
  recommendedDosage: string;
  sideEffects?: string[];
  interactions?: string[];
  evidenceLevel: string;
  scientificBackground: string;
  foodSources?: string[];
  coverImage?: {
    asset: {
      _ref: string;
      url: string;
    };
    alt?: string;
  };
  relatedIngredients?: Array<{
    name: string;
    slug: {
      current: string;
    };
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  references?: Array<{
    title: string;
    url?: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // 危険性関連（新規）
  riskLevel?: "low" | "medium" | "high" | "critical";
  overdoseRisks?: string[];
  specialWarnings?: Array<{
    severity: "critical" | "warning" | "info";
    message: string;
    affectedGroups?: string[];
  }>;
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  brand: {
    name: string;
    trustScore?: number;
  };
  priceJPY: number;
  originalPrice?: number;
  discountPercentage?: number;
  isCampaign?: boolean;
  campaignEndDate?: string;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  scores?: {
    overall?: number;
    safety?: number;
    evidence?: number;
    costEffectiveness?: number;
  };
  reviewStats?: {
    averageRating?: number;
    reviewCount?: number;
  };
  availability?: string;
  images?: Array<{
    asset: {
      url: string;
    };
  }>;
  // モックデータ用（トップページと同じ）
  effectiveCostPerDay?: number;
  rating?: number;
  reviewCount?: number;
  isBestValue?: boolean;
  safetyScore?: number;
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Sanityから成分データを取得
async function getIngredient(slug: string): Promise<Ingredient | null> {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]{
    name,
    nameEn,
    slug,
    category,
    description,
    benefits,
    recommendedDosage,
    sideEffects,
    interactions,
    evidenceLevel,
    scientificBackground,
    foodSources,
    "coverImage": coverImage{
      "asset": asset->{
        _ref,
        url
      },
      alt
    },
    relatedIngredients[]->{
      name,
      slug
    },
    faqs,
    references,
    seoTitle,
    seoDescription,
    seoKeywords,
    riskLevel,
    overdoseRisks,
    specialWarnings
  }`;

  try {
    const ingredient = await sanity.fetch(query, { slug });
    return ingredient;
  } catch (error) {
    console.error("Failed to fetch ingredient:", error);
    return null;
  }
}

// 成分IDを取得
async function getIngredientId(slug: string): Promise<string | null> {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]._id`;
  try {
    const id = await sanity.fetch(query, { slug });
    return id;
  } catch (error) {
    console.error("Failed to fetch ingredient ID:", error);
    return null;
  }
}

// 関連商品を取得（成分を含む商品）
// トップページの「おすすめのサプリメント」と同じロジックを使用
async function getRelatedProducts(
  ingredientId: string,
): Promise<RelatedProduct[]> {
  const query = `*[_type == "product" && references($ingredientId) && (!defined(availability) || availability == "in-stock") && (source == "rakuten" || source == "yahoo")]{
    _id,
    name,
    slug,
    "brand": brand->{
      name,
      trustScore
    },
    priceJPY,
    originalPrice,
    discountPercentage,
    isCampaign,
    campaignEndDate,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    scores,
    reviewStats,
    availability,
    "images": images[0...1]{
      "asset": asset->
    },
    // おすすめスコアを計算（トップページと同じロジック）
    "recommendationScore": select(
      isCampaign == true && campaignEndDate > now() => 100 + coalesce(discountPercentage, 0) * 2,
      isCampaign == true => 100 + coalesce(discountPercentage, 0) * 2,
      coalesce(discountPercentage, 0) > 0 => coalesce(discountPercentage, 0) * 2,
      0
    )
  } | order(recommendationScore desc, discountPercentage desc, priceJPY asc)[0...6]`;

  try {
    const products = await sanity.fetch(query, { ingredientId });
    return products || [];
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

// 全成分リストを取得（内部リンク用）
async function getAllIngredients(): Promise<LinkableIngredient[]> {
  const query = `*[_type == "ingredient" && defined(slug.current)]{
    name,
    nameEn,
    "slug": slug.current
  }`;

  try {
    const ingredients = await sanity.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch ingredients for internal links:", error);
    return [];
  }
}

// Markdownをパースして内部リンクを追加
function parseMarkdownWithInternalLinks(
  text: string | string[] | undefined | null,
  allIngredients: LinkableIngredient[],
  currentIngredientName: string,
): string {
  const parsed = parseMarkdown(text);

  // 内部リンクを生成（現在の成分は除外）
  return generateInternalLinks(parsed, allIngredients, {
    baseUrl: "/ingredients",
    excludeIngredients: [currentIngredientName],
    maxLinksPerIngredient: 2,
    linkClassName: "text-primary hover:text-primary-700 underline",
    openInNewTab: false,
  });
}

// 動的ルートの生成
export async function generateStaticParams() {
  const query = `*[_type == "ingredient" && defined(slug.current)]{ "slug": slug.current }`;
  try {
    const ingredients = await sanity.fetch(query);
    // slugが文字列であることを確認
    const params = ingredients
      .map((ingredient: { slug: string | any }) => {
        // slugがオブジェクトの場合は.currentプロパティを取得
        const slugValue =
          typeof ingredient.slug === "string"
            ? ingredient.slug
            : ingredient.slug?.current || null;

        if (!slugValue || typeof slugValue !== "string") {
          console.warn(
            "Invalid slug format:",
            ingredient.slug,
            typeof ingredient.slug,
          );
          return null;
        }

        return { slug: slugValue };
      })
      .filter(
        (param: { slug: string } | null): param is { slug: string } =>
          param !== null,
      );

    console.log(`Generated ${params.length} static params for ingredients`);
    return params;
  } catch (error) {
    console.error("Failed to fetch ingredient slugs:", error);
    return [];
  }
}

// SEO最適化のためのメタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    return {
      title: "成分が見つかりません",
    };
  }

  const title =
    ingredient.seoTitle ||
    `【2025年11月最新】${ingredient.name}の効果と摂取方法を徹底解説｜最安値サプリも紹介 - サプティア`;
  const description =
    ingredient.seoDescription ||
    `${ingredient.name}（${ingredient.nameEn}）サプリを選ぶ前に必読！効果・推奨摂取量・副作用・科学的エビデンスを徹底解説。楽天・Amazon・Yahoo!の価格比較で最安値が3秒でわかる。${ingredient.category}の専門ガイド。`;

  const keywords = ingredient.seoKeywords || [
    ingredient.name,
    ingredient.nameEn,
    "サプリメント",
    "効果",
    "摂取量",
    ingredient.category,
    "副作用",
    "科学的根拠",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${ingredient.name}（${ingredient.nameEn}）完全ガイド`,
      description,
      type: "article",
      url: `https://suptia.com/ingredients/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${ingredient.name}の効果と摂取方法`,
      description,
    },
    alternates: {
      canonical: `https://suptia.com/ingredients/${slug}`,
    },
  };
}

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    notFound();
  }

  // 関連商品と全成分リストを取得
  const ingredientId = await getIngredientId(slug);
  const [relatedProducts, allIngredients] = await Promise.all([
    ingredientId ? getRelatedProducts(ingredientId) : Promise.resolve([]),
    getAllIngredients(),
  ]);

  // トップページと同じロジックでモックデータを追加
  const relatedProductsWithMockData = relatedProducts.map((product, index) => {
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
      rating: 4.5 + Math.random() * 0.5, // Mock rating (4.5-5.0)
      reviewCount: Math.floor(100 + Math.random() * 300), // Mock review count (100-400)
      isBestValue: product.discountPercentage
        ? product.discountPercentage > 20
        : index < 2, // 割引率20%以上または上位2件
      safetyScore: 90 + Math.floor(Math.random() * 10), // Mock safety score (90-100)
    };
  });

  // 不要なフレーズをクリーニングする関数
  const cleanText = (text: string | undefined | null): string => {
    if (!text) return "";
    return text
      .replace(/[:：]\s*優れた供給源として知られています\.?/gi, "")
      .replace(/[:：]\s*豊富に含まれています\.?/gi, "")
      .replace(/[:：]\s*良い供給源です\.?/gi, "")
      .replace(/優れた供給源として知られています\.?/gi, "")
      .replace(/豊富に含まれています\.?/gi, "")
      .replace(/良い供給源です\.?/gi, "")
      .trim();
  };

  // JSON-LD構造化データ（SEO対策）
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ingredient.name}（${ingredient.nameEn}）の効果と摂取方法`,
    description: cleanText(ingredient.description),
    author: {
      "@type": "Organization",
      name: "サプティア",
      url: "https://suptia.com",
    },
    publisher: {
      "@type": "Organization",
      name: "サプティア",
      logo: {
        "@type": "ImageObject",
        url: "https://suptia.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://suptia.com/ingredients/${slug}`,
    },
    keywords: `${ingredient.name}, ${ingredient.nameEn}, サプリメント, ${ingredient.category}`,
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = generateBreadcrumbStructuredData([
    { name: "ホーム", url: "https://suptia.com/" },
    { name: "成分ガイド", url: "https://suptia.com/ingredients" },
    { name: ingredient.name, url: `https://suptia.com/ingredients/${slug}` },
  ]);

  // FAQ structured data (if FAQs exist)
  const faqJsonLd =
    Array.isArray(ingredient.faqs) && ingredient.faqs.length > 0
      ? generateFAQStructuredData(
          ingredient.faqs.map((faq) => ({
            question: faq.question,
            answer: cleanText(faq.answer),
          })),
        )
      : null;

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD Structured Data: Article */}
      <script
        id="article-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* JSON-LD Structured Data: Breadcrumb */}
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* JSON-LD Structured Data: FAQ (if exists) */}
      {faqJsonLd && (
        <script
          id="faq-jsonld"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* 表示回数トラッキング */}
      <IngredientViewTracker slug={slug} />

      <div className="min-h-screen bg-background">
        {/* パンくずリスト */}
        <div className="bg-white border-b border-primary-200">
          <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4 max-w-[1200px]">
            <nav className="flex items-center gap-2 text-sm text-primary-700">
              <Link href="/" className="hover:text-primary">
                ホーム
              </Link>
              <ChevronRight size={16} />
              <Link href="/ingredients" className="hover:text-primary">
                成分ガイド
              </Link>
              <ChevronRight size={16} />
              <span className="text-primary-900 font-medium">
                {ingredient.name}
              </span>
            </nav>
          </div>
        </div>

        <article className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
          {/* ヘッダー */}
          <header className="mb-12">
            {/* SVGアイキャッチ画像 */}
            <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-lg">
              <IngredientCoverSVG
                name={ingredient.name}
                nameEn={ingredient.nameEn}
                category={ingredient.category}
                className="w-full h-auto"
              />
            </div>

            {/* エビデンスレベル */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-mint/10 border border-accent-mint/30 rounded-lg">
              <ShieldCheck className="text-accent-mint" size={20} />
              <span className="text-sm font-medium text-primary-900">
                科学的根拠レベル：
                <span className="text-accent-mint ml-1">
                  {ingredient.evidenceLevel}
                </span>
              </span>
            </div>
          </header>

          {/* 要約（1行） */}
          <IngredientSummary description={ingredient.description} />

          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左カラム：主要コンテンツ */}
            <div className="lg:col-span-2 space-y-10">
              {/* 概要 */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2 ingredient-section-title">
                  <BookOpen className="text-primary" size={24} />
                  {ingredient.name}とは
                </h2>
                {/* モバイル対応済みの成分コンテンツ表示 */}
                <IngredientContent
                  description={ingredient.description}
                  className="mb-8"
                />
              </section>

              {/* 主な効果・効能 */}
              {Array.isArray(ingredient.benefits) &&
                ingredient.benefits.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2 ingredient-section-title">
                      <TrendingUp className="text-primary" size={24} />
                      主な効果・効能
                    </h2>
                    <div className="bg-gradient-to-br from-accent-mint/5 to-accent-mint/10 rounded-lg p-6">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatList(ingredient.benefits, "bullet"),
                        }}
                        className="benefits-list space-y-3 text-primary-800 text-sm sm:text-base"
                      />
                    </div>
                  </section>
                )}

              {/* 推奨摂取量 */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2 ingredient-section-title">
                  <Scale className="text-primary" size={24} />
                  推奨摂取量
                </h2>
                <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200 rounded-lg">
                  <div
                    className="dosage-content text-primary-800 text-sm sm:text-base space-y-3"
                    dangerouslySetInnerHTML={{
                      __html: formatTextWithParagraphs(
                        ingredient.recommendedDosage,
                      ),
                    }}
                  />
                </div>
              </section>

              {/* 科学的背景 */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2 ingredient-section-title">
                  <ShieldCheck className="text-primary" size={24} />
                  科学的背景・エビデンス
                </h2>
                <div className="bg-gradient-to-r from-white to-primary-50/30 border-l-4 border-primary-500 pl-6 pr-4 py-4 rounded-r-lg">
                  <div
                    className="scientific-content text-primary-800 text-sm sm:text-base space-y-3 sm:space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: formatTextWithParagraphs(
                        ingredient.scientificBackground,
                      ),
                    }}
                  />
                </div>
              </section>

              {/* 食品源 */}
              {Array.isArray(ingredient.foodSources) &&
                ingredient.foodSources.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-primary-900 mb-6 ingredient-section-title">
                      豊富に含まれる食品
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(ingredient.foodSources || []).map((source, index) => {
                        // 不要な定型文を削除（コロン＋フレーズをすべて削除）
                        const cleanedSource = source
                          .replace(
                            /[:：]\s*優れた供給源として知られています\.?/gi,
                            "",
                          )
                          .replace(/[:：]\s*豊富に含まれています\.?/gi, "")
                          .replace(/[:：]\s*良い供給源です\.?/gi, "")
                          .replace(/[:：]\s*ビタミンAが豊富です\.?/gi, "")
                          .replace(/優れた供給源として知られています\.?/gi, "")
                          .replace(/豊富に含まれています\.?/gi, "")
                          .replace(/良い供給源です\.?/gi, "")
                          .replace(/ビタミンAが豊富です\.?/gi, "")
                          .trim();

                        return (
                          <div
                            key={index}
                            className="p-4 bg-white border border-primary-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <p className="text-primary-800 font-medium">
                              {cleanedSource}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

              {/* 副作用・注意点 */}
              {ingredient.sideEffects && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2 ingredient-section-title">
                    <AlertCircle className="text-accent-orange" size={24} />
                    副作用・注意点
                  </h2>
                  <div className="p-6 bg-gradient-to-br from-accent-orange/5 to-accent-orange/10 border border-accent-orange/30 rounded-lg shadow-sm">
                    {Array.isArray(ingredient.sideEffects) ? (
                      <div
                        className="side-effects-list space-y-3 text-primary-800 text-sm sm:text-base"
                        dangerouslySetInnerHTML={{
                          __html: formatList(ingredient.sideEffects, "bullet"),
                        }}
                      />
                    ) : (
                      <div
                        className="side-effects-content text-primary-800 text-sm sm:text-base space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: formatTextWithParagraphs(
                            ingredient.sideEffects as any,
                          ),
                        }}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* 相互作用 */}
              {ingredient.interactions && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-6">
                    他の成分・医薬品との相互作用
                  </h2>
                  <div className="bg-gradient-to-r from-primary-50 to-white border-l-4 border-primary-400 pl-6 pr-4 py-4 rounded-r-lg">
                    {Array.isArray(ingredient.interactions) ? (
                      <div
                        className="interactions-list space-y-3 text-primary-800 text-sm sm:text-base"
                        dangerouslySetInnerHTML={{
                          __html: formatList(ingredient.interactions, "bullet"),
                        }}
                      />
                    ) : (
                      <div
                        className="interactions-content text-primary-800 text-sm sm:text-base space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: formatTextWithParagraphs(
                            ingredient.interactions as any,
                          ),
                        }}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* FAQ */}
              {Array.isArray(ingredient.faqs) && ingredient.faqs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-6">
                    よくある質問
                  </h2>
                  <div className="space-y-4">
                    {ingredient.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group bg-white border border-primary-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
                      >
                        <summary className="px-6 py-4 cursor-pointer hover:bg-primary-50 transition-colors">
                          <h3 className="inline font-semibold text-primary-900 text-base sm:text-lg">
                            Q. {faq.question}
                          </h3>
                        </summary>
                        <div className="px-6 py-4 border-t border-primary-200 bg-gradient-to-br from-primary-50/70 to-white">
                          <div
                            className="faq-answer text-primary-800 text-sm sm:text-base leading-6 sm:leading-relaxed space-y-2 sm:space-y-3"
                            dangerouslySetInnerHTML={{
                              __html: formatTextWithParagraphs(faq.answer),
                            }}
                          />
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* 参考文献 */}
              {Array.isArray(ingredient.references) &&
                ingredient.references.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-primary-900 mb-4">
                      参考文献
                    </h2>
                    <ul className="space-y-2">
                      {ingredient.references.map((ref, index) => (
                        <li key={index} className="text-primary-800">
                          <span className="text-primary-600 mr-2">
                            [{index + 1}]
                          </span>
                          {ref.url ? (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center gap-1"
                            >
                              {ref.title}
                              <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span>{ref.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
            </div>

            {/* 右カラム：サイドバー */}
            <aside className="space-y-6">
              {/* 関連成分 */}
              <div className="bg-white border border-primary-200 rounded-lg p-6 sticky top-20">
                {Array.isArray(ingredient.relatedIngredients) &&
                  ingredient.relatedIngredients.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold text-primary-900 mb-4">
                        関連する成分
                      </h3>
                      <div className="space-y-2 mb-6">
                        {ingredient.relatedIngredients.map((related) => (
                          <Link
                            key={related.slug.current}
                            href={`/ingredients/${related.slug.current}`}
                            className="block px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                          >
                            <span className="text-primary-900 font-medium">
                              {related.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-primary-200 pt-6 space-y-3">
                        <Link
                          href="/ingredients"
                          className="block px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
                        >
                          成分ガイド一覧
                        </Link>
                        <Link
                          href="/guide/dangerous-ingredients"
                          className="block px-4 py-3 bg-orange-100 text-orange-900 border border-orange-300 rounded-lg hover:bg-orange-200 transition-colors text-center font-semibold"
                        >
                          ⚠️ 危険成分ガイド
                        </Link>
                      </div>
                    </>
                  )}

                {(!Array.isArray(ingredient.relatedIngredients) ||
                  ingredient.relatedIngredients.length === 0) && (
                  <div className="space-y-3">
                    <Link
                      href="/ingredients"
                      className="block px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
                    >
                      成分ガイド一覧
                    </Link>
                    <Link
                      href="/guide/dangerous-ingredients"
                      className="block px-4 py-3 bg-orange-100 text-orange-900 border border-orange-300 rounded-lg hover:bg-orange-200 transition-colors text-center font-semibold"
                    >
                      ⚠️ 危険成分ガイド
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>

        {/* 関連商品セクション */}
        <RelatedProducts
          products={relatedProductsWithMockData}
          ingredientName={ingredient.name}
        />
      </div>
    </>
  );
}
