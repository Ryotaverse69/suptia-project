import Link from "next/link";
import { Metadata } from "next";
import {
  Briefcase,
  AlertTriangle,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Moon,
  Utensils,
  Stethoscope,
  Target,
  Coffee,
  TrendingUp,
} from "lucide-react";

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
    evidenceLevel: "A",
  },
  {
    name: "カフェイン + L-テアニン",
    nameEn: "Caffeine + L-Theanine",
    slug: "caffeine",
    description:
      "カフェインの覚醒効果とL-テアニンのリラックス効果を組み合わせた、理想的な集中力ブースター。",
    dosage: "カフェイン100mg + L-テアニン200mg",
    benefits: ["集中力向上", "覚醒効果", "不安軽減"],
    evidenceLevel: "A",
  },
  {
    name: "ビタミンB群",
    nameEn: "B-Complex Vitamins",
    slug: "vitamin-b-complex",
    description:
      "エネルギー代謝と神経系の機能に不可欠。ストレス下で消費が増加します。",
    dosage: "B1〜B12の総合タイプ",
    benefits: ["エネルギー産生", "ストレス対策", "集中力"],
    evidenceLevel: "A",
  },
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description:
      "脳機能と心血管の健康をサポート。抗炎症作用によりストレス対策にも有効。",
    dosage: "1000〜2000mg/日",
    benefits: ["認知機能", "心血管保護", "抗炎症"],
    evidenceLevel: "A",
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description:
      "ストレス軽減と睡眠の質改善に重要。デスクワークで不足しやすい。",
    dosage: "300〜400mg/日",
    benefits: ["ストレス軽減", "睡眠の質", "筋肉の緊張緩和"],
    evidenceLevel: "A",
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
    evidenceLevel: "A",
  },
  {
    name: "CoQ10",
    nameEn: "Coenzyme Q10",
    slug: "coq10",
    description:
      "エネルギー産生と心血管の健康に重要。40歳以降は体内生成が減少します。",
    dosage: "100〜200mg/日",
    benefits: ["エネルギー産生", "心血管保護", "抗酸化"],
    evidenceLevel: "A",
  },
  {
    name: "プロバイオティクス",
    nameEn: "Probiotics",
    slug: "probiotics",
    description: "腸内環境の改善により、免疫機能と気分の調整をサポート。",
    dosage: "10億〜100億CFU/日",
    benefits: ["腸内環境", "免疫機能", "気分改善"],
    evidenceLevel: "A",
  },
];

const tips = [
  {
    icon: Clock,
    title: "朝のルーティン化",
    description:
      "ビタミンB群、ビタミンD、オメガ3は朝食と一緒に摂取。ロディオラやカフェイン+L-テアニンは仕事開始前に摂ることで、1日のパフォーマンスが向上します。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Moon,
    title: "睡眠を犠牲にしない",
    description:
      "どんなサプリメントも睡眠不足の代わりにはなりません。マグネシウムは夕食後に摂取し、質の高い睡眠を確保することが最も重要です。",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Utensils,
    title: "ランチを見直す",
    description:
      "外食やコンビニ弁当が多い方は、魚（オメガ3）、野菜、全粒穀物を意識的に選びましょう。午後のパフォーマンス低下を防げます。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Stethoscope,
    title: "定期的な健康診断",
    description:
      "ビタミンD、ビタミンB12、鉄などの血中濃度を定期的に検査し、不足している栄養素を特定することで、効果的にサプリメントを活用できます。",
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

export default function BusinessProfessionalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/guide/audiences"
              className="hover:text-slate-600 transition-colors"
            >
              対象者別ガイド
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-medium">
              ビジネスパーソン向け
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-slate-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[Briefcase, Target, TrendingUp, Coffee].map((Icon, i) => (
              <Icon
                key={i}
                className="absolute text-white/5"
                style={{
                  width: `${40 + i * 10}px`,
                  height: `${40 + i * 10}px`,
                  left: `${15 + i * 20}%`,
                  top: `${25 + (i % 2) * 30}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Briefcase className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              ビジネスパーソン向け
              <br className="md:hidden" />
              サプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
              仕事のパフォーマンスを最大化し、健康を維持する
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              長時間労働、ストレス、不規則な食事に対応した、
              科学的根拠に基づくサプリメントをご紹介します。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {performanceIngredients.length}
                </div>
                <div className="text-sm text-white/80">パフォーマンス成分</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {healthIngredients.length}
                </div>
                <div className="text-sm text-white/80">健康維持成分</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-white/80">実践ポイント</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  重要な注意事項
                </h3>
                <p className="text-slate-800 mb-2 leading-relaxed">
                  サプリメントは補助的なものです。十分な睡眠、バランスの取れた食事、適度な運動、ストレス管理が仕事のパフォーマンスと健康の基本です。
                </p>
                <p className="text-slate-700 text-sm">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                パフォーマンス向上
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                パフォーマンス向上成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                集中力、エネルギー、ストレス対策に効果的な成分です。
              </p>
            </div>

            <div className="grid gap-4">
              {performanceIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-slate-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-slate-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            ({ingredient.nameEn})
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-bold ${getEvidenceBadgeStyle(ingredient.evidenceLevel)}`}
                          >
                            {ingredient.evidenceLevel}ランク
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-4 leading-relaxed">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ingredient.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-slate-600 font-medium text-sm group-hover:text-slate-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 rounded-xl px-5 py-4 md:min-w-[180px] text-center">
                        <div className="text-xs text-slate-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-slate-800">
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

      {/* Health Ingredients */}
      <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                健康維持
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                健康維持成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                免疫機能と長期的な健康をサポートする成分です。
              </p>
            </div>

            <div className="grid gap-4">
              {healthIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-gray-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-gray-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            ({ingredient.nameEn})
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-bold ${getEvidenceBadgeStyle(ingredient.evidenceLevel)}`}
                          >
                            {ingredient.evidenceLevel}ランク
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-4 leading-relaxed">
                          {ingredient.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ingredient.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-gray-600 font-medium text-sm group-hover:text-gray-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 rounded-xl px-5 py-4 md:min-w-[160px] text-center">
                        <div className="text-xs text-gray-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-gray-800">
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

      {/* Tips Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                ビジネスパーソンの
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
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-500 to-gray-600 text-white px-8 py-4 rounded-full font-bold hover:from-slate-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl"
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
