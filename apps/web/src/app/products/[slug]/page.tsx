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
import { FavoriteButton } from "@/components/FavoriteButton";
import { TierBadgeGrid, PerfectProductBanner } from "@/components/ui/TierBadge";
import { TierRatings, isPerfectProduct } from "@/lib/tier-ranking";
import { TierRank } from "@/lib/tier-colors";
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
  tierRatings?: {
    priceRank: string;
    costEffectivenessRank: string;
    contentRank: string;
    evidenceRank: string;
    safetyRank: string;
    overallRank?: string;
  };
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
    references,
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
    const product = await sanityServer.fetch(query, { slug });
    return product || null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

/**
 * priceDataを配列に正規化
 * オブジェクト形式（キー "0", "1", ... にデータがある形式）を配列に変換
 */
function normalizePriceData(priceData: any): PriceData[] {
  if (!priceData) return [];

  // 既に配列の場合
  if (Array.isArray(priceData)) {
    return priceData.filter((p) => p.amount && p.url && p.source);
  }

  // オブジェクトの場合、キー "0" のデータを配列に変換
  if (typeof priceData === "object") {
    // キー "0" が存在し、有効なデータを持っているか確認
    if (priceData["0"] && priceData["0"].amount && priceData["0"].url) {
      return [priceData["0"]];
    }

    // 他の数値キー（"1", "2", ...）も処理
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
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    scores,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        _id,
        name,
        evidenceLevel
      }
    },
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
      'ingredientAmount': coalesce(
        ingredients[ingredient._ref == $mainIngredientId][0].amountMgPerServing,
        ingredients[0].amountMgPerServing,
        1000
      ),
      servingsPerDay,
      priceJPY,
      servingsPerContainer
    }[0...${limit}]`;

    const products = await sanityServer.fetch(similarProductsQuery, {
      productId,
      mainIngredientId,
    });

    // デフォルト値を持つ商品をフィルタリング（成分量が実際に設定されている商品のみ）
    const validProducts = products.filter(
      (p: any) => p.ingredientAmount && p.ingredientAmount > 0,
    );

    return validProducts || [];
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
  "allergy-prone": "アレルギー体質の方は、使用前に必ず医師にご相談ください",
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
  let hasUnregisteredMainIngredient = false;

  // 主要成分を特定（最も配合量が多い成分）
  const mainIngredient = product.ingredients?.reduce(
    (max, current) => {
      if (
        !max ||
        (current.amountMgPerServing || 0) > (max.amountMgPerServing || 0)
      ) {
        return current;
      }
      return max;
    },
    null as (typeof product.ingredients)[0] | null,
  );

  // 主要成分が登録されているかチェック
  const hasRegisteredMainIngredient =
    mainIngredient && mainIngredient.ingredient;

  if (!hasRegisteredMainIngredient) {
    // 主要成分が未登録の場合
    hasUnregisteredMainIngredient = true;
  }

  // 商品に成分データがあり、全ての成分にingredient情報がある場合
  const hasValidIngredients =
    product.ingredients &&
    product.ingredients.length > 0 &&
    product.ingredients.every(
      (ing) => ing.ingredient && ing.amountMgPerServing > 0,
    );

  if (hasValidIngredients && hasRegisteredMainIngredient) {
    // 配合率ベースのスコア計算
    const ingredientsWithAmount = product.ingredients!.map((ing) => ({
      ingredient: ing.ingredient!,
      amountMg: ing.amountMgPerServing,
    }));

    // エビデンススコアは主要成分のみで判定
    const mainIngredientData = ingredientsWithAmount.find(
      (item) => item.ingredient._id === mainIngredient!.ingredient!._id,
    )!;
    const mainEvidenceLevel =
      mainIngredientData.ingredient.evidenceLevel || "D";
    const evidenceScore = evidenceLevelToScore(mainEvidenceLevel);

    // 安全性は全成分を見て判定（現状維持）
    const safetyResult = calculateSafetyScoreByRatio(ingredientsWithAmount);

    // エビデンス詳細を生成（主要成分のみ）
    evidenceDetails = [
      {
        name: mainIngredientData.ingredient.name,
        evidenceLevel: mainEvidenceLevel as "S" | "A" | "B" | "C" | "D",
        evidenceScore: evidenceScore,
        amountMg: mainIngredientData.amountMg,
        ratio: 1.0, // 主要成分のみを表示するため100%
      },
    ];

    finalScores = {
      evidence: evidenceScore,
      safety: safetyResult.score,
      overall: Math.round((evidenceScore + safetyResult.score) / 2),
    };
    safetyDetails = safetyResult.details;

    console.log(`[主要成分ベーススコア計算] ${product.name}:`, {
      全成分数: ingredientsWithAmount.length,
      主要成分: mainIngredientData.ingredient.name,
      主要成分配合量: mainIngredientData.amountMg,
      主要成分エビデンスレベル: mainEvidenceLevel,
      evidenceScore,
      safetyScore: safetyResult.score,
      overall: finalScores.overall,
    });
    console.log(
      `[エビデンス詳細（主要成分のみ）] evidenceDetails:`,
      evidenceDetails,
    );
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

  // リアルタイム計算したスコアでtierRatingsを上書き
  function scoreToTierRank(score: number): TierRank {
    if (score >= 90) return "S";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  }

  // リアルタイム計算結果でtierRatingsを更新
  const updatedTierRatings = product.tierRatings
    ? {
        ...product.tierRatings,
        // バッジベースのランクはデフォルトD、バッジ獲得時のみSに上書き
        priceRank: "D" as TierRank,
        costEffectivenessRank: "D" as TierRank,
        contentRank: "D" as TierRank,
        // スコアベースのランクはリアルタイム計算結果を使用（undefinedの場合は50をデフォルト）
        evidenceRank: scoreToTierRank(finalScores.evidence ?? 50),
        safetyRank: scoreToTierRank(finalScores.safety ?? 50),
        overallRank: scoreToTierRank(finalScores.overall ?? 50),
      }
    : undefined;

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

      console.log(
        `[スコア→レベル変換] ${p.name}: evidenceScore=${evidenceScore}, safetyScore=${safetyScore}`,
      );

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

      console.log(
        `[レベル決定] ${p.name}: evidenceLevel=${calculatedEvidenceLevel}`,
      );

      // 配合量が最も多い成分を主要成分とする
      const mainIngredient = p.ingredients?.reduce(
        (max, current) => {
          if (
            !max ||
            (current.amountMgPerServing || 0) > (max.amountMgPerServing || 0)
          ) {
            return current;
          }
          return max;
        },
        null as (typeof p.ingredients)[0] | null,
      );

      return {
        _id: p._id,
        priceJPY: p.priceJPY,
        servingsPerContainer: p.servingsPerContainer,
        servingsPerDay: p.servingsPerDay,
        ingredientAmount: mainIngredient?.amountMgPerServing,
        ingredientId: mainIngredient?.ingredient?._id,
        evidenceLevel: calculatedEvidenceLevel,
        safetyScore,
        priceData: p.priceData,
      };
    },
  );

  // 現在の商品の称号を計算
  console.log(`[ID検索] 現在の商品ID: ${product._id}, 商品名: ${product.name}`);
  console.log(
    `[ID検索] productsForEvaluationの件数: ${productsForEvaluation.length}`,
  );

  const currentProductForEvaluation = productsForEvaluation.find(
    (p) => p._id === product._id,
  );

  if (!currentProductForEvaluation) {
    console.log(`[ID検索エラー] 商品が見つかりません: ${product._id}`);
    console.log(
      `[ID検索エラー] 利用可能なID一覧:`,
      productsForEvaluation.slice(0, 5).map((p) => p._id),
    );
  } else {
    console.log(
      `[ID検索成功] 商品が見つかりました: ${currentProductForEvaluation._id}`,
    );
  }

  console.log(`[バッジ計算] ${product.name}:`, {
    evidenceLevel: currentProductForEvaluation?.evidenceLevel,
    safetyScore: currentProductForEvaluation?.safetyScore,
    priceJPY: currentProductForEvaluation?.priceJPY,
    ingredientAmount: currentProductForEvaluation?.ingredientAmount,
  });

  const badges = currentProductForEvaluation
    ? evaluateBadges(currentProductForEvaluation, productsForEvaluation)
    : [];

  console.log(`[バッジ結果] ${product.name}:`, badges);
  console.log(
    `[更新前tierRatings] ${product.name}:`,
    JSON.stringify(updatedTierRatings, null, 2),
  );

  // 称号に基づいてランクを"S"に格上げ
  if (updatedTierRatings) {
    badges.forEach((badgeType) => {
      console.log(`[バッジタイプ処理] ${badgeType}`);
      if (badgeType === "lowest-price") {
        updatedTierRatings.priceRank = "S";
        console.log(`  → priceRank を S に更新`);
      } else if (badgeType === "best-value") {
        updatedTierRatings.costEffectivenessRank = "S";
        console.log(`  → costEffectivenessRank を S に更新`);
      } else if (badgeType === "highest-content") {
        updatedTierRatings.contentRank = "S";
        console.log(`  → contentRank を S に更新`);
      } else if (badgeType === "evidence-s") {
        updatedTierRatings.evidenceRank = "S";
        console.log(`  → evidenceRank を S に更新`);
      } else if (badgeType === "high-safety") {
        updatedTierRatings.safetyRank = "S";
        console.log(`  → safetyRank を S に更新`);
      }
    });

    console.log(
      `[更新後tierRatings] ${product.name}:`,
      JSON.stringify(updatedTierRatings, null, 2),
    );

    // 5冠達成（すべてSランク）の場合は総合評価をS+に格上げ
    if (isPerfectProduct(updatedTierRatings)) {
      updatedTierRatings.overallRank = "S+" as TierRank;
      console.log(`[5冠達成] overallRank を S+ に格上げ`);
    }
  }

  // 類似商品を取得
  const similarProducts = await getSimilarProducts(product._id, 5);

  // 主要成分データを準備（line 490で定義済み）
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

  // 既存のpriceDataを正規化
  const normalizedPriceData = normalizePriceData(product.priceData);

  // 既存のpriceDataとマージ（既存データを優先）
  const mergedPriceData =
    normalizedPriceData.length > 0 ? normalizedPriceData : relatedPrices;

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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">{product.brandName}</p>
            </div>

            {/* お気に入りボタン */}
            <div className="flex-shrink-0">
              <FavoriteButton
                productId={product._id}
                productName={product.name}
                size="lg"
              />
            </div>
          </div>

          {/* Badge Summary */}
          <BadgeSummary badges={badges} />
        </div>

        {/* Product Image */}
        <div className="mb-8 flex justify-center">
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

        {/* Tier Rankings - 総合評価 */}
        {updatedTierRatings && (
          <div
            className="relative overflow-hidden rounded-2xl shadow-xl border border-purple-100 p-6 mb-8
            bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-blue-500/5 before:-z-10"
          >
            <TierBadgeGrid
              ratings={updatedTierRatings as unknown as TierRatings}
            />
          </div>
        )}

        {/* 1. Product Description - 商品の詳細 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">商品説明</h2>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* 2. Price Comparison - 最安値比較 */}
        <PriceComparison
          priceData={mergedPriceData}
          priceRank={
            updatedTierRatings?.priceRank as "S" | "A" | "B" | "C" | "D"
          }
          className="mb-8"
        />

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
            costEffectivenessRank={
              updatedTierRatings?.costEffectivenessRank as
                | "S"
                | "A"
                | "B"
                | "C"
                | "D"
            }
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
            contentRank={
              updatedTierRatings?.contentRank as "S" | "A" | "B" | "C" | "D"
            }
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
          referenceCount={product.references?.length || 0}
          evidenceRank={
            product.tierRatings?.evidenceRank as
              | "S"
              | "A"
              | "B"
              | "C"
              | "D"
              | undefined
          }
          safetyRank={
            product.tierRatings?.safetyRank as
              | "S"
              | "A"
              | "B"
              | "C"
              | "D"
              | undefined
          }
          ingredientName={ingredientName}
          ingredientEvidenceLevel={ingredientEvidenceLevel}
          safetyDetails={safetyDetails}
          evidenceDetails={evidenceDetails}
          allIngredients={product.allIngredients}
          allergyInfo={allergyInfo}
          hasUnregisteredMainIngredient={hasUnregisteredMainIngredient}
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

  // 既存のpriceDataを正規化
  const normalizedPriceData = normalizePriceData(product.priceData);

  // 既存のpriceDataとマージ（既存データを優先）
  const mergedPriceData =
    normalizedPriceData.length > 0 ? normalizedPriceData : relatedPrices;

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
