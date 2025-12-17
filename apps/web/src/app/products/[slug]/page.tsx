import { sanityServer } from "@/lib/sanityServer";
import { checkCompliance, generateSampleDescription } from "@/lib/compliance";
import { WarningBanner } from "@/components/WarningBanner";
import { PriceComparison } from "@/components/PriceComparison";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { IngredientComparison } from "@/components/IngredientComparison";
import { CostEffectivenessDetail } from "@/components/CostEffectivenessDetail";
import { EvidenceSafetyDetail } from "@/components/EvidenceSafetyDetail";
import { RelatedIngredients } from "@/components/RelatedIngredients";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";
import { TierRatings, calculateOverallRank } from "@/lib/tier-ranking";
import { scoreToTierRank } from "@/lib/tier-colors";
import { NutritionScoreCard } from "@/components/NutritionScoreBadge";
import {
  RdaFulfillmentHeatmap,
  RdaFulfillmentModal,
} from "@/components/RdaFulfillmentHeatmap";
import { IngredientCostChart } from "@/components/IngredientCostChart";
import { ProductIdentitySection } from "@/components/ProductIdentitySection";
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { notFound } from "next/navigation";
import { isValidSlug } from "@/lib/sanitize";
import { headers } from "next/headers";
import { evaluateBadges, ProductForBadgeEvaluation } from "@/lib/badges";
import {
  calculateAutoScores,
  calculateEvidenceScoreByRatio,
  calculateSafetyScoreByRatio,
  evidenceLevelToScore,
  type IngredientSafetyDetail,
} from "@/lib/auto-scoring";
import type { IngredientEvidenceDetail } from "@/components/EvidenceSafetyDetail";
import {
  Database,
  ShieldCheck,
  FileText,
  ChevronRight,
  Info,
  Activity,
  Zap,
  Beaker,
} from "lucide-react";
import Image from "next/image";
import {
  SeamlessModal,
  SeamlessModalTrigger,
  SeamlessModalContent,
} from "@/components/SeamlessModal";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import {
  getPrimaryIngredient,
  getPrimaryIngredientId,
} from "@/lib/primary-ingredient";
import {
  checkAdditives,
  calculateAdditiveScoreDeduction,
} from "@/lib/additives";
import {
  AdditivesSafetyCard,
  AdditivesSafetyBadge,
} from "@/components/AdditivesSafetyCard";
import { PriceAlertButton } from "@/components/PriceAlertButton";
import {
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

// --- Interfaces (Keep existing interfaces) ---
interface PriceData {
  source: string;
  shopName?: string;
  storeName?: string;
  productName?: string;
  itemCode?: string;
  amount: number;
  currency: string;
  url: string;
  fetchedAt: string;
  confidence?: number;
  quantity?: number;
  unitPrice?: number;
  shippingFee?: number;
  pointRate?: number;
  isFreeShipping?: boolean;
  effectivePrice?: number;
  pointAmount?: number;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "unknown";
}

interface PriceHistory {
  source: string;
  amount: number;
  recordedAt: string;
}

interface Product {
  _id: string;
  _updatedAt?: string;
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
    isPrimary?: boolean;
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
  tierRatings?: TierRatings;
}

// --- Data Fetching Functions (Keep existing logic) ---
async function getProduct(slug: string): Promise<Product | null> {
  if (!isValidSlug(slug)) return null;

  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id, _updatedAt, name, 'brandName': brand->name, priceJPY, servingsPerContainer, servingsPerDay,
    description, allIngredients, slug,
    images[]{ asset->{ url }, alt },
    externalImageUrl, priceData, priceHistory, urls, janCode, itemCode, affiliateUrl, source,
    scores { evidence, safety, overall },
    ingredients[]{
      amountMgPerServing, isPrimary,
      ingredient->{ _id, name, nameEn, slug, evidenceLevel, category }
    },
    thirdPartyTested, warnings, references,
    tierRatings { priceRank, costEffectivenessRank, contentRank, evidenceRank, safetyRank, overallRank }
  }`;

  try {
    return (await sanityServer.fetch(query, { slug })) || null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

function normalizePriceData(priceData: any): PriceData[] {
  if (!priceData) return [];
  if (Array.isArray(priceData))
    return priceData.filter((p) => p.amount && p.url && p.source);
  if (typeof priceData === "object") {
    if (priceData["0"]?.amount && priceData["0"]?.url) return [priceData["0"]];
    const prices: PriceData[] = [];
    for (const key in priceData) {
      if (
        !isNaN(Number(key)) &&
        priceData[key]?.amount &&
        priceData[key]?.url
      ) {
        prices.push(priceData[key]);
      }
    }
    return prices;
  }
  return [];
}

/**
 * affiliateUrl、urls、source、priceJPYから価格データを生成する
 * priceDataがない商品でも購入リンクを表示するために使用
 */
function generatePriceDataFromProduct(product: Product): PriceData[] {
  const prices: PriceData[] = [];
  const now = new Date().toISOString();

  // affiliateUrlが存在する場合
  if (product.affiliateUrl && product.priceJPY) {
    const source = product.source || detectSourceFromUrl(product.affiliateUrl);
    prices.push({
      source: source,
      amount: product.priceJPY,
      currency: "JPY",
      url: product.affiliateUrl,
      fetchedAt: now,
      confidence: 0.9,
    });
  }

  // urls内の各ECサイトのリンク
  if (product.urls) {
    if (product.urls.rakuten && product.priceJPY) {
      // affiliateUrlと重複していないか確認
      if (!prices.some((p) => p.source === "rakuten")) {
        prices.push({
          source: "rakuten",
          amount: product.priceJPY,
          currency: "JPY",
          url: product.urls.rakuten,
          fetchedAt: now,
          confidence: 0.8,
        });
      }
    }
    if (product.urls.amazon && product.priceJPY) {
      if (!prices.some((p) => p.source === "amazon")) {
        prices.push({
          source: "amazon",
          amount: product.priceJPY,
          currency: "JPY",
          url: product.urls.amazon,
          fetchedAt: now,
          confidence: 0.8,
        });
      }
    }
    if (product.urls.iherb && product.priceJPY) {
      if (!prices.some((p) => p.source === "iherb")) {
        prices.push({
          source: "iherb",
          amount: product.priceJPY,
          currency: "JPY",
          url: product.urls.iherb,
          fetchedAt: now,
          confidence: 0.8,
        });
      }
    }
  }

  return prices;
}

/**
 * URLからECサイトのソースを判定
 */
function detectSourceFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("rakuten")) return "rakuten";
  if (lowerUrl.includes("amazon")) return "amazon";
  if (lowerUrl.includes("iherb")) return "iherb";
  if (lowerUrl.includes("yahoo") || lowerUrl.includes("shopping.yahoo"))
    return "yahoo";
  return "unknown";
}

async function getRelatedProductsByJan(
  janCode: string | null,
): Promise<PriceData[]> {
  if (!janCode) return [];
  const query = `*[_type == "product" && janCode == $janCode && janCode != null]{
    _id, name, source, priceJPY, affiliateUrl, availability, itemCode
  }`;
  try {
    const products = await sanityServer.fetch(query, { janCode });
    return products.map((product: any) => ({
      source: product.source || "unknown",
      amount: product.priceJPY,
      currency: "JPY",
      url: product.affiliateUrl || "#",
      fetchedAt: new Date().toISOString(),
      confidence: 0.95,
    }));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

async function getAllProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock"]{
    _id, name, priceJPY, servingsPerContainer, servingsPerDay,
    scores { evidence, safety, overall },
    ingredients[]{ amountMgPerServing, ingredient->{ _id, name, evidenceLevel } },
    priceData,
    tierRatings {
      priceRank,
      costEffectivenessRank,
      contentRank,
      evidenceRank,
      safetyRank,
      overallRank
    }
  }`;
  try {
    return (await sanityServer.fetch(query)) || [];
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}

async function getTotalProductsInCategory(productId: string): Promise<number> {
  try {
    const currentProductQuery = `*[_type == "product" && _id == $productId][0]{ ingredients[]{ isPrimary, ingredient->{ _id } } }`;
    const currentProduct = await sanityServer.fetch(currentProductQuery, {
      productId,
    });
    if (!currentProduct?.ingredients || currentProduct.ingredients.length === 0)
      return 0;
    const mainIngredientId = getPrimaryIngredientId(currentProduct.ingredients);
    if (!mainIngredientId) return 0;

    const countQuery = `count(*[_type == "product" && availability == "in-stock" && $mainIngredientId in ingredients[].ingredient._ref])`;
    return (await sanityServer.fetch(countQuery, { mainIngredientId })) || 0;
  } catch (error) {
    console.error("Failed to count products in category:", error);
    return 0;
  }
}

async function getSimilarProducts(
  productId: string,
  limit: number = 5,
): Promise<any[]> {
  try {
    const currentProductQuery = `*[_type == "product" && _id == $productId][0]{ ingredients[]{ isPrimary, ingredient->{ _id } } }`;
    const currentProduct = await sanityServer.fetch(currentProductQuery, {
      productId,
    });
    if (!currentProduct?.ingredients || currentProduct.ingredients.length === 0)
      return [];
    const mainIngredientId = getPrimaryIngredientId(currentProduct.ingredients);
    if (!mainIngredientId) return [];

    const similarProductsQuery = `*[_type == "product" && _id != $productId && availability == "in-stock" && $mainIngredientId in ingredients[].ingredient._ref]{
      name, slug, 'imageUrl': coalesce(images[0].asset->url, externalImageUrl),
      'ingredientAmount': coalesce(ingredients[ingredient._ref == $mainIngredientId][0].amountMgPerServing, ingredients[0].amountMgPerServing, 1000),
      servingsPerDay, priceJPY, servingsPerContainer
    }[0...${limit}]`;

    const products = await sanityServer.fetch(similarProductsQuery, {
      productId,
      mainIngredientId,
    });
    return products.filter(
      (p: any) => p.ingredientAmount && p.ingredientAmount > 0,
    );
  } catch (error) {
    console.error("Failed to fetch similar products:", error);
    return [];
  }
}

async function getAllIngredients(): Promise<any[]> {
  const query = `*[_type == "ingredient"]{ _id, name, nameEn, evidenceLevel, category, sideEffects, interactions, contraindications }`;
  try {
    return (await sanityServer.fetch(query)) || [];
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    return [];
  }
}

// --- Helper Functions ---
const ALLERGY_TAGS: Record<string, string> = {
  "allergy-prone": "アレルギー体質の方は、使用前に必ず医師にご相談ください",
  "shellfish-allergy": "貝アレルギーの方は絶対に使用しないでください",
  "soy-allergy": "大豆アレルギーの方は絶対に使用しないでください",
  "nut-allergy": "ナッツアレルギーの方は絶対に使用しないでください",
};

function extractAllergyInfo(
  productIngredients: Product["ingredients"],
  allIngredients: any[],
) {
  if (!productIngredients || productIngredients.length === 0) return [];
  const allergyInfo: Array<{
    tag: string;
    label: string;
    ingredientName: string;
  }> = [];
  const seenTags = new Set<string>();

  for (const prodIngredient of productIngredients) {
    if (!prodIngredient.ingredient?._id) continue;
    const ingredientDetail = allIngredients.find(
      (ing) => ing._id === prodIngredient.ingredient!._id,
    );
    if (!ingredientDetail?.contraindications) continue;

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

// --- Main Page Component ---
interface PageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) notFound();

  const allIngredients = await getAllIngredients();

  const allergyInfo = extractAllergyInfo(product.ingredients, allIngredients);

  // Score Calculation Logic (Keep existing logic)
  const hasSanityScores = product.scores?.evidence && product.scores?.safety;
  let finalScores =
    hasSanityScores && product.scores?.evidence && product.scores?.safety
      ? {
          evidence: product.scores.evidence,
          safety: product.scores.safety,
          overall: product.scores.overall ?? 50,
        }
      : { evidence: 50, safety: 50, overall: 50 };
  let safetyDetails: IngredientSafetyDetail[] = [];
  let evidenceDetails: IngredientEvidenceDetail[] = [];
  let hasUnregisteredMainIngredient = false;

  // isPrimaryフラグを優先し、なければ配列の最初の成分を主成分とする
  const mainIngredient = getPrimaryIngredient(product.ingredients);
  const hasRegisteredMainIngredient =
    mainIngredient && mainIngredient.ingredient;
  if (!hasRegisteredMainIngredient) hasUnregisteredMainIngredient = true;

  const hasValidIngredients =
    product.ingredients &&
    product.ingredients.length > 0 &&
    product.ingredients.every((ing) => ing.ingredient);

  // 添加物安全性チェック（早期計算 - スコア減点に使用）
  const additiveCheckResult = product.allIngredients
    ? checkAdditives(product.allIngredients)
    : null;
  const additiveDeduction = additiveCheckResult
    ? calculateAdditiveScoreDeduction(additiveCheckResult)
    : 0;

  // Sanityスコアがある場合でも添加物減点を適用
  if (hasSanityScores && additiveDeduction > 0) {
    const adjustedSafety = Math.max(0, finalScores.safety - additiveDeduction);
    finalScores = {
      ...finalScores,
      safety: adjustedSafety,
      overall: Math.round((finalScores.evidence + adjustedSafety) / 2),
    };
  }

  // スコア内訳表示のため、常にsafetyDetailsを計算する
  if (hasValidIngredients && hasRegisteredMainIngredient) {
    const ingredientsWithAmount = product.ingredients!.map((ing) => ({
      ingredient: ing.ingredient!,
      amountMg: ing.amountMgPerServing,
    }));
    const safetyResult = calculateSafetyScoreByRatio(ingredientsWithAmount);
    safetyDetails = safetyResult.details;

    // evidenceDetailsも計算
    const mainIngredientData = ingredientsWithAmount.find(
      (item) => item.ingredient._id === mainIngredient!.ingredient!._id,
    )!;
    const mainEvidenceLevel =
      mainIngredientData.ingredient.evidenceLevel || "D";
    evidenceDetails = [
      {
        name: mainIngredientData.ingredient.name,
        evidenceLevel: mainEvidenceLevel as "S" | "A" | "B" | "C" | "D",
        evidenceScore: evidenceLevelToScore(mainEvidenceLevel),
        amountMg: mainIngredientData.amountMg,
        ratio: 1.0,
      },
    ];
  }

  if (!hasSanityScores && hasValidIngredients && hasRegisteredMainIngredient) {
    const ingredientsWithAmount = product.ingredients!.map((ing) => ({
      ingredient: ing.ingredient!,
      amountMg: ing.amountMgPerServing,
    }));
    const mainIngredientData = ingredientsWithAmount.find(
      (item) => item.ingredient._id === mainIngredient!.ingredient!._id,
    )!;
    const mainEvidenceLevel =
      mainIngredientData.ingredient.evidenceLevel || "D";
    const evidenceScore = evidenceLevelToScore(mainEvidenceLevel);
    const safetyResult = calculateSafetyScoreByRatio(ingredientsWithAmount);

    evidenceDetails = [
      {
        name: mainIngredientData.ingredient.name,
        evidenceLevel: mainEvidenceLevel as "S" | "A" | "B" | "C" | "D",
        evidenceScore: evidenceScore,
        amountMg: mainIngredientData.amountMg,
        ratio: 1.0,
      },
    ];
    // 添加物減点を適用した安全性スコア
    const adjustedSafetyScore = Math.max(
      0,
      safetyResult.score - additiveDeduction,
    );
    finalScores = {
      evidence: evidenceScore,
      safety: adjustedSafetyScore,
      overall: Math.round((evidenceScore + adjustedSafetyScore) / 2),
    };
    safetyDetails = safetyResult.details;
  } else if (!hasSanityScores) {
    const autoScores = calculateAutoScores(product.name, allIngredients);
    // 添加物減点を適用した安全性スコア
    const adjustedSafetyScore = Math.max(
      0,
      autoScores.safetyScore - additiveDeduction,
    );
    finalScores = {
      evidence: autoScores.evidenceScore,
      safety: adjustedSafetyScore,
      overall: Math.round((autoScores.evidenceScore + adjustedSafetyScore) / 2),
    };
    safetyDetails = autoScores.safetyDetails;
  }

  // SanityのtierRatingsをそのまま使用
  // 注意: 以前はscoresから再計算していたが、これにより
  // Sanityで正しく計算されたランクと異なる結果になっていた
  // （例: safetyRankがAなのにscoresからSに変わりS+になる問題）
  // 同期スクリプト(auto-calculate-tier-ranks.mjs)で添加物減点を含めた
  // 正確なランクが計算されているため、そのまま使用する
  const updatedTierRatings = product.tierRatings
    ? { ...product.tierRatings }
    : undefined;

  const allProducts = await getAllProducts();
  const productsForEvaluation: ProductForBadgeEvaluation[] = allProducts.map(
    (p) => {
      let evidenceScore = 50;
      let safetyScore = 50;
      if (p.scores?.evidence && p.scores?.safety) {
        evidenceScore = p.scores.evidence;
        safetyScore = p.scores.safety;
      } else {
        const hasValidIng =
          p.ingredients &&
          p.ingredients.length > 0 &&
          p.ingredients.every((ing: any) => ing.ingredient);
        if (hasValidIng) {
          const ingWithAmount = p.ingredients!.map((ing: any) => ({
            ingredient: ing.ingredient,
            amountMg: ing.amountMgPerServing,
          }));
          evidenceScore = calculateEvidenceScoreByRatio(ingWithAmount);
          safetyScore = calculateSafetyScoreByRatio(ingWithAmount).score;
        } else {
          const auto = calculateAutoScores(p.name || "", allIngredients);
          evidenceScore = auto.evidenceScore;
          safetyScore = auto.safetyScore;
        }
      }
      const calculatedEvidenceLevel =
        evidenceScore >= 90
          ? "S"
          : evidenceScore >= 80
            ? "A"
            : evidenceScore >= 70
              ? "B"
              : evidenceScore >= 60
                ? "C"
                : "D";
      const mainIng = p.ingredients?.reduce(
        (max, current) =>
          !max ||
          (current.amountMgPerServing || 0) > (max.amountMgPerServing || 0)
            ? current
            : max,
        null as (typeof p.ingredients)[0] | null,
      );
      return {
        _id: p._id,
        priceJPY: p.priceJPY,
        servingsPerContainer: p.servingsPerContainer,
        servingsPerDay: p.servingsPerDay,
        ingredientAmount: mainIng?.amountMgPerServing,
        ingredientId: mainIng?.ingredient?._id,
        evidenceLevel: calculatedEvidenceLevel,
        safetyScore,
        priceData: p.priceData,
      };
    },
  );

  const currentProductForEvaluation = productsForEvaluation.find(
    (p) => p._id === product._id,
  );
  const badges = currentProductForEvaluation
    ? evaluateBadges(currentProductForEvaluation, productsForEvaluation)
    : [];

  // 市場全体分析用: SanityのtierRatingsをそのまま使用（商品一覧ページと一致させる）
  const allProductsForTierStats = allProducts.map((p) => ({
    _id: p._id,
    tierRatings: p.tierRatings,
  }));

  const similarProducts = await getSimilarProducts(product._id, 5);
  const totalProductsInCategory = await getTotalProductsInCategory(product._id);
  const mainIngredientAmount = mainIngredient?.amountMgPerServing || 0;
  const mainIngredientInfo = mainIngredient?.ingredient;

  // additiveCheckResult は上部で計算済み（スコア減点に使用）
  const ingredientName = mainIngredientInfo?.name;
  const ingredientEvidenceLevel = mainIngredientInfo?.evidenceLevel;
  const ingredientsForCostDetail =
    product.ingredients?.map((ing) => ({
      name: ing.ingredient?.name || "不明な成分",
      amountMgPerServing: ing.amountMgPerServing,
      isPrimary: ing.isPrimary || false,
    })) || [];
  const evidenceScore = finalScores.evidence ?? 50;
  const evidenceLevel =
    evidenceScore >= 90
      ? "S"
      : evidenceScore >= 80
        ? "A"
        : evidenceScore >= 70
          ? "B"
          : evidenceScore >= 60
            ? "C"
            : "D";

  const relatedPrices = await getRelatedProductsByJan(product.janCode || null);
  const normalizedPriceData = normalizePriceData(product.priceData);
  const fallbackPriceData = generatePriceDataFromProduct(product);

  // 優先順位: 1. priceData 2. JANコード関連商品 3. affiliateUrl/urls
  const mergedPriceData =
    normalizedPriceData.length > 0
      ? normalizedPriceData
      : relatedPrices.length > 0
        ? relatedPrices
        : fallbackPriceData;
  const description =
    product.description || generateSampleDescription(product.name);
  const complianceResult = checkCompliance(description);

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
    // リッチスニペット用の実際のスコア
    scores: finalScores,
    // GTIN（JANコード）とSKU
    janCode: product.janCode || undefined,
    itemCode: product.itemCode,
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

      {/* Apple HIG Container */}
      <div
        className="min-h-screen pb-20"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* Top Navigation / Breadcrumbs */}
        <div
          className={`border-b sticky top-0 z-50 ${liquidGlassClasses.light}`}
          style={{
            borderColor: appleWebColors.borderSubtle,
          }}
        >
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <nav
              className="text-[12px] font-medium"
              style={{ color: appleWebColors.textSecondary }}
            >
              <ol className="flex items-center space-x-2">
                <li>
                  <a
                    href="/"
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: appleWebColors.blue }}
                  >
                    HOME
                  </a>
                </li>
                <li>/</li>
                <li
                  className="truncate max-w-[200px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {product.name}
                  <div className="flex gap-2 mt-1">
                    {product.ingredients &&
                      product.ingredients.slice(0, 3).map((ing, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-[11px] rounded-lg"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                            color: appleWebColors.textSecondary,
                          }}
                        >
                          {ing.ingredient?.name}
                        </span>
                      ))}
                    {product.ingredients && product.ingredients.length > 3 && (
                      <span
                        className="px-2 py-1 text-[11px] rounded-lg"
                        style={{
                          backgroundColor: appleWebColors.sectionBackground,
                          color: appleWebColors.textTertiary,
                        }}
                      >
                        +{product.ingredients.length - 3}
                      </span>
                    )}
                  </div>
                </li>
              </ol>
            </nav>
            <div className="flex items-center gap-2">
              <ShareButton title={product.name} size={18} />
              <FavoriteButton
                productId={product._id}
                productName={product.name}
                size="sm"
                iconOnly
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* System Alerts */}
          {complianceResult.hasViolations && (
            <div className="mb-6">
              <WarningBanner violations={complianceResult.violations} />
            </div>
          )}

          {/* 薬機法準拠マーク（AI検索との差別化） */}
          <div className="mb-6 flex justify-end">
            <ComplianceBadge variant="compact" />
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Product Identity (4 cols) */}
            <div className="lg:col-span-4">
              <ProductIdentitySection
                product={{
                  _id: product._id,
                  name: product.name,
                  brandName: product.brandName,
                  priceJPY: product.priceJPY,
                  servingsPerContainer: product.servingsPerContainer,
                  externalImageUrl: product.externalImageUrl,
                  images: product.images,
                  updatedAt: product._updatedAt,
                }}
                badges={badges}
                updatedTierRatings={updatedTierRatings}
                description={description}
                allProductsWithTierRatings={allProductsForTierStats}
              />
            </div>

            {/* Right Column: Data Modules (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Price Comparison Module (Direct Display) */}
              <div
                className={`p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${liquidGlassClasses.light}`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500" />
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base sm:text-lg">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    価格比較
                  </h3>
                  {product.tierRatings?.priceRank && (
                    <div
                      className={`flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border ${product.tierRatings.priceRank === "S" || product.tierRatings.priceRank === "S+" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                    >
                      <span className="text-[10px] sm:text-xs font-bold">
                        RANK
                      </span>
                      <span className="text-lg sm:text-2xl font-black leading-none">
                        {product.tierRatings.priceRank}
                      </span>
                    </div>
                  )}
                </div>
                <PriceComparison
                  priceData={mergedPriceData}
                  priceRank={product.tierRatings?.priceRank}
                />
                {/* 価格アラートボタン */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <PriceAlertButton
                    productId={product._id}
                    productName={product.name}
                    currentPrice={product.priceJPY}
                  />
                </div>
              </div>

              {/* Nutrition Performance Module - 含有量比較 */}
              <SeamlessModal layoutId="composition-modal">
                <SeamlessModalTrigger className="w-full">
                  <div
                    className={`p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden ${liquidGlassClasses.light}`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-500" />
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base sm:text-lg">
                        <Beaker className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        含有量比較
                      </h3>
                      <span className="text-[10px] sm:text-xs text-blue-600 font-bold bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        詳細を見る
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-6">
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1 font-medium">
                            1日あたりの{ingredientName || "主成分"}量
                          </p>
                          <p className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            {(
                              mainIngredientAmount * product.servingsPerDay
                            ).toLocaleString()}
                            <span className="text-xs sm:text-sm text-slate-400 font-normal ml-1">
                              mg/日
                            </span>
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-slate-200" />

                        <div className="hidden sm:block">
                          <p className="text-[10px] text-slate-400 mb-0.5">
                            1回あたり
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {mainIngredientAmount.toLocaleString()}mg ×{" "}
                            {product.servingsPerDay}回
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-slate-200" />

                        <div className="hidden sm:block">
                          <p className="text-[10px] text-slate-400 mb-0.5">
                            内容量
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {product.servingsPerContainer}回分
                          </p>
                        </div>
                      </div>

                      {product.tierRatings?.contentRank && (
                        <div
                          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border ${product.tierRatings.contentRank === "S" || product.tierRatings.contentRank === "S+" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                        >
                          <span className="text-[10px] sm:text-xs font-bold">
                            RANK
                          </span>
                          <span className="text-lg sm:text-2xl font-black leading-none">
                            {product.tierRatings.contentRank}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </SeamlessModalTrigger>
                <SeamlessModalContent>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">
                        含有量比較詳細
                      </h2>
                      {product.tierRatings?.contentRank && (
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded border ${product.tierRatings.contentRank === "S" || product.tierRatings.contentRank === "S+" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                        >
                          <span className="text-[10px] font-bold">RANK</span>
                          <span className="text-lg font-black leading-none">
                            {product.tierRatings.contentRank}
                          </span>
                        </div>
                      )}
                    </div>
                    <IngredientComparison
                      currentProduct={{
                        name: product.name,
                        slug: { current: product.slug.current },
                        imageUrl:
                          product.externalImageUrl ||
                          product.images?.[0]?.asset?.url,
                        ingredientAmount: mainIngredientAmount,
                        servingsPerDay: product.servingsPerDay,
                        priceJPY: product.priceJPY,
                        servingsPerContainer: product.servingsPerContainer,
                      }}
                      similarProducts={similarProducts}
                      contentRank={
                        product.tierRatings?.contentRank as
                          | "S"
                          | "A"
                          | "B"
                          | "C"
                          | "D"
                      }
                    />
                  </div>
                </SeamlessModalContent>
              </SeamlessModal>

              {/* Cost Efficiency Module */}
              <SeamlessModal layoutId="cost-modal">
                <SeamlessModalTrigger className="w-full">
                  <div
                    className={`p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden ${liquidGlassClasses.light}`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-orange-500" />
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base sm:text-lg">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                        コスパ分析
                      </h3>
                      <span className="text-[10px] sm:text-xs text-blue-600 font-bold bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        詳細を見る
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-6">
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1 font-medium">
                            1日あたりのコスト
                          </p>
                          <p className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            ¥
                            {(
                              product.priceJPY /
                              (product.servingsPerContainer /
                                product.servingsPerDay)
                            ).toFixed(0)}
                            <span className="text-xs sm:text-sm text-slate-400 font-normal ml-1">
                              /日
                            </span>
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-slate-200" />

                        <div className="hidden sm:block">
                          <p className="text-[10px] text-slate-400 mb-0.5">
                            1mgあたりの価格
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            ¥
                            {(
                              product.priceJPY /
                              (product.servingsPerContainer *
                                mainIngredientAmount)
                            ).toFixed(2)}
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-slate-200" />

                        <div className="hidden sm:block">
                          <p className="text-[10px] text-slate-400 mb-0.5">
                            主要成分量
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {mainIngredientAmount}mg
                          </p>
                        </div>
                      </div>

                      {product.tierRatings?.costEffectivenessRank && (
                        <div
                          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border ${product.tierRatings.costEffectivenessRank === "S" || product.tierRatings.costEffectivenessRank === "S+" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                        >
                          <span className="text-[10px] sm:text-xs font-bold">
                            RANK
                          </span>
                          <span className="text-lg sm:text-2xl font-black leading-none">
                            {product.tierRatings.costEffectivenessRank}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </SeamlessModalTrigger>
                <SeamlessModalContent>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">
                      コスパ詳細分析
                    </h2>
                    <CostEffectivenessDetail
                      currentProduct={{
                        name: product.name,
                        slug: { current: product.slug.current },
                        imageUrl:
                          product.externalImageUrl ||
                          product.images?.[0]?.asset?.url,
                        priceJPY: product.priceJPY,
                        ingredientAmount: mainIngredientAmount,
                        servingsPerContainer: product.servingsPerContainer,
                        servingsPerDay: product.servingsPerDay,
                        ingredients: ingredientsForCostDetail,
                      }}
                      similarProducts={similarProducts}
                      costEffectivenessRank={
                        product.tierRatings?.costEffectivenessRank
                      }
                      totalProductsInCategory={totalProductsInCategory}
                    />
                  </div>
                </SeamlessModalContent>
              </SeamlessModal>

              {/* Evidence Level Module (New Minimal Card) */}
              <SeamlessModal layoutId="evidence-modal">
                <SeamlessModalTrigger className="w-full">
                  <div
                    className={`p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden ${liquidGlassClasses.light}`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-cyan-500" />
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                        <FileText className="w-6 h-6 text-blue-500" />
                        エビデンス分析
                      </h3>
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        詳細を見る
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        科学的根拠の信頼性評価
                      </div>
                      <div className="flex items-center gap-3">
                        {updatedTierRatings?.evidenceRank && (
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded border ${updatedTierRatings.evidenceRank === "S" || updatedTierRatings.evidenceRank === "S+" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                          >
                            <span className="text-[10px] font-bold">RANK</span>
                            <span className="text-lg font-black leading-none">
                              {updatedTierRatings.evidenceRank}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            スコア
                          </span>
                          <span className="text-2xl font-bold text-slate-900">
                            {Math.round(evidenceScore)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SeamlessModalTrigger>
                <SeamlessModalContent>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">
                      エビデンス詳細
                    </h2>
                    <EvidenceSafetyDetail
                      evidenceScore={evidenceScore}
                      evidenceLevel={
                        evidenceLevel as "S" | "A" | "B" | "C" | "D"
                      }
                      evidenceDetails={evidenceDetails}
                      safetyDetails={[]} // Only show evidence here
                      visibleSection="evidence"
                    />
                  </div>
                </SeamlessModalContent>
              </SeamlessModal>

              {/* Safety Level Module (New Minimal Card) */}
              <SeamlessModal layoutId="safety-modal">
                <SeamlessModalTrigger className="w-full">
                  <div
                    className={`p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden ${liquidGlassClasses.light}`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-500" />
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                        安全性分析
                      </h3>
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        詳細を見る
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">
                          添加物・副作用リスク評価
                        </span>
                        {/* 添加物安全性バッジ */}
                        {additiveCheckResult && (
                          <AdditivesSafetyBadge result={additiveCheckResult} />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {updatedTierRatings?.safetyRank && (
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded border ${updatedTierRatings.safetyRank === "S" || updatedTierRatings.safetyRank === "S+" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                          >
                            <span className="text-[10px] font-bold">RANK</span>
                            <span className="text-lg font-black leading-none">
                              {updatedTierRatings.safetyRank}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            スコア
                          </span>
                          <span className="text-2xl font-bold text-slate-900">
                            {Math.round(finalScores.safety)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SeamlessModalTrigger>
                <SeamlessModalContent>
                  <div className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      安全性詳細
                    </h2>

                    {/* 添加物安全性カード */}
                    {additiveCheckResult && (
                      <AdditivesSafetyCard
                        result={additiveCheckResult}
                        allIngredients={product.allIngredients}
                      />
                    )}

                    {/* 成分の安全性詳細 */}
                    <EvidenceSafetyDetail
                      safetyScore={finalScores.safety}
                      evidenceDetails={[]} // Only show safety here
                      safetyDetails={safetyDetails}
                      additiveDeduction={additiveDeduction}
                      visibleSection="safety"
                    />
                  </div>
                </SeamlessModalContent>
              </SeamlessModal>

              {/* RDA充足率モジュール */}
              <SeamlessModal layoutId="nutrition-modal">
                <SeamlessModalTrigger className="w-full">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        RDA充足率
                      </h3>
                      <span className="text-xs text-blue-600 font-bold bg-white/80 px-2 py-1 rounded-full group-hover:bg-white transition-colors">
                        詳細を見る
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      1日の推奨摂取量に対する充足率
                    </p>
                    <div className="space-y-2">
                      {product.ingredients?.slice(0, 3).map((ing, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            {ing.ingredient?.name}
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {ing.amountMgPerServing *
                              (product.servingsPerDay || 1)}
                            mg/日
                          </span>
                        </div>
                      ))}
                      {(product.ingredients?.length || 0) > 3 && (
                        <div className="text-xs text-slate-400 text-center pt-2">
                          他 {product.ingredients!.length - 3} 成分
                        </div>
                      )}
                    </div>
                  </div>
                </SeamlessModalTrigger>
                <SeamlessModalContent>
                  <RdaFulfillmentModal
                    ingredients={
                      product.ingredients?.map((i) => ({
                        name: i.ingredient?.name || "",
                        amount:
                          i.amountMgPerServing * (product.servingsPerDay || 1),
                      })) || []
                    }
                    productName={product.name}
                    servingsPerDay={product.servingsPerDay || 1}
                  />
                </SeamlessModalContent>
              </SeamlessModal>

              {/* Related Ingredients (Moved to Bottom) */}
              <div className="mt-8">
                <RelatedIngredients ingredients={product.ingredients || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "商品が見つかりません" };
  const relatedPrices = await getRelatedProductsByJan(product.janCode || null);
  const normalizedPriceData = normalizePriceData(product.priceData);
  const fallbackPriceData = generatePriceDataFromProduct(product);
  const mergedPriceData =
    normalizedPriceData.length > 0
      ? normalizedPriceData
      : relatedPrices.length > 0
        ? relatedPrices
        : fallbackPriceData;
  // 商品画像を取得（externalImageUrlを優先）
  const productImages = [
    product.externalImageUrl,
    ...(product.images?.map((img) => img.asset?.url) || []),
  ].filter(Boolean) as string[];

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
    images: productImages,
    mainIngredient: product.ingredients?.[0]?.ingredient?.name,
    ingredientAmount: product.ingredients?.[0]?.amountMgPerServing,
  });
}
