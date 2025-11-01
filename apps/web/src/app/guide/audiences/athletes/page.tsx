import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "アスリート向けサプリメントガイド | Suptia",
  description:
    "パフォーマンス向上と回復促進に効果的なサプリメントを科学的根拠に基づいて解説。筋力、持久力、回復力をサポートする成分をご紹介します。",
};

const performanceIngredients = [
  {
    name: "クレアチン",
    nameEn: "Creatine",
    slug: "creatine",
    description:
      "高強度トレーニングのパフォーマンス向上に最も効果が実証されている成分。",
    dosage: "3〜5g/日（維持期）",
    benefits: ["筋力向上", "瞬発力向上", "筋肉量増加"],
  },
  {
    name: "ホエイプロテイン",
    nameEn: "Whey Protein",
    slug: "whey-protein",
    description:
      "筋肉合成に必要なBCAAが豊富。トレーニング後の摂取が最も効果的。",
    dosage: "20〜25g/回",
    benefits: ["筋肉合成", "回復促進", "筋肉量維持"],
  },
  {
    name: "ベータアラニン",
    nameEn: "Beta-Alanine",
    slug: "beta-alanine",
    description:
      "筋肉内のカルノシンを増やし、疲労を遅らせます。60〜240秒の運動に最適。",
    dosage: "3〜6g/日",
    benefits: ["持久力向上", "疲労軽減", "運動パフォーマンス向上"],
  },
  {
    name: "BCAA",
    nameEn: "Branched-Chain Amino Acids",
    slug: "bcaa",
    description: "筋肉分解を抑制し、運動中のエネルギー源として利用されます。",
    dosage: "5〜10g/日",
    benefits: ["筋肉分解抑制", "疲労軽減", "回復促進"],
  },
  {
    name: "HMB",
    nameEn: "HMB",
    slug: "hmb",
    description:
      "筋肉分解を防ぎ、筋力低下を抑制。トレーニング初心者や減量期に特に有効。",
    dosage: "3g/日",
    benefits: ["筋肉保護", "筋力維持", "回復促進"],
  },
  {
    name: "カフェイン",
    nameEn: "Caffeine",
    slug: "caffeine",
    description: "運動前30〜60分の摂取で持久力と集中力が向上します。",
    dosage: "3〜6mg/kg体重",
    benefits: ["持久力向上", "集中力向上", "疲労感軽減"],
  },
];

const recoveryIngredients = [
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3",
    slug: "omega-3",
    description: "運動後の炎症を軽減し、回復を促進します。",
    dosage: "1〜2g/日",
    benefits: ["炎症軽減", "回復促進", "関節保護"],
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description:
      "筋力と免疫機能の維持に重要。多くのアスリートが不足しています。",
    dosage: "1000〜4000IU/日",
    benefits: ["筋力維持", "免疫機能", "骨の健康"],
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description: "筋肉の収縮と弛緩、エネルギー産生に不可欠。",
    dosage: "300〜400mg/日",
    benefits: ["筋肉機能", "疲労回復", "睡眠の質"],
  },
];

export default function AthletesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
            <span className="text-neutral-900">アスリート向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🏃</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              アスリート向けサプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              パフォーマンス向上と最適な回復のために
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              競技パフォーマンスの向上、筋力増強、回復促進に効果的な成分を科学的根拠に基づいてご紹介します。
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5"
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
                <h3 className="font-bold text-blue-900 mb-2">
                  アンチ・ドーピングについて
                </h3>
                <p className="text-blue-800 mb-2">
                  競技に参加するアスリートは、使用するサプリメントが世界アンチ・ドーピング機構（WADA）の禁止物質リストに含まれていないことを必ず確認してください。
                </p>
                <p className="text-blue-800">
                  信頼できるサードパーティ認証（NSF Certified for
                  Sport、Informed-Sportなど）を受けた製品の使用を推奨します。
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
              💪 パフォーマンス向上成分
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
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-blue-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-blue-900">
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

      {/* Recovery Ingredients */}
      <section className="py-16 bg-gradient-to-b from-cyan-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🔄 回復促進成分
            </h2>
            <div className="grid gap-6">
              {recoveryIngredients.map((ingredient) => (
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
                            className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
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
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3 md:min-w-[180px]">
                      <div className="text-xs text-cyan-700 font-medium mb-1">
                        推奨摂取量
                      </div>
                      <div className="text-lg font-bold text-cyan-900">
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
              アスリートのサプリメント使用のポイント
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="text-xl font-bold mb-2">タイミングが重要</h3>
                <p className="text-neutral-700">
                  プロテインは運動後30分以内、クレアチンは毎日一定の時間、カフェインは運動前30〜60分に摂取することで効果が最大化されます。
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-xl font-bold mb-2">
                  サードパーティ認証を確認
                </h3>
                <p className="text-neutral-700">
                  NSF Certified for Sport、Informed-Sport、BSCG
                  Certifiedなどの認証を受けた製品を選ぶことで、禁止物質混入のリスクを最小限に抑えられます。
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">基本が最優先</h3>
                <p className="text-neutral-700">
                  サプリメントは補助的なものです。まずは十分な睡眠、バランスの取れた食事、適切なトレーニングプログラムを確立することが最も重要です。
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">💧</div>
                <h3 className="text-xl font-bold mb-2">水分補給も重要</h3>
                <p className="text-neutral-700">
                  クレアチンやベータアラニンは筋肉内の水分量を増やします。十分な水分補給（1日3〜4L以上）を心がけ、パフォーマンスと安全性を確保しましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-cyan-100">
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
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
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
