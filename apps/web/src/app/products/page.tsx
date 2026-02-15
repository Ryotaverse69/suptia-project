import { Metadata } from "next";
import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { ProductsSection } from "@/components/ProductsSection";
import { TierRankStats } from "@/components/TierRankStats";
import {
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TierRatings } from "@/lib/tier-ranking";
import { BadgeType } from "@/lib/badges";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import {
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

// ISR設定: 5分ごとにページを再生成
export const revalidate = 300; // 300秒 = 5分

export const metadata: Metadata = {
  title: "サプリメント商品一覧｜価格比較・成分量・コスパで選ぶ - サプティア",
  description:
    "楽天・Amazon・Yahoo!などの複数ECサイトでサプリメントを価格比較。成分量・コスパ・安全性・エビデンスレベルで徹底評価。最安値のサプリメントが見つかります。",
  keywords: [
    "サプリメント",
    "商品一覧",
    "価格比較",
    "最安値",
    "コスパ",
    "成分量",
    "安全性",
    "エビデンス",
    "楽天",
    "Amazon",
    "Yahoo!ショッピング",
  ],
  openGraph: {
    title: "サプリメント商品一覧 - サプティア",
    description:
      "楽天・Amazon・Yahoo!などの複数ECサイトでサプリメントを価格比較。成分量・コスパ・安全性で最適な商品を見つけられます。",
    type: "website",
    url: "https://suptia.com/products",
  },
  twitter: {
    card: "summary_large_image",
    title: "サプリメント商品一覧 - サプティア",
    description: "複数ECサイトでサプリメントを価格比較。最安値が見つかります。",
  },
  alternates: {
    canonical: "https://suptia.com/products",
  },
};

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  source?: string;
  form?: string;
  slug: {
    current: string;
  };
  priceData?: Array<{
    source: string;
    amount: number;
    currency: string;
    url: string;
  }>;
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: {
      name: string;
      nameEn: string;
      category?: string;
    };
  }>;
  tierRatings?: TierRatings;
  badges?: BadgeType[];
}

// 全商品を取得（在庫ありのみ）
async function getAllProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock"] | order(priceJPY asc){
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    source,
    form,
    slug,
    priceData[]{
      source,
      amount,
      currency,
      url
    },
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        name,
        nameEn,
        category
      }
    },
    tierRatings {
      priceRank,
      costEffectivenessRank,
      contentRank,
      evidenceRank,
      safetyRank,
      overallRank
    },
    badges
  }`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const allProducts = await getAllProducts();

  // 有効な商品のみをフィルター（価格情報が正しいもの）
  const products = allProducts.filter(
    (product) =>
      product.priceJPY &&
      typeof product.priceJPY === "number" &&
      product.priceJPY > 0 &&
      product.servingsPerContainer &&
      product.servingsPerDay,
  );

  // コスト計算と評価を追加
  const productsWithCost = products.map((product) => {
    const effectiveCostPerDay = calculateEffectiveCostPerDay(product);

    return {
      ...product,
      effectiveCostPerDay,
      rating: 4.2 + Math.random() * 0.7,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      isBestValue: effectiveCostPerDay < 50,
      safetyScore: 85 + Math.floor(Math.random() * 10),
    };
  });

  // 構造化データの生成
  const siteUrl = getSiteUrl();

  const itemListData = generateItemListStructuredData({
    items: productsWithCost.map((product) => ({
      name: product.name,
      url: `${siteUrl}/products/${product.slug.current}`,
    })),
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: `${siteUrl}/` },
    { name: "商品一覧", url: `${siteUrl}/products` },
  ]);

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD構造化データ: ItemList */}
      <script
        id="itemlist-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListData) }}
      />

      {/* JSON-LD構造化データ: Breadcrumb */}
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* ヘッダーナビゲーション */}
        <div
          className={`border-b sticky top-0 z-10 ${liquidGlassClasses.light}`}
          style={{
            borderColor: appleWebColors.borderSubtle,
          }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1440px] py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-70 min-h-[44px]"
              style={{ color: appleWebColors.textPrimary }}
            >
              <ChevronLeft size={20} />
              <span className="text-[15px] font-medium">
                トップページに戻る
              </span>
            </Link>
          </div>
        </div>

        {/* Tier Rank Statistics */}
        <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1440px] py-4">
          <TierRankStats products={productsWithCost} />
        </div>

        {/* Compliance Info Banner */}
        <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1440px] pb-4">
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[16px] p-4 border ${liquidGlassClasses.light}`}
            style={{
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-3">
              <ComplianceBadge variant="compact" />
              <p
                className="text-[14px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                すべての商品情報は薬機法に準拠して表示されています
              </p>
            </div>
            <Link
              href="/why-suptia"
              className="text-[14px] font-medium whitespace-nowrap transition-opacity hover:opacity-70"
              style={{ color: appleWebColors.blue }}
            >
              AI検索との違いを見る →
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <ProductsSection products={productsWithCost} />
      </div>
    </>
  );
}
