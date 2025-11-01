import { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";

export const metadata: Metadata = {
  title: "サプリメント診断 | Suptia",
  description: "あなたの健康目標と状態に合わせた最適なサプリメントを診断します。",
};

export default async function DiagnosisPage() {
  // 構造化データの生成
  const siteUrl = getSiteUrl();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: `${siteUrl}/` },
    { name: "サプリメント診断", url: `${siteUrl}/diagnosis` },
  ]);

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD構造化データ: Breadcrumb */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            あなたに最適なサプリメントを診断
          </h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            健康目標や体質に合わせて、科学的根拠に基づいたパーソナライズされた推薦を提供します
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <DiagnosisForm />
        </div>
      </div>
    </div>
    </>
  );
}
