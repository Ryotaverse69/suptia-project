import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Microscope,
  Shield,
  Zap,
  Link as LinkIcon,
  Users,
  MessageCircle,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "対象者別サプリメントガイド | Suptia",
  description:
    "妊婦・授乳婦、高齢者、アスリート、学生、ビジネスパーソン、更年期の方など、対象者別に最適なサプリメントをご紹介。科学的根拠に基づいた安全で効果的な選び方を解説します。",
};

const audiences = [
  {
    slug: "pregnant-nursing",
    title: "妊婦・授乳婦向け",
    icon: "🤰",
    description: "妊娠・授乳期に安全な成分と避けるべき成分を詳しく解説",
    benefits: ["胎児の健康", "母体の栄養", "安全性重視"],
    gradient: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
  },
  {
    slug: "seniors",
    title: "高齢者向け",
    icon: "👴",
    description: "サルコペニア予防と認知機能維持のための成分ガイド",
    benefits: ["筋肉量維持", "認知機能", "骨密度"],
    gradient: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.yellow} 100%)`,
  },
  {
    slug: "athletes",
    title: "アスリート向け",
    icon: "🏃",
    description: "パフォーマンス向上と回復促進に最適な成分を紹介",
    benefits: ["パフォーマンス", "回復促進", "持久力"],
    gradient: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
  },
  {
    slug: "students",
    title: "学生向け",
    icon: "📚",
    description: "集中力・記憶力向上とストレス対策のためのサプリガイド",
    benefits: ["集中力", "記憶力", "ストレス軽減"],
    gradient: `linear-gradient(135deg, ${systemColors.indigo} 0%, ${systemColors.purple} 100%)`,
  },
  {
    slug: "business-professionals",
    title: "ビジネスパーソン向け",
    icon: "💼",
    description: "疲労回復とストレス管理で生産性を最大化",
    benefits: ["疲労回復", "ストレス管理", "生産性向上"],
    gradient: `linear-gradient(135deg, ${systemColors.gray[1]} 0%, ${systemColors.gray[2]} 100%)`,
  },
  {
    slug: "menopause",
    title: "更年期の方向け",
    icon: "🌸",
    description: "ホルモンバランスと更年期症状の緩和をサポート",
    benefits: ["ホルモンバランス", "睡眠改善", "気分安定"],
    gradient: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
  },
];

const features = [
  {
    icon: Microscope,
    title: "科学的根拠",
    description:
      "各対象者に特化した研究データに基づき、安全で効果的な成分を厳選して紹介します。",
    color: systemColors.blue,
  },
  {
    icon: Shield,
    title: "安全性重視",
    description:
      "特に注意が必要な対象者（妊婦、高齢者など）には、避けるべき成分も明確に記載しています。",
    color: systemColors.red,
  },
  {
    icon: Zap,
    title: "実践的アドバイス",
    description:
      "摂取量、タイミング、組み合わせなど、実際に使える具体的な情報を提供します。",
    color: systemColors.orange,
  },
  {
    icon: LinkIcon,
    title: "成分詳細へのリンク",
    description:
      "各成分の詳細ページで、さらに深い情報（副作用、相互作用など）を確認できます。",
    color: systemColors.purple,
  },
];

export default function AudiencesPage() {
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
          background: `linear-gradient(135deg, ${systemColors.purple}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.pink}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{
                backgroundColor: `${systemColors.purple}15`,
                border: `1px solid ${systemColors.purple}30`,
              }}
            >
              <Users size={16} style={{ color: systemColors.purple }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.purple }}
              >
                ライフステージ別ガイド
              </span>
            </div>

            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              対象者別サプリメントガイド
            </h1>

            <p
              className="text-[17px] sm:text-[20px] max-w-3xl mx-auto leading-relaxed mb-10"
              style={{ color: appleWebColors.textSecondary }}
            >
              妊娠中の方、高齢者、アスリート、学生など、
              <br className="hidden sm:block" />
              それぞれのニーズに合わせた安全で効果的な選び方をサポートします。
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
                  style={{ color: systemColors.purple }}
                >
                  {audiences.length}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  対象者カテゴリ
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
                  style={{ color: systemColors.blue }}
                >
                  40+
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
                  style={{ color: systemColors.red }}
                >
                  20+
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  注意成分を明記
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audiences Grid */}
      <section className="py-16 sm:py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((audience) => (
              <Link
                key={audience.slug}
                href={`/guide/audiences/${audience.slug}`}
                className="group block h-full"
              >
                <div
                  className={`relative h-full overflow-hidden rounded-[20px] p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl shadow-sm"
                        style={{ background: audience.gradient }}
                      >
                        {audience.icon}
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: appleWebColors.sectionBackground,
                          color: appleWebColors.textTertiary,
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
                      className="text-[20px] font-bold mb-3 transition-colors"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {audience.title}
                    </h3>

                    <p
                      className="text-[15px] leading-relaxed mb-5 flex-grow"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {audience.description}
                    </p>

                    <div
                      className="space-y-2 pt-5 border-t"
                      style={{ borderColor: appleWebColors.borderSubtle }}
                    >
                      {audience.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2
                            size={16}
                            style={{ color: systemColors.green }}
                          />
                          <span
                            className="text-[13px] font-medium"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {benefit}
                          </span>
                        </div>
                      ))}
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
              対象者別ガイドの特徴
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              科学的根拠に基づき、それぞれのライフステージに最適な情報を提供します。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-5 p-6 rounded-[20px] border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                  }}
                >
                  <div
                    className="p-3 rounded-[12px]"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon size={24} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3
                      className="text-[17px] font-semibold mb-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="rounded-[24px] p-8 sm:p-12 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.indigo}10 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h2
              className="text-[24px] sm:text-[28px] font-bold mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              自分に合ったサプリメントを見つけよう
            </h2>
            <p
              className="text-[17px] mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              AIコンシェルジュに相談すれば、あなたの状況に合わせた最適なサプリメントを提案。
              <br className="hidden sm:block" />
              なぜおすすめなのか、理由と注意点まで解説します。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/concierge"
                className="group flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                  boxShadow: `0 4px 16px ${systemColors.blue}40`,
                }}
              >
                <MessageCircle size={18} />
                AIに相談する
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/guide/purposes"
                className={`group flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  color: appleWebColors.textPrimary,
                }}
              >
                目的別ガイドも見る
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
