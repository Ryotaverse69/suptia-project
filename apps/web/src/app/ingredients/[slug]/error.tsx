"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをコンソールに記録
    console.error("成分ページエラー:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* エラーカード */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="text-red-600" size={48} />
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-primary-900 mb-3">
            ページの読み込みに失敗しました
          </h1>

          {/* 説明 */}
          <p className="text-primary-700 mb-6">
            成分情報の取得中に問題が発生しました。
            <br />
            お手数ですが、もう一度お試しください。
          </p>

          {/* エラー詳細（開発環境のみ） */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
              <p className="text-xs font-mono text-gray-700 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* アクションボタン */}
          <div className="space-y-3">
            {/* 再試行ボタン */}
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              もう一度試す
            </button>

            {/* 成分ガイド一覧へ */}
            <Link
              href="/ingredients"
              className="w-full px-6 py-3 bg-primary-100 text-primary rounded-lg hover:bg-primary-200 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              成分ガイド一覧へ
            </Link>

            {/* ホームへ */}
            <Link
              href="/"
              className="w-full px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Home size={20} />
              ホームに戻る
            </Link>
          </div>
        </div>

        {/* サポート情報 */}
        <p className="text-center text-sm text-primary-600 mt-6">
          問題が解決しない場合は、
          <Link href="/contact" className="text-primary hover:underline ml-1">
            お問い合わせ
          </Link>
          ください。
        </p>
      </div>
    </div>
  );
}
