import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  Shield,
  DollarSign,
  TrendingUp,
  Microscope,
  Award,
  Search,
  ShoppingCart,
  CheckCircle2,
  Building2,
  Users,
  BarChart3,
  ArrowRight,
  Zap,
  MessageCircle,
  Sparkles,
  X,
  Check,
  Crown,
  Bot,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com";

// Organization Schema for E-E-A-T and AI search optimization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "サプティア",
  alternateName: "Suptia",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  description:
    "科学的エビデンス・価格比較・安全性評価を統合したサプリメント意思決定エンジン",
  foundingDate: "2024",
  sameAs: [
    "https://x.com/suptia_jp",
    "https://www.instagram.com/suptia_jp/",
    "https://www.threads.net/@suptia_jp",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@suptia.com",
    availableLanguage: ["Japanese"],
  },
  areaServed: {
    "@type": "Country",
    name: "Japan",
  },
  knowsAbout: [
    "サプリメント",
    "栄養補助食品",
    "ビタミン",
    "ミネラル",
    "健康食品",
    "科学的エビデンス",
    "薬機法",
  ],
  slogan: "AIが答えを出す時代。Suptiaはその根拠を示す。",
};

// WebSite Schema with SearchAction
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "サプティア",
  alternateName: "Suptia",
  url: siteUrl,
  description: "科学的根拠に基づくサプリメント比較プラットフォーム",
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "ja",
};

