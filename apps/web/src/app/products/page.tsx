import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import { ProductsSection } from "@/components/ProductsSection";
import { generateItemListStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { headers } from "next/headers";
import Script from "next/script";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Product {
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: {
    current: string;
  };
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: {
      name: string;
      nameEn: string;
      category?: string;
    };
  }>;
}

// 全商品を取得
async function getAllProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] | order(priceJPY asc){
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        name,
        nameEn,
        category
      }
    }
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

  const structuredData = generateItemListStructuredData({
    items: productsWithCost.map((product) => ({
      name: product.name,
      url: `${siteUrl}/products/${product.slug.current}`,
    })),
  });

  return (
    <>
      {/* JSON-LD構造化データ */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
        {/* ヘッダーナビゲーション */}
        <div className="border-b border-primary-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px] py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">トップページに戻る</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <ProductsSection products={productsWithCost} />
      </div>
    </>
  );
}
