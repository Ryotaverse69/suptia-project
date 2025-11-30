import { Metadata } from "next";
import Link from "next/link";
import {
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Star,
  Beaker,
  Zap,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "筋肉増強・筋トレサプリガイド｜科学的根拠に基づくスポーツサプリの選び方 - サプティア",
  description:
    "筋力アップ、筋肥大、運動パフォーマンス向上に効果的なサプリメントを科学的根拠に基づいて解説。プロテイン、クレアチン、BCAA、HMBなど、本当に効果のある筋トレサプリの選び方。",
  keywords: [
    "筋トレ",
    "筋肉増強",
    "プロテイン",
    "クレアチン",
    "BCAA",
    "HMB",
    "筋力アップ",
  ],
};

const ingredients = [
  {
    name: "ホエイプロテイン",
    evidenceLevel: "S",
    evidenceColor: "from-purple-500 to-pink-500",
    description:
      "筋肉の材料となる必須アミノ酸を豊富に含み、吸収速度が速い。運動後の筋タンパク合成を最大化し、筋肥大効果が最も確実な成分。",
    dosage: "運動後30分以内に20〜25g（体重×0.3g程度）",
    slug: "whey-protein",
  },
  {
    name: "クレアチン",
    evidenceLevel: "S",
    evidenceColor: "from-purple-500 to-pink-500",
    description:
      "筋力と瞬発力を向上させる最も研究されているサプリメント。筋肉内のATP再合成を促進し、高強度トレーニングのパフォーマンスを向上。",
    dosage: "1日 3〜5g（ローディング期は20g×5日間も可）",
    slug: "creatine",
  },
  {
    name: "BCAA（分岐鎖アミノ酸）",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "ロイシン、イソロイシン、バリンの3つの必須アミノ酸。筋タンパク分解を抑制し、運動中の疲労を軽減する効果があります。",
    dosage: "運動前・中に5〜10g（ロイシン比率2:1:1が理想）",
    slug: "bcaa",
  },
  {
    name: "HMB（β-ヒドロキシ-β-メチル酪酸）",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "ロイシンの代謝物質。筋タンパク分解を抑制し、筋損傷からの回復を促進。特にトレーニング初心者や減量期に効果的です。",
    dosage: "1日 3g（1gずつ3回に分けて摂取）",
    slug: "hmb",
  },
  {
    name: "ベータアラニン",
    evidenceLevel: "A",
    evidenceColor: "from-blue-500 to-cyan-500",
    description:
      "筋肉内のカルノシン濃度を高め、乳酸の蓄積を遅らせる。60〜240秒の高強度運動のパフォーマンスを向上させます。",
    dosage: "1日 4〜6g（2〜4週間の継続で効果発現）",
    slug: "beta-alanine",
  },
  {
    name: "グルタミン",
    evidenceLevel: "B",
    evidenceColor: "from-green-500 to-emerald-500",
    description:
      "体内で最も豊富なアミノ酸。激しいトレーニング後の免疫機能維持と筋肉回復をサポートし、オーバートレーニング予防に役立ちます。",
    dosage: "運動後に5〜10g（特にハードトレーニング時）",
    slug: "glutamine",
  },
];

const combinations = [
  {
    title: "プロテイン + クレアチン",
    description:
      "筋肥大と筋力向上の両方を最大化する黄金の組み合わせ。プロテイン後にクレアチンを摂ることでクレアチンの吸収が向上します。",
    icon: "💪",
  },
  {
    title: "BCAA + ベータアラニン",
    description:
      "運動中のエネルギー供給と疲労軽減を同時にサポート。高強度トレーニングのパフォーマンス向上に最適。",
    icon: "⚡",
  },
  {
    title: "プロテイン + HMB",
    description:
      "筋タンパク合成促進と筋タンパク分解抑制の両面からアプローチ。特に減量期やトレーニング初心者に効果的。",
    icon: "🔥",
  },
];

const cautions = [
  {
    title: "トレーニングが最優先",
    description:
      "サプリメントはトレーニングと適切な食事の補助です。サプリだけで筋肉は増えません。",
  },
  {
    title: "クレアチンは水分補給を忘れずに",
    description:
      "クレアチンは筋肉に水分を引き込むため、十分な水分補給（1日3L以上）が必要です。",
  },
  {
    title: "腎機能に問題がある方は医師に相談",
    description:
      "高タンパク食やクレアチンは腎臓に負担をかける可能性があります。腎疾患のある方は必ず医師に相談してください。",
  },
];

export default function MuscleGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 py-20 lg:py-28">
        {/* 背景アニメーション */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-red-400/30 to-transparent rounded-full blur-3xl animate-gradient-drift animation-delay-2000" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-mist-flow" />
        </div>

        <div className="relative mx-auto px-6 lg:px-12 xl:px-16 max-w-[1200px]">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-orange-100 text-sm mb-8">
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
            <span className="text-white font-medium">筋肉増強・筋トレ</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl">
                  <Dumbbell size={40} className="text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-2">
                    目的別ガイド
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    筋肉増強・筋トレサプリガイド
                  </h1>
                </div>
              </div>
              <p className="text-xl text-orange-100 max-w-2xl leading-relaxed">
                科学的根拠に基づいて、本当に効果のある筋トレサプリメントを選びましょう。
                筋力アップ、筋肥大、運動パフォーマンスの向上を最大化する。
              </p>
            </div>

            {/* 統計ハイライト */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-orange-100 text-sm">厳選成分</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-orange-100 text-sm">Sランク成分</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {/* イントロダクション */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <BookOpen className="text-orange-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  筋トレサプリの基礎知識
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  筋肉を効率的に増やすには、適切なトレーニングに加えて、タンパク質や特定の栄養素を十分に摂取することが不可欠です。
                  食事だけでは不足しがちな栄養素をサプリメントで補うことで、筋肥大や筋力向上、回復速度の改善が期待できます。
                </p>
                <p className="text-gray-900 font-semibold mt-3 flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" />
                  科学的に効果が実証されたサプリメントを選ぶことが、トレーニング効果を最大化する鍵です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 筋肉増強に効果的な成分 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Beaker className="text-orange-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              筋肉増強に効果的な主要成分
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.slug}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300"
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
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm group-hover:gap-3 transition-all"
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
            <div className="p-2 bg-red-100 rounded-lg">
              <Star className="text-red-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              相乗効果のある組み合わせ
            </h2>
          </div>

          <div className="bg-gradient-to-br from-orange-50 via-red-50 to-rose-50 border border-orange-200 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">💪</span>
              <h3 className="text-xl font-bold text-orange-900">
                ベストコンビネーション
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
                <h4 className="font-bold mb-2 group-hover:text-orange-300 transition-colors">
                  目的別ガイド
                </h4>
                <p className="text-gray-300 text-sm">他の健康目標も見る</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/guide/audiences/athletes"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-orange-300 transition-colors">
                  アスリート向けガイド
                </h4>
                <p className="text-gray-300 text-sm">競技者向けの情報</p>
                <ArrowRight
                  size={18}
                  className="mt-3 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className="group p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <h4 className="font-bold mb-2 group-hover:text-orange-300 transition-colors">
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
