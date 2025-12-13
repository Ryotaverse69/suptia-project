import Link from "next/link";
import { Metadata } from "next";
import {
  Flower2,
  ChevronRight,
  AlertTriangle,
  Bone,
  Heart,
  Shield,
  Clock,
  Activity,
  Pill,
  Lightbulb,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
    evidenceLevel: "A",
  },
  {
    name: "ブラックコホシュ",
    nameEn: "Black Cohosh",
    slug: "black-cohosh",
    description:
      "欧州で広く使用されるハーブ。ほてりや気分の変動に効果があります。",
    dosage: "40〜80mg/日",
    benefits: ["ほてり軽減", "気分安定", "睡眠の質"],
    evidenceLevel: "A",
  },
  {
    name: "レッドクローバー",
    nameEn: "Red Clover",
    slug: "red-clover",
    description: "イソフラボンが豊富なハーブ。更年期症状全般に穏やかな効果。",
    dosage: "40〜80mg/日",
    benefits: ["ほてり軽減", "心血管保護", "骨の健康"],
    evidenceLevel: "B",
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
    evidenceLevel: "S",
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "カルシウム吸収に必須。骨密度と筋力の維持に重要です。",
    dosage: "800〜2000IU/日",
    benefits: ["カルシウム吸収", "骨密度維持", "筋力維持"],
    evidenceLevel: "S",
  },
  {
    name: "ビタミンK2",
    nameEn: "Vitamin K2",
    slug: "vitamin-k2",
    description: "カルシウムを骨に定着させ、血管の石灰化を防ぎます。",
    dosage: "90〜180μg/日",
    benefits: ["骨密度向上", "血管の健康", "カルシウム代謝"],
    evidenceLevel: "A",
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description: "カルシウムと協働して骨の健康を維持。ストレス軽減にも有効。",
    dosage: "300〜400mg/日",
    benefits: ["骨の健康", "ストレス軽減", "睡眠の質"],
    evidenceLevel: "A",
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
    evidenceLevel: "S",
  },
  {
    name: "コエンザイムQ10",
    nameEn: "CoQ10",
    slug: "coq10",
    description: "心臓の健康とエネルギー産生に重要。加齢とともに減少します。",
    dosage: "100〜200mg/日",
    benefits: ["心機能サポート", "エネルギー産生", "抗酸化"],
    evidenceLevel: "A",
  },
];

const healthCategories = [
  {
    icon: Flower2,
    name: "ホルモンバランス",
    description: "ほてり・発汗の緩和",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Bone,
    name: "骨の健康",
    description: "骨密度維持・骨粗しょう症予防",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Heart,
    name: "心血管の健康",
    description: "心疾患リスク低減",
    color: "from-red-400 to-rose-500",
  },
  {
    icon: Activity,
    name: "全身の活力",
    description: "エネルギー・ストレス管理",
    color: "from-purple-400 to-indigo-500",
  },
];

const tips = [
  {
    icon: Clock,
    title: "効果が現れるまで時間がかかる",
    description:
      "イソフラボンやブラックコホシュは、効果が現れるまで4〜8週間かかります。すぐに諦めず、継続的に摂取することが重要です。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Pill,
    title: "カルシウム+ビタミンD+K2の組み合わせ",
    description:
      "骨密度維持には、カルシウム、ビタミンD、ビタミンK2を組み合わせることで相乗効果が得られます。1つだけでは不十分です。",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Activity,
    title: "運動も重要",
    description:
      "サプリメントだけでは骨密度の低下は防げません。ウォーキングやレジスタンストレーニングなど、骨に負荷がかかる運動を週3回以上行いましょう。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Stethoscope,
    title: "定期的な骨密度検査",
    description:
      "更年期以降は2年に1回、骨密度検査（DEXA法）を受けることで、骨粗しょう症の進行を早期に発見し、適切な対策を講じられます。",
    color: "from-amber-500 to-orange-500",
  },
];

const getEvidenceBadgeStyle = (level: string) => {
  switch (level) {
    case "S":
      return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
    case "A":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    case "B":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    default:
      return "bg-neutral-200 text-neutral-700";
  }
};

