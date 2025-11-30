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
  Sparkles,
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

      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Global Background */}
        <div className="absolute inset-0 bg-slate-50 -z-50" />

        {/* ヒーローセクション */}
        <section className="relative overflow-hidden bg-[#3b66e0] py-24 lg:py-32">
          {/* Background Animation */}
          <div
            className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-[#3b66e0] via-[#f1faf9] to-[#3b66e0] -z-20 opacity-90"
            style={{ animationDuration: "15s" }}
          />
          <div
            className="absolute inset-0 animate-gradient-drift bg-gradient-to-br from-transparent via-[#f1faf9]/40 to-transparent -z-19 mix-blend-overlay"
            style={{
              animationDuration: "20s",
              animationDirection: "reverse",
              backgroundSize: "200% 200%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 -z-15 pointer-events-none" />

          {/* Mist Layers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div
              className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] bg-white/20 blur-[120px] rounded-full animate-mist-flow"
              style={{ animationDuration: "45s" }}
            />
            <div
              className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-[#f1faf9]/30 blur-[100px] rounded-full animate-mist-flow"
              style={{
                animationDuration: "35s",
                animationDirection: "reverse",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-md border border-white/30 shadow-lg animate-fade-in">
              <Sparkles size={18} className="text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white tracking-wide">
                初心者でも簡単
              </span>
            </div>

            <h1
              className="mb-8 text-4xl font-black leading-tight lg:text-7xl text-white drop-shadow-lg animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              サプティアの使い方
            </h1>

            <p
              className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90 lg:text-2xl font-medium animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              たった3ステップで、あなたにぴったりのサプリメントが見つかります。
              <br className="hidden sm:block" />
              科学的根拠・価格・安全性を比較して、納得の選択を。
            </p>

            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 font-bold text-[#3b66e0] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
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

        {/* 3ステップの概要 - Interactive Glass Cards */}
        <section className="relative z-10 -mt-16 px-6 lg:px-12 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "STEP 1",
                  icon: Search,
                  title: "検索する",
                  description:
                    "成分名や目的から、欲しいサプリメントを検索します。",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                  delay: "0s",
                },
                {
                  step: "STEP 2",
                  icon: Filter,
                  title: "比較する",
                  description:
                    "フィルターやランクで絞り込み、最適な商品を見つけます。",
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                  delay: "0.2s",
                },
                {
                  step: "STEP 3",
                  icon: MousePointerClick,
                  title: "購入する",
                  description:
                    "最安値のECサイトを確認して、そのまま購入ページへ。",
                  color: "text-green-500",
                  bg: "bg-green-50",
                  delay: "0.4s",
                },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative group animate-fade-in"
                    style={{ animationDelay: step.delay }}
                  >
                    {index < 2 && (
                      <div className="absolute top-1/2 -right-4 z-0 hidden w-8 h-8 text-slate-300 md:block transform -translate-y-1/2 translate-x-1/2">
                        <ChevronRight size={32} />
                      </div>
                    )}
                    <div className="relative z-10 rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur-md border border-white/50 transition-all hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-sm font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                          {step.step}
                        </span>
                        <div
                          className={`p-3 rounded-2xl ${step.bg} ${step.color}`}
                        >
                          <Icon size={28} />
                        </div>
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-medium">
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
        <section className="py-24 px-6 lg:px-12 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-800 font-bold">
                  <Search size={18} />
                  <span>STEP 1</span>
                </div>
                <h2 className="mb-6 text-4xl font-black text-slate-900 leading-tight">
                  まずは、
                  <br />
                  気になる成分や悩みで
                  <span className="text-blue-600">検索</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  「ビタミンC」「亜鉛」などの成分名はもちろん、「美肌」「疲労回復」などの悩みや目的からも検索できます。
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        日本語・英語の両方に対応
                      </p>
                      <p className="text-slate-600">
                        「ビタミンC」でも「Vitamin C」でもOK
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        部分一致で検索可能
                      </p>
                      <p className="text-slate-600">
                        「ビタミン」だけでも関連成分を表示します
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Search UI */}
                <div className="relative rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 p-8 shadow-inner border border-white">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                  <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                      <Search size={24} className="text-slate-400" />
                      <span className="text-slate-400 text-lg font-medium">
                        ビタミンC...
                      </span>
                      <span className="ml-auto text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                        Enter
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Popular Categories
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
                            className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100"
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
          </div>
        </section>

        {/* STEP 2: 比較する */}
        <section className="py-24 px-6 lg:px-12 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-purple-800 font-bold">
                  <Filter size={18} />
                  <span>STEP 2</span>
                </div>
                <h2 className="mb-6 text-4xl font-black text-slate-900 leading-tight">
                  ランクとデータで
                  <br />
                  <span className="text-purple-600">徹底比較</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  価格、成分量、コスパ、エビデンス、安全性。5つの指標をS〜Dのランクで評価。直感的に「良い商品」が見つかります。
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "価格帯", icon: DollarSign },
                    { title: "ランク", icon: Award },
                    { title: "安全性", icon: Shield },
                    { title: "エビデンス", icon: Microscope },
                  ].map((filter, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm"
                    >
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <filter.icon size={20} />
                      </div>
                      <span className="font-bold text-slate-700">
                        {filter.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Rank UI */}
                <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl border border-slate-700 overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-white font-bold text-xl">総合評価</h3>
                      <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-bold">
                        S Rank
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: "価格", rank: "S", color: "bg-emerald-500" },
                        { label: "含有量", rank: "A", color: "bg-blue-500" },
                        { label: "コスパ", rank: "S", color: "bg-purple-500" },
                        { label: "根拠", rank: "S", color: "bg-indigo-500" },
                        { label: "安全", rank: "A", color: "bg-rose-500" },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="w-full h-24 bg-white/5 rounded-lg relative overflow-hidden flex items-end justify-center pb-2">
                            <div
                              className={`w-2/3 ${stat.color} rounded-t-sm transition-all duration-1000`}
                              style={{
                                height: stat.rank === "S" ? "90%" : "70%",
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-400">
                            {stat.label}
                          </span>
                          <span className="text-lg font-black text-white">
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
        <section className="py-24 px-6 lg:px-12 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800 font-bold">
                  <MousePointerClick size={18} />
                  <span>STEP 3</span>
                </div>
                <h2 className="mb-6 text-4xl font-black text-slate-900 leading-tight">
                  最安値を<span className="text-green-600">ワンクリック</span>
                  で購入
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  楽天・Amazon・Yahoo!など、主要ECサイトの価格を自動比較。その日の最安値がすぐに分かります。
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
                    <div className="p-2 bg-white rounded-full text-green-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        価格は毎日自動更新
                      </p>
                      <p className="text-slate-600">
                        常に最新の価格情報を表示しています
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
                    <div className="p-2 bg-white rounded-full text-green-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        ワンクリックで商品ページへ
                      </p>
                      <p className="text-slate-600">
                        面倒な検索は不要。そのまま購入できます
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                {/* Mock Price UI */}
                <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    価格比較
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        site: "楽天市場",
                        price: "¥3,980",
                        badge: "最安値",
                        color: "text-red-600",
                        highlight: true,
                      },
                      {
                        site: "Amazon",
                        price: "¥4,200",
                        badge: null,
                        color: "text-slate-900",
                        highlight: false,
                      },
                      {
                        site: "Yahoo!",
                        price: "¥4,150",
                        badge: null,
                        color: "text-slate-900",
                        highlight: false,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl border ${item.highlight ? "border-red-200 bg-red-50" : "border-slate-100 bg-white"} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700">
                            {item.site}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-lg font-bold ${item.color}`}>
                            {item.price}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <ChevronRight size={16} />
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

        {/* よくある質問 - Glass Details */}
        <section className="py-24 px-6 lg:px-12 bg-slate-50">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-black text-slate-900 lg:text-4xl">
                よくある質問
              </h2>
            </div>

            <div className="space-y-4">
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
                  className="group rounded-2xl border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-lg open:shadow-md open:border-blue-200"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-slate-800 transition-all hover:text-blue-600">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">
                        Q
                      </span>
                      {faq.q}
                    </span>
                    <ChevronRight
                      size={20}
                      className="transition-transform group-open:rotate-90 text-slate-400"
                    />
                  </summary>
                  <div className="border-t border-slate-100 p-6 pt-0 text-slate-600 leading-relaxed">
                    <div className="mt-4 flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs mt-0.5">
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
        <section className="relative overflow-hidden py-24 bg-[#3b66e0]">
          <div className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-[#3b66e0] via-[#2d55c9] to-[#3b66e0] opacity-90" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
            <h2 className="mb-6 text-3xl font-black text-white lg:text-5xl">
              さあ、サプティアを使ってみましょう
            </h2>
            <p className="mb-10 text-xl text-blue-100 font-medium">
              3ステップで、あなたにぴったりのサプリメントが見つかります。
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 font-bold text-[#3b66e0] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
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
