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
  Flame,
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
    description:
      "筋肉の材料となる必須アミノ酸を豊富に含み、吸収速度が速い。運動後の筋タンパク合成を最大化し、筋肥大効果が最も確実な成分。",
    dosage: "運動後30分以内に20〜25g（体重×0.3g程度）",
    slug: "whey-protein",
  },
  {
    name: "クレアチン",
    evidenceLevel: "S",
    description:
      "筋力と瞬発力を向上させる最も研究されているサプリメント。筋肉内のATP再合成を促進し、高強度トレーニングのパフォーマンスを向上。",
    dosage: "1日 3〜5g（ローディング期は20g×5日間も可）",
    slug: "creatine",
  },
  {
    name: "BCAA（分岐鎖アミノ酸）",
    evidenceLevel: "A",
    description:
      "ロイシン、イソロイシン、バリンの3つの必須アミノ酸。筋タンパク分解を抑制し、運動中の疲労を軽減する効果があります。",
    dosage: "運動前・中に5〜10g（ロイシン比率2:1:1が理想）",
    slug: "bcaa",
  },
  {
    name: "HMB（β-ヒドロキシ-β-メチル酪酸）",
    evidenceLevel: "A",
    description:
      "ロイシンの代謝物質。筋タンパク分解を抑制し、筋損傷からの回復を促進。特にトレーニング初心者や減量期に効果的です。",
    dosage: "1日 3g（1gずつ3回に分けて摂取）",
    slug: "hmb",
  },
  {
    name: "ベータアラニン",
    evidenceLevel: "A",
    description:
      "筋肉内のカルノシン濃度を高め、乳酸の蓄積を遅らせる。60〜240秒の高強度運動のパフォーマンスを向上させます。",
    dosage: "1日 4〜6g（2〜4週間の継続で効果発現）",
    slug: "beta-alanine",
  },
  {
    name: "グルタミン",
    evidenceLevel: "B",
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

// Get tier color based on evidence level
const getTierColor = (level: string) => {
  if (level in tierColors) {
    return tierColors[level as keyof typeof tierColors];
  }
  return tierColors.B;
};

export default function MuscleGuidePage() {
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
              筋肉増強・筋トレ
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 border-b"
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
                  <Dumbbell size={32} className="text-white" />
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
                    筋肉増強・筋トレサプリガイド
                  </h1>
                </div>
              </div>
              <p
                className="text-[17px] sm:text-[20px] max-w-2xl leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                科学的根拠に基づいて、本当に効果のある筋トレサプリメントを選びましょう。
                筋力アップ、筋肥大、運動パフォーマンスの向上を最大化する。
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        {/* Introduction */}
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
                  筋トレサプリの基礎知識
                </h2>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  筋肉を効率的に増やすには、適切なトレーニングに加えて、タンパク質や特定の栄養素を十分に摂取することが不可欠です。
                  食事だけでは不足しがちな栄養素をサプリメントで補うことで、筋肥大や筋力向上、回復速度の改善が期待できます。
                </p>
                <p
                  className="flex items-center gap-2 mt-3 text-[15px] font-medium"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Flame size={16} style={{ color: systemColors.orange }} />
                  科学的に効果が実証されたサプリメントを選ぶことが、トレーニング効果を最大化する鍵です。
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
              style={{ backgroundColor: `${systemColors.orange}15` }}
            >
              <Beaker size={22} style={{ color: systemColors.orange }} />
            </div>
            <h2
              className="text-[28px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              筋肉増強に効果的な主要成分
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
              background: `linear-gradient(135deg, ${systemColors.orange}08 0%, ${systemColors.red}08 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💪</span>
              <h3
                className="text-[20px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                ベストコンビネーション
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {combinations.map((combo, index) => (
                <div
                  key={index}
                  className={`rounded-[16px] p-5 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
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
                className="group p-5 rounded-[16px] border transition-all duration-300 hover:-translate-y-1"
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
                className={`group p-5 rounded-[16px] border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
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
                href="/guide/audiences/athletes"
                className={`group p-5 rounded-[16px] border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <h4
                  className="font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  アスリート向けガイド
                </h4>
                <p
                  className="text-[14px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  競技者向けの情報
                </p>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-all"
                  style={{ color: systemColors.blue }}
                />
              </Link>
              <Link
                href="/guide/dangerous-ingredients"
                className={`group p-5 rounded-[16px] border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
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
