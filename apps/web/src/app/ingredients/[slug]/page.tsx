import { sanityServer } from "@/lib/sanityServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  ArrowRight,
  ExternalLink,
  Beaker,
  Pill,
  AlertTriangle,
  Zap,
  HelpCircle,
  BookOpen,
  Package,
  Link2,
} from "lucide-react";
import type { Metadata } from "next";
import {
  TableOfContents,
  IngredientSection,
  BenefitList,
  WarningList,
  TextContent,
  FAQAccordion,
  IngredientHeader,
} from "@/components/ingredients";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import {
  generateFAQStructuredData,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateIngredientStructuredData,
} from "@/lib/structured-data";
import {
  systemColors,
  appleWebColors,
  tierColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import { getIngredientOGImage, generateOGImageMeta } from "@/lib/og-image";

interface IngredientPageProps {
  params: {
    slug: string;
  };
}

// サイトURL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com";

// 成分データ取得
async function getIngredient(slug: string) {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]{
    _id,
    _createdAt,
    _updatedAt,
    name,
    nameEn,
    slug,
    category,
    description,
    evidenceLevel,
    benefits,
    recommendedDosage,
    sideEffects,
    interactions,
    faqs,
    references,
    relatedIngredients[]->{
      _id,
      name,
      nameEn,
      slug,
      category,
      evidenceLevel
    }
  }`;

  return await sanityServer.fetch(query, { slug });
}

// 関連商品取得
async function getRelatedProducts(ingredientId: string) {
  const query = `*[_type == "product" && references($ingredientId)][0...6]{
    _id,
    name,
    slug,
    priceJpy,
    imageUrl,
    brand->{
      name
    },
    ingredients[ingredient._ref == $ingredientId][0]{
      amountMgPerServing
    }
  }`;

  return await sanityServer.fetch(query, { ingredientId });
}

// メタデータ生成
export async function generateMetadata({
  params,
}: IngredientPageProps): Promise<Metadata> {
  const ingredient = await getIngredient(params.slug);

  if (!ingredient) {
    return {
      title: "成分が見つかりません",
    };
  }

  const title = `${ingredient.name}（${ingredient.nameEn}）の効果・摂取量・安全性 | Suptia成分ガイド`;
  const description =
    ingredient.description ||
    `${ingredient.name}の科学的エビデンス、推奨摂取量、副作用、相互作用について詳しく解説。`;
  const pageUrl = `${siteUrl}/ingredients/${params.slug}`;

  // OGP画像を取得（Cloudinaryから自動生成された画像を使用）
  const ogImageUrl = getIngredientOGImage(params.slug);
  const ogImage = generateOGImageMeta(
    ogImageUrl,
    `${ingredient.name}（${ingredient.nameEn}）- Suptia成分ガイド`,
  );

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Suptia（サプティア）",
      type: "article",
      images: [ogImage],
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function IngredientPage({ params }: IngredientPageProps) {
  const ingredient = await getIngredient(params.slug);

  if (!ingredient) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(ingredient._id);

  // JSON-LD構造化データを生成
  const pageUrl = `${siteUrl}/ingredients/${ingredient.slug.current}`;

  // パンくずリスト
  const breadcrumbJsonLd = generateBreadcrumbStructuredData([
    { name: "ホーム", url: siteUrl },
    { name: "成分ガイド", url: `${siteUrl}/ingredients` },
    { name: ingredient.name, url: pageUrl },
  ]);

  // 記事スキーマ
  const articleJsonLd = generateArticleStructuredData({
    headline: `${ingredient.name}（${ingredient.nameEn}）の効果・摂取量・安全性`,
    description:
      ingredient.description ||
      `${ingredient.name}の科学的エビデンス、推奨摂取量、副作用、相互作用について詳しく解説。`,
    datePublished: ingredient._createdAt,
    dateModified: ingredient._updatedAt,
    authorName: "サプティア",
    publisherName: "サプティア",
    publisherLogoUrl: `${siteUrl}/logo.png`,
    url: pageUrl,
  });

  // MedicalWebPage + Drug スキーマ（AI検索最適化）
  const [medicalWebPageJsonLd, drugJsonLd] = generateIngredientStructuredData({
    name: ingredient.name,
    nameEn: ingredient.nameEn,
    slug: ingredient.slug.current,
    category: ingredient.category,
    description: ingredient.description,
    benefits: ingredient.benefits,
    recommendedDosage: ingredient.recommendedDosage,
    sideEffects: Array.isArray(ingredient.sideEffects)
      ? ingredient.sideEffects.join("。")
      : ingredient.sideEffects,
    evidenceLevel: ingredient.evidenceLevel,
    references: ingredient.references,
    datePublished: ingredient._createdAt?.split("T")[0],
    dateModified: ingredient._updatedAt?.split("T")[0],
    siteUrl,
  });

  // FAQスキーマ（FAQがある場合のみ）
  const faqJsonLd =
    ingredient.faqs && ingredient.faqs.length > 0
      ? generateFAQStructuredData(
          ingredient.faqs.map((faq: { question: string; answer: string }) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        )
      : null;

  // 目次アイテムを動的に生成
  const tocItems = [
    ingredient.benefits?.length > 0 && {
      id: "benefits",
      title: "期待される効果",
      icon: "✨",
    },
    ingredient.recommendedDosage && {
      id: "dosage",
      title: "推奨摂取量",
      icon: "💊",
    },
    ingredient.sideEffects?.length > 0 && {
      id: "side-effects",
      title: "副作用・注意事項",
      icon: "⚠️",
    },
    ingredient.interactions?.length > 0 && {
      id: "interactions",
      title: "相互作用",
      icon: "⚡",
    },
    ingredient.faqs?.length > 0 && {
      id: "faq",
      title: "よくある質問",
      icon: "❓",
    },
    ingredient.references?.length > 0 && {
      id: "references",
      title: "参考文献",
      icon: "📚",
    },
    ingredient.relatedIngredients?.length > 0 && {
      id: "related-ingredients",
      title: "関連する成分",
      icon: "🔗",
    },
    relatedProducts?.length > 0 && {
      id: "related-products",
      title: "この成分を含む商品",
      icon: "📦",
    },
  ].filter(Boolean) as { id: string; title: string; icon: string }[];

  return (
    <>
      {/* 構造化データ（JSON-LD） */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* AI検索最適化：MedicalWebPage + Drug schema */}
      <Script
        id="medical-webpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalWebPageJsonLd),
        }}
      />
      <Script
        id="drug-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(drugJsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          {/* ヘッダー */}
          <IngredientHeader
            name={ingredient.name}
            nameEn={ingredient.nameEn}
            category={ingredient.category}
            evidenceLevel={ingredient.evidenceLevel}
            description={ingredient.description}
            updatedAt={ingredient._updatedAt}
            ogImageUrl={getIngredientOGImage(ingredient.slug.current)}
          />

          {/* 薬機法準拠マーク（AI検索との差別化） */}
          <div className="mt-4 mb-6">
            <ComplianceBadge variant="default" />
          </div>

          {/* モバイル用目次（メインコンテンツの前に配置） */}
          <div className="lg:hidden">
            <TableOfContents items={tocItems} variant="mobile" />
          </div>

          {/* メインコンテンツエリア */}
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
            {/* 左側: メインコンテンツ */}
            <main className="space-y-6 sm:space-y-8">
              {/* 効果・効能 */}
              {ingredient.benefits && ingredient.benefits.length > 0 && (
                <IngredientSection
                  id="benefits"
                  title="期待される効果"
                  icon={<Beaker size={20} />}
                  variant="success"
                >
                  <BenefitList benefits={ingredient.benefits} />
                </IngredientSection>
              )}

              {/* 推奨摂取量 */}
              {ingredient.recommendedDosage && (
                <IngredientSection
                  id="dosage"
                  title="推奨摂取量"
                  icon={<Pill size={20} />}
                  variant="info"
                >
                  <TextContent content={ingredient.recommendedDosage} />
                </IngredientSection>
              )}

              {/* 副作用・注意事項 */}
              {ingredient.sideEffects && (
                <IngredientSection
                  id="side-effects"
                  title="副作用・注意事項"
                  icon={<AlertTriangle size={20} />}
                  variant="danger"
                >
                  {Array.isArray(ingredient.sideEffects) ? (
                    <WarningList
                      items={ingredient.sideEffects}
                      variant="danger"
                    />
                  ) : (
                    <TextContent content={ingredient.sideEffects} />
                  )}
                </IngredientSection>
              )}

              {/* 相互作用 */}
              {ingredient.interactions && (
                <IngredientSection
                  id="interactions"
                  title="相互作用"
                  icon={<Zap size={20} />}
                  variant="warning"
                >
                  {Array.isArray(ingredient.interactions) ? (
                    <WarningList
                      items={ingredient.interactions}
                      variant="warning"
                    />
                  ) : (
                    <TextContent content={ingredient.interactions} />
                  )}
                </IngredientSection>
              )}

              {/* よくある質問 */}
              {ingredient.faqs && ingredient.faqs.length > 0 && (
                <IngredientSection
                  id="faq"
                  title="よくある質問"
                  icon={<HelpCircle size={20} />}
                >
                  <FAQAccordion faqs={ingredient.faqs} />
                </IngredientSection>
              )}

              {/* 参考文献 */}
              {ingredient.references && ingredient.references.length > 0 && (
                <IngredientSection
                  id="references"
                  title="参考文献"
                  icon={<BookOpen size={20} />}
                >
                  <ul className="space-y-3">
                    {ingredient.references.map(
                      (ref: { title: string; url: string }, index: number) => (
                        <li key={index}>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-start gap-3 p-4 rounded-[16px] border transition-all hover:bg-white hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
                            style={{
                              borderColor: appleWebColors.borderSubtle,
                            }}
                          >
                            <span
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium"
                              style={{
                                backgroundColor:
                                  appleWebColors.sectionBackground,
                                color: appleWebColors.textSecondary,
                              }}
                            >
                              {index + 1}
                            </span>
                            <span
                              className="text-[15px] flex-1"
                              style={{ color: systemColors.blue }}
                            >
                              {ref.title}
                            </span>
                            <ExternalLink
                              size={16}
                              className="flex-shrink-0 mt-0.5 transition-opacity group-hover:opacity-100 opacity-60"
                              style={{ color: systemColors.blue }}
                            />
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                </IngredientSection>
              )}

              {/* 関連成分 */}
              {ingredient.relatedIngredients &&
                ingredient.relatedIngredients.length > 0 && (
                  <IngredientSection
                    id="related-ingredients"
                    title="関連する成分"
                    icon={<Link2 size={20} />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {ingredient.relatedIngredients.map((related: any) => (
                        <Link
                          key={related._id}
                          href={`/ingredients/${related.slug.current}`}
                          className={`group flex items-center gap-4 p-4 rounded-[16px] border transition-all hover:bg-white hover:border-[#007AFF] hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
                          style={{
                            borderColor: appleWebColors.borderSubtle,
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold text-[15px] sm:text-[17px] truncate transition-colors"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              {related.name}
                            </h3>
                            <p
                              className="text-[13px] truncate"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              {related.nameEn}
                            </p>
                            {related.category && (
                              <span
                                className="inline-block mt-2 px-2 py-0.5 rounded-full text-[12px]"
                                style={{
                                  backgroundColor:
                                    appleWebColors.sectionBackground,
                                  color: appleWebColors.textSecondary,
                                }}
                              >
                                {related.category}
                              </span>
                            )}
                          </div>
                          <ArrowRight
                            size={18}
                            className="flex-shrink-0 transition-all group-hover:translate-x-1"
                            style={{ color: systemColors.blue }}
                          />
                        </Link>
                      ))}
                    </div>
                  </IngredientSection>
                )}

              {/* この成分を含む商品 */}
              {relatedProducts && relatedProducts.length > 0 && (
                <IngredientSection
                  id="related-products"
                  title={`${ingredient.name}を含む商品`}
                  icon={<Package size={20} />}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedProducts.map((product: any) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug.current}`}
                        className={`group flex gap-4 p-4 rounded-[16px] border transition-all hover:bg-white hover:border-[#007AFF] hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
                        style={{
                          borderColor: appleWebColors.borderSubtle,
                        }}
                      >
                        {product.imageUrl && (
                          <div
                            className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-[12px] overflow-hidden border"
                            style={{
                              backgroundColor: "white",
                              borderColor: appleWebColors.borderSubtle,
                            }}
                          >
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-[15px] sm:text-[17px] line-clamp-2 mb-1 transition-colors"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p
                              className="text-[13px] sm:text-[15px] mb-1"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              {product.brand.name}
                            </p>
                          )}
                          {product.ingredients?.[0]?.amountMgPerServing && (
                            <p
                              className="text-[13px] font-medium mb-2"
                              style={{ color: systemColors.blue }}
                            >
                              {ingredient.name}:{" "}
                              {product.ingredients[0].amountMgPerServing}mg
                            </p>
                          )}
                          {product.priceJpy && (
                            <p
                              className="text-[17px] sm:text-[20px] font-bold"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              ¥{product.priceJpy.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      href={`/products?ingredient=${ingredient.name}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] font-semibold text-[17px] text-white transition-all hover:bg-[#5856D6] hover:-translate-y-0.5"
                      style={{
                        backgroundColor: systemColors.blue,
                      }}
                    >
                      {ingredient.name}を含む商品をもっと見る
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </IngredientSection>
              )}
            </main>

            {/* 右側: デスクトップ用固定目次 */}
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} variant="desktop" />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
