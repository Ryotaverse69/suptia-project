import { Metadata } from "next";
import { headers } from "next/headers";

import { ChatDiagnosisForm } from "@/components/diagnosis/ChatDiagnosisForm";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";

export const metadata: Metadata = {
  title: "詳細診断（チャット形式） | サプリメント診断 | Suptia",
  description:
    "対話形式で詳しく質問に答えることで、より精度の高いサプリメント推薦を受けられます。10問・約5分で完了。",
};

export default async function DetailedDiagnosisPage() {
  // 構造化データの生成
  const siteUrl = getSiteUrl();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: `${siteUrl}/` },
    { name: "サプリメント診断", url: `${siteUrl}/diagnosis` },
    { name: "詳細診断", url: `${siteUrl}/diagnosis/detailed` },
  ]);

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD構造化データ: Breadcrumb */}
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-center">
              詳細診断（チャット形式）
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-purple-100 max-w-3xl mx-auto px-2">
              対話形式で詳しく質問に答えることで、より精度の高い推薦を受けられます
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
          <ChatDiagnosisForm />
        </div>
      </div>
    </>
  );
}
