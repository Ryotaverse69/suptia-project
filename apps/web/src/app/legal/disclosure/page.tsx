import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Store,
  CreditCard,
  Package,
  RefreshCw,
  Mail,
  AlertCircle,
  MapPin,
  Phone,
  Globe,
  User,
  FileText,
  Handshake,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - サプティア",
  description: "特定商取引法に基づく事業者情報の表記です。",
};

export default function DisclosurePage() {
  const sections = [
    { id: "provider", label: "事業者情報", icon: Building2 },
    { id: "service", label: "サービス", icon: Store },
    { id: "affiliate", label: "アフィリエイト", icon: Handshake },
    { id: "contact", label: "お問い合わせ", icon: Mail },
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/legal/terms"
              className="transition-colors"
              style={{ color: systemColors.blue }}
            >
              法的情報
            </Link>
            <ChevronRight size={16} />
            <span style={{ color: appleWebColors.textPrimary }}>
              特定商取引法に基づく表記
            </span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="p-3 rounded-[16px]"
              style={{
                backgroundColor: "rgba(0, 122, 255, 0.1)",
              }}
            >
              <Building2
                className="w-8 h-8"
                style={{ color: systemColors.blue }}
              />
            </div>
            <h1
              className="text-[28px] md:text-[34px] font-bold"
              style={{ color: appleWebColors.textPrimary }}
            >
              特定商取引法に基づく表記
            </h1>
          </div>

          <p
            className="text-[17px] max-w-2xl"
            style={{ color: appleWebColors.textSecondary }}
          >
            法令に基づく事業者情報の開示
          </p>

          <div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px]"
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
        {/* Important Notice */}
        <section className="mb-10">
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: "rgba(0, 122, 255, 0.08)",
              border: `1px solid rgba(0, 122, 255, 0.2)`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[12px]"
                style={{
                  backgroundColor: "rgba(0, 122, 255, 0.15)",
                }}
              >
                <AlertCircle
                  className="w-6 h-6"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <div>
                <h2
                  className="text-[17px] font-semibold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  重要なお知らせ
                </h2>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  当サイトは商品の直接販売を行っておりません。商品の購入は外部ECサイト（Amazon、楽天市場、iHerb等）で行われます。商品購入に関する契約は、各ECサイトとお客様の間で成立します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Provider */}
        <section id="provider" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: appleWebColors.sectionBackground,
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Building2
                  className="w-5 h-5"
                  style={{ color: systemColors.blue }}
                />
                <h2
                  className="text-[17px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サービス提供者
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-4">
                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <Store
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      サービス名称
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      サプティア (Suptia)
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <Building2
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      運営形態
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      個人事業主
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      運営責任者
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      長谷川　亮太
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      所在地
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      請求があり次第遅滞なく開示します
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <Phone
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      電話番号
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      請求があり次第遅滞なく開示します
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <Mail
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      メールアドレス
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      info@suptia.com
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-[16px]"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <Globe
                    className="w-5 h-5"
                    style={{ color: appleWebColors.textSecondary }}
                  />
                  <div>
                    <div
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      URL
                    </div>
                    <div
                      className="font-semibold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      https://suptia.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclosure Notice */}
              <div
                className="mt-6 rounded-[16px] p-5"
                style={{
                  backgroundColor: "rgba(255, 149, 0, 0.08)",
                  border: `1px solid rgba(255, 149, 0, 0.2)`,
                }}
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    className="w-6 h-6 flex-shrink-0 mt-0.5"
                    style={{ color: systemColors.orange }}
                  />
                  <div>
                    <h3
                      className="font-semibold text-[15px] mb-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      所在地・電話番号の開示について
                    </h3>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      特定商取引法に基づき、所在地および電話番号については、ご請求があり次第遅滞なく開示いたします。開示をご希望の場合は、メールアドレス（
                      <span className="font-semibold">info@suptia.com</span>
                      ）までお問い合わせください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Content */}
        <section id="service" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: appleWebColors.sectionBackground,
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Store
                  className="w-5 h-5"
                  style={{ color: systemColors.blue }}
                />
                <h2
                  className="text-[17px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サービス内容
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "サプリメント製品の比較・検索サービスの提供",
                  "科学的根拠に基づく情報の提供",
                  "ユーザーレビュー・評価情報の提供",
                  "外部ECサイトへのリンク提供",
                  "AIを活用したレコメンデーション機能",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: "rgba(0, 122, 255, 0.06)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: systemColors.blue }}
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
                className="rounded-[16px] p-4 text-[13px]"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  color: appleWebColors.textSecondary,
                }}
              >
                ※
                当サイトは商品の販売を行っておりません。商品の購入は外部ECサイトで行われます。
              </div>
            </div>
          </div>
        </section>

        {/* Service Fee */}
        <section className="mb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <CreditCard
                  className="w-5 h-5"
                  style={{ color: systemColors.green }}
                />
                <h3
                  className="font-semibold text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サービス利用料金
                </h3>
              </div>
              <div
                className="text-[28px] font-bold mb-1"
                style={{ color: systemColors.green }}
              >
                無料
              </div>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトのサービスは無料でご利用いただけます。
              </p>
            </div>

            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <CreditCard
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
                <h3
                  className="font-semibold text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お支払い方法
                </h3>
              </div>
              <div
                className="text-[17px] font-semibold mb-1"
                style={{ color: appleWebColors.textSecondary }}
              >
                該当なし
              </div>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                外部ECサイトでの購入は各サイトの規約に準じます。
              </p>
            </div>

            <div
              className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Package
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
                <h3
                  className="font-semibold text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  商品の引渡し時期
                </h3>
              </div>
              <div
                className="text-[17px] font-semibold mb-1"
                style={{ color: appleWebColors.textSecondary }}
              >
                該当なし
              </div>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは商品の販売・配送を行っておりません。
              </p>
            </div>
          </div>
        </section>

        {/* Return Policy */}
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
                backgroundColor: appleWebColors.sectionBackground,
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <RefreshCw
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
                <h2
                  className="text-[17px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  返品・交換・キャンセル
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは商品の販売を行っておりません（該当なし）。
              </p>
              <div
                className="rounded-[16px] p-4 text-[13px]"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  color: appleWebColors.textSecondary,
                }}
              >
                外部ECサイトで購入された商品の返品・交換・キャンセルについては、各ECサイトの規約に従ってください。
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate */}
        <section id="affiliate" className="mb-10 scroll-mt-20">
          <div
            className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
            style={{
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: appleWebColors.sectionBackground,
                borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Handshake
                  className="w-5 h-5"
                  style={{ color: systemColors.purple }}
                />
                <h2
                  className="text-[17px] font-semibold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  アフィリエイトプログラムについて
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="text-[15px] mb-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                当サイトは、以下のアフィリエイトプログラムに参加しています：
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "Amazonアソシエイトプログラム",
                  "楽天アフィリエイト",
                  "iHerb アフィリエイトプログラム",
                  "その他提携企業のプログラム",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-[12px]"
                    style={{
                      backgroundColor: "rgba(175, 82, 222, 0.06)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: systemColors.purple }}
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
                className="rounded-[16px] p-4 text-[13px]"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  color: appleWebColors.textSecondary,
                }}
              >
                当サイトのリンクを経由して商品が購入された場合、当サイトは各アフィリエイトプログラムから紹介料を受け取ることがあります。これにより商品価格が変わることはありません。
              </div>

              <div className="mt-4">
                <Link
                  href="/legal/affiliate"
                  className="inline-flex items-center gap-2 text-[13px] font-medium"
                  style={{ color: systemColors.blue }}
                >
                  アフィリエイト開示の詳細を見る
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-10">
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: "rgba(255, 59, 48, 0.08)",
              border: `1px solid rgba(255, 59, 48, 0.2)`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[12px]"
                style={{
                  backgroundColor: "rgba(255, 59, 48, 0.15)",
                }}
              >
                <AlertTriangle
                  className="w-6 h-6"
                  style={{ color: systemColors.red }}
                />
              </div>
              <div>
                <h2
                  className="text-[17px] font-semibold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  免責事項
                </h2>
                <div className="space-y-2">
                  {[
                    "当サイトは商品の販売を行っておりません",
                    "商品購入に関する契約は、各ECサイトとお客様の間で成立します",
                    "配送、返品、カスタマーサポートは各ECサイトの責任範囲です",
                    "当サイトは外部ECサイトでの取引に関する一切の責任を負いません",
                    "価格・在庫情報はリアルタイムではない場合があります",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: systemColors.red }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-10 scroll-mt-20">
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-[12px]"
                style={{
                  backgroundColor: "rgba(0, 122, 255, 0.1)",
                }}
              >
                <Mail
                  className="w-6 h-6"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <div>
                <h2
                  className="text-[17px] font-semibold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お問い合わせ
                </h2>
                <p
                  className="text-[15px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  サービスに関するお問い合わせは、以下の方法でご連絡ください。
                </p>
                <div className="space-y-2 mb-4">
                  <div
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <FileText size={14} />
                    お問い合わせフォーム
                  </div>
                  <div
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <Mail size={14} />
                    info@suptia.com
                  </div>
                </div>
                <p
                  className="text-[13px] mb-4"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  ※ お問い合わせへの回答には数日かかる場合があります。
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] font-medium transition-colors text-[15px]"
                  style={{
                    backgroundColor: systemColors.blue,
                    color: "#FFFFFF",
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
                className="font-semibold text-[15px] mb-1"
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
                className="font-semibold text-[15px] mb-1"
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
              href="/legal/affiliate"
              className={`p-4 rounded-[16px] transition-all group ${liquidGlassClasses.light}`}
              style={{
                border: `1px solid ${appleWebColors.borderSubtle}`,
              }}
            >
              <h3
                className="font-semibold text-[15px] mb-1"
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
