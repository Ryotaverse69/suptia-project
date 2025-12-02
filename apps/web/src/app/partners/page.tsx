import { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  ShoppingCart,
  TrendingUp,
  Shield,
  ChevronRight,
  Handshake,
  CheckCircle2,
  Star,
  Users,
  Award,
  Lock,
  Package,
  Zap,
  BadgePercent,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "提携パートナー - サプティア",
  description:
    "サプティアが提携するAmazon、楽天市場、Yahoo!ショッピングなどのECサイトと、アフィリエイトプログラムについて詳しくご紹介。信頼性の高いパートナーから最適なサプリメントを見つけます。",
};

export default function PartnersPage() {
  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          {/* パンくずリスト */}
          <nav className="flex items-center space-x-2 text-sm text-blue-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">提携パートナー</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Handshake className="w-5 h-5" />
              <span className="text-sm font-medium">パートナーシップ</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              提携パートナー
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              サプティアは、信頼性の高いECサイトと提携し、
              <br className="hidden md:block" />
              最適なサプリメント選びをサポートしています。
            </p>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* アフィリエイト開示 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800 mb-2">
                  アフィリエイトプログラムについて
                </h2>
                <p className="text-gray-600">
                  当サイトは、以下の提携パートナーのアフィリエイトプログラムに参加しています。
                  商品リンクを経由して購入された場合、当サイトは各プログラムから紹介料を受け取ることがあります。
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    価格への影響なし
                  </p>
                  <p className="text-sm text-gray-600">
                    アフィリエイトリンク経由でも、商品価格は変わりません
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">中立的な評価</p>
                  <p className="text-sm text-gray-600">
                    紹介料の有無は製品評価に一切影響しません
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 主要提携パートナー */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              主要提携パートナー
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Amazon */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        Amazon.co.jp
                      </h3>
                      <p className="text-sm text-orange-100">
                        Amazonアソシエイト
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  日本最大級のECサイト。幅広いサプリメント製品を取り扱い、迅速な配送と充実したカスタマーサポートが特徴。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Prime会員は送料無料</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>豊富な製品ラインナップ</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ユーザーレビューが充実</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 楽天市場 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">楽天市場</h3>
                      <p className="text-sm text-red-100">楽天アフィリエイト</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  日本最大級のオンラインショッピングモール。楽天ポイントが貯まり、セール時にはお得に購入可能。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>楽天ポイントが貯まる・使える</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>定期的なセール・キャンペーン</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>多様なショップから選択可能</span>
                  </div>
                </div>
              </div>
            </div>

            {/* iHerb */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">iHerb</h3>
                      <p className="text-sm text-green-100">
                        iHerbアフィリエイト
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  世界最大級のサプリメント専門ECサイト。高品質な製品を手頃な価格で提供し、日本語サポートも充実。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>海外製品の豊富な品揃え</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>リーズナブルな価格設定</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>日本への配送に対応</span>
                  </div>
                </div>
              </div>
            </div>

            {/* その他パートナー */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        その他提携サイト
                      </h3>
                      <p className="text-sm text-purple-100">
                        各種アフィリエイト
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  その他、専門サプリメントストア、ドラッグストアEC、海外製品輸入サイト等と順次提携を拡大しています。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>専門ストアとの提携</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ニッチ製品の取り扱い</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>定期購入オプション</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 提携方針 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              提携パートナー選定基準
            </h2>
          </div>

          <p className="text-gray-600 mb-8 max-w-3xl">
            サプティアは、ユーザーに最適な購入体験を提供するため、以下の基準でパートナーを選定しています。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  信頼性・安全性
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  運営実績が豊富
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  セキュアな決済システム
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  適切な個人情報保護
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  法令遵守体制の整備
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">製品品質</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  正規品の取り扱い
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  適切な品質管理
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  第三者認証製品の充実
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  製品情報の透明性
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  ユーザー体験
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  使いやすいUI/UX
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  迅速な配送
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  充実したカスタマーサポート
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  柔軟な返品・交換ポリシー
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BadgePercent className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">価格競争力</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  適正な価格設定
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  定期的なセール・キャンペーン
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  送料の明確性
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  ポイント・割引制度
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 価格比較について */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Zap className="w-5 h-5" />
                価格比較機能について
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                サプティアは、複数の提携ECサイトから価格情報を収集し、ユーザーが最適な購入先を選択できるようサポートしています。
              </p>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="font-semibold text-gray-800 mb-3">
                  価格表示に関する注意事項
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    価格情報はリアルタイムではない場合があります
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    送料、税金は別途かかる場合があります
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    セール・キャンペーン価格は期間限定の場合があります
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    実際の価格は各ECサイトでご確認ください
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    為替レートの変動により、海外サイトの価格は変動します
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 新規パートナー募集 */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Handshake className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                提携パートナー募集中
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                サプリメント関連のEC事業者、製造・販売事業者の方で、
                サプティアとの提携にご興味がある場合は、お気軽にお問い合わせください。
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-bold shadow-lg"
              >
                提携について問い合わせる
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 免責事項 */}
        <section className="mb-12">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">免責事項</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                商品購入に関する契約は、各ECサイトとユーザー間で成立します
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                当サイトは購入契約の当事者ではありません
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                配送、返品、カスタマーサポートは各ECサイトの責任範囲です
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                各ECサイトの利用規約・プライバシーポリシーをご確認ください
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                アフィリエイト収益の有無は製品評価に一切影響を与えません
              </li>
            </ul>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            関連ページ
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/legal/affiliate"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              アフィリエイト開示
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              お問い合わせ
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              サプティアとは
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
