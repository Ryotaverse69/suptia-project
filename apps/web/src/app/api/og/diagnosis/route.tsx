import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import {
  DiagnosisCard,
  type DiagnosisCardProps,
} from "@/lib/og-cards/DiagnosisCard";
import { ogFormats, type OgFormat } from "@/lib/og-cards/shared";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // パラメータ取得
    const goals = (searchParams.get("goals") || "").split(",").filter(Boolean);
    const topProduct = searchParams.get("topProduct") || "推薦商品";
    const tierRank = searchParams.get("tierRank") || "B";
    const pricePerDay = parseInt(searchParams.get("pricePerDay") || "0", 10);
    const format = (searchParams.get("format") || "ogp") as OgFormat;

    // 5柱スコア
    const scores: DiagnosisCardProps["scores"] = {
      price: searchParams.get("price") || undefined,
      content: searchParams.get("content") || undefined,
      costEffectiveness: searchParams.get("costEffectiveness") || undefined,
      evidence: searchParams.get("evidence") || undefined,
      safety: searchParams.get("safety") || undefined,
    };

    // フォーマット検証
    const validFormat = ogFormats[format] ? format : "ogp";
    const { width, height } = ogFormats[validFormat];

    return new ImageResponse(
      <DiagnosisCard
        goals={goals}
        topProduct={topProduct}
        tierRank={tierRank}
        pricePerDay={pricePerDay}
        scores={scores}
        format={validFormat}
      />,
      {
        width,
        height,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      },
    );
  } catch (error) {
    console.error("OG diagnosis card error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
