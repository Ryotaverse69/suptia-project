import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - サプティア",
  description: "特定商取引法に基づく事業者情報の表記です。",
};

export default function DisclosurePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">特定商取引法に基づく表記</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">最終更新日: 2025年10月30日</p>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <p className="font-semibold mb-2">📢 重要なお知らせ</p>
          <p className="text-sm">
            当サイトは商品の直接販売を行っておりません。商品の購入は外部ECサイト（Amazon、楽天市場、iHerb等）で行われます。
            商品購入に関する契約は、各ECサイトとお客様の間で成立します。
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">サービス提供者</h2>
          <div className="border rounded-lg p-6 space-y-3">
            <div className="flex">
              <div className="font-semibold w-48">サービス名称</div>
              <div>サプティア (Suptia)</div>
            </div>
            <div className="flex">
              <div className="font-semibold w-48">運営形態</div>
              <div>個人事業主</div>
            </div>
            <div className="flex">
              <div className="font-semibold w-48">運営責任者</div>
              <div>長谷川　亮太</div>
            </div>
            <div className="flex">
              <div className="font-semibold w-48">所在地</div>
              <div>請求があり次第遅滞なく開示します</div>
            </div>
            <div className="flex">
              <div className="font-semibold w-48">電話番号</div>
              <div>請求があり次第遅滞なく開示します</div>
            </div>
            <div className="flex">
              <div className="font-semibold w-48">メールアドレス</div>
              <div>info@suptia.com</div>
            </div>
            <div className="flex">
              <div className="font-semibold w-48">URL</div>
              <div>https://suptia.com</div>
            </div>
          </div>
          <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📍</div>
              <div>
                <p className="font-bold text-lg mb-2 text-amber-900 dark:text-amber-100">
                  所在地・電話番号の開示について
                </p>
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                  特定商取引法に基づき、所在地および電話番号については、ご請求があり次第遅滞なく開示いたします。
                  開示をご希望の場合は、上記メールアドレス（
                  <span className="font-semibold">info@suptia.com</span>
                  ）までお問い合わせください。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">サービス内容</h2>
          <div className="border rounded-lg p-6">
            <ul className="list-disc list-inside space-y-2">
              <li>サプリメント製品の比較・検索サービスの提供</li>
              <li>科学的根拠に基づく情報の提供</li>
              <li>ユーザーレビュー・評価情報の提供</li>
              <li>外部ECサイトへのリンク提供</li>
              <li>AIを活用したレコメンデーション機能</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              ※
              当サイトは商品の販売を行っておりません。商品の購入は外部ECサイトで行われます。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">サービス利用料金</h2>
          <div className="border rounded-lg p-6">
            <p className="font-semibold mb-2">無料</p>
            <p className="text-sm text-muted-foreground">
              当サイトのサービスは無料でご利用いただけます。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">お支払い方法</h2>
          <div className="border rounded-lg p-6">
            <p className="text-sm text-muted-foreground">
              当サイトでは商品の販売を行っていないため、お支払いは発生しません。
              外部ECサイトでの商品購入時のお支払い方法については、各ECサイトの規約をご確認ください。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">商品の引渡し時期</h2>
          <div className="border rounded-lg p-6">
            <p className="text-sm text-muted-foreground">
              該当なし（当サイトは商品の販売・配送を行っておりません）
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            返品・交換・キャンセル
          </h2>
          <div className="border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-4">
              該当なし（当サイトは商品の販売を行っておりません）
            </p>
            <p className="text-sm text-muted-foreground">
              外部ECサイトで購入された商品の返品・交換・キャンセルについては、各ECサイトの規約に従ってください。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            アフィリエイトプログラムについて
          </h2>
          <div className="border rounded-lg p-6">
            <p className="mb-4">
              当サイトは、以下のアフィリエイトプログラムに参加しています：
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Amazonアソシエイトプログラム</li>
              <li>楽天アフィリエイト</li>
              <li>iHerb アフィリエイトプログラム</li>
              <li>その他提携企業のアフィリエイトプログラム</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              当サイトのリンクを経由して商品が購入された場合、当サイトは各アフィリエイトプログラムから紹介料を受け取ることがあります。
              これにより商品価格が変わることはありません。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">免責事項</h2>
          <div className="border rounded-lg p-6">
            <ul className="list-disc list-inside space-y-2">
              <li>当サイトは商品の販売を行っておりません</li>
              <li>
                商品購入に関する契約は、各ECサイトとお客様の間で成立します
              </li>
              <li>配送、返品、カスタマーサポートは各ECサイトの責任範囲です</li>
              <li>
                当サイトは外部ECサイトでの取引に関する一切の責任を負いません
              </li>
              <li>価格・在庫情報はリアルタイムではない場合があります</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">お問い合わせ</h2>
          <div className="border rounded-lg p-6">
            <p className="mb-4">
              サービスに関するお問い合わせは、以下の方法でご連絡ください：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                お問い合わせフォーム:{" "}
                <a href="/contact" className="text-primary hover:underline">
                  こちら
                </a>
              </li>
              <li>メールアドレス: info@suptia.com</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              ※ お問い合わせへの回答には数日かかる場合があります。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
