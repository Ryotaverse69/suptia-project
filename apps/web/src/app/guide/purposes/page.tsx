import { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Heart,
  Dumbbell,
  Moon,
  Shield,
  Zap,
  ArrowRight,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title:
    "目的別サプリガイド｜あなたの目標に合わせた最適なサプリメント選び - サプティア",
  description:
    "美肌・美容、筋肉増強、睡眠改善、免疫力向上、疲労回復など、目的別に最適なサプリメントを科学的根拠に基づいて解説。あなたの健康目標をサポートします。",
  openGraph: {
    title: "目的別サプリガイド - サプティア",
    description:
      "目的に合わせた最適なサプリメント選びをサポート。科学的根拠に基づく情報を提供します。",
    type: "website",
  },
};

const purposes = [
  {
    slug: "beauty",
    title: "美肌・美容",
    icon: Heart,
    description:
      "肌のハリ・ツヤ、アンチエイジング、美白をサポートするサプリメント",
    keywords: ["コラーゲン", "ビタミンC", "ビタミンE", "アスタキサンチン"],
    gradient: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.purple} 100%)`,
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "muscle",
    title: "筋肉増強・筋トレ",
    icon: Dumbbell,
    description:
      "筋肉の成長、回復、パフォーマンス向上をサポートするサプリメント",
    keywords: ["プロテイン", "BCAA", "クレアチン", "HMB"],
    gradient: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "sleep",
    title: "睡眠改善",
    icon: Moon,
    description:
      "質の高い睡眠、寝つきの改善、深い眠りをサポートするサプリメント",
    keywords: ["メラトニン", "マグネシウム", "グリシン", "GABA"],
    gradient: `linear-gradient(135deg, ${systemColors.indigo} 0%, ${systemColors.purple} 100%)`,
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "immunity",
    title: "免疫力向上",
    icon: Shield,
    description:
      "免疫システムの強化、風邪予防、健康維持をサポートするサプリメント",
    keywords: ["ビタミンD", "ビタミンC", "亜鉛", "プロバイオティクス"],
    gradient: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "energy",
    title: "疲労回復・エナジー",
    icon: Zap,
    description:
      "慢性疲労の改善、エネルギー生成、活力向上をサポートするサプリメント",
    keywords: ["ビタミンB群", "鉄分", "CoQ10", "アシュワガンダ"],
    gradient: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.red} 100%)`,
    stats: { ingredients: 6, combinations: 3 },
  },
];

const features = [
  {
    icon: FlaskConical,
    title: "科学的根拠",
    description:
      "各成分の効果は、臨床試験やメタ解析などの科学的エビデンスに基づいて評価しています。",
    color: systemColors.blue,
  },
  {
    icon: Target,
    title: "目的別最適化",
    description:
      "あなたの健康目標に合わせて、最も効果的な成分と摂取量を提案します。",
    color: systemColors.purple,
  },
  {
    icon: BookOpen,
    title: "相乗効果の解説",
    description:
      "成分同士の相性を考慮した、効果を最大化する組み合わせをご紹介します。",
    color: systemColors.green,
  },
];

export default function PurposesGuidePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.blue}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.teal}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{
                backgroundColor: `${systemColors.blue}15`,
                border: `1px solid ${systemColors.blue}30`,
              }}
            >
              <Target size={16} style={{ color: systemColors.blue }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.blue }}
              >
                ゴールから選ぶ
              </span>
            </div>

            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              目的別サプリガイド
            </h1>

            <p
              className="text-[17px] sm:text-[20px] max-w-3xl mx-auto leading-relaxed mb-10"
              style={{ color: appleWebColors.textSecondary }}
            >
              あなたの健康目標に合わせて、最適なサプリメントを選びましょう。
              <br className="hidden sm:block" />
              科学的根拠に基づいた情報で、確実に結果を出すサポートをします。
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4">
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.blue }}
                >
                  {purposes.length}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  目的カテゴリ
                </div>
              </div>
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.green }}
                >
                  30+
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  推奨成分を収録
                </div>
              </div>
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.purple }}
                >
                  15+
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  相乗効果の組み合わせ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Intro Card */}
          <div
            className={`mb-12 rounded-[20px] p-6 sm:p-8 border text-center max-w-4xl mx-auto ${liquidGlassClasses.light}`}
            style={{
              borderColor: appleWebColors.borderSubtle,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h2
              className="text-[20px] font-bold mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              目的に合わせた最適なサプリメント選び
            </h2>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              サプリメントは「何となく健康に良さそう」で選ぶのではなく、明確な目的を持って選ぶことが重要です。
              各目的に最適な成分、摂取量、タイミングを科学的根拠に基づいて解説します。
            </p>
          </div>

          {/* Purpose Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purposes.map((purpose) => (
              <Link
                key={purpose.slug}
                href={`/guide/purposes/${purpose.slug}`}
                className="group block h-full"
              >
                <div
                  className={`relative h-full overflow-hidden rounded-[20px] p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-14 h-14 rounded-[16px] flex items-center justify-center shadow-sm"
                        style={{ background: purpose.gradient }}
                      >
                        <purpose.icon className="text-white" size={28} />
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: appleWebColors.sectionBackground,
                        }}
                      >
                        <ArrowRight
                          size={18}
                          className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                          style={{ color: systemColors.blue }}
                        />
                      </div>
                    </div>

                    <h3
                      className="text-[20px] font-bold mb-3"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {purpose.title}
                    </h3>

                    <p
                      className="text-[15px] leading-relaxed mb-5 flex-grow"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {purpose.description}
                    </p>

                    <div
                      className="flex flex-wrap gap-2 pt-5 border-t"
                      style={{ borderColor: appleWebColors.borderSubtle }}
                    >
                      {purpose.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1.5 text-[12px] font-medium rounded-full"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                            color: appleWebColors.textSecondary,
                            border: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                      {purpose.keywords.length > 3 && (
                        <span
                          className="px-3 py-1.5 text-[12px] font-medium rounded-full"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                            color: appleWebColors.textTertiary,
                            border: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          +{purpose.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-16 sm:py-20 px-6 lg:px-12"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              目的別ガイドの特徴
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              科学的根拠に基づき、あなたの健康目標に最適な情報を提供します。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center p-6 rounded-[20px] border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div
                    className="p-4 rounded-[16px] mb-5"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon size={28} style={{ color: feature.color }} />
                  </div>
                  <h3
                    className="text-[17px] font-semibold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="rounded-[24px] p-8 sm:p-12 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.green}10 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h3
              className="text-[24px] sm:text-[28px] font-bold mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              まだ目的が決まっていない方へ
            </h3>
            <p
              className="text-[17px] mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              成分ガイドで各栄養素の効果を学んだり、
              危険成分ガイドで避けるべき成分を確認することもできます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="group flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full text-white transition-all hover:scale-[1.02] min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
                  boxShadow: `0 4px 16px ${systemColors.blue}40`,
                }}
              >
                成分ガイドを見る
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className={`group flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  color: appleWebColors.textPrimary,
                }}
              >
                危険成分ガイドを見る
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
