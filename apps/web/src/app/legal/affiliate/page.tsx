import { Metadata } from "next";
import Link from "next/link";
import {
  Handshake,
  ChevronRight,
  Eye,
  DollarSign,
  Scale,
  Heart,
  FlaskConical,
  BarChart3,
  ShoppingCart,
  Megaphone,
  Gavel,
  RefreshCw,
  Mail,
  CheckCircle2,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "アフィリエイト開示 - サプティア",
  description:
    "サプティアのアフィリエイトプログラム参加および収益開示に関する情報です。",
};

export default function AffiliatePage() {
  const sections = [
    { id: "programs", label: "参加プログラム", icon: Handshake },
    { id: "neutrality", label: "中立性", icon: Scale },
    { id: "revenue", label: "収益使途", icon: DollarSign },
    { id: "compliance", label: "法令遵守", icon: Gavel },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-violet-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/legal/terms"
              className="hover:text-white transition-colors"
            >
              法的情報
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">アフィリエイト開示</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              アフィリエイト開示
            </h1>
          </div>

          <p className="text-violet-100 text-lg max-w-2xl">
            サプティアの収益モデルと透明性へのコミットメント
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
            <RefreshCw size={14} />
            最終更新日: 2025年10月30日
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <span className="text-sm text-slate-500 whitespace-nowrap">
              クイックアクセス:
            </span>
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-violet-100 hover:text-violet-700 rounded-full transition-colors whitespace-nowrap"
              >
                <item.icon size={14} />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl py-12">
        {/* Transparency Principle */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Eye className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-violet-900 mb-3">
                  透明性の原則
                </h2>
                <p className="text-violet-800 mb-4">
                  サプティアは、ユーザーの皆様に対して透明性を保つことを最優先としています。当サイトがどのように運営され、収益を得ているかを明確にお伝えします。
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "アフィリエイト参加について正直に開示します",
                    "中立的な評価・レビューを維持します",
                    "商品価格に影響はありません",
                    "科学的根拠に基づく情報提供を行います",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-white/60 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                      <span className="text-sm text-violet-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Affiliate */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                アフィリエイトプログラムとは
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              アフィリエイトプログラムとは、当サイトが商品リンクを通じて紹介した商品が購入された場合、販売元のECサイトから紹介料を受け取る仕組みです。
            </p>
            <p className="text-slate-600">
              これはインターネット上で広く利用されている一般的なビジネスモデルであり、多くの比較サイトやレビューサイトが採用しています。
            </p>
          </div>
        </section>

        {/* Affiliate Programs */}
        <section id="programs" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Handshake className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  参加しているアフィリエイトプログラム
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-6">
                サプティアは、以下の企業・サービスのアフィリエイトプログラムに参加しています：
              </p>

              <div className="grid gap-4">
                {[
                  {
                    name: "Amazon.co.jp",
                    description:
                      "Amazonアソシエイト・プログラムに参加しています。当サイトからAmazon.co.jpへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                    color: "amber",
                  },
                  {
                    name: "楽天市場",
                    description:
                      "楽天アフィリエイトに参加しています。当サイトから楽天市場へのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                    color: "red",
                  },
                  {
                    name: "Yahoo!ショッピング",
                    description:
                      "Yahoo!ショッピングのアフィリエイトプログラムに参加しています。当サイトからYahoo!ショッピングへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                    color: "red",
                  },
                  {
                    name: "iHerb",
                    description:
                      "iHerbのアフィリエイトプログラムに参加しています。当サイトからiHerbへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                    color: "green",
                  },
                  {
                    name: "その他の提携企業",
                    description:
                      "上記以外にも、サプリメント・健康食品関連のECサイトや企業のアフィリエイトプログラムに参加する場合があります。新たな提携が発生した場合は、本ページを更新してお知らせします。",
                    color: "slate",
                  },
                ].map((program, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {program.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {program.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Price Impact */}
        <section className="mb-10">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900 mb-2">
                  価格への影響について
                </h2>
                <p className="text-emerald-800 font-medium mb-2">
                  💰 アフィリエイトリンクを経由しても、商品価格は変わりません
                </p>
                <p className="text-emerald-700 text-sm">
                  当サイトのリンクを経由して購入された場合でも、直接ECサイトで購入した場合でも、商品の価格は同じです。購入者が追加料金を支払うことはありません。紹介料は販売元のECサイトから支払われます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Neutrality */}
        <section id="neutrality" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  中立性と透明性の維持
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-slate-600">
                サプティアは、アフィリエイト収益の有無に関わらず、以下の原則に基づいて運営しています：
              </p>

              {/* Scientific Evidence */}
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-800">
                    科学的根拠に基づく評価
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    "商品の評価やランキングは、科学的エビデンス、成分含有量、価格、安全性などの客観的な基準に基づいています",
                    "アフィリエイト報酬の高低によって評価を変えることはありません",
                    "信頼できる研究論文や公的機関のデータを参照しています",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Honest Reviews */}
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-800">正直なレビュー</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "商品の長所だけでなく、短所や注意点も正直に記載します",
                    "誇大広告や根拠のない効果効能の記載は行いません",
                    "薬機法を遵守し、適切な表現で情報提供を行います",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiple Options */}
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">
                    複数の選択肢の提示
                  </h3>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  可能な限り複数のECサイトでの価格比較を提供し、ユーザーが最もお得な選択肢を見つけられるようサポートします。
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="font-semibold text-emerald-800 text-sm mb-1">
                    📊 価格比較の表示順について
                  </p>
                  <p className="text-sm text-emerald-700">
                    商品詳細ページの価格比較では、アフィリエイト報酬額に関係なく、
                    <strong>常に最安値を最上位に表示</strong>
                    します。顧客利益を最優先し、公平かつ透明性のある価格比較を提供します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Use */}
        <section id="revenue" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">収益の使途</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                アフィリエイト収益は、以下の目的でサプティアの運営に使用されます：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "サーバー運用費・インフラコスト",
                  "科学的研究論文へのアクセス費用",
                  "サイト機能の改善・開発",
                  "コンテンツの品質向上",
                  "データベースの更新・維持",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Freedom */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                ユーザーの選択の自由
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              当サイトのリンクを使用するかどうかは、完全にユーザーの自由です。
            </p>
            <div className="space-y-2">
              {[
                "直接ECサイトを訪問して購入することも可能です",
                "他の比較サイトと比較検討することをお勧めします",
                "当サイトの情報を参考にしつつ、最終的な購入判断はご自身で行ってください",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700"
                >
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advertising */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Megaphone className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                広告表示について
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              当サイトでは、以下のような広告が表示される場合があります：
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              {[
                "ディスプレイ広告（Google AdSense等）",
                "スポンサード記事（明確に「PR」表示）",
                "バナー広告",
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 text-center"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              ※
              通常のコンテンツと広告を明確に区別し、ユーザーが誤解しないよう配慮しています。
            </p>
          </div>
        </section>

        {/* Compliance */}
        <section id="compliance" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <Gavel className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  法令遵守とガイドライン
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                サプティアは、以下の法令・ガイドラインを遵守しています：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "消費者庁「ステルスマーケティング規制」",
                  "景品表示法",
                  "薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）",
                  "特定商取引法",
                  "各アフィリエイトプログラムの利用規約",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclosure Updates */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">開示の更新</h2>
            </div>
            <p className="text-slate-600">
              本開示内容は、新たな提携企業の追加やプログラムの変更に応じて更新されます。重要な変更があった場合は、本ページに反映し、必要に応じてサイト内でお知らせします。
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">お問い合わせ</h2>
                <p className="text-slate-300 mb-4">
                  アフィリエイト開示に関するご質問やご意見がございましたら、お気軽にお問い合わせください。
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                >
                  お問い合わせフォーム
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final Note */}
        <section className="mb-10">
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
            <h3 className="font-bold text-violet-900 mb-3">最後に</h3>
            <p className="text-violet-800 text-sm leading-relaxed">
              サプティアは、ユーザーの皆様に信頼していただけるサービスを目指しています。アフィリエイト収益はサイト運営の重要な資金源ですが、それが情報の中立性や質を損なうことは決してありません。科学的根拠に基づく正確な情報提供と、透明性のある運営を今後も継続してまいります。
            </p>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            関連リンク
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/legal/terms"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 mb-1">
                利用規約
              </h3>
              <p className="text-sm text-slate-500">サービスの利用条件</p>
            </Link>

            <Link
              href="/legal/privacy"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 mb-1">
                プライバシーポリシー
              </h3>
              <p className="text-sm text-slate-500">個人情報の取り扱い</p>
            </Link>

            <Link
              href="/legal/disclosure"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 mb-1">
                特定商取引法に基づく表記
              </h3>
              <p className="text-sm text-slate-500">事業者情報</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
