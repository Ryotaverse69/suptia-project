import Link from "next/link";
import { Metadata } from "next";
import {
  AlertTriangle,
  Baby,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Pill,
  Apple,
  Stethoscope,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "妊婦・授乳婦向けサプリメントガイド | サプティア",
  description:
    "妊娠・授乳期に安全な成分と避けるべき成分を科学的根拠に基づいて解説。葉酸、鉄、カルシウム、DHAなど、母体と赤ちゃんの健康をサポートする成分をご紹介します。",
};

const safeIngredients = [
  {
    name: "葉酸",
    nameEn: "Folic Acid",
    slug: "folic-acid",
    description: "神経管閉鎖障害の予防に不可欠。妊娠前から摂取が推奨されます。",
    dosage: "400〜800μg/日",
    benefits: ["神経管閉鎖障害予防", "DNA合成", "細胞分裂"],
    priority: "必須",
  },
  {
    name: "鉄",
    nameEn: "Iron",
    slug: "iron",
    description: "貧血予防と胎児の成長に重要。妊娠中は需要が増加します。",
    dosage: "27mg/日（妊娠中）",
    benefits: ["貧血予防", "酸素運搬", "エネルギー産生"],
    priority: "必須",
  },
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description: "母体の骨密度維持と胎児の骨形成に必要。",
    dosage: "1000mg/日",
    benefits: ["骨形成", "筋肉機能", "神経伝達"],
    priority: "推奨",
  },
  {
    name: "オメガ3（DHA/EPA）",
    nameEn: "Omega-3 (DHA/EPA)",
    slug: "omega-3",
    description: "胎児の脳と目の発達に重要。魚由来が推奨されます。",
    dosage: "DHA 200〜300mg/日",
    benefits: ["脳発達", "視覚発達", "炎症軽減"],
    priority: "推奨",
  },
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "カルシウム吸収と免疫機能をサポート。",
    dosage: "600〜800IU/日",
    benefits: ["カルシウム吸収", "骨の健康", "免疫機能"],
    priority: "推奨",
  },
  {
    name: "ビタミンB6",
    nameEn: "Vitamin B6",
    slug: "vitamin-b6",
    description: "つわりの軽減に効果的。タンパク質代謝にも重要。",
    dosage: "1.9mg/日",
    benefits: ["つわり軽減", "タンパク質代謝", "神経機能"],
    priority: "推奨",
  },
];

