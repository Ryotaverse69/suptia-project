import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー - サプティア",
  description: "サプティアの個人情報保護方針です。",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">プライバシーポリシー</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">最終更新日: 2025年10月30日</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. 基本方針</h2>
          <p className="mb-4">
            サプティア（以下「当サイト」といいます）は、ユーザーの個人情報の重要性を認識し、個人情報保護法その他の関連法令を遵守し、適切に取り扱います。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.1 自動的に収集される情報
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>IPアドレス</li>
            <li>ブラウザの種類・バージョン</li>
            <li>オペレーティングシステム</li>
            <li>アクセス日時</li>
            <li>参照元URL</li>
            <li>閲覧ページ</li>
            <li>デバイス情報（画面サイズ、デバイスタイプ等）</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.2 ユーザーが提供する情報
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              お問い合わせフォームに入力された情報（氏名、メールアドレス、お問い合わせ内容）
            </li>
            <li>レビュー・評価の投稿内容（任意）</li>
            <li>検索クエリ</li>
            <li>ユーザー設定（言語、表示設定等）</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.3 Cookie・類似技術により収集される情報
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>セッションID</li>
            <li>ユーザー識別子</li>
            <li>サイト利用状況</li>
            <li>広告効果測定データ</li>
            <li>アフィリエイトトラッキングデータ</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 情報の利用目的</h2>
          <p className="mb-4">収集した情報は、以下の目的で利用します：</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザーサポート・お問い合わせ対応</li>
            <li>ユーザー体験のパーソナライゼーション</li>
            <li>AIレコメンデーション機能の提供</li>
            <li>サイト利用状況の分析・統計</li>
            <li>不正利用の防止・セキュリティ対策</li>
            <li>マーケティング・広告配信の最適化</li>
            <li>法令遵守・紛争解決</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Cookieの使用について
          </h2>
          <p className="mb-4">
            当サイトでは、ユーザー体験の向上、サイト利用状況の分析、広告配信のために、Cookie及び類似技術を使用しています。
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.1 使用しているCookie
          </h3>
          <div className="space-y-4 mb-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">必須Cookie</h4>
              <p className="text-sm text-muted-foreground">
                サイトの基本機能（セッション管理、セキュリティ）に必要なCookie。無効にするとサイトが正常に機能しません。
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">分析Cookie</h4>
              <p className="text-sm text-muted-foreground">
                Google
                Analytics等を使用したアクセス解析Cookie。サイト改善のために利用します。
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">広告Cookie</h4>
              <p className="text-sm text-muted-foreground">
                アフィリエイトプログラム、リターゲティング広告のためのCookie。
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">機能Cookie</h4>
              <p className="text-sm text-muted-foreground">
                ユーザー設定の保存、パーソナライゼーションのためのCookie。
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.2 Cookie設定の変更
          </h3>
          <p className="mb-4">
            ブラウザの設定からCookieを無効化できます。また、フッターの「Cookie設定を変更する」リンクから、Cookie同意設定を変更できます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. 第三者サービスの利用
          </h2>
          <p className="mb-4">
            当サイトは以下の第三者サービスを利用しています：
          </p>

          <div className="space-y-4 mb-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Google Analytics</h4>
              <p className="text-sm text-muted-foreground mb-2">
                アクセス解析のために使用。Googleのプライバシーポリシーに準拠します。
              </p>
              <a
                href="https://policies.google.com/privacy"
                className="text-sm text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Googleプライバシーポリシー →
              </a>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">アフィリエイトプログラム</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Amazon
                アソシエイト、楽天アフィリエイト、iHerb等のトラッキングCookieを使用します。
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">CDN・ホスティング</h4>
              <p className="text-sm text-muted-foreground">
                Vercel、その他CDNサービスを使用。各サービスのプライバシーポリシーに準拠します。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. 情報の第三者提供</h2>
          <p className="mb-4">
            当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護に必要な場合</li>
            <li>
              公衆衛生の向上または児童の健全な育成の推進に特に必要がある場合
            </li>
            <li>国の機関等への協力が必要な場合</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. AIレコメンデーション・データ処理
          </h2>
          <p className="mb-4">
            当サイトは、ユーザー体験向上のためAI技術を使用しています：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>閲覧履歴、検索履歴に基づくレコメンデーション</li>
            <li>匿名化された統計データの機械学習への利用</li>
            <li>個人を特定できない形での学習データ利用</li>
          </ul>
          <p className="mb-4">
            AIモデルのトレーニングには、個人を特定できる情報は使用しません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. データの保管・セキュリティ
          </h2>
          <p className="mb-4">
            当サイトは、個人情報を適切に管理し、以下の対策を講じています：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>SSL/TLS暗号化通信の使用</li>
            <li>アクセス制限・認証システム</li>
            <li>定期的なセキュリティ監査</li>
            <li>不正アクセス対策</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. ユーザーの権利</h2>
          <p className="mb-4">ユーザーは以下の権利を有します：</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>個人情報の開示請求</li>
            <li>個人情報の訂正・追加・削除請求</li>
            <li>個人情報の利用停止・消去請求</li>
            <li>第三者提供の停止請求</li>
          </ol>
          <p className="mb-4">
            これらの請求は、お問い合わせフォームよりご連絡ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. 子供のプライバシー
          </h2>
          <p className="mb-4">
            本サービスは13歳未満の子供を対象としていません。13歳未満の子供の個人情報を故意に収集することはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            11. プライバシーポリシーの変更
          </h2>
          <p className="mb-4">
            当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のポリシーは、本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. お問い合わせ</h2>
          <p className="mb-4">
            個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
