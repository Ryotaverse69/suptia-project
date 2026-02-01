import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  Beaker,
  Filter,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import {
  ADDITIVES_DATA,
  getAdditivesBySafetyGrade,
} from "@/lib/additives/data";
import {
  ADDITIVE_CATEGORY_LABELS,
  SAFETY_GRADE_INFO,
  type AdditiveInfo,
  type AdditiveCategory,
} from "@/lib/additives/types";

export const metadata: Metadata = {
  title: "添加物ガイド | サプティア（Suptia）",
  description:
    "サプリメントに含まれる添加物の安全性を科学的根拠に基づいて解説。賦形剤、着色料、保存料など50種以上の添加物を安全性グレード別に分類。",
  keywords: [
    "サプリメント添加物",
    "食品添加物",
    "添加物安全性",
    "二酸化チタン",
    "ステアリン酸マグネシウム",
    "着色料",
    "保存料",
    "甘味料",
    "賦形剤",
    "サプリ成分",
  ],
  openGraph: {
    title: "添加物ガイド | サプティア",
    description:
      "サプリメントに含まれる添加物の安全性を科学的根拠に基づいて解説",
    type: "website",
  },
  alternates: {
    canonical: "https://suptia.com/guide/additives",
  },
};

// 構造化データ
function generateStructuredData() {
  const avoidAdditives = getAdditivesBySafetyGrade("avoid");
  const cautionAdditives = getAdditivesBySafetyGrade("caution");

  // FAQPage構造化データ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "サプリメントに含まれる添加物は安全ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "多くの添加物は製品の品質維持や成形に必要な役割を果たしており、適切な使用量では安全です。ただし、二酸化チタンなど一部の添加物はEUで禁止されているものもあり、サプティアでは「回避推奨」「注意」「安全」の3段階で評価しています。",
        },
      },
      {
        "@type": "Question",
        name: "避けるべき添加物はありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `サプティアでは${avoidAdditives.length}種類の添加物を「回避推奨」に分類しています。${avoidAdditives.map((a) => a.name).join("、")}などは、可能であれば含まない製品を選ぶことをおすすめします。`,
        },
      },
      {
        "@type": "Question",
        name: "ステアリン酸マグネシウムは危険ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ステアリン酸マグネシウムは錠剤製造時の滑沢剤として広く使用されており、JECFA（FAO/WHO）やEFSAでも安全と評価されています。通常の使用量では問題ありません。",
        },
      },
      {
        "@type": "Question",
        name: "人工甘味料は安全ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "アスパルテーム、スクラロース、アセスルファムKなどの人工甘味料は「注意」カテゴリに分類しています。ADI（1日許容摂取量）内では安全とされていますが、フェニルケトン尿症の方はアスパルテームを避ける必要があります。",
        },
      },
    ],
  };

  // ItemList構造化データ
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "サプリメント添加物ガイド",
    description:
      "サプリメントに含まれる添加物を安全性グレード別に分類したリスト",
    numberOfItems: ADDITIVES_DATA.length,
    itemListElement: [
      ...avoidAdditives.map((additive, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: additive.name,
        description: `${additive.rationale.summary}（回避推奨）`,
      })),
      ...cautionAdditives.slice(0, 5).map((additive, index) => ({
        "@type": "ListItem",
        position: avoidAdditives.length + index + 1,
        name: additive.name,
        description: `${additive.rationale.summary}（注意）`,
      })),
    ],
  };

  // WebPage構造化データ
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "添加物ガイド",
    description:
      "サプリメントに含まれる添加物の安全性を科学的根拠に基づいて解説",
    url: "https://suptia.com/guide/additives",
    isPartOf: {
      "@type": "WebSite",
      name: "サプティア",
      url: "https://suptia.com",
    },
    about: {
      "@type": "Thing",
      name: "食品添加物",
    },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".hero-description"],
    },
  };

  return [faqSchema, itemListSchema, webPageSchema];
}

