"use client";

import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import {
  Cookie,
  ChevronRight,
  Settings,
  Shield,
  BarChart3,
  Megaphone,
  Sliders,
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
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[15px] mb-8"
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
              Cookieポリシー
            </span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="p-3 rounded-[16px]"
              style={{ backgroundColor: appleWebColors.sectionBackground }}
            >
              <Cookie
                className="w-8 h-8"
                style={{ color: systemColors.blue }}
              />
            </div>
            <h1
              className="text-[28px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              Cookieポリシー
            </h1>
          </div>

          <p
            className="text-[17px] max-w-2xl mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            当サイトでのCookie使用についてご説明します
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = systemColors.blue;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    appleWebColors.sectionBackground;
                  e.currentTarget.style.color = appleWebColors.textPrimary;
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
        {/* What is Cookie */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[16px]"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Cookie
                  className="w-6 h-6"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <div>
                <h2
                  className="text-[20px] font-semibold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Cookieとは
                </h2>
                <p
                  className="text-[15px] mb-3"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  Cookieとは、ウェブサイトを訪問した際に、ブラウザに保存される小さなテキストファイルです。Cookieを使用することで、ウェブサイトはユーザーの訪問情報を記憶し、次回訪問時により良い体験を提供できます。
                </p>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  当サイト（サプティア）では、サービスの改善、ユーザー体験の向上、サイト利用状況の分析のためにCookieを使用しています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Types */}
        <section id="types" className="mb-10 scroll-mt-20">
          <h2
            className="text-[22px] font-bold mb-6"
            style={{ color: appleWebColors.textPrimary }}
          >
            使用しているCookieの種類
          </h2>

          <div className="space-y-4">
            {/* Essential */}
            <div
              className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  backgroundColor: systemColors.green,
                  borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white" />
                    <h3 className="text-[17px] font-semibold text-white">
                      必須Cookie（Strictly Necessary Cookies）
                    </h3>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-[13px] font-medium"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#FFFFFF",
                    }}
                  >
                    常に有効
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                      className="flex items-center gap-2 p-2 rounded-[10px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.green }}
                      />
                      <span style={{ color: appleWebColors.textPrimary }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <Clock size={14} />
                  <span>保持期間: セッション終了まで、または最大1年</span>
                </div>
              </div>
            </div>

            {/* Analytics */}
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
                  borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-white" />
                    <h3 className="text-[17px] font-semibold text-white">
                      分析Cookie（Analytics Cookies）
                    </h3>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-[13px] font-medium"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#FFFFFF",
                    }}
                  >
                    オプション
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                      className="flex items-center gap-2 p-2 rounded-[10px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.blue }}
                      />
                      <span style={{ color: appleWebColors.textPrimary }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-[16px] p-4 mb-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <p
                    className="font-semibold mb-2 text-[13px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    使用サービス:
                  </p>
                  <ul
                    className="text-[13px] space-y-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <li>• Google Analytics 4 (GA4)</li>
                    <li>• その他アクセス解析ツール</li>
                  </ul>
                </div>
                <div
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <Clock size={14} />
                  <span>保持期間: 最大2年</span>
                </div>
              </div>
            </div>

            {/* Advertising */}
            <div
              className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  backgroundColor: systemColors.purple,
                  borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-white" />
                    <h3 className="text-[17px] font-semibold text-white">
                      広告Cookie（Advertising Cookies）
                    </h3>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-[13px] font-medium"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#FFFFFF",
                    }}
                  >
                    オプション
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                      className="flex items-center gap-2 p-2 rounded-[10px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.purple }}
                      />
                      <span style={{ color: appleWebColors.textPrimary }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-[16px] p-4 mb-4"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <p
                    className="font-semibold mb-2 text-[13px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    使用サービス:
                  </p>
                  <ul
                    className="text-[13px] space-y-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <li>• Amazon アソシエイト</li>
                    <li>• 楽天アフィリエイト</li>
                    <li>• iHerb アフィリエイト</li>
                    <li>• Google Ads</li>
                    <li>• その他広告プラットフォーム</li>
                  </ul>
                </div>
                <div
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <Clock size={14} />
                  <span>保持期間: 最大1年</span>
                </div>
              </div>
            </div>

            {/* Functional */}
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
                  borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-white" />
                    <h3 className="text-[17px] font-semibold text-white">
                      機能Cookie（Functional Cookies）
                    </h3>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-[13px] font-medium"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#FFFFFF",
                    }}
                  >
                    オプション
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                      className="flex items-center gap-2 p-2 rounded-[10px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.orange }}
                      />
                      <span style={{ color: appleWebColors.textPrimary }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <Clock size={14} />
                  <span>保持期間: 最大1年</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Cookies */}
        <section id="third-party" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Globe
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
                <h2
                  className="text-[20px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  第三者Cookie
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトでは、第三者サービス（Google
                Analytics、アフィリエイトプログラム等）が設定するCookieも使用しています。これらのCookieは、各サービス提供者のプライバシーポリシーに従って管理されます。
              </p>

              <div className="space-y-3">
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-[16px] transition-colors group"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = systemColors.blue;
                    const span = e.currentTarget.querySelector("span");
                    const icon = e.currentTarget.querySelector("svg");
                    if (span) (span as HTMLElement).style.color = "#FFFFFF";
                    if (icon) (icon as SVGElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      appleWebColors.sectionBackground;
                    const span = e.currentTarget.querySelector("span");
                    const icon = e.currentTarget.querySelector("svg");
                    if (span)
                      (span as HTMLElement).style.color =
                        appleWebColors.textPrimary;
                    if (icon)
                      (icon as SVGElement).style.color =
                        appleWebColors.textSecondary;
                  }}
                >
                  <span
                    className="font-medium text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    Google プライバシーポリシー
                  </span>
                  <ExternalLink
                    size={16}
                    style={{ color: appleWebColors.textSecondary }}
                  />
                </a>

                <a
                  href="https://affiliate.amazon.co.jp/help/operating/agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-[16px] transition-colors group"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = systemColors.blue;
                    const span = e.currentTarget.querySelector("span");
                    const icon = e.currentTarget.querySelector("svg");
                    if (span) (span as HTMLElement).style.color = "#FFFFFF";
                    if (icon) (icon as SVGElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      appleWebColors.sectionBackground;
                    const span = e.currentTarget.querySelector("span");
                    const icon = e.currentTarget.querySelector("svg");
                    if (span)
                      (span as HTMLElement).style.color =
                        appleWebColors.textPrimary;
                    if (icon)
                      (icon as SVGElement).style.color =
                        appleWebColors.textSecondary;
                  }}
                >
                  <span
                    className="font-medium text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    Amazon アソシエイト プログラム参加規約
                  </span>
                  <ExternalLink
                    size={16}
                    style={{ color: appleWebColors.textSecondary }}
                  />
                </a>

                <a
                  href="https://affiliate.rakuten.co.jp/guides/rules/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-[16px] transition-colors group"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = systemColors.blue;
                    const span = e.currentTarget.querySelector("span");
                    const icon = e.currentTarget.querySelector("svg");
                    if (span) (span as HTMLElement).style.color = "#FFFFFF";
                    if (icon) (icon as SVGElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      appleWebColors.sectionBackground;
                    const span = e.currentTarget.querySelector("span");
                    const icon = e.currentTarget.querySelector("svg");
                    if (span)
                      (span as HTMLElement).style.color =
                        appleWebColors.textPrimary;
                    if (icon)
                      (icon as SVGElement).style.color =
                        appleWebColors.textSecondary;
                  }}
                >
                  <span
                    className="font-medium text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    楽天アフィリエイト 規約
                  </span>
                  <ExternalLink
                    size={16}
                    style={{ color: appleWebColors.textSecondary }}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Settings */}
        <section id="settings" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Settings
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
                <h2
                  className="text-[20px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Cookie設定の変更方法
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Site Settings */}
              <div>
                <h3
                  className="text-[17px] font-semibold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  当サイトでの設定
                </h3>
                <div
                  className="rounded-[16px] p-5"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <p
                    className="text-[15px] mb-4"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    以下のボタンから、いつでもCookie設定を変更できます。各種類のCookieを個別に有効・無効にすることができます。
                  </p>
                  <button
                    onClick={openSettings}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[16px] transition-all font-medium text-[15px]"
                    style={{
                      backgroundColor: systemColors.blue,
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <Settings size={18} />
                    Cookie設定を変更する
                  </button>
                </div>
              </div>

              {/* Browser Settings */}
              <div>
                <h3
                  className="text-[17px] font-semibold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  ブラウザでの設定
                </h3>
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                    <div
                      key={i}
                      className="p-4 rounded-[16px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <p
                        className="font-semibold mb-1 text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {browser.name}
                      </p>
                      <p
                        className="text-[13px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {browser.path}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: systemColors.orange }}
                    />
                    <p
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <strong style={{ color: appleWebColors.textPrimary }}>
                        注意:
                      </strong>{" "}
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
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield
                className="w-5 h-5"
                style={{ color: appleWebColors.textSecondary }}
              />
              <h2
                className="text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                Do Not Track (DNT)
              </h2>
            </div>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              一部のブラウザには「Do Not
              Track（追跡拒否）」機能があります。当サイトは、この設定を尊重し、DNTが有効な場合は分析・広告Cookieを制限します。
            </p>
          </div>
        </section>

        {/* Mobile Identifiers */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Smartphone
                className="w-5 h-5"
                style={{ color: appleWebColors.textSecondary }}
              />
              <h2
                className="text-[20px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                モバイルアプリでの識別子
              </h2>
            </div>
            <p
              className="text-[15px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              将来的にモバイルアプリを提供する場合、以下の識別子を使用する可能性があります：
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {["広告識別子（IDFA / AAID）", "デバイス識別子"].map(
                (item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-[10px] text-[13px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: appleWebColors.textSecondary }}
                    />
                    <span style={{ color: appleWebColors.textPrimary }}>
                      {item}
                    </span>
                  </div>
                ),
              )}
            </div>
            <p
              className="text-[13px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              これらの識別子は、デバイス設定からオプトアウトできます。
            </p>
          </div>
        </section>

        {/* Retention Period */}
        <section id="retention" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Clock
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
                <h2
                  className="text-[20px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Cookieの保持期間
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        Cookie種類
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        保持期間
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        type: "必須Cookie",
                        period: "セッション終了まで または 最大1年",
                        color: systemColors.green,
                      },
                      {
                        type: "分析Cookie",
                        period: "最大2年",
                        color: systemColors.blue,
                      },
                      {
                        type: "広告Cookie",
                        period: "最大1年",
                        color: systemColors.purple,
                      },
                      {
                        type: "機能Cookie",
                        period: "最大1年",
                        color: systemColors.orange,
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                        }}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: row.color }}
                            />
                            <span style={{ color: appleWebColors.textPrimary }}>
                              {row.type}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-3 px-4"
                          style={{ color: appleWebColors.textSecondary }}
                        >
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
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[16px]"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Baby
                  className="w-6 h-6"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <div>
                <h2
                  className="text-[20px] font-semibold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  子供のプライバシー
                </h2>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  当サイトは13歳未満の子供を対象としていません。13歳未満の子供のCookie情報を故意に収集することはありません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Changes */}
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
                Cookieポリシーの変更
              </h2>
            </div>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              当サイトは、必要に応じて本Cookieポリシーを変更することがあります。重要な変更がある場合は、サイト上で通知します。
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[16px]"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Mail
                  className="w-6 h-6"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <div>
                <h2
                  className="text-[20px] font-semibold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お問い合わせ
                </h2>
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  Cookieの使用に関するご質問は、お問い合わせフォームよりご連絡ください。
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[16px] font-medium text-[15px] transition-opacity"
                  style={{
                    backgroundColor: systemColors.blue,
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
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
          <h2
            className="text-[17px] font-semibold mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            関連ポリシー
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/legal/privacy"
              className={`p-4 rounded-[16px] transition-all group ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                className="font-semibold mb-1 text-[15px]"
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
              href="/legal/terms"
              className={`p-4 rounded-[16px] transition-all group ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                className="font-semibold mb-1 text-[15px]"
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
          </div>
        </section>
      </main>
    </div>
  );
}
