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
  MessageCircle,
  Sparkles,
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
  title: "サプティアの使い方｜AIに相談→理由を理解→安心して選べる",
  description:
    "サプティアの使い方を初心者にも分かりやすく解説。AIコンシェルジュに悩みを伝えるだけ。健康判断に必要な5つの視点で、選んだ根拠と注意点を解説します。",
  openGraph: {
    title: "サプティアの使い方｜AIに相談→理由を理解→安心して選べる",
    description: "悩みを伝えるだけ。AIコンシェルジュが一緒に考えます。",
    type: "website",
  },
};

// HowToステップデータ
const howToSteps = [
  {
    name: "AIに相談",
    text: "悩みを伝えるだけ。AIコンシェルジュが、あなたの判断スタイルに合わせて一緒に考えます。",
  },
  {
    name: "理由を理解",
    text: "なぜおすすめなのか、理由がわかる。健康判断に必要な5つの視点で、選んだ根拠と注意点を解説します。",
  },
  {
    name: "安心して選べる",
    text: "後悔しない選択を。理由がわかるから安心できる。最安値も自動で見つけて比較できます。",
  },
];

// FAQデータ
const faqData = [
  {
    question: "利用料金はかかりますか？",
    answer:
      "基本機能は無料でご利用いただけます。Freeプランでは週3回のAI質問、30日間の価格履歴閲覧が可能です。より多くの質問や高度な機能が必要な方にはPro（¥980/月）、Pro+Safety（¥1,980/月）プランをご用意しています。",
  },
  {
    question: "ChatGPTやPerplexityとは何が違いますか？",
    answer:
      "汎用AIは一般的な知識に基づく回答ですが、サプティアは476商品のリアルタイム価格データ、薬機法コンプライアンス、あなたの健康情報を考慮した推薦など、サプリメント選びに特化した情報を提供します。「AIは一般論。サプティアはあなた専用。」",
  },
  {
    question: "どのECサイトに対応していますか？",
    answer:
      "現在、楽天市場・Yahoo!ショッピングに対応しています。Amazonは2026年1月以降に対応予定です。価格情報は毎日自動的に更新されています。",
  },
  {
    question: "Pro+SafetyのSafety Guardian機能とは？",
    answer:
      "あなたの既往歴・服薬情報・アレルギーを考慮し、相互作用のある成分を自動でチェック。危険な成分を含む商品は自動ブロックされ、複雑なケースでは最高性能のAIモデル（最新Opus）が対応します。PMDA・Natural Medicines Database等の信頼性の高いソースに基づいています。",
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
              悩みを伝えるだけ。AIコンシェルジュが、
              <br className="hidden sm:block" />
              あなたの判断スタイルに合わせて一緒に考えます。
            </p>

            <div>
              <Link
                href="/concierge"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80"
                style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
              >
                <MessageCircle size={18} />
                AIに相談する
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
                  icon: MessageCircle,
                  title: "AIに相談",
                  description:
                    "悩みを伝えるだけ。あなたの判断スタイルに合わせて一緒に考えます。",
                  color: systemColors.blue,
                },
                {
                  step: "STEP 2",
                  icon: Sparkles,
                  title: "理由を理解",
                  description: "5つの視点で、選んだ根拠と注意点を解説します。",
                  color: systemColors.indigo,
                },
                {
                  step: "STEP 3",
                  icon: CheckCircle2,
                  title: "安心して選べる",
                  description:
                    "理由がわかるから安心。最安値も自動で比較できます。",
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

        {/* STEP 1: AIに相談 */}
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
                  <MessageCircle size={16} />
                  <span>STEP 1</span>
                </div>
                <h2
                  className="mb-4 text-[28px] lg:text-[34px] font-bold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  まずは、悩みを
                  <span style={{ color: systemColors.blue }}>AIに相談</span>
                </h2>
                <p
                  className="text-[17px] mb-6 leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  「疲れが取れない」「肌荒れが気になる」など、悩みを伝えるだけ。AIコンシェルジュが、あなたの判断スタイルに合わせて一緒に考えます。
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
                        4人のキャラクターから選べる
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        コスパ重視、安全性重視など、あなたの判断スタイルに合わせて
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
                        自然な言葉で質問OK
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        成分名がわからなくても、悩みを伝えれば大丈夫
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Chat UI */}
                <div
                  className="relative rounded-2xl p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="space-y-4">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div
                        className="max-w-[80%] p-3 rounded-2xl rounded-br-md text-[15px]"
                        style={{
                          backgroundColor: systemColors.blue,
                          color: "#FFFFFF",
                        }}
                      >
                        最近疲れが取れなくて...
                      </div>
                    </div>
                    {/* AI response */}
                    <div className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${systemColors.blue}15` }}
                      >
                        <MessageCircle
                          size={16}
                          style={{ color: systemColors.blue }}
                        />
                      </div>
                      <div
                        className="max-w-[80%] p-3 rounded-2xl rounded-bl-md text-[15px]"
                        style={{
                          backgroundColor: appleWebColors.pageBackground,
                          color: appleWebColors.textPrimary,
                        }}
                      >
                        疲労回復には、ビタミンB群やCoQ10が科学的に効果が認められています。あなたの生活スタイルを教えていただけますか？
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: 理由を理解 */}
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
                    backgroundColor: `${systemColors.indigo}15`,
                    color: systemColors.indigo,
                  }}
                >
                  <Sparkles size={16} />
                  <span>STEP 2</span>
                </div>
                <h2
                  className="mb-4 text-[28px] lg:text-[34px] font-bold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  なぜおすすめなのか、
                  <span style={{ color: systemColors.indigo }}>理由を理解</span>
                </h2>
                <p
                  className="text-[17px] mb-6 leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  健康判断に必要な5つの視点で、選んだ根拠と注意点を解説します。「なぜこの商品を選んだか」が100%理解できます。
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "価格", icon: DollarSign },
                    { title: "成分量", icon: BarChart3 },
                    { title: "コスパ", icon: TrendingUp },
                    { title: "エビデンス", icon: Microscope },
                    { title: "安全性", icon: Shield },
                  ].map((filter, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${systemColors.indigo}10` }}
                      >
                        <filter.icon
                          size={18}
                          style={{ color: systemColors.indigo }}
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
                {/* Mock Explanation UI */}
                <div
                  className="relative rounded-2xl p-6 overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${systemColors.indigo}15` }}
                      >
                        <Sparkles
                          size={20}
                          style={{ color: systemColors.indigo }}
                        />
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-[17px]"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          おすすめの理由
                        </h3>
                        <p
                          className="text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          5つの視点から解説
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          icon: "🔬",
                          title: "エビデンス",
                          text: "大規模RCTで効果が確認されています",
                        },
                        {
                          icon: "💡",
                          title: "コスパ",
                          text: "1日あたり約30円、成分量あたり価格も最安",
                        },
                        {
                          icon: "⚠️",
                          title: "注意点",
                          text: "ビタミンE併用時は吸収に注意",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl"
                          style={{
                            backgroundColor: appleWebColors.pageBackground,
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-[16px]">{item.icon}</span>
                            <div>
                              <p
                                className="font-medium text-[14px]"
                                style={{ color: appleWebColors.textPrimary }}
                              >
                                {item.title}
                              </p>
                              <p
                                className="text-[13px]"
                                style={{ color: appleWebColors.textSecondary }}
                              >
                                {item.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: 安心して選べる */}
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
                  <CheckCircle2 size={16} />
                  <span>STEP 3</span>
                </div>
                <h2
                  className="mb-4 text-[28px] lg:text-[34px] font-bold leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  後悔しない選択を。
                  <span style={{ color: systemColors.green }}>
                    安心して選べる
                  </span>
                </h2>
                <p
                  className="text-[17px] mb-6 leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  理由がわかるから安心できる。最安値も自動で見つけて比較できます。
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
                        根拠がわかるから安心
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        「なぜこれがいいのか」を理解した上で選べます
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
                        最安値を自動比較
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        楽天・Amazon・Yahoo!の価格を毎日更新
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
                  a: "基本機能は無料でご利用いただけます。Freeプランでは週3回のAI質問、30日間の価格履歴閲覧が可能です。より多くの質問や高度な機能が必要な方にはPro（¥980/月）、Pro+Safety（¥1,980/月）プランをご用意しています。",
                },
                {
                  q: "ChatGPTやPerplexityとは何が違いますか？",
                  a: "汎用AIは一般的な知識に基づく回答ですが、サプティアは476商品のリアルタイム価格データ、薬機法コンプライアンス、あなたの健康情報を考慮した推薦など、サプリメント選びに特化した情報を提供します。",
                },
                {
                  q: "どのECサイトに対応していますか？",
                  a: "現在、楽天市場・Yahoo!ショッピングに対応しています。Amazonは2026年1月以降に対応予定です。価格情報は毎日自動的に更新されています。",
                },
                {
                  q: "Pro+SafetyのSafety Guardian機能とは？",
                  a: "あなたの既往歴・服薬情報・アレルギーを考慮し、相互作用のある成分を自動でチェック。危険な成分を含む商品は自動ブロックされ、複雑なケースでは最高性能のAIモデル（最新Opus）が対応します。",
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
              まずはAIに相談してみましょう
            </h2>
            <p
              className="mb-8 text-[17px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              悩みを伝えるだけ。AIコンシェルジュが一緒に考えます。
            </p>
            <Link
              href="/concierge"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80"
              style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
            >
              <MessageCircle size={18} />
              AIに相談する
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
