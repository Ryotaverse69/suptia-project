/**
 * CJ Affiliate API統合
 *
 * iHerbなどのECサイトの商品データとアフィリエイトリンクを取得
 *
 * ドキュメント: https://developers.cj.com/
 */

interface CJProduct {
  "ad-id": string;
  "advertiser-id": string;
  "advertiser-name": string;
  "catalog-id": string;
  name: string;
  price: string;
  currency: string;
  "image-url": string;
  "buy-url": string;
  "in-stock": string;
  description: string;
  manufacturer: string;
  isbn: string;
  upc: string;
}

interface CJProductResponse {
  products: {
    product: CJProduct[];
  };
}

interface CJDeepLinkRequest {
  "destination-url": string;
  "website-id": string;
}

interface CJDeepLinkResponse {
  data: {
    "click-url": string;
  };
}

const CJ_API_BASE = "https://product-search.api.cj.com";
const CJ_LINK_API_BASE = "https://link-search.api.cj.com";

/**
 * CJ Affiliate Product Search API
 * 商品データを検索・取得
 */
export async function searchCJProducts(params: {
  advertiserIds: string; // 例: "1234567" (iHerbの広告主ID)
  keywords?: string;
  category?: string;
  recordsPerPage?: number;
  pageNumber?: number;
}): Promise<CJProduct[]> {
  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    throw new Error("CJ_API_KEY is not set in environment variables");
  }

  const queryParams = new URLSearchParams({
    "advertiser-ids": params.advertiserIds,
    "records-per-page": (params.recordsPerPage || 100).toString(),
    "page-number": (params.pageNumber || 1).toString(),
  });

  if (params.keywords) {
    queryParams.set("keywords", params.keywords);
  }

  const url = `${CJ_API_BASE}/v2/product-search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `CJ API Error: ${response.status} ${response.statusText}`,
      );
    }

    const data: CJProductResponse = await response.json();
    return data.products?.product || [];
  } catch (error) {
    console.error("Failed to fetch CJ products:", error);
    throw error;
  }
}

/**
 * CJ Deep Link API
 * 通常のURLをアフィリエイトリンクに変換
 */
export async function createCJDeepLink(
  destinationUrl: string,
  websiteId: string,
): Promise<string> {
  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    throw new Error("CJ_API_KEY is not set in environment variables");
  }

  const url = `${CJ_LINK_API_BASE}/v3/link-search`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "destination-url": destinationUrl,
        "website-id": websiteId,
      } as CJDeepLinkRequest),
    });

    if (!response.ok) {
      throw new Error(`CJ Deep Link API Error: ${response.status}`);
    }

    const data: CJDeepLinkResponse = await response.json();
    return data.data["click-url"];
  } catch (error) {
    console.error("Failed to create CJ deep link:", error);
    throw error;
  }
}

/**
 * iHerb商品を検索（CJ経由）
 */
export async function searchIHerbProducts(keyword: string, limit = 50) {
  const IHERB_ADVERTISER_ID = process.env.CJ_IHERB_ADVERTISER_ID || "1234567";

  return searchCJProducts({
    advertiserIds: IHERB_ADVERTISER_ID,
    keywords: keyword,
    recordsPerPage: limit,
  });
}

/**
 * CJ商品データをSuptia Product形式に変換
 */
export function convertCJProductToSuptiaFormat(cjProduct: CJProduct) {
  return {
    externalId: cjProduct["ad-id"],
    title: cjProduct.name,
    brand: cjProduct.manufacturer || cjProduct["advertiser-name"],
    price: {
      amount: parseFloat(cjProduct.price),
      currency: cjProduct.currency,
      source: "iherb",
      affiliateUrl: cjProduct["buy-url"],
      inStock: cjProduct["in-stock"] === "yes",
    },
    imageUrl: cjProduct["image-url"],
    description: cjProduct.description,
    identifiers: {
      upc: cjProduct.upc,
      isbn: cjProduct.isbn,
    },
  };
}
