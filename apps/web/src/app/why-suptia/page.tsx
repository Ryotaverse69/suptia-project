import { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  ShieldCheck,
  TrendingUp,
  FileText,
  Bell,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Search,
  Scale,
  Clock,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI検索との違い - なぜサプティアを選ぶべきか | サプティア",
  description:
    "ChatGPTやPerplexityなどのAI検索は便利ですが、サプリメント選びには限界があります。薬機法準拠、相互作用チェック、価格履歴など、AIには提供できない価値をサプティアは提供します。",
  keywords: [
    "AI検索",
    "ChatGPT",
    "Perplexity",
    "サプリメント比較",
    "サプティア",
    "薬機法",
  ],
};

export default function WhySuptiaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Bot size={16} />
              AI時代のサプリメント選び
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              AIが答えを出す時代。
              <br />
              <span className="text-primary">Suptiaはその根拠を示す。</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              ChatGPTやPerplexityは便利です。でも、あなたの身体のことは
              <br className="hidden sm:block" />
              <strong className="text-gray-900">
                根拠を持って判断できるサプティア
              </strong>
              に聞いてください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                商品を探す
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
              >
                診断を受ける
                <Sparkles size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI検索の限界セクション */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              AI検索は便利。でも、サプリ選びには限界がある。
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ChatGPT、Perplexity、Google
              SGEなどのAI検索は素晴らしいツールです。
              しかし、サプリメント選びにおいては重要な限界があります。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 限界1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Scale className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">法的責任がない</h3>
              <p className="text-gray-600 text-sm">
                AIは法的責任を取れません。薬機法に違反する表現をそのまま出力するリスクがあり、
                誤った情報を信じてしまう危険性があります。
              </p>
            </div>

            {/* 限界2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">あなたを知らない</h3>
              <p className="text-gray-600 text-sm">
                AIは一般論しか答えられません。あなたの既往歴、服用中の薬、アレルギーを考慮した
                個別のアドバイスは不可能です。
              </p>
            </div>

            {/* 限界3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">価格は瞬間的</h3>
              <p className="text-gray-600 text-sm">
                AIは「今の価格」しか知りません。価格の推移、セールのパターン、買い時の判断は
                AIには不可能です。
              </p>
            </div>

            {/* 限界4 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">根拠が不透明</h3>
              <p className="text-gray-600 text-sm">
                AIの推薦は「なぜその商品を選んだか」が不明確。根拠を確認できず、
                判断の正当性を検証できません。
              </p>
            </div>

            {/* 限界5 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Bell className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                購入後フォローなし
              </h3>
              <p className="text-gray-600 text-sm">
                AIは一度の回答で終わり。価格が下がった時の通知、
                継続的なサポートは期待できません。
              </p>
            </div>

            {/* 限界6 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="text-red-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">エビデンスが浅い</h3>
              <p className="text-gray-600 text-sm">
                AIは表面的な情報しか提供しません。PubMedやCochraneの一次ソースに基づく
                深い科学的評価は困難です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 比較表セクション */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              AI検索 vs サプティア
            </h2>
            <p className="text-gray-600">
              サプリメント選びに必要な機能を比較してみましょう
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    機能
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">
                    AI検索
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">
                    サプティア
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    薬機法コンプライアンス
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    個人の既往歴に基づく判定
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      coming soon
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    成分×薬剤の相互作用チェック
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      coming soon
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    複数ECサイトの価格比較
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 text-sm">
                    限定的
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      4サイト対応
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    価格履歴・トレンド分析
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      coming soon
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">価格アラート通知</td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      coming soon
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    推薦根拠の100%明示
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      5つの柱で評価
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    PubMed/Cochraneの引用
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 text-sm">
                    不安定
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">
                    エビデンスレベル評価
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="inline text-red-500" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="inline text-green-500" size={20} />
                    <span className="text-xs text-gray-500 block">
                      S/A/B/C/D評価
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* サプティアの5つの柱セクション */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              サプティアの5つの柱
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              すべての商品を5つの観点で透明に評価。
              <br />
              <strong>「なぜこの商品を選ぶべきか」が100%理解できます。</strong>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* 柱1 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">価格比較</h3>
              <p className="text-gray-600 text-sm">
                楽天・Amazon・Yahoo・iHerbの最安値を表示
              </p>
            </div>

            {/* 柱2 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">成分量比較</h3>
              <p className="text-gray-600 text-sm">
                1日あたりの有効成分量を正確に表示
              </p>
            </div>

            {/* 柱3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-bold text-gray-900 mb-2">コスパ比較</h3>
              <p className="text-gray-600 text-sm">
                成分量あたりの価格（¥/mg）を算出
              </p>
            </div>

            {/* 柱4 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="font-bold text-gray-900 mb-2">エビデンス</h3>
              <p className="text-gray-600 text-sm">
                S/A/B/C/Dの5段階で科学的根拠を評価
              </p>
            </div>

            {/* 柱5 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">安全性</h3>
              <p className="text-gray-600 text-sm">
                0-100点のスコアと副作用・相互作用情報
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* キャッチコピーセクション */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Heart size={16} />
            あなたの健康のために
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="text-primary">AIは一般論。</span>
            <br />
            サプティアはあなた専用。
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            サプリメント選びは、価格だけでなく、あなたの身体、目的、安全性を総合的に考慮する必要があります。
            サプティアは、科学的根拠に基づいて「あなたに最適な選択」を支援します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              商品を探す
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
            >
              成分を学ぶ
              <FileText size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ セクション */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              よくある質問
            </h2>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50">
                AI検索とサプティアを併用すべきですか？
                <span className="text-primary group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-4 text-gray-600">
                はい、併用をおすすめします。AI検索は一般的な情報収集に優れています。
                一方、サプティアは価格比較、安全性評価、エビデンス確認など、
                購入判断に必要な具体的な情報を提供します。
                AI検索で興味を持った商品をサプティアで詳しく調べる、という使い方が効果的です。
              </div>
            </details>

            <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50">
                サプティアの情報は信頼できますか？
                <span className="text-primary group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-4 text-gray-600">
                サプティアのすべての情報は、PubMed、Cochrane
                Library、厚生労働省などの 信頼できる一次ソースに基づいています。
                また、すべてのコンテンツは薬機法に準拠しており、
                エビデンスレベル（S/A/B/C/D）で科学的根拠の強さを明示しています。
              </div>
            </details>

            <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50">
                無料で使えますか？
                <span className="text-primary group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-4 text-gray-600">
                はい、基本機能は完全無料です。商品検索、価格比較、成分ガイド、
                診断機能などをお使いいただけます。
                将来的には、価格アラートや相互作用チェッカーなどの
                高度な機能を提供するプレミアムプランも予定しています。
              </div>
            </details>

            <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50">
                サプティアはどうやって収益を得ていますか？
                <span className="text-primary group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-4 text-gray-600">
                サプティアは、ECサイトへのアフィリエイトリンクを通じて収益を得ています。
                ただし、アフィリエイト収益は推薦順位に一切影響しません。
                すべての商品は、エビデンス、安全性、コストパフォーマンスの
                客観的な基準で評価されています。
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="py-16 sm:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            根拠を持ってサプリを選ぼう
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            476以上の商品、100以上の成分ガイド。
            <br />
            科学的根拠に基づいた、あなたに最適なサプリメント選びを。
          </p>
          <Link
            href="/diagnosis"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            無料診断を受ける
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
