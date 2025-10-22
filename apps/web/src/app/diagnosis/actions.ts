"use server";

import { sanityServer } from "@/lib/sanityServer";
import type {
  ProductForDiagnosis,
  IngredientForDiagnosis,
  EvidenceLevel,
} from "@/lib/recommendation-engine";
import type { ContraindicationTag } from "@/lib/safety-checker";

/**
 * Sanityから商品データを取得し、診断エンジン用の形式に変換
 */
export async function fetchProductsForDiagnosis(): Promise<
  ProductForDiagnosis[]
> {
  // GROQ query: 商品と関連する成分を取得
  const query = `*[_type == "product" && availability == "in-stock"] {
    _id,
    name,
    "brand": brand->name,
    priceJPY,
    servingsPerDay,
    servingsPerContainer,
    "ingredients": ingredients[] {
      "ingredient": ingredient-> {
        name,
        "slug": slug.current,
        category,
        evidenceLevel,
        relatedGoals,
        contraindications
      },
      amountMgPerServing
    }
  }`;

  try {
    const products = await sanityServer.fetch(query);

    // Sanityのデータを ProductForDiagnosis 型に変換
    return products.map((product: any) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      priceJPY: product.priceJPY,
      servingsPerDay: product.servingsPerDay,
      servingsPerContainer: product.servingsPerContainer,
      ingredients: product.ingredients.map((ing: any) => ({
        name: ing.ingredient.name,
        slug: ing.ingredient.slug,
        category: ing.ingredient.category,
        evidenceLevel: mapEvidenceLevel(ing.ingredient.evidenceLevel),
        relatedGoals: ing.ingredient.relatedGoals || [],
        contraindications: (ing.ingredient.contraindications ||
          []) as ContraindicationTag[],
        amountMgPerServing: ing.amountMgPerServing,
      })) as IngredientForDiagnosis[],
    }));
  } catch (error) {
    console.error("Error fetching products from Sanity:", error);
    // エラー時は空配列を返す（フォールバック）
    return [];
  }
}

/**
 * Sanityのエビデンスレベル（日本語）を英語形式に変換
 */
function mapEvidenceLevel(level: string | undefined): EvidenceLevel {
  switch (level) {
    case "高":
      return "A";
    case "中":
      return "B";
    case "低":
      return "C";
    default:
      return "C"; // デフォルトは低
  }
}
