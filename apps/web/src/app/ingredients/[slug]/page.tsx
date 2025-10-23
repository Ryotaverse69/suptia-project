import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";
import { sanity } from "@/lib/sanity.client";
import { RelatedProducts } from "@/components/RelatedProducts";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
} from "@/lib/structured-data";
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
    relatedIngredients[]->{
      name,
      slug
    },
    faqs,
    references,
    seoTitle,
    seoDescription,
    seoKeywords
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
async function getRelatedProducts(
  ingredientId: string,
): Promise<RelatedProduct[]> {
  const query = `*[_type == "product" && references($ingredientId) && availability == "in-stock"]{
    _id,
    name,
    slug,
    "brand": brand->{
      name,
      trustScore
    },
    priceJPY,
    scores,
    reviewStats,
    availability,
    "images": images[0...1]{
      "asset": asset->
    }
  } | order(scores.overall desc)[0...6]`;

  try {
    const products = await sanity.fetch(query, { ingredientId });
    return products || [];
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

// 動的ルートの生成
export async function generateStaticParams() {
  const query = `*[_type == "ingredient"]{ "slug": slug.current }`;
  try {
    const ingredients = await sanity.fetch(query);
    return ingredients.map((ingredient: { slug: string }) => ({
      slug: ingredient.slug,
    }));
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
    `${ingredient.name}の効果と摂取方法｜成分ガイド - サプティア`;
  const description =
    ingredient.seoDescription ||
    `${ingredient.name}（${ingredient.nameEn}）の効果、推奨摂取量、副作用、科学的根拠を徹底解説。サプティアの成分ガイドで、サプリメント選びの参考にしてください。`;

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

  // 関連商品を取得
  const ingredientId = await getIngredientId(slug);
  const relatedProducts = ingredientId
    ? await getRelatedProducts(ingredientId)
    : [];

  // JSON-LD構造化データ（SEO対策）
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ingredient.name}（${ingredient.nameEn}）の効果と摂取方法`,
    description: ingredient.description,
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
    ingredient.faqs && ingredient.faqs.length > 0
      ? generateFAQStructuredData(
          ingredient.faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        )
      : null;

  const nonce = headers().get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD Structured Data: Article */}
      <Script id="article-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(articleJsonLd)}
      </Script>

      {/* JSON-LD Structured Data: Breadcrumb */}
      <Script id="breadcrumb-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>

      {/* JSON-LD Structured Data: FAQ (if exists) */}
      {faqJsonLd && (
        <Script id="faq-jsonld" type="application/ld+json" nonce={nonce}>
          {JSON.stringify(faqJsonLd)}
        </Script>
      )}

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
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Pill className="text-primary" size={32} />
              </div>
              <div>
                <p className="text-sm text-primary-700 mb-1">
                  {ingredient.category}
                </p>
                <h1 className="text-4xl font-bold text-primary-900 mb-2">
                  {ingredient.name}
                </h1>
                <p className="text-xl text-primary-700">{ingredient.nameEn}</p>
              </div>
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

          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左カラム：主要コンテンツ */}
            <div className="lg:col-span-2 space-y-10">
              {/* 概要 */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                  <BookOpen className="text-primary" size={24} />
                  {ingredient.name}とは
                </h2>
                <div
                  className="text-primary-800 leading-relaxed prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdown(ingredient.description),
                  }}
                />
              </section>

              {/* 主な効果・効能 */}
              {ingredient.benefits && ingredient.benefits.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-primary" size={24} />
                    主な効果・効能
                  </h2>
                  <ul className="space-y-3">
                    {ingredient.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2
                          className="text-accent-mint flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div
                          className="text-primary-800 prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(benefit),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 推奨摂取量 */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                  <Scale className="text-primary" size={24} />
                  推奨摂取量
                </h2>
                <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg">
                  <div
                    className="text-primary-800 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(ingredient.recommendedDosage),
                    }}
                  />
                </div>
              </section>

              {/* 科学的背景 */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={24} />
                  科学的背景・エビデンス
                </h2>
                <div
                  className="text-primary-800 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdown(ingredient.scientificBackground),
                  }}
                />
              </section>

              {/* 食品源 */}
              {ingredient.foodSources && ingredient.foodSources.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-4">
                    豊富に含まれる食品
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ingredient.foodSources.map((source, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white border border-primary-200 rounded-lg"
                      >
                        <p className="text-primary-800">{source}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 副作用・注意点 */}
              {ingredient.sideEffects && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="text-accent-orange" size={24} />
                    副作用・注意点
                  </h2>
                  <div className="p-6 bg-accent-orange/5 border border-accent-orange/30 rounded-lg">
                    {Array.isArray(ingredient.sideEffects) ? (
                      <ul className="space-y-3 text-primary-800 leading-relaxed">
                        {ingredient.sideEffects.map((effect, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="text-accent-orange mt-1">•</span>
                            <span
                              className="flex-1 prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdown(effect),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div
                        className="text-primary-800 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(ingredient.sideEffects as any),
                        }}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* 相互作用 */}
              {ingredient.interactions && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-4">
                    他の成分・医薬品との相互作用
                  </h2>
                  {Array.isArray(ingredient.interactions) ? (
                    <ul className="space-y-3 text-primary-800 leading-relaxed">
                      {ingredient.interactions.map((interaction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-primary-600 mt-1">•</span>
                          <span
                            className="flex-1 prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: parseMarkdown(interaction),
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      className="text-primary-800 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(ingredient.interactions as any),
                      }}
                    />
                  )}
                </section>
              )}

              {/* FAQ */}
              {ingredient.faqs && ingredient.faqs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-primary-900 mb-6">
                    よくある質問
                  </h2>
                  <div className="space-y-4">
                    {ingredient.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group bg-white border border-primary-200 rounded-lg overflow-hidden"
                      >
                        <summary className="px-6 py-4 cursor-pointer hover:bg-primary-50 transition-colors">
                          <h3 className="inline font-semibold text-primary-900">
                            {faq.question}
                          </h3>
                        </summary>
                        <div className="px-6 py-4 border-t border-primary-200 bg-primary-50/50">
                          <div
                            className="text-primary-800 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-strong:text-primary-900 prose-strong:font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: parseMarkdown(faq.answer),
                            }}
                          />
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* 参考文献 */}
              {ingredient.references && ingredient.references.length > 0 && (
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
              {ingredient.relatedIngredients &&
                ingredient.relatedIngredients.length > 0 && (
                  <div className="bg-white border border-primary-200 rounded-lg p-6 sticky top-20">
                    <h3 className="text-lg font-bold text-primary-900 mb-4">
                      関連する成分
                    </h3>
                    <div className="space-y-2">
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

                    <div className="mt-6 pt-6 border-t border-primary-200">
                      <Link
                        href="/ingredients"
                        className="block px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
                      >
                        成分ガイド一覧
                      </Link>
                    </div>
                  </div>
                )}
            </aside>
          </div>
        </article>

        {/* 関連商品セクション */}
        <RelatedProducts
          products={relatedProducts}
          ingredientName={ingredient.name}
        />
      </div>
    </>
  );
}
