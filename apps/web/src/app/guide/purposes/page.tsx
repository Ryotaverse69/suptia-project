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
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl">
              <Target size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              目的別サプリガイド
            </h1>
          </div>
          <p className="text-xl text-primary-100 max-w-3xl">
            あなたの健康目標に合わせて、最適なサプリメントを選びましょう。
            <br />
            科学的根拠に基づいた情報で、確実に結果を出すサポートをします。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            目的に合わせた最適なサプリメント選び
          </h2>
          <p className="text-primary-700">
            サプリメントは「何となく健康に良さそう」で選ぶのではなく、明確な目的を持って選ぶことが重要です。
            各目的に最適な成分、摂取量、タイミングを科学的根拠に基づいて解説します。
          </p>
        </div>

        {/* 目的カード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {purposes.map((purpose) => (
            <Link
              key={purpose.slug}
              href={`/guide/purposes/${purpose.slug}`}
              className="group"
            >
              <div className="h-full bg-white border-2 border-primary-200 rounded-xl p-8 hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* アイコン */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${purpose.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <purpose.icon className="text-white" size={32} />
                </div>

                {/* タイトル */}
                <h3 className="text-2xl font-bold text-primary-900 mb-3 group-hover:text-primary transition-colors">
                  {purpose.title}
                </h3>

                {/* 説明 */}
                <p className="text-primary-700 mb-6">{purpose.description}</p>

                {/* キーワード */}
                <div className="flex flex-wrap gap-2">
                  {purpose.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {purpose.keywords.length > 3 && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                      +{purpose.keywords.length - 3}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 flex items-center justify-between text-primary font-semibold group-hover:translate-x-2 transition-transform">
                  <span>詳しく見る</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* フッターCTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-accent-mint/10 border border-primary-200 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-primary-900 mb-3">
            まだ目的が決まっていない方へ
          </h3>
          <p className="text-primary-700 mb-6 max-w-2xl mx-auto">
            成分ガイドで各栄養素の効果を学んだり、危険成分ガイドで避けるべき成分を確認することもできます。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/ingredients"
              className="px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              成分ガイドを見る
            </Link>
            <Link
              href="/guide/dangerous-ingredients"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              危険成分ガイドを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
