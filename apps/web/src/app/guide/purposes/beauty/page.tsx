import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Star,
  Beaker,
  Heart,
  Clock,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "美肌・美容サプリガイド｜科学的根拠に基づく美容サプリの選び方 - サプティア",
  description:
    "肌のハリ・ツヤ、アンチエイジング、美白に効果的なサプリメントを科学的根拠に基づいて解説。コラーゲン、ビタミンC、ビタミンE、アスタキサンチンなど、本当に効果のある美容サプリの選び方。",
  keywords: [
    "美肌",
    "美容サプリ",
    "コラーゲン",
    "ビタミンC",
    "アンチエイジング",
    "美白",
  ],
};

const ingredients = [
  {
    name: "コラーゲン",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "肌のハリと弾力を保つタンパク質。経口摂取で肌の水分量とハリが改善されることが複数の研究で確認されています。",
    dosage: "1日 2.5〜10g（ペプチドタイプが吸収されやすい）",
    slug: "collagen",
  },
  {
    name: "ビタミンC",
    evidenceLevel: "S",
    evidenceColor: "from-purple-500 to-pink-500",
    description:
      "コラーゲン生成に不可欠な栄養素。抗酸化作用で紫外線ダメージから肌を守り、メラニン生成を抑制して美白効果も期待できます。",
    dosage: "1日 100〜1000mg（美容目的は500〜1000mg）",
    slug: "vitamin-c",
  },
  {
    name: "ビタミンE",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "強力な抗酸化作用で老化を防ぎ、肌のバリア機能を強化。ビタミンCと一緒に摂ると相乗効果があります。",
    dosage: "1日 100〜400mg（上限800mg）",
    slug: "vitamin-e",
  },
  {
    name: "アスタキサンチン",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "ビタミンCの6000倍の抗酸化力。肌の水分量増加、シワ改善、紫外線ダメージ軽減効果が研究で確認されています。",
    dosage: "1日 4〜12mg（美容目的は6〜12mg）",
    slug: "astaxanthin",
  },
  {
    name: "ビオチン（ビタミンB7）",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "「美容ビタミン」として知られ、肌・髪・爪の健康維持に重要。細胞の成長と分裂を促進し、肌のターンオーバーをサポートします。",
    dosage: "1日 50〜300μg（美容目的は100〜300μg）",
    slug: "biotin",
  },
  {
    name: "亜鉛",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "肌の修復・再生に必要なミネラル。コラーゲン合成、抗炎症作用、皮脂コントロールに関与し、ニキビケアにも効果的です。",
    dosage: "1日 8〜15mg（上限40mg）",
    slug: "zinc",
  },
];

const combinations = [
  {
    title: "コラーゲン + ビタミンC",
    description:
      "ビタミンCはコラーゲンの合成に必須。一緒に摂ることでコラーゲンの効果が最大化されます。",
    icon: "✨",
  },
  {
    title: "ビタミンC + ビタミンE",
    description:
      "ビタミンEの抗酸化作用をビタミンCが再生。相乗効果で強力なアンチエイジング効果。",
    icon: "🌟",
  },
  {
    title: "アスタキサンチン + ビタミンC",
    description:
      "紫外線ダメージから肌を守る最強の組み合わせ。日焼け対策としても有効。",
    icon: "☀️",
  },
];

const cautions = [
  {
    title: "即効性は期待しない",
    description:
      "肌のターンオーバーは約28日周期。最低でも2〜3ヶ月は継続しましょう。",
  },
  {
    title: "過剰摂取に注意",
    description:
      "ビタミンA、ビタミンE、亜鉛などは上限量があります。必ず推奨量を守りましょう。",
  },
  {
    title: "妊娠中・授乳中は医師に相談",
    description:
      "特にビタミンAは催奇形性があるため、妊娠中は摂取を避けてください。",
  },
];

export default function BeautyGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 py-20 lg:py-28">
        {/* 背景アニメーション */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-pink-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-purple-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift animation-delay-2000" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-mist-flow" />
        </div>

        <div className="relative mx-auto px-6 lg:px-12 xl:px-16 max-w-[1200px]">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-pink-100 text-sm mb-8">
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
            <span className="text-white font-medium">美肌・美容</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl">
                  <Sparkles size={40} className="text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-2">
                    目的別ガイド
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    美肌・美容サプリガイド
                  </h1>
                </div>
              </div>
              <p className="text-xl text-pink-100 max-w-2xl leading-relaxed">
                科学的根拠に基づいて、本当に効果のある美容サプリメントを選びましょう。
                内側からの美容ケアで、ハリ・ツヤのある健康的な肌を手に入れる。
              </p>
            </div>

            {/* 統計ハイライト */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-pink-100 text-sm">厳選成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-pink-100 text-sm">推奨組み合わせ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-100 rounded-xl">
                <BookOpen className="text-pink-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  美容サプリの基礎知識
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  美肌を目指すには、外側からのスキンケアだけでなく、内側からの栄養補給も重要です。
                  肌は体の最も外側にある臓器であり、栄養が届くのは最後になりがちです。
                </p>
                <p className="text-gray-900 font-semibold mt-3 flex items-center gap-2">
                  <Heart size={18} className="text-pink-500" />
                  サプリメントで適切な栄養を補給することで、肌のハリ、ツヤ、透明感をサポートできます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 美容に効果的な成分 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Beaker className="text-pink-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              美容に効果的な主要成分
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.slug}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-pink-200 transition-all duration-300"
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
                  className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm group-hover:gap-3 transition-all"
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

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border border-purple-200 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">💎</span>
              <h3 className="text-xl font-bold text-purple-900">
                ゴールデンコンビネーション
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
                <h4 className="font-bold mb-2 group-hover:text-pink-300 transition-colors">
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
                <h4 className="font-bold mb-2 group-hover:text-pink-300 transition-colors">
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
                <h4 className="font-bold mb-2 group-hover:text-pink-300 transition-colors">
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
