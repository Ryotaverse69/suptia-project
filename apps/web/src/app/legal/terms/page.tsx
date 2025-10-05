import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 - サプティア",
  description: "サプティアサービスの利用規約です。",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">利用規約</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          最終更新日: {new Date().toLocaleDateString("ja-JP")}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第1条（適用）</h2>
          <p className="mb-4">
            本利用規約（以下「本規約」といいます）は、サプティア（以下「当サイト」といいます）が提供するサプリメント比較・検索サービス（以下「本サービス」といいます）の利用条件を定めるものです。
          </p>
          <p className="mb-4">
            利用者の皆様（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第2条（サービス内容）</h2>
          <p className="mb-4">本サービスは以下の機能を提供します：</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>サプリメント製品の比較・検索機能</li>
            <li>科学的根拠に基づく情報の提供</li>
            <li>ユーザーレビュー・評価の表示</li>
            <li>外部ECサイトへのリンク提供</li>
            <li>AI を活用したレコメンデーション機能</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第3条（免責事項）</h2>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
            <h3 className="font-semibold mb-2">⚠️ 重要な免責事項</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li className="font-semibold">
                医療・診断目的ではありません：本サービスは医療行為、診断、治療、予防を目的としたものではありません。
              </li>
              <li>
                医師への相談：サプリメントの使用を開始する前に、必ず医師または専門家にご相談ください。
              </li>
              <li>
                効果の保証なし：掲載情報は参考情報であり、医薬的効果を保証するものではありません。
              </li>
              <li>個人差：効果には個人差があります。</li>
            </ol>
          </div>
          <p className="mb-4">
            当サイトは、本サービスで提供する情報の正確性、完全性、有用性について、いかなる保証も行いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            第4条（外部サイトでの購入について）
          </h2>
          <p className="mb-4">
            本サービスは商品の販売を行っておりません。商品購入は外部ECサイト（Amazon、楽天市場、iHerb等）で行われます。
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>購入契約は各ECサイトとユーザー間で成立します</li>
            <li>配送、返品、カスタマーサポートは各ECサイトの責任範囲です</li>
            <li>当サイトは購入に関する一切の責任を負いません</li>
            <li>価格・在庫情報はリアルタイムではない場合があります</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第5条（禁止事項）</h2>
          <p className="mb-4">ユーザーは以下の行為を行ってはなりません：</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>虚偽または誤解を招く情報の投稿</li>
            <li>
              当サイトのサーバーまたはネットワークに過度な負荷をかける行為
            </li>
            <li>不正アクセス、クローリング、スクレイピング</li>
            <li>他のユーザーまたは第三者の権利を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>医療行為と誤認させるような行為</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第6条（知的財産権）</h2>
          <p className="mb-4">
            本サービスに含まれるコンテンツ（テキスト、画像、ロゴ、デザイン、データベース等）の知的財産権は、当サイトまたは正当な権利者に帰属します。
          </p>
          <p className="mb-4">
            ユーザーは、個人的な利用目的の範囲内でのみコンテンツを使用できます。無断での複製、転載、再配布は禁止します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            第7条（サービスの変更・中断・終了）
          </h2>
          <p className="mb-4">
            当サイトは、ユーザーへの事前通知なく、本サービスの内容を変更、中断、または終了することができます。
          </p>
          <p className="mb-4">
            これにより生じたいかなる損害についても、当サイトは責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            第8条（免責・損害賠償）
          </h2>
          <p className="mb-4">
            当サイトは、本サービスの利用により生じた以下の損害について、一切の責任を負いません：
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>直接的、間接的、特別、付随的、結果的損害</li>
            <li>データの消失または破損</li>
            <li>事業の中断</li>
            <li>逸失利益</li>
            <li>第三者からのクレーム</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            第9条（データの取り扱い）
          </h2>
          <p className="mb-4">
            ユーザーの個人情報およびアクセスデータの取り扱いについては、別途「プライバシーポリシー」をご確認ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第10条（規約の変更）</h2>
          <p className="mb-4">
            当サイトは、必要に応じて本規約を変更できるものとします。変更後の規約は、本サイト上に掲載した時点で効力を生じます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            第11条（準拠法・管轄裁判所）
          </h2>
          <p className="mb-4">
            本規約の解釈にあたっては、日本法を準拠法とします。
          </p>
          <p className="mb-4">
            本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            第12条（お問い合わせ）
          </h2>
          <p className="mb-4">
            本規約に関するお問い合わせは、お問い合わせフォームよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
