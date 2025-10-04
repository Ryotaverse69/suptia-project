import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 法的義務・コンプライアンス */}
          <div>
            <h3 className="font-bold text-lg mb-4">法的情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-foreground transition-colors"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclosure"
                  className="hover:text-foreground transition-colors"
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="hover:text-foreground transition-colors"
                >
                  免責事項
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Cookieポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* 会社情報・信頼性 */}
          <div>
            <h3 className="font-bold text-lg mb-4">運営情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  運営会社について
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/advisory"
                  className="hover:text-foreground transition-colors"
                >
                  研究・監修者情報
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="hover:text-foreground transition-colors"
                >
                  提携パートナー
                </Link>
              </li>
            </ul>
          </div>

          {/* サイト情報 */}
          <div>
            <h3 className="font-bold text-lg mb-4">サイト情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-foreground transition-colors"
                >
                  サイトマップ
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  よくある質問
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-foreground transition-colors"
                >
                  Suptiaの使い方
                </Link>
              </li>
            </ul>
          </div>

          {/* ブランド・説明 */}
          <div>
            <h3 className="font-bold text-lg mb-4">Suptia</h3>
            <p className="text-sm text-muted-foreground mb-4">
              科学的根拠に基づくサプリメント比較メタサーチ。
              あなたに最適なサプリメントを見つけるお手伝いをします。
            </p>
            <p className="text-xs text-muted-foreground">
              ※ 本サイトは医療・診断を目的としたものではありません
            </p>
          </div>
        </div>

        {/* アフィリエイト開示 */}
        <div className="border-t pt-6 mb-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
              アフィリエイトプログラムについて
            </h4>
            <p className="text-xs text-muted-foreground">
              当サイトは、Amazon.co.jp、楽天市場、iHerb、その他提携企業のアフィリエイトプログラムに参加しています。
              商品リンクを経由して購入された場合、当サイトは紹介料を受け取ることがあります。
              これにより商品価格が変わることはありません。
              また、レビューや評価は紹介料の有無に関わらず、科学的根拠と中立性を保持して提供しています。
            </p>
          </div>
        </div>

        {/* Cookie同意設定リンク */}
        <div className="border-t pt-6 mb-6">
          <button
            onClick={() => {
              // Cookie同意マネージャーを開く処理（後で実装）
              console.log("Open cookie consent manager");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Cookie設定を変更する
          </button>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Suptia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
