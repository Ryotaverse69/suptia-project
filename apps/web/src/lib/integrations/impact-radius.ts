/**
 * Impact (旧Impact Radius) API統合
 *
 * 最新のアフィリエイトプラットフォーム
 * iHerbを含む多数のブランドと提携
 *
 * ドキュメント: https://developer.impact.com/
 */

interface ImpactCatalogItem {
  CatalogItemId: string;
  CatalogId: string;
  Sku: string;
  ProductName: string;
  Price: string;
  Currency: string;
  ClickUrl: string;
  ImageUrl: string;
  Description: string;
  Brand: string;
  CategoryName: string;
  Upc: string;
  InStock: boolean;
}

interface ImpactCatalogResponse {
  Catalogs: {
    CatalogItems: ImpactCatalogItem[];
  }[];
}

const IMPACT_API_BASE = "https://api.impact.com";

/**
 * Impact Catalog API
 * 商品カタログを取得
 */
export async function fetchImpactCatalog(params: {
  campaignId: string; // iHerbのキャンペーンID
  pageSize?: number;
  page?: number;
  search?: string;
}): Promise<ImpactCatalogItem[]> {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Impact credentials not set");
  }

  const queryParams = new URLSearchParams({
    CampaignId: params.campaignId,
    PageSize: (params.pageSize || 100).toString(),
    Page: (params.page || 1).toString(),
  });

  if (params.search) {
    queryParams.set("Search", params.search);
  }

  const url = `${IMPACT_API_BASE}/Mediapartners/${accountSid}/Catalogs/Items?${queryParams.toString()}`;

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Impact API Error: ${response.status}`);
    }

    const data: ImpactCatalogResponse = await response.json();
    return data.Catalogs?.[0]?.CatalogItems || [];
  } catch (error) {
    console.error("Failed to fetch Impact catalog:", error);
    throw error;
  }
}

/**
 * Impact Universal Tracking Tag (UTT)
 * クリックURLをアフィリエイトリンクに変換
 */
export function createImpactTrackingLink(
  destinationUrl: string,
  campaignId: string,
  mediaPartnerId: string,
): string {
  // Impact UTT形式
  const encodedUrl = encodeURIComponent(destinationUrl);
  return `https://impact.go2cloud.org/aff_c?offer_id=${campaignId}&aff_id=${mediaPartnerId}&url=${encodedUrl}`;
}

/**
 * iHerb商品を検索（Impact経由）
 */
export async function searchIHerbProductsViaImpact(
  keyword: string,
  limit = 50,
) {
  const IHERB_CAMPAIGN_ID = process.env.IMPACT_IHERB_CAMPAIGN_ID || "12345";

  return fetchImpactCatalog({
    campaignId: IHERB_CAMPAIGN_ID,
    search: keyword,
    pageSize: limit,
  });
}

/**
 * Impact商品データをSuptia形式に変換
 */
export function convertImpactProductToSuptiaFormat(item: ImpactCatalogItem) {
  return {
    externalId: item.CatalogItemId,
    title: item.ProductName,
    brand: item.Brand,
    price: {
      amount: parseFloat(item.Price),
      currency: item.Currency,
      source: "iherb",
      affiliateUrl: item.ClickUrl,
      inStock: item.InStock,
    },
    imageUrl: item.ImageUrl,
    description: item.Description,
    category: item.CategoryName,
    identifiers: {
      upc: item.Upc,
      sku: item.Sku,
    },
  };
}

/**
 * Impact Conversion API
 * アフィリエイト成果を確認
 */
export async function fetchImpactConversions(params: {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  campaignId?: string;
}) {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Impact credentials not set");
  }

  const queryParams = new URLSearchParams({
    StartDate: params.startDate,
    EndDate: params.endDate,
  });

  if (params.campaignId) {
    queryParams.set("CampaignId", params.campaignId);
  }

  const url = `${IMPACT_API_BASE}/Mediapartners/${accountSid}/Actions?${queryParams.toString()}`;

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Impact Conversion API Error: ${response.status}`);
  }

  return response.json();
}
