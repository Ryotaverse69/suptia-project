import Link from "next/link";
import { Metadata } from "next";

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
  },
  {
    slug: "seniors",
    title: "高齢者向け",
    icon: "👴",
    description: "サルコペニア予防と認知機能維持のための成分ガイド",
    benefits: ["筋肉量維持", "認知機能", "骨密度"],
    gradient: "from-amber-500 to-orange-500",
  },
  {
    slug: "athletes",
    title: "アスリート向け",
    icon: "🏃",
    description: "パフォーマンス向上と回復促進に最適な成分を紹介",
    benefits: ["パフォーマンス", "回復促進", "持久力"],
    gradient: "from-red-500 to-pink-500",
  },
  {
    slug: "students",
    title: "学生向け",
    icon: "📚",
    description: "集中力・記憶力向上とストレス対策のためのサプリガイド",
    benefits: ["集中力", "記憶力", "ストレス軽減"],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    slug: "business-professionals",
    title: "ビジネスパーソン向け",
    icon: "💼",
    description: "疲労回復とストレス管理で生産性を最大化",
    benefits: ["疲労回復", "ストレス管理", "生産性向上"],
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    slug: "menopause",
    title: "更年期の方向け",
    icon: "🌸",
    description: "ホルモンバランスと更年期症状の緩和をサポート",
    benefits: ["ホルモンバランス", "睡眠改善", "気分安定"],
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function AudiencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              対象者別サプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              あなたのライフステージに最適なサプリメントを見つけましょう
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              妊娠中の方、高齢者、アスリート、学生、働く方、更年期の方など、それぞれのニーズに合わせた安全で効果的なサプリメント選びをサポートします。
            </p>
          </div>
        </div>
      </section>

      {/* Audiences Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audiences.map((audience) => (
              <Link
                key={audience.slug}
                href={`/guide/audiences/${audience.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-neutral-200 hover:border-transparent hover:scale-[1.02]">
                  {/* Header with Gradient */}
                  <div
                    className={`bg-gradient-to-r ${audience.gradient} p-6 text-white`}
                  >
                    <div className="text-5xl mb-3">{audience.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">
                      {audience.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {audience.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
                      {audience.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-green-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-neutral-700">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <span className="text-sm font-medium text-neutral-600">
                        詳しく見る
                      </span>
                      <svg
                        className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              対象者別ガイドの特徴
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-xl font-bold mb-2">科学的根拠</h3>
                <p className="text-neutral-600">
                  各対象者に特化した研究データに基づき、安全で効果的な成分を厳選して紹介します。
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold mb-2">安全性重視</h3>
                <p className="text-neutral-600">
                  特に注意が必要な対象者（妊婦、高齢者など）には、避けるべき成分も明確に記載しています。
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="text-xl font-bold mb-2">実践的アドバイス</h3>
                <p className="text-neutral-600">
                  摂取量、タイミング、組み合わせなど、実際に使える具体的な情報を提供します。
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="text-xl font-bold mb-2">成分詳細へのリンク</h3>
                <p className="text-neutral-600">
                  各成分の詳細ページで、さらに深い情報（副作用、相互作用など）を確認できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-10 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              自分に合ったサプリメントを見つけよう
            </h2>
            <p className="text-lg mb-8 text-white/90">
              上記の対象者別ガイドから、あなたに最適なカテゴリーを選択してください。
              <br />
              科学的根拠に基づいた安全で効果的なサプリメント選びをサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guide/purposes"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors"
              >
                目的別ガイドも見る
              </Link>
              <Link
                href="/ingredients"
                className="bg-purple-700 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-800 transition-colors border-2 border-white/30"
              >
                成分一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
