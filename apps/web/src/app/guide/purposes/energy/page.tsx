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
    evidenceLevel: "A" as const,
    description:
      "細胞のエネルギー工場であるミトコンドリアで働く補酵素。慢性疲労症候群の症状を改善し、運動後の疲労回復を促進します。",
    dosage: "1日 100〜300mg（食事と一緒に、ユビキノール型が吸収良好）",
    slug: "coq10",
  },
  {
    name: "ビタミンB群（B1, B2, B6, B12）",
    evidenceLevel: "S" as const,
    description:
      "エネルギー代謝に不可欠な補酵素。特にビタミンB12は神経機能と赤血球生成に重要で、不足すると慢性疲労の原因になります。",
    dosage: "B12: 500〜1000μg / B複合体: 50〜100mg（活性型推奨）",
    slug: "vitamin-b-complex",
  },
  {
    name: "鉄（ヘム鉄）",
    evidenceLevel: "S" as const,
    description:
      "酸素を全身に運ぶヘモグロビンの主成分。鉄欠乏性貧血は疲労の最も一般的な原因の一つ。特に女性は不足しやすい。",
    dosage: "男性: 8〜15mg / 女性: 18〜30mg（ヘム鉄が吸収良好）",
    slug: "iron",
  },
  {
    name: "マグネシウム",
    evidenceLevel: "A" as const,
    description:
      "300以上の酵素反応に関与し、ATP（エネルギー通貨）の生成に必須。不足すると疲労感、筋肉痛、睡眠障害を引き起こします。",
    dosage: "1日 300〜500mg（クエン酸塩またはグリシン酸塩）",
    slug: "magnesium",
  },
  {
    name: "アシュワガンダ",
    evidenceLevel: "A" as const,
    description:
      "アダプトゲンハーブの王様。ストレスホルモン（コルチゾール）を正常化し、慢性疲労とストレスによるエネルギー低下を改善します。",
    dosage: "1日 300〜600mg（KSM-66またはSensoril抽出物、朝食後推奨）",
    slug: "ashwagandha",
  },
  {
    name: "ロディオラ・ロゼア",
    evidenceLevel: "A" as const,
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
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* ヒーローセクション */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.orange}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.red}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-4 rounded-[20px]"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.red} 100%)`,
                  }}
                >
                  <Zap size={32} className="text-white" />
                </div>
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[13px] font-medium mb-2"
                    style={{
                      backgroundColor: `${systemColors.orange}15`,
                      color: systemColors.orange,
                    }}
                  >
                    目的別ガイド
                  </span>
                  <h1
                    className="text-[34px] sm:text-[40px] font-bold tracking-[-0.015em]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    疲労回復・エナジーサプリガイド
                  </h1>
                </div>
              </div>
              <p
                className="text-[17px] sm:text-[20px] max-w-2xl leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                科学的根拠に基づいて、本当に効果のあるエナジーサプリメントを選びましょう。
                慢性疲労から解放され、毎日を活力あふれる状態で過ごす。
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`rounded-[16px] p-4 text-center border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.orange }}
                >
                  6
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  厳選成分
                </div>
              </div>
              <div
                className={`rounded-[16px] p-4 text-center border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.red }}
                >
                  2
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  Sランク成分
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        {/* イントロダクション */}
        <section className="mb-12">
          <div
            className="rounded-[20px] p-6 sm:p-8 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.orange}08 0%, ${systemColors.red}08 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-[12px]"
                style={{ backgroundColor: `${systemColors.orange}15` }}
              >
                <BookOpen size={24} style={{ color: systemColors.orange }} />
              </div>
              <div>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  エナジーサプリの基礎知識
                </h2>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  慢性的な疲労やエネルギー不足は、現代人に非常に多い悩みです。
                  原因は栄養不足、睡眠不足、ストレス、運動不足など多岐にわたりますが、適切なサプリメントでエネルギー代謝を最適化し、疲労回復を促進できます。
                </p>
                <p
                  className="flex items-center gap-2 mt-3 text-[15px] font-medium"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Battery size={16} style={{ color: systemColors.orange }} />
                  科学的に効果が実証された成分を選ぶことで、持続的なエネルギーと活力を取り戻すことができます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 疲労回復に効果的な成分 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-2 rounded-[10px]"
              style={{ backgroundColor: `${systemColors.orange}15` }}
            >
              <Beaker size={22} style={{ color: systemColors.orange }} />
            </div>
            <h2
              className="text-[28px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              疲労回復に効果的な主要成分
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.slug}
                className={`group rounded-[20px] border p-6 transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={22}
                      style={{ color: systemColors.green }}
                    />
                    <h3
                      className="text-[20px] font-bold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {ingredient.name}
                    </h3>
                  </div>
                  <span
                    className="px-3 py-1 text-[13px] font-bold rounded-full text-white"
                    style={{
                      background: tierColors[ingredient.evidenceLevel].bg,
                    }}
                  >
                    {ingredient.evidenceLevel}ランク
                  </span>
                </div>

                <p
                  className="text-[15px] leading-relaxed mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {ingredient.description}
                </p>

                <div
                  className="rounded-[12px] p-4 mb-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock
                      size={14}
                      style={{ color: appleWebColors.textTertiary }}
                    />
                    <span
                      className="font-semibold text-[13px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      推奨摂取量
                    </span>
                  </div>
                  <p
                    className="text-[14px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {ingredient.dosage}
                  </p>
                </div>

                <Link
                  href={`/ingredients/${ingredient.slug}`}
                  className="inline-flex items-center gap-2 text-[14px] font-medium transition-all group-hover:gap-3"
                  style={{ color: systemColors.blue }}
                >
                  詳細を見る
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 組み合わせのススメ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-2 rounded-[10px]"
              style={{ backgroundColor: `${systemColors.red}15` }}
            >
              <Star size={22} style={{ color: systemColors.red }} />
            </div>
            <h2
              className="text-[28px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              相乗効果のある組み合わせ
            </h2>
          </div>

          <div
            className="rounded-[20px] p-6 sm:p-8 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.red}08 0%, ${systemColors.orange}08 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⚡</span>
              <h3
                className="text-[20px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                エネルギー最大化コンビネーション
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {combinations.map((combo, index) => (
                <div
                  key={index}
                  className={`rounded-[16px] p-5 border transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="text-2xl mb-3">{combo.icon}</div>
                  <h4
                    className="font-bold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {combo.title}
                  </h4>
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {combo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 注意事項 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-2 rounded-[10px]"
              style={{ backgroundColor: `${systemColors.orange}15` }}
            >
              <AlertTriangle size={22} style={{ color: systemColors.orange }} />
            </div>
            <h2
              className="text-[28px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              摂取時の注意点
            </h2>
          </div>

          <div
            className="rounded-[20px] p-6 sm:p-8 border"
            style={{
              backgroundColor: `${systemColors.orange}08`,
              borderColor: `${systemColors.orange}30`,
            }}
          >
            <div className="space-y-4">
              {cautions.map((caution, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 rounded-[16px] p-4 ${liquidGlassClasses.light}`}
                >
                  <div
                    className="p-2 rounded-[10px] flex-shrink-0"
                    style={{ backgroundColor: `${systemColors.orange}15` }}
                  >
                    <AlertTriangle
                      size={16}
                      style={{ color: systemColors.orange }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-bold mb-1"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {caution.title}
                    </h3>
                    <p
                      className="text-[14px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
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
          <div
            className="rounded-[24px] p-8 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.indigo}10 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h3
              className="text-[24px] font-bold mb-6"
              style={{ color: appleWebColors.textPrimary }}
            >
              次のステップ
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/concierge"
                className="group p-5 rounded-[16px] border transition-all hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue}15 0%, ${systemColors.indigo}15 100%)`,
                  borderColor: `${systemColors.blue}30`,
                }}
              >
                <MessageCircle
                  size={20}
                  className="mb-2"
                  style={{ color: systemColors.blue }}
                />
                <h4
                  className="font-bold mb-2 transition-colors"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  AIに相談する
                </h4>
                <p
                  className="text-[14px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  悩みを伝えて最適な提案を受ける
                </p>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-all"
                  style={{ color: systemColors.blue }}
                />
              </Link>
              <Link
                href="/guide/purposes"
                className={`group p-5 rounded-[16px] border transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <h4
                  className="font-bold mb-2 transition-colors"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  目的別ガイド
                </h4>
                <p
                  className="text-[14px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  他の健康目標も見る
                </p>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-all"
                  style={{ color: systemColors.blue }}
                />
              </Link>
              <Link
                href="/guide/purposes/sleep"
                className={`group p-5 rounded-[16px] border transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <h4
                  className="font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  睡眠改善ガイド
                </h4>
                <p
                  className="text-[14px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  質の高い睡眠で回復
                </p>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-all"
                  style={{ color: systemColors.blue }}
                />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className={`group p-5 rounded-[16px] border transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <h4
                  className="font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  危険成分ガイド
                </h4>
                <p
                  className="text-[14px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  避けるべき成分を確認
                </p>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-all"
                  style={{ color: systemColors.blue }}
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
