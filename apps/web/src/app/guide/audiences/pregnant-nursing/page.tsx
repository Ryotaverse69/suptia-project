import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "妊婦・授乳婦向けサプリメントガイド | Suptia",
  description:
    "妊娠・授乳期に安全な成分と避けるべき成分を科学的根拠に基づいて解説。葉酸、鉄、カルシウム、DHAなど、母体と赤ちゃんの健康をサポートする成分をご紹介します。",
};

const safeIngredients = [
  {
    name: "葉酸",
    nameEn: "Folic Acid",
    slug: "folic-acid",
    description: "神経管閉鎖障害の予防に不可欠。妊娠前から摂取が推奨されます。",
    dosage: "400〜800μg/日",
    benefits: ["神経管閉鎖障害予防", "DNA合成", "細胞分裂"],
  },
  {
    name: "鉄",
    nameEn: "Iron",
    slug: "iron",
    description: "貧血予防と胎児の成長に重要。妊娠中は需要が増加します。",
    dosage: "27mg/日（妊娠中）",
    benefits: ["貧血予防", "酸素運搬", "エネルギー産生"],
  },
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description: "母体の骨密度維持と胎児の骨形成に必要。",
    dosage: "1000mg/日",
    benefits: ["骨形成", "筋肉機能", "神経伝達"],
  },
  {
    name: "オメガ3（DHA/EPA）",
    nameEn: "Omega-3 (DHA/EPA)",
    slug: "omega-3",
    description: "胎児の脳と目の発達に重要。魚由来が推奨されます。",
    dosage: "DHA 200〜300mg/日",
    benefits: ["脳発達", "視覚発達", "炎症軽減"],
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "カルシウム吸収と免疫機能をサポート。",
    dosage: "600〜800IU/日",
    benefits: ["カルシウム吸収", "骨の健康", "免疫機能"],
  },
  {
    name: "ビタミンB6",
    nameEn: "Vitamin B6",
    slug: "vitamin-b6",
    description: "つわりの軽減に効果的。タンパク質代謝にも重要。",
    dosage: "1.9mg/日",
    benefits: ["つわり軽減", "タンパク質代謝", "神経機能"],
  },
];

const avoidIngredients = [
  {
    name: "ビタミンA（レチノール）",
    slug: "vitamin-a",
    reason: "高用量で催奇形性のリスク。β-カロテンは安全。",
    maxDosage: "3000μg/日以下",
  },
  {
    name: "L-テアニン",
    slug: "l-theanine",
    reason: "妊娠・授乳中の安全性データ不足。",
    maxDosage: "使用を避ける",
  },
  {
    name: "GABA",
    slug: "gaba",
    reason: "妊娠・授乳中の安全性データ不足。",
    maxDosage: "使用を避ける",
  },
  {
    name: "バレリアン",
    slug: "valerian",
    reason: "妊娠・授乳中の安全性が確立されていない。",
    maxDosage: "使用を避ける",
  },
  {
    name: "エルダーベリー",
    slug: "elderberry",
    reason: "妊娠・授乳中の十分な安全性データがない。",
    maxDosage: "使用を避ける",
  },
  {
    name: "エキナセア",
    slug: "echinacea",
    reason: "免疫系への影響が不明確。",
    maxDosage: "使用を避ける",
  },
  {
    name: "HMB",
    slug: "hmb",
    reason: "妊娠・授乳中の安全性データが不十分。",
    maxDosage: "使用を避ける",
  },
  {
    name: "ベータアラニン",
    slug: "beta-alanine",
    reason: "妊娠・授乳中の安全性データが不十分。",
    maxDosage: "使用を避ける",
  },
  {
    name: "ロディオラ",
    slug: "rhodiola",
    reason: "妊娠・授乳中の安全性が確立されていない。",
    maxDosage: "使用を避ける",
  },
];

export default function PregnantNursingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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
            <span className="text-neutral-900">妊婦・授乳婦向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🤰</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              妊婦・授乳婦向けサプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              母体と赤ちゃんの健康を守るための安全な栄養補給
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              妊娠・授乳期は栄養需要が大幅に増加する時期です。安全で効果的な成分を科学的根拠に基づいてご紹介します。
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
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
                <h3 className="font-bold text-red-900 mb-2">重要な注意事項</h3>
                <p className="text-red-800 mb-2">
                  妊娠中・授乳中のサプリメント使用は、必ず医師または助産師に相談してから開始してください。
                </p>
                <p className="text-red-800">
                  このガイドは一般的な情報提供を目的としており、個別の医療アドバイスではありません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ✅ 安全で推奨される成分
            </h2>
            <div className="grid gap-6">
              {safeIngredients.map((ingredient) => (
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

      {/* Avoid Ingredients */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              ⚠️ 避けるべき成分
            </h2>
            <div className="grid gap-4">
              {avoidIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="block bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg hover:border-red-600 transition-all group"
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
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-red-700 font-medium mb-1">
                        推奨
                      </div>
                      <div className="text-sm font-bold text-red-900">
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
              妊娠・授乳期のサプリメント使用のポイント
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">👶</div>
                <h3 className="text-xl font-bold mb-2">妊娠前から準備</h3>
                <p className="text-neutral-700">
                  葉酸は妊娠前1ヶ月から摂取を開始することが推奨されています。計画的な栄養補給が重要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="text-xl font-bold mb-2">
                  プレナタルビタミン優先
                </h3>
                <p className="text-neutral-700">
                  妊婦用マルチビタミン（プレナタルビタミン）を基本とし、個別のサプリメントは医師と相談の上で追加してください。
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🐟</div>
                <h3 className="text-xl font-bold mb-2">食事からの摂取を優先</h3>
                <p className="text-neutral-700">
                  サプリメントは補助的な役割です。バランスの取れた食事を基本として、不足分を補うようにしましょう。
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="text-xl font-bold mb-2">定期的な検査</h3>
                <p className="text-neutral-700">
                  鉄やビタミンDなどの血中濃度を定期的に検査し、適切な摂取量を調整することが重要です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-100 to-rose-100">
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
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
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
