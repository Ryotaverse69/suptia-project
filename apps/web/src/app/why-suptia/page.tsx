import { Metadata } from "next";
import { sanity } from "@/lib/sanity.client";
import { WhySuptiaClient, WhySuptiaStats } from "./WhySuptiaClient";

export const metadata: Metadata = {
  title: "なぜサプティア？｜AI時代のサプリメント選びに必要な理由",
  description:
    "ChatGPTやPerplexityは便利。でも、サプリメント選びには根拠が必要です。サプティアは科学的エビデンス、価格比較、安全性評価を統合した意思決定エンジンです。",
  openGraph: {
    title: "なぜサプティア？｜AI時代のサプリメント選び",
    description:
      "AIが答えを出す時代。サプティアはその根拠を示す。科学的根拠に基づいた、あなたに最適なサプリメント選びを。",
    type: "website",
  },
};

// Fetch stats from Sanity
async function getStats(): Promise<WhySuptiaStats> {
  try {
    const result = await sanity.fetch<{
      productCount: number;
      ingredientCount: number;
    }>(
      `{
        "productCount": count(*[_type == "product" && availability == "in-stock"]),
        "ingredientCount": count(*[_type == "ingredient"])
      }`,
      {},
      { next: { revalidate: 3600 } }, // Revalidate every hour
    );

    return {
      productCount: result.productCount || 0,
      ingredientCount: result.ingredientCount || 0,
      ecSiteCount: 3, // 楽天、Yahoo!、Amazon
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    // Fallback values
    return {
      productCount: 476,
      ingredientCount: 50,
      ecSiteCount: 3,
    };
  }
}

export default async function WhySuptiaPage() {
  const stats = await getStats();

  return <WhySuptiaClient stats={stats} />;
}