const safetyGradeConfig = {
  avoid: {
    label: "回避推奨",
    color: systemColors.red,
    bgColor: `${systemColors.red}10`,
    borderColor: `${systemColors.red}30`,
    icon: AlertTriangle,
    description: "可能であれば含まない製品を選びましょう",
  },
  caution: {
    label: "注意",
    color: systemColors.orange,
    bgColor: `${systemColors.orange}10`,
    borderColor: `${systemColors.orange}30`,
    icon: AlertCircle,
    description: "過剰摂取や特定条件で注意が必要です",
  },
  safe: {
    label: "安全",
    color: systemColors.green,
    bgColor: `${systemColors.green}10`,
    borderColor: `${systemColors.green}30`,
    icon: CheckCircle2,
    description: "長期摂取でも問題ないとされています",
  },
};

const categoryIcons: Record<AdditiveCategory, string> = {
  preservative: "🧴",
  antioxidant: "🛡️",
  colorant: "🎨",
  sweetener: "🍬",
  emulsifier: "🔗",
  stabilizer: "⚖️",
  thickener: "🫗",
  coating: "✨",
  binder: "📎",
  filler: "📦",
  flavor: "🌸",
  "acidity-regulator": "⚗️",
  "anti-caking": "🧂",
  lubricant: "💧",
  capsule: "💊",
  other: "📋",
};