export default function MenopausePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Sticky Breadcrumb */}
      <div
        className={`sticky top-0 z-40 ${liquidGlassClasses.light}`}
        style={{
          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
        }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-[15px]">
            <Link
              href="/"
              className="transition-colors"
              style={{ color: appleWebColors.textSecondary }}
            >
              ホーム
            </Link>
            <ChevronRight
              className="w-4 h-4"
              style={{ color: appleWebColors.textTertiary }}
            />
            <Link
              href="/guide/audiences"
              className="transition-colors"
              style={{ color: appleWebColors.textSecondary }}
            >
              対象者別ガイド
            </Link>
            <ChevronRight
              className="w-4 h-4"
              style={{ color: appleWebColors.textTertiary }}
            />
            <span
              className="font-medium"
              style={{ color: appleWebColors.textPrimary }}
            >
              更年期の方向け
            </span>
          </div>
        </div>
      </div>

      {/* Animated Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-rose-300/15 rounded-full blur-2xl animate-pulse delay-500" />

          {/* Floating Icons */}
          <Flower2 className="absolute top-20 right-[15%] w-8 h-8 text-white/20 animate-bounce" />
          <Heart className="absolute bottom-32 left-[20%] w-6 h-6 text-white/15 animate-bounce delay-300" />
          <Activity className="absolute bottom-20 right-[25%] w-6 h-6 text-white/15 animate-bounce delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm mb-6 shadow-xl">
              <Flower2 className="w-10 h-10" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              更年期の方向け
              <br className="md:hidden" />
              サプリメントガイド
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-4">
              更年期を快適に過ごすための栄養サポート
            </p>

            <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10">
              ホルモンバランスの変化に伴う症状を緩和し、
              <br className="hidden md:block" />
              骨密度と心血管の健康を維持する成分を科学的根拠に基づいてご紹介します。
            </p>

            {/* Stats Highlight */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {healthCategories.map((category, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 border border-white/20 ${liquidGlassClasses.light}`}
                >
                  <div
                    className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
                  >
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold">{category.name}</div>
                  <div className="text-xs text-white/70">
                    {category.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-rose-50">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-500 p-6 rounded-r-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-900 text-lg mb-2">
                    重要な注意事項
                  </h3>
                  <p className="text-rose-800 mb-3 leading-relaxed">
                    更年期の症状が日常生活に大きく影響している場合は、サプリメントだけでなく、婦人科医に相談してホルモン補充療法（HRT）などの医療的介入も検討してください。
                  </p>
                  <p className="text-rose-700 leading-relaxed">
                    乳がんや子宮がんの既往歴がある方は、植物性エストロゲン（イソフラボンなど）の使用前に必ず医師に相談してください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hormone Balance Ingredients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4 shadow-lg">
                <Flower2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                ホルモンバランスサポート成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                ほてり、発汗、気分の変動など、更年期特有の症状を和らげる成分
              </p>
            </div>

            <div className="grid gap-6">
              {hormoneIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-rose-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            {ingredient.nameEn}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getEvidenceBadgeStyle(ingredient.evidenceLevel)}`}
                          >
                            {ingredient.evidenceLevel}ランク
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-4 leading-relaxed">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ingredient.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-xl px-5 py-3 text-center">
                          <div className="text-xs text-rose-600 font-medium mb-1">
                            推奨摂取量
                          </div>
                          <div className="text-lg font-bold text-rose-900">
                            {ingredient.dosage}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
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
      <section className="py-16 bg-gradient-to-b from-white to-amber-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-4 shadow-lg">
                <Bone className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                骨の健康サポート成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                エストロゲン低下による骨密度減少を防ぎ、骨粗しょう症を予防する成分
              </p>
            </div>

            <div className="grid gap-6">
              {boneHealthIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-amber-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            {ingredient.nameEn}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getEvidenceBadgeStyle(ingredient.evidenceLevel)}`}
                          >
                            {ingredient.evidenceLevel}ランク
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-4 leading-relaxed">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ingredient.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl px-5 py-3 text-center">
                          <div className="text-xs text-amber-600 font-medium mb-1">
                            推奨摂取量
                          </div>
                          <div className="text-lg font-bold text-amber-900">
                            {ingredient.dosage}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
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
      <section className="py-16 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 text-white mb-4 shadow-lg">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                心血管の健康サポート成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                更年期以降に増加する心血管疾患リスクを軽減する成分
              </p>
            </div>

            <div className="grid gap-6">
              {cardiovascularIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-red-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            {ingredient.nameEn}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getEvidenceBadgeStyle(ingredient.evidenceLevel)}`}
                          >
                            {ingredient.evidenceLevel}ランク
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-4 leading-relaxed">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ingredient.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-xl px-5 py-3 text-center">
                          <div className="text-xs text-red-600 font-medium mb-1">
                            推奨摂取量
                          </div>
                          <div className="text-lg font-bold text-red-900">
                            {ingredient.dosage}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
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
      <section className="py-16 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4 shadow-lg">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                更年期のサプリメント使用のポイント
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                効果的にサプリメントを活用するための重要なアドバイス
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} text-white mb-4 shadow-md`}
                  >
                    <tip.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              さらに詳しい成分情報を確認
            </h2>
            <p className="text-xl text-white/85 mb-10">
              各成分の詳細ページで、効果、摂取方法、副作用、
              <br className="hidden md:block" />
              相互作用などの詳しい情報をご覧いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-full font-bold hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                成分一覧を見る
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/guide/audiences"
                className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/25 transition-all border border-white/30"
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
