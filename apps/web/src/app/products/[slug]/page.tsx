import { sanityServer } from "@/lib/sanityServer";
import { checkCompliance, generateSampleDescription } from "@/lib/compliance";
import { WarningBanner } from "@/components/WarningBanner";
import { PriceComparison } from "@/components/PriceComparison";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { ProductBadges, BadgeSummary } from "@/components/ProductBadges";
import { IngredientComparison } from "@/components/IngredientComparison";
import { CostEffectivenessDetail } from "@/components/CostEffectivenessDetail";
import { EvidenceSafetyDetail } from "@/components/EvidenceSafetyDetail";
import { RelatedIngredients } from "@/components/RelatedIngredients";
import { ImageLightbox } from "@/components/ImageLightbox";
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { notFound } from "next/navigation";
import { isValidSlug } from "@/lib/sanitize";
import Image from "next/image";
import { headers } from "next/headers";
import { evaluateBadges, ProductForBadgeEvaluation } from "@/lib/badges";
import {
  calculateAutoScores,
  calculateEvidenceScoreByRatio,
  calculateSafetyScoreByRatio,
  evidenceLevelToScore,
  scoreToEvidenceLevel,
  type IngredientSafetyDetail,
} from "@/lib/auto-scoring";
import type { IngredientEvidenceDetail } from "@/components/EvidenceSafetyDetail";

interface PriceData {
  source: string;
  amount: number;
  currency: string;
  url: string;
  fetchedAt: string;
  confidence?: number;
  quantity?: number;
  unitPrice?: number;
  storeName?: string;
  productName?: string;
  itemCode?: string;
  shopName?: string;
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
  allIngredients?: string;
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
      slug?: { current: string };
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
    allIngredients,
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
        slug,
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
    slug: { current: string };
    imageUrl?: string;
    ingredientAmount: number;
    servingsPerDay: number;
    priceJPY: number;
    servingsPerContainer: number;
  }>
