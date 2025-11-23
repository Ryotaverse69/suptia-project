import { Metadata } from "next";
import Link from "next/link";
import { Target, Sparkles, Dumbbell, Moon, Shield, Zap } from "lucide-react";

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
  },
  {
    slug: "muscle",
    title: "筋肉増強・筋トレ",
    icon: Dumbbell,
    description:
      "筋肉の成長、回復、パフォーマンス向上をサポートするサプリメント",
    keywords: ["プロテイン", "BCAA", "クレアチン", "L-カルニチン"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "sleep",
    title: "睡眠改善",
    icon: Moon,
    description:
      "質の高い睡眠、寝つきの改善、深い眠りをサポートするサプリメント",
    keywords: ["メラトニン", "マグネシウム", "グリシン", "GABA"],
    color: "from-indigo-500 to-purple-500",
  },
  {
    slug: "immunity",
    title: "免疫力向上",
    icon: Shield,
    description:
      "免疫システムの強化、風邪予防、健康維持をサポートするサプリメント",
    keywords: ["ビタミンD", "ビタミンC", "亜鉛", "プロバイオティクス"],
    color: "from-green-500 to-emerald-500",
  },
  {
    slug: "energy",
    title: "疲労回復・エナジー",
    icon: Zap,
    description:
      "慢性疲労の改善、エネルギー生成、活力向上をサポートするサプリメント",
    keywords: ["ビタミンB群", "鉄分", "CoQ10", "マグネシウム"],
    color: "from-orange-500 to-red-500",
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

      {/* Footer CTA */}
      <section className="relative overflow-hidden py-24 bg-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100 rounded-3xl p-10 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              まだ目的が決まっていない方へ
            </h3>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              成分ガイドで各栄養素の効果を学んだり、危険成分ガイドで避けるべき成分を確認することもできます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-full border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
              >
                成分ガイドを見る
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl"
              >
                危険成分ガイドを見る
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add imports at the top if not present
import { ArrowRight } from "lucide-react";
