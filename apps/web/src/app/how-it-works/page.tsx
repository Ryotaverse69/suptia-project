import { Metadata } from "next";
import {
  Search,
  BarChart3,
  ShoppingCart,
  Star,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "サプティアの使い方 - サプティア",
  description: "サプティアの使い方と機能説明です。",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">サプティアの使い方</h1>
        <p className="text-xl text-muted-foreground">
          科学的根拠に基づいた最適なサプリメントを見つける方法
        </p>
      </div>

      {/* ステップバイステップガイド */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          3つのステップで最適なサプリメントを見つける
        </h2>

        <div className="space-y-8">
          {/* ステップ1 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
            </div>
            <div className="flex-1 border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">検索する</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                目的や成分、ブランド名で検索。または、カテゴリから製品を探せます。
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">検索方法:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • 目的別検索（例：睡眠改善、免疫サポート、エネルギー向上）
                  </li>
                  <li>• 成分別検索（例：ビタミンD、オメガ3、マグネシウム）</li>
                  <li>• ブランド検索（例：NOW Foods、Nature Made）</li>
                  <li>• フリーワード検索</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ステップ2 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
            </div>
            <div className="flex-1 border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">比較する</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                科学的根拠、品質、価格、レビューを総合的に比較。信頼スコアで一目瞭然。
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">比較項目:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • 信頼スコア（エビデンスレベル、品質認証、成分含有量）
                  </li>
                  <li>• 価格比較（複数ECサイトから最安値を表示）</li>
                  <li>• ユーザーレビュー・評価</li>
                  <li>• 第三者認証（NSF、USP、Informed Choice等）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ステップ3 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
            </div>
            <div className="flex-1 border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">購入する</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                最適な製品を見つけたら、お好きなECサイトで購入。Amazon、楽天、iHerb等から選択可能。
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">購入オプション:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 複数ECサイトの価格を一括比較</li>
                  <li>• ポイント還元率も考慮した最安値検索</li>
                  <li>• 定期購入オプションの有無</li>
                  <li>• 配送期間・送料の確認</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要機能 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">主要機能</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">信頼スコア</h3>
            <p className="text-sm text-muted-foreground">
              科学的エビデンス、品質認証、成分の生物学的利用能を総合評価し、0〜100点でスコア化。
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">レビュー統合</h3>
            <p className="text-sm text-muted-foreground">
              複数ECサイトのレビューを統合表示。ユーザーの生の声を確認できます。
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">価格履歴</h3>
            <p className="text-sm text-muted-foreground">
              過去の価格変動を追跡。セール時期を見逃さず、最適なタイミングで購入可能。
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">AIレコメンド</h3>
            <p className="text-sm text-muted-foreground">
              閲覧履歴や目的に基づき、AIがパーソナライズされた製品を提案します。
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">高度なフィルター</h3>
            <p className="text-sm text-muted-foreground">
              価格帯、認証、成分形態、アレルゲン、食事制限（ビーガン等）で絞り込み可能。
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">お気に入り機能</h3>
            <p className="text-sm text-muted-foreground">
              気になる製品をお気に入り登録。価格変動時に通知を受け取れます（開発予定）。
            </p>
          </div>
        </div>
      </section>

      {/* 信頼スコアの仕組み */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          信頼スコアの仕組み
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-6 text-center">
            サプティアの信頼スコアは、以下の要素を総合的に評価して算出されます：
          </p>

          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">科学的エビデンス</h3>
                <span className="text-sm text-muted-foreground">40%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                査読済み論文、臨床試験データに基づくエビデンスレベル（A〜D）
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">品質認証</h3>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                NSF、USP、GMP等の第三者認証の有無と信頼性
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">成分品質</h3>
                <span className="text-sm text-muted-foreground">20%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "20%" }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                含有量の正確性、成分形態（吸収率の高い形態か）、純度
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">透明性</h3>
                <span className="text-sm text-muted-foreground">10%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                製造プロセス、原材料の原産地、試験結果の公開度
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* よくある使い方 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">よくある使い方</h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">🎯 目的別で探す</h3>
            <p className="text-sm text-muted-foreground mb-3">
              「睡眠を改善したい」「免疫力をサポートしたい」など、目的から検索。
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>目的を選択（例：睡眠改善）</li>
              <li>関連成分の製品が表示される</li>
              <li>信頼スコアで並び替え</li>
              <li>レビューを確認して購入</li>
            </ol>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">💊 成分名で探す</h3>
            <p className="text-sm text-muted-foreground mb-3">
              「ビタミンD」「マグネシウム」など、特定成分の製品を比較。
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>成分名で検索</li>
              <li>成分形態でフィルター（例：クエン酸マグネシウム）</li>
              <li>含有量と価格を比較</li>
              <li>コスパの良い製品を選択</li>
            </ol>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">🏷️ ブランドで探す</h3>
            <p className="text-sm text-muted-foreground mb-3">
              お気に入りのブランドから製品を探す。
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>ブランド名で検索</li>
              <li>製品ラインナップを確認</li>
              <li>同ブランド内で最適な製品を選択</li>
            </ol>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">⚖️ 価格重視で探す</h3>
            <p className="text-sm text-muted-foreground mb-3">
              コストパフォーマンスを重視した製品選び。
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>価格でソート</li>
              <li>1日あたりのコストを計算</li>
              <li>品質とコスパのバランスを確認</li>
              <li>セール情報をチェック</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 安全な使い方 */}
      <section className="mb-16">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            ⚠️ 安全にご利用いただくために
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
              <p className="text-muted-foreground">
                <strong>医師に相談:</strong>{" "}
                新しいサプリメントを開始する前に、必ず医師または専門家にご相談ください。
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
              <p className="text-muted-foreground">
                <strong>用法用量を守る:</strong>{" "}
                製品に記載された用法用量を必ず守ってください。
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
              <p className="text-muted-foreground">
                <strong>相互作用に注意:</strong>{" "}
                処方薬との相互作用がある場合があります。
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
              <p className="text-muted-foreground">
                <strong>妊娠・授乳中:</strong>{" "}
                妊娠中・授乳中の方は特に注意が必要です。
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* サポート */}
      <section>
        <div className="text-center border-t pt-12">
          <h2 className="text-2xl font-bold mb-4">さらに詳しく知りたい方へ</h2>
          <p className="text-muted-foreground mb-6">
            使い方でお困りの場合は、FAQをご確認いただくか、お問い合わせください
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/faq"
              className="inline-block border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors font-semibold"
            >
              FAQを見る
            </a>
            <a
              href="/contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
