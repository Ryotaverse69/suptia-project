import { Metadata } from "next";

export const metadata: Metadata = {
  title: "アフィリエイト開示 - サプティア",
  description:
    "サプティアのアフィリエイトプログラム参加および収益開示に関する情報です。",
};

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">アフィリエイト開示</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          最終更新日: {new Date().toLocaleDateString("ja-JP")}
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-3">📢 透明性の原則</h3>
          <p className="mb-4">
            サプティアは、ユーザーの皆様に対して透明性を保つことを最優先としています。
            当サイトがどのように運営され、収益を得ているかを明確にお伝えします。
          </p>
          <ul className="space-y-2 text-sm">
            <li>✓ アフィリエイト参加について正直に開示します</li>
            <li>✓ 中立的な評価・レビューを維持します</li>
            <li>✓ 商品価格に影響はありません</li>
            <li>✓ 科学的根拠に基づく情報提供を行います</li>
          </ul>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. アフィリエイトプログラムとは
          </h2>
          <p className="mb-4">
            アフィリエイトプログラムとは、当サイトが商品リンクを通じて紹介した商品が購入された場合、販売元のECサイトから紹介料を受け取る仕組みです。
          </p>
          <p className="mb-4">
            これはインターネット上で広く利用されている一般的なビジネスモデルであり、多くの比較サイトやレビューサイトが採用しています。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. 参加しているアフィリエイトプログラム
          </h2>
          <p className="mb-4">
            サプティアは、以下の企業・サービスのアフィリエイトプログラムに参加しています：
          </p>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Amazon.co.jp</h3>
              <p className="text-sm text-muted-foreground">
                Amazonアソシエイト・プログラムに参加しています。当サイトからAmazon.co.jpへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">楽天市場</h3>
              <p className="text-sm text-muted-foreground">
                楽天アフィリエイトに参加しています。当サイトから楽天市場へのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Yahoo!ショッピング</h3>
              <p className="text-sm text-muted-foreground">
                Yahoo!ショッピングのアフィリエイトプログラムに参加しています。当サイトからYahoo!ショッピングへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">iHerb</h3>
              <p className="text-sm text-muted-foreground">
                iHerbのアフィリエイトプログラムに参加しています。当サイトからiHerbへのリンクを経由して商品が購入された場合、紹介料を受け取ることがあります。
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">その他の提携企業</h3>
              <p className="text-sm text-muted-foreground">
                上記以外にも、サプリメント・健康食品関連のECサイトや企業のアフィリエイトプログラムに参加する場合があります。新たな提携が発生した場合は、本ページを更新してお知らせします。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. 価格への影響について
          </h2>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-4">
            <p className="font-semibold mb-2">
              💰 アフィリエイトリンクを経由しても、商品価格は変わりません
            </p>
            <p className="text-sm">
              当サイトのリンクを経由して購入された場合でも、直接ECサイトで購入した場合でも、商品の価格は同じです。
              購入者が追加料金を支払うことはありません。紹介料は販売元のECサイトから支払われます。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. 中立性と透明性の維持
          </h2>
          <p className="mb-4">
            サプティアは、アフィリエイト収益の有無に関わらず、以下の原則に基づいて運営しています：
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.1 科学的根拠に基づく評価
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              商品の評価やランキングは、科学的エビデンス、成分含有量、価格、安全性などの客観的な基準に基づいています
            </li>
            <li>
              アフィリエイト報酬の高低によって評価を変えることはありません
            </li>
            <li>信頼できる研究論文や公的機関のデータを参照しています</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.2 正直なレビュー
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>商品の長所だけでなく、短所や注意点も正直に記載します</li>
            <li>誇大広告や根拠のない効果効能の記載は行いません</li>
            <li>薬機法を遵守し、適切な表現で情報提供を行います</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.3 複数の選択肢の提示
          </h3>
          <p className="mb-4">
            可能な限り複数のECサイトでの価格比較を提供し、ユーザーが最もお得な選択肢を見つけられるようサポートします。
          </p>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="font-semibold mb-2">📊 価格比較の表示順について</p>
            <p className="text-sm">
              商品詳細ページの価格比較では、アフィリエイト報酬額に関係なく、
              <strong>常に最安値を最上位に表示</strong>
              します。顧客利益を最優先し、公平かつ透明性のある価格比較を提供します。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 収益の使途</h2>
          <p className="mb-4">
            アフィリエイト収益は、以下の目的でサプティアの運営に使用されます：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>サーバー運用費・インフラコスト</li>
            <li>科学的研究論文へのアクセス費用</li>
            <li>サイト機能の改善・開発</li>
            <li>コンテンツの品質向上</li>
            <li>データベースの更新・維持</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. ユーザーの選択の自由
          </h2>
          <p className="mb-4">
            当サイトのリンクを使用するかどうかは、完全にユーザーの自由です。
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>直接ECサイトを訪問して購入することも可能です</li>
            <li>他の比較サイトと比較検討することをお勧めします</li>
            <li>
              当サイトの情報を参考にしつつ、最終的な購入判断はご自身で行ってください
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. 広告表示について</h2>
          <p className="mb-4">
            当サイトでは、以下のような広告が表示される場合があります：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              ディスプレイ広告（Google AdSense等のサードパーティ広告サービス）
            </li>
            <li>スポンサード記事（明確に「PR」「広告」と表示されます）</li>
            <li>バナー広告</li>
          </ul>
          <p className="mb-4 text-sm text-muted-foreground">
            ※
            通常のコンテンツと広告を明確に区別し、ユーザーが誤解しないよう配慮しています。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. 法令遵守とガイドライン
          </h2>
          <p className="mb-4">
            サプティアは、以下の法令・ガイドラインを遵守しています：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>消費者庁「ステルスマーケティング規制」</li>
            <li>景品表示法</li>
            <li>
              薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）
            </li>
            <li>特定商取引法</li>
            <li>各アフィリエイトプログラムの利用規約</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. 開示の更新</h2>
          <p className="mb-4">
            本開示内容は、新たな提携企業の追加やプログラムの変更に応じて更新されます。
            重要な変更があった場合は、本ページに反映し、必要に応じてサイト内でお知らせします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. お問い合わせ</h2>
          <p className="mb-4">
            アフィリエイト開示に関するご質問やご意見がございましたら、お気軽にお問い合わせください。
          </p>
          <div className="border rounded-lg p-4">
            <p className="text-sm">
              お問い合わせ先:{" "}
              <a href="/contact" className="text-primary hover:underline">
                お問い合わせフォーム
              </a>
            </p>
          </div>
        </section>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2">最後に</h3>
          <p className="text-sm">
            サプティアは、ユーザーの皆様に信頼していただけるサービスを目指しています。
            アフィリエイト収益はサイト運営の重要な資金源ですが、それが情報の中立性や質を損なうことは決してありません。
            科学的根拠に基づく正確な情報提供と、透明性のある運営を今後も継続してまいります。
          </p>
        </div>
      </div>
    </div>
  );
}
