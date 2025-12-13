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
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{
                color: systemColors.blue,
              }}
            >
              ホーム
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/legal/terms"
              className="transition-colors"
              style={{
                color: systemColors.blue,
              }}
            >
              法的情報
            </Link>
            <ChevronRight size={16} />
            <span style={{ color: appleWebColors.textPrimary }}>
              アフィリエイト開示
            </span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="p-3 rounded-[16px]"
              style={{
                backgroundColor: "rgba(0, 122, 255, 0.1)",
              }}
            >
              <Handshake
                className="w-8 h-8"
                style={{ color: systemColors.blue }}
              />
            </div>
            <h1
              className="text-[28px] md:text-[34px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              アフィリエイト開示
            </h1>
          </div>

          <p
            className="text-[17px] max-w-2xl mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            サプティアの収益モデルと透明性へのコミットメント
          </p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px]"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              color: appleWebColors.textSecondary,
            }}
          >
            <RefreshCw size={14} />
            最終更新日: 2025年10月30日
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section
        className={`sticky top-0 z-40 ${liquidGlassClasses.light}`}
        style={{
          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
        }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <span
              className="text-[13px] whitespace-nowrap"
              style={{ color: appleWebColors.textSecondary }}
            >
              クイックアクセス:
            </span>
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  color: appleWebColors.textPrimary,
                }}
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
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: "rgba(0, 122, 255, 0.05)",
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[16px]"
                style={{
                  backgroundColor: "rgba(0, 122, 255, 0.1)",
                }}
              >
                <Eye className="w-6 h-6" style={{ color: systemColors.blue }} />
              </div>
              <div>
                <h2
                  className="text-[20px] font-semibold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  透明性の原則
                </h2>
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                      className="flex items-center gap-2 p-2 rounded-[12px]"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: systemColors.blue }}
                      />
                      <span
                        className="text-[13px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Affiliate */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Info
                className="w-5 h-5"
                style={{ color: appleWebColors.textSecondary }}
              />
              <h2
                className="text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                アフィリエイトプログラムとは
              </h2>
            </div>
            <p
              className="text-[15px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              アフィリエイトプログラムとは、当サイトが商品リンクを通じて紹介した商品が購入された場合、販売元のECサイトから紹介料を受け取る仕組みです。
            </p>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              これはインターネット上で広く利用されている一般的なビジネスモデルであり、多くの比較サイトやレビューサイトが採用しています。
            </p>
          </div>
        </section>

        {/* Affiliate Programs */}
        <section id="programs" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: systemColors.blue,
              }}
            >
              <div className="flex items-center gap-3">
                <Handshake className="w-5 h-5 text-white" />
                <h2 className="text-[20px] font-semibold text-white">
                  参加しているアフィリエイトプログラム
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-6"
                style={{ color: appleWebColors.textSecondary }}
              >
                サプティアは、以下の企業・サービスのアフィリエイトプログラムに参加しています：
              </p>

              <div className="grid gap-4">
                {[
                  {
                    name: "Amazon.co.jp",
                    description:
                      "Amazonアソシエイト・プログラムに参加しています。当サイトからAmazon.co.jpへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                  },
                  {
                    name: "楽天市場",
                    description:
                      "楽天アフィリエイトに参加しています。当サイトから楽天市場へのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                  },
                  {
                    name: "Yahoo!ショッピング",
                    description:
                      "Yahoo!ショッピングのアフィリエイトプログラムに参加しています。当サイトからYahoo!ショッピングへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                  },
                  {
                    name: "iHerb",
                    description:
                      "iHerbのアフィリエイトプログラムに参加しています。当サイトからiHerbへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。",
                  },
                  {
                    name: "その他の提携企業",
                    description:
                      "上記以外にも、サプリメント・健康食品関連のECサイトや企業のアフィリエイトプログラムに参加する場合があります。新たな提携が発生した場合は、本ページを更新してお知らせします。",
                  },
                ].map((program, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-[16px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      border: `1px solid ${appleWebColors.borderSubtle}`,
                    }}
                  >
                    <h3
                      className="font-semibold text-[15px] mb-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {program.name}
                    </h3>
                    <p
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
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
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: "rgba(52, 199, 89, 0.05)",
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[16px]"
                style={{
                  backgroundColor: "rgba(52, 199, 89, 0.1)",
                }}
              >
                <DollarSign
                  className="w-6 h-6"
                  style={{ color: systemColors.green }}
                />
              </div>
              <div>
                <h2
                  className="text-[20px] font-semibold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  価格への影響について
                </h2>
                <p
                  className="text-[15px] font-medium mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  アフィリエイトリンクを経由しても、商品価格は変わりません
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  当サイトのリンクを経由して購入された場合でも、直接ECサイトで購入した場合でも、商品の価格は同じです。購入者が追加料金を支払うことはありません。紹介料は販売元のECサイトから支払われます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Neutrality */}
        <section id="neutrality" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: systemColors.blue,
              }}
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-white" />
                <h2 className="text-[20px] font-semibold text-white">
                  中立性と透明性の維持
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p
                className="text-[15px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                サプティアは、アフィリエイト収益の有無に関わらず、以下の原則に基づいて運営しています：
              </p>

              {/* Scientific Evidence */}
              <div
                className="rounded-[16px] p-5"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <FlaskConical
                    className="w-5 h-5"
                    style={{ color: systemColors.blue }}
                  />
                  <h3
                    className="font-semibold text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
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
                      className="flex items-center gap-2 text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: systemColors.blue }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Honest Reviews */}
              <div
                className="rounded-[16px] p-5"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Heart
                    className="w-5 h-5"
                    style={{ color: systemColors.pink }}
                  />
                  <h3
                    className="font-semibold text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    正直なレビュー
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    "商品の長所だけでなく、短所や注意点も正直に記載します",
                    "誇大広告や根拠のない効果効能の記載は行いません",
                    "薬機法を遵守し、適切な表現で情報提供を行います",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: systemColors.pink }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiple Options */}
              <div
                className="rounded-[16px] p-5"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3
                    className="w-5 h-5"
                    style={{ color: systemColors.green }}
                  />
                  <h3
                    className="font-semibold text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    複数の選択肢の提示
                  </h3>
                </div>
                <p
                  className="text-[13px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  可能な限り複数のECサイトでの価格比較を提供し、ユーザーが最もお得な選択肢を見つけられるようサポートします。
                </p>
                <div
                  className="rounded-[12px] p-4"
                  style={{
                    backgroundColor: "rgba(52, 199, 89, 0.05)",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <p
                    className="font-medium text-[13px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    価格比較の表示順について
                  </p>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
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
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: systemColors.orange,
              }}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-white" />
                <h2 className="text-[20px] font-semibold text-white">
                  収益の使途
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
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
                    className="flex items-center gap-2 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: "rgba(255, 149, 0, 0.05)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: systemColors.orange }}
                    />
                    <span
                      className="text-[13px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Freedom */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: appleWebColors.textSecondary }}
              />
              <h2
                className="text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                ユーザーの選択の自由
              </h2>
            </div>
            <p
              className="text-[15px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
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
                  className="flex items-center gap-2 p-3 rounded-[12px] text-[13px]"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    color: appleWebColors.textSecondary,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: appleWebColors.textSecondary }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advertising */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Megaphone
                className="w-5 h-5"
                style={{ color: appleWebColors.textSecondary }}
              />
              <h2
                className="text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                広告表示について
              </h2>
            </div>
            <p
              className="text-[15px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
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
                  className="p-3 rounded-[12px] text-[13px] text-center"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    color: appleWebColors.textPrimary,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <p
              className="text-[13px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              ※
              通常のコンテンツと広告を明確に区別し、ユーザーが誤解しないよう配慮しています。
            </p>
          </div>
        </section>

        {/* Compliance */}
        <section id="compliance" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: appleWebColors.textPrimary,
              }}
            >
              <div className="flex items-center gap-3">
                <Gavel className="w-5 h-5 text-white" />
                <h2 className="text-[20px] font-semibold text-white">
                  法令遵守とガイドライン
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
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
                    className="flex items-center gap-2 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: systemColors.green }}
                    />
                    <span
                      className="text-[13px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclosure Updates */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw
                className="w-5 h-5"
                style={{ color: appleWebColors.textSecondary }}
              />
              <h2
                className="text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                開示の更新
              </h2>
            </div>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              本開示内容は、新たな提携企業の追加やプログラムの変更に応じて更新されます。重要な変更があった場合は、本ページに反映し、必要に応じてサイト内でお知らせします。
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: appleWebColors.textPrimary,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[16px]"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-[20px] font-semibold text-white mb-2">
                  お問い合わせ
                </h2>
                <p
                  className="text-[15px] mb-4"
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  アフィリエイト開示に関するご質問やご意見がございましたら、お気軽にお問い合わせください。
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] font-medium transition-all text-[15px]"
                  style={{
                    backgroundColor: "white",
                    color: appleWebColors.textPrimary,
                  }}
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
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: "rgba(0, 122, 255, 0.05)",
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <h3
              className="font-semibold text-[17px] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              最後に
            </h3>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              サプティアは、ユーザーの皆様に信頼していただけるサービスを目指しています。アフィリエイト収益はサイト運営の重要な資金源ですが、それが情報の中立性や質を損なうことは決してありません。科学的根拠に基づく正確な情報提供と、透明性のある運営を今後も継続してまいります。
            </p>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2
            className="text-[17px] font-semibold mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            関連リンク
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/legal/terms"
              className={`p-4 rounded-[16px] transition-all group ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1 transition-colors"
                style={{ color: appleWebColors.textPrimary }}
              >
                利用規約
              </h3>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                サービスの利用条件
              </p>
            </Link>

            <Link
              href="/legal/privacy"
              className={`p-4 rounded-[16px] transition-all group ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1 transition-colors"
                style={{ color: appleWebColors.textPrimary }}
              >
                プライバシーポリシー
              </h3>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                個人情報の取り扱い
              </p>
            </Link>

            <Link
              href="/legal/disclosure"
              className={`p-4 rounded-[16px] transition-all group ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1 transition-colors"
                style={{ color: appleWebColors.textPrimary }}
              >
                特定商取引法に基づく表記
              </h3>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                事業者情報
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
