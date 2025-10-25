/**
 * アフィリエイトネットワーク統合マネージャー
 *
 * 複数のアフィリエイトネットワークを統一インターフェースで管理
 */

import { searchCJProducts, createCJDeepLink } from "./cj-affiliate";
import {
  searchRakutenProducts,
  createRakutenDeepLink,
} from "./rakuten-advertising";
import { fetchImpactCatalog, createImpactTrackingLink } from "./impact-radius";

export type AffiliateNetwork = "cj" | "rakuten" | "impact";

export interface UnifiedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  description?: string;
  affiliateUrl: string;
  network: AffiliateNetwork;
  inStock: boolean;
  upc?: string;
  sku?: string;
}

/**
 * 統一された商品検索インターフェース
 */
export async function searchAffiliateProducts(params: {
  network: AffiliateNetwork;
  merchant: "iherb" | "amazon" | "rakuten";
  keyword: string;
  limit?: number;
}): Promise<UnifiedProduct[]> {
  const limit = params.limit || 50;

  switch (params.network) {
    case "cj": {
      const merchantIds = {
        iherb: process.env.CJ_IHERB_ADVERTISER_ID || "",
        amazon: process.env.CJ_AMAZON_ADVERTISER_ID || "",
        rakuten: process.env.CJ_RAKUTEN_ADVERTISER_ID || "",
      };

      const products = await searchCJProducts({
        advertiserIds: merchantIds[params.merchant],
        keywords: params.keyword,
        recordsPerPage: limit,
      });

      return products.map((p) => ({
        id: p["ad-id"],
        name: p.name,
        brand: p.manufacturer || p["advertiser-name"],
        price: parseFloat(p.price),
        currency: p.currency,
        imageUrl: p["image-url"],
        description: p.description,
        affiliateUrl: p["buy-url"],
        network: "cj",
        inStock: p["in-stock"] === "yes",
        upc: p.upc,
      }));
    }

    case "rakuten": {
      const merchantIds = {
        iherb: process.env.RAKUTEN_IHERB_MID || "",
        amazon: process.env.RAKUTEN_AMAZON_MID || "",
        rakuten: process.env.RAKUTEN_RAKUTEN_MID || "",
      };

      const products = await searchRakutenProducts({
        mid: merchantIds[params.merchant],
        keyword: params.keyword,
        max: limit,
      });

      return products.map((p) => ({
        id: p.sku || p.upc,
        name: p.productname,
        brand: p.brand,
        price: parseFloat(p.price),
        currency: p.currency,
        imageUrl: p.imageurl,
        description: p.description,
        affiliateUrl: p.linkurl,
        network: "rakuten",
        inStock: true, // Rakutenは在庫情報が限定的
        upc: p.upc,
        sku: p.sku,
      }));
    }

    case "impact": {
      const campaignIds = {
        iherb: process.env.IMPACT_IHERB_CAMPAIGN_ID || "",
        amazon: process.env.IMPACT_AMAZON_CAMPAIGN_ID || "",
        rakuten: process.env.IMPACT_RAKUTEN_CAMPAIGN_ID || "",
      };

      const products = await fetchImpactCatalog({
        campaignId: campaignIds[params.merchant],
        search: params.keyword,
        pageSize: limit,
      });

      return products.map((p) => ({
        id: p.CatalogItemId,
        name: p.ProductName,
        brand: p.Brand,
        price: parseFloat(p.Price),
        currency: p.Currency,
        imageUrl: p.ImageUrl,
        description: p.Description,
        affiliateUrl: p.ClickUrl,
        network: "impact",
        inStock: p.InStock,
        upc: p.Upc,
        sku: p.Sku,
      }));
    }

    default:
      throw new Error(`Unsupported network: ${params.network}`);
  }
}

/**
 * アフィリエイトリンクを生成
 */
export async function generateAffiliateLink(
  network: AffiliateNetwork,
  destinationUrl: string,
  merchantId?: string,
): Promise<string> {
  switch (network) {
    case "cj": {
      const websiteId = process.env.CJ_WEBSITE_ID || "";
      return createCJDeepLink(destinationUrl, websiteId);
    }

    case "rakuten": {
      const mid = merchantId || process.env.RAKUTEN_IHERB_MID || "";
      return createRakutenDeepLink(destinationUrl, mid);
    }

    case "impact": {
      const campaignId =
        merchantId || process.env.IMPACT_IHERB_CAMPAIGN_ID || "";
      const mediaPartnerId = process.env.IMPACT_ACCOUNT_SID || "";
      return createImpactTrackingLink(
        destinationUrl,
        campaignId,
        mediaPartnerId,
      );
    }

    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

/**
 * 最安値を自動選択
 * 複数のアフィリエイトネットワークから最安値の商品を返す
 */
export async function findBestPrice(params: {
  keyword: string;
  networks?: AffiliateNetwork[];
  merchant: "iherb" | "amazon" | "rakuten";
}): Promise<UnifiedProduct | null> {
  const networks = params.networks || ["cj", "rakuten", "impact"];
  const allProducts: UnifiedProduct[] = [];

  // 並列で全ネットワークを検索
  const results = await Promise.allSettled(
    networks.map((network) =>
      searchAffiliateProducts({
        network,
        merchant: params.merchant,
        keyword: params.keyword,
        limit: 10,
      }),
    ),
  );

  // 成功した結果のみ収集
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allProducts.push(...result.value);
    }
  });

  if (allProducts.length === 0) {
    return null;
  }

  // 在庫があり、最安値の商品を返す
  const inStockProducts = allProducts.filter((p) => p.inStock);
  if (inStockProducts.length === 0) {
    return allProducts[0]; // 在庫がない場合は最初の商品
  }

  return inStockProducts.reduce((min, product) =>
    product.price < min.price ? product : min,
  );
}
