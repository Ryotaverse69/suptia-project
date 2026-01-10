// SNS自動投稿用 Sanityクライアント
import { createClient } from '@sanity/client';
import type {
  IngredientData,
  ProductData,
  VersusData,
  RankingData,
  CautionData,
  ThemeContent,
} from './types';
import type { ThemeType } from './themes';

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

// --- 曜日別テーマ用データ取得 ---

// 成分比較用: 2つの成分をランダム取得
export async function getVersusIngredients(): Promise<VersusData | null> {
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

  if (!ingredients || ingredients.length < 2) {
    return null;
  }

  // ランダムに2件選択（重複なし）
  const shuffled = ingredients.sort(() => Math.random() - 0.5);
  return {
    ingredient1: shuffled[0],
    ingredient2: shuffled[1],
  };
}

// コスパ最強商品を取得
export async function getCospaProduct(): Promise<ProductData | null> {
  const query = `*[_type == "product" && defined(name) && count(prices) > 0] | order(_createdAt desc) [0...50] {
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

  // 価格が最も安い商品を選択
  const sorted = products.sort((a, b) => {
    const minA = a.prices?.reduce((min, p) => Math.min(min, p.amount), Infinity) || Infinity;
    const minB = b.prices?.reduce((min, p) => Math.min(min, p.amount), Infinity) || Infinity;
    return minA - minB;
  });

  // 上位10件からランダム選択
  const topProducts = sorted.slice(0, 10);
  return topProducts[Math.floor(Math.random() * topProducts.length)];
}

// ランキング用: カテゴリのTOP3商品
export async function getRankingProducts(): Promise<RankingData | null> {
  const categories = ['ビタミン', 'ミネラル', 'プロテイン', 'オメガ3', 'プロバイオティクス'];
  const category = categories[Math.floor(Math.random() * categories.length)];

  const query = `*[_type == "product" && defined(name) && name match "*${category}*"] | order(_createdAt desc) [0...10] {
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

  if (!products || products.length < 3) {
    // フォールバック: 全商品から取得
    const fallbackQuery = `*[_type == "product" && defined(name)] | order(_createdAt desc) [0...10] {
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
    const fallbackProducts = await client.fetch<ProductData[]>(fallbackQuery);

    if (!fallbackProducts || fallbackProducts.length < 3) {
      return null;
    }

    return {
      category: '注目サプリ',
      products: fallbackProducts.slice(0, 3),
    };
  }

  return {
    category,
    products: products.slice(0, 3),
  };
}

// 注意喚起用: 副作用・相互作用情報
export async function getCautionData(): Promise<CautionData | null> {
  const query = `*[_type == "ingredient" && defined(name) && (defined(sideEffects) || defined(interactions))] | order(_createdAt desc) {
    _id,
    name,
    nameEn,
    description,
    benefits,
    recommendedDosage,
    evidenceLevel,
    sideEffects,
    interactions,
    "slug": slug
  }`;

  const ingredients = await client.fetch<(IngredientData & { sideEffects?: string[]; interactions?: string[] })[]>(query);

  if (!ingredients || ingredients.length === 0) {
    // フォールバック: 一般的な注意事項
    const fallback = await getRandomIngredient();
    if (fallback) {
      return {
        ingredient: fallback,
        cautions: ['過剰摂取に注意', '妊娠中・授乳中の方は医師に相談'],
        interactions: ['他のサプリメントとの併用は注意が必要な場合があります'],
      };
    }
    return null;
  }

  const selected = ingredients[Math.floor(Math.random() * ingredients.length)];
  return {
    ingredient: selected,
    cautions: selected.sideEffects || ['過剰摂取に注意'],
    interactions: selected.interactions || [],
  };
}

// テーマに応じたコンテンツを取得
export async function getContentByTheme(themeType: ThemeType): Promise<ThemeContent | null> {
  switch (themeType) {
    case 'ingredient':
      const ingredient = await getRandomIngredient();
      return ingredient ? { type: 'ingredient', data: ingredient } : null;

    case 'product':
      const product = await getRandomProduct();
      return product ? { type: 'product', data: product } : null;

    case 'cospa':
      const cospaProduct = await getCospaProduct();
      return cospaProduct ? { type: 'cospa', data: cospaProduct } : null;

    case 'versus':
      const versus = await getVersusIngredients();
      return versus ? { type: 'versus', data: versus } : null;

    case 'ranking':
      const ranking = await getRankingProducts();
      return ranking ? { type: 'ranking', data: ranking } : null;

    case 'caution':
      const caution = await getCautionData();
      return caution ? { type: 'caution', data: caution } : null;

    default: {
      // フォールバック: 成分を取得
      const fallbackIngredient = await getRandomIngredient();
      return fallbackIngredient ? { type: 'ingredient' as const, data: fallbackIngredient } : null;
    }
  }
}
