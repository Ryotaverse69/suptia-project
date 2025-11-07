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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="text-sm font-semibold">
                次世代サプリメント比較プラットフォーム
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
              サプティアとは？
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-primary-100 lg:text-xl">
              科学的エビデンス × 価格比較 × 安全性評価を統合した、
              <br className="hidden sm:block" />
              <span className="font-bold text-white">
                &ldquo;理由を理解して選べる&rdquo;
              </span>
              AIサプリメント意思決定エンジンです。
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                今すぐ商品を探す
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/how-to-use"
                className="group flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold backdrop-blur-sm transition-all hover:bg-white/20"
              >
                使い方ガイド
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 問題提起セクション */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-orange-800">
            <AlertCircle size={20} />
            <span className="text-sm font-semibold">従来のサプリ選び</span>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
            こんなお悩みありませんか？
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
            サプリメント選びで迷っている方は少なくありません。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              description: "「効く」と書いてあるけど、科学的な証拠はあるの？",
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
              description: "楽天、Amazon、Yahoo!...複数サイトを回るのは大変。",
            },
          ].map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-orange-100 p-3 text-orange-600">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {problem.title}
                </h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* サプティアの解決策 */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Zap size={20} className="text-yellow-300" />
              <span className="text-sm font-semibold">サプティアの解決策</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
              5つの柱で、あなたの意思決定をサポート
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-100">
              サプティアは、サプリメント選びに必要な5つの情報を、
              <br className="hidden sm:block" />
              すべての商品に対して必ず表示します。
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: DollarSign,
                title: "💰 価格の比較",
                description:
                  "楽天・Amazon・Yahoo!など複数ECサイトの価格を一括比較。JANコードベースの高精度マッチングで、同一商品の最安値を瞬時に表示します。",
                color: "from-green-400 to-green-600",
              },
              {
                icon: BarChart3,
                title: "📊 成分量の比較",
                description:
                  "1日あたりの有効成分量を正確に表示。同じ成分を含む商品間で成分量を比較でき、mg単位で正規化された情報を提供します。",
                color: "from-blue-400 to-blue-600",
              },
              {
                icon: TrendingUp,
                title: "💡 コスパの比較",
                description:
                  "実効コスト/日（1日あたりの価格）と成分量あたりの価格（¥/mg）を算出。同等量換算での価格比較で、真のコストパフォーマンスが分かります。",
                color: "from-purple-400 to-purple-600",
              },
              {
                icon: Microscope,
                title: "🔬 エビデンスレベルの表示",
                description:
                  "S/A/B/C/Dの5段階評価で科学的信頼性を明示。大規模RCTやメタ解析などの研究に基づき、PubMed等の参考文献へのリンクも提供します。",
                color: "from-indigo-400 to-indigo-600",
              },
              {
                icon: Shield,
                title: "🛡️ 安全性の表示",
                description:
                  "安全性スコア（0-100点）で一目で判断。副作用・相互作用の警告、妊娠中・授乳中の注意喚起、薬機法コンプライアンスチェックも実施します。",
                color: "from-rose-400 to-rose-600",
              },
            ].map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15"
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${pillar.color} p-4`}
                    >
                      <Icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-2xl font-bold">
                        {pillar.title}
                      </h3>
                      <p className="text-lg leading-relaxed text-primary-100">
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

      {/* 5つの称号バッジシステム */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-yellow-800">
            <Award size={20} />
            <span className="text-sm font-semibold">5つの称号システム</span>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
            各柱で最高評価を獲得した商品には称号を付与
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            一目で優れた商品が分かるバッジシステム
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              badge: "💰 最安値",
              condition: "複数ECサイトの中で最も安い価格",
              meaning: "この商品が最も安く買える",
              color: "from-green-400 to-green-600",
            },
            {
              badge: "📊 最高含有量",
              condition: "その成分の含有量が最も多い",
              meaning: "成分量で最も優れている",
              color: "from-blue-400 to-blue-600",
            },
            {
              badge: "💡 ベストバリュー",
              condition: "コスパ（成分量あたり価格）が最も優れている",
              meaning: "最もお得な選択肢",
              color: "from-purple-400 to-purple-600",
            },
            {
              badge: "🔬 エビデンスS",
              condition: "エビデンスレベルがSランク",
              meaning: "最高レベルの科学的根拠",
              color: "from-indigo-400 to-indigo-600",
            },
            {
              badge: "🛡️ 高安全性",
              condition: "安全性スコア90点以上",
              meaning: "安心して摂取できる",
              color: "from-rose-400 to-rose-600",
            },
          ].map((badge, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${badge.color} px-4 py-2 text-white shadow-md`}
              >
                <Award size={20} />
                <span className="font-bold">{badge.badge}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-500">
                    獲得条件
                  </p>
                  <p className="text-gray-800">{badge.condition}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-500">
                    意味
                  </p>
                  <p className="font-bold text-primary-700">{badge.meaning}</p>
                </div>
              </div>
            </div>
          ))}

          {/* 5冠達成バッジ */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 p-8 text-white shadow-xl">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
              <div className="relative flex items-center gap-6">
                <div className="flex-shrink-0 rounded-full bg-white/20 p-6 backdrop-blur-sm">
                  <Sparkles size={48} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-3xl font-bold">
                    🌟 完璧なサプリメント
                  </h3>
                  <p className="text-xl leading-relaxed">
                    5つすべての称号を獲得した商品は「完璧なサプリメント」として特別に強調表示されます。
                    <br />
                    <span className="font-bold">
                      価格・成分量・コスパ・エビデンス・安全性のすべてにおいて最高レベル
                    </span>
                    であることを意味します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-primary-800">
              <Target size={20} />
              <span className="text-sm font-semibold">サプティアの特徴</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
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
              },
              {
                icon: Users,
                title: "ユーザー第一主義",
                description:
                  "アフィリエイト収益よりも、あなたにとって本当に最適な商品をお勧めします。公平で偏りのない評価を約束します。",
              },
              {
                icon: Zap,
                title: "常に最新情報",
                description:
                  "価格は毎日更新、エビデンスも最新の研究に基づいて定期的にアップデート。古い情報で判断することはありません。",
              },
              {
                icon: Shield,
                title: "法令遵守と倫理",
                description:
                  "薬機法コンプライアンスを徹底。「治る」「防ぐ」などの誇大表現を排除し、科学的事実のみを伝えます。",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-6 rounded-2xl bg-white p-8 shadow-sm"
                >
                  <div className="flex-shrink-0 rounded-xl bg-primary-100 p-4 text-primary-700">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-600">
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
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-12 lg:py-24">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
            さあ、あなたにぴったりのサプリメントを見つけましょう
          </h2>
          <p className="mb-8 text-lg text-primary-100 lg:text-xl">
            科学的根拠に基づいた、安全でコスパの良いサプリメント選びを今すぐ始めましょう。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              商品を探す
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/how-to-use"
              className="group flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold backdrop-blur-sm transition-all hover:bg-white/20"
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
