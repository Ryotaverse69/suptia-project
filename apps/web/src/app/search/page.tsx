import { Metadata } from "next";
import Link from "next/link";
import { sanity } from "@/lib/sanity.client";
import { ProductListItem } from "@/components/ProductListItem";
import { ProductList } from "@/components/ProductList";
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
import { BadgeType } from "@/lib/badges";
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
  badges?: BadgeType[];
}

// 検索クエリからブランド名を抽出する
function extractBrandFromQuery(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();

  // 一般的なブランド名リスト（部分一致で検出）
  const brandKeywords = [
    "dhc",
    "ネイチャーメイド",
    "nature made",
    "naturemade",
    "大塚製薬",
    "otsuka",
    "ファンケル",
    "fancl",
    "アサヒ",
    "asahi",
    "ディアナチュラ",
    "dear natura",
    "小林製薬",
    "kobayashi",
    "サントリー",
    "suntory",
    "明治",
    "meiji",
    "森永",
    "morinaga",
    "now foods",
    "now",
    "california gold",
    "solgar",
  ];

  for (const brand of brandKeywords) {
    if (normalizedQuery.includes(brand)) {
      return brand;
    }
  }

  return null;
}

// 成分を検索
async function searchIngredient(query: string): Promise<Ingredient | null> {
  if (!query || query.trim().length === 0) {
    return null;
  }

  const searchTerm = query.trim();

  // パラメータバインディングを使用してGROQ Injection対策
  // 1. 完全一致検索（優先度高）
  const exactMatchQuery = `*[_type == "ingredient" && (
    name == $term ||
    nameEn == $term
  )][0]{
    _id,
    name,
    nameEn,
    slug,
    category,
    description
  }`;

  try {
    let ingredient = await sanity.fetch<Ingredient>(exactMatchQuery, {
      term: searchTerm,
    });

    // 完全一致が見つからない場合、部分一致を試す
    if (!ingredient) {
      // 括弧を除去した検索も試みる（例: "ビタミンC（アスコルビン酸）" → "ビタミンC"）
      const normalizedTerm = searchTerm
        .replace(/[（）()]/g, "") // 括弧を除去
        .trim();

      // パラメータバインディングを使用
      const partialMatchQuery = `*[_type == "ingredient" && (
        name match $termWildcard ||
        nameEn match $termWildcard ||
        name match $normalizedWildcard ||
        nameEn match $normalizedWildcard
      )][0]{
        _id,
        name,
        nameEn,
        slug,
        category,
        description
      }`;

      ingredient = await sanity.fetch<Ingredient>(partialMatchQuery, {
        termWildcard: `*${searchTerm}*`,
        normalizedWildcard: `*${normalizedTerm}*`,
      });
    }

    return ingredient || null;
  } catch (error) {
    console.error("Ingredient search error:", error);
    return null;
  }
}

