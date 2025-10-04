import { Metadata } from "next";
import { Shield, TrendingUp, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "運営会社について - Suptia",
  description: "Suptiaの運営会社情報、ミッション、ビジョンについて。",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">運営会社について</h1>
        <p className="text-xl text-muted-foreground mb-12">
          科学的根拠に基づく、信頼できるサプリメント情報を提供します
        </p>
      </div>

      {/* ミッション・ビジョン */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">ミッション</h2>
            <p className="text-muted-foreground">
              誰もが科学的根拠に基づいた正確なサプリメント情報にアクセスでき、
              自分に最適な製品を見つけられる世界を実現する。
            </p>
          </div>
          <div className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">ビジョン</h2>
            <p className="text-muted-foreground">
              サプリメント選びの新しいスタンダードとなり、
              健康的なライフスタイルをサポートする信頼されるプラットフォームになる。
            </p>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Suptiaの特徴</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">科学的根拠</h3>
            <p className="text-sm text-muted-foreground">
              査読済み論文に基づく信頼性の高い情報のみを提供
            </p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">中立的な評価</h3>
            <p className="text-sm text-muted-foreground">
              広告主に依存しない、公平な製品評価システム
            </p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">ユーザー中心</h3>
            <p className="text-sm text-muted-foreground">
              ユーザーの健康目標達成を最優先に考えた設計
            </p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">透明性</h3>
            <p className="text-sm text-muted-foreground">
              データソース、評価基準、提携関係を完全公開
            </p>
          </div>
        </div>
      </section>

      {/* 会社情報 */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">会社情報</h2>
          <div className="border rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex border-b pb-4">
                <div className="font-semibold w-48">サービス名</div>
                <div>Suptia（サプティア）</div>
              </div>
              <div className="flex border-b pb-4">
                <div className="font-semibold w-48">運営者</div>
                <div>[運営者名・法人名]</div>
              </div>
              <div className="flex border-b pb-4">
                <div className="font-semibold w-48">代表者</div>
                <div>[代表者名]</div>
              </div>
              <div className="flex border-b pb-4">
                <div className="font-semibold w-48">所在地</div>
                <div>[所在地住所]</div>
              </div>
              <div className="flex border-b pb-4">
                <div className="font-semibold w-48">設立</div>
                <div>[設立年月日]</div>
              </div>
              <div className="flex border-b pb-4">
                <div className="font-semibold w-48">事業内容</div>
                <div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>サプリメント比較・検索サービスの運営</li>
                    <li>健康・栄養に関する情報提供</li>
                    <li>Webメディア事業</li>
                  </ul>
                </div>
              </div>
              <div className="flex">
                <div className="font-semibold w-48">お問い合わせ</div>
                <div>
                  <a href="/contact" className="text-primary hover:underline">
                    お問い合わせフォーム
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
              <p className="text-sm">
                <span className="font-semibold">⚠️ 注意:</span>[ ]
                内の情報は、実際の運営者情報に置き換える必要があります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 中立性・透明性 */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            中立性と透明性へのコミットメント
          </h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">
                独立した評価システム
              </h3>
              <p className="text-muted-foreground mb-3">
                Suptiaの製品評価は、以下の基準に基づいて行われます：
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>査読済み科学論文のエビデンス</li>
                <li>第三者機関による品質認証</li>
                <li>成分の含有量と生物学的利用能</li>
                <li>製造プロセスの透明性</li>
                <li>ユーザーレビューと評価</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                ※
                評価基準の詳細は、各製品ページの「信頼スコア」セクションをご確認ください。
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">アフィリエイト開示</h3>
              <p className="text-muted-foreground mb-3">
                当サイトは、以下のアフィリエイトプログラムに参加し、商品リンクから紹介料を得ています：
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Amazon アソシエイト</li>
                <li>楽天アフィリエイト</li>
                <li>iHerb アフィリエイト</li>
                <li>その他提携企業のプログラム</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                ただし、アフィリエイト収益の有無は製品評価に一切影響を与えません。
                すべての製品は同じ科学的基準で評価されます。
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">
                データソースの透明性
              </h3>
              <p className="text-muted-foreground mb-3">
                当サイトで使用するデータソース：
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>PubMed、Google Scholar等の学術データベース</li>
                <li>FDA、厚生労働省等の公的機関</li>
                <li>NSF、USP等の第三者認証機関</li>
                <li>製造元の公開情報</li>
                <li>ユーザー投稿データ</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">お問い合わせ</h2>
          <p className="text-muted-foreground mb-8">
            サービスに関するご質問、ご意見、ご要望がございましたら、お気軽にお問い合わせください。
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            お問い合わせフォームへ
          </a>
        </div>
      </section>
    </div>
  );
}
