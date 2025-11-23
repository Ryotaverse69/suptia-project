import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  DollarSign,
  TrendingUp,
  Microscope,
  Award,
  Search,
  Filter,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Users,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "サプティアとは｜科学的エビデンスに基づくサプリメント比較プラットフォーム",
  description:
    "サプティアは、科学的エビデンス・価格比較・安全性評価を統合した次世代サプリメント意思決定エンジンです。楽天・Amazon・Yahoo!の価格を一括比較し、あなたに最適なサプリメントを見つけます。",
  openGraph: {
    title: "サプティアとは｜次世代サプリメント比較プラットフォーム",
    description:
      "科学的根拠、価格比較、安全性評価を統合。理由を理解して選べるサプリメント体験を提供します。",
    type: "website",
  },
};

export default function AboutPage() {
  return (
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
            style={{ animationDuration: "35s", animationDirection: "reverse" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-md border border-white/30 shadow-lg animate-fade-in">
            <Sparkles size={18} className="text-yellow-300 animate-pulse" />
            <span className="text-sm font-bold text-white tracking-wide">
              次世代サプリメント比較プラットフォーム
            </span>
          </div>

          <h1
            className="mb-8 text-4xl font-black leading-tight lg:text-7xl text-white drop-shadow-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            サプティアとは？
          </h1>

          <p
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90 lg:text-2xl font-medium animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            科学的エビデンス × 価格比較 × 安全性評価を統合した、
            <br className="hidden sm:block" />
            <span className="font-bold text-white border-b-2 border-yellow-300/50">
              &ldquo;理由を理解して選べる&rdquo;
            </span>
            AIサプリメント意思決定エンジンです。
          </p>

          <div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-[#3b66e0] shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:bg-blue-50"
            >
              今すぐ商品を探す
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/how-to-use"
              className="group flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white"
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

      {/* 問題提起セクション - Glass Cards */}
      <section className="relative z-10 -mt-10 px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: "情報が多すぎて選べない",
                description:
                  "数千種類のサプリメントの中から、自分に合ったものを見つけるのは困難です。",
                delay: "0s",
              },
              {
                icon: DollarSign,
                title: "価格が適正か分からない",
                description:
                  "同じ成分でも価格がバラバラ。本当にお得な商品はどれ？",
                delay: "0.1s",
              },
              {
                icon: Microscope,
                title: "効果に根拠があるか不明",
                description: "「効く」と書いてあるけど、科学的な証拠はあるの？",
                delay: "0.2s",
              },
              {
                icon: Shield,
                title: "安全性が心配",
                description: "副作用や相互作用、添加物の危険性が気になる。",
                delay: "0.3s",
              },
              {
                icon: BarChart3,
                title: "成分量の比較が面倒",
                description:
                  "1日あたりの成分量を計算して比較するのは時間がかかる。",
                delay: "0.4s",
              },
              {
                icon: ShoppingCart,
                title: "どこで買うのが最安値？",
                description:
                  "楽天、Amazon、Yahoo!...複数サイトを回るのは大変。",
                delay: "0.5s",
              },
            ].map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-md border border-white/50 transition-all hover:-translate-y-1 hover:shadow-2xl animate-fade-in"
                  style={{ animationDelay: problem.delay }}
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 opacity-50 blur-2xl transition-all group-hover:scale-150 group-hover:from-blue-100 group-hover:to-purple-100" />

                  <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-slate-100 p-4 text-slate-600 transition-colors group-hover:bg-blue-600 group-hover:text-white shadow-inner group-hover:shadow-lg">
                      <Icon size={28} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                      {problem.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* サプティアの解決策 - Dark Glass Theme */}
      <section className="relative py-24 overflow-hidden bg-slate-900">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-blue-300 border border-blue-500/30 backdrop-blur-sm">
              <Zap size={18} className="text-yellow-400" />
              <span className="text-sm font-bold">サプティアの解決策</span>
            </div>
            <h2 className="mb-6 text-3xl font-black text-white lg:text-5xl tracking-tight">
              5つの柱で、
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                意思決定を科学する
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              サプティアは、サプリメント選びに必要な5つの情報を、
              <br className="hidden sm:block" />
              すべての商品に対して必ず表示します。
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: DollarSign,
                title: "価格の比較",
                description:
                  "楽天・Amazon・Yahoo!など複数ECサイトの価格を一括比較。JANコードベースの高精度マッチングで、同一商品の最安値を瞬時に表示します。",
                gradient: "from-emerald-400 to-teal-500",
                shadow: "shadow-emerald-500/20",
              },
              {
                icon: BarChart3,
                title: "成分量の比較",
                description:
                  "1日あたりの有効成分量を正確に表示。同じ成分を含む商品間で成分量を比較でき、mg単位で正規化された情報を提供します。",
                gradient: "from-blue-400 to-cyan-500",
                shadow: "shadow-blue-500/20",
              },
              {
                icon: TrendingUp,
                title: "コスパの比較",
                description:
                  "実効コスト/日（1日あたりの価格）と成分量あたりの価格（¥/mg）を算出。同等量換算での価格比較で、真のコストパフォーマンスが分かります。",
                gradient: "from-violet-400 to-purple-500",
                shadow: "shadow-purple-500/20",
              },
              {
                icon: Microscope,
                title: "エビデンスレベル",
                description:
                  "S/A/B/C/Dの5段階評価で科学的信頼性を明示。大規模RCTやメタ解析などの研究に基づき、PubMed等の参考文献へのリンクも提供します。",
                gradient: "from-indigo-400 to-blue-600",
                shadow: "shadow-indigo-500/20",
              },
              {
                icon: Shield,
                title: "安全性の表示",
                description:
                  "安全性スコア（0-100点）で一目で判断。副作用・相互作用の警告、妊娠中・授乳中の注意喚起、薬機法コンプライアンスチェックも実施します。",
                gradient: "from-rose-400 to-pink-500",
                shadow: "shadow-rose-500/20",
              },
            ].map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                    <div
                      className={`flex-shrink-0 rounded-2xl bg-gradient-to-br ${pillar.gradient} p-4 text-white shadow-lg ${pillar.shadow} group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-lg leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div
                    className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-500 rounded-full`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ランク評価システム */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-purple-800 border border-purple-200">
              <Award size={18} />
              <span className="text-sm font-bold">ランク評価システム</span>
            </div>
            <h2 className="mb-6 text-3xl font-black text-slate-900 lg:text-5xl tracking-tight">
              S〜Dの
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                5段階評価
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              一目で優れた商品が分かる、統一された評価基準
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                rank: "S",
                badge: "価格S",
                condition: "複数ECサイトの中で最も安い価格",
                meaning: "この商品が最も安く買える",
                gradient: "from-purple-600 to-indigo-600",
              },
              {
                rank: "S",
                badge: "含有量S",
                condition: "その成分の含有量が最も多い",
                meaning: "成分量で最も優れている",
                gradient: "from-purple-600 to-indigo-600",
              },
              {
                rank: "S",
                badge: "コスパS",
                condition: "コスパ（成分量あたり価格）が最も優れている",
                meaning: "最もお得な選択肢",
                gradient: "from-purple-600 to-indigo-600",
              },
              {
                rank: "S",
                badge: "エビデンスS",
                condition: "エビデンスレベルがSランク",
                meaning: "最高レベルの科学的根拠",
                gradient: "from-purple-600 to-indigo-600",
              },
              {
                rank: "S",
                badge: "安全性S",
                condition: "安全性スコア90点以上",
                meaning: "安心して摂取できる",
                gradient: "from-purple-600 to-indigo-600",
              },
            ].map((badge, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:border-purple-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-br ${badge.gradient} px-4 py-2 text-white shadow-md`}
                  >
                    <Award size={18} />
                    <span className="font-bold text-lg">{badge.badge}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-purple-100 transition-all">
                    <p className="mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      獲得条件
                    </p>
                    <p className="text-slate-700 font-medium">
                      {badge.condition}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      意味
                    </p>
                    <p className="font-bold text-purple-700 text-lg">
                      {badge.meaning}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* S+ランク（最高評価） - Holographic Card */}
            <div className="md:col-span-2 lg:col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl group">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-gradient-xy" />

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                    <Sparkles size={32} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                      S+ランク
                    </h3>
                    <p className="text-purple-200 font-bold text-sm tracking-widest">
                      SUPREME
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-slate-300 mb-6 flex-1">
                  全評価でSランクを達成した商品は「S+ランク」として特別に強調表示されます。
                  <span className="block mt-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm text-white font-bold">
                    価格・コスパ・含有量・エビデンス・安全性のすべてにおいて最高レベル
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-black text-slate-900 lg:text-5xl tracking-tight">
              なぜサプティアが選ばれるのか
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[
              {
                icon: CheckCircle2,
                title: "透明性と説明可能性",
                description:
                  "推薦理由・出典（研究・価格・成分）を常に明示。AIのブラックボックス化を避け、あなたが理解して納得できる情報を提供します。",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Users,
                title: "ユーザー第一主義",
                description:
                  "アフィリエイト収益よりも、あなたにとって本当に最適な商品をお勧めします。公平で偏りのない評価を約束します。",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Zap,
                title: "常に最新情報",
                description:
                  "価格は毎日更新、エビデンスも最新の研究に基づいて定期的にアップデート。古い情報で判断することはありません。",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: Shield,
                title: "法令遵守と倫理",
                description:
                  "薬機法コンプライアンスを徹底。「治る」「防ぐ」などの誇大表現を排除し、科学的事実のみを伝えます。",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-6 rounded-3xl bg-slate-50 p-8 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-slate-100"
                >
                  <div
                    className={`flex-shrink-0 rounded-2xl ${feature.bg} p-4 ${feature.color}`}
                  >
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="relative overflow-hidden py-24 bg-[#3b66e0]">
        <div className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-[#3b66e0] via-[#2d55c9] to-[#3b66e0] opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h2 className="mb-6 text-3xl font-black text-white lg:text-5xl">
            さあ、あなたにぴったりの
            <br />
            サプリメントを見つけましょう
          </h2>
          <p className="mb-10 text-xl text-blue-100 font-medium">
            科学的根拠に基づいた、安全でコスパの良いサプリメント選びを今すぐ始めましょう。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-full bg-white px-10 py-5 font-bold text-[#3b66e0] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              商品を探す
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/how-to-use"
              className="group flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-10 py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white"
            >
              使い方ガイドを見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
