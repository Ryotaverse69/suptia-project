import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "更年期の方向けサプリメントガイド | Suptia",
  description:
    "更年期の症状緩和に効果的なサプリメントを科学的根拠に基づいて解説。ホルモンバランス、骨密度、心血管の健康をサポートする成分をご紹介します。",
};

const hormoneIngredients = [
  {
    name: "大豆イソフラボン",
    nameEn: "Soy Isoflavones",
    slug: "soy-isoflavones",
    description:
      "植物性エストロゲン。更年期症状（ほてり、発汗）の軽減に効果的です。",
    dosage: "40〜80mg/日",
    benefits: ["ほてり軽減", "発汗軽減", "骨密度維持"],
  },
  {
    name: "ブラックコホシュ",
    nameEn: "Black Cohosh",
    slug: "black-cohosh",
    description:
      "欧州で広く使用されるハーブ。ほてりや気分の変動に効果があります。",
    dosage: "40〜80mg/日",
    benefits: ["ほてり軽減", "気分安定", "睡眠の質"],
  },
  {
    name: "レッドクローバー",
    nameEn: "Red Clover",
    slug: "red-clover",
    description: "イソフラボンが豊富なハーブ。更年期症状全般に穏やかな効果。",
    dosage: "40〜80mg/日",
    benefits: ["ほてり軽減", "心血管保護", "骨の健康"],
  },
];

const boneHealthIngredients = [
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description:
      "骨密度維持に不可欠。更年期以降は骨粗しょう症リスクが増加します。",
    dosage: "1000〜1200mg/日",
    benefits: ["骨密度維持", "骨粗しょう症予防", "骨折予防"],
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "カルシウム吸収に必須。骨密度と筋力の維持に重要です。",
    dosage: "800〜2000IU/日",
    benefits: ["カルシウム吸収", "骨密度維持", "筋力維持"],
  },
  {
    name: "ビタミンK2",
    nameEn: "Vitamin K2",
    slug: "vitamin-k2",
    description: "カルシウムを骨に定着させ、血管の石灰化を防ぎます。",
    dosage: "90〜180μg/日",
    benefits: ["骨密度向上", "血管の健康", "カルシウム代謝"],
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description: "カルシウムと協働して骨の健康を維持。ストレス軽減にも有効。",
    dosage: "300〜400mg/日",
    benefits: ["骨の健康", "ストレス軽減", "睡眠の質"],
  },
];

const cardiovascularIngredients = [
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description: "心血管の健康保護。更年期以降の心疾患リスク上昇に対応します。",
    dosage: "1000〜2000mg/日",
    benefits: ["心血管保護", "中性脂肪低下", "抗炎症"],
  },
  {
    name: "コエンザイムQ10",
    nameEn: "CoQ10",
    slug: "coq10",
    description: "心臓の健康とエネルギー産生に重要。加齢とともに減少します。",
    dosage: "100〜200mg/日",
    benefits: ["心機能サポート", "エネルギー産生", "抗酸化"],
  },
];

export default function MenopausePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
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
            <span className="text-neutral-900">更年期の方向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🌸</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              更年期の方向けサプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              更年期を快適に過ごすための栄養サポート
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              ホルモンバランスの変化に伴う症状を緩和し、骨密度と心血管の健康を維持する成分を科学的根拠に基づいてご紹介します。
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-rose-50 border-l-4 border-rose-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5"
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
                <h3 className="font-bold text-rose-900 mb-2">重要な注意事項</h3>
                <p className="text-rose-800 mb-2">
                  更年期の症状が日常生活に大きく影響している場合は、サプリメントだけでなく、婦人科医に相談してホルモン補充療法（HRT）などの医療的介入も検討してください。
                </p>
                <p className="text-rose-800">
                  乳がんや子宮がんの既往歴がある方は、植物性エストロゲン（イソフラボンなど）の使用前に必ず医師に相談してください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hormone Balance Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🌺 ホルモンバランスサポート成分
            </h2>
            <div className="grid gap-6">
              {hormoneIngredients.map((ingredient) => (
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
                            className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-rose-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-rose-900">
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

      {/* Bone Health Ingredients */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🦴 骨の健康サポート成分
            </h2>
            <div className="grid gap-6">
              {boneHealthIngredients.map((ingredient) => (
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
                            className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-pink-50 border border-pink-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-pink-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-pink-900">
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

      {/* Cardiovascular Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ❤️ 心血管の健康サポート成分
            </h2>
            <div className="grid gap-6">
              {cardiovascularIngredients.map((ingredient) => (
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
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-red-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-red-900">
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
      <section className="py-16 bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              更年期のサプリメント使用のポイント
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">⏳</div>
                <h3 className="text-xl font-bold mb-2">
                  効果が現れるまで時間がかかる
                </h3>
                <p className="text-neutral-700">
                  イソフラボンやブラックコホシュは、効果が現れるまで4〜8週間かかります。すぐに諦めず、継続的に摂取することが重要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🥛</div>
                <h3 className="text-xl font-bold mb-2">
                  カルシウム+ビタミンD+K2の組み合わせ
                </h3>
                <p className="text-neutral-700">
                  骨密度維持には、カルシウム、ビタミンD、ビタミンK2を組み合わせることで相乗効果が得られます。1つだけでは不十分です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🏃</div>
                <h3 className="text-xl font-bold mb-2">運動も重要</h3>
                <p className="text-neutral-700">
                  サプリメントだけでは骨密度の低下は防げません。ウォーキングやレジスタンストレーニングなど、骨に負荷がかかる運動を週3回以上行いましょう。
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">定期的な骨密度検査</h3>
                <p className="text-neutral-700">
                  更年期以降は2年に1回、骨密度検査（DEXA法）を受けることで、骨粗しょう症の進行を早期に発見し、適切な対策を講じられます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-100 to-pink-100">
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
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg"
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
