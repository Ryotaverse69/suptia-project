import { sanityServer } from "@/lib/sanityServer";
import { checkCompliance, generateSampleDescription } from "@/lib/compliance";
import { WarningBanner } from "@/components/WarningBanner";
import { PriceTable } from "@/components/PriceTable";
import { PriceComparison } from "@/components/PriceComparison";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { ProductBadges, BadgeSummary } from "@/components/ProductBadges";
import { IngredientComparison } from "@/components/IngredientComparison";
import { CostEffectivenessDetail } from "@/components/CostEffectivenessDetail";
import { EvidenceSafetyDetail } from "@/components/EvidenceSafetyDetail";
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
import { evaluateBadges, ProductForBadgeEvaluation } from "@/lib/badges";
import {
  calculateAutoScores,
  type IngredientSafetyDetail,
} from "@/lib/auto-scoring";

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
  scores?: {
    safety?: number;
    evidence?: number;
    overall?: number;
  };
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: {
      _id: string;
      name: string;
      nameEn: string;
      evidenceLevel?: "S" | "A" | "B" | "C" | "D";
      category?: string;
    };
  }>;
  thirdPartyTested?: boolean;
  warnings?: string[];
  references?: Array<{
    title?: string;
    url?: string;
    source?: string;
  }>;
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
    source,
    scores,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        _id,
        name,
        nameEn,
        evidenceLevel,
        category
      }
    },
    thirdPartyTested,
    warnings,
    references
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

/**
 * 全商品を取得（称号計算用）
 */
