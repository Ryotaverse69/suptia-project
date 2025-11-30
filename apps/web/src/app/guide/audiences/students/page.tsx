import Link from "next/link";
import { Metadata } from "next";
import {
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Brain,
  Sparkles,
  Coffee,
  Moon,
  Apple,
  Coins,
  GraduationCap,
  Lightbulb,
  Target,
} from "lucide-react";

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
    evidenceLevel: "A",
  },
  {
    name: "カフェイン + L-テアニン",
    nameEn: "Caffeine + L-Theanine",
    slug: "caffeine",
    description:
      "カフェインの覚醒効果とL-テアニンのリラックス効果の組み合わせで、穏やかな集中力が得られます。",
    dosage: "カフェイン100mg + L-テアニン200mg",
    benefits: ["集中力向上", "覚醒効果", "不安軽減"],
    evidenceLevel: "A",
  },
  {
    name: "ビタミンB群",
    nameEn: "B-Complex Vitamins",
    slug: "vitamin-b-complex",
    description:
      "神経伝達物質の合成とエネルギー代謝に不可欠。ストレス対策にも有効。",
    dosage: "B1〜B12の総合タイプ",
    benefits: ["エネルギー産生", "集中力", "ストレス対策"],
    evidenceLevel: "A",
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description:
      "神経系の機能とストレス対策に重要。睡眠の質改善にも役立ちます。",
    dosage: "300〜400mg/日",
    benefits: ["ストレス軽減", "睡眠の質", "集中力"],
    evidenceLevel: "A",
  },
  {
    name: "ロディオラ",
    nameEn: "Rhodiola",
    slug: "rhodiola",
    description: "適応促進ハーブ。試験期間中のストレスと疲労を軽減します。",
    dosage: "200〜600mg/日",
    benefits: ["ストレス対策", "疲労軽減", "集中力向上"],
    evidenceLevel: "B",
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
  {
    name: "亜鉛",
    nameEn: "Zinc",
    slug: "zinc",
    description:
      "免疫機能と認知機能の維持に重要。食生活が不規則だと不足しやすい。",
    dosage: "8〜11mg/日",
    benefits: ["免疫機能", "認知機能", "皮膚の健康"],
    evidenceLevel: "A",
  },
];

const tips = [
  {
    icon: Coffee,
    title: "カフェインは適量で",
    description:
      "1日400mg（コーヒー約4杯分）を超えないようにしましょう。夕方以降の摂取は睡眠の質を低下させる可能性があります。L-テアニンとの併用がおすすめ。",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Moon,
    title: "睡眠を最優先に",
    description:
      "どんなサプリメントも睡眠不足の代わりにはなりません。試験前でも7〜8時間の睡眠を確保することで、記憶の定着と集中力が大幅に向上します。",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Apple,
    title: "食事が基本",
    description:
      "朝食を抜かず、魚、野菜、果物、全粒穀物をバランスよく摂取しましょう。特に朝食は学業パフォーマンスに大きく影響します。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Coins,
    title: "コスパ重視",
    description:
      "学生は予算に限りがあります。マルチビタミン、オメガ3、マグネシウムなど、コスパが良く効果が実証されている成分から始めましょう。",
    color: "from-blue-500 to-cyan-500",
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

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/guide/audiences"
              className="hover:text-indigo-600 transition-colors"
            >
              対象者別ガイド
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-medium">学生向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[BookOpen, GraduationCap, Lightbulb, Target].map((Icon, i) => (
              <Icon
                key={i}
                className="absolute text-white/10"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              学生向け
              <br className="md:hidden" />
              サプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
              学業のパフォーマンスを最大化する栄養サポート
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              集中力、記憶力、ストレス対策に効果的な成分を
              科学的根拠に基づいてご紹介します。試験期間を乗り切るために。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {cognitiveIngredients.length}
                </div>
                <div className="text-sm text-white/80">認知機能成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {lifestyleIngredients.length}
                </div>
                <div className="text-sm text-white/80">生活サポート成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
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
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-indigo-900 text-lg mb-2">
                  重要な注意事項
                </h3>
                <p className="text-indigo-800 mb-2 leading-relaxed">
                  サプリメントは補助的なものです。十分な睡眠、バランスの取れた食事、適度な運動が学業パフォーマンスの基本です。
                </p>
                <p className="text-indigo-700 text-sm">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Brain className="w-4 h-4" />
                認知機能サポート
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                認知機能サポート成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                集中力、記憶力、学習能力をサポートする成分です。
              </p>
            </div>

            <div className="grid gap-4">
              {cognitiveIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
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
                              className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl px-5 py-4 md:min-w-[180px] text-center">
                        <div className="text-xs text-indigo-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-indigo-800">
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

      {/* Lifestyle Ingredients */}
      <section className="py-16 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                生活サポート
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                生活サポート成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                免疫機能と全体的な健康をサポートする成分です。
              </p>
            </div>

            <div className="grid gap-4">
              {lifestyleIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-purple-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-purple-600 transition-colors">
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
                              className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-purple-600 font-medium text-sm group-hover:text-purple-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl px-5 py-4 md:min-w-[160px] text-center">
                        <div className="text-xs text-purple-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-purple-800">
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
                学生のサプリメント
                <br className="md:hidden" />
                使用のポイント
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
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
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
