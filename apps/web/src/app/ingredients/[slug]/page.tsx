import { sanityServer } from "@/lib/sanityServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
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

interface IngredientPageProps {
  params: {
    slug: string;
  };
}

// 成分データ取得
async function getIngredient(slug: string) {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]{
    _id,
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

  return {
    title: `${ingredient.name}（${ingredient.nameEn}）の効果・摂取量・安全性 | Suptia成分ガイド`,
    description:
      ingredient.description ||
      `${ingredient.name}の科学的エビデンス、推奨摂取量、副作用、相互作用について詳しく解説。`,
  };
}

export default async function IngredientPage({ params }: IngredientPageProps) {
  const ingredient = await getIngredient(params.slug);

  if (!ingredient) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(ingredient._id);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <IngredientHeader
          name={ingredient.name}
          nameEn={ingredient.nameEn}
          category={ingredient.category}
          evidenceLevel={ingredient.evidenceLevel}
          description={ingredient.description}
        />

        {/* メインコンテンツエリア */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
          {/* 左側: メインコンテンツ */}
          <main className="space-y-6 sm:space-y-8">
            {/* モバイル用目次 */}
            <TableOfContents items={tocItems} />

            {/* 効果・効能 */}
            {ingredient.benefits && ingredient.benefits.length > 0 && (
              <IngredientSection
                id="benefits"
                title="期待される効果"
                icon={<Sparkles size={20} />}
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
            {ingredient.sideEffects && ingredient.sideEffects.length > 0 && (
              <IngredientSection
                id="side-effects"
                title="副作用・注意事項"
                icon={<AlertTriangle size={20} />}
                variant="danger"
              >
                <WarningList items={ingredient.sideEffects} variant="danger" />
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
                          className="group flex items-start gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-primary group-hover:underline text-sm sm:text-base flex-1">
                            {ref.title}
                          </span>
                          <ExternalLink
                            size={16}
                            className="flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors mt-0.5"
                          />
                        </a>
                      </li>
                    )
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
                        className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-primary rounded-xl transition-all hover:shadow-md"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                            {related.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {related.nameEn}
                          </p>
                          {related.category && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                              {related.category}
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          size={18}
                          className="flex-shrink-0 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"
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
                      className="group flex gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-primary rounded-xl transition-all hover:shadow-md"
                    >
                      {product.imageUrl && (
                        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border border-gray-200">
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
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">
                            {product.brand.name}
                          </p>
                        )}
                        {product.ingredients?.[0]?.amountMgPerServing && (
                          <p className="text-xs text-primary font-medium mb-2">
                            {ingredient.name}:{" "}
                            {product.ingredients[0].amountMgPerServing}mg
                          </p>
                        )}
                        {product.priceJpy && (
                          <p className="text-base sm:text-lg font-bold text-gray-900">
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
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
            <TableOfContents items={tocItems} />
          </aside>
        </div>
      </div>
    </div>
  );
}
