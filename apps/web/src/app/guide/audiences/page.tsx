import Link from "next/link";
import { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Microscope,
  Shield,
  Zap,
  Link as LinkIcon,
  Users,
} from "lucide-react";

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
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  {
    slug: "seniors",
    title: "高齢者向け",
    icon: "👴",
    description: "サルコペニア予防と認知機能維持のための成分ガイド",
    benefits: ["筋肉量維持", "認知機能", "骨密度"],
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    slug: "athletes",
    title: "アスリート向け",
    icon: "🏃",
    description: "パフォーマンス向上と回復促進に最適な成分を紹介",
    benefits: ["パフォーマンス", "回復促進", "持久力"],
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    slug: "students",
    title: "学生向け",
    icon: "📚",
    description: "集中力・記憶力向上とストレス対策のためのサプリガイド",
    benefits: ["集中力", "記憶力", "ストレス軽減"],
    gradient: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  {
    slug: "business-professionals",
    title: "ビジネスパーソン向け",
    icon: "💼",
    description: "疲労回復とストレス管理で生産性を最大化",
    benefits: ["疲労回復", "ストレス管理", "生産性向上"],
    gradient: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  {
    slug: "menopause",
    title: "更年期の方向け",
    icon: "🌸",
    description: "ホルモンバランスと更年期症状の緩和をサポート",
    benefits: ["ホルモンバランス", "睡眠改善", "気分安定"],
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

const features = [
  {
    icon: Microscope,
    title: "科学的根拠",
    description:
      "各対象者に特化した研究データに基づき、安全で効果的な成分を厳選して紹介します。",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "安全性重視",
    description:
      "特に注意が必要な対象者（妊婦、高齢者など）には、避けるべき成分も明確に記載しています。",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Zap,
    title: "実践的アドバイス",
    description:
      "摂取量、タイミング、組み合わせなど、実際に使える具体的な情報を提供します。",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: LinkIcon,
    title: "成分詳細へのリンク",
    description:
      "各成分の詳細ページで、さらに深い情報（副作用、相互作用など）を確認できます。",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function AudiencesPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Global Background */}
      <div className="absolute inset-0 bg-slate-50 -z-50" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 py-24 lg:py-32">
        {/* Background Animation */}
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 -z-20 opacity-90"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-br from-transparent via-white/20 to-transparent -z-19 mix-blend-overlay"
          style={{
            animationDuration: "20s",
            animationDirection: "reverse",
            backgroundSize: "200% 200%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 -z-15 pointer-events-none" />

        {/* Mist Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] bg-white/20 blur-[120px] rounded-full animate-mist-flow"
            style={{ animationDuration: "45s" }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-pink-300/20 blur-[100px] rounded-full animate-mist-flow"
            style={{ animationDuration: "35s", animationDirection: "reverse" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-md border border-white/30 shadow-lg animate-fade-in">
            <Users size={18} className="text-yellow-300 animate-pulse" />
            <span className="text-sm font-bold text-white tracking-wide">
              ライフステージ別ガイド
            </span>
          </div>

          <h1
            className="mb-8 text-4xl font-black leading-tight lg:text-7xl text-white drop-shadow-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            対象者別サプリメントガイド
          </h1>

          <p
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90 lg:text-2xl font-medium animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            妊娠中の方、高齢者、アスリート、学生など、
            <br className="hidden sm:block" />
            それぞれのニーズに合わせた安全で効果的な選び方をサポートします。
          </p>

          {/* Quick Stats */}
          <div
            className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">
                {audiences.length}
              </div>
              <div className="text-sm text-white/80 font-medium">
                対象者カテゴリ
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">40+</div>
              <div className="text-sm text-white/80 font-medium">
                推奨成分を収録
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">20+</div>
              <div className="text-sm text-white/80 font-medium">
                注意成分を明記
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audiences Grid */}
      <section className="relative z-10 -mt-20 px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audiences.map((audience, index) => (
              <Link
                key={audience.slug}
                href={`/guide/audiences/${audience.slug}`}
                className="group relative block h-full animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-full overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-md border border-white/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/90">
                  {/* Gradient Header Background */}
                  <div
                    className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${audience.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${audience.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {audience.icon}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ArrowRight
                          size={20}
                          className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">
                      {audience.title}
                    </h3>

                    <p className="text-slate-600 mb-6 font-medium leading-relaxed flex-grow">
                      {audience.description}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-slate-100">
                      {audience.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2
                            size={18}
                            className="text-green-500 flex-shrink-0"
                          />
                          <span className="text-slate-700 font-medium text-sm">
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

      {/* Info Section - Features Grid */}
      <section className="py-24 px-6 lg:px-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 lg:text-5xl tracking-tight mb-6">
              対象者別ガイドの特徴
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              科学的根拠に基づき、それぞれのライフステージに最適な情報を提供します。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-90"
          style={{ animationDuration: "15s" }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h2 className="mb-6 text-3xl font-black text-white lg:text-5xl">
            自分に合ったサプリメントを見つけよう
          </h2>
          <p className="mb-10 text-xl text-purple-100 font-medium">
            上記の対象者別ガイドから、あなたに最適なカテゴリーを選択してください。
            <br className="hidden sm:block" />
            科学的根拠に基づいた安全で効果的なサプリメント選びをサポートします。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/guide/purposes"
              className="group flex items-center gap-2 rounded-full bg-white px-10 py-5 font-bold text-purple-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              目的別ガイドも見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/ingredients"
              className="group flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-10 py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white"
            >
              成分一覧を見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
