import { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Sparkles,
  Dumbbell,
  Moon,
  Shield,
  Zap,
  ArrowRight,
  BookOpen,
  FlaskConical,
} from "lucide-react";

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
    icon: Sparkles,
    description:
      "肌のハリ・ツヤ、アンチエイジング、美白をサポートするサプリメント",
    keywords: ["コラーゲン", "ビタミンC", "ビタミンE", "アスタキサンチン"],
    color: "from-pink-500 to-purple-500",
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "muscle",
    title: "筋肉増強・筋トレ",
    icon: Dumbbell,
    description:
      "筋肉の成長、回復、パフォーマンス向上をサポートするサプリメント",
    keywords: ["プロテイン", "BCAA", "クレアチン", "HMB"],
    color: "from-blue-500 to-cyan-500",
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "sleep",
    title: "睡眠改善",
    icon: Moon,
    description:
      "質の高い睡眠、寝つきの改善、深い眠りをサポートするサプリメント",
    keywords: ["メラトニン", "マグネシウム", "グリシン", "GABA"],
    color: "from-indigo-500 to-purple-500",
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "immunity",
    title: "免疫力向上",
    icon: Shield,
    description:
      "免疫システムの強化、風邪予防、健康維持をサポートするサプリメント",
    keywords: ["ビタミンD", "ビタミンC", "亜鉛", "プロバイオティクス"],
    color: "from-green-500 to-emerald-500",
    stats: { ingredients: 6, combinations: 3 },
  },
  {
    slug: "energy",
    title: "疲労回復・エナジー",
    icon: Zap,
    description:
      "慢性疲労の改善、エネルギー生成、活力向上をサポートするサプリメント",
    keywords: ["ビタミンB群", "鉄分", "CoQ10", "アシュワガンダ"],
    color: "from-orange-500 to-red-500",
    stats: { ingredients: 6, combinations: 3 },
  },
];

const features = [
  {
    icon: FlaskConical,
    title: "科学的根拠",
    description:
      "各成分の効果は、臨床試験やメタ解析などの科学的エビデンスに基づいて評価しています。",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Target,
    title: "目的別最適化",
    description:
      "あなたの健康目標に合わせて、最も効果的な成分と摂取量を提案します。",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: BookOpen,
    title: "相乗効果の解説",
    description:
      "成分同士の相性を考慮した、効果を最大化する組み合わせをご紹介します。",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function PurposesGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Global Background */}
      <div className="absolute inset-0 bg-slate-50 -z-50" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#3b66e0] py-24 lg:py-32">
        {/* Background Animation */}
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-[#3b66e0] via-[#f1faf9] to-[#3b66e0] -z-20 opacity-90"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-br from-transparent via-[#f1faf9]/40 to-transparent -z-19 mix-blend-overlay"
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
            className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-[#f1faf9]/30 blur-[100px] rounded-full animate-mist-flow"
            style={{ animationDuration: "35s", animationDirection: "reverse" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-md border border-white/30 shadow-lg animate-fade-in">
            <Target size={18} className="text-yellow-300 animate-pulse" />
            <span className="text-sm font-bold text-white tracking-wide">
              ゴールから選ぶ
            </span>
          </div>

          <h1
            className="mb-8 text-4xl font-black leading-tight lg:text-7xl text-white drop-shadow-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            目的別サプリガイド
          </h1>

          <p
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90 lg:text-2xl font-medium animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            あなたの健康目標に合わせて、最適なサプリメントを選びましょう。
            <br className="hidden sm:block" />
            科学的根拠に基づいた情報で、確実に結果を出すサポートをします。
          </p>

          {/* Quick Stats */}
          <div
            className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">
                {purposes.length}
              </div>
              <div className="text-sm text-white/80 font-medium">
                目的カテゴリ
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">30+</div>
              <div className="text-sm text-white/80 font-medium">
                推奨成分を収録
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">15+</div>
              <div className="text-sm text-white/80 font-medium">
                相乗効果の組み合わせ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 -mt-20 px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl">
          {/* Intro Card */}
          <div
            className="mb-16 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-md border border-white/50 text-center max-w-4xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              目的に合わせた最適なサプリメント選び
            </h2>
            <p className="text-slate-600 leading-relaxed">
              サプリメントは「何となく健康に良さそう」で選ぶのではなく、明確な目的を持って選ぶことが重要です。
              <br />
              各目的に最適な成分、摂取量、タイミングを科学的根拠に基づいて解説します。
            </p>
          </div>

          {/* Purpose Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {purposes.map((purpose, index) => (
              <Link
                key={purpose.slug}
                href={`/guide/purposes/${purpose.slug}`}
                className="group relative block h-full animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="relative h-full overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-md border border-white/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/90">
                  {/* Gradient Header Background */}
                  <div
                    className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${purpose.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${purpose.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <purpose.icon className="text-white" size={32} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ArrowRight
                          size={20}
                          className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {purpose.title}
                    </h3>

                    <p className="text-slate-600 mb-6 font-medium leading-relaxed flex-grow">
                      {purpose.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
                      {purpose.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200"
                        >
                          {keyword}
                        </span>
                      ))}
                      {purpose.keywords.length > 3 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-slate-200">
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
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 lg:text-5xl tracking-tight mb-6">
              目的別ガイドの特徴
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              科学的根拠に基づき、あなたの健康目標に最適な情報を提供します。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
                >
                  <div
                    className={`p-4 rounded-2xl ${feature.bg} ${feature.color} mb-6`}
                  >
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h3 className="text-3xl font-bold text-white mb-6 lg:text-5xl">
            まだ目的が決まっていない方へ
          </h3>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            成分ガイドで各栄養素の効果を学んだり、
            <br className="hidden sm:block" />
            危険成分ガイドで避けるべき成分を確認することもできます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ingredients"
              className="group flex items-center justify-center gap-2 px-10 py-5 bg-white text-slate-900 font-bold rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              成分ガイドを見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/guide/dangerous-ingredients"
              className="group flex items-center justify-center gap-2 px-10 py-5 border border-white/40 bg-white/10 text-white font-bold rounded-full backdrop-blur-md transition-all hover:bg-white/20 hover:border-white"
            >
              危険成分ガイドを見る
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
