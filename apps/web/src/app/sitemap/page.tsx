import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  Info,
  HelpCircle,
  Users,
  Lightbulb,
} from "lucide-react";
import {
  appleWebColors,
  fontStack,
  monoFontStack,
  systemColors,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "サイトマップ - サプティア",
  description:
    "サプティアの全ページを一覧でご確認いただけます。商品一覧、成分ガイド、使い方、会社情報、法的情報など、サイト内のすべてのコンテンツへのリンク集です。",
};

export default function SitemapPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1
            className="text-[34px] font-bold mb-4 leading-[41px] tracking-[0.37px]"
            style={{ color: appleWebColors.textPrimary }}
          >
            サイトマップ
          </h1>
          <p
            className="text-[17px] leading-[22px] tracking-[-0.43px]"
            style={{ color: appleWebColors.textSecondary }}
          >
            サプティアの全ページを一覧でご確認いただけます
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* メインページ */}
          <div
            className={`rounded-[16px] p-6 hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
          >
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${systemColors.blue}15` }}
              >
                <Info
                  className="w-5 h-5"
                  style={{ color: systemColors.blue }}
                />
              </div>
              <h2
                className="text-[17px] font-semibold leading-[22px] tracking-[-0.41px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                メインページ
              </h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  運営会社について
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/advisory"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  情報ソースと方針
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  提携パートナー
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  サイトマップ
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div
            className={`rounded-[16px] p-6 hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
          >
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${systemColors.green}15` }}
              >
                <Shield
                  className="w-5 h-5"
                  style={{ color: systemColors.green }}
                />
              </div>
              <h2
                className="text-[17px] font-semibold leading-[22px] tracking-[-0.41px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                法的情報
              </h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclosure"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  免責事項
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  Cookieポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* ヘルプ・サポート */}
          <div
            className={`rounded-[16px] p-6 hover:-translate-y-1 transition-all ${liquidGlassClasses.light}`}
          >
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${systemColors.purple}15` }}
              >
                <HelpCircle
                  className="w-5 h-5"
                  style={{ color: systemColors.purple }}
                />
              </div>
              <h2
                className="text-[17px] font-semibold leading-[22px] tracking-[-0.41px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                ヘルプ・サポート
              </h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  よくある質問（FAQ）
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  サプティアの使い方
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[15px] leading-[20px] tracking-[-0.24px] hover:opacity-60 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  お問い合わせフォーム
                </Link>
              </li>
            </ul>
          </div>

          {/* サプリメント検索（将来実装） */}
          <div
            className={`rounded-[16px] p-6 opacity-60 ${liquidGlassClasses.light}`}
          >
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Lightbulb
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
              </div>
              <h2
                className="text-[17px] font-semibold leading-[22px] tracking-[-0.41px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                サプリメント検索
              </h2>
            </div>
            <ul
              className="space-y-2 text-[13px] leading-[18px] tracking-[-0.08px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <li>製品一覧（実装予定）</li>
              <li>カテゴリ別検索（実装予定）</li>
              <li>目的別検索（実装予定）</li>
              <li>成分別検索（実装予定）</li>
              <li>ブランド別検索（実装予定）</li>
            </ul>
          </div>

          {/* レビュー・評価（将来実装） */}
          <div
            className={`rounded-[16px] p-6 opacity-60 ${liquidGlassClasses.light}`}
          >
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <Users
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
              </div>
              <h2
                className="text-[17px] font-semibold leading-[22px] tracking-[-0.41px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                レビュー・評価
              </h2>
            </div>
            <ul
              className="space-y-2 text-[13px] leading-[18px] tracking-[-0.08px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <li>製品レビュー（実装予定）</li>
              <li>ユーザー評価（実装予定）</li>
              <li>比較ツール（実装予定）</li>
            </ul>
          </div>

          {/* リソース（将来実装） */}
          <div
            className={`rounded-[16px] p-6 opacity-60 ${liquidGlassClasses.light}`}
          >
            <div className="flex items-center space-x-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <FileText
                  className="w-5 h-5"
                  style={{ color: appleWebColors.textSecondary }}
                />
              </div>
              <h2
                className="text-[17px] font-semibold leading-[22px] tracking-[-0.41px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                リソース
              </h2>
            </div>
            <ul
              className="space-y-2 text-[13px] leading-[18px] tracking-[-0.08px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <li>サプリメントガイド（実装予定）</li>
              <li>成分辞典（実装予定）</li>
              <li>ブログ記事（実装予定）</li>
              <li>研究論文リスト（実装予定）</li>
            </ul>
          </div>
        </div>

        {/* XMLサイトマップ */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}>
            <h2
              className="text-[22px] font-bold mb-4 leading-[28px] tracking-[0.35px]"
              style={{ color: appleWebColors.textPrimary }}
            >
              XMLサイトマップ
            </h2>
            <p
              className="text-[15px] leading-[20px] tracking-[-0.24px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              検索エンジン向けのXMLサイトマップは以下からアクセスできます：
            </p>
            <a
              href="/sitemap.xml"
              className="text-[13px] leading-[18px] tracking-[-0.08px] hover:opacity-60 transition-opacity"
              style={{
                color: systemColors.blue,
                fontFamily: monoFontStack,
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              /sitemap.xml
            </a>
          </div>
        </section>

        {/* ページ階層構造 */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2
            className="text-[22px] font-bold mb-6 leading-[28px] tracking-[0.35px]"
            style={{ color: appleWebColors.textPrimary }}
          >
            ページ階層構造
          </h2>
          <div
            className={`rounded-[20px] p-6 ${liquidGlassClasses.light}`}
            style={{
              fontFamily: monoFontStack,
            }}
          >
            <div
              className="space-y-1 text-[13px] leading-[18px] tracking-[-0.08px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <div>📁 / (ホーム)</div>
              <div className="ml-4">├─ 📄 /about (運営会社について)</div>
              <div className="ml-4">├─ 📄 /contact (お問い合わせ)</div>
              <div className="ml-4">├─ 📄 /advisory (情報ソースと方針)</div>
              <div className="ml-4">├─ 📄 /partners (提携パートナー)</div>
              <div className="ml-4">├─ 📄 /sitemap (サイトマップ)</div>
              <div className="ml-4">├─ 📄 /faq (FAQ)</div>
              <div className="ml-4">├─ 📄 /how-it-works (使い方)</div>
              <div className="ml-4">├─ 📁 /guide (ガイド)</div>
              <div className="ml-8">
                ├─ 📄 /guide/dangerous-ingredients (危険成分ガイド)
              </div>
              <div className="ml-8">
                ├─ 📄 /guide/supplement-safety (サプリメント安全ガイド)
              </div>
              <div className="ml-8">├─ 📄 /guide/purposes (目的別ガイド)</div>
              <div className="ml-8">
                └─ 📄 /guide/audiences (対象者別ガイド)
              </div>
              <div className="ml-4">└─ 📁 /legal (法的情報)</div>
              <div className="ml-8">├─ 📄 /legal/terms (利用規約)</div>
              <div className="ml-8">
                ├─ 📄 /legal/privacy (プライバシーポリシー)
              </div>
              <div className="ml-8">├─ 📄 /legal/disclosure (特定商取引法)</div>
              <div className="ml-8">├─ 📄 /legal/disclaimer (免責事項)</div>
              <div className="ml-8">└─ 📄 /legal/cookies (Cookieポリシー)</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
