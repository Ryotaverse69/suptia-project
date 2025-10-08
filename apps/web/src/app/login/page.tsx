import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ログイン | サプティア",
  description:
    "サプティアにログインして、パーソナライズされたサプリメント推奨を受け取りましょう。",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary-900">
              ログイン
            </h1>

            <div className="space-y-6">
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">ログイン機能は現在開発中です。</p>
                <p className="text-sm">
                  近日中にご利用いただけるようになります。
                </p>
              </div>

              <div className="border-t pt-6">
                <Link
                  href="/"
                  className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