export default function AdditivesGuidePage() {
  const avoidAdditives = getAdditivesBySafetyGrade("avoid");
  const cautionAdditives = getAdditivesBySafetyGrade("caution");
  const safeAdditives = getAdditivesBySafetyGrade("safe");

  const groupedByGrade = {
    avoid: avoidAdditives,
    caution: cautionAdditives,
    safe: safeAdditives,
  };

  // カテゴリ別にグループ化
  const categoryCounts = ADDITIVES_DATA.reduce(
    (acc, additive) => {
      acc[additive.category] = (acc[additive.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalAdditives = ADDITIVES_DATA.length;
  const avoidCount = avoidAdditives.length;
  const cautionCount = cautionAdditives.length;

  const structuredData = generateStructuredData();

  return (
    <>
      {/* 構造化データ */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* Hero Section */}
        <section
          className="py-16 sm:py-20 lg:py-24 border-b"
          style={{
            background: `linear-gradient(135deg, ${systemColors.purple}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.blue}08 100%)`,
            borderColor: appleWebColors.borderSubtle,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="text-center">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
                style={{
                  backgroundColor: `${systemColors.purple}15`,
                  border: `1px solid ${systemColors.purple}30`,
                }}
              >
                <Beaker size={16} style={{ color: systemColors.purple }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.purple }}
                >
                  添加物チェック
                </span>
              </div>

              <h1
                className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                添加物ガイド
              </h1>

              <p
                className="text-[17px] sm:text-[20px] max-w-3xl mx-auto leading-relaxed mb-10"
                style={{ color: appleWebColors.textSecondary }}
              >
                サプリメントに含まれる添加物の安全性を
                <br className="hidden sm:block" />
                科学的根拠に基づいて解説します。
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
                    style={{ color: systemColors.purple }}
                  >
                    {totalAdditives}
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    添加物を収録
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
                    {avoidCount}
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    回避推奨
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
                    style={{ color: systemColors.orange }}
                  >
                    {cautionCount}
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    注意が必要
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
                    style={{ color: systemColors.green }}
                  >
                    {Object.keys(categoryCounts).length}
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    カテゴリ
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
                backgroundColor: `${systemColors.blue}08`,
                borderColor: `${systemColors.blue}30`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-[12px] flex-shrink-0"
                  style={{ backgroundColor: `${systemColors.blue}15` }}
                >
                  <Info size={24} style={{ color: systemColors.blue }} />
                </div>
                <div>
                  <h2
                    className="text-[17px] font-bold mb-3"
                    style={{ color: systemColors.blue }}
                  >
                    添加物の安全性について
                  </h2>
                  <ul className="space-y-2">
                    {[
                      "添加物は製品の品質維持や成形に必要な役割を果たしています",
                      "「回避推奨」でも日本では使用が認められており、直ちに危険というわけではありません",
                      "アレルギーや持病がある場合は、特定の添加物を避ける必要があることがあります",
                      "不安な場合は医師や薬剤師にご相談ください",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight
                          size={16}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: systemColors.blue }}
                        />
                        <span
                          className="text-[15px] leading-relaxed"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Grade Sections */}
        <section className="py-12 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2
                className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                安全性グレード別一覧
              </h2>
              <p
                className="text-[17px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                サプティア独自の基準で添加物を3段階に分類しています。
              </p>
            </div>

            <div className="space-y-10">
              {(["avoid", "caution", "safe"] as const).map((grade) => {
                const additives = groupedByGrade[grade];
                const config = safetyGradeConfig[grade];
                if (additives.length === 0) return null;

                const IconComponent = config.icon;

                return (
                  <div key={grade} className="space-y-4">
                    {/* Grade Header */}
                    <div
                      className="rounded-[16px] p-5 border"
                      style={{
                        backgroundColor: config.bgColor,
                        borderColor: config.borderColor,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="p-3 rounded-[12px]"
                            style={{ backgroundColor: `${config.color}20` }}
                          >
                            <IconComponent
                              size={24}
                              style={{ color: config.color }}
                            />
                          </div>
                          <div>
                            <h3
                              className="text-[20px] font-bold"
                              style={{ color: config.color }}
                            >
                              {config.label}
                            </h3>
                            <p
                              className="text-[14px]"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              {config.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-[28px] font-bold"
                            style={{ color: config.color }}
                          >
                            {additives.length}
                          </div>
                          <div
                            className="text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            件
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additives Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {additives.map((additive) => (
                        <AdditiveCard
                          key={additive.id}
                          additive={additive}
                          config={config}
                          IconComponent={IconComponent}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section
          className="py-16 sm:py-20 px-6 lg:px-12"
          style={{ backgroundColor: appleWebColors.sectionBackground }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
                style={{
                  backgroundColor: `${systemColors.blue}15`,
                  border: `1px solid ${systemColors.blue}30`,
                }}
              >
                <Filter size={16} style={{ color: systemColors.blue }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.blue }}
                >
                  カテゴリ別
                </span>
              </div>
              <h2
                className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                用途別に添加物を確認
              </h2>
              <p
                className="text-[17px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                添加物は製品の製造・保存に必要な役割を果たしています。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(ADDITIVE_CATEGORY_LABELS).map(([key, label]) => {
                const category = key as AdditiveCategory;
                const count = categoryCounts[category] || 0;
                if (count === 0) return null;

                const categoryAdditives = ADDITIVES_DATA.filter(
                  (a) => a.category === category,
                );
                const hasAvoid = categoryAdditives.some(
                  (a) => a.safetyGrade === "avoid",
                );
                const hasCaution = categoryAdditives.some(
                  (a) => a.safetyGrade === "caution",
                );

                return (
                  <div
                    key={key}
                    className={`rounded-[16px] p-5 border ${liquidGlassClasses.light}`}
                    style={{
                      borderColor: appleWebColors.borderSubtle,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">
                        {categoryIcons[category]}
                      </span>
                      <div>
                        <h3
                          className="font-bold text-[17px]"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {label}
                        </h3>
                        <p
                          className="text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {count}種類
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hasAvoid && (
                        <span
                          className="text-[11px] px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${systemColors.red}15`,
                            color: systemColors.red,
                          }}
                        >
                          回避推奨あり
                        </span>
                      )}
                      {hasCaution && (
                        <span
                          className="text-[11px] px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${systemColors.orange}15`,
                            color: systemColors.orange,
                          }}
                        >
                          注意あり
                        </span>
                      )}
                      {!hasAvoid && !hasCaution && (
                        <span
                          className="text-[11px] px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${systemColors.green}15`,
                            color: systemColors.green,
                          }}
                        >
                          すべて安全
                        </span>
                      )}
                    </div>

                    <div className="text-[13px] space-y-1">
                      {categoryAdditives.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                safetyGradeConfig[a.safetyGrade].color,
                            }}
                          />
                          {a.name}
                        </div>
                      ))}
                      {categoryAdditives.length > 3 && (
                        <div
                          className="text-[12px]"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          ほか {categoryAdditives.length - 3} 件...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="py-12 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2
                className="text-[24px] font-bold mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                データソース
              </h2>
              <p
                className="text-[15px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                添加物の安全性評価には以下の情報源を参照しています
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "厚生労働省",
                  description: "日本国内の食品添加物規制・既存添加物リスト",
                  color: systemColors.blue,
                },
                {
                  name: "JECFA (FAO/WHO)",
                  description: "国際的なADI（1日許容摂取量）基準",
                  color: systemColors.green,
                },
                {
                  name: "EFSA",
                  description: "欧州食品安全機関による安全性評価",
                  color: systemColors.purple,
                },
                {
                  name: "サプティア独自評価",
                  description: "上記を総合的に判断した独自分類",
                  color: systemColors.orange,
                },
              ].map((source) => (
                <div
                  key={source.name}
                  className={`rounded-[12px] p-4 border ${liquidGlassClasses.light}`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <div>
                      <h3
                        className="font-semibold text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {source.name}
                      </h3>
                      <p
                        className="text-[13px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {source.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className="rounded-[24px] p-8 sm:p-12 border"
              style={{
                background: `linear-gradient(135deg, ${systemColors.purple}10 0%, ${systemColors.blue}10 100%)`,
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h2
                className="text-[24px] sm:text-[28px] font-bold mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                成分の安全性もチェック
              </h2>
              <p
                className="text-[17px] mb-8 max-w-2xl mx-auto leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                添加物だけでなく、サプリメント成分自体の安全性も
                重要です。危険成分ガイドで確認しましょう。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/guide/dangerous-ingredients"
                  className="group flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] min-h-[48px]"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.red} 0%, ${systemColors.orange} 100%)`,
                    boxShadow: `0 4px 16px ${systemColors.red}40`,
                  }}
                >
                  危険成分ガイドを見る
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/ingredients"
                  className={`group flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    color: appleWebColors.textPrimary,
                  }}
                >
                  全成分ガイドを見る
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Additive Card Component
function AdditiveCard({
  additive,
  config,
  IconComponent,
}: {
  additive: AdditiveInfo;
  config: (typeof safetyGradeConfig)[keyof typeof safetyGradeConfig];
  IconComponent: typeof AlertTriangle;
}) {
  return (
    <div
      className={`h-full rounded-[16px] p-5 border ${liquidGlassClasses.light}`}
      style={{
        borderColor: appleWebColors.borderSubtle,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent size={18} style={{ color: config.color }} />
          <h4
            className="font-bold text-[17px]"
            style={{ color: appleWebColors.textPrimary }}
          >
            {additive.name}
          </h4>
        </div>
        <span className="text-lg">{categoryIcons[additive.category]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className="inline-block px-3 py-1 rounded-full text-[12px] font-medium"
          style={{
            backgroundColor: config.bgColor,
            color: config.color,
            border: `1px solid ${config.borderColor}`,
          }}
        >
          {ADDITIVE_CATEGORY_LABELS[additive.category]}
        </span>
        {additive.adiMgPerKg && (
          <span
            className="inline-block px-3 py-1 rounded-full text-[12px] font-medium"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              color: appleWebColors.textSecondary,
            }}
          >
            ADI: {additive.adiMgPerKg}mg/kg
          </span>
        )}
      </div>

      {additive.aliases.length > 0 && (
        <p
          className="text-[13px] mb-3 line-clamp-1"
          style={{ color: appleWebColors.textTertiary }}
        >
          別名: {additive.aliases.slice(0, 3).join("、")}
          {additive.aliases.length > 3 && " ほか"}
        </p>
      )}

      <p
        className="text-[14px] leading-relaxed mb-4"
        style={{ color: appleWebColors.textSecondary }}
      >
        {additive.rationale.summary}
      </p>

      {additive.concerns.length > 0 && (
        <div className="space-y-1.5">
          {additive.concerns.slice(0, 2).map((concern, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-[13px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <AlertCircle
                size={14}
                className="mt-0.5 flex-shrink-0"
                style={{ color: config.color }}
              />
              <span className="line-clamp-2">{concern}</span>
            </div>
          ))}
        </div>
      )}

      {additive.contraindications.length > 0 && (
        <div
          className="mt-3 pt-3 border-t"
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <p
            className="text-[12px] font-medium mb-1.5"
            style={{ color: systemColors.red }}
          >
            禁忌情報
          </p>
          {additive.contraindications.slice(0, 1).map((ci, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-[13px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <Shield
                size={14}
                className="mt-0.5 flex-shrink-0"
                style={{ color: systemColors.red }}
              />
              <span>
                <strong>{ci.condition}</strong>: {ci.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
