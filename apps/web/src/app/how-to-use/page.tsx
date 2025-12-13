import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  Search,
  Filter,
  MousePointerClick,
  DollarSign,
  Award,
  ArrowRight,
  CheckCircle2,
  Star,
  BarChart3,
  Shield,
  Microscope,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  generateHowToStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
} from "@/lib/structured-data";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com";

export const metadata: Metadata = {
  title:
    "サプティアの使い方｜初心者でも簡単3ステップで最適なサプリメントを見つける方法",
  description:
    "サプティアの使い方を初心者にも分かりやすく解説。検索→比較→購入の3ステップで、科学的根拠に基づいた最適なサプリメントを見つけられます。フィルター機能やランクシステムの活用方法も詳しく説明します。",
  openGraph: {
    title: "サプティアの使い方｜簡単3ステップガイド",
    description:
      "初めての方でも簡単にサプリメントを比較・選択できるステップバイステップガイドです。",
    type: "website",
  },
};

// HowToステップデータ
const howToSteps = [
  {
    name: "検索する",
    text: "成分名（ビタミンC、亜鉛など）や目的（美肌、疲労回復など）でサプリメントを検索します。日本語・英語の両方に対応しており、部分一致でも検索できます。",
  },
  {
    name: "比較する",
    text: "価格、成分量、コスパ、エビデンス、安全性の5つの指標をS〜Dのランクで比較します。フィルター機能で絞り込み、最適な商品を見つけられます。",
  },
  {
    name: "購入する",
    text: "楽天市場・Amazon・Yahoo!などの主要ECサイトの価格を自動比較。最安値を確認して、ワンクリックで購入ページへ移動できます。",
  },
];

// FAQデータ
const faqData = [
  {
    question: "利用料金はかかりますか？",
    answer:
      "いいえ、サプティアは完全無料でご利用いただけます。商品の比較・検索・価格確認まで、すべての機能を無料で使えます。",
  },
  {
    question: "どのECサイトに対応していますか？",
    answer:
      "現在、楽天市場・Yahoo!ショッピングに対応しています。Amazonは2026年1月以降に対応予定です。",
  },
  {
    question: "価格情報の更新頻度は？",
    answer:
      "価格情報は毎日自動的に更新されています。常に最新の価格を表示するよう努めています。",
  },
  {
    question: "エビデンスレベルはどのように評価されていますか？",
    answer:
      "大規模RCT、メタ解析、査読付き論文などの科学的研究に基づいて、S/A/B/C/Dの5段階で評価しています。詳細は各成分ガイドページをご覧ください。",
  },
  {
    question: "安全性スコアの算出方法は？",
    answer:
      "副作用の数、相互作用の数、エビデンスレベル、添加物の安全性などを総合的に評価し、0-100点のスコアで表示しています。",
  },
];

