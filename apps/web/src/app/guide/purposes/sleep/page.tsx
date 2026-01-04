import { Metadata } from "next";
import Link from "next/link";
import {
  Moon,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Star,
  Beaker,
  Clock,
  ChevronRight,
  CloudMoon,
  MessageCircle,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  tierColors,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title:
    "睡眠改善サプリガイド｜科学的根拠に基づく睡眠サプリの選び方 - サプティア",
  description:
    "睡眠の質向上、入眠促進、深い眠りに効果的なサプリメントを科学的根拠に基づいて解説。メラトニン、マグネシウム、GABA、テアニンなど、本当に効果のある睡眠サプリの選び方。",
  keywords: [
    "睡眠改善",
    "不眠症",
    "メラトニン",
    "マグネシウム",
    "GABA",
    "テアニン",
    "グリシン",
  ],
};

const ingredients = [
  {
    name: "メラトニン",
    evidenceLevel: "S" as const,
    description:
      "睡眠ホルモンとして知られ、体内時計の調整に重要。入眠時間の短縮と時差ボケ改善に最も効果が実証されている成分です。",
    dosage: "就寝30分〜1時間前に0.5〜5mg（低用量から開始推奨）",
    slug: "melatonin",
  },
  {
    name: "マグネシウム",
    evidenceLevel: "A" as const,
    description:
      "神経系のリラックスを促進し、睡眠の質を向上。GABA受容体を活性化し、深い眠りをサポートします。グリシン酸マグネシウムが吸収率良好。",
    dosage: "就寝1〜2時間前に200〜400mg（グリシン酸塩またはクエン酸塩）",
    slug: "magnesium",
  },
  {
    name: "L-テアニン",
    evidenceLevel: "A" as const,
    description:
      "緑茶に含まれるアミノ酸。リラックス効果を持ちながら眠気を引き起こさず、睡眠の質を向上。ストレス軽減にも有効です。",
    dosage: "就寝前に200〜400mg（日中のストレス軽減には100〜200mg）",
    slug: "l-theanine",
  },
  {
    name: "グリシン",
    evidenceLevel: "A" as const,
    description:
      "抑制性神経伝達物質。体温を下げて深部睡眠を促進し、睡眠の質と翌朝の疲労感改善に効果が確認されています。",
    dosage: "就寝前に3g（粉末を水に溶かして摂取）",
    slug: "glycine",
  },
  {
    name: "GABA（γ-アミノ酪酸）",
    evidenceLevel: "B" as const,
    description:
      "主要な抑制性神経伝達物質。リラックス効果と抗不安作用があり、入眠をスムーズにします。経口摂取での脳への到達は限定的との指摘もあります。",
    dosage: "就寝前に100〜300mg（ストレス軽減には50〜100mg）",
    slug: "gaba",
  },
  {
    name: "バレリアン（セイヨウカノコソウ）",
    evidenceLevel: "B" as const,
    description:
      "伝統的な睡眠ハーブ。GABA濃度を高める作用があり、入眠時間の短縮と睡眠の質向上に効果。ただし個人差が大きい。",
    dosage: "就寝1〜2時間前に300〜600mg（抽出物として）",
    slug: "valerian",
  },
];

const combinations = [
  {
    title: "メラトニン + マグネシウム",
    description:
      "入眠促進と深い眠りの両方をサポート。メラトニンが睡眠リズムを整え、マグネシウムが神経をリラックスさせます。",
    icon: "🌙",
  },
  {
    title: "L-テアニン + グリシン",
    description:
      "リラックス効果と深部睡眠促進のダブルアプローチ。ストレス軽減と睡眠の質向上に最適。",
    icon: "✨",
  },
  {
    title: "マグネシウム + ビタミンB6",
    description:
      "マグネシウムの吸収を高め、神経伝達物質の合成をサポート。相乗効果で睡眠の質を向上。",
    icon: "💫",
  },
];

const cautions = [
  {
    title: "睡眠衛生も重要",
    description:
      "サプリメントは補助です。規則正しい就寝時間、適度な運動、就寝前のブルーライト制限などの睡眠衛生も並行して改善しましょう。",
  },
  {
    title: "メラトニンは低用量から",
    description:
      "メラトニンは0.5mgでも効果があります。高用量（5mg以上）は翌朝の眠気や頭痛を引き起こす可能性があります。",
  },
  {
    title: "睡眠薬との併用は医師に相談",
    description:
      "処方睡眠薬や抗不安薬と併用する場合は、必ず医師に相談してください。相互作用により過度の鎮静作用が起こる可能性があります。",
  },
];

