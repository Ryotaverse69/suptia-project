import { Metadata } from "next";
import { headers } from "next/headers";
import { Zap } from "lucide-react";

import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { systemColors, appleWebColors, fontStack } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "かんたん診断 | サプリメント診断 | Suptia",
  description:
    "約1分で完了！基本的な質問に答えるだけで、あなたに最適なサプリメントを診断します。",
};

export default async function SimpleDiagnosisPage() {
  // 構造化データの生成
  const siteUrl = getSiteUrl();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: `${siteUrl}/` },
    { name: "サプリメント診断", url: `${siteUrl}/diagnosis` },
    { name: "かんたん診断", url: `${siteUrl}/diagnosis/simple` },
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
            background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-5"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Zap className="text-white" size={28} />
            </div>
            <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-white mb-3 tracking-tight">
              かんたん診断
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white/80 max-w-2xl mx-auto leading-relaxed">
              基本的な質問に答えるだけで、すぐにおすすめのサプリメントが見つかります
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-10 md:py-14">
          <div className="max-w-4xl mx-auto">
            <DiagnosisForm />
          </div>
        </div>
      </div>
    </>
  );
}
