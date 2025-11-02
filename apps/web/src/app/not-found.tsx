import { Metadata } from "next";
import Link from "next/link";
import { Search, Home, BookOpen, ShoppingBag, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "ページが見つかりません (404) - サプティア",
  description:
    "お探しのページは存在しないか、移動された可能性があります。サプティアのトップページから商品・成分検索をお試しください。",
  robots: "noindex,nofollow", // 404ページはインデックスしない
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* メインカード */}
        <div className="bg-white rounded-2xl shadow-lg border border-primary-200 p-8 md:p-12 text-center">
          {/* アイコン */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <AlertCircle className="text-primary" size={48} />
          </div>

          {/* タイトル */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            ページが見つかりません
          </h2>

          {/* 説明 */}
          <p className="text-primary-700 text-lg mb-8">
            お探しのページは存在しないか、移動・削除された可能性があります。
            <br />
            URLをご確認いただくか、以下のリンクからお探しください。
          </p>

          {/* アクションボタン */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home size={20} />
              ホームに戻る
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              <ShoppingBag size={20} />
              商品を探す
            </Link>
          </div>

          {/* その他のリンク */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/ingredients"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 text-primary-900 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <BookOpen size={18} />
              成分ガイドを見る
            </Link>
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 text-primary-900 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Search size={18} />
              診断を受ける
            </Link>
          </div>
        </div>

        {/* ヘルプテキスト */}
        <div className="mt-8 text-center">
          <p className="text-primary-600 text-sm">
            問題が解決しない場合は、
            <Link
              href="/contact"
              className="text-primary hover:text-primary-700 underline font-medium"
            >
              お問い合わせ
            </Link>
            ください。
          </p>
        </div>
      </div>
    </div>
  );
}
