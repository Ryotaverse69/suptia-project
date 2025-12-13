import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Star,
  Beaker,
  Clock,
  ChevronRight,
  Heart,
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
    "免疫力向上サプリガイド｜科学的根拠に基づく免疫サポートサプリの選び方 - サプティア",
  description:
    "免疫機能強化、風邪予防、感染症対策に効果的なサプリメントを科学的根拠に基づいて解説。ビタミンC、ビタミンD、亜鉛、エルダーベリーなど、本当に効果のある免疫サプリの選び方。",
  keywords: [
    "免疫力",
    "風邪予防",
    "ビタミンC",
    "ビタミンD",
    "亜鉛",
    "エルダーベリー",
    "免疫強化",
  ],
};

const ingredients = [
  {
    name: "ビタミンD",
    evidenceLevel: "S" as const,
    description:
      "免疫調節に最も重要な栄養素。白血球の機能を強化し、呼吸器感染症のリスクを25%減少させることが大規模研究で確認されています。",
    dosage: "1日 1000〜4000IU（血中濃度30ng/mL以上を維持）",
    slug: "vitamin-d",
  },
  {
    name: "ビタミンC",
    evidenceLevel: "S" as const,
    description:
      "強力な抗酸化作用と免疫細胞の機能強化。風邪の予防効果は限定的ですが、風邪の期間を8%短縮し、症状を軽減する効果が確認されています。",
    dosage: "1日 500〜2000mg（風邪予防は1000mg以上推奨）",
    slug: "vitamin-c",
  },
  {
    name: "亜鉛",
    evidenceLevel: "A" as const,
    description:
      "免疫細胞の発達と機能に不可欠。風邪の初期症状（24時間以内）に摂取すると、症状の期間を約33%短縮する効果があります。",
    dosage: "予防：1日 15〜30mg / 風邪時：75mg以上（トローチ推奨）",
    slug: "zinc",
  },
  {
    name: "エルダーベリー",
    evidenceLevel: "A" as const,
    description:
      "強力な抗ウイルス作用を持つベリー。風邪やインフルエンザの症状を2〜4日短縮し、重症度を軽減することが複数の研究で確認されています。",
    dosage: "予防：1日 300〜500mg / 風邪時：1日 4回 175mg",
    slug: "elderberry",
  },
  {
    name: "プロバイオティクス",
    evidenceLevel: "A" as const,
    description:
      "腸内の善玉菌を増やし、免疫システムの70%が集中する腸の健康を改善。呼吸器感染症のリスクを約40%減少させます。",
    dosage: "1日 10〜100億CFU（Lactobacillus + Bifidobacterium推奨）",
    slug: "probiotics",
  },
  {
    name: "エキナセア",
    evidenceLevel: "B" as const,
    description:
      "伝統的な免疫ハーブ。風邪の発症リスクを約15%減少させ、症状を1〜2日短縮する可能性がありますが、個人差が大きい。",
    dosage: "風邪初期に300〜500mg、1日3回（最大10日間）",
    slug: "echinacea",
  },
];

const combinations = [
  {
    title: "ビタミンD + 亜鉛",
    description:
      "免疫システムの二大支柱。ビタミンDが免疫細胞を活性化し、亜鉛がその機能を最適化します。年間を通しての基本サプリ。",
    icon: "🛡️",
  },
  {
    title: "ビタミンC + 亜鉛",
    description:
      "風邪の症状を素早く軽減する黄金コンビ。症状が出始めたら即座に摂取すると効果的。",
    icon: "⚡",
  },
  {
    title: "エルダーベリー + プロバイオティクス",
    description:
      "ウイルス対策と腸内環境改善のダブルアプローチ。免疫システム全体を強化します。",
    icon: "💪",
  },
];

const cautions = [
  {
    title: "予防が最も重要",
    description:
      "サプリメントは免疫を「強化」しますが、基本は栄養バランスの良い食事、十分な睡眠、適度な運動です。",
  },
  {
    title: "亜鉛は過剰摂取に注意",
    description:
      "長期的に40mg以上摂取すると銅の吸収を阻害します。風邪時の高用量（75mg）は短期間（5〜7日）のみにしましょう。",
  },
  {
    title: "自己免疫疾患がある方は医師に相談",
    description:
      "エキナセアや一部のプロバイオティクスは免疫を活性化するため、自己免疫疾患（関節リウマチ、多発性硬化症など）の方は医師に相談してください。",
  },
];

export default function ImmunityGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 py-20 lg:py-28">
        {/* 背景アニメーション */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-teal-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift animation-delay-2000" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-mist-flow" />
        </div>

        <div className="relative mx-auto px-6 lg:px-12 xl:px-16 max-w-[1200px]">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-8">
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
            <span className="text-white font-medium">免疫力向上</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl">
                  <Shield size={40} className="text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-2">
                    目的別ガイド
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    免疫力向上サプリガイド
                  </h1>
                </div>
              </div>
              <p className="text-xl text-emerald-100 max-w-2xl leading-relaxed">
                科学的根拠に基づいて、本当に効果のある免疫サポートサプリメントを選びましょう。
                感染症に負けない、強い免疫システムを維持する。
              </p>
            </div>

            {/* 統計ハイライト */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-emerald-100 text-sm">厳選成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-emerald-100 text-sm">Sランク成分</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <BookOpen className="text-emerald-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  免疫サプリの基礎知識
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  免疫システムは、ウイルスや細菌などの外敵から体を守る重要な防御機構です。
                  適切な栄養素を補給することで、免疫細胞の機能を最適化し、感染症のリスクを減らすことができます。
                </p>
                <p className="text-gray-900 font-semibold mt-3 flex items-center gap-2">
                  <Heart size={18} className="text-emerald-500" />
                  科学的に効果が実証された成分を選ぶことで、年間を通して健康な免疫システムを維持できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 免疫力向上に効果的な成分 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Beaker className="text-emerald-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              免疫力向上に効果的な主要成分
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
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm group-hover:gap-3 transition-all"
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
            <div className="p-2 bg-teal-100 rounded-lg">
              <Star className="text-teal-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              相乗効果のある組み合わせ
            </h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-xl font-bold text-emerald-900">
                最強コンビネーション
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
            <h3 className="text-2xl font-bold mb-6">関連ガイド</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/guide/purposes"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-emerald-300 transition-colors">
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
                <h4 className="font-bold mb-2 group-hover:text-emerald-300 transition-colors">
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
                <h4 className="font-bold mb-2 group-hover:text-emerald-300 transition-colors">
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
