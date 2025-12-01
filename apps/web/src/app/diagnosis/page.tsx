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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-10 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-center">
              あなたに最適なサプリメントを診断
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-center text-blue-100 max-w-3xl mx-auto px-2">
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
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-blue-500 transform hover:scale-105"
              >
                {/* グラデーション背景（ホバー時） */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mb-4 sm:mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Zap className="text-white" size={40} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 group-hover:text-white mb-4 transition-colors duration-300">
                    かんたん診断
                  </h3>

                  <p className="text-gray-600 group-hover:text-white/90 text-center mb-6 sm:mb-8 text-base sm:text-lg transition-colors duration-300">
                    基本的な質問に答えるだけで、すぐにおすすめのサプリメントが見つかります
                  </p>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center text-sm sm:text-base text-gray-700 group-hover:text-white transition-colors duration-300">
                      <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-white/20 flex items-center justify-center mr-3 transition-colors duration-300">
                        <Clock
                          size={20}
                          className="text-blue-600 group-hover:text-white"
                        />
                      </div>
                      <span className="font-medium">所要時間: 約1分</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-700 group-hover:text-white transition-colors duration-300">
                      <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-white/20 flex items-center justify-center mr-3 transition-colors duration-300">
                        <Target
                          size={20}
                          className="text-blue-600 group-hover:text-white"
                        />
                      </div>
                      <span className="font-medium">質問数: 4問</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:bg-blue-500/90 rounded-2xl p-4 sm:p-5 mb-6 transition-colors duration-300 border border-blue-100 group-hover:border-white">
                    <p className="text-sm sm:text-base text-blue-900 font-bold text-center mb-3">
                      こんな方におすすめ
                    </p>
                    <ul className="text-xs sm:text-sm text-blue-800 space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                        初めてサプリメントを試す方
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                        手軽に診断したい方
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                        基本的な推薦が欲しい方
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg group-hover:shadow-2xl border-2 border-transparent group-hover:border-blue-600">
                      かんたん診断を始める
                      <svg
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
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
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-purple-500 transform hover:scale-105"
              >
                {/* グラデーション背景（ホバー時） */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-4 sm:mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <MessageSquare
                      className="text-white"
                      size={40}
                      strokeWidth={2.5}
                    />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 group-hover:text-white mb-4 transition-colors duration-300">
                    詳細診断（チャット形式）
                  </h3>

                  <p className="text-gray-600 group-hover:text-white/90 text-center mb-6 sm:mb-8 text-base sm:text-lg transition-colors duration-300">
                    対話形式で詳しく質問に答えることで、より精度の高い推薦を受けられます
                  </p>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center text-sm sm:text-base text-gray-700 group-hover:text-white transition-colors duration-300">
                      <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-white/20 flex items-center justify-center mr-3 transition-colors duration-300">
                        <Clock
                          size={20}
                          className="text-purple-600 group-hover:text-white"
                        />
                      </div>
                      <span className="font-medium">所要時間: 約5分</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-700 group-hover:text-white transition-colors duration-300">
                      <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-white/20 flex items-center justify-center mr-3 transition-colors duration-300">
                        <Target
                          size={20}
                          className="text-purple-600 group-hover:text-white"
                        />
                      </div>
                      <span className="font-medium">
                        質問数: 15問（対話形式）
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 group-hover:bg-purple-500/90 rounded-2xl p-4 sm:p-5 mb-6 transition-colors duration-300 border border-purple-100 group-hover:border-white">
                    <p className="text-sm sm:text-base text-purple-900 font-bold text-center mb-3">
                      こんな方におすすめ
                    </p>
                    <ul className="text-xs sm:text-sm text-purple-800 space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                        より精度の高い推薦が欲しい方
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                        健康状態に不安がある方
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                        複数のサプリを比較したい方
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg group-hover:shadow-2xl border-2 border-transparent group-hover:border-purple-600">
                      詳細診断を始める
                      <svg
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
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
