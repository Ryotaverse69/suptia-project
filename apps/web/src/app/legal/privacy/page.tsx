import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  ChevronRight,
  Database,
  Cookie,
  Lock,
  Users,
  Baby,
  Mail,
  Eye,
  Server,
  Share2,
  Brain,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "プライバシーポリシー - サプティア",
  description: "サプティアの個人情報保護方針です。",
};

export default function PrivacyPage() {
  const sections = [
    { id: "collection", label: "収集情報", icon: Database },
    { id: "cookies", label: "Cookie", icon: Cookie },
    { id: "security", label: "セキュリティ", icon: Lock },
    { id: "rights", label: "ユーザー権利", icon: Users },
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
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb - Sticky with glassmorphism */}
          <nav
            className="flex items-center gap-2 mb-8 text-[13px]"
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
            <ChevronRight size={14} />
            <Link
              href="/legal/terms"
              className="transition-colors"
              style={{
                color: systemColors.blue,
              }}
            >
              法的情報
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: appleWebColors.textPrimary }}>
              プライバシーポリシー
            </span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="p-3 rounded-[16px]"
              style={{
                backgroundColor: systemColors.blue,
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-[34px] md:text-[48px] font-bold tracking-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              プライバシーポリシー
            </h1>
          </div>

          <p
            className="text-[17px] max-w-2xl mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            サプティアにおける個人情報の取り扱いについて説明します
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

      {/* Quick Navigation - Sticky with glassmorphism */}
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full transition-all whitespace-nowrap hover:bg-[#007AFF] hover:text-white"
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
        {/* Basic Policy */}
        <section className="mb-10">
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[12px]"
                style={{
                  backgroundColor: systemColors.blue,
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className="text-[22px] font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  基本方針
                </h2>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  サプティア（以下「当サイト」といいます）は、ユーザーの個人情報の重要性を認識し、個人情報保護法その他の関連法令を遵守し、適切に取り扱います。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Information Collection */}
        <section id="collection" className="mb-10 scroll-mt-20">
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
                <Database
                  className="w-5 h-5"
                  style={{ color: systemColors.blue }}
                />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  収集する情報
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Automatic Collection */}
              <div>
                <h3
                  className="text-[17px] font-semibold mb-3 flex items-center gap-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Server size={18} style={{ color: systemColors.gray[1] }} />
                  自動的に収集される情報
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "IPアドレス",
                    "ブラウザの種類・バージョン",
                    "オペレーティングシステム",
                    "アクセス日時",
                    "参照元URL",
                    "閲覧ページ",
                    "デバイス情報",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-[12px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.gray[2] }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* User Provided */}
              <div>
                <h3
                  className="text-[17px] font-semibold mb-3 flex items-center gap-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Users size={18} style={{ color: systemColors.gray[1] }} />
                  ユーザーが提供する情報
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "お問い合わせ情報（氏名、メールアドレス等）",
                    "レビュー・評価の投稿内容",
                    "検索クエリ",
                    "ユーザー設定（言語、表示設定等）",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-[12px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.blue }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cookie Collection */}
              <div>
                <h3
                  className="text-[17px] font-semibold mb-3 flex items-center gap-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Cookie size={18} style={{ color: systemColors.gray[1] }} />
                  Cookie・類似技術により収集される情報
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "セッションID",
                    "ユーザー識別子",
                    "サイト利用状況",
                    "広告効果測定データ",
                    "アフィリエイトトラッキングデータ",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-[12px] text-[13px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: systemColors.teal }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose of Use */}
        <section className="mb-10">
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
                <Eye className="w-5 h-5" style={{ color: systemColors.blue }} />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  情報の利用目的
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                収集した情報は、以下の目的で利用します：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "本サービスの提供・運営・改善",
                  "ユーザーサポート・お問い合わせ対応",
                  "ユーザー体験のパーソナライゼーション",
                  "AIレコメンデーション機能の提供",
                  "サイト利用状況の分析・統計",
                  "不正利用の防止・セキュリティ対策",
                  "マーケティング・広告配信の最適化",
                  "法令遵守・紛争解決",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 text-white text-[11px] font-bold rounded-full flex-shrink-0"
                      style={{ backgroundColor: systemColors.blue }}
                    >
                      {i + 1}
                    </span>
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

        {/* Cookies */}
        <section id="cookies" className="mb-10 scroll-mt-20">
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
                <Cookie
                  className="w-5 h-5"
                  style={{ color: systemColors.orange }}
                />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Cookieの使用について
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p
                className="text-[15px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトでは、ユーザー体験の向上、サイト利用状況の分析、広告配信のために、Cookie及び類似技術を使用しています。
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: systemColors.green }}
                    />
                    <h4
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      必須Cookie
                    </h4>
                  </div>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    サイトの基本機能（セッション管理、セキュリティ）に必要なCookie。無効にするとサイトが正常に機能しません。
                  </p>
                </div>

                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: systemColors.blue }}
                    />
                    <h4
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      分析Cookie
                    </h4>
                  </div>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    Google
                    Analytics等を使用したアクセス解析Cookie。サイト改善のために利用します。
                  </p>
                </div>

                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: systemColors.purple }}
                    />
                    <h4
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      広告Cookie
                    </h4>
                  </div>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    アフィリエイトプログラム、リターゲティング広告のためのCookie。
                  </p>
                </div>

                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: systemColors.orange }}
                    />
                    <h4
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      機能Cookie
                    </h4>
                  </div>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    ユーザー設定の保存、パーソナライゼーションのためのCookie。
                  </p>
                </div>
              </div>

              <div
                className="rounded-[16px] p-4"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  border: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <h4
                  className="font-semibold text-[15px] mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Cookie設定の変更
                </h4>
                <p
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  ブラウザの設定からCookieを無効化できます。また、フッターの「Cookie設定を変更する」リンクから、Cookie同意設定を変更できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Services */}
        <section className="mb-10">
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
                <Share2
                  className="w-5 h-5"
                  style={{ color: systemColors.purple }}
                />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  第三者サービスの利用
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは以下の第三者サービスを利用しています：
              </p>

              <div className="space-y-4">
                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      Google Analytics
                    </h4>
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-[13px] flex items-center gap-1 transition-opacity hover:opacity-70"
                      style={{ color: systemColors.blue }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      プライバシーポリシー
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    アクセス解析のために使用。Googleのプライバシーポリシーに準拠します。
                  </p>
                </div>

                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <h4
                    className="font-semibold text-[15px] mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    アフィリエイトプログラム
                  </h4>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    Amazon
                    アソシエイト、楽天アフィリエイト、iHerb等のトラッキングCookieを使用します。
                  </p>
                </div>

                <div
                  className="rounded-[16px] p-4"
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                  }}
                >
                  <h4
                    className="font-semibold text-[15px] mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    CDN・ホスティング
                  </h4>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    Vercel、その他CDNサービスを使用。各サービスのプライバシーポリシーに準拠します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Disclosure */}
        <section className="mb-10">
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
              <h2
                className="text-[22px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                情報の第三者提供
              </h2>
            </div>
            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
              </p>
              <div className="space-y-2">
                {[
                  "ユーザーの同意がある場合",
                  "法令に基づく場合",
                  "人の生命、身体または財産の保護に必要な場合",
                  "公衆衛生の向上または児童の健全な育成の推進に特に必要がある場合",
                  "国の機関等への協力が必要な場合",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 text-white text-[11px] font-bold rounded-full flex-shrink-0"
                      style={{ backgroundColor: systemColors.gray[1] }}
                    >
                      {i + 1}
                    </span>
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

        {/* AI Recommendation */}
        <section className="mb-10">
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
                <Brain
                  className="w-5 h-5"
                  style={{ color: systemColors.cyan }}
                />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  AIレコメンデーション・データ処理
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは、ユーザー体験向上のためAI技術を使用しています：
              </p>
              <div className="space-y-3 mb-4">
                {[
                  "閲覧履歴、検索履歴に基づくレコメンデーション",
                  "匿名化された統計データの機械学習への利用",
                  "個人を特定できない形での学習データ利用",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: systemColors.cyan }}
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
              <div
                className="rounded-[16px] p-4"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  border: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <p
                  className="text-[13px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <strong>重要：</strong>
                  AIモデルのトレーニングには、個人を特定できる情報は使用しません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mb-10 scroll-mt-20">
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
                <Lock
                  className="w-5 h-5"
                  style={{ color: systemColors.green }}
                />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  データの保管・セキュリティ
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは、個人情報を適切に管理し、以下の対策を講じています：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Lock, text: "SSL/TLS暗号化通信の使用" },
                  { icon: Users, text: "アクセス制限・認証システム" },
                  { icon: Eye, text: "定期的なセキュリティ監査" },
                  { icon: Shield, text: "不正アクセス対策" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-[16px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                      border: `1px solid ${appleWebColors.borderSubtle}`,
                    }}
                  >
                    <item.icon
                      className="w-5 h-5"
                      style={{ color: systemColors.green }}
                    />
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section id="rights" className="mb-10 scroll-mt-20">
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
                <Users
                  className="w-5 h-5"
                  style={{ color: systemColors.indigo }}
                />
                <h2
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  ユーザーの権利
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                ユーザーは以下の権利を有します：
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "個人情報の開示請求",
                  "個人情報の訂正・追加・削除請求",
                  "個人情報の利用停止・消去請求",
                  "第三者提供の停止請求",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: appleWebColors.sectionBackground,
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 text-white text-[11px] font-bold rounded-full flex-shrink-0"
                      style={{ backgroundColor: systemColors.indigo }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                これらの請求は、
                <Link
                  href="/contact"
                  className="transition-opacity hover:opacity-70"
                  style={{ color: systemColors.blue }}
                >
                  お問い合わせフォーム
                </Link>
                よりご連絡ください。
              </p>
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
                className="p-2 rounded-[12px]"
                style={{ backgroundColor: systemColors.orange }}
              >
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className="text-[22px] font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  子供のプライバシー
                </h2>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  本サービスは13歳未満の子供を対象としていません。13歳未満の子供の個人情報を故意に収集することはありません。
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
                style={{ color: systemColors.gray[1] }}
              />
              <h2
                className="text-[22px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                プライバシーポリシーの変更
              </h2>
            </div>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のポリシーは、本ページに掲載した時点で効力を生じます。
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: systemColors.blue,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[12px]"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-[22px] font-bold mb-2 text-white">
                  お問い合わせ
                </h2>
                <p
                  className="text-[15px] mb-4"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "white",
                    color: systemColors.blue,
                  }}
                >
                  <span className="text-[15px]">お問い合わせフォーム</span>
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
            関連リンク
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/legal/terms"
              className={`p-4 rounded-[16px] transition-all group hover:-translate-y-0.5 hover:shadow-lg ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1 transition-colors group-hover:opacity-70"
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
              href="/legal/cookies"
              className={`p-4 rounded-[16px] transition-all group hover:-translate-y-0.5 hover:shadow-lg ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1 transition-colors group-hover:opacity-70"
                style={{ color: appleWebColors.textPrimary }}
              >
                Cookieポリシー
              </h3>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                Cookieの詳細な使用方法
              </p>
            </Link>

            <Link
              href="/legal/affiliate"
              className={`p-4 rounded-[16px] transition-all group hover:-translate-y-0.5 hover:shadow-lg ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1 transition-colors group-hover:opacity-70"
                style={{ color: appleWebColors.textPrimary }}
              >
                アフィリエイト開示
              </h3>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                収益モデルの透明性
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
