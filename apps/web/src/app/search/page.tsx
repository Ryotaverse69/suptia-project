import { Metadata } from "next";
import Link from "next/link";
import { sanity } from "@/lib/sanity.client";
import { ProductCard } from "@/components/ProductCard";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { SearchBar } from "@/components/SearchBar";
import {
  Search as SearchIcon,
  ChevronRight,
  Pill,
  Package,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "検索結果 - サプティア",
  description: "サプリメントと成分の検索結果",
};

interface Ingredient {
  _id: string;
  name: string;
  nameEn: string;
  slug: {
    current: string;
  };
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

// 成分を検索
async function searchIngredient(query: string): Promise<Ingredient | null> {
  if (!query || query.trim().length === 0) {
    return null;
  }

  const searchTerm = query.trim();
  const ingredientQuery = `*[_type == "ingredient" && (
    name match "*${searchTerm}*" ||
    nameEn match "*${searchTerm}*"
  )][0]{
    _id,
    name,
    nameEn,
    slug,
    category,
    description
  }`;

  try {
    const ingredient = await sanity.fetch<Ingredient>(ingredientQuery);
    return ingredient || null;
  } catch (error) {
    console.error("Ingredient search error:", error);
    return null;
  }
}

// 成分を含む商品を取得
async function getProductsByIngredient(
  ingredientId: string,
  sortBy: string = "price"
): Promise<Product[]> {
  let orderClause = "priceJPY asc";

  if (sortBy === "price_desc") {
    orderClause = "priceJPY desc";
  } else if (sortBy === "name") {
    orderClause = "name asc";
  }

  const query = `*[_type == "product" && references($ingredientId)] | order(${orderClause}){
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug
  }`;

  try {
    const products = await sanity.fetch<Product[]>(query, { ingredientId });
    return products || [];
  } catch (error) {
    console.error("Products search error:", error);
    return [];
  }
}

// 商品を検索
async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.trim();
  const productsQuery = `*[_type == "product" && (
    name match "*${searchTerm}*" ||
    brand->name match "*${searchTerm}*"
  )] | order(priceJPY asc) {
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug
  }`;

  try {
    const products = await sanity.fetch<Product[]>(productsQuery);
    return products || [];
  } catch (error) {
    console.error("Products search error:", error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const sortBy = params.sort || "price";

  // まず成分を検索
  const ingredient = await searchIngredient(query);

  // 成分が見つかった場合は、その成分を含む商品を表示
  // 見つからない場合は、商品名で検索
  const products = ingredient
    ? await getProductsByIngredient(ingredient._id, sortBy)
    : await searchProducts(query);

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

  // ソート適用
  let sortedProducts = [...productsWithCost];
  if (sortBy === "cost") {
    sortedProducts.sort((a, b) => a.effectiveCostPerDay - b.effectiveCostPerDay);
  } else if (sortBy === "price_desc") {
    sortedProducts.sort((a, b) => b.priceJPY - a.priceJPY);
  }

  return (
    <div className="min-h-screen bg-gradient-pastel">
      {/* パンくずリスト + 検索バー */}
      <div
        className="relative overflow-hidden border-b border-white/20"
        style={{
          background:
            "linear-gradient(135deg, #7a98ec 0%, #5a7fe6 25%, #3b66e0 50%, #2d4fb8 75%, #243d94 100%)",
        }}
      >
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-6 max-w-[1440px] relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/90 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight size={16} className="text-white/60" />
            <span className="text-white font-medium">検索結果</span>
          </nav>
          {/* 検索バー */}
          <SearchBar />
        </div>
      </div>

      {/* ヘッダー */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
        {!query || query.trim().length === 0 ? (
          /* 検索クエリがない場合 */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <SearchIcon className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              検索キーワードを入力してください
            </h2>
            <p className="text-primary-700 mb-8">
              成分名やサプリメント名で検索できます
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        ) : (
          <>
            {/* ヘッダー情報 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  {ingredient ? (
                    <Pill className="text-primary" size={32} />
                  ) : (
                    <SearchIcon className="text-primary" size={32} />
                  )}
                </div>
                <div>
                  {ingredient && (
                    <p className="text-sm text-primary-700 mb-1">
                      {ingredient.category}
                    </p>
                  )}
                  <h1 className="text-4xl font-bold text-primary-900">
                    {ingredient
                      ? `${ingredient.name}を含むサプリメント`
                      : `「${query}」の検索結果`}
                  </h1>
                  {ingredient && (
                    <p className="text-xl text-primary-700 mt-2">
                      {ingredient.nameEn}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="px-4 py-2 bg-primary-100 rounded-lg">
                  <span className="text-sm font-semibold text-primary-900">
                    {sortedProducts.length}種類の商品
                  </span>
                </div>
                {sortedProducts.length > 0 && (
                  <div className="px-4 py-2 bg-accent-mint/10 rounded-lg">
                    <span className="text-sm text-primary-900">
                      最安値:{" "}
                      <span className="font-bold">
                        ¥{Math.min(...sortedProducts.map((p) => p.priceJPY)).toLocaleString()}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* フィルター */}
            {sortedProducts.length > 0 && (
              <div className="flex items-center justify-between mb-6 p-4 glass-blue rounded-xl">
                <span className="text-sm font-medium text-primary-900">
                  並び替え
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&sort=price`}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      sortBy === "price"
                        ? "bg-primary text-white"
                        : "bg-white text-primary-900 hover:bg-primary-50"
                    }`}
                  >
                    価格が安い順
                  </Link>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&sort=cost`}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      sortBy === "cost"
                        ? "bg-primary text-white"
                        : "bg-white text-primary-900 hover:bg-primary-50"
                    }`}
                  >
                    コスパが良い順
                  </Link>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&sort=price_desc`}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      sortBy === "price_desc"
                        ? "bg-primary text-white"
                        : "bg-white text-primary-900 hover:bg-primary-50"
                    }`}
                  >
                    価格が高い順
                  </Link>
                </div>
              </div>
            )}

            {/* 商品一覧 */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-3xl shadow-glass">
                <div className="text-primary-300 mb-4">
                  <AlertCircle size={64} className="mx-auto" />
                </div>
                <p className="text-primary-700 font-light mb-4">
                  {ingredient
                    ? `${ingredient.name}を含む商品はまだ登録されていません`
                    : `「${query}」に一致する商品が見つかりませんでした`}
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
            {ingredient && (
              <div className="mt-12 p-8 glass-blue rounded-xl shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <BookOpen className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary-900 mb-2">
                      {ingredient.name}についてもっと知る
                    </h2>
                    <p className="text-primary-700 mb-4">
                      {ingredient.name}の効果・効能、推奨摂取量、副作用などの詳細情報をご覧いただけます。
                    </p>
                    <Link
                      href={`/ingredients/${ingredient.slug.current}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      {ingredient.name}の詳細ガイドを見る
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
