import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ビジネスパーソン向けサプリメントガイド | Suptia",
  description:
    "仕事のパフォーマンス向上に効果的なサプリメントを科学的根拠に基づいて解説。ストレス対策、集中力、エネルギーをサポートする成分をご紹介します。",
};

const performanceIngredients = [
  {
    name: "ロディオラ",
    nameEn: "Rhodiola",
    slug: "rhodiola",
    description:
      "ストレス適応ハーブ。慢性的なストレスと疲労に対処し、仕事のパフォーマンスを維持します。",
    dosage: "200〜600mg/日",
    benefits: ["ストレス軽減", "疲労回復", "集中力向上"],
  },
  {
    name: "カフェイン + L-テアニン",
    nameEn: "Caffeine + L-Theanine",
    slug: "caffeine",
    description:
      "カフェインの覚醒効果とL-テアニンのリラックス効果を組み合わせた、理想的な集中力ブースター。",
    dosage: "カフェイン100mg + L-テアニン200mg",
    benefits: ["集中力向上", "覚醒効果", "不安軽減"],
  },
  {
    name: "ビタミンB群",
    nameEn: "B-Complex Vitamins",
    slug: "vitamin-b-complex",
    description:
      "エネルギー代謝と神経系の機能に不可欠。ストレス下で消費が増加します。",
    dosage: "B1〜B12の総合タイプ",
    benefits: ["エネルギー産生", "ストレス対策", "集中力"],
  },
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description:
      "脳機能と心血管の健康をサポート。抗炎症作用によりストレス対策にも有効。",
    dosage: "1000〜2000mg/日",
    benefits: ["認知機能", "心血管保護", "抗炎症"],
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description:
      "ストレス軽減と睡眠の質改善に重要。デスクワークで不足しやすい。",
    dosage: "300〜400mg/日",
    benefits: ["ストレス軽減", "睡眠の質", "筋肉の緊張緩和"],
  },
];

const healthIngredients = [
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "免疫機能と気分の調整に重要。オフィスワーカーは不足しやすい。",
    dosage: "1000〜2000IU/日",
    benefits: ["免疫機能", "気分改善", "骨の健康"],
  },
  {
    name: "CoQ10",
    nameEn: "Coenzyme Q10",
    slug: "coq10",
    description:
      "エネルギー産生と心血管の健康に重要。40歳以降は体内生成が減少します。",
    dosage: "100〜200mg/日",
    benefits: ["エネルギー産生", "心血管保護", "抗酸化"],
  },
  {
    name: "プロバイオティクス",
    nameEn: "Probiotics",
    slug: "probiotics",
    description: "腸内環境の改善により、免疫機能と気分の調整をサポート。",
    dosage: "10億〜100億CFU/日",
    benefits: ["腸内環境", "免疫機能", "気分改善"],
  },
];

export default function BusinessProfessionalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-purple-600">
              ホーム
            </Link>
            <span>/</span>
            <Link href="/guide/audiences" className="hover:text-purple-600">
              対象者別ガイド
            </Link>
            <span>/</span>
            <span className="text-neutral-900">ビジネスパーソン向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-600 to-gray-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">💼</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ビジネスパーソン向けサプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              仕事のパフォーマンスを最大化し、健康を維持する
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              長時間労働、ストレス、不規則な食事に対応した、科学的根拠に基づくサプリメントをご紹介します。
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-slate-50 border-l-4 border-slate-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-slate-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">
                  重要な注意事項
                </h3>
                <p className="text-slate-800 mb-2">
                  サプリメントは補助的なものです。十分な睡眠、バランスの取れた食事、適度な運動、ストレス管理が仕事のパフォーマンスと健康の基本です。
                </p>
                <p className="text-slate-800">
                  慢性的な疲労やストレスが続く場合は、サプリメントに頼るのではなく、医師に相談し、生活習慣の見直しを優先してください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ⚡ パフォーマンス向上成分
            </h2>
            <div className="grid gap-6">
              {performanceIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="block bg-white rounded-xl shadow-md p-6 border border-neutral-200 hover:shadow-lg hover:border-purple-300 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-purple-600 mb-1 transition-colors">
                        {ingredient.name}{" "}
                        <span className="text-sm text-neutral-500 font-normal">
                          ({ingredient.nameEn})
                        </span>
                      </h3>
                      <p className="text-neutral-600 mb-3">
                        {ingredient.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ingredient.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                      <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700 flex items-center gap-1">
                        {ingredient.name}の詳細を見る
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 md:min-w-[200px]">
                      <div className="text-xs text-slate-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {ingredient.dosage}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Health Ingredients */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🛡️ 健康維持成分
            </h2>
            <div className="grid gap-6">
              {healthIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="block bg-white rounded-xl shadow-md p-6 border border-neutral-200 hover:shadow-lg hover:border-purple-300 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-purple-600 mb-1 transition-colors">
                        {ingredient.name}{" "}
                        <span className="text-sm text-neutral-500 font-normal">
                          ({ingredient.nameEn})
                        </span>
                      </h3>
                      <p className="text-neutral-600 mb-3">
                        {ingredient.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ingredient.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                      <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700 flex items-center gap-1">
                        {ingredient.name}の詳細を見る
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-gray-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {ingredient.dosage}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ビジネスパーソンのサプリメント使用のポイント
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="text-xl font-bold mb-2">朝のルーティン化</h3>
                <p className="text-neutral-700">
                  ビタミンB群、ビタミンD、オメガ3は朝食と一緒に摂取。ロディオラやカフェイン+L-テアニンは仕事開始前に摂ることで、1日のパフォーマンスが向上します。
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">😴</div>
                <h3 className="text-xl font-bold mb-2">睡眠を犠牲にしない</h3>
                <p className="text-neutral-700">
                  どんなサプリメントも睡眠不足の代わりにはなりません。マグネシウムは夕食後に摂取し、質の高い睡眠を確保することが最も重要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🍱</div>
                <h3 className="text-xl font-bold mb-2">ランチを見直す</h3>
                <p className="text-neutral-700">
                  外食やコンビニ弁当が多い方は、魚（オメガ3）、野菜、全粒穀物を意識的に選びましょう。午後のパフォーマンス低下を防げます。
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">定期的な健康診断</h3>
                <p className="text-neutral-700">
                  ビタミンD、ビタミンB12、鉄などの血中濃度を定期的に検査し、不足している栄養素を特定することで、効果的にサプリメントを活用できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-100 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              さらに詳しい成分情報を確認
            </h2>
            <p className="text-lg mb-8 text-neutral-700">
              各成分の詳細ページで、効果、摂取方法、副作用、相互作用などの詳しい情報をご覧いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="bg-gradient-to-r from-slate-600 to-gray-700 text-white px-8 py-3 rounded-full font-bold hover:from-slate-700 hover:to-gray-800 transition-all shadow-lg"
              >
                成分一覧を見る
              </Link>
              <Link
                href="/guide/audiences"
                className="bg-white text-neutral-800 px-8 py-3 rounded-full font-bold hover:bg-neutral-100 transition-colors border-2 border-neutral-300"
              >
                他の対象者ガイドを見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
