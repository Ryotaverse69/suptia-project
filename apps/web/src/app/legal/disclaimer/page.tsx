import { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項 - Suptia",
  description: "Suptiaの免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">免責事項</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          最終更新日: {new Date().toLocaleDateString("ja-JP")}
        </p>

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-3">⚠️ 重要な免責事項</h3>
          <p className="font-semibold mb-4">
            Suptiaは医療・診断・治療・予防を目的としたサービスではありません。
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              ✓ サプリメントの使用前に必ず医師または専門家にご相談ください
            </li>
            <li>
              ✓ 本サイトの情報は参考情報であり、医学的アドバイスではありません
            </li>
            <li>✓ 効果には個人差があり、結果を保証するものではありません</li>
            <li>✓ 既往症・服薬中の方は特に注意が必要です</li>
          </ul>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. 情報の正確性について
          </h2>
          <p className="mb-4">
            当サイトは、掲載する情報の正確性・完全性・有用性について最善の努力を払っていますが、以下の点についていかなる保証も行いません：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>掲載情報の正確性、最新性、完全性</li>
            <li>科学的研究結果の解釈</li>
            <li>製品情報の正確性（成分、含有量、価格等）</li>
            <li>外部リンク先の情報</li>
            <li>ユーザー投稿コンテンツ（レビュー、評価等）</li>
          </ul>
          <p className="mb-4">
            情報は予告なく変更される場合があります。重要な判断をする際は、必ず公式情報源や専門家にご確認ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. 医療・健康に関する免責
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.1 医療行為ではありません
          </h3>
          <p className="mb-4">
            本サイトで提供する情報は、以下の目的ではありません：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>疾病の診断</li>
            <li>治療方法の提案</li>
            <li>医薬品の処方</li>
            <li>医療行為の代替</li>
            <li>健康状態の評価</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.2 専門家への相談義務
          </h3>
          <p className="mb-4">
            以下の場合は、必ず医師または専門家にご相談ください：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>新しいサプリメントを開始する前</li>
            <li>既往症がある場合</li>
            <li>処方薬を服用中の場合</li>
            <li>妊娠中・授乳中の場合</li>
            <li>アレルギー体質の場合</li>
            <li>手術予定がある場合</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.3 効果の保証なし
          </h3>
          <div className="border rounded-lg p-6 mb-4">
            <p className="mb-2">当サイトは以下を保証しません：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>サプリメントの効果・効能</li>
              <li>特定の健康状態の改善</li>
              <li>疾病の予防・治療効果</li>
              <li>体質改善の結果</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              効果には個人差があります。同じサプリメントでも、人によって結果は異なります。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. 外部ECサイトでの購入について
          </h2>
          <p className="mb-4">
            当サイトは商品の販売を行っておりません。商品購入は外部ECサイトで行われます。
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.1 購入契約</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>購入契約は各ECサイトとユーザー間で成立します</li>
            <li>当サイトは契約当事者ではありません</li>
            <li>取引条件は各ECサイトの規約に従います</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            3.2 責任範囲の限定
          </h3>
          <p className="mb-4">
            以下について、当サイトは一切の責任を負いません：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>商品の品質、安全性、適合性</li>
            <li>配送の遅延、紛失、破損</li>
            <li>返品、交換、返金</li>
            <li>カスタマーサポート</li>
            <li>ECサイトとのトラブル</li>
            <li>決済トラブル</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            3.3 価格・在庫情報
          </h3>
          <div className="border rounded-lg p-6 mb-4">
            <p className="mb-2">価格・在庫情報について：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>表示価格はリアルタイムではない場合があります</li>
              <li>実際の価格は各ECサイトでご確認ください</li>
              <li>在庫状況は変動する可能性があります</li>
              <li>為替レート、送料、税金は別途かかる場合があります</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. AIレコメンデーション・データ分析
          </h2>
          <p className="mb-4">
            当サイトはAI技術を使用していますが、以下の点にご留意ください：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>AIの提案は参考情報であり、医学的アドバイスではありません</li>
            <li>アルゴリズムには限界があります</li>
            <li>個別の健康状態を考慮していません</li>
            <li>最終的な判断はユーザー自身の責任で行ってください</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 第三者コンテンツ</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            5.1 ユーザー投稿コンテンツ
          </h3>
          <p className="mb-4">
            ユーザーレビュー、評価、コメント等は投稿者個人の意見であり、当サイトの見解を代表するものではありません。
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>投稿内容の正確性を保証しません</li>
            <li>効果の個人差を考慮してください</li>
            <li>ステマ・アフィリエイト目的の投稿が含まれる可能性があります</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.2 外部リンク</h3>
          <p className="mb-4">
            当サイトから外部サイトへのリンクは情報提供目的です。リンク先の内容について、当サイトは責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. サービスの中断・変更・終了
          </h2>
          <p className="mb-4">
            当サイトは、以下の対応を予告なく行う場合があります：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>サービスの一時中断</li>
            <li>機能の変更・追加・削除</li>
            <li>コンテンツの修正・削除</li>
            <li>サービスの終了</li>
          </ul>
          <p className="mb-4">
            これらにより生じたいかなる損害についても、当サイトは責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. 損害賠償の制限</h2>
          <p className="mb-4">
            当サイトは、本サービスの利用により生じた以下の損害について、一切の責任を負いません：
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>直接的損害、間接的損害、特別損害、付随的損害、結果的損害</li>
            <li>逸失利益、事業機会の損失</li>
            <li>データの消失または破損</li>
            <li>健康被害、身体的損害</li>
            <li>精神的苦痛</li>
            <li>第三者からのクレーム</li>
          </ul>
          <p className="mb-4 text-sm text-muted-foreground">
            ※ 法令により免責が認められない場合を除く
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. 科学的研究の解釈</h2>
          <p className="mb-4">当サイトで引用される科学的研究について：</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>研究結果は常に更新されます</li>
            <li>研究には限界・バイアスが存在する可能性があります</li>
            <li>
              動物実験や試験管実験の結果は人間に適用できない場合があります
            </li>
            <li>サンプルサイズ、研究デザインにより信頼性が異なります</li>
            <li>複数の研究で結果が矛盾する場合があります</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. アフィリエイト開示</h2>
          <p className="mb-4">
            当サイトはアフィリエイトプログラムに参加しており、商品リンクから紹介料を得る場合があります。
            ただし、これがレビューや評価の中立性に影響を与えることはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. 免責事項の変更</h2>
          <p className="mb-4">
            当サイトは、必要に応じて本免責事項を変更することがあります。変更後の免責事項は、本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2">最後に</h3>
          <p className="text-sm">
            サプリメントは健康補助食品であり、医薬品ではありません。
            適切な食事、運動、睡眠を基本とし、サプリメントは補助的に使用してください。
            健康に関する重要な決定をする際は、必ず医師または専門家にご相談ください。
          </p>
        </div>
      </div>
    </div>
  );
}