export const metadata: Metadata = {
  title: "サプティアとは｜AIコンシェルジュで「根拠」がわかるサプリ選び",
  description:
    "サプティアは、AIコンシェルジュに相談するだけで「なぜそれが良いか」まで説明してくれるAI意思決定エンジンです。価格・成分量・コスパ・エビデンス・安全性の5つの視点で、あなたの判断をサポートします。",
  openGraph: {
    title: "サプティアとは｜AIコンシェルジュで根拠がわかるサプリ選び",
    description:
      "悩みを伝えるだけ。AIコンシェルジュが5つの視点で根拠と注意点を解説します。",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Organization & WebSite Schema for E-E-A-T */}
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* ヒーローセクション */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Light Gradient Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.purple}08 50%, ${systemColors.cyan}10 100%)`,
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
              <Sparkles size={16} style={{ color: systemColors.blue }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                AI × サプリメント比較
              </span>
            </div>

            <h1
              className="mb-6 text-[34px] lg:text-[56px] font-bold leading-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              サプティアとは？
            </h1>

            <p
              className="mx-auto mb-10 max-w-3xl text-[17px] lg:text-[22px] leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              AIコンシェルジュに相談するだけ。
              <br className="hidden sm:block" />
              <span
                className="font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                「なぜそれが良いか」まで説明してくれる
              </span>
              AI意思決定エンジンです。
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/concierge"
                className="group flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80"
                style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
              >
                <MessageCircle size={18} />
                AIに相談する
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/how-to-use"
                className={`group flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80 ${liquidGlassClasses.light}`}
                style={{ color: appleWebColors.textPrimary }}
              >
                使い方ガイド
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* 問題提起セクション */}
        <section className="relative z-10 px-6 lg:px-12 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <p
                className="text-[13px] font-semibold tracking-wider uppercase mb-3"
                style={{ color: appleWebColors.textTertiary }}
              >
                サプリメント選びの課題
              </p>
              <h2
                className="text-[28px] lg:text-[40px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                こんな悩みはありませんか？
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: "情報が多すぎて選べない",
                  description:
                    "数千種類のサプリメントの中から、自分に合ったものを見つけるのは困難です。",
                },
                {
                  icon: DollarSign,
                  title: "価格が適正か分からない",
                  description:
                    "同じ成分でも価格がバラバラ。本当にお得な商品はどれ？",
                },
                {
                  icon: Microscope,
                  title: "効果に根拠があるか不明",
                  description:
                    "「効く」と書いてあるけど、科学的な証拠はあるの？",
                },
                {
                  icon: Shield,
                  title: "安全性が心配",
                  description: "副作用や相互作用、添加物の危険性が気になる。",
                },
                {
                  icon: BarChart3,
                  title: "成分量の比較が面倒",
                  description:
                    "1日あたりの成分量を計算して比較するのは時間がかかる。",
                },
                {
                  icon: ShoppingCart,
                  title: "どこで買うのが最安値？",
                  description:
                    "楽天、Amazon、Yahoo!...複数サイトを回るのは大変。",
                },
              ].map((problem, index) => {
                const Icon = problem.icon;
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  >
                    <div className="relative z-10">
                      <div
                        className="mb-4 inline-flex items-center justify-center rounded-xl p-3 transition-colors"
                        style={{ backgroundColor: `${systemColors.blue}10` }}
                      >
                        <Icon size={24} style={{ color: systemColors.blue }} />
                      </div>
                      <h3
                        className="mb-2 text-[17px] font-semibold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {problem.title}
                      </h3>
                      <p
                        className="text-[15px] leading-relaxed"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {problem.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* サプティアの解決策 */}
        <section
          className="relative py-24 overflow-hidden"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-16 text-center">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  backgroundColor: `${systemColors.blue}10`,
                  border: `1px solid ${systemColors.blue}20`,
                }}
              >
                <Zap size={16} style={{ color: systemColors.blue }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.blue }}
                >
                  サプティアの解決策
                </span>
              </div>
              <h2
                className="mb-4 text-[28px] lg:text-[40px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                健康判断に必要な5つの視点
              </h2>
              <p
                className="mx-auto max-w-2xl text-[17px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                AIコンシェルジュは、この5つの視点であなたの判断をサポート。
                <br className="hidden sm:block" />
                選んだ根拠と注意点を、わかりやすく解説します。
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: DollarSign,
                  title: "価格の比較",
                  description:
                    "楽天・Amazon・Yahoo!など複数ECサイトの価格を一括比較。JANコードベースの高精度マッチングで、同一商品の最安値を瞬時に表示します。",
                  color: systemColors.green,
                },
                {
                  icon: BarChart3,
                  title: "成分量の比較",
                  description:
                    "1日あたりの有効成分量を正確に表示。同じ成分を含む商品間で成分量を比較でき、mg単位で正規化された情報を提供します。",
                  color: systemColors.blue,
                },
                {
                  icon: TrendingUp,
                  title: "コスパの比較",
                  description:
                    "実効コスト/日（1日あたりの価格）と成分量あたりの価格（¥/mg）を算出。同等量換算での価格比較で、真のコストパフォーマンスが分かります。",
                  color: systemColors.purple,
                },
                {
                  icon: Microscope,
                  title: "エビデンスレベル",
                  description:
                    "S/A/B/C/Dの5段階評価で科学的信頼性を明示。大規模RCTやメタ解析などの研究に基づき、PubMed等の参考文献へのリンクも提供します。",
                  color: systemColors.indigo,
                },
                {
                  icon: Shield,
                  title: "安全性の表示",
                  description:
                    "安全性スコア（0-100点）で一目で判断。副作用・相互作用の警告、妊娠中・授乳中の注意喚起、薬機法コンプライアンスチェックも実施します。",
                  color: systemColors.pink,
                },
              ].map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  >
                    <div className="flex flex-col md:flex-row items-start gap-5 relative z-10">
                      <div
                        className="flex-shrink-0 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${pillar.color}15` }}
                      >
                        <Icon
                          size={28}
                          strokeWidth={1.5}
                          style={{ color: pillar.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="mb-2 text-[19px] font-semibold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {pillar.title}
                        </h3>
                        <p
                          className="text-[15px] leading-relaxed"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ランク評価システム */}
        <section
          className="py-24 px-6 lg:px-12"
          style={{ backgroundColor: appleWebColors.pageBackground }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  backgroundColor: `${systemColors.purple}10`,
                  border: `1px solid ${systemColors.purple}20`,
                }}
              >
                <Award size={16} style={{ color: systemColors.purple }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.purple }}
                >
                  ランク評価システム
                </span>
              </div>
              <h2
                className="mb-4 text-[28px] lg:text-[40px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                S〜Dの5段階評価
              </h2>
              <p
                className="mx-auto max-w-2xl text-[17px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                一目で優れた商品が分かる、統一された評価基準
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  badge: "価格S",
                  condition: "複数ECサイトの中で最も安い価格",
                  meaning: "この商品が最も安く買える",
                },
                {
                  badge: "含有量S",
                  condition: "その成分の含有量が最も多い",
                  meaning: "成分量で最も優れている",
                },
                {
                  badge: "コスパS",
                  condition: "コスパ（成分量あたり価格）が最も優れている",
                  meaning: "最もお得な選択肢",
                },
                {
                  badge: "エビデンスS",
                  condition: "エビデンスレベルがSランク",
                  meaning: "最高レベルの科学的根拠",
                },
                {
                  badge: "安全性S",
                  condition: "安全性スコア90点以上",
                  meaning: "安心して摂取できる",
                },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`group rounded-2xl p-5 transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{
                        backgroundColor: systemColors.purple,
                        color: "#FFFFFF",
                      }}
                    >
                      <Award size={16} />
                      <span className="font-semibold text-[15px]">
                        {badge.badge}
                      </span>
                    </div>
                    <CheckCircle2
                      size={20}
                      style={{ color: appleWebColors.textTertiary }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: appleWebColors.pageBackground }}
                    >
                      <p
                        className="mb-1 text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        獲得条件
                      </p>
                      <p
                        className="text-[15px] font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {badge.condition}
                      </p>
                    </div>
                    <div>
                      <p
                        className="mb-1 text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        意味
                      </p>
                      <p
                        className="font-semibold text-[17px]"
                        style={{ color: systemColors.purple }}
                      >
                        {badge.meaning}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* S+ランク（最高評価） */}
              <div
                className={`md:col-span-2 lg:col-span-1 relative overflow-hidden rounded-2xl p-6 ${liquidGlassClasses.light}`}
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple}10 0%, ${systemColors.pink}10 100%)`,
                }}
              >
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: systemColors.purple }}
                    >
                      <Award size={28} className="text-white" />
                    </div>
                    <div>
                      <h3
                        className="text-[22px] font-bold"
                        style={{ color: systemColors.purple }}
                      >
                        S+ランク
                      </h3>
                      <p
                        className="text-[12px] font-semibold tracking-wider"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        SUPREME
                      </p>
                    </div>
                  </div>

                  <p
                    className="text-[15px] leading-relaxed flex-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    全評価でSランクを達成した商品は「S+ランク」として特別に強調表示されます。
                  </p>
                  <div
                    className="mt-4 p-4 rounded-xl"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  >
                    <p
                      className="text-[15px] font-semibold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      価格・コスパ・含有量・エビデンス・安全性のすべてにおいて最高レベル
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section
          className="py-24 px-6 lg:px-12"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2
                className="text-[28px] lg:text-[40px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                なぜサプティアが選ばれるのか
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[
                {
                  icon: CheckCircle2,
                  title: "透明性と説明可能性",
                  description:
                    "推薦理由・出典（研究・価格・成分）を常に明示。AIのブラックボックス化を避け、あなたが理解して納得できる情報を提供します。",
                  color: systemColors.blue,
                },
                {
                  icon: Users,
                  title: "ユーザー第一主義",
                  description:
                    "アフィリエイト収益よりも、あなたにとって本当に最適な商品をお勧めします。公平で偏りのない評価を約束します。",
                  color: systemColors.green,
                },
                {
                  icon: Zap,
                  title: "常に最新情報",
                  description:
                    "価格は毎日更新、エビデンスも最新の研究に基づいて定期的にアップデート。古い情報で判断することはありません。",
                  color: systemColors.orange,
                },
                {
                  icon: Shield,
                  title: "法令遵守と倫理",
                  description:
                    "薬機法コンプライアンスを徹底。「治る」「防ぐ」などの誇大表現を排除し、科学的事実のみを伝えます。",
                  color: systemColors.purple,
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-5 rounded-2xl p-6 transition-all hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  >
                    <div
                      className="flex-shrink-0 rounded-xl p-3"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon
                        size={28}
                        strokeWidth={1.5}
                        style={{ color: feature.color }}
                      />
                    </div>
                    <div>
                      <h3
                        className="mb-2 text-[19px] font-semibold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-[15px] leading-relaxed"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI検索との違い */}
        <section
          className="py-24 px-6 lg:px-12"
          style={{ backgroundColor: appleWebColors.pageBackground }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  backgroundColor: `${systemColors.indigo}10`,
                  border: `1px solid ${systemColors.indigo}20`,
                }}
              >
                <Bot size={16} style={{ color: systemColors.indigo }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.indigo }}
                >
                  AI検索との違い
                </span>
              </div>
              <h2
                className="mb-4 text-[28px] lg:text-[40px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                ChatGPTやPerplexityとは何が違う？
              </h2>
              <p
                className="mx-auto max-w-3xl text-[17px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                汎用AIは一般的な情報を提供しますが、サプティアは
                <strong>あなた専用のデータベース</strong>
                を持ち、リアルタイムの価格・安全性情報を提供します。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* 一般的なAI検索 */}
              <div
                className={`rounded-2xl p-6 ${liquidGlassClasses.light}`}
                style={{ border: `1px solid ${appleWebColors.borderSubtle}` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: appleWebColors.pageBackground }}
                  >
                    <Bot
                      size={24}
                      style={{ color: appleWebColors.textTertiary }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-[19px] font-semibold"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      一般的なAI検索
                    </h3>
                    <p
                      className="text-[13px]"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      ChatGPT / Perplexity / Gemini
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "一般的な知識に基づく回答",
                    "価格情報は古いか不正確",
                    "日本の薬機法に非対応",
                    "あなたの健康情報を考慮しない",
                    "出典が不明確なことが多い",
                    "商品の具体的な比較が困難",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <X
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: appleWebColors.textTertiary }}
                      />
                      <span className="text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* サプティア */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue}08 0%, ${systemColors.purple}08 100%)`,
                  border: `2px solid ${systemColors.blue}30`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: systemColors.blue }}
                  >
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-[19px] font-semibold"
                      style={{ color: systemColors.blue }}
                    >
                      サプティア
                    </h3>
                    <p
                      className="text-[13px]"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      サプリメント特化AI
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "476商品のリアルタイム価格データ",
                    "毎日更新される最新価格",
                    "薬機法コンプライアンス対応",
                    "あなたの健康情報を考慮した推薦",
                    "PMDA等の信頼性の高い出典を明示",
                    "5つの視点で具体的に商品を比較",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <Check
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: systemColors.green }}
                      />
                      <span className="text-[15px] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="mt-8 p-5 rounded-2xl text-center"
              style={{
                backgroundColor: `${systemColors.blue}08`,
                border: `1px solid ${systemColors.blue}15`,
              }}
            >
              <p
                className="text-[17px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                「AIは一般論。サプティアはあなた専用。」
              </p>
              <p
                className="text-[15px] mt-2"
                style={{ color: appleWebColors.textSecondary }}
              >
                AIが答えを出す時代だからこそ、サプティアはその根拠を示します。
              </p>
            </div>
          </div>
        </section>

        {/* プラン比較 */}
        <section
          className="py-24 px-6 lg:px-12"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  backgroundColor: `${systemColors.purple}10`,
                  border: `1px solid ${systemColors.purple}20`,
                }}
              >
                <Crown size={16} style={{ color: systemColors.purple }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.purple }}
                >
                  プラン比較
                </span>
              </div>
              <h2
                className="mb-4 text-[28px] lg:text-[40px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                あなたに合ったプランを選べます
              </h2>
              <p
                className="mx-auto max-w-2xl text-[17px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                基本機能は無料。より高度なAIや安全性機能が必要な方には有料プランをご用意。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Free */}
              <div
                className={`flex flex-col rounded-2xl p-6 ${liquidGlassClasses.light}`}
                style={{ border: `1px solid ${appleWebColors.borderSubtle}` }}
              >
                <div className="flex-1">
                  <div className="text-center mb-6">
                    <h3
                      className="text-[22px] font-bold mb-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      Free
                    </h3>
                    <p
                      className="text-[34px] font-bold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      ¥0
                      <span
                        className="text-[15px] font-normal ml-1"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        /月
                      </span>
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "AI質問 5回/週",
                      "4キャラクター選択",
                      "価格履歴 30日間",
                      "高速応答モデル (Haiku)",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-[15px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        <Check
                          size={16}
                          className="flex-shrink-0"
                          style={{ color: systemColors.green }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/concierge"
                  className="block w-full text-center py-3 rounded-full font-semibold text-[15px] transition-all hover:opacity-80 mt-6"
                  style={{
                    backgroundColor: appleWebColors.pageBackground,
                    color: appleWebColors.textPrimary,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  無料で始める
                </Link>
              </div>

              {/* Pro */}
              <div
                className="relative flex flex-col rounded-2xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple}10 0%, ${systemColors.pink}10 100%)`,
                  border: `2px solid ${systemColors.purple}`,
                }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[12px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                  }}
                >
                  おすすめ
                </div>
                <div className="flex-1">
                  <div className="text-center mb-6 pt-2">
                    <h3
                      className="text-[22px] font-bold mb-2 flex items-center justify-center gap-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <Crown size={20} style={{ color: systemColors.yellow }} />
                      Pro
                    </h3>
                    <p
                      className="text-[34px] font-bold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      ¥590
                      <span
                        className="text-[15px] font-normal ml-1"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        /月
                      </span>
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "AI質問 25回/週",
                      "フォローアップ 3回/会話",
                      "価格履歴 1年間",
                      "高精度モデル (Sonnet)",
                      "推薦理由の重み付け表示",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Check
                          size={16}
                          className="flex-shrink-0"
                          style={{ color: systemColors.green }}
                        />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/mypage#plans"
                  className="block w-full text-center py-3 rounded-full font-semibold text-[15px] transition-all hover:opacity-80 text-white mt-6"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                  }}
                >
                  Proにアップグレード
                </Link>
              </div>

              {/* Pro+Safety */}
              <div
                className="flex flex-col rounded-2xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.green}10 0%, ${systemColors.teal}10 100%)`,
                  border: `2px solid ${systemColors.green}`,
                }}
              >
                <div className="flex-1">
                  <div className="text-center mb-6">
                    <h3
                      className="text-[22px] font-bold mb-2 flex items-center justify-center gap-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <Shield size={20} style={{ color: systemColors.green }} />
                      Pro + Safety
                    </h3>
                    <p
                      className="text-[34px] font-bold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      ¥1,280
                      <span
                        className="text-[15px] font-normal ml-1"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        /月
                      </span>
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "AI質問 無制限",
                      "フォローアップ 無制限",
                      "価格履歴 全期間",
                      "最高精度モデル (Sonnet+Opus)",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Check
                          size={16}
                          className="flex-shrink-0"
                          style={{ color: systemColors.green }}
                        />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="p-3 rounded-xl mt-4"
                    style={{
                      backgroundColor: `${systemColors.green}10`,
                      border: `1px solid ${systemColors.green}30`,
                    }}
                  >
                    <p
                      className="text-[12px] font-semibold mb-2"
                      style={{ color: systemColors.green }}
                    >
                      Safety Guardian機能
                    </p>
                    <ul className="space-y-1.5">
                      {[
                        "相互作用チェック",
                        "危険成分オートブロック",
                        "既往歴・服薬情報考慮",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          <Shield
                            size={12}
                            style={{ color: systemColors.green }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href="/mypage#plans"
                  className="block w-full text-center py-3 rounded-full font-semibold text-[15px] transition-all hover:opacity-80 text-white mt-6"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                  }}
                >
                  Pro+Safetyにアップグレード
                </Link>
              </div>
            </div>

            <p
              className="text-center text-[13px] mt-8"
              style={{ color: appleWebColors.textTertiary }}
            >
              Coming Soon
            </p>
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
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/concierge"
                className="group flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80"
                style={{ backgroundColor: systemColors.blue, color: "#FFFFFF" }}
              >
                <MessageCircle size={18} />
                AIに相談する
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/diagnosis"
                className={`group flex items-center gap-2 rounded-full px-8 py-3 min-h-[48px] font-semibold text-[17px] transition-all hover:opacity-80 ${liquidGlassClasses.light}`}
                style={{ color: appleWebColors.textPrimary }}
              >
                簡単診断から始める
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
