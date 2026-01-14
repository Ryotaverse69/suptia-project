import { Metadata } from "next";
import { headers } from "next/headers";
import { MessageSquare } from "lucide-react";

import { ChatDiagnosisForm } from "@/components/diagnosis/ChatDiagnosisForm";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { systemColors, appleWebColors, fontStack } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "詳細診断（チャット形式） | サプリメント診断 | サプティア",
  description:
    "対話形式で詳しく質問に答えることで、より精度の高いサプリメント推薦を受けられます。15問・約5分で完了。",
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

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* ヒーローセクション */}
        <div
          className="py-10 sm:py-12 md:py-16"
          style={{
            background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-5"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <MessageSquare className="text-white" size={28} />
            </div>
            <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-white mb-3 tracking-tight">
              詳細診断（チャット形式）
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white/80 max-w-2xl mx-auto leading-relaxed">
              対話形式で詳しく質問に答えることで、より精度の高い推薦を受けられます
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
          <ChatDiagnosisForm />
        </div>
      </div>
    </>
  );
}
