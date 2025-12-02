"use client";

import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import {
  Cookie,
  ChevronRight,
  Settings,
  Shield,
  BarChart3,
  Megaphone,
  Sparkles,
  Clock,
  Globe,
  Baby,
  RefreshCw,
  Mail,
  AlertTriangle,
  ExternalLink,
  Smartphone,
} from "lucide-react";

export default function CookiesPage() {
  const { openSettings } = useCookieConsent();

  const sections = [
    { id: "types", label: "Cookie種類", icon: Cookie },
    { id: "third-party", label: "第三者Cookie", icon: Globe },
    { id: "settings", label: "設定変更", icon: Settings },
    { id: "retention", label: "保持期間", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-amber-100 text-sm mb-6">
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
            <span className="text-white">Cookieポリシー</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Cookieポリシー
            </h1>
          </div>

          <p className="text-amber-100 text-lg max-w-2xl">
            当サイトでのCookie使用についてご説明します
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-amber-100 hover:text-amber-700 rounded-full transition-colors whitespace-nowrap"
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
        {/* What is Cookie */}
        <section className="mb-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Cookie className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  Cookieとは
                </h2>
                <p className="text-amber-800 mb-3">
                  Cookieとは、ウェブサイトを訪問した際に、ブラウザに保存される小さなテキストファイルです。Cookieを使用することで、ウェブサイトはユーザーの訪問情報を記憶し、次回訪問時により良い体験を提供できます。
                </p>
                <p className="text-amber-800">
                  当サイト（サプティア）では、サービスの改善、ユーザー体験の向上、サイト利用状況の分析のためにCookieを使用しています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Types */}
        <section id="types" className="mb-10 scroll-mt-20">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            使用しているCookieの種類
          </h2>

          <div className="space-y-4">
            {/* Essential */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      必須Cookie（Strictly Necessary Cookies）
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    常に有効
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  サイトの基本機能に必要不可欠なCookie。無効にするとサイトが正常に機能しません。
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {[
                    "セッション管理",
                    "セキュリティ・認証",
                    "Cookie同意設定の記憶",
                    "言語設定の保存",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={14} />
                  <span>保持期間: セッション終了まで、または最大1年</span>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      分析Cookie（Analytics Cookies）
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    オプション
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  サイトの使用状況を分析し、サービス改善に役立てるためのCookie。
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {[
                    "ページビュー数の計測",
                    "訪問者数の計測",
                    "ユーザー行動の分析",
                    "サイト内検索クエリの分析",
                    "デバイス・ブラウザ情報の収集",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="font-semibold text-slate-800 mb-2 text-sm">
                    使用サービス:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Google Analytics 4 (GA4)</li>
                    <li>• その他アクセス解析ツール</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={14} />
                  <span>保持期間: 最大2年</span>
                </div>
              </div>
            </div>

            {/* Advertising */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      広告Cookie（Advertising Cookies）
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    オプション
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  ユーザーの興味・関心に基づいた広告配信、アフィリエイト成果の測定に使用するCookie。
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {[
                    "アフィリエイトトラッキング",
                    "広告効果測定",
                    "リターゲティング広告",
                    "コンバージョン計測",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="font-semibold text-slate-800 mb-2 text-sm">
                    使用サービス:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Amazon アソシエイト</li>
                    <li>• 楽天アフィリエイト</li>
                    <li>• iHerb アフィリエイト</li>
                    <li>• Google Ads</li>
                    <li>• その他広告プラットフォーム</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={14} />
                  <span>保持期間: 最大1年</span>
                </div>
              </div>
            </div>

            {/* Functional */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      機能Cookie（Functional Cookies）
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    オプション
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  ユーザー体験を向上させるためのCookie。無効にしても基本機能は使用できます。
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {[
                    "表示設定の保存（ダークモード等）",
                    "検索履歴の保存",
                    "お気に入り商品の記憶",
                    "レコメンデーションのパーソナライゼーション",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={14} />
                  <span>保持期間: 最大1年</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Cookies */}
        <section id="third-party" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">第三者Cookie</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトでは、第三者サービス（Google
                Analytics、アフィリエイトプログラム等）が設定するCookieも使用しています。これらのCookieは、各サービス提供者のプライバシーポリシーに従って管理されます。
              </p>

              <div className="space-y-3">
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <span className="font-medium text-slate-800">
                    Google プライバシーポリシー
                  </span>
                  <ExternalLink
                    size={16}
                    className="text-slate-400 group-hover:text-slate-600"
                  />
                </a>

                <a
                  href="https://affiliate.amazon.co.jp/help/operating/agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <span className="font-medium text-slate-800">
                    Amazon アソシエイト プログラム参加規約
                  </span>
                  <ExternalLink
                    size={16}
                    className="text-slate-400 group-hover:text-slate-600"
                  />
                </a>

                <a
                  href="https://affiliate.rakuten.co.jp/guides/rules/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <span className="font-medium text-slate-800">
                    楽天アフィリエイト 規約
                  </span>
                  <ExternalLink
                    size={16}
                    className="text-slate-400 group-hover:text-slate-600"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Settings */}
        <section id="settings" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Cookie設定の変更方法
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Site Settings */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  当サイトでの設定
                </h3>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5">
                  <p className="text-slate-700 mb-4">
                    以下のボタンから、いつでもCookie設定を変更できます。各種類のCookieを個別に有効・無効にすることができます。
                  </p>
                  <button
                    onClick={openSettings}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
                  >
                    <Settings size={18} />
                    Cookie設定を変更する
                  </button>
                </div>
              </div>

              {/* Browser Settings */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  ブラウザでの設定
                </h3>
                <p className="text-slate-600 mb-4">
                  各ブラウザの設定からCookieを管理できます：
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: "Google Chrome",
                      path: "設定 → プライバシーとセキュリティ → Cookie",
                    },
                    {
                      name: "Safari",
                      path: "環境設定 → プライバシー → Cookie",
                    },
                    {
                      name: "Firefox",
                      path: "オプション → プライバシーとセキュリティ",
                    },
                    {
                      name: "Microsoft Edge",
                      path: "設定 → プライバシー、検索、サービス",
                    },
                  ].map((browser, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl">
                      <p className="font-semibold text-slate-800 mb-1">
                        {browser.name}
                      </p>
                      <p className="text-sm text-slate-500">{browser.path}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>注意:</strong>{" "}
                      すべてのCookieをブロックすると、サイトの一部機能が正常に動作しない場合があります。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Do Not Track */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Do Not Track (DNT)
              </h2>
            </div>
            <p className="text-slate-600">
              一部のブラウザには「Do Not
              Track（追跡拒否）」機能があります。当サイトは、この設定を尊重し、DNTが有効な場合は分析・広告Cookieを制限します。
            </p>
          </div>
        </section>

        {/* Mobile Identifiers */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                モバイルアプリでの識別子
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              将来的にモバイルアプリを提供する場合、以下の識別子を使用する可能性があります：
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {["広告識別子（IDFA / AAID）", "デバイス識別子"].map(
                (item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ),
              )}
            </div>
            <p className="text-slate-500 text-sm">
              これらの識別子は、デバイス設定からオプトアウトできます。
            </p>
          </div>
        </section>

        {/* Retention Period */}
        <section id="retention" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Cookieの保持期間
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-800">
                        Cookie種類
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-800">
                        保持期間
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        type: "必須Cookie",
                        period: "セッション終了まで または 最大1年",
                        color: "emerald",
                      },
                      {
                        type: "分析Cookie",
                        period: "最大2年",
                        color: "blue",
                      },
                      {
                        type: "広告Cookie",
                        period: "最大1年",
                        color: "purple",
                      },
                      {
                        type: "機能Cookie",
                        period: "最大1年",
                        color: "amber",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full bg-${row.color}-500`}
                            />
                            <span className="text-slate-700">{row.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {row.period}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Baby className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  子供のプライバシー
                </h2>
                <p className="text-amber-800">
                  当サイトは13歳未満の子供を対象としていません。13歳未満の子供のCookie情報を故意に収集することはありません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Changes */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Cookieポリシーの変更
              </h2>
            </div>
            <p className="text-slate-600">
              当サイトは、必要に応じて本Cookieポリシーを変更することがあります。重要な変更がある場合は、サイト上で通知します。
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
                  Cookieの使用に関するご質問は、お問い合わせフォームよりご連絡ください。
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

        {/* Related Links */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            関連ポリシー
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/legal/privacy"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 mb-1">
                プライバシーポリシー
              </h3>
              <p className="text-sm text-slate-500">個人情報の取り扱い</p>
            </Link>

            <Link
              href="/legal/terms"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 mb-1">
                利用規約
              </h3>
              <p className="text-sm text-slate-500">サービスの利用条件</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
