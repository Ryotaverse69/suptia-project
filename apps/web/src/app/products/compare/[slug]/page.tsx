import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanity } from "@/lib/sanity.client";
import { ProductCard } from "@/components/ProductCard";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { ChevronRight, TrendingUp, Award } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

interface Ingredient {
  _id: string;
  name: string;
  nameEn: string;
  category: string;
  description: string;
}

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: {
    current: string;
  };
}

// 成分情報を取得
async function getIngredient(slug: string): Promise<Ingredient | null> {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]{
    _id,
    name,
    nameEn,
    category,
    description
  }`;

  try {
    const ingredient = await sanity.fetch(query, { slug });
    return ingredient;
  } catch (error) {
    console.error("Failed to fetch ingredient:", error);
    return null;
  }
}

// 成分を含む商品を取得
async function getProductsByIngredient(
  ingredientId: string,
): Promise<Product[]> {
  const query = `*[_type == "product" && references($ingredientId)] | order(priceJPY asc){
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug
  }`;

  try {
    const products = await sanity.fetch(query, { ingredientId });
    return products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    return {
      title: "成分が見つかりません",
    };
  }

  return {
    title: `${ingredient.name}を含むサプリメント比較 - サプティア`,
    description: `${ingredient.name}（${ingredient.nameEn}）を含むサプリメントを価格・品質で徹底比較。科学的根拠に基づいた最適な選択をサポートします。`,
  };
}

export default async function IngredientComparePage({ params }: Props) {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    notFound();
  }

  const products = await getProductsByIngredient(ingredient._id);

  // Calculate effective cost for each product
  const productsWithCost = products.map((product, index) => {
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
      rating: 4.2 + Math.random() * 0.8,
      reviewCount: Math.floor(50 + Math.random() * 200),
      isBestValue: index < 3,
      safetyScore: 85 + Math.floor(Math.random() * 15),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-pastel">
      {/* パンくずリスト */}
      <div className="bg-white border-b border-primary-200">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4 max-w-[1440px]">
          <nav className="flex items-center gap-2 text-sm text-primary-700">
            <Link href="/" className="hover:text-primary">
              ホーム
            </Link>
            <ChevronRight size={16} />
            <Link href="/products" className="hover:text-primary">
              商品一覧
            </Link>
            <ChevronRight size={16} />
            <span className="text-primary-900 font-medium">
              {ingredient.name}の比較
            </span>
          </nav>
        </div>
      </div>

      {/* ヘッダー */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <TrendingUp className="text-primary" size={32} />
            </div>
            <div>
              <p className="text-sm text-primary-700 mb-1">
                {ingredient.category}
              </p>
              <h1 className="text-4xl font-bold text-primary-900">
                {ingredient.name}を含むサプリメント
              </h1>
              <p className="text-xl text-primary-700 mt-2">
                {ingredient.nameEn}
              </p>
            </div>
          </div>

          <p className="text-primary-800 leading-relaxed max-w-3xl">
            {ingredient.description}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="px-4 py-2 bg-primary-100 rounded-lg">
              <span className="text-sm font-semibold text-primary-900">
                {productsWithCost.length}種類の商品
              </span>
            </div>
            {productsWithCost.length > 0 && (
              <div className="px-4 py-2 bg-accent-mint/10 rounded-lg">
                <span className="text-sm text-primary-900">
                  最安値:{" "}
                  <span className="font-bold">
                    ¥
                    {Math.min(
                      ...productsWithCost.map((p) => p.priceJPY),
                    ).toLocaleString()}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 商品一覧 */}
        {productsWithCost.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsWithCost.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl shadow-glass">
            <div className="text-primary-300 mb-4">
              <Award size={64} className="mx-auto" />
            </div>
            <p className="text-primary-700 font-light mb-4">
              現在この成分を含む商品はありません
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              すべての商品を見る
              <TrendingUp size={16} />
            </Link>
          </div>
        )}

        {/* 成分ガイドへのリンク */}
        <div className="mt-12 p-8 glass-blue rounded-xl shadow-soft">
          <h2 className="text-xl font-bold text-primary-900 mb-4">
            {ingredient.name}についてもっと知る
          </h2>
          <p className="text-primary-700 mb-6">
            {ingredient.name}
            の効果・効能、推奨摂取量、副作用などの詳細情報をご覧いただけます。
          </p>
          <Link
            href={`/ingredients/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            {ingredient.name}の詳細ガイドを見る
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
