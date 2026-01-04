import { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Star,
  Beaker,
  Clock,
  ChevronRight,
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
    description:
      "肌のハリと弾力を保つタンパク質。経口摂取で肌の水分量とハリが改善されることが複数の研究で確認されています。",
    dosage: "1日 2.5〜10g（ペプチドタイプが吸収されやすい）",
    slug: "collagen",
  },
  {
    name: "ビタミンC",
    evidenceLevel: "S",
    description:
      "コラーゲン生成に不可欠な栄養素。抗酸化作用で紫外線ダメージから肌を守り、メラニン生成を抑制して美白効果も期待できます。",
    dosage: "1日 100〜1000mg（美容目的は500〜1000mg）",
    slug: "vitamin-c",
  },
  {
    name: "ビタミンE",
    evidenceLevel: "A",
    description:
      "強力な抗酸化作用で老化を防ぎ、肌のバリア機能を強化。ビタミンCと一緒に摂ると相乗効果があります。",
    dosage: "1日 100〜400mg（上限800mg）",
    slug: "vitamin-e",
  },
  {
    name: "アスタキサンチン",
    evidenceLevel: "A",
    description:
      "ビタミンCの6000倍の抗酸化力。肌の水分量増加、シワ改善、紫外線ダメージ軽減効果が研究で確認されています。",
    dosage: "1日 4〜12mg（美容目的は6〜12mg）",
    slug: "astaxanthin",
  },
  {
    name: "ビオチン（ビタミンB7）",
    evidenceLevel: "A",
    description:
      "「美容ビタミン」として知られ、肌・髪・爪の健康維持に重要。細胞の成長と分裂を促進し、肌のターンオーバーをサポートします。",
    dosage: "1日 50〜300μg（美容目的は100〜300μg）",
    slug: "biotin",
  },
  {
    name: "亜鉛",
    evidenceLevel: "A",
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

// Get tier color based on evidence level
const getTierColor = (level: string) => {
  if (level in tierColors) {
    return tierColors[level as keyof typeof tierColors];
  }
  return tierColors.B;
};

export default function BeautyGuidePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Breadcrumb */}
      <div
        className={`border-b sticky top-0 z-10 ${liquidGlassClasses.light}`}
        style={{
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center gap-2 text-[14px]">
            <Link
              href="/"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <ChevronRight
              size={14}
              style={{ color: appleWebColors.textTertiary }}
            />
            <Link
              href="/guide/purposes"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              目的別ガイド
            </Link>
            <ChevronRight
              size={14}
              style={{ color: appleWebColors.textTertiary }}
            />
            <span style={{ color: appleWebColors.textPrimary }}>
              美肌・美容
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.pink}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.purple}08 100%)`,
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
                    background: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.purple} 100%)`,
                  }}
                >
                  <Heart size={32} className="text-white" />
                </div>
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[13px] font-medium mb-2"
                    style={{
                      backgroundColor: `${systemColors.pink}15`,
                      color: systemColors.pink,
                    }}
                  >
                    目的別ガイド
                  </span>
                  <h1
                    className="text-[34px] sm:text-[40px] font-bold tracking-[-0.015em]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    美肌・美容サプリガイド
                  </h1>
                </div>
              </div>
              <p
                className="text-[17px] sm:text-[20px] max-w-2xl leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                科学的根拠に基づいて、本当に効果のある美容サプリメントを選びましょう。
                内側からの美容ケアで、ハリ・ツヤのある健康的な肌を手に入れる。
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
                  style={{ color: systemColors.pink }}
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
                  style={{ color: systemColors.purple }}
                >
                  3
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  推奨組み合わせ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <div
            className="rounded-[20px] p-6 sm:p-8 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.pink}08 0%, ${systemColors.purple}08 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-[12px]"
                style={{ backgroundColor: `${systemColors.pink}15` }}
              >
                <BookOpen size={24} style={{ color: systemColors.pink }} />
              </div>
              <div>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  美容サプリの基礎知識
                </h2>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  美肌を目指すには、外側からのスキンケアだけでなく、内側からの栄養補給も重要です。
                  肌は体の最も外側にある臓器であり、栄養が届くのは最後になりがちです。
                </p>
                <p
                  className="flex items-center gap-2 mt-3 text-[15px] font-medium"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Heart size={16} style={{ color: systemColors.pink }} />
                  サプリメントで適切な栄養を補給することで、肌のハリ、ツヤ、透明感をサポートできます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-2 rounded-[10px]"
              style={{ backgroundColor: `${systemColors.pink}15` }}
            >
              <Beaker size={22} style={{ color: systemColors.pink }} />
            </div>
            <h2
              className="text-[28px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              美容に効果的な主要成分
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient) => {
              const tierColor = getTierColor(ingredient.evidenceLevel);
              return (
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
                      style={{ background: tierColor.bg }}
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
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
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
              );
            })}
          </div>
        </section>

        {/* Combinations Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-2 rounded-[10px]"
              style={{ backgroundColor: `${systemColors.purple}15` }}
            >
              <Star size={22} style={{ color: systemColors.purple }} />
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
              background: `linear-gradient(135deg, ${systemColors.purple}08 0%, ${systemColors.pink}08 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💎</span>
              <h3
                className="text-[20px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                ゴールデンコンビネーション
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

        {/* Cautions Section */}
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

        {/* Related Guides */}
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
                href="/ingredients"
                className={`group p-5 rounded-[16px] border transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <h4
                  className="font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  成分ガイド
                </h4>
                <p
                  className="text-[14px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  全成分の詳細を確認
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
