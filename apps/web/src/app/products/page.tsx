import { Metadata } from "next";
import { sanity } from "@/lib/sanity.client";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductStats } from "@/components/ProductStats";
import { generateItemListStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { headers } from "next/headers";
import Script from "next/script";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  evaluateBadges,
  BadgeType,
  ProductForBadgeEvaluation,
} from "@/lib/badges";

// 開発中は常に最新データを取得
export const dynamic = "force-dynamic";

interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  brand: {
    _id: string;
    name: string;
    trustScore?: number;
    country?: string;
  };
  priceJPY: number;
  servingsPerContainer?: number;
  servingsPerDay?: number;
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
  form?: string;
  thirdPartyTested?: boolean;
  source?: string;
  priceData?: Array<{
    source: string;
    amount: number;
  }>;
  images?: Array<{
    asset: {
      url: string;
    };
  }>;
}

interface Brand {
  _id: string;
  name: string;
  country?: string;
}

interface SearchParams {
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minScore?: string;
  badges?: string; // カンマ区切りのバッジタイプ
  ecSites?: string; // カンマ区切りのECサイト
  sort?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

// SEOメタデータ
export const metadata: Metadata = {
  title: "サプリメント商品一覧｜科学的根拠に基づく比較 - サプティア",
  description:
    "安全性、エビデンス、コストパフォーマンスの3つのスコアで評価された厳選サプリメント。ブランド、価格帯、スコアでフィルタリング可能。",
  keywords: [
    "サプリメント",
    "比較",
    "ランキング",
    "価格比較",
    "安全性",
    "エビデンス",
    "コスパ",
  ],
  openGraph: {
    title: "サプリメント商品一覧",
    description: "科学的根拠に基づくサプリメント比較サイト",
    type: "website",
    url: "https://suptia.com/products",
  },
};

// 全ブランドを取得
async function getAllBrands(): Promise<Brand[]> {
  const query = `*[_type == "brand"] | order(name asc){
    _id,
    name,
    country
  }`;

  try {
    const brands = await sanity.fetch(query);
    return brands || [];
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

// 商品を取得（フィルタリング＆ソート対応）
async function getProducts(params: SearchParams): Promise<Product[]> {
  const {
    brand,
    minPrice,
    maxPrice,
    minScore,
    ecSites,
    sort = "overall",
  } = params;

  // フィルター条件を構築
  const filters: string[] = [
    '_type == "product"',
    'availability == "in-stock"',
  ];

  if (brand) {
    filters.push(`brand._ref == "${brand}"`);
  }

  if (minPrice) {
    filters.push(`priceJPY >= ${minPrice}`);
  }

  if (maxPrice) {
    filters.push(`priceJPY <= ${maxPrice}`);
  }

  if (minScore) {
    filters.push(`scores.overall >= ${minScore}`);
  }

  // ECサイトフィルター
  if (ecSites) {
    const siteList = ecSites.split(",").map((s) => `"${s.trim()}"`);
    filters.push(`source in [${siteList.join(", ")}]`);
  }

  const filterQuery = filters.join(" && ");

  // ソート条件を構築
  let orderBy = "";
  switch (sort) {
    case "price-asc":
      orderBy = "priceJPY asc";
      break;
    case "price-desc":
      orderBy = "priceJPY desc";
      break;
    case "rating":
      orderBy = "reviewStats.averageRating desc";
      break;
    case "overall":
    default:
      orderBy = "scores.overall desc";
      break;
  }

  const query = `*[${filterQuery}]{
    _id,
    name,
    slug,
    "brand": brand->{
      _id,
      name,
      trustScore,
      country
    },
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    scores,
    reviewStats,
    availability,
    form,
    thirdPartyTested,
    source,
    priceData,
    "images": images[0...1]{
      "asset": asset->
    }
  } | order(${orderBy})`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [allProducts, brands] = await Promise.all([
    getProducts(params),
    getAllBrands(),
  ]);

  // 称号を計算
  const productsForEvaluation: ProductForBadgeEvaluation[] = allProducts.map(
    (p) => ({
      _id: p._id,
      priceJPY: p.priceJPY,
      servingsPerContainer: p.servingsPerContainer,
      servingsPerDay: p.servingsPerDay,
      evidenceLevel: p.scores?.evidence
        ? p.scores.evidence >= 90
          ? "S"
          : p.scores.evidence >= 80
            ? "A"
            : p.scores.evidence >= 70
              ? "B"
              : p.scores.evidence >= 60
                ? "C"
                : "D"
        : undefined,
      safetyScore: p.scores?.safety,
      priceData: p.priceData,
    }),
  );

  const productsWithBadges = allProducts.map((product) => {
    const badges = evaluateBadges(
      productsForEvaluation.find((p) => p._id === product._id)!,
      productsForEvaluation,
    );
    return { ...product, badges };
  });

  // 称号フィルターを適用
  let filteredProducts = productsWithBadges;
  if (params.badges) {
    const requiredBadges = params.badges.split(",") as BadgeType[];
    filteredProducts = productsWithBadges.filter((product) =>
      requiredBadges.every((badge) => product.badges.includes(badge)),
    );
  }

  // Generate JSON-LD structured data for product list
  const siteUrl = getSiteUrl();
  const itemListJsonLd = generateItemListStructuredData({
    name: "サプリメント商品一覧",
    description:
      "安全性、エビデンス、コストパフォーマンスの3つのスコアで評価された厳選サプリメント",
    items: filteredProducts.map((product, index) => ({
      name: product.name,
      url: `${siteUrl}/products/${product.slug.current}`,
      position: index + 1,
    })),
  });

  const nonce = headers().get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD Structured Data for Product List */}
      <Script id="product-list-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <div className="min-h-screen bg-background">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-primary to-primary-700 text-white">
          <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1400px]">
            <h1 className="text-4xl font-bold mb-4">サプリメント商品一覧</h1>
            <p className="text-primary-100 text-lg">
              科学的根拠に基づいて評価された{filteredProducts.length}
              件の商品から、あなたに最適なサプリメントを見つけましょう
            </p>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-10 max-w-[1400px]">
          {/* 統計情報セクション */}
          <ProductStats products={productsWithBadges} className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左サイドバー：フィルター */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="bg-white border border-primary-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    フィルター
                  </h2>
                  <ProductFilters brands={brands} currentParams={params} />
                </div>
              </div>
            </aside>

            {/* 商品グリッド */}
            <main className="lg:col-span-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="mx-auto text-primary-300 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">
                    該当する商品が見つかりませんでした
                  </h3>
                  <p className="text-primary-700">
                    フィルター条件を変更してお試しください
                  </p>
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  currentSort={params.sort}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
