import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Clock, MessageSquare, Zap, Target } from "lucide-react";

import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";

export const metadata: Metadata = {
  title: "サプリメント診断 | Suptia",
  description:
    "あなたの健康目標と状態に合わせた最適なサプリメントを診断します。かんたん診断と詳細診断の2つの方法から選べます。",
};

export default async function DiagnosisSelectionPage() {
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
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* ヒーローセクション */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-center">
              あなたに最適なサプリメントを診断
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center text-blue-100 max-w-3xl mx-auto px-2">
              健康目標や体質に合わせて、科学的根拠に基づいたパーソナライズされた推薦を提供します
            </p>
          </div>
        </div>

        {/* 診断方法選択 */}
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
              診断方法を選んでください
            </h2>
            <p className="text-center text-gray-600 mb-8 sm:mb-12">
              お好みの方法でサプリメント診断を受けられます
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* かんたん診断 */}
              <Link
                href="/diagnosis/simple"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Zap className="text-white" size={32} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-3">
                    かんたん診断
                  </h3>

                  <p className="text-gray-600 text-center mb-4 sm:mb-6">
                    基本的な質問に答えるだけで、すぐにおすすめのサプリメントが見つかります
                  </p>

                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock
                        size={18}
                        className="text-blue-500 mr-2 flex-shrink-0"
                      />
                      <span>所要時間: 約1分</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Target
                        size={18}
                        className="text-blue-500 mr-2 flex-shrink-0"
                      />
                      <span>質問数: 4問</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4">
                    <p className="text-sm text-blue-900 font-medium text-center">
                      こんな方におすすめ
                    </p>
                    <ul className="text-xs sm:text-sm text-blue-800 mt-2 space-y-1">
                      <li>• 初めてサプリメントを試す方</li>
                      <li>• 手軽に診断したい方</li>
                      <li>• 基本的な推薦が欲しい方</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                      かんたん診断を始める
                      <svg
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* 詳細診断 */}
              <Link
                href="/diagnosis/detailed"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-500"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <MessageSquare className="text-white" size={32} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-3">
                    詳細診断（チャット形式）
                  </h3>

                  <p className="text-gray-600 text-center mb-4 sm:mb-6">
                    対話形式で詳しく質問に答えることで、より精度の高い推薦を受けられます
                  </p>

                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock
                        size={18}
                        className="text-purple-500 mr-2 flex-shrink-0"
                      />
                      <span>所要時間: 約3〜5分</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Target
                        size={18}
                        className="text-purple-500 mr-2 flex-shrink-0"
                      />
                      <span>質問数: 10〜15問</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-4">
                    <p className="text-sm text-purple-900 font-medium text-center">
                      こんな方におすすめ
                    </p>
                    <ul className="text-xs sm:text-sm text-purple-800 mt-2 space-y-1">
                      <li>• より精度の高い推薦が欲しい方</li>
                      <li>• 健康状態に不安がある方</li>
                      <li>• 複数のサプリを比較したい方</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                      詳細診断を始める
                      <svg
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
