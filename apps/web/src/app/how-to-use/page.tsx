import { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title:
    "サプティアの使い方｜初心者でも簡単3ステップで最適なサプリメントを見つける方法",
  description:
    "サプティアの使い方を初心者にも分かりやすく解説。検索→比較→購入の3ステップで、科学的根拠に基づいた最適なサプリメントを見つけられます。フィルター機能や称号システムの活用方法も詳しく説明します。",
  openGraph: {
    title: "サプティアの使い方｜簡単3ステップガイド",
    description:
      "初めての方でも簡単にサプリメントを比較・選択できるステップバイステップガイドです。",
    type: "website",
  },
};

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="text-sm font-semibold">初心者でも簡単</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
              サプティアの使い方
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-primary-100 lg:text-xl">
              たった3ステップで、あなたにぴったりのサプリメントが見つかります。
              <br className="hidden sm:block" />
              科学的根拠・価格・安全性を比較して、納得の選択を。
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
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
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-primary-800">
            <Info size={20} />
            <span className="text-sm font-semibold">かんたん3ステップ</span>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
            サプリメントを見つけるまでの流れ
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            初めての方でも迷わず使える、シンプルなステップです。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: "STEP 1",
              icon: Search,
              title: "検索する",
              description: "成分名や目的から、欲しいサプリメントを検索します。",
              color: "from-blue-400 to-blue-600",
            },
            {
              step: "STEP 2",
              icon: Filter,
              title: "比較する",
              description:
                "フィルターや称号で絞り込み、最適な商品を見つけます。",
              color: "from-purple-400 to-purple-600",
            },
            {
              step: "STEP 3",
              icon: MousePointerClick,
              title: "購入する",
              description: "最安値のECサイトを確認して、そのまま購入ページへ。",
              color: "from-green-400 to-green-600",
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="absolute left-full top-1/2 z-0 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-gray-300 to-transparent md:block" />
                )}
                <div className="relative z-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${step.color} p-3 text-white shadow-md`}
                    >
                      <Icon size={28} />
                    </div>
                    <span className="text-sm font-bold text-gray-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STEP 1: 検索する */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-800">
              <Search size={20} />
              <span className="text-sm font-semibold">STEP 1</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
              検索する
            </h2>
            <p className="text-lg text-gray-600">
              2つの方法で、あなたが探しているサプリメントを見つけられます。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* 成分名で検索 */}
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-8">
              <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-blue-900">
                <Search size={24} />
                方法1: 成分名で検索
              </h3>
              <p className="mb-6 text-blue-800">
                「ビタミンC」「マグネシウム」など、欲しい成分名を入力するだけ。
              </p>
              <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 text-gray-400">
                  <Search size={20} />
                  <span className="text-gray-600">ビタミンC</span>
                  <span className="ml-auto text-sm text-gray-500">
                    Enter で検索
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-1 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      日本語・英語の両方に対応
                    </p>
                    <p className="text-sm text-gray-600">
                      「ビタミンC」でも「Vitamin C」でもOK
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-1 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      部分一致で検索
                    </p>
                    <p className="text-sm text-gray-600">
                      「ビタミン」だけでも検索できます
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* カテゴリから探す */}
            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-8">
              <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-purple-900">
                <Filter size={24} />
                方法2: カテゴリから探す
              </h3>
              <p className="mb-6 text-purple-800">
                「ビタミン」「ミネラル」など、カテゴリから選べます。
              </p>
              <div className="mb-4 space-y-2">
                {["ビタミン", "ミネラル", "アミノ酸", "ハーブ"].map(
                  (category) => (
                    <div
                      key={category}
                      className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <ChevronRight size={20} className="text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        {category}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-1 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">目的別に表示</p>
                    <p className="text-sm text-gray-600">
                      「美肌」「疲労回復」など目的から選べます
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-1 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      成分ガイドも充実
                    </p>
                    <p className="text-sm text-gray-600">
                      各成分の詳しい説明も読めます
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: 比較する */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-purple-800">
              <Filter size={20} />
              <span className="text-sm font-semibold">STEP 2</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
              比較する
            </h2>
            <p className="text-lg text-gray-600">
              強力なフィルター機能と称号システムで、最適な商品を絞り込めます。
            </p>
          </div>

          {/* フィルター機能 */}
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Filter size={24} className="text-purple-600" />
              フィルター機能
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: DollarSign,
                  title: "価格帯",
                  description: "予算に合わせて絞り込み",
                  example: "例: 1,000円〜3,000円",
                },
                {
                  icon: Award,
                  title: "称号",
                  description: "優れた商品だけを表示",
                  example: "例: ベストバリューのみ",
                },
                {
                  icon: BarChart3,
                  title: "ECサイト",
                  description: "楽天・Amazon・Yahoo!",
                  example: "例: 楽天で購入可能",
                },
                {
                  icon: Shield,
                  title: "安全性スコア",
                  description: "90点以上のみ表示",
                  example: "例: 高安全性商品のみ",
                },
                {
                  icon: Microscope,
                  title: "エビデンスレベル",
                  description: "科学的根拠の信頼性",
                  example: "例: S〜Aランクのみ",
                },
                {
                  icon: TrendingUp,
                  title: "並び替え",
                  description: "価格順・評価順など",
                  example: "例: コスパが良い順",
                },
              ].map((filter, index) => {
                const Icon = filter.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-6 transition-all hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-purple-100 p-2 text-purple-600">
                      <Icon size={24} />
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-gray-900">
                      {filter.title}
                    </h4>
                    <p className="mb-2 text-sm text-gray-600">
                      {filter.description}
                    </p>
                    <p className="text-xs text-gray-500">{filter.example}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 称号システム */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Award size={24} className="text-amber-600" />
              称号システムの活用
            </h3>
            <p className="mb-8 text-lg text-gray-700">
              5つの称号バッジで、優れた商品が一目で分かります。
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { badge: "💰 最安値", color: "green" },
                { badge: "📊 最高含有量", color: "blue" },
                { badge: "💡 ベストバリュー", color: "purple" },
                { badge: "🔬 エビデンスS", color: "indigo" },
                { badge: "🛡️ 高安全性", color: "rose" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <div
                    className={`mb-2 inline-flex items-center gap-1 rounded-lg bg-${badge.color}-100 px-3 py-1 text-sm font-bold text-${badge.color}-800`}
                  >
                    <Award size={16} />
                    {badge.badge}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-white p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-1 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    💡 称号フィルターの使い方
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    「称号」フィルターで特定の称号を持つ商品だけを表示できます。例えば「ベストバリュー」だけにチェックを入れると、コスパが最も優れた商品だけが表示されます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: 購入する */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800">
              <MousePointerClick size={20} />
              <span className="text-sm font-semibold">STEP 3</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
              購入する
            </h2>
            <p className="text-lg text-gray-600">
              商品詳細ページで、複数ECサイトの価格を比較して購入できます。
            </p>
          </div>

          <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 lg:p-12">
            <h3 className="mb-6 text-2xl font-bold text-green-900">
              価格比較機能で最安値を瞬時に確認
            </h3>
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h4 className="mb-4 text-xl font-bold text-gray-900">
                DHC ビタミンC 60日分
              </h4>
              <div className="space-y-3">
                {[
                  { site: "楽天市場", price: "¥398", badge: "🏆 最安値" },
                  { site: "Yahoo!", price: "¥420", badge: null },
                  { site: "Amazon", price: "¥450", badge: null },
                  { site: "iHerb", price: "¥480", badge: null },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-green-400 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {item.site}
                      </span>
                      {item.badge && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-900">
                        {item.price}
                      </span>
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-700">
                        購入ページへ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-1 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    最安値が一目で分かる
                  </p>
                  <p className="text-sm text-gray-600">
                    複数ECサイトを比較して、最もお得なサイトを強調表示
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-1 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    ワンクリックで購入ページへ
                  </p>
                  <p className="text-sm text-gray-600">
                    「購入ページへ」ボタンで、そのまま各ECサイトに移動できます
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-1 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">価格は毎日更新</p>
                  <p className="text-sm text-gray-600">
                    常に最新の価格情報を表示しています
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-primary-800">
              <AlertCircle size={20} />
              <span className="text-sm font-semibold">よくある質問</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
              FAQ
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
                className="group rounded-xl border border-gray-200 bg-white transition-all hover:border-primary-300"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-gray-900 transition-all hover:bg-gray-50">
                  <span>Q. {faq.q}</span>
                  <ChevronRight
                    size={20}
                    className="transition-transform group-open:rotate-90"
                  />
                </summary>
                <div className="border-t border-gray-100 p-6 text-gray-600">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-12 lg:py-24">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
            さあ、サプティアを使ってみましょう
          </h2>
          <p className="mb-8 text-lg text-primary-100 lg:text-xl">
            3ステップで、あなたにぴったりのサプリメントが見つかります。
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
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
  );
}
