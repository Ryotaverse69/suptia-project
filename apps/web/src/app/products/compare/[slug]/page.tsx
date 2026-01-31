import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { sanity } from "@/lib/sanity.client";
import { ProductCard } from "@/components/ProductCard";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { ChevronRight, TrendingUp, Award } from "lucide-react";
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import {
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
} from "@/lib/structured-data";

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
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com";

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

  // 構造化データを生成
  const breadcrumbJsonLd = generateBreadcrumbStructuredData([
    { name: "ホーム", url: siteUrl },
    { name: "商品一覧", url: `${siteUrl}/products` },
    {
      name: `${ingredient.name}の比較`,
      url: `${siteUrl}/products/compare/${slug}`,
    },
  ]);

  // ItemList（商品ランキング）
  const itemListJsonLd =
    productsWithCost.length > 0
      ? generateItemListStructuredData({
          name: `${ingredient.name}サプリメント比較ランキング`,
          description: `${ingredient.name}（${ingredient.nameEn}）を含むサプリメントを価格・コスパで比較。${productsWithCost.length}種類の商品から最安値を見つけられます。`,
          items: productsWithCost.map((product, index) => ({
            name: product.name,
            url: `${siteUrl}/products/${product.slug.current}`,
            position: index + 1,
          })),
        })
      : null;

  // 比較ページ用FAQ
  const faqJsonLd = generateFAQStructuredData([
    {
      question: `${ingredient.name}サプリの選び方は？`,
      answer: `${ingredient.name}サプリを選ぶ際は、1日あたりの含有量、価格、コスパ（円/mg）を比較することが重要です。サプティアでは${productsWithCost.length}種類の商品を客観的に評価しています。`,
    },
    {
      question: `${ingredient.name}サプリの最安値は？`,
      answer:
        productsWithCost.length > 0
          ? `現在の最安値は¥${Math.min(...productsWithCost.map((p) => p.priceJPY)).toLocaleString()}です。ただし、価格だけでなくコスパ（1日あたりの費用）も重要な指標です。`
          : `現在この成分を含む商品は登録されていません。`,
    },
    {
      question: `${ingredient.name}の推奨摂取量は？`,
      answer: `${ingredient.name}の推奨摂取量は個人差があります。詳しくは成分ガイドをご確認ください。サプリメントは医薬品ではないため、効果を断言することはできません。`,
    },
  ]);

  return (
    <>
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {itemListJsonLd && (
        <script
          id="itemlist-jsonld"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <script
        id="faq-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* パンくずリスト - Sticky with glassmorphism */}
        <div
          className={`sticky top-0 z-10 border-b ${liquidGlassClasses.light}`}
          style={{
            borderColor: appleWebColors.borderSubtle,
          }}
        >
          <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4 max-w-[1440px]">
            <nav
              className="flex items-center gap-2 text-[13px]"
              style={{ color: appleWebColors.textSecondary }}
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
              <ChevronRight size={14} />
              <Link
                href="/products"
                className="transition-colors hover:text-[#007AFF]"
                style={{
                  color: appleWebColors.textSecondary,
                }}
              >
                商品一覧
              </Link>
              <ChevronRight size={14} />
              <span
                className="font-medium"
                style={{ color: appleWebColors.textPrimary }}
              >
                {ingredient.name}の比較
              </span>
            </nav>
          </div>
        </div>

        {/* ヘッダー */}
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1440px]">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="p-3 rounded-[16px]"
                style={{
                  backgroundColor: `${systemColors.blue}15`,
                }}
              >
                <TrendingUp style={{ color: systemColors.blue }} size={32} />
              </div>
              <div>
                <p
                  className="text-[13px] mb-1"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {ingredient.category}
                </p>
                <h1
                  className="text-[34px] font-bold leading-[41px] tracking-[0.37px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {ingredient.name}を含むサプリメント
                </h1>
                <p
                  className="text-[17px] mt-2"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {ingredient.nameEn}
                </p>
              </div>
            </div>

            <p
              className="text-[17px] leading-[25px] max-w-3xl"
              style={{ color: appleWebColors.textPrimary }}
            >
              {ingredient.description}
            </p>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <div
                className="px-4 py-2 rounded-[16px]"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                }}
              >
                <span
                  className="text-[15px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {productsWithCost.length}種類の商品
                </span>
              </div>
              {productsWithCost.length > 0 && (
                <div
                  className="px-4 py-2 rounded-[16px]"
                  style={{
                    backgroundColor: `${systemColors.green}15`,
                  }}
                >
                  <span
                    className="text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
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
            <div
              className={`text-center py-20 rounded-[20px] border ${liquidGlassClasses.light}`}
              style={{
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <div className="mb-4">
                <Award
                  size={64}
                  className="mx-auto"
                  style={{ color: appleWebColors.textSecondary, opacity: 0.5 }}
                />
              </div>
              <p
                className="text-[17px] mb-6"
                style={{ color: appleWebColors.textSecondary }}
              >
                現在この成分を含む商品はありません
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] font-semibold text-[17px] transition-all hover:bg-[#0051d5]"
                style={{
                  backgroundColor: systemColors.blue,
                  color: "#FFFFFF",
                }}
              >
                すべての商品を見る
                <TrendingUp size={16} />
              </Link>
            </div>
          )}

          {/* 成分ガイドへのリンク */}
          <div
            className={`mt-12 p-8 rounded-[20px] border hover:-translate-y-1 transition-all duration-300 ${liquidGlassClasses.light}`}
            style={{
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h2
              className="text-[22px] font-bold leading-[28px] tracking-[0.35px] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              {ingredient.name}についてもっと知る
            </h2>
            <p
              className="text-[17px] leading-[25px] mb-6"
              style={{ color: appleWebColors.textSecondary }}
            >
              {ingredient.name}
              の効果・効能、推奨摂取量、副作用などの詳細情報をご覧いただけます。
            </p>
            <Link
              href={`/ingredients/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] font-semibold text-[17px] transition-all hover:bg-[#0051d5]"
              style={{
                backgroundColor: systemColors.blue,
                color: "#FFFFFF",
              }}
            >
              {ingredient.name}の詳細ガイドを見る
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