// 成分を含む商品を取得（オプショナルでブランド名フィルター）
async function getProductsByIngredient(
  ingredientId: string,
  sortBy: string = "price",
  brandFilter?: string,
): Promise<Product[]> {
  let orderClause = "priceJPY asc";

  if (sortBy === "price_desc") {
    orderClause = "priceJPY desc";
  } else if (sortBy === "name") {
    orderClause = "name asc";
  }

  // パラメータバインディングを使用（GROQ Injection対策）
  // ブランドフィルターがある場合とない場合で別クエリ
  const query = brandFilter
    ? `*[_type == "product" && references($ingredientId) && brand->name match $brandWildcard] | order(${orderClause}){
        _id,
        name,
        priceJPY,
        servingsPerContainer,
        servingsPerDay,
        externalImageUrl,
        slug,
        badges
      }`
    : `*[_type == "product" && references($ingredientId)] | order(${orderClause}){
        _id,
        name,
        priceJPY,
        servingsPerContainer,
        servingsPerDay,
        externalImageUrl,
        slug,
        badges
      }`;

  try {
    const params: Record<string, string> = { ingredientId };
    if (brandFilter) {
      params.brandWildcard = `*${brandFilter}*`;
    }
    const products = await sanity.fetch<Product[]>(query, params);
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

  // 括弧を除去した正規化版も準備
  const normalizedTerm = searchTerm.replace(/[（）()]/g, "").trim();

  // パラメータバインディングを使用（GROQ Injection対策）
  const productsQuery = `*[_type == "product" && (
    name match $termWildcard ||
    brand->name match $termWildcard ||
    name match $normalizedWildcard ||
    brand->name match $normalizedWildcard
  )] | order(priceJPY asc) {
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    badges
  }`;

  try {
    const products = await sanity.fetch<Product[]>(productsQuery, {
      termWildcard: `*${searchTerm}*`,
      normalizedWildcard: `*${normalizedTerm}*`,
    });
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

  // 検索クエリからブランド名を抽出
  const brandFilter = extractBrandFromQuery(query);

  // まず成分を検索
  const ingredient = await searchIngredient(query);

  // 成分が見つかった場合は、その成分を含む商品を表示（ブランドフィルターも適用）
  // 見つからない場合は、商品名で検索
  const products = ingredient
    ? await getProductsByIngredient(
        ingredient._id,
        sortBy,
        brandFilter || undefined,
      )
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
    sortedProducts.sort(
      (a, b) => a.effectiveCostPerDay - b.effectiveCostPerDay,
    );
  } else if (sortBy === "price_desc") {
    sortedProducts.sort((a, b) => b.priceJPY - a.priceJPY);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* パンくずリスト + 検索バー */}
      <div
        className="border-b"
        style={{
          backgroundColor: "white",
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-6 max-w-[1440px]">
          <nav
            className="flex items-center gap-2 mb-6"
            style={{
              fontSize: "15px",
              color: appleWebColors.textSecondary,
            }}
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#007AFF]"
              style={{
                color: appleWebColors.textSecondary,
              }}
            >
              ホーム
            </Link>
            <ChevronRight
              size={16}
              style={{ color: appleWebColors.textTertiary }}
            />
            <span
              style={{ color: appleWebColors.textPrimary, fontWeight: 500 }}
            >
              検索結果
            </span>
          </nav>
          {/* 検索バー */}
          <SearchBar variant="light" />
        </div>
      </div>

      {/* ヘッダー */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
        {!query || query.trim().length === 0 ? (
          /* 検索クエリがない場合 */
          <div className="text-center py-16">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{
                backgroundColor: `${systemColors.blue}15`,
              }}
            >
              <SearchIcon style={{ color: systemColors.blue }} size={32} />
            </div>
            <h2
              className="mb-2"
              style={{
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: "34px",
                color: appleWebColors.textPrimary,
              }}
            >
              検索キーワードを入力してください
            </h2>
            <p
              className="mb-8"
              style={{
                fontSize: "17px",
                color: appleWebColors.textSecondary,
              }}
            >
              成分名やサプリメント名で検索できます
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 font-semibold rounded-[12px] transition-colors hover:bg-[#0056CC]"
              style={{
                backgroundColor: systemColors.blue,
                color: "white",
                fontSize: "17px",
              }}
            >
              ホームに戻る
            </Link>
          </div>
        ) : (
          <>
            {/* ヘッダー情報 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-[12px]"
                  style={{
                    backgroundColor: `${systemColors.blue}15`,
                  }}
                >
                  {ingredient ? (
                    <Pill style={{ color: systemColors.blue }} size={32} />
                  ) : (
                    <SearchIcon
                      style={{ color: systemColors.blue }}
                      size={32}
                    />
                  )}
                </div>
                <div>
                  {ingredient && (
                    <p
                      className="mb-1"
                      style={{
                        fontSize: "15px",
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      {ingredient.category}
                    </p>
                  )}
                  <h1
                    style={{
                      fontSize: "34px",
                      fontWeight: 700,
                      lineHeight: "41px",
                      letterSpacing: "0.37px",
                      color: appleWebColors.textPrimary,
                    }}
                  >
                    {ingredient
                      ? `${ingredient.name}を含むサプリメント`
                      : `「${query}」の検索結果`}
                  </h1>
                  {ingredient && (
                    <p
                      className="mt-2"
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      {ingredient.nameEn}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div
                  className="px-4 py-2 rounded-[12px]"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: appleWebColors.textPrimary,
                    }}
                  >
                    {sortedProducts.length}種類の商品
                  </span>
                </div>
                {sortedProducts.length > 0 && (
                  <div
                    className="px-4 py-2 rounded-[12px]"
                    style={{
                      backgroundColor: `${systemColors.green}15`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      最安値:{" "}
                      <span style={{ fontWeight: 600 }}>
                        ¥
                        {Math.min(
                          ...sortedProducts.map((p) => p.priceJPY),
                        ).toLocaleString()}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* フィルター */}
            {sortedProducts.length > 0 && (
              <div
                className={`flex items-center justify-between mb-6 p-4 rounded-[16px] ${liquidGlassClasses.light}`}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: appleWebColors.textPrimary,
                  }}
                >
                  並び替え
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&sort=price`}
                    className="px-4 py-2 font-medium rounded-[12px] transition-colors"
                    style={{
                      fontSize: "15px",
                      backgroundColor:
                        sortBy === "price" ? systemColors.blue : "white",
                      color:
                        sortBy === "price"
                          ? "white"
                          : appleWebColors.textPrimary,
                      border: `1px solid ${sortBy === "price" ? systemColors.blue : appleWebColors.borderSubtle}`,
                    }}
                  >
                    価格が安い順
                  </Link>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&sort=cost`}
                    className="px-4 py-2 font-medium rounded-[12px] transition-colors"
                    style={{
                      fontSize: "15px",
                      backgroundColor:
                        sortBy === "cost" ? systemColors.blue : "white",
                      color:
                        sortBy === "cost"
                          ? "white"
                          : appleWebColors.textPrimary,
                      border: `1px solid ${sortBy === "cost" ? systemColors.blue : appleWebColors.borderSubtle}`,
                    }}
                  >
                    コスパが良い順
                  </Link>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&sort=price_desc`}
                    className="px-4 py-2 font-medium rounded-[12px] transition-colors"
                    style={{
                      fontSize: "15px",
                      backgroundColor:
                        sortBy === "price_desc" ? systemColors.blue : "white",
                      color:
                        sortBy === "price_desc"
                          ? "white"
                          : appleWebColors.textPrimary,
                      border: `1px solid ${sortBy === "price_desc" ? systemColors.blue : appleWebColors.borderSubtle}`,
                    }}
                  >
                    価格が高い順
                  </Link>
                </div>
              </div>
            )}

            {/* 商品一覧 */}
            {sortedProducts.length > 0 ? (
              <ProductList products={sortedProducts} initialDisplayCount={10} />
            ) : (
              <div
                className={`text-center py-20 rounded-[20px] ${liquidGlassClasses.light}`}
              >
                <div
                  className="mb-4"
                  style={{ color: appleWebColors.textTertiary }}
                >
                  <AlertCircle size={64} className="mx-auto" />
                </div>
                <p
                  className="mb-4"
                  style={{
                    fontSize: "17px",
                    fontWeight: 300,
                    color: appleWebColors.textSecondary,
                  }}
                >
                  {ingredient
                    ? `${ingredient.name}を含む商品はまだ登録されていません`
                    : `「${query}」に一致する商品が見つかりませんでした`}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-[12px] transition-colors hover:bg-[#0056CC]"
                  style={{
                    backgroundColor: systemColors.blue,
                    color: "white",
                    fontSize: "17px",
                  }}
                >
                  すべての商品を見る
                  <TrendingUp size={16} />
                </Link>
              </div>
            )}

            {/* 成分ガイドへのリンク */}
            {ingredient && (
              <div
                className={`mt-12 p-8 rounded-[20px] ${liquidGlassClasses.light}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-[12px]"
                    style={{
                      backgroundColor: `${systemColors.blue}15`,
                    }}
                  >
                    <BookOpen style={{ color: systemColors.blue }} size={24} />
                  </div>
                  <div className="flex-1">
                    <h2
                      className="mb-2"
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        lineHeight: "25px",
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      {ingredient.name}についてもっと知る
                    </h2>
                    <p
                      className="mb-4"
                      style={{
                        fontSize: "17px",
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      {ingredient.name}
                      の効果・効能、推奨摂取量、副作用などの詳細情報をご覧いただけます。
                    </p>
                    <Link
                      href={`/ingredients/${ingredient.slug.current}`}
                      className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-[12px] transition-colors hover:bg-[#0056CC]"
                      style={{
                        backgroundColor: systemColors.blue,
                        color: "white",
                        fontSize: "17px",
                      }}
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
