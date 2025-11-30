import Link from "next/link";
import { Metadata } from "next";
import {
  Heart,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Pill,
  TestTube,
  Utensils,
  Clock,
  Activity,
  Brain,
  Bone,
} from "lucide-react";

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
    category: "骨・筋肉",
  },
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description:
      "骨粗しょう症予防に不可欠。ビタミンDと併用することで吸収率が向上します。",
    dosage: "1000〜1200mg/日",
    benefits: ["骨密度維持", "骨折予防", "骨粗しょう症予防"],
    category: "骨・筋肉",
  },
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description: "心血管の健康と認知機能の維持に重要。抗炎症作用もあります。",
    dosage: "1000〜2000mg/日",
    benefits: ["心血管保護", "認知機能維持", "抗炎症"],
    category: "心血管・脳",
  },
  {
    name: "ビタミンB12",
    nameEn: "Vitamin B12",
    slug: "vitamin-b12",
    description:
      "神経機能と造血に重要。高齢者は胃酸分泌低下により吸収が困難になります。",
    dosage: "2.4〜100μg/日",
    benefits: ["神経機能", "貧血予防", "認知機能維持"],
    category: "神経・血液",
  },
  {
    name: "コエンザイムQ10",
    nameEn: "CoQ10",
    slug: "coq10",
    description:
      "心臓の健康とエネルギー産生に重要。加齢とともに体内生成が減少します。",
    dosage: "100〜200mg/日",
    benefits: ["心機能サポート", "エネルギー産生", "抗酸化"],
    category: "心血管・エネルギー",
  },
  {
    name: "ビタミンK2",
    nameEn: "Vitamin K2",
    slug: "vitamin-k2",
    description: "カルシウムを骨に定着させる働きがあり、動脈石灰化を防ぎます。",
    dosage: "90〜180μg/日",
    benefits: ["骨密度向上", "血管の健康", "カルシウム代謝"],
    category: "骨・血管",
  },
];

const cautionIngredients = [
  {
    name: "高用量ビタミンA",
    slug: "vitamin-a",
    reason: "高齢者では骨折リスクを高める可能性。β-カロテンは安全。",
    maxDosage: "900μg/日以下",
    riskLevel: "高",
  },
  {
    name: "高用量鉄",
    slug: "iron",
    reason:
      "鉄欠乏性貧血と診断されていない限り、過剰摂取は酸化ストレスを増加させます。",
    maxDosage: "医師の指示がない限り避ける",
    riskLevel: "高",
  },
  {
    name: "ギンコビロバ（高用量）",
    slug: "ginkgo-biloba",
    reason: "抗凝固薬との相互作用リスク。出血傾向を高める可能性。",
    maxDosage: "医師に相談",
    riskLevel: "中",
  },
];

const tips = [
  {
    icon: Pill,
    title: "薬との相互作用に注意",
    description:
      "処方薬や市販薬との相互作用が起こりやすいため、必ず医師や薬剤師に相談してから使用を開始してください。特に抗凝固薬との併用には注意が必要です。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TestTube,
    title: "定期的な血液検査",
    description:
      "ビタミンD、ビタミンB12、鉄などの血中濃度を定期的に検査し、不足や過剰を避けましょう。医師の指導のもとで適切な量を調整することが重要です。",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Utensils,
    title: "食事と併用",
    description:
      "脂溶性ビタミン（D、K）は食事と一緒に摂取すると吸収率が向上します。また、カルシウムとマグネシウムはバランスよく摂取することが重要です。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "継続的な摂取",
    description:
      "サプリメントの効果は数週間から数ヶ月かけて現れます。短期間で判断せず、医師の指導のもと継続的に摂取することが大切です。",
    color: "from-amber-500 to-orange-500",
  },
];

const healthCategories = [
  {
    icon: Bone,
    name: "骨の健康",
    description: "骨密度維持と骨折予防",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Heart,
    name: "心血管の健康",
    description: "心臓と血管の機能維持",
    color: "from-red-400 to-rose-500",
  },
  {
    icon: Brain,
    name: "認知機能",
    description: "脳の健康と記憶力維持",
    color: "from-purple-400 to-indigo-500",
  },
  {
    icon: Activity,
    name: "エネルギー",
    description: "活力と疲労回復",
    color: "from-green-400 to-emerald-500",
  },
];

export default function SeniorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/guide/audiences"
              className="hover:text-amber-600 transition-colors"
            >
              対象者別ガイド
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-medium">高齢者向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Heart className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              高齢者向け
              <br className="md:hidden" />
              サプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
              健康寿命を延ばすための栄養サポート
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              加齢に伴う栄養吸収の低下や慢性疾患のリスクに対応した、
              科学的根拠に基づくサプリメントをご紹介します。
            </p>

            {/* Health Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {healthCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl mb-2`}
                  >
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-bold">{category.name}</div>
                  <div className="text-xs text-white/70">
                    {category.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 text-lg mb-2">
                  重要な注意事項
                </h3>
                <p className="text-orange-800 mb-2 leading-relaxed">
                  既に処方薬を服用している場合、サプリメントとの相互作用が懸念されます。必ず医師または薬剤師に相談してから使用してください。
                </p>
                <p className="text-orange-700 text-sm">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                科学的根拠のある成分
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                推奨される成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                高齢者の健康維持に効果的とされる成分です。医師の指導のもと適切に摂取しましょう。
              </p>
            </div>

            <div className="grid gap-4">
              {recommendedIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-amber-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            ({ingredient.nameEn})
                          </span>
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                            {ingredient.category}
                          </span>
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
                        <div className="flex items-center text-amber-600 font-medium text-sm group-hover:text-amber-700">
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

      {/* Caution Ingredients */}
      <section className="py-16 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <AlertCircle className="w-4 h-4" />
                注意が必要
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                注意が必要な成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                高齢者では特に注意が必要な成分です。使用前に必ず医師に相談してください。
              </p>
            </div>

            <div className="grid gap-3">
              {cautionIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 border-orange-400 hover:border-orange-500 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                            {ingredient.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              ingredient.riskLevel === "高"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
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
                        <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-2 text-center">
                          <div className="text-xs text-orange-600 font-medium">
                            推奨
                          </div>
                          <div className="text-sm font-bold text-orange-800">
                            {ingredient.maxDosage}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
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
                高齢者のサプリメント
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
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
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
