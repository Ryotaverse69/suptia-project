"use client";

import { useCookieConsent } from "@/contexts/CookieConsentContext";

export default function CookiesPage() {
  const { openSettings } = useCookieConsent();
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookieポリシー</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          最終更新日: {new Date().toLocaleDateString("ja-JP")}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Cookieとは</h2>
          <p className="mb-4">
            Cookieとは、ウェブサイトを訪問した際に、ブラウザに保存される小さなテキストファイルです。
            Cookieを使用することで、ウェブサイトはユーザーの訪問情報を記憶し、次回訪問時により良い体験を提供できます。
          </p>
          <p className="mb-4">
            当サイト（サプティア）では、サービスの改善、ユーザー体験の向上、サイト利用状況の分析のためにCookieを使用しています。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. 使用しているCookieの種類
          </h2>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                2.1 必須Cookie（Strictly Necessary Cookies）
              </h3>
              <div className="mb-4">
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded text-sm font-semibold mb-2">
                  常に有効
                </span>
              </div>
              <p className="mb-3">
                サイトの基本機能に必要不可欠なCookie。無効にするとサイトが正常に機能しません。
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>セッション管理</li>
                <li>セキュリティ・認証</li>
                <li>Cookie同意設定の記憶</li>
                <li>言語設定の保存</li>
              </ul>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>保持期間:</strong> セッション終了まで、または最大1年
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                2.2 分析Cookie（Analytics Cookies）
              </h3>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded text-sm font-semibold mb-2">
                  オプション
                </span>
              </div>
              <p className="mb-3">
                サイトの使用状況を分析し、サービス改善に役立てるためのCookie。
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-3">
                <li>ページビュー数の計測</li>
                <li>訪問者数の計測</li>
                <li>ユーザー行動の分析</li>
                <li>サイト内検索クエリの分析</li>
                <li>デバイス・ブラウザ情報の収集</li>
              </ul>
              <div className="bg-muted/50 rounded p-3 text-sm">
                <p className="font-semibold mb-1">使用サービス:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Google Analytics 4 (GA4)</li>
                  <li>その他アクセス解析ツール</li>
                </ul>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>保持期間:</strong> 最大2年
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                2.3 広告Cookie（Advertising Cookies）
              </h3>
              <div className="mb-4">
                <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded text-sm font-semibold mb-2">
                  オプション
                </span>
              </div>
              <p className="mb-3">
                ユーザーの興味・関心に基づいた広告配信、アフィリエイト成果の測定に使用するCookie。
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-3">
                <li>アフィリエイトトラッキング</li>
                <li>広告効果測定</li>
                <li>リターゲティング広告</li>
                <li>コンバージョン計測</li>
              </ul>
              <div className="bg-muted/50 rounded p-3 text-sm">
                <p className="font-semibold mb-1">使用サービス:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Amazon アソシエイト</li>
                  <li>楽天アフィリエイト</li>
                  <li>iHerb アフィリエイト</li>
                  <li>Google Ads</li>
                  <li>その他広告プラットフォーム</li>
                </ul>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>保持期間:</strong> 最大1年
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                2.4 機能Cookie（Functional Cookies）
              </h3>
              <div className="mb-4">
                <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded text-sm font-semibold mb-2">
                  オプション
                </span>
              </div>
              <p className="mb-3">
                ユーザー体験を向上させるためのCookie。無効にしても基本機能は使用できます。
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>表示設定の保存（ダークモード等）</li>
                <li>検索履歴の保存</li>
                <li>お気に入り商品の記憶</li>
                <li>レコメンデーションのパーソナライゼーション</li>
              </ul>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>保持期間:</strong> 最大1年
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 第三者Cookie</h2>
          <p className="mb-4">
            当サイトでは、第三者サービス（Google
            Analytics、アフィリエイトプログラム等）が設定するCookieも使用しています。
          </p>
          <p className="mb-4">
            これらのCookieは、各サービス提供者のプライバシーポリシーに従って管理されます：
          </p>
          <ul className="space-y-2 mb-4">
            <li>
              <a
                href="https://policies.google.com/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google プライバシーポリシー →
              </a>
            </li>
            <li>
              <a
                href="https://affiliate.amazon.co.jp/help/operating/agreement"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Amazon アソシエイト プログラム参加規約 →
              </a>
            </li>
            <li>
              <a
                href="https://affiliate.rakuten.co.jp/guides/rules/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                楽天アフィリエイト 規約 →
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Cookie設定の変更方法
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.1 当サイトでの設定
          </h3>
          <div className="border rounded-lg p-6 mb-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/20 dark:to-blue-950/20">
            <p className="mb-4">
              以下のボタンから、いつでもCookie設定を変更できます。
              <br />
              各種類のCookieを個別に有効・無効にすることができます。
            </p>
            <button
              onClick={openSettings}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg font-medium"
            >
              Cookie設定を変更する
            </button>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.2 ブラウザでの設定
          </h3>
          <p className="mb-4">各ブラウザの設定からCookieを管理できます：</p>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>Google Chrome:</strong> 設定 → プライバシーとセキュリティ
              → Cookie と他のサイトデータ
            </li>
            <li>
              <strong>Safari:</strong> 環境設定 → プライバシー → Cookie
              とウェブサイトのデータ
            </li>
            <li>
              <strong>Firefox:</strong> オプション → プライバシーとセキュリティ
              → Cookie とサイトデータ
            </li>
            <li>
              <strong>Microsoft Edge:</strong> 設定 →
              プライバシー、検索、サービス → Cookie
            </li>
          </ul>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm">
              ⚠️ <strong>注意:</strong>{" "}
              すべてのCookieをブロックすると、サイトの一部機能が正常に動作しない場合があります。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Do Not Track (DNT)</h2>
          <p className="mb-4">
            一部のブラウザには「Do Not Track（追跡拒否）」機能があります。
            当サイトは、この設定を尊重し、DNTが有効な場合は分析・広告Cookieを制限します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. モバイルアプリでの識別子
          </h2>
          <p className="mb-4">
            将来的にモバイルアプリを提供する場合、以下の識別子を使用する可能性があります：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>広告識別子（IDFA / AAID）</li>
            <li>デバイス識別子</li>
          </ul>
          <p className="mb-4">
            これらの識別子は、デバイス設定からオプトアウトできます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookieの保持期間</h2>
          <div className="border rounded-lg p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Cookie種類</th>
                  <th className="text-left py-2">保持期間</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">必須Cookie</td>
                  <td className="py-2">セッション終了まで または 最大1年</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">分析Cookie</td>
                  <td className="py-2">最大2年</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">広告Cookie</td>
                  <td className="py-2">最大1年</td>
                </tr>
                <tr>
                  <td className="py-2">機能Cookie</td>
                  <td className="py-2">最大1年</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. 子供のプライバシー</h2>
          <p className="mb-4">
            当サイトは13歳未満の子供を対象としていません。13歳未満の子供のCookie情報を故意に収集することはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Cookieポリシーの変更
          </h2>
          <p className="mb-4">
            当サイトは、必要に応じて本Cookieポリシーを変更することがあります。
            重要な変更がある場合は、サイト上で通知します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. お問い合わせ</h2>
          <p className="mb-4">
            Cookieの使用に関するご質問は、お問い合わせフォームよりご連絡ください。
          </p>
        </section>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2">📚 関連ポリシー</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/legal/privacy" className="text-primary hover:underline">
                プライバシーポリシー →
              </a>
            </li>
            <li>
              <a href="/legal/terms" className="text-primary hover:underline">
                利用規約 →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
