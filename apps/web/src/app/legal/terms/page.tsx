import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ChevronRight,
  AlertTriangle,
  Ban,
  Gavel,
  Mail,
  ShoppingCart,
  BookOpen,
  Copyright,
  RefreshCw,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "利用規約 - サプティア",
  description: "サプティアサービスの利用規約です。",
};

export default function TermsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* ヒーローセクション */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* パンくず */}
          <nav
            className="flex items-center gap-2 text-[13px] mb-8"
            style={{ color: appleWebColors.textSecondary }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: appleWebColors.textPrimary }}>利用規約</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="p-3 rounded-[16px]"
              style={{
                backgroundColor: "rgba(0, 122, 255, 0.1)",
              }}
            >
              <FileText
                className="w-8 h-8"
                style={{ color: systemColors.blue }}
              />
            </div>
            <div>
              <h1
                className="text-[34px] font-bold leading-tight"
                style={{ color: appleWebColors.textPrimary }}
              >
                利用規約
              </h1>
              <p
                className="text-[15px] mt-1"
                style={{ color: appleWebColors.textSecondary }}
              >
                Terms of Service
              </p>
            </div>
          </div>
          <p
            className="text-[17px] leading-relaxed"
            style={{ color: appleWebColors.textSecondary }}
          >
            サプティアのサービスをご利用いただくにあたっての規約です
          </p>
          <p
            className="text-[13px] mt-4"
            style={{ color: appleWebColors.textSecondary }}
          >
            最終更新日: 2025年10月30日
          </p>
        </div>
      </section>

      {/* クイックナビゲーション */}
      <section
        className={`sticky top-0 z-40 ${liquidGlassClasses.light}`}
        style={{
          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
        }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <span
              className="text-[13px] whitespace-nowrap"
              style={{ color: appleWebColors.textSecondary }}
            >
              移動:
            </span>
            {[
              { id: "disclaimer", label: "免責事項", icon: AlertTriangle },
              { id: "prohibited", label: "禁止事項", icon: Ban },
              { id: "law", label: "準拠法", icon: Gavel },
              { id: "contact", label: "お問い合わせ", icon: Mail },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full whitespace-nowrap transition-all hover:bg-[#007AFF]/10 hover:text-[#007AFF]"
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 適用 */}
        <section
          className={`mb-10 rounded-[20px] p-8 ${liquidGlassClasses.light}`}
          style={{
            border: `1px solid ${appleWebColors.borderSubtle}`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-[12px]"
              style={{ backgroundColor: "rgba(0, 122, 255, 0.1)" }}
            >
              <BookOpen
                className="w-5 h-5"
                style={{ color: systemColors.blue }}
              />
            </div>
            <h2
              className="text-[22px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              第1条（適用）
            </h2>
          </div>
          <p
            className="text-[17px] mb-4 leading-relaxed"
            style={{ color: appleWebColors.textPrimary }}
          >
            本利用規約（以下「本規約」といいます）は、サプティア（以下「当サイト」といいます）が提供するサプリメント比較・検索サービス（以下「本サービス」といいます）の利用条件を定めるものです。
          </p>
          <p
            className="text-[17px] leading-relaxed"
            style={{ color: appleWebColors.textPrimary }}
          >
            利用者の皆様（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
          </p>
        </section>

        {/* サービス内容 */}
        <section
          className={`mb-10 rounded-[20px] p-8 ${liquidGlassClasses.light}`}
          style={{
            border: `1px solid ${appleWebColors.borderSubtle}`,
          }}
        >
          <h2
            className="text-[22px] font-bold mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            第2条（サービス内容）
          </h2>
          <p
            className="text-[17px] mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            本サービスは以下の機能を提供します：
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "サプリメント製品の比較・検索機能",
              "科学的根拠に基づく情報の提供",
              "ユーザーレビュー・評価の表示",
              "外部ECサイトへのリンク提供",
              "AI を活用したレコメンデーション機能",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-[12px]"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <div
                  className="w-6 h-6 rounded-full text-[13px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(0, 122, 255, 0.1)",
                    color: systemColors.blue,
                  }}
                >
                  {index + 1}
                </div>
                <span
                  className="text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 免責事項 */}
        <section id="disclaimer" className="mb-10 scroll-mt-20">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900">
                第3条（免責事項）
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 mb-4 border border-amber-100">
              <h3 className="font-bold text-amber-800 mb-4">重要な免責事項</h3>
              <div className="space-y-3">
                {[
                  {
                    title: "医療・診断目的ではありません",
                    desc: "本サービスは医療行為、診断、治療、予防を目的としたものではありません。",
                  },
                  {
                    title: "医師への相談",
                    desc: "サプリメントの使用を開始する前に、必ず医師または専門家にご相談ください。",
                  },
                  {
                    title: "効果の保証なし",
                    desc: "掲載情報は参考情報であり、医薬的効果を保証するものではありません。",
                  },
                  { title: "個人差", desc: "効果には個人差があります。" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {item.title}：
                      </span>
                      <span className="text-slate-700">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-amber-800">
              当サイトは、本サービスで提供する情報の正確性、完全性、有用性について、いかなる保証も行いません。
            </p>
          </div>
        </section>

        {/* 外部サイトでの購入 */}
        <section className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              第4条（外部サイトでの購入について）
            </h2>
          </div>
          <p className="text-slate-700 mb-4 leading-relaxed">
            本サービスは商品の販売を行っておりません。商品購入は外部ECサイト（Amazon、楽天市場、iHerb等）で行われます。
          </p>
          <ul className="space-y-2">
            {[
              "購入契約は各ECサイトとユーザー間で成立します",
              "配送、返品、カスタマーサポートは各ECサイトの責任範囲です",
              "当サイトは購入に関する一切の責任を負いません",
              "価格・在庫情報はリアルタイムではない場合があります",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-slate-700"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 禁止事項 */}
        <section id="prohibited" className="mb-10 scroll-mt-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-200 rounded-lg">
                <Ban className="w-5 h-5 text-red-700" />
              </div>
              <h2 className="text-2xl font-bold text-red-900">
                第5条（禁止事項）
              </h2>
            </div>
            <p className="text-red-800 mb-4">
              ユーザーは以下の行為を行ってはなりません：
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "法令または公序良俗に違反する行為",
                "犯罪行為に関連する行為",
                "虚偽または誤解を招く情報の投稿",
                "サーバーへの過度な負荷",
                "不正アクセス、クローリング",
                "第三者の権利を侵害する行為",
                "本サービスの運営を妨害する行為",
                "医療行為と誤認させる行為",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-red-100 text-sm"
                >
                  <span className="text-red-500">✕</span>
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 知的財産権 */}
        <section className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Copyright className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              第6条（知的財産権）
            </h2>
          </div>
          <p className="text-slate-700 mb-4 leading-relaxed">
            本サービスに含まれるコンテンツ（テキスト、画像、ロゴ、デザイン、データベース等）の知的財産権は、当サイトまたは正当な権利者に帰属します。
          </p>
          <p className="text-slate-700 leading-relaxed">
            ユーザーは、個人的な利用目的の範囲内でのみコンテンツを使用できます。無断での複製、転載、再配布は禁止します。
          </p>
        </section>

        {/* サービスの変更・中断・終了 */}
        <section className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              第7条（サービスの変更・中断・終了）
            </h2>
          </div>
          <p className="text-slate-700 mb-4 leading-relaxed">
            当サイトは、ユーザーへの事前通知なく、本サービスの内容を変更、中断、または終了することができます。
          </p>
          <p className="text-slate-700 leading-relaxed">
            これにより生じたいかなる損害についても、当サイトは責任を負いません。
          </p>
        </section>

        {/* 免責・損害賠償 */}
        <section className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            第8条（免責・損害賠償）
          </h2>
          <p className="text-slate-700 mb-4">
            当サイトは、本サービスの利用により生じた以下の損害について、一切の責任を負いません：
          </p>
          <div className="bg-slate-50 rounded-xl p-4">
            <ul className="space-y-2">
              {[
                "直接的、間接的、特別、付随的、結果的損害",
                "データの消失または破損",
                "事業の中断",
                "逸失利益",
                "第三者からのクレーム",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* データの取り扱い */}
        <section className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            第9条（データの取り扱い）
          </h2>
          <p className="text-slate-700 leading-relaxed">
            ユーザーの個人情報およびアクセスデータの取り扱いについては、別途「
            <Link
              href="/legal/privacy"
              className="text-blue-600 hover:underline font-medium"
            >
              プライバシーポリシー
            </Link>
            」をご確認ください。
          </p>
        </section>

        {/* 規約の変更 */}
        <section className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            第10条（規約の変更）
          </h2>
          <p className="text-slate-700 leading-relaxed">
            当サイトは、必要に応じて本規約を変更できるものとします。変更後の規約は、本サイト上に掲載した時点で効力を生じます。
          </p>
        </section>

        {/* 準拠法・管轄裁判所 */}
        <section
          id="law"
          className="mb-10 scroll-mt-20 bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Gavel className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              第11条（準拠法・管轄裁判所）
            </h2>
          </div>
          <p className="text-slate-700 mb-4 leading-relaxed">
            本規約の解釈にあたっては、日本法を準拠法とします。
          </p>
          <p className="text-slate-700 leading-relaxed">
            本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        {/* お問い合わせ */}
        <section id="contact" className="scroll-mt-20">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Mail className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">
                第12条（お問い合わせ）
              </h2>
            </div>
            <p className="text-blue-800 mb-6">
              本規約に関するお問い合わせは、お問い合わせフォームよりご連絡ください。
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Mail size={18} />
              お問い合わせフォーム
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            関連ポリシー
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/legal/privacy"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-slate-700 font-medium">
                プライバシーポリシー
              </span>
            </Link>
            <Link
              href="/legal/disclaimer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-slate-700 font-medium">免責事項</span>
            </Link>
            <Link
              href="/legal/cookies"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-slate-700 font-medium">Cookieポリシー</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
