import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "高齢者向けサプリメントガイド | Suptia",
  description:
    "加齢に伴う健康課題に対応するサプリメントを科学的根拠に基づいて解説。骨密度、認知機能、心血管の健康をサポートする成分をご紹介します。",
};

const recommendedIngredients = [
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description:
      "骨密度維持と筋力低下予防に重要。高齢者は皮膚でのビタミンD合成能力が低下します。",
    dosage: "800〜1000IU/日",
    benefits: ["骨密度維持", "筋力維持", "転倒リスク低減"],
  },
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description:
      "骨粗しょう症予防に不可欠。ビタミンDと併用することで吸収率が向上します。",
    dosage: "1000〜1200mg/日",
    benefits: ["骨密度維持", "骨折予防", "骨粗しょう症予防"],
  },
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description: "心血管の健康と認知機能の維持に重要。抗炎症作用もあります。",
    dosage: "1000〜2000mg/日",
    benefits: ["心血管保護", "認知機能維持", "抗炎症"],
  },
  {
    name: "ビタミンB12",
    nameEn: "Vitamin B12",
    slug: "vitamin-b12",
    description:
      "神経機能と造血に重要。高齢者は胃酸分泌低下により吸収が困難になります。",
    dosage: "2.4〜100μg/日",
    benefits: ["神経機能", "貧血予防", "認知機能維持"],
  },
  {
    name: "コエンザイムQ10",
    nameEn: "CoQ10",
    slug: "coq10",
    description:
      "心臓の健康とエネルギー産生に重要。加齢とともに体内生成が減少します。",
    dosage: "100〜200mg/日",
    benefits: ["心機能サポート", "エネルギー産生", "抗酸化"],
  },
  {
    name: "ビタミンK2",
    nameEn: "Vitamin K2",
    slug: "vitamin-k2",
    description: "カルシウムを骨に定着させる働きがあり、動脈石灰化を防ぎます。",
    dosage: "90〜180μg/日",
    benefits: ["骨密度向上", "血管の健康", "カルシウム代謝"],
  },
];

const cautionIngredients = [
  {
    name: "高用量ビタミンA",
    slug: "vitamin-a",
    reason: "高齢者では骨折リスクを高める可能性。β-カロテンは安全。",
    maxDosage: "900μg/日以下",
  },
  {
    name: "高用量鉄",
    slug: "iron",
    reason:
      "鉄欠乏性貧血と診断されていない限り、過剰摂取は酸化ストレスを増加させます。",
    maxDosage: "医師の指示がない限り避ける",
  },
  {
    name: "ギンコビロバ（高用量）",
    slug: "ginkgo-biloba",
    reason: "抗凝固薬との相互作用リスク。出血傾向を高める可能性。",
    maxDosage: "医師に相談",
  },
];

export default function SeniorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
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
            <span className="text-neutral-900">高齢者向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">👴</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              高齢者向けサプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              健康寿命を延ばすための栄養サポート
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              加齢に伴う栄養吸収の低下や慢性疾患のリスクに対応した、科学的根拠に基づくサプリメントをご紹介します。
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-bold text-orange-900 mb-2">
                  重要な注意事項
                </h3>
                <p className="text-orange-800 mb-2">
                  既に処方薬を服用している場合、サプリメントとの相互作用が懸念されます。必ず医師または薬剤師に相談してから使用してください。
                </p>
                <p className="text-orange-800">
                  特に、抗凝固薬、降圧薬、糖尿病治療薬を服用中の方は注意が必要です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ✅ 推奨される成分
            </h2>
            <div className="grid gap-6">
              {recommendedIngredients.map((ingredient) => (
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
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-green-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-green-900">
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

      {/* Caution Ingredients */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ⚠️ 注意が必要な成分
            </h2>
            <div className="grid gap-4">
              {cautionIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="block bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg hover:border-orange-600 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-purple-600 mb-2 transition-colors">
                        {ingredient.name}
                      </h3>
                      <p className="text-neutral-700 mb-2">
                        <span className="font-semibold">理由:</span>{" "}
                        {ingredient.reason}
                      </p>
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
                    <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 md:min-w-[200px]">
                      <div className="text-xs text-orange-700 font-medium mb-1">
                        推奨
                      </div>
                      <div className="text-sm font-bold text-orange-900">
                        {ingredient.maxDosage}
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
              高齢者のサプリメント使用のポイント
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="text-xl font-bold mb-2">薬との相互作用に注意</h3>
                <p className="text-neutral-700">
                  処方薬や市販薬との相互作用が起こりやすいため、必ず医師や薬剤師に相談してから使用を開始してください。特に抗凝固薬との併用には注意が必要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-xl font-bold mb-2">定期的な血液検査</h3>
                <p className="text-neutral-700">
                  ビタミンD、ビタミンB12、鉄などの血中濃度を定期的に検査し、不足や過剰を避けましょう。医師の指導のもとで適切な量を調整することが重要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="text-xl font-bold mb-2">食事と併用</h3>
                <p className="text-neutral-700">
                  脂溶性ビタミン（D、K）は食事と一緒に摂取すると吸収率が向上します。また、カルシウムとマグネシウムはバランスよく摂取することが重要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="text-xl font-bold mb-2">継続的な摂取</h3>
                <p className="text-neutral-700">
                  サプリメントの効果は数週間から数ヶ月かけて現れます。短期間で判断せず、医師の指導のもと継続的に摂取することが大切です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
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
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
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