> {
  try {
    // 1. 現在の商品の主要成分を取得
    const currentProductQuery = `*[_type == "product" && _id == $productId][0]{
      ingredients[]{
        ingredient->{
          _id
        }
      }
    }`;

    const currentProduct = await sanityServer.fetch(currentProductQuery, {
      productId,
    });

    if (
      !currentProduct?.ingredients ||
      currentProduct.ingredients.length === 0
    ) {
      console.warn("No ingredients found for product:", productId);
      return [];
    }

    // 主要成分（最初の成分）のIDを取得
    const mainIngredientId = currentProduct.ingredients[0]?.ingredient?._id;

    if (!mainIngredientId) {
      console.warn("Main ingredient ID not found for product:", productId);
      return [];
    }

    // 2. 同じ主要成分を含む他の商品を検索
    const similarProductsQuery = `*[_type == "product"
      && _id != $productId
      && availability == "in-stock"
      && $mainIngredientId in ingredients[].ingredient._ref
    ]{
      name,
      slug,
      'imageUrl': coalesce(images[0].asset->url, externalImageUrl),
      'ingredientAmount': ingredients[ingredient._ref == $mainIngredientId][0].amountMgPerServing,
      servingsPerDay,
      priceJPY,
      servingsPerContainer
    }[0...${limit}]`;

    const products = await sanityServer.fetch(similarProductsQuery, {
      productId,
      mainIngredientId,
    });

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
    contraindications?: string[];
  }>
> {
  const query = `*[_type == "ingredient"]{
    _id,
    name,
    nameEn,
    evidenceLevel,
    category,
    sideEffects,
    interactions,
    contraindications
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

/**
 * アレルギー関連の禁忌タグとそのラベル
 * ⚠️ 重要: アレルギーは命に関わるため、表現は最大限強く明確に
 */
const ALLERGY_TAGS: Record<string, string> = {
  "allergy-prone":
    "アレルギー体質の方は、使用前に必ず医師にご相談ください",
  "shellfish-allergy": "貝アレルギーの方は絶対に使用しないでください",
  "soy-allergy": "大豆アレルギーの方は絶対に使用しないでください",
  "nut-allergy": "ナッツアレルギーの方は絶対に使用しないでください",
};

/**
 * 商品の成分からアレルギー情報を抽出
 */
function extractAllergyInfo(
  productIngredients: Product["ingredients"],
  allIngredients: Awaited<ReturnType<typeof getAllIngredients>>,
): Array<{ tag: string; label: string; ingredientName: string }> {
  if (!productIngredients || productIngredients.length === 0) {
    return [];
  }

  const allergyInfo: Array<{
    tag: string;
    label: string;
    ingredientName: string;
  }> = [];
  const seenTags = new Set<string>();

  // 商品に含まれる各成分について
  for (const prodIngredient of productIngredients) {
    if (!prodIngredient.ingredient?._id) continue;

    // 成分マスタから詳細情報を取得
    const ingredientDetail = allIngredients.find(
      (ing) => ing._id === prodIngredient.ingredient!._id,
    );

    if (!ingredientDetail?.contraindications) continue;

    // アレルギー関連の禁忌タグを抽出
    for (const tag of ingredientDetail.contraindications) {
      if (ALLERGY_TAGS[tag] && !seenTags.has(tag)) {
        allergyInfo.push({
          tag,
          label: ALLERGY_TAGS[tag],
          ingredientName: ingredientDetail.name,
        });
        seenTags.add(tag);
      }
    }
  }

  return allergyInfo;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // 全成分マスタデータを取得
  const allIngredients = await getAllIngredients();

  // アレルギー情報を抽出
  const allergyInfo = extractAllergyInfo(product.ingredients, allIngredients);

  // スコアの自動計算
  let finalScores = product.scores || { evidence: 50, safety: 50, overall: 50 };
  let safetyDetails: IngredientSafetyDetail[] = [];
  let evidenceDetails: IngredientEvidenceDetail[] = [];

  // 商品に成分データがあり、全ての成分にingredient情報がある場合は配合率ベースで計算
  const hasValidIngredients =
    product.ingredients &&
    product.ingredients.length > 0 &&
    product.ingredients.every(
      (ing) => ing.ingredient && ing.amountMgPerServing > 0,
    );

  if (hasValidIngredients) {
    // 配合率ベースのスコア計算
    const ingredientsWithAmount = product.ingredients!.map((ing) => ({
      ingredient: ing.ingredient!,
      amountMg: ing.amountMgPerServing,
    }));

    const evidenceScore = calculateEvidenceScoreByRatio(ingredientsWithAmount);
    const safetyResult = calculateSafetyScoreByRatio(ingredientsWithAmount);

    // エビデンス詳細を生成
    const totalAmount = ingredientsWithAmount.reduce(
      (sum, item) => sum + item.amountMg,
      0,
    );
    evidenceDetails = ingredientsWithAmount.map((item) => {
      const ratio = item.amountMg / totalAmount;
      const evidenceLevel = item.ingredient.evidenceLevel || ("D" as const);
      return {
        name: item.ingredient.name,
        evidenceLevel: evidenceLevel as "S" | "A" | "B" | "C" | "D",
        evidenceScore: evidenceLevelToScore(evidenceLevel),
        amountMg: item.amountMg,
        ratio: ratio,
      };
    });

    finalScores = {
      evidence: evidenceScore,
      safety: safetyResult.score,
      overall: Math.round((evidenceScore + safetyResult.score) / 2),
    };
    safetyDetails = safetyResult.details;

    console.log(`[配合率ベーススコア計算] ${product.name}:`, {
      成分数: ingredientsWithAmount.length,
      配合量合計: ingredientsWithAmount.reduce(
        (sum, item) => sum + item.amountMg,
        0,
      ),
      配合率: ingredientsWithAmount.map((item, index, arr) => ({
        成分: item.ingredient.name,
        配合量: item.amountMg,
        配合率:
          Math.round(
            (item.amountMg / arr.reduce((sum, i) => sum + i.amountMg, 0)) *
              1000,
          ) / 10,
      })),
      evidenceScore,
      safetyScore: safetyResult.score,
      overall: finalScores.overall,
      evidenceDetails: evidenceDetails.length,
    });
    console.log(`[エビデンス詳細] evidenceDetails:`, evidenceDetails);
  } else if (
    !product.scores ||
    !product.scores.evidence ||
    !product.scores.safety
  ) {
    // 成分データがない、または不完全な場合は商品名から推測（フォールバック）
    const autoScores = calculateAutoScores(product.name, allIngredients);
    finalScores = {
      evidence: autoScores.evidenceScore,
      safety: autoScores.safetyScore,
      overall: autoScores.overallScore,
    };
    safetyDetails = autoScores.safetyDetails;

    console.log(`[商品名ベーススコア計算] ${product.name}:`, {
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

  // 称号計算用にデータを変換（配合率ベースのスコアを適用）
  const productsForEvaluation: ProductForBadgeEvaluation[] = allProducts.map(
    (p) => {
      // 各商品にもスコア計算を適用
      let evidenceScore = 50;
      let safetyScore = 50;

      // 既にスコアがある場合はそれを使用
      if (p.scores?.evidence && p.scores?.safety) {
        evidenceScore = p.scores.evidence;
        safetyScore = p.scores.safety;
      } else {
        // 成分データがある場合は配合率ベースで計算
        const hasValidIngredients =
          p.ingredients &&
          p.ingredients.length > 0 &&
          p.ingredients.every(
            (ing: any) => ing.ingredient && ing.amountMgPerServing > 0,
          );

        if (hasValidIngredients) {
          const ingredientsWithAmount = p.ingredients!.map((ing: any) => ({
            ingredient: ing.ingredient,
            amountMg: ing.amountMgPerServing,
          }));

          evidenceScore = calculateEvidenceScoreByRatio(ingredientsWithAmount);
          const safetyResult = calculateSafetyScoreByRatio(
            ingredientsWithAmount,
          );
          safetyScore = safetyResult.score;
        } else {
          // フォールバック: 商品名から推測
          const autoScores = calculateAutoScores(p.name || "", allIngredients);
          evidenceScore = autoScores.evidenceScore;
          safetyScore = autoScores.safetyScore;
        }
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
    prices: mergedPriceData?.map((p) => ({
      amount: p.amount,
      source: p.source,
    })),
    slug: product.slug.current,
    description,
    images: product.images?.map((img) => img.asset?.url).filter(Boolean),
    mainIngredient: mainIngredientInfo?.name,
    ingredientAmount: mainIngredientAmount,
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
      <script
        id="product-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
        <div className="mb-8">
          {product.externalImageUrl ||
          (product.images && product.images.length > 0) ? (
            <ImageLightbox
              src={product.externalImageUrl || product.images![0].asset.url}
              alt={product.images?.[0]?.alt || product.name}
              width={400}
              height={300}
            />
          ) : (
            <div className="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center p-6">
                <div className="text-6xl mb-3">📦</div>
                <p className="text-gray-500 font-medium">商品画像準備中</p>
                <p className="text-xs text-gray-400 mt-1">
                  画像は順次追加予定です
                </p>
              </div>
            </div>
          )}
        </div>

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
              slug: product.slug,
              imageUrl:
                product.images?.[0]?.asset?.url || product.externalImageUrl,
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
              slug: product.slug,
              imageUrl:
                product.images?.[0]?.asset?.url || product.externalImageUrl,
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
          ingredientName={ingredientName}
          ingredientEvidenceLevel={ingredientEvidenceLevel}
          safetyDetails={safetyDetails}
          evidenceDetails={evidenceDetails}
          allIngredients={product.allIngredients}
          allergyInfo={allergyInfo}
          className="mb-8"
        />

        {/* 7. Product Badges - 獲得した称号の説明 */}
        <ProductBadges badges={badges} className="mb-8" />

        {/* Additional Information */}
        {/* 8. Related Ingredients - 配合成分ガイド */}
        {product.ingredients && product.ingredients.length > 0 && (
          <RelatedIngredients
            ingredients={product.ingredients}
            className="mb-8"
          />
        )}

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

  // JANコードで関連商品を取得して価格比較データを作成
  const relatedPrices = await getRelatedProductsByJan(product.janCode || null);

  // 既存のpriceDataとマージ（既存データを優先）
  const mergedPriceData =
    product.priceData && product.priceData.length > 0
      ? product.priceData
      : relatedPrices;

  return generateProductMetadata({
    name: product.name,
    brand: product.brandName,
    priceJPY: product.priceJPY,
    prices: mergedPriceData?.map((p) => ({
      amount: p.amount,
      source: p.source,
    })),
    slug: product.slug.current,
    description: product.description,
    images: product.images?.map((img) => img.asset?.url).filter(Boolean),
    mainIngredient: product.ingredients?.[0]?.ingredient?.name,
    ingredientAmount: product.ingredients?.[0]?.amountMgPerServing,
  });
}
