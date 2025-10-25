/**
 * Rakuten Advertising API統合（旧LinkShare）
 *
 * iHerbを含む多数のECサイトと提携
 *
 * ドキュメント: https://rakutenadvertising.com/en-uk/publishers/tools/
 */

interface RakutenProduct {
  mid: string; // Merchant ID
  productname: string;
  price: string;
  retailprice: string;
  currency: string;
  linkurl: string;
  imageurl: string;
  description: string;
  brand: string;
  category: string;
  upc: string;
  isbn: string;
  sku: string;
}

interface RakutenProductFeedResponse {
  result: {
    item: RakutenProduct[];
  };
}

const RAKUTEN_API_BASE = "https://api.rakutenadvertising.com";

/**
 * Rakuten Product Search API
 * 商品データを検索
 */
export async function searchRakutenProducts(params: {
  mid: string; // Merchant ID (iHerbのID)
  keyword?: string;
  category?: number;
  max?: number;
  pagenumber?: number;
}): Promise<RakutenProduct[]> {
  const token = process.env.RAKUTEN_ADVERTISING_TOKEN;

  if (!token) {
    throw new Error("RAKUTEN_ADVERTISING_TOKEN is not set");
  }

  const queryParams = new URLSearchParams({
    mid: params.mid,
    max: (params.max || 100).toString(),
    pagenumber: (params.pagenumber || 1).toString(),
  });

  if (params.keyword) {
    queryParams.set("keyword", params.keyword);
  }

  if (params.category) {
    queryParams.set("category", params.category.toString());
  }

  const url = `${RAKUTEN_API_BASE}/productsearch/1.0?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Rakuten API Error: ${response.status}`);
    }

    const data: RakutenProductFeedResponse = await response.json();
    return data.result?.item || [];
  } catch (error) {
    console.error("Failed to fetch Rakuten products:", error);
    throw error;
  }
}

/**
 * Rakuten Deep Link API
 * アフィリエイトリンクを生成
 */
export async function createRakutenDeepLink(
  destinationUrl: string,
  mid: string,
): Promise<string> {
  // Rakutenのディープリンク形式
  // https://click.linksynergy.com/deeplink?id={YOUR_SID}&mid={MID}&murl={ENCODED_URL}
  const sid = process.env.RAKUTEN_SID; // Site ID

  if (!sid) {
    throw new Error("RAKUTEN_SID is not set");
  }

  const encodedUrl = encodeURIComponent(destinationUrl);
  return `https://click.linksynergy.com/deeplink?id=${sid}&mid=${mid}&murl=${encodedUrl}`;
}

/**
 * iHerb商品を検索（Rakuten経由）
 */
export async function searchIHerbProductsViaRakuten(
  keyword: string,
  limit = 50,
) {
  const IHERB_MID = process.env.RAKUTEN_IHERB_MID || "12345";

  return searchRakutenProducts({
    mid: IHERB_MID,
    keyword,
    max: limit,
  });
}

/**
 * Rakuten商品データをSuptia形式に変換
 */
export function convertRakutenProductToSuptiaFormat(product: RakutenProduct) {
  return {
    externalId: product.sku || product.upc,
    title: product.productname,
    brand: product.brand,
    price: {
      amount: parseFloat(product.price),
      retailPrice: product.retailprice
        ? parseFloat(product.retailprice)
        : undefined,
      currency: product.currency,
      source: "iherb",
      affiliateUrl: product.linkurl,
    },
    imageUrl: product.imageurl,
    description: product.description,
    category: product.category,
    identifiers: {
      upc: product.upc,
      isbn: product.isbn,
      sku: product.sku,
    },
  };
}
