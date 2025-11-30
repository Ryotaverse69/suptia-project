import Link from "next/link";
import { Metadata } from "next";
import {
  Dumbbell,
  AlertTriangle,
  ChevronRight,
  Zap,
  RefreshCw,
  Clock,
  Shield,
  Apple,
  Droplets,
  Trophy,
  Target,
  Activity,
} from "lucide-react";

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
    evidenceLevel: "S",
  },
  {
    name: "ホエイプロテイン",
    nameEn: "Whey Protein",
    slug: "whey-protein",
    description:
      "筋肉合成に必要なBCAAが豊富。トレーニング後の摂取が最も効果的。",
    dosage: "20〜25g/回",
    benefits: ["筋肉合成", "回復促進", "筋肉量維持"],
    evidenceLevel: "S",
  },
  {
    name: "ベータアラニン",
    nameEn: "Beta-Alanine",
    slug: "beta-alanine",
    description:
      "筋肉内のカルノシンを増やし、疲労を遅らせます。60〜240秒の運動に最適。",
    dosage: "3〜6g/日",
    benefits: ["持久力向上", "疲労軽減", "運動パフォーマンス向上"],
    evidenceLevel: "A",
  },
  {
    name: "BCAA",
    nameEn: "Branched-Chain Amino Acids",
    slug: "bcaa",
    description: "筋肉分解を抑制し、運動中のエネルギー源として利用されます。",
    dosage: "5〜10g/日",
    benefits: ["筋肉分解抑制", "疲労軽減", "回復促進"],
    evidenceLevel: "A",
  },
  {
    name: "HMB",
    nameEn: "HMB",
    slug: "hmb",
    description:
      "筋肉分解を防ぎ、筋力低下を抑制。トレーニング初心者や減量期に特に有効。",
    dosage: "3g/日",
    benefits: ["筋肉保護", "筋力維持", "回復促進"],
    evidenceLevel: "A",
  },
  {
    name: "カフェイン",
    nameEn: "Caffeine",
    slug: "caffeine",
    description: "運動前30〜60分の摂取で持久力と集中力が向上します。",
    dosage: "3〜6mg/kg体重",
    benefits: ["持久力向上", "集中力向上", "疲労感軽減"],
    evidenceLevel: "S",
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
    evidenceLevel: "A",
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description:
      "筋力と免疫機能の維持に重要。多くのアスリートが不足しています。",
    dosage: "1000〜4000IU/日",
    benefits: ["筋力維持", "免疫機能", "骨の健康"],
    evidenceLevel: "A",
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description: "筋肉の収縮と弛緩、エネルギー産生に不可欠。",
    dosage: "300〜400mg/日",
    benefits: ["筋肉機能", "疲労回復", "睡眠の質"],
    evidenceLevel: "A",
  },
];

const tips = [
  {
    icon: Clock,
    title: "タイミングが重要",
    description:
      "プロテインは運動後30分以内、クレアチンは毎日一定の時間、カフェインは運動前30〜60分に摂取することで効果が最大化されます。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "サードパーティ認証を確認",
    description:
      "NSF Certified for Sport、Informed-Sport、BSCG Certifiedなどの認証を受けた製品を選ぶことで、禁止物質混入のリスクを最小限に抑えられます。",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Apple,
    title: "基本が最優先",
    description:
      "サプリメントは補助的なものです。まずは十分な睡眠、バランスの取れた食事、適切なトレーニングプログラムを確立することが最も重要です。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Droplets,
    title: "水分補給も重要",
    description:
      "クレアチンやベータアラニンは筋肉内の水分量を増やします。十分な水分補給（1日3〜4L以上）を心がけ、パフォーマンスと安全性を確保しましょう。",
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

export default function AthletesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/guide/audiences"
              className="hover:text-blue-600 transition-colors"
            >
              対象者別ガイド
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-medium">アスリート向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[Dumbbell, Trophy, Target, Activity].map((Icon, i) => (
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
              <Dumbbell className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              アスリート向け
              <br className="md:hidden" />
              サプリメントガイド
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
              パフォーマンス向上と最適な回復のために
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              競技パフォーマンスの向上、筋力増強、回復促進に効果的な成分を
              科学的根拠に基づいてご紹介します。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {performanceIngredients.length}
                </div>
                <div className="text-sm text-white/80">パフォーマンス成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">
                  {recoveryIngredients.length}
                </div>
                <div className="text-sm text-white/80">回復促進成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-white/80">Sランク成分</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Doping Notice */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-lg mb-2">
                  アンチ・ドーピングについて
                </h3>
                <p className="text-blue-800 mb-2 leading-relaxed">
                  競技に参加するアスリートは、使用するサプリメントが世界アンチ・ドーピング機構（WADA）の禁止物質リストに含まれていないことを必ず確認してください。
                </p>
                <p className="text-blue-700 text-sm">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                パフォーマンス向上
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                パフォーマンス向上成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                トレーニング効果を最大化し、競技パフォーマンスを向上させる成分です。
              </p>
            </div>

            <div className="grid gap-4">
              {performanceIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-blue-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
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
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl px-5 py-4 md:min-w-[160px] text-center">
                        <div className="text-xs text-blue-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-blue-800">
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

      {/* Recovery Ingredients */}
      <section className="py-16 bg-gradient-to-b from-cyan-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <RefreshCw className="w-4 h-4" />
                回復促進
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                回復促進成分
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                トレーニング後の回復を早め、次のパフォーマンスに備える成分です。
              </p>
            </div>

            <div className="grid gap-4">
              {recoveryIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-neutral-100 hover:border-cyan-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-cyan-600 transition-colors">
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
                              className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-cyan-600 font-medium text-sm group-hover:text-cyan-700">
                          詳細を見る
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-xl px-5 py-4 md:min-w-[160px] text-center">
                        <div className="text-xs text-cyan-600 font-medium mb-1">
                          推奨摂取量
                        </div>
                        <div className="text-lg font-bold text-cyan-800">
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
                アスリートのサプリメント
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
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
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
