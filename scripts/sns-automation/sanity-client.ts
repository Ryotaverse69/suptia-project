// SNS自動投稿用 Sanityクライアント
import { createClient } from '@sanity/client';
import type { IngredientData, ProductData } from './types';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-07-01',
  useCdn: false, // 最新データを取得
  token: process.env.SANITY_API_TOKEN,
});

// ランダムな成分を1件取得
export async function getRandomIngredient(): Promise<IngredientData | null> {
  const query = `*[_type == "ingredient" && defined(name) && defined(benefits)] | order(_createdAt desc) {
    _id,
    name,
    nameEn,
    description,
    benefits,
    recommendedDosage,
    evidenceLevel,
    "slug": slug
  }`;

  const ingredients = await client.fetch<IngredientData[]>(query);

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  // ランダムに1件選択
  const randomIndex = Math.floor(Math.random() * ingredients.length);
  return ingredients[randomIndex];
}

// ランダムな商品を1件取得
export async function getRandomProduct(): Promise<ProductData | null> {
  const query = `*[_type == "product" && defined(name)] | order(_createdAt desc) [0...100] {
    _id,
    name,
    "brand": brand->{name},
    "ingredients": ingredients[]{
      "ingredient": ingredient->{name},
      amountMgPerServing
    },
    prices,
    "slug": slug
  }`;

  const products = await client.fetch<ProductData[]>(query);

  if (!products || products.length === 0) {
    return null;
  }

  // ランダムに1件選択
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

// 成分または商品をランダムに取得
export async function getRandomContent(): Promise<{ type: 'ingredient' | 'product'; data: IngredientData | ProductData } | null> {
  // 50%の確率で成分または商品を選択
  const isIngredient = Math.random() < 0.5;

  if (isIngredient) {
    const ingredient = await getRandomIngredient();
    if (ingredient) {
      return { type: 'ingredient', data: ingredient };
    }
  }

  const product = await getRandomProduct();
  if (product) {
    return { type: 'product', data: product };
  }

  // フォールバック: 成分を取得
  const ingredient = await getRandomIngredient();
  if (ingredient) {
    return { type: 'ingredient', data: ingredient };
  }

  return null;
}
