import { sanityServer } from "@/lib/sanityServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

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
    title: `${ingredient.name}（${ingredient.nameEn}）の効果・摂取量・安全性`,
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {ingredient.name}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{ingredient.nameEn}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {ingredient.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {ingredient.category}
            </span>
          )}
          {ingredient.evidenceLevel && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              エビデンスレベル: {ingredient.evidenceLevel}
            </span>
          )}
        </div>

        {ingredient.description && (
          <p className="text-lg text-gray-700 leading-relaxed">
            {ingredient.description}
          </p>
        )}
      </header>

      {/* 効果・効能 */}
      {ingredient.benefits && ingredient.benefits.length > 0 && (
        <section className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            期待される効果
          </h2>
          <ul className="space-y-3">
            {ingredient.benefits.map((benefit: string, index: number) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-bold">
                  ✓
                </span>
                <span className="text-gray-700 leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 推奨摂取量 */}
      {ingredient.recommendedDosage && (
        <section className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">推奨摂取量</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ingredient.recommendedDosage}
          </div>
        </section>
      )}

      {/* 副作用・注意事項 */}
      {ingredient.sideEffects && ingredient.sideEffects.length > 0 && (
        <section className="mb-8 bg-red-50 rounded-lg border border-red-200 p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            副作用・注意事項
          </h2>
          <ul className="space-y-2">
            {ingredient.sideEffects.map((effect: string, index: number) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 text-red-600">⚠️</span>
                <span className="text-red-900">{effect}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 相互作用 */}
      {ingredient.interactions && (
        <section className="mb-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">相互作用</h2>
          {Array.isArray(ingredient.interactions) ? (
            <ul className="space-y-2">
              {ingredient.interactions.map(
                (interaction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 text-yellow-600">⚠️</span>
                    <span className="text-yellow-900">{interaction}</span>
                  </li>
                ),
              )}
            </ul>
          ) : (
            <div className="text-yellow-900 whitespace-pre-wrap">
              {ingredient.interactions}
            </div>
          )}
        </section>
      )}

      {/* よくある質問 */}
      {ingredient.faqs && ingredient.faqs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            よくある質問
          </h2>
          <div className="space-y-4">
            {ingredient.faqs.map(
              (faq: { question: string; answer: string }, index: number) => (
                <details
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-primary">
                    {faq.question}
                  </summary>
                  <div className="mt-3 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ),
            )}
          </div>
        </section>
      )}

      {/* 参考文献 */}
      {ingredient.references && ingredient.references.length > 0 && (
        <section className="mb-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">参考文献</h2>
          <ul className="space-y-2">
            {ingredient.references.map(
              (ref: { title: string; url: string }, index: number) => (
                <li key={index}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {ref.title}
                    <ExternalLink size={14} />
                  </a>
                </li>
              ),
            )}
          </ul>
        </section>
      )}

      {/* 関連成分 */}
      {ingredient.relatedIngredients &&
        ingredient.relatedIngredients.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              関連する成分
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredient.relatedIngredients.map((related: any) => (
                <Link
                  key={related._id}
                  href={`/ingredients/${related.slug.current}`}
                  className="group border-2 border-gray-200 rounded-lg p-4 transition-all hover:border-primary hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{related.nameEn}</p>
                  {related.category && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {related.category}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-primary font-medium mt-3">
                    詳しく見る
                    <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      {/* この成分を含む商品 */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {ingredient.name}を含む商品
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProducts.map((product: any) => (
              <Link
                key={product._id}
                href={`/products/${product.slug.current}`}
                className="group border-2 border-gray-200 rounded-lg overflow-hidden transition-all hover:border-primary hover:shadow-md"
              >
                {product.imageUrl && (
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">
                      {product.brand.name}
                    </p>
                  )}
                  {product.ingredients?.[0]?.amountMgPerServing && (
                    <p className="text-xs text-gray-500 mb-2">
                      {ingredient.name}:{" "}
                      {product.ingredients[0].amountMgPerServing}mg
                    </p>
                  )}
                  {product.priceJpy && (
                    <p className="text-lg font-bold text-gray-900">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {ingredient.name}を含む商品をもっと見る
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
