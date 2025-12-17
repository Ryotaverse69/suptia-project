/**
 * OGP画像管理ユーティリティ
 *
 * 画像はAI生成時にテキスト（タイトル・サブタイトル）を含めて生成されます。
 * Cloudinaryは画像ホスティングと最適化のみに使用。
 */

// CloudinaryのOGP画像ベースURL
const CLOUDINARY_BASE = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  : "";

// OGP画像のパス構造
export const OG_IMAGE_PATHS = {
  ingredients: "suptia-og/ingredients",
  articles: "suptia-og/articles",
  tools: "suptia-og/tools",
} as const;

// デフォルトOGP画像
export const DEFAULT_OG_IMAGE = "/og-image.png";

/**
 * 成分ページのOGP画像URLを取得
 * タイトルはAI生成時に画像内に含まれています
 */
export function getIngredientOGImage(slug: string): string {
  if (!CLOUDINARY_BASE) return DEFAULT_OG_IMAGE;
  return `${CLOUDINARY_BASE}/f_auto,q_90,w_1200,h_630,c_fill/${OG_IMAGE_PATHS.ingredients}/${slug}`;
}

/**
 * 記事ページのOGP画像URLを取得
 * タイトルはAI生成時に画像内に含まれています
 */
export function getArticleOGImage(slug: string): string {
  if (!CLOUDINARY_BASE) return DEFAULT_OG_IMAGE;
  return `${CLOUDINARY_BASE}/f_auto,q_90,w_1200,h_630,c_fill/${OG_IMAGE_PATHS.articles}/${slug}`;
}

/**
 * ツールページのOGP画像URLを取得
 * タイトルはAI生成時に画像内に含まれています
 */
export function getToolOGImage(slug: string): string {
  if (!CLOUDINARY_BASE) return DEFAULT_OG_IMAGE;
  return `${CLOUDINARY_BASE}/f_auto,q_90,w_1200,h_630,c_fill/${OG_IMAGE_PATHS.tools}/${slug}`;
}

/**
 * OGP画像が存在するかチェック（クライアントサイド）
 */
export async function checkOGImageExists(url: string): Promise<boolean> {
  if (url === DEFAULT_OG_IMAGE) return true;

  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * OGP画像のメタデータを生成
 */
export function generateOGImageMeta(
  url: string,
  alt: string,
): {
  url: string;
  width: number;
  height: number;
  alt: string;
} {
  return {
    url,
    width: 1200,
    height: 630,
    alt,
  };
}

/**
 * アイキャッチ画像として使用する場合のURL（正方形クロップ）
 */
export function getEyecatchImage(ogUrl: string): string {
  if (!CLOUDINARY_BASE || ogUrl === DEFAULT_OG_IMAGE) return ogUrl;

  // Cloudinary URLの場合、正方形にクロップ
  if (ogUrl.includes("cloudinary.com")) {
    return ogUrl.replace(/w_\d+,h_\d+,c_fill/, "w_800,h_800,c_fill,g_center");
  }

  return ogUrl;
}

/**
 * OGP画像生成APIを呼び出す
 */
export async function generateOGImage(
  token: string,
  params: {
    type: "ingredient" | "article" | "tool";
    slug: string;
    name: string;
    nameEn?: string;
    category?: string;
    description?: string;
    style?:
      | "flat-minimal"
      | "modern-health"
      | "gradient-vibrant"
      | "organic-botanical";
  },
): Promise<{
  success: boolean;
  ogImage?: {
    url: string;
    publicId: string;
  };
  error?: string;
}> {
  try {
    const response = await fetch("/api/og/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
