import { Metadata } from "next";
import { ExternalLink, ShoppingCart, TrendingUp, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "提携パートナー - サプティア",
  description:
    "サプティアが提携するAmazon、楽天市場、Yahoo!ショッピングなどのECサイトと、アフィリエイトプログラムについて詳しくご紹介。信頼性の高いパートナーから最適なサプリメントを見つけます。",
};

export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">提携パートナー</h1>
        <p className="text-xl text-muted-foreground">
          サプティアが提携しているECサイト・サービスのご紹介
        </p>
      </div>

      {/* アフィリエイト開示 */}
      <section className="mb-16">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="font-bold text-lg mb-3">
            📢 アフィリエイトプログラムについて
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            当サイトは、以下の提携パートナーのアフィリエイトプログラムに参加しています。
            商品リンクを経由して購入された場合、当サイトは各プログラムから紹介料を受け取ることがあります。
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>価格への影響なし:</strong>{" "}
                アフィリエイトリンク経由でも、商品価格は変わりません
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>中立的な評価:</strong>{" "}
                紹介料の有無は製品評価に一切影響しません
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 主要提携パートナー */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">主要提携パートナー</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Amazon */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Amazon.co.jp</h3>
                  <p className="text-sm text-muted-foreground">
                    Amazonアソシエイト
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              日本最大級のECサイト。幅広いサプリメント製品を取り扱い、迅速な配送と充実したカスタマーサポートが特徴。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>Prime会員は送料無料</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>豊富な製品ラインナップ</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>ユーザーレビューが充実</span>
              </div>
            </div>
          </div>

          {/* 楽天市場 */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">楽天市場</h3>
                  <p className="text-sm text-muted-foreground">
                    楽天アフィリエイト
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              日本最大級のオンラインショッピングモール。楽天ポイントが貯まり、セール時にはお得に購入可能。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>楽天ポイントが貯まる・使える</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>定期的なセール・キャンペーン</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>多様なショップから選択可能</span>
              </div>
            </div>
          </div>

          {/* iHerb */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">iHerb</h3>
                  <p className="text-sm text-muted-foreground">
                    iHerbアフィリエイト
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              世界最大級のサプリメント専門ECサイト。高品質な製品を手頃な価格で提供し、日本語サポートも充実。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>海外製品の豊富な品揃え</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>リーズナブルな価格設定</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>日本への配送に対応</span>
              </div>
            </div>
          </div>

          {/* その他パートナー（プレースホルダー） */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">その他提携サイト</h3>
                  <p className="text-sm text-muted-foreground">
                    各種アフィリエイト
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              その他、専門サプリメントストア、ドラッグストアEC、海外製品輸入サイト等と順次提携を拡大しています。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>専門ストアとの提携</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>ニッチ製品の取り扱い</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">✓</span>
                <span>定期購入オプション</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 提携方針 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">提携パートナー選定基準</h2>
        <p className="text-muted-foreground mb-6">
          サプティアは、ユーザーに最適な購入体験を提供するため、以下の基準でパートナーを選定しています：
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">信頼性・安全性</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ 運営実績が豊富</li>
              <li>✓ セキュアな決済システム</li>
              <li>✓ 適切な個人情報保護</li>
              <li>✓ 法令遵守体制の整備</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">製品品質</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ 正規品の取り扱い</li>
              <li>✓ 適切な品質管理</li>
              <li>✓ 第三者認証製品の充実</li>
              <li>✓ 製品情報の透明性</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">ユーザー体験</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ 使いやすいUI/UX</li>
              <li>✓ 迅速な配送</li>
              <li>✓ 充実したカスタマーサポート</li>
              <li>✓ 柔軟な返品・交換ポリシー</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">価格競争力</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ 適正な価格設定</li>
              <li>✓ 定期的なセール・キャンペーン</li>
              <li>✓ 送料の明確性</li>
              <li>✓ ポイント・割引制度</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 価格比較について */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">価格比較機能について</h2>
        <div className="border rounded-lg p-6">
          <p className="mb-4">
            サプティアは、複数の提携ECサイトから価格情報を収集し、ユーザーが最適な購入先を選択できるようサポートしています。
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-semibold mb-2">価格表示に関する注意事項:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>価格情報はリアルタイムではない場合があります</li>
              <li>送料、税金は別途かかる場合があります</li>
              <li>セール・キャンペーン価格は期間限定の場合があります</li>
              <li>実際の価格は各ECサイトでご確認ください</li>
              <li>為替レートの変動により、海外サイトの価格は変動します</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 新規パートナー募集 */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">提携パートナー募集中</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            サプリメント関連のEC事業者、製造・販売事業者の方で、サプティアとの提携にご興味がある場合は、お気軽にお問い合わせください。
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            提携について問い合わせる
          </a>
        </div>
      </section>

      {/* 免責事項 */}
      <section>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">免責事項</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • 商品購入に関する契約は、各ECサイトとユーザー間で成立します
            </li>
            <li>• 当サイトは購入契約の当事者ではありません</li>
            <li>• 配送、返品、カスタマーサポートは各ECサイトの責任範囲です</li>
            <li>
              • 各ECサイトの利用規約・プライバシーポリシーをご確認ください
            </li>
            <li>• アフィリエイト収益の有無は製品評価に一切影響を与えません</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