async function getAllProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock"]{
    _id,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    scores,
    ingredients,
    priceData
  }`;

  try {
    const products = await sanityServer.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}

/**
 * 類似商品を取得（同じ主要成分を含む商品）
 */
async function getSimilarProducts(
  productId: string,
  limit: number = 5,
): Promise<
  Array<{
    name: string;
    ingredientAmount: number;
    servingsPerDay: number;
    priceJPY: number;
    servingsPerContainer: number;
  }>
> {
  const query = `*[_type == "product" && _id != $productId && availability == "in-stock"]{
    name,
    'ingredientAmount': ingredients[0].amountMgPerServing,
    servingsPerDay,
    priceJPY,
    servingsPerContainer
  }[0...${limit}]`;

  try {
    const products = await sanityServer.fetch(query, { productId });
    return products || [];
  } catch (error) {
    console.error("Failed to fetch similar products:", error);
    return [];
  }
}

/**
 * 全成分マスタデータを取得
 */
async function getAllIngredients(): Promise<
  Array<{
    _id: string;
    name: string;
    nameEn: string;
    evidenceLevel?: "S" | "A" | "B" | "C" | "D";
    category?: string;
    sideEffects?: string[];
    interactions?: string[];
  }>
> {
  const query = `*[_type == "ingredient"]{
    _id,
    name,
    nameEn,
    evidenceLevel,
    category,
    sideEffects,
    interactions
  }`;

  try {
    const ingredients = await sanityServer.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
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

  // 全成分マスタデータを取得
  const allIngredients = await getAllIngredients();

  // スコアの自動計算（scoresがない、またはingredientsが空の場合）
  const needsAutoScoring =
    !product.scores ||
    !product.scores.evidence ||
    !product.scores.safety ||
    !product.ingredients ||
    product.ingredients.length === 0;

  let finalScores = product.scores || { evidence: 50, safety: 50, overall: 50 };
  let safetyDetails: IngredientSafetyDetail[] = [];

  if (needsAutoScoring) {
    const autoScores = calculateAutoScores(product.name, allIngredients);
    finalScores = {
      evidence: autoScores.evidenceScore,
      safety: autoScores.safetyScore,
      overall: autoScores.overallScore,
    };
    safetyDetails = autoScores.safetyDetails;

    console.log(`[Auto-Scoring] ${product.name}:`, {
      foundIngredients: autoScores.foundIngredients,
      evidenceScore: autoScores.evidenceScore,
      evidenceLevel: autoScores.evidenceLevel,
      safetyScore: autoScores.safetyScore,
      safetyLevel: autoScores.safetyLevel,
      safetyDetails: autoScores.safetyDetails,
    });
  }

  // 全商品を取得して称号を計算
  const allProducts = await getAllProducts();

  // 称号計算用にデータを変換（自動スコアを適用）
  const productsForEvaluation: ProductForBadgeEvaluation[] = allProducts.map(
    (p) => {
      // 各商品にも自動スコア計算を適用
      let evidenceScore = 50;
      let safetyScore = 50;

      if (p.scores?.evidence && p.scores?.safety) {
        evidenceScore = p.scores.evidence;
        safetyScore = p.scores.safety;
      } else {
        const autoScores = calculateAutoScores(p.name || "", allIngredients);
        evidenceScore = autoScores.evidenceScore;
        safetyScore = autoScores.safetyScore;
      }

      return {
        _id: p._id,
        priceJPY: p.priceJPY,
        servingsPerContainer: p.servingsPerContainer,
        servingsPerDay: p.servingsPerDay,
        ingredientAmount: p.ingredients?.[0]?.amountMgPerServing,
        evidenceLevel:
          evidenceScore >= 90
            ? "S"
            : evidenceScore >= 80
              ? "A"
              : evidenceScore >= 70
                ? "B"
                : evidenceScore >= 60
                  ? "C"
                  : "D",
        safetyScore,
        priceData: p.priceData,
      };
    },
  );

  // 現在の商品の称号を計算
  const currentProductForEvaluation = productsForEvaluation.find(
    (p) => p._id === product._id,
  );
  const badges = currentProductForEvaluation
    ? evaluateBadges(currentProductForEvaluation, productsForEvaluation)
    : [];

  // 類似商品を取得
  const similarProducts = await getSimilarProducts(product._id, 5);

  // 主要成分データを準備
  const mainIngredient = product.ingredients?.[0];
  const mainIngredientAmount = mainIngredient?.amountMgPerServing || 0;
  const mainIngredientInfo = mainIngredient?.ingredient;
  const ingredientName = mainIngredientInfo?.name;
  const ingredientEvidenceLevel = mainIngredientInfo?.evidenceLevel;

  // エビデンスレベルを判定（自動計算されたスコアを使用）
  const evidenceScore = finalScores.evidence ?? 50;
  const evidenceLevel =
    evidenceScore >= 90
      ? ("S" as const)
      : evidenceScore >= 80
        ? ("A" as const)
        : evidenceScore >= 70
          ? ("B" as const)
          : evidenceScore >= 60
            ? ("C" as const)
            : ("D" as const);

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
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

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
          <p className="text-lg text-gray-600 mb-4">{product.brandName}</p>

          {/* Badge Summary */}
          <BadgeSummary badges={badges} />
        </div>

        {/* Product Image */}
        {(product.externalImageUrl ||
          (product.images && product.images.length > 0)) && (
          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.externalImageUrl || product.images![0].asset.url}
              alt={product.images?.[0]?.alt || product.name}
              width={400}
              height={300}
              className="rounded-lg shadow-sm"
              loading="eager"
            />
          </div>
        )}

        {/* 1. Product Description - 商品の詳細 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">商品説明</h2>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* 2. Price Comparison - 最安値比較 */}
        <PriceComparison priceData={mergedPriceData} className="mb-8" />

        {/* 3. Cost Effectiveness - コスパ比較 */}
        {mainIngredientAmount > 0 && similarProducts.length > 0 && (
          <CostEffectivenessDetail
            currentProduct={{
              name: product.name,
              priceJPY: product.priceJPY,
              ingredientAmount: mainIngredientAmount,
              servingsPerContainer: product.servingsPerContainer,
              servingsPerDay: product.servingsPerDay,
            }}
            similarProducts={similarProducts}
            className="mb-8"
          />
        )}

        {/* 4. Ingredient Comparison - 含有量比較 */}
        {mainIngredientAmount > 0 && similarProducts.length > 0 && (
          <IngredientComparison
            currentProduct={{
              name: product.name,
              ingredientAmount: mainIngredientAmount,
              servingsPerDay: product.servingsPerDay,
            }}
            similarProducts={similarProducts}
            ingredientName="主要成分"
            className="mb-8"
          />
        )}

        {/* 5-6. Evidence & Safety - エビデンスと安全性 */}
        <EvidenceSafetyDetail
          evidenceLevel={evidenceLevel}
          evidenceScore={finalScores.evidence}
          safetyScore={finalScores.safety}
          thirdPartyTested={product.thirdPartyTested || false}
          warnings={product.warnings || []}
          references={product.references || []}
          ingredientName={ingredientName}
          ingredientEvidenceLevel={ingredientEvidenceLevel}
          safetyDetails={safetyDetails}
          className="mb-8"
        />

        {/* 7. Product Badges - 獲得した称号の説明 */}
        <ProductBadges badges={badges} className="mb-8" />

        {/* Additional Information */}
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