const avoidIngredients = [
  {
    name: "ビタミンA（レチノール）",
    slug: "vitamin-a",
    reason: "高用量で催奇形性のリスク。β-カロテンは安全。",
    maxDosage: "3000μg/日以下",
    riskLevel: "高",
  },
  {
    name: "L-テアニン",
    slug: "l-theanine",
    reason: "妊娠・授乳中の安全性データ不足。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "GABA",
    slug: "gaba",
    reason: "妊娠・授乳中の安全性データ不足。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "バレリアン",
    slug: "valerian",
    reason: "妊娠・授乳中の安全性が確立されていない。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "エルダーベリー",
    slug: "elderberry",
    reason: "妊娠・授乳中の十分な安全性データがない。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "エキナセア",
    slug: "echinacea",
    reason: "免疫系への影響が不明確。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
  {
    name: "HMB",
    slug: "hmb",
    reason: "妊娠・授乳中の安全性データが不十分。",
    maxDosage: "使用を避ける",
    riskLevel: "低",
  },
  {
    name: "ベータアラニン",
    slug: "beta-alanine",
    reason: "妊娠・授乳中の安全性データが不十分。",
    maxDosage: "使用を避ける",
    riskLevel: "低",
  },
  {
    name: "ロディオラ",
    slug: "rhodiola",
    reason: "妊娠・授乳中の安全性が確立されていない。",
    maxDosage: "使用を避ける",
    riskLevel: "中",
  },
];

const tips = [
  {
    icon: Calendar,
    title: "妊娠前から準備",
    description:
      "葉酸は妊娠前1ヶ月から摂取を開始することが推奨されています。計画的な栄養補給が重要です。",
    color: systemColors.blue,
  },
  {
    icon: Pill,
    title: "プレナタルビタミン優先",
    description:
      "妊婦用マルチビタミン（プレナタルビタミン）を基本とし、個別のサプリメントは医師と相談の上で追加してください。",
    color: systemColors.purple,
  },
  {
    icon: Apple,
    title: "食事からの摂取を優先",
    description:
      "サプリメントは補助的な役割です。バランスの取れた食事を基本として、不足分を補うようにしましょう。",
    color: systemColors.green,
  },
  {
    icon: Stethoscope,
    title: "定期的な検査",
    description:
      "鉄やビタミンDなどの血中濃度を定期的に検査し、適切な摂取量を調整することが重要です。",
    color: systemColors.orange,
  },
];

export default function PregnantNursingPage() {
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
              href="/guide/audiences"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              対象者別ガイド
            </Link>
            <ChevronRight
              size={14}
              style={{ color: appleWebColors.textTertiary }}
            />
            <span style={{ color: appleWebColors.textPrimary }}>
              妊婦・授乳婦向け
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.pink}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.red}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] mb-6"
              style={{
                background: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
              }}
            >
              <Baby size={32} className="text-white" />
            </div>
            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              妊婦・授乳婦向け
              <br className="sm:hidden" />
              サプリメントガイド
            </h1>
            <p
              className="text-[17px] sm:text-[20px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              母体と赤ちゃんの健康を守るための安全な栄養補給
            </p>
            <p
              className="text-[15px] max-w-2xl mx-auto leading-relaxed mb-8"
              style={{ color: appleWebColors.textSecondary }}
            >
              妊娠・授乳期は栄養需要が大幅に増加する時期です。
              安全で効果的な成分を科学的根拠に基づいてご紹介します。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4">
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.green }}
                >
                  {safeIngredients.length}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  安全な成分
                </div>
              </div>
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.red }}
                >
                  {avoidIngredients.length}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  注意成分
                </div>
              </div>
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.pink }}
                >
                  2
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  必須成分
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-[20px] p-6 border"
            style={{
              backgroundColor: `${systemColors.red}08`,
              borderColor: `${systemColors.red}30`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-[12px] flex-shrink-0"
                style={{ backgroundColor: `${systemColors.red}15` }}
              >
                <AlertTriangle size={24} style={{ color: systemColors.red }} />
              </div>
              <div>
                <h3
                  className="text-[17px] font-bold mb-2"
                  style={{ color: systemColors.red }}
                >
                  重要な注意事項
                </h3>
                <p
                  className="text-[15px] leading-relaxed mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  妊娠中・授乳中のサプリメント使用は、必ず医師または助産師に相談してから開始してください。
                </p>
                <p
                  className="text-[14px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  このガイドは一般的な情報提供を目的としており、個別の医療アドバイスではありません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Ingredients */}
      <section className="py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
              style={{
                backgroundColor: `${systemColors.green}15`,
                border: `1px solid ${systemColors.green}30`,
              }}
            >
              <CheckCircle2 size={16} style={{ color: systemColors.green }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.green }}
              >
                安全性が確認された成分
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              安全で推奨される成分
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              妊娠・授乳期に推奨される栄養素です。医師の指導のもと適切に摂取しましょう。
            </p>
          </div>

          <div className="grid gap-4">
            {safeIngredients.map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className="group block"
              >
                <div
                  className={`rounded-[20px] p-6 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-[20px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.name}
                        </h3>
                        <span
                          className="text-[14px]"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          ({ingredient.nameEn})
                        </span>
                        {ingredient.priority === "必須" && (
                          <span
                            className="text-[12px] px-2.5 py-1 rounded-full font-semibold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
                            }}
                          >
                            必須
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[15px] leading-relaxed mb-4"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {ingredient.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ingredient.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                            style={{
                              backgroundColor: `${systemColors.green}15`,
                              color: systemColors.green,
                            }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                      <div
                        className="flex items-center text-[14px] font-medium"
                        style={{ color: systemColors.blue }}
                      >
                        詳細を見る
                        <ChevronRight
                          size={16}
                          className="ml-1 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                    <div
                      className="rounded-[16px] px-5 py-4 md:min-w-[160px] text-center border"
                      style={{
                        backgroundColor: `${systemColors.green}08`,
                        borderColor: `${systemColors.green}30`,
                      }}
                    >
                      <div
                        className="text-[12px] font-medium mb-1"
                        style={{ color: systemColors.green }}
                      >
                        推奨摂取量
                      </div>
                      <div
                        className="text-[17px] font-bold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {ingredient.dosage}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Avoid Ingredients */}
      <section
        className="py-16 px-6 lg:px-12"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
              style={{
                backgroundColor: `${systemColors.red}15`,
                border: `1px solid ${systemColors.red}30`,
              }}
            >
              <XCircle size={16} style={{ color: systemColors.red }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.red }}
              >
                注意が必要な成分
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              避けるべき成分
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              妊娠・授乳期には安全性が確認されていないか、リスクがある成分です。
            </p>
          </div>

          <div className="grid gap-3">
            {avoidIngredients.map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className="group block"
              >
                <div
                  className={`rounded-[16px] p-5 border-l-4 transition-all duration-300 hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
                  style={{
                    borderLeftColor: systemColors.red,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-[17px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.name}
                        </h3>
                        <span
                          className="text-[12px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              ingredient.riskLevel === "高"
                                ? `${systemColors.red}15`
                                : ingredient.riskLevel === "中"
                                  ? `${systemColors.orange}15`
                                  : `${systemColors.yellow}15`,
                            color:
                              ingredient.riskLevel === "高"
                                ? systemColors.red
                                : ingredient.riskLevel === "中"
                                  ? systemColors.orange
                                  : systemColors.yellow,
                          }}
                        >
                          リスク: {ingredient.riskLevel}
                        </span>
                      </div>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        <span
                          className="font-medium"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          理由:
                        </span>{" "}
                        {ingredient.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="rounded-[12px] px-4 py-2 text-center border"
                        style={{
                          backgroundColor: `${systemColors.red}08`,
                          borderColor: `${systemColors.red}30`,
                        }}
                      >
                        <div
                          className="text-[11px] font-medium"
                          style={{ color: systemColors.red }}
                        >
                          推奨
                        </div>
                        <div
                          className="text-[14px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.maxDosage}
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-all"
                        style={{ color: appleWebColors.textTertiary }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              妊娠・授乳期の
              <br className="sm:hidden" />
              サプリメント使用のポイント
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`rounded-[20px] p-6 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] mb-4"
                  style={{ backgroundColor: `${tip.color}15` }}
                >
                  <tip.icon size={24} style={{ color: tip.color }} />
                </div>
                <h3
                  className="text-[17px] font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {tip.title}
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Guides CTA */}
      <section className="py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="rounded-[24px] p-8 sm:p-12 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.pink}10 0%, ${systemColors.purple}10 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h2
              className="text-[24px] sm:text-[28px] font-bold mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              さらに詳しい成分情報を確認
            </h2>
            <p
              className="text-[17px] mb-8 leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              各成分の詳細ページで、効果、摂取方法、副作用、相互作用などの詳しい情報をご覧いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="group flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
                  boxShadow: `0 4px 16px ${systemColors.pink}40`,
                }}
              >
                成分一覧を見る
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/guide/audiences"
                className={`group flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  color: appleWebColors.textPrimary,
                }}
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
