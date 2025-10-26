import { sanityServer } from "@/lib/sanityServer";
import { checkCompliance, generateSampleDescription } from "@/lib/compliance";
import { WarningBanner } from "@/components/WarningBanner";
import { PriceTable } from "@/components/PriceTable";
import { PriceComparison } from "@/components/PriceComparison";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { notFound } from "next/navigation";
import { isValidSlug } from "@/lib/sanitize";
import Image from "next/image";
import { headers } from "next/headers";
import Script from "next/script";

interface PriceData {
  source: string;
  amount: number;
  currency: string;
  url: string;
  fetchedAt: string;
  confidence?: number;
}

interface PriceHistory {
  source: string;
  amount: number;
  recordedAt: string;
}

interface Product {
  _id: string;
  name: string;
  brandName: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  description?: string;
  slug: {
    current: string;
  };
  images?: Array<{
    asset: {
      url: string;
    };
    alt?: string;
  }>;
  externalImageUrl?: string;
  priceData?: PriceData[];
  priceHistory?: PriceHistory[];
  urls?: {
    rakuten?: string;
    amazon?: string;
    iherb?: string;
  };
  janCode?: string | null;
  itemCode?: string;
  affiliateUrl?: string;
  source?: string;
}

async function getProduct(slug: string): Promise<Product | null> {
  // Validate slug format for security
  if (!isValidSlug(slug)) {
    return null;
  }

  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    'brandName': brand->name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    description,
    slug,
    images[]{
      asset->{
        url
      },
      alt
    },
    externalImageUrl,
    priceData,
    priceHistory,
    urls,
    janCode,
    itemCode,
    affiliateUrl,
    source
  }`;

  try {
    const product = await sanityServer.fetch(query, { slug });
    return product || null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

/**
 * JANコードが同じ商品を複数ソースから取得
 */
async function getRelatedProductsByJan(
  janCode: string | null,
): Promise<PriceData[]> {
  if (!janCode) {
    return [];
  }

  const query = `*[_type == "product" && janCode == $janCode && janCode != null]{
    _id,
    name,
    source,
    priceJPY,
    affiliateUrl,
    availability,
    itemCode
  }`;

  try {
    const products = await sanityServer.fetch(query, { janCode });

    // PriceData形式に変換
    return products.map((product: any) => ({
      source: product.source || "unknown",
      amount: product.priceJPY,
      currency: "JPY",
      url: product.affiliateUrl || "#",
      fetchedAt: new Date().toISOString(),
      confidence: 0.95, // JANコード一致なので高い信頼度
    }));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // JANコードで関連商品を取得して価格比較データを作成
  const relatedPrices = await getRelatedProductsByJan(product.janCode || null);

  // 既存のpriceDataとマージ（既存データを優先）
  const mergedPriceData =
    product.priceData && product.priceData.length > 0
      ? product.priceData
      : relatedPrices;

  // Generate sample description if not available
  const description =
    product.description || generateSampleDescription(product.name);

  // Check compliance
  const complianceResult = checkCompliance(description);

  // Generate JSON-LD structured data
  const productJsonLd = generateProductJsonLd({
    name: product.name,
    brand: product.brandName,
    priceJPY: product.priceJPY,
    slug: product.slug.current,
    description,
    images: product.images?.map((img) => img.asset?.url).filter(Boolean),
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "ホーム", url: "/" },
    { name: "商品", url: "/products" },
    { name: product.name, url: `/products/${product.slug.current}` },
  ]);
  const nonce = headers().get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script id="product-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(productJsonLd)}
      </Script>
      <Script id="breadcrumb-jsonld" type="application/ld+json" nonce={nonce}>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>

      <div className="container mx-auto px-4 py-8">
        {/* Compliance Warning Banner */}
        {complianceResult.hasViolations && (
          <WarningBanner violations={complianceResult.violations} />
        )}

        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-4" aria-label="パンくずリスト">
          <ol className="flex space-x-2">
            <li>
              <a href="/" className="hover:text-gray-700">
                ホーム
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/products" className="hover:text-gray-700">
                商品
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-gray-600">{product.brandName}</p>
        </div>

        {/* Product Image */}
        {(product.externalImageUrl ||
          (product.images && product.images.length > 0)) && (
          <div className="mb-8">
            <Image
              src={product.externalImageUrl || product.images![0].asset.url}
              alt={product.images?.[0]?.alt || product.name}
              width={400}
              height={300}
              className="rounded-lg shadow-sm"
              priority
            />
          </div>
        )}

        {/* Product Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">商品説明</h2>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Price Table Component */}
        <PriceTable
          product={{
            name: product.name,
            priceJPY: product.priceJPY,
            servingsPerContainer: product.servingsPerContainer,
            servingsPerDay: product.servingsPerDay,
          }}
          className="mb-8"
        />

        {/* Price Comparison Component */}
        <PriceComparison priceData={mergedPriceData} className="mb-8" />

        {/* Price History Chart */}
        <PriceHistoryChart
          priceHistory={product.priceHistory}
          className="mb-8"
        />

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            商品一覧に戻る
          </a>
        </div>
      </div>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "商品が見つかりません",
    };
  }

  return generateProductMetadata({
    name: product.name,
    brand: product.brandName,
    priceJPY: product.priceJPY,
    slug: product.slug.current,
    description: product.description,
    images: product.images?.map((img) => img.asset?.url).filter(Boolean),
  });
}
