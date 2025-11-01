import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "学生向けサプリメントガイド | Suptia",
  description:
    "学業のパフォーマンス向上に効果的なサプリメントを科学的根拠に基づいて解説。集中力、記憶力、ストレス対策をサポートする成分をご紹介します。",
};

const cognitiveIngredients = [
  {
    name: "オメガ3（DHA/EPA）",
    nameEn: "Omega-3 (DHA/EPA)",
    slug: "omega-3",
    description:
      "脳の構成成分として重要。学習能力と記憶力のサポートに役立ちます。",
    dosage: "DHA 500〜1000mg/日",
    benefits: ["記憶力向上", "集中力向上", "脳の健康"],
  },
  {
    name: "カフェイン + L-テアニン",
    nameEn: "Caffeine + L-Theanine",
    slug: "caffeine",
    description:
      "カフェインの覚醒効果とL-テアニンのリラックス効果の組み合わせで、穏やかな集中力が得られます。",
    dosage: "カフェイン100mg + L-テアニン200mg",
    benefits: ["集中力向上", "覚醒効果", "不安軽減"],
  },
  {
    name: "ビタミンB群",
    nameEn: "B-Complex Vitamins",
    slug: "vitamin-b-complex",
    description:
      "神経伝達物質の合成とエネルギー代謝に不可欠。ストレス対策にも有効。",
    dosage: "B1〜B12の総合タイプ",
    benefits: ["エネルギー産生", "集中力", "ストレス対策"],
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description:
      "神経系の機能とストレス対策に重要。睡眠の質改善にも役立ちます。",
    dosage: "300〜400mg/日",
    benefits: ["ストレス軽減", "睡眠の質", "集中力"],
  },
  {
    name: "ロディオラ",
    nameEn: "Rhodiola",
    slug: "rhodiola",
    description: "適応促進ハーブ。試験期間中のストレスと疲労を軽減します。",
    dosage: "200〜600mg/日",
    benefits: ["ストレス対策", "疲労軽減", "集中力向上"],
  },
];

const lifestyleIngredients = [
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description:
      "免疫機能と気分の調整に重要。屋内で過ごす時間が長い学生は不足しがち。",
    dosage: "1000〜2000IU/日",
    benefits: ["免疫機能", "気分改善", "骨の健康"],
  },
  {
    name: "プロバイオティクス",
    nameEn: "Probiotics",
    slug: "probiotics",
    description: "腸内環境の改善により、免疫機能と気分の調整をサポート。",
    dosage: "10億〜100億CFU/日",
    benefits: ["腸内環境", "免疫機能", "気分改善"],
  },
  {
    name: "亜鉛",
    nameEn: "Zinc",
    slug: "zinc",
    description:
      "免疫機能と認知機能の維持に重要。食生活が不規則だと不足しやすい。",
    dosage: "8〜11mg/日",
    benefits: ["免疫機能", "認知機能", "皮膚の健康"],
  },
];

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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
            <span className="text-neutral-900">学生向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              学生向けサプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              学業のパフォーマンスを最大化する栄養サポート
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              集中力、記憶力、ストレス対策に効果的な成分を科学的根拠に基づいてご紹介します。試験期間を乗り切るために。
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5"
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
                <h3 className="font-bold text-indigo-900 mb-2">
                  重要な注意事項
                </h3>
                <p className="text-indigo-800 mb-2">
                  サプリメントは補助的なものです。十分な睡眠、バランスの取れた食事、適度な運動が学業パフォーマンスの基本です。
                </p>
                <p className="text-indigo-800">
                  カフェインの過剰摂取（1日400mg以上）は不安や不眠を引き起こす可能性があります。適量を守りましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cognitive Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🧠 認知機能サポート成分
            </h2>
            <div className="grid gap-6">
              {cognitiveIngredients.map((ingredient) => (
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
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 md:min-w-[200px]">
                      <div className="text-xs text-indigo-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-indigo-900">
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

      {/* Lifestyle Ingredients */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🌟 生活サポート成分
            </h2>
            <div className="grid gap-6">
              {lifestyleIngredients.map((ingredient) => (
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
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-purple-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-purple-900">
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
              学生のサプリメント使用のポイント
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">☕</div>
                <h3 className="text-xl font-bold mb-2">カフェインは適量で</h3>
                <p className="text-neutral-700">
                  1日400mg（コーヒー約4杯分）を超えないようにしましょう。夕方以降の摂取は睡眠の質を低下させる可能性があります。L-テアニンとの併用がおすすめ。
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">😴</div>
                <h3 className="text-xl font-bold mb-2">睡眠を最優先に</h3>
                <p className="text-neutral-700">
                  どんなサプリメントも睡眠不足の代わりにはなりません。試験前でも7〜8時間の睡眠を確保することで、記憶の定着と集中力が大幅に向上します。
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🍎</div>
                <h3 className="text-xl font-bold mb-2">食事が基本</h3>
                <p className="text-neutral-700">
                  朝食を抜かず、魚、野菜、果物、全粒穀物をバランスよく摂取しましょう。特に朝食は学業パフォーマンスに大きく影響します。
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2">コスパ重視</h3>
                <p className="text-neutral-700">
                  学生は予算に限りがあります。マルチビタミン、オメガ3、マグネシウムなど、コスパが良く効果が実証されている成分から始めましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-100 to-purple-100">
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
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
