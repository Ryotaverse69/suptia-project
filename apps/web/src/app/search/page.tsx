import { Metadata } from "next";
import Link from "next/link";
import { sanity } from "@/lib/sanity.client";
import { formatPrice } from "@/lib/format";
import {
  Search as SearchIcon,
  ChevronRight,
  Pill,
  Package,
  AlertCircle,
  Shield,
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
  evidenceLevel: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  slug: {
    current: string;
  };
  description?: string;
  price?: number;
}

async function searchContent(
  query: string,
): Promise<{ ingredients: Ingredient[]; products: Product[] }> {
  if (!query || query.trim().length === 0) {
    return { ingredients: [], products: [] };
  }

  const searchTerm = query.trim();

  // 成分を検索
  // GROQのmatchは大文字小文字を区別しないため、そのまま使用可能
  const ingredientsQuery = `*[_type == "ingredient" && (
    name match "*${searchTerm}*" ||
    nameEn match "*${searchTerm}*" ||
    category match "*${searchTerm}*"
  )] | order(name asc) [0...20] {
    _id,
    name,
    nameEn,
    slug,
    category,
    description,
    evidenceLevel
  }`;

  // 商品を検索（将来的に実装）
  const productsQuery = `*[_type == "product" && (
    name match "*${searchTerm}*" ||
    brand match "*${searchTerm}*"
  )] | order(name asc) [0...20] {
    _id,
    name,
    brand,
    slug,
    description,
    price
  }`;

  try {
    const [ingredients, products] = await Promise.all([
      sanity.fetch<Ingredient[]>(ingredientsQuery),
      sanity.fetch<Product[]>(productsQuery).catch(() => []), // 商品がまだない場合はエラーを無視
    ]);

    return {
      ingredients: ingredients || [],
      products: products || [],
    };
  } catch (error) {
    console.error("Search error:", error);
    return { ingredients: [], products: [] };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const { ingredients, products } = await searchContent(query);
  const totalResults = ingredients.length + products.length;

  return (
    <div className="min-h-screen bg-background">
      {/* パンくずリスト */}
      <div className="bg-white border-b border-primary-200">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4 max-w-[1200px]">
          <nav className="flex items-center gap-2 text-sm text-primary-700">
            <Link href="/" className="hover:text-primary">
              ホーム
            </Link>
            <ChevronRight size={16} />
            <span className="text-primary-900 font-medium">検索結果</span>
          </nav>
        </div>
      </div>

      {/* 検索ヘッダー */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <SearchIcon size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">検索結果</h1>
          </div>

          {query && (
            <p className="text-xl text-primary-100">
              「<span className="font-semibold">{query}</span>」の検索結果：
              {totalResults}件
            </p>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
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
        ) : totalResults === 0 ? (
          /* 検索結果がない場合 */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <AlertCircle className="text-amber-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              検索結果が見つかりませんでした
            </h2>
            <p className="text-primary-700 mb-8">
              「{query}
              」に一致する成分やサプリメントが見つかりませんでした。
              <br />
              別のキーワードでお試しください。
            </p>

            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                検索のヒント：
              </h3>
              <ul className="text-left text-primary-700 space-y-2">
                <li className="flex items-start gap-2">
                  <ChevronRight size={20} className="flex-shrink-0 mt-0.5" />
                  <span>より一般的なキーワードを使ってみてください</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={20} className="flex-shrink-0 mt-0.5" />
                  <span>カタカナや英語など、別の表記方法を試してください</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={20} className="flex-shrink-0 mt-0.5" />
                  <span>スペルミスがないか確認してください</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/ingredients"
                className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                成分ガイドを見る
              </Link>
            </div>
          </div>
        ) : (
          /* 検索結果がある場合 */
          <div className="space-y-12">
            {/* 成分検索結果 */}
            {ingredients.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Pill className="text-primary" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-900">成分</h2>
                  <span className="text-sm text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                    {ingredients.length}件
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ingredients.map((ingredient) => (
                    <Link
                      key={ingredient._id}
                      href={`/ingredients/${ingredient.slug.current}`}
                      className="group bg-white border border-primary-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-primary-900 group-hover:text-primary transition-colors mb-1">
                            {ingredient.name}
                          </h3>
                          <p className="text-sm text-primary-600">
                            {ingredient.nameEn}
                          </p>
                        </div>
                        <ChevronRight className="text-primary-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>

                      <p className="text-sm text-primary-700 line-clamp-2 mb-4">
                        {ingredient.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-900 text-xs rounded-full">
                          {ingredient.category}
                        </span>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent-mint/10 border border-accent-mint/30 rounded-full">
                          <Shield className="text-accent-mint" size={14} />
                          <span className="text-xs font-medium text-primary-900">
                            {ingredient.evidenceLevel}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 商品検索結果 */}
            {products.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent-purple/20 rounded-lg">
                    <Package className="text-accent-purple" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-900">
                    サプリメント
                  </h2>
                  <span className="text-sm text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                    {products.length}件
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug.current}`}
                      className="group bg-white border border-primary-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-primary-900 group-hover:text-primary transition-colors mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-primary-600">
                            {product.brand}
                          </p>
                        </div>
                        <ChevronRight className="text-primary-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>

                      {product.description && (
                        <p className="text-sm text-primary-700 line-clamp-2 mb-4">
                          {product.description}
                        </p>
                      )}

                      {product.price && (
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* CTA */}
        {totalResults > 0 && (
          <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-accent-mint/10 border border-primary-200 rounded-xl">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-primary-900 mb-3">
                お探しのものが見つかりませんでしたか？
              </h3>
              <p className="text-primary-700 mb-6">
                成分ガイドで詳しい情報を確認したり、別のキーワードで検索してみてください
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/ingredients"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  成分ガイドを見る
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