export default function HowToUsePage() {
  // JSON-LD構造化データを生成
  const breadcrumbJsonLd = generateBreadcrumbStructuredData([
    { name: "ホーム", url: siteUrl },
    { name: "使い方", url: `${siteUrl}/how-to-use` },
  ]);

  const howToJsonLd = generateHowToStructuredData({
    name: "サプティアで最適なサプリメントを見つける方法",
    description:
      "初心者でも簡単3ステップで、科学的根拠に基づいた最適なサプリメントを見つける方法を解説します。",
    totalTime: "PT5M",
    estimatedCost: {
      currency: "JPY",
      value: "0",
    },
    steps: howToSteps,
  });

  const faqJsonLd = generateFAQStructuredData(faqData);

  return (
    <>
      {/* 構造化データ（JSON-LD） */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="howto-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* Global Background */}
        <div
          className="absolute inset-0 -z-50"
          style={{ backgroundColor: appleWebColors.pageBackground }}
        />

        {/* ヒーローセクション */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Light Gradient Background */}
          <div
            className="absolute inset-0 -z-20"
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}15 0%, ${systemColors.purple}10 50%, ${systemColors.cyan}15 100%)`,
            }}
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <Star size={16} style={{ color: systemColors.orange }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                初心者でも簡単
              </span>
            </div>

            <h1
              className="mb-6 text-[34px] lg:text-[56px] font-bold leading-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              サプティアの使い方
            </h1>

            <p
              className="mx-auto mb-10 max-w-3xl text-[17px] lg:text-[22px] leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              たった3ステップで、あなたにぴったりのサプリメントが見つかります。
              <br className="hidden sm:block" />
              科学的根拠・価格・安全性を比較して、納得の選択を。
            </p>

            <div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80"
                style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
              >
                今すぐ商品を探す
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* 3ステップの概要 */}
        <section className="relative z-10 -mt-12 px-6 lg:px-12 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  step: "STEP 1",
                  icon: Search,
                  title: "検索する",
                  description:
                    "成分名や目的から、欲しいサプリメントを検索します。",
                  color: systemColors.blue,
                },
                {
                  step: "STEP 2",
                  icon: Filter,
                  title: "比較する",
                  description:
                    "フィルターやランクで絞り込み、最適な商品を見つけます。",
                  color: systemColors.purple,
                },
                {
                  step: "STEP 3",
                  icon: MousePointerClick,
                  title: "購入する",
                  description:
                    "最安値のECサイトを確認して、そのまま購入ページへ。",
                  color: systemColors.green,
                },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative group">
                    {index < 2 && (
                      <div className="absolute top-1/2 -right-3 z-0 hidden md:block transform -translate-y-1/2 translate-x-1/2">
                        <ChevronRight
                          size={24}
                          style={{ color: appleWebColors.textTertiary }}
                        />
                      </div>
                    )}
                    <div
                      className={`relative z-10 rounded-2xl p-6 transition-all hover:-translate-y-1 h-full flex flex-col ${liquidGlassClasses.light}`}
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <span
                          className="text-[11px] font-semibold tracking-wider px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: appleWebColors.pageBackground,
                            color: appleWebColors.textTertiary,
                          }}
                        >
                          {step.step}
                        </span>
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${step.color}15` }}
                        >
                          <Icon size={24} style={{ color: step.color }} />
                        </div>
                      </div>
                      <h3
                        className="mb-3 text-[19px] font-semibold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-[15px] leading-relaxed"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STEP 1: 検索する */}
        <section
          className="py-20 px-6 lg:px-12"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-[13px]"
                  style={{
                    backgroundColor: `${systemColors.blue}15`,
                    color: systemColors.blue,
                  }}
                >
                  <Search size={16} />
                  <span>STEP 1</span>
                </div>
                <h2
                  className="mb-4 text-[28px] lg:text-[34px] font-bold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  まずは、気になる成分や悩みで
                  <span style={{ color: systemColors.blue }}>検索</span>
                </h2>
                <p
                  className="text-[17px] mb-6 leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  「ビタミンC」「亜鉛」などの成分名はもちろん、「美肌」「疲労回復」などの悩みや目的からも検索できます。
                </p>

                <div className="space-y-3">
                  <div
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${systemColors.blue}08`,
                      border: `1px solid ${systemColors.blue}15`,
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: systemColors.blue, marginTop: 2 }}
                    />
                    <div>
                      <p
                        className="font-semibold text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        日本語・英語の両方に対応
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        「ビタミンC」でも「Vitamin C」でもOK
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${systemColors.blue}08`,
                      border: `1px solid ${systemColors.blue}15`,
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: systemColors.blue, marginTop: 2 }}
                    />
                    <div>
                      <p
                        className="font-semibold text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        部分一致で検索可能
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        「ビタミン」だけでも関連成分を表示します
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Search UI */}
                <div
                  className="relative rounded-2xl p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div
                    className="flex items-center gap-4 mb-5 p-3 rounded-xl"
                    style={{
                      backgroundColor: appleWebColors.pageBackground,
                      border: `1px solid ${appleWebColors.borderSubtle}`,
                    }}
                  >
                    <Search
                      size={20}
                      style={{ color: appleWebColors.textTertiary }}
                    />
                    <span
                      className="text-[15px]"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      ビタミンC...
                    </span>
                    <span
                      className="ml-auto text-[11px] font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: appleWebColors.textTertiary,
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      Enter
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p
                      className="text-[11px] font-semibold tracking-wider"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      人気のカテゴリ
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "ビタミン",
                        "ミネラル",
                        "アミノ酸",
                        "美容",
                        "疲労回復",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                          style={{
                            backgroundColor: `${systemColors.blue}10`,
                            color: systemColors.blue,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: 比較する */}
        <section
          className="py-20 px-6 lg:px-12"
          style={{ backgroundColor: appleWebColors.pageBackground }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-[13px]"
                  style={{
                    backgroundColor: `${systemColors.purple}15`,
                    color: systemColors.purple,
                  }}
                >
                  <Filter size={16} />
                  <span>STEP 2</span>
                </div>
                <h2
                  className="mb-4 text-[28px] lg:text-[34px] font-bold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  ランクとデータで
                  <span style={{ color: systemColors.purple }}>徹底比較</span>
                </h2>
                <p
                  className="text-[17px] mb-6 leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  価格、成分量、コスパ、エビデンス、安全性。5つの指標をS〜Dのランクで評価。直感的に「良い商品」が見つかります。
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "価格帯", icon: DollarSign },
                    { title: "ランク", icon: Award },
                    { title: "安全性", icon: Shield },
                    { title: "エビデンス", icon: Microscope },
                  ].map((filter, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${systemColors.purple}10` }}
                      >
                        <filter.icon
                          size={18}
                          style={{ color: systemColors.purple }}
                        />
                      </div>
                      <span
                        className="font-medium text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {filter.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Rank UI */}
                <div
                  className="relative rounded-2xl p-6 overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3
                        className="font-semibold text-[17px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        総合評価
                      </h3>
                      <div
                        className="px-3 py-1 rounded-full text-[13px] font-semibold"
                        style={{
                          backgroundColor: `${systemColors.purple}15`,
                          color: systemColors.purple,
                        }}
                      >
                        Sランク
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: "価格", rank: "S", color: systemColors.green },
                        {
                          label: "含有量",
                          rank: "A",
                          color: systemColors.blue,
                        },
                        {
                          label: "コスパ",
                          rank: "S",
                          color: systemColors.purple,
                        },
                        {
                          label: "根拠",
                          rank: "S",
                          color: systemColors.indigo,
                        },
                        { label: "安全", rank: "A", color: systemColors.pink },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full h-20 rounded-lg relative overflow-hidden flex items-end justify-center pb-2"
                            style={{
                              backgroundColor: appleWebColors.pageBackground,
                            }}
                          >
                            <div
                              className="w-2/3 rounded-t-sm transition-all duration-1000"
                              style={{
                                backgroundColor: stat.color,
                                height: stat.rank === "S" ? "85%" : "65%",
                              }}
                            />
                          </div>
                          <span
                            className="text-[11px] font-medium"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            {stat.label}
                          </span>
                          <span
                            className="text-[17px] font-bold"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {stat.rank}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: 購入する */}
        <section
          className="py-20 px-6 lg:px-12"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-[13px]"
                  style={{
                    backgroundColor: `${systemColors.green}15`,
                    color: systemColors.green,
                  }}
                >
                  <MousePointerClick size={16} />
                  <span>STEP 3</span>
                </div>
                <h2
                  className="mb-4 text-[28px] lg:text-[34px] font-bold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  最安値を
                  <span style={{ color: systemColors.green }}>
                    ワンクリック
                  </span>
                  で購入
                </h2>
                <p
                  className="text-[17px] mb-6 leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  楽天・Amazon・Yahoo!など、主要ECサイトの価格を自動比較。その日の最安値がすぐに分かります。
                </p>

                <div className="space-y-3">
                  <div
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${systemColors.green}08`,
                      border: `1px solid ${systemColors.green}15`,
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: systemColors.green, marginTop: 2 }}
                    />
                    <div>
                      <p
                        className="font-semibold text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        価格は毎日自動更新
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        常に最新の価格情報を表示しています
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${systemColors.green}08`,
                      border: `1px solid ${systemColors.green}15`,
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: systemColors.green, marginTop: 2 }}
                    />
                    <div>
                      <p
                        className="font-semibold text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        ワンクリックで商品ページへ
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        面倒な検索は不要。そのまま購入できます
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Price UI */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <h3
                    className="text-[17px] font-semibold mb-5"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    価格比較
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        site: "楽天市場",
                        price: "¥3,980",
                        badge: "最安値",
                        highlight: true,
                      },
                      {
                        site: "Amazon",
                        price: "¥4,200",
                        badge: null,
                        highlight: false,
                      },
                      {
                        site: "Yahoo!",
                        price: "¥4,150",
                        badge: null,
                        highlight: false,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl transition-all"
                        style={{
                          backgroundColor: item.highlight
                            ? `${systemColors.green}08`
                            : "#FFFFFF",
                          border: `1px solid ${item.highlight ? `${systemColors.green}20` : appleWebColors.borderSubtle}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="font-medium text-[15px]"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {item.site}
                          </span>
                          {item.badge && (
                            <span
                              className="px-2 py-0.5 rounded text-[11px] font-semibold"
                              style={{
                                backgroundColor: `${systemColors.green}15`,
                                color: systemColors.green,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-[17px] font-bold"
                            style={{
                              color: item.highlight
                                ? systemColors.green
                                : appleWebColors.textPrimary,
                            }}
                          >
                            {item.price}
                          </span>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: appleWebColors.pageBackground,
                            }}
                          >
                            <ChevronRight
                              size={14}
                              style={{ color: appleWebColors.textTertiary }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section
          className="py-20 px-6 lg:px-12"
          style={{ backgroundColor: appleWebColors.pageBackground }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2
                className="text-[28px] lg:text-[34px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                よくある質問
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "利用料金はかかりますか？",
                  a: "いいえ、サプティアは完全無料でご利用いただけます。商品の比較・検索・価格確認まで、すべての機能を無料で使えます。",
                },
                {
                  q: "どのECサイトに対応していますか？",
                  a: "現在、楽天市場・Yahoo!ショッピングに対応しています。Amazonは2026年1月以降に対応予定です。",
                },
                {
                  q: "価格情報の更新頻度は？",
                  a: "価格情報は毎日自動的に更新されています。常に最新の価格を表示するよう努めています。",
                },
                {
                  q: "エビデンスレベルはどのように評価されていますか？",
                  a: "大規模RCT、メタ解析、査読付き論文などの科学的研究に基づいて、S/A/B/C/Dの5段階で評価しています。詳細は各成分ガイドページをご覧ください。",
                },
                {
                  q: "安全性スコアの算出方法は？",
                  a: "副作用の数、相互作用の数、エビデンスレベル、添加物の安全性などを総合的に評価し、0-100点のスコアで表示しています。",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className={`group rounded-2xl transition-all ${liquidGlassClasses.light}`}
                  style={{ border: `1px solid ${appleWebColors.borderSubtle}` }}
                >
                  <summary
                    className="flex cursor-pointer items-center justify-between p-5 font-semibold text-[15px] transition-all"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${systemColors.blue}15`,
                          color: systemColors.blue,
                        }}
                      >
                        Q
                      </span>
                      {faq.q}
                    </span>
                    <ChevronRight
                      size={18}
                      className="transition-transform group-open:rotate-90"
                      style={{ color: appleWebColors.textTertiary }}
                    />
                  </summary>
                  <div
                    className="p-5 pt-0"
                    style={{
                      borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                    }}
                  >
                    <div
                      className="mt-4 flex items-start gap-3 text-[15px] leading-relaxed"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold mt-0.5"
                        style={{
                          backgroundColor: appleWebColors.pageBackground,
                          color: appleWebColors.textTertiary,
                        }}
                      >
                        A
                      </span>
                      {faq.a}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section
          className="relative overflow-hidden py-24"
          style={{ backgroundColor: appleWebColors.pageBackground }}
        >
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
            <h2
              className="mb-4 text-[28px] lg:text-[40px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              さあ、サプティアを使ってみましょう
            </h2>
            <p
              className="mb-8 text-[17px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              3ステップで、あなたにぴったりのサプリメントが見つかります。
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80"
              style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
            >
              商品を探す
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
