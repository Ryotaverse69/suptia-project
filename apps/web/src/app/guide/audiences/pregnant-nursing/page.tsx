import Link from "next/link";
import { Metadata } from "next";
import {
  Heart,
  AlertTriangle,
  Baby,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Pill,
  Apple,
  Stethoscope,
  Calendar,
} from "lucide-react";

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
    priority: "必須",
  },
  {
    name: "鉄",
    nameEn: "Iron",
    slug: "iron",
    description: "貧血予防と胎児の成長に重要。妊娠中は需要が増加します。",
    dosage: "27mg/日（妊娠中）",
    benefits: ["貧血予防", "酸素運搬", "エネルギー産生"],
    priority: "必須",
  },
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description: "母体の骨密度維持と胎児の骨形成に必要。",
    dosage: "1000mg/日",
    benefits: ["骨形成", "筋肉機能", "神経伝達"],
    priority: "推奨",
  },
  {
    name: "オメガ3（DHA/EPA）",
    nameEn: "Omega-3 (DHA/EPA)",
    slug: "omega-3",
    description: "胎児の脳と目の発達に重要。魚由来が推奨されます。",
    dosage: "DHA 200〜300mg/日",
    benefits: ["脳発達", "視覚発達", "炎症軽減"],
    priority: "推奨",
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "カルシウム吸収と免疫機能をサポート。",
    dosage: "600〜800IU/日",
    benefits: ["カルシウム吸収", "骨の健康", "免疫機能"],
    priority: "推奨",
  },
  {
    name: "ビタミンB6",
    nameEn: "Vitamin B6",
    slug: "vitamin-b6",
    description: "つわりの軽減に効果的。タンパク質代謝にも重要。",
    dosage: "1.9mg/日",
    benefits: ["つわり軽減", "タンパク質代謝", "神経機能"],
    priority: "推奨",
  },
];

const avoidIngredients = [
  {
    name: "ビタミンA（レチノール）",
    slug: "vitamin-a",
    reason: "高用量で催奇形性のリスク。β-カロテンは安全。",
    maxDosage: "3000μg/日以下",
    riskLevel: "高",
  },
  {
    name: "L-テアニン",
    slug: "l-theanine",
    reason: "妊娠・授乳中の安全性データ不足。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "GABA",
    slug: "gaba",
    reason: "妊娠・授乳中の安全性データ不足。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "バレリアン",
    slug: "valerian",
    reason: "妊娠・授乳中の安全性が確立されていない。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "エルダーベリー",
    slug: "elderberry",
    reason: "妊娠・授乳中の十分な安全性データがない。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "エキナセア",
    slug: "echinacea",
    reason: "免疫系への影響が不明確。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "HMB",
    slug: "hmb",
    reason: "妊娠・授乳中の安全性データが不十分。",
    maxDosage: "使用を避ける",
    riskLevel: "低",
  },
  {
    name: "ベータアラニン",
    slug: "beta-alanine",
    reason: "妊娠・授乳中の安全性データが不十分。",
    maxDosage: "使用を避ける",
    riskLevel: "低",
  },
  {
    name: "ロディオラ",
    slug: "rhodiola",
    reason: "妊娠・授乳中の安全性が確立されていない。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
];

const tips = [
  {
    icon: Calendar,
    title: "妊娠前から準備",
    description:
      "葉酸は妊娠前1ヶ月から摂取を開始することが推奨されています。計画的な栄養補給が重要です。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Pill,
    title: "プレナタルビタミン優先",
    description:
      "妊婦用マルチビタミン（プレナタルビタミン）を基本とし、個別のサプリメントは医師と相談の上で追加してください。",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Apple,
    title: "食事からの摂取を優先",
    description:
      "サプリメントは補助的な役割です。バランスの取れた食事を基本として、不足分を補うようにしましょう。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Stethoscope,
    title: "定期的な検査",
    description:
      "鉄やビタミンDなどの血中濃度を定期的に検査し、適切な摂取量を調整することが重要です。",
    color: "from-amber-500 to-orange-500",
  },
];

export default function PregnantNursingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/guide/audiences"
              className="hover:text-pink-600 transition-colors"
            >
              対象者別ガイド
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-medium">
              妊婦・授乳婦向け
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          {/* Floating Hearts */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Heart
                key={i}
                className="absolute text-white/10 animate-float"
                style={{
                  width: `${20 + i * 8}px`,
                  height: `${20 + i * 8}px`,
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Baby className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              妊婦・授乳婦向け
              <br className="md:hidden" />
              サプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
              母体と赤ちゃんの健康を守るための安全な栄養補給
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              妊娠・授乳期は栄養需要が大幅に増加する時期です。
              安全で効果的な成分を科学的根拠に基づいてご紹介します。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {safeIngredients.length}
                </div>
                <div className="text-sm text-white/80">安全な成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {avoidIngredients.length}
                </div>
                <div className="text-sm text-white/80">注意成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">2</div>
                <div className="text-sm text-white/80">必須成分</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-2">
                  重要な注意事項
                </h3>
                <p className="text-red-800 mb-2 leading-relaxed">
                  妊娠中・授乳中のサプリメント使用は、必ず医師または助産師に相談してから開始してください。
                </p>
                <p className="text-red-700 text-sm">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                安全性が確認された成分
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                安全で推奨される成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                妊娠・授乳期に推奨される栄養素です。医師の指導のもと適切に摂取しましょう。
              </p>
            </div>

            <div className="grid gap-4">
              {safeIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-green-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-green-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            ({ingredient.nameEn})
                          </span>
                          {ingredient.priority === "必須" && (
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              必須
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 mb-4 leading-relaxed">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ingredient.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-pink-600 font-medium text-sm group-hover:text-pink-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl px-5 py-4 md:min-w-[160px] text-center">
                        <div className="text-xs text-green-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-green-800">
                          {ingredient.dosage}
                        </div>
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
      <section className="py-16 bg-gradient-to-b from-red-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <XCircle className="w-4 h-4" />
                注意が必要な成分
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                避けるべき成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                妊娠・授乳期には安全性が確認されていないか、リスクがある成分です。
              </p>
            </div>

            <div className="grid gap-3">
              {avoidIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 border-red-400 hover:border-red-500 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-pink-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              ingredient.riskLevel === "高"
                                ? "bg-red-100 text-red-700"
                                : ingredient.riskLevel === "中"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            リスク: {ingredient.riskLevel}
                          </span>
                        </div>
                        <p className="text-neutral-600 text-sm">
                          <span className="font-medium text-neutral-700">
                            理由:
                          </span>{" "}
                          {ingredient.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-center">
                          <div className="text-xs text-red-600 font-medium">
                            推奨
                          </div>
                          <div className="text-sm font-bold text-red-800">
                            {ingredient.maxDosage}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                妊娠・授乳期の
                <br className="md:hidden" />
                サプリメント使用のポイント
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-neutral-100"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${tip.color} rounded-xl mb-4`}
                  >
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
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

      {/* Related Guides */}
      <section className="py-16 bg-gradient-to-br from-neutral-900 to-neutral-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              さらに詳しい成分情報を確認
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              各成分の詳細ページで、効果、摂取方法、副作用、相互作用などの詳しい情報をご覧いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
              >
                成分一覧を見る
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/guide/audiences"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
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
