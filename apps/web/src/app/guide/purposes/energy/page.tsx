import { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Star,
  Beaker,
  Clock,
  ChevronRight,
  Battery,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "疲労回復・エナジーサプリガイド｜科学的根拠に基づくエネルギー向上サプリの選び方 - サプティア",
  description:
    "疲労回復、エネルギー増強、スタミナ向上に効果的なサプリメントを科学的根拠に基づいて解説。CoQ10、ビタミンB群、鉄、マグネシウムなど、本当に効果のあるエナジーサプリの選び方。",
  keywords: [
    "疲労回復",
    "エナジーサプリ",
    "CoQ10",
    "ビタミンB",
    "鉄分",
    "アシュワガンダ",
    "エネルギー",
  ],
};

const ingredients = [
  {
    name: "CoQ10（コエンザイムQ10）",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "細胞のエネルギー工場であるミトコンドリアで働く補酵素。慢性疲労症候群の症状を改善し、運動後の疲労回復を促進します。",
    dosage: "1日 100〜300mg（食事と一緒に、ユビキノール型が吸収良好）",
    slug: "coq10",
  },
  {
    name: "ビタミンB群（B1, B2, B6, B12）",
    evidenceLevel: "S",
    evidenceColor: "from-purple-500 to-pink-500",
    description:
      "エネルギー代謝に不可欠な補酵素。特にビタミンB12は神経機能と赤血球生成に重要で、不足すると慢性疲労の原因になります。",
    dosage: "B12: 500〜1000μg / B複合体: 50〜100mg（活性型推奨）",
    slug: "vitamin-b-complex",
  },
  {
    name: "鉄（ヘム鉄）",
    evidenceLevel: "S",
    evidenceColor: "from-purple-500 to-pink-500",
    description:
      "酸素を全身に運ぶヘモグロビンの主成分。鉄欠乏性貧血は疲労の最も一般的な原因の一つ。特に女性は不足しやすい。",
    dosage: "男性: 8〜15mg / 女性: 18〜30mg（ヘム鉄が吸収良好）",
    slug: "iron",
  },
  {
    name: "マグネシウム",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "300以上の酵素反応に関与し、ATP（エネルギー通貨）の生成に必須。不足すると疲労感、筋肉痛、睡眠障害を引き起こします。",
    dosage: "1日 300〜500mg（クエン酸塩またはグリシン酸塩）",
    slug: "magnesium",
  },
  {
    name: "アシュワガンダ",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "アダプトゲンハーブの王様。ストレスホルモン（コルチゾール）を正常化し、慢性疲労とストレスによるエネルギー低下を改善します。",
    dosage: "1日 300〜600mg（KSM-66またはSensoril抽出物、朝食後推奨）",
    slug: "ashwagandha",
  },
  {
    name: "ロディオラ・ロゼア",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "ストレス適応性ハーブ。精神的・肉体的疲労を軽減し、集中力と持久力を向上。特に急性ストレス下でのパフォーマンス改善に効果的です。",
    dosage: "1日 200〜600mg（ロザビンとサリドロサイド3%標準化、朝摂取）",
    slug: "rhodiola",
  },
];

const combinations = [
  {
    title: "CoQ10 + ビタミンB群",
    description:
      "細胞レベルでのエネルギー生成を最大化。CoQ10がミトコンドリアの効率を高め、ビタミンBがエネルギー代謝を促進します。",
    icon: "⚡",
  },
  {
    title: "鉄 + ビタミンC",
    description:
      "鉄の吸収をビタミンCが3〜4倍向上。貧血予防と改善に最適な組み合わせ。",
    icon: "🔋",
  },
  {
    title: "アシュワガンダ + マグネシウム",
    description:
      "ストレス軽減と深い眠りのダブル効果。日中のストレス対応力を高め、夜の睡眠の質を向上させます。",
    icon: "✨",
  },
];

const cautions = [
  {
    title: "原因を特定することが重要",
    description:
      "慢性疲労の原因は多様です。甲状腺機能低下症、慢性疲労症候群、睡眠時無呼吸症候群などの可能性があれば、医師の診断を受けましょう。",
  },
  {
    title: "鉄は過剰摂取に注意",
    description:
      "鉄の過剰摂取は酸化ストレスを引き起こし、臓器に蓄積する可能性があります。血液検査でフェリチン値を確認してから摂取しましょう。",
  },
  {
    title: "カフェインに依存しない",
    description:
      "カフェインは一時的なエネルギーブーストを提供しますが、長期的には疲労を悪化させます。根本的なエネルギー代謝の改善を目指しましょう。",
  },
];

export default function EnergyGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 py-20 lg:py-28">
        {/* 背景アニメーション */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-amber-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-yellow-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift animation-delay-2000" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-mist-flow" />
        </div>

        <div className="relative mx-auto px-6 lg:px-12 xl:px-16 max-w-[1200px]">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-amber-100 text-sm mb-8">
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
            <span className="text-white font-medium">疲労回復・エネルギー</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl">
                  <Zap size={40} className="text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-2">
                    目的別ガイド
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    疲労回復・エナジーサプリガイド
                  </h1>
                </div>
              </div>
              <p className="text-xl text-amber-100 max-w-2xl leading-relaxed">
                科学的根拠に基づいて、本当に効果のあるエナジーサプリメントを選びましょう。
                慢性疲労から解放され、毎日を活力あふれる状態で過ごす。
              </p>
            </div>

            {/* 統計ハイライト */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-amber-100 text-sm">厳選成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-amber-100 text-sm">Sランク成分</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <BookOpen className="text-amber-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  エナジーサプリの基礎知識
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  慢性的な疲労やエネルギー不足は、現代人に非常に多い悩みです。
                  原因は栄養不足、睡眠不足、ストレス、運動不足など多岐にわたりますが、適切なサプリメントでエネルギー代謝を最適化し、疲労回復を促進できます。
                </p>
                <p className="text-gray-900 font-semibold mt-3 flex items-center gap-2">
                  <Battery size={18} className="text-amber-500" />
                  科学的に効果が実証された成分を選ぶことで、持続的なエネルギーと活力を取り戻すことができます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 疲労回復に効果的な成分 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Beaker className="text-amber-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              疲労回復に効果的な主要成分
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.slug}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">
                      {ingredient.name}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 bg-gradient-to-r ${ingredient.evidenceColor} text-white text-sm font-bold rounded-full`}
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
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-sm group-hover:gap-3 transition-all"
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="text-orange-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              相乗効果のある組み合わせ
            </h2>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">⚡</span>
              <h3 className="text-xl font-bold text-amber-900">
                エネルギー最大化コンビネーション
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {combinations.map((combo, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
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
            <h3 className="text-2xl font-bold mb-6">関連ガイド</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/guide/purposes"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-amber-300 transition-colors">
                  目的別ガイド
                </h4>
                <p className="text-gray-300 text-sm">他の健康目標も見る</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/guide/purposes/sleep"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-amber-300 transition-colors">
                  睡眠改善ガイド
                </h4>
                <p className="text-gray-300 text-sm">質の高い睡眠で回復</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-amber-300 transition-colors">
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
