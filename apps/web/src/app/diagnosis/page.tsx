import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Clock,
  MessageSquare,
  Zap,
  Target,
  ChevronRight,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "サプリメント診断・AI相談 | Suptia",
  description:
    "AIコンシェルジュに相談するか、簡単な質問に答えて診断。あなたに最適なサプリメントと「なぜおすすめか」まで解説します。",
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

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* ヒーローセクション */}
        <div
          className="py-12 sm:py-16 md:py-20"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-6"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold text-white mb-4 tracking-tight">
              あなたに最適なサプリメントを見つける
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white/80 max-w-2xl mx-auto leading-relaxed">
              AIに相談するか、簡単な質問に答えて診断。
              <br className="hidden sm:block" />
              科学的根拠に基づいたあなた専用の提案を受けられます。
            </p>
          </div>
        </div>

        {/* AI相談推奨セクション */}
        <div className="container mx-auto px-4 pt-10 sm:pt-14 md:pt-16">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/concierge"
              className={`group relative block overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1 mb-8`}
              style={{
                background: `linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(88,86,214,0.08) 100%)`,
                border: `1px solid ${systemColors.blue}30`,
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                    }}
                  >
                    <Sparkles className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className="text-[20px] sm:text-[22px] font-bold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        AIに相談する
                      </h3>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: systemColors.blue,
                          color: "#FFFFFF",
                        }}
                      >
                        おすすめ
                      </span>
                    </div>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      悩みを自由に伝えるだけ。AIコンシェルジュがあなたの判断スタイルに合わせて、
                      最適なサプリメントと「なぜおすすめか」を丁寧に解説します。
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    style={{ backgroundColor: `${systemColors.blue}15` }}
                  >
                    <ArrowRight
                      size={18}
                      style={{ color: systemColors.blue }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 診断方法選択 */}
        <div className="container mx-auto px-4 py-6 sm:py-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2
                className="text-[20px] sm:text-[24px] font-bold mb-2"
                style={{ color: appleWebColors.textPrimary }}
              >
                または、診断で始める
              </h2>
              <p
                className="text-[15px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                質問に答えて、おすすめのサプリメントを見つけましょう
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* かんたん診断 */}
              <Link
                href="/diagnosis/simple"
                className={`group relative overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="p-6 sm:p-8">
                  {/* アイコン */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
                    }}
                  >
                    <Zap className="text-white" size={32} />
                  </div>

                  <h3
                    className="text-[20px] sm:text-[22px] font-bold text-center mb-3"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    かんたん診断
                  </h3>

                  <p
                    className="text-[15px] text-center mb-6 leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    基本的な質問に答えるだけで、すぐにおすすめのサプリメントが見つかります
                  </p>

                  {/* 情報バッジ */}
                  <div className="flex justify-center gap-3 mb-6">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
                      style={{
                        backgroundColor: `${systemColors.blue}15`,
                        color: systemColors.blue,
                      }}
                    >
                      <Clock size={14} />
                      約1分
                    </div>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
                      style={{
                        backgroundColor: `${systemColors.blue}15`,
                        color: systemColors.blue,
                      }}
                    >
                      <Target size={14} />
                      4問
                    </div>
                  </div>

                  {/* こんな方におすすめ */}
                  <div
                    className="rounded-[16px] p-4 mb-6"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <p
                      className="text-[12px] font-semibold uppercase tracking-wider mb-3 text-center"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      こんな方におすすめ
                    </p>
                    <ul className="space-y-2">
                      {[
                        "初めてサプリメントを試す方",
                        "手軽に診断したい方",
                        "基本的な推薦が欲しい方",
                      ].map((text) => (
                        <li
                          key={text}
                          className="flex items-center text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mr-2"
                            style={{ backgroundColor: systemColors.blue }}
                          />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ボタン */}
                  <div
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all duration-300 group-hover:opacity-90 min-h-[48px]"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
                    }}
                  >
                    かんたん診断を始める
                    <ChevronRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>

              {/* 詳細診断 */}
              <Link
                href="/diagnosis/detailed"
                className={`group relative overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="p-6 sm:p-8">
                  {/* アイコン */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                    }}
                  >
                    <MessageSquare className="text-white" size={32} />
                  </div>

                  <h3
                    className="text-[20px] sm:text-[22px] font-bold text-center mb-3"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    詳細診断（チャット形式）
                  </h3>

                  <p
                    className="text-[15px] text-center mb-6 leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    対話形式で詳しく質問に答えることで、より精度の高い推薦を受けられます
                  </p>

                  {/* 情報バッジ */}
                  <div className="flex justify-center gap-3 mb-6">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
                      style={{
                        backgroundColor: `${systemColors.purple}15`,
                        color: systemColors.purple,
                      }}
                    >
                      <Clock size={14} />
                      約5分
                    </div>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
                      style={{
                        backgroundColor: `${systemColors.purple}15`,
                        color: systemColors.purple,
                      }}
                    >
                      <Target size={14} />
                      15問
                    </div>
                  </div>

                  {/* こんな方におすすめ */}
                  <div
                    className="rounded-[16px] p-4 mb-6"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <p
                      className="text-[12px] font-semibold uppercase tracking-wider mb-3 text-center"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      こんな方におすすめ
                    </p>
                    <ul className="space-y-2">
                      {[
                        "より精度の高い推薦が欲しい方",
                        "健康状態に不安がある方",
                        "複数のサプリを比較したい方",
                      ].map((text) => (
                        <li
                          key={text}
                          className="flex items-center text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mr-2"
                            style={{ backgroundColor: systemColors.purple }}
                          />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ボタン */}
                  <div
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all duration-300 group-hover:opacity-90 min-h-[48px]"
                    style={{
                      background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                    }}
                  >
                    詳細診断を始める
                    <ChevronRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
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
