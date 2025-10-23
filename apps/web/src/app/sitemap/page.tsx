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

export const metadata: Metadata = {
  title: "サイトマップ - サプティア",
  description:
    "サプティアの全ページを一覧でご確認いただけます。商品一覧、成分ガイド、使い方、会社情報、法的情報など、サイト内のすべてのコンテンツへのリンク集です。",
};

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">サイトマップ</h1>
        <p className="text-xl text-muted-foreground">
          サプティアの全ページを一覧でご確認いただけます
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* メインページ */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">メインページ</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-primary hover:underline">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-primary hover:underline">
                運営会社について
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline">
                お問い合わせ
              </Link>
            </li>
            <li>
              <Link href="/advisory" className="text-primary hover:underline">
                研究・監修者情報
              </Link>
            </li>
            <li>
              <Link href="/partners" className="text-primary hover:underline">
                提携パートナー
              </Link>
            </li>
            <li>
              <Link href="/sitemap" className="text-primary hover:underline">
                サイトマップ
              </Link>
            </li>
          </ul>
        </div>

        {/* 法的情報 */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">法的情報</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/legal/terms"
                className="text-primary hover:underline"
              >
                利用規約
              </Link>
            </li>
            <li>
              <Link
                href="/legal/privacy"
                className="text-primary hover:underline"
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href="/legal/disclosure"
                className="text-primary hover:underline"
              >
                特定商取引法に基づく表記
              </Link>
            </li>
            <li>
              <Link
                href="/legal/disclaimer"
                className="text-primary hover:underline"
              >
                免責事項
              </Link>
            </li>
            <li>
              <Link
                href="/legal/cookies"
                className="text-primary hover:underline"
              >
                Cookieポリシー
              </Link>
            </li>
          </ul>
        </div>

        {/* ヘルプ・サポート */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">ヘルプ・サポート</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/faq" className="text-primary hover:underline">
                よくある質問（FAQ）
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="text-primary hover:underline"
              >
                サプティアの使い方
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline">
                お問い合わせフォーム
              </Link>
            </li>
          </ul>
        </div>

        {/* サプリメント検索（将来実装） */}
        <div className="border rounded-lg p-6 opacity-60">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">サプリメント検索</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>製品一覧（実装予定）</li>
            <li>カテゴリ別検索（実装予定）</li>
            <li>目的別検索（実装予定）</li>
            <li>成分別検索（実装予定）</li>
            <li>ブランド別検索（実装予定）</li>
          </ul>
        </div>

        {/* レビュー・評価（将来実装） */}
        <div className="border rounded-lg p-6 opacity-60">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">レビュー・評価</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>製品レビュー（実装予定）</li>
            <li>ユーザー評価（実装予定）</li>
            <li>専門家レビュー（実装予定）</li>
            <li>比較ツール（実装予定）</li>
          </ul>
        </div>

        {/* リソース（将来実装） */}
        <div className="border rounded-lg p-6 opacity-60">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">リソース</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>サプリメントガイド（実装予定）</li>
            <li>成分辞典（実装予定）</li>
            <li>ブログ記事（実装予定）</li>
            <li>研究論文リスト（実装予定）</li>
          </ul>
        </div>
      </div>

      {/* XMLサイトマップ */}
      <section className="mt-16 max-w-4xl mx-auto">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">XMLサイトマップ</h2>
          <p className="text-muted-foreground mb-4">
            検索エンジン向けのXMLサイトマップは以下からアクセスできます：
          </p>
          <a
            href="/sitemap.xml"
            className="text-primary hover:underline font-mono text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            /sitemap.xml
          </a>
        </div>
      </section>

      {/* ページ階層構造 */}
      <section className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">ページ階層構造</h2>
        <div className="border rounded-lg p-6 font-mono text-sm">
          <div className="space-y-1 text-muted-foreground">
            <div>📁 / (ホーム)</div>
            <div className="ml-4">├─ 📄 /about (運営会社について)</div>
            <div className="ml-4">├─ 📄 /contact (お問い合わせ)</div>
            <div className="ml-4">├─ 📄 /advisory (研究・監修者情報)</div>
            <div className="ml-4">├─ 📄 /partners (提携パートナー)</div>
            <div className="ml-4">├─ 📄 /sitemap (サイトマップ)</div>
            <div className="ml-4">├─ 📄 /faq (FAQ)</div>
            <div className="ml-4">├─ 📄 /how-it-works (使い方)</div>
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
  );
}