export default function SleepGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 py-20 lg:py-28">
        {/* 背景アニメーション */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-indigo-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-purple-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift animation-delay-2000" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-mist-flow" />
          {/* 星のエフェクト */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse animation-delay-1000" />
          <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-white/50 rounded-full animate-pulse animation-delay-2000" />
        </div>

        <div className="relative mx-auto px-6 lg:px-12 xl:px-16 max-w-[1200px]">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-indigo-100 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/guide/purposes"
              className="hover:text-white transition-colors"
            >
              目的別ガイド
            </Link>
            <ChevronRight size={16} />
            <span className="text-white font-medium">睡眠改善</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl">
                  <Moon size={40} className="text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-2">
                    目的別ガイド
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    睡眠改善サプリガイド
                  </h1>
                </div>
              </div>
              <p className="text-xl text-indigo-100 max-w-2xl leading-relaxed">
                科学的根拠に基づいて、本当に効果のある睡眠サプリメントを選びましょう。
                質の高い睡眠で、心身の回復と健康維持をサポートする。
              </p>
            </div>

            {/* 統計ハイライト */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-indigo-100 text-sm">厳選成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">1</div>
                <div className="text-indigo-100 text-sm">Sランク成分</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BookOpen className="text-indigo-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  睡眠サプリの基礎知識
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  睡眠は心身の健康維持に不可欠ですが、現代人の多くが睡眠の質に悩んでいます。
                  適切なサプリメントは、入眠をスムーズにし、深い眠りをサポートし、翌朝の目覚めを改善する助けになります。
                </p>
                <p className="text-gray-900 font-semibold mt-3 flex items-center gap-2">
                  <CloudMoon size={18} className="text-indigo-500" />
                  科学的に効果が確認された成分を選ぶことで、自然な睡眠リズムを取り戻すことができます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 睡眠改善に効果的な成分 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Beaker className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              睡眠改善に効果的な主要成分
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.slug}
                className={`group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">
                      {ingredient.name}
                    </h3>
                  </div>
                  <span
                    className="px-3 py-1 text-sm font-bold rounded-full"
                    style={{
                      backgroundColor: tierColors[ingredient.evidenceLevel].bg,
                      color: tierColors[ingredient.evidenceLevel].text,
                    }}
                  >
                    {ingredient.evidenceLevel}ランク
                  </span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {ingredient.description}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="font-semibold text-gray-900 text-sm">
                      推奨摂取量
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{ingredient.dosage}</p>
                </div>

                <Link
                  href={`/ingredients/${ingredient.slug}`}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm group-hover:gap-3 transition-all"
                >
                  詳細を見る
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="text-purple-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              相乗効果のある組み合わせ
            </h2>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 border border-indigo-200 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">🌙</span>
              <h3 className="text-xl font-bold text-indigo-900">
                ベストコンビネーション
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {combinations.map((combo, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="text-2xl mb-3">{combo.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {combo.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {combo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 注意事項 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="text-amber-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">摂取時の注意点</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <div className="space-y-4">
              {cautions.map((caution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white rounded-xl p-4"
                >
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <AlertTriangle className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">
                      {caution.title}
                    </h3>
                    <p className="text-amber-800 text-sm">
                      {caution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 関連ガイド */}
        <section>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">次のステップ</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/concierge"
                className="group p-5 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl hover:from-blue-500/30 hover:to-indigo-500/30 transition-all border border-blue-400/20"
              >
                <MessageCircle size={20} className="mb-2 text-blue-300" />
                <h4 className="font-bold mb-2 group-hover:text-blue-300 transition-colors">
                  AIに相談する
                </h4>
                <p className="text-gray-300 text-sm">
                  悩みを伝えて最適な提案を受ける
                </p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/guide/purposes"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                  目的別ガイド
                </h4>
                <p className="text-gray-300 text-sm">他の健康目標も見る</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/ingredients"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                  成分ガイド
                </h4>
                <p className="text-gray-300 text-sm">全成分の詳細を確認</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                  危険成分ガイド
                </h4>
                <p className="text-gray-300 text-sm">避けるべき成分を確認</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
