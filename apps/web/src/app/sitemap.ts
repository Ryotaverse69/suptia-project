import { MetadataRoute } from "next";
import { sanity } from "@/lib/sanity.client";
import { getSiteUrl } from "@/lib/runtimeConfig";

/**
 * 動的XMLサイトマップ生成
 *
 * このファイルは /sitemap.xml エンドポイントを自動生成します
 * 商品と成分の最新データをSanityから取得して含めます
 */

interface ProductSlug {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

interface IngredientSlug {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Sanityから商品と成分のslugを取得
  const [productsRaw, ingredientsRaw] = await Promise.all([
    sanity.fetch<ProductSlug[]>(`
      *[_type == "product" && defined(slug.current) && slug.current != ""]{
        slug,
        _updatedAt
      }
    `),
    sanity.fetch<IngredientSlug[]>(`
      *[_type == "ingredient" && defined(slug.current) && slug.current != ""]{
        slug,
        _updatedAt
      }
    `),
  ]);

  // 重複を除外（slugをキーにして最新のものを残す）
  const products = Array.from(
    new Map(productsRaw.map((p) => [p.slug.current, p])).values(),
  );

  const ingredients = Array.from(
    new Map(ingredientsRaw.map((i) => [i.slug.current, i])).values(),
  );

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ingredients`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/diagnosis`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/how-to-use`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/affiliate`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/disclosure`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 商品ページ（動的）
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug.current}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 成分ページ（動的）
  const ingredientPages: MetadataRoute.Sitemap = ingredients.map(
    (ingredient) => ({
      url: `${siteUrl}/ingredients/${ingredient.slug.current}`,
      lastModified: new Date(ingredient._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [...staticPages, ...productPages, ...ingredientPages];
}
