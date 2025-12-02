import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Store,
  CreditCard,
  Package,
  RefreshCw,
  Mail,
  AlertCircle,
  MapPin,
  Phone,
  Globe,
  User,
  FileText,
  Handshake,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - サプティア",
  description: "特定商取引法に基づく事業者情報の表記です。",
};

export default function DisclosurePage() {
  const sections = [
    { id: "provider", label: "事業者情報", icon: Building2 },
    { id: "service", label: "サービス", icon: Store },
    { id: "affiliate", label: "アフィリエイト", icon: Handshake },
    { id: "contact", label: "お問い合わせ", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-slate-300 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/legal/terms"
              className="hover:text-white transition-colors"
            >
              法的情報
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">特定商取引法に基づく表記</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              特定商取引法に基づく表記
            </h1>
          </div>

          <p className="text-slate-300 text-lg max-w-2xl">
            法令に基づく事業者情報の開示
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
            <RefreshCw size={14} />
            最終更新日: 2025年10月30日
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <span className="text-sm text-slate-500 whitespace-nowrap">
              クイックアクセス:
            </span>
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 hover:text-slate-800 rounded-full transition-colors whitespace-nowrap"
              >
                <item.icon size={14} />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl py-12">
        {/* Important Notice */}
        <section className="mb-10">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-2">
                  重要なお知らせ
                </h2>
                <p className="text-blue-800">
                  当サイトは商品の直接販売を行っておりません。商品の購入は外部ECサイト（Amazon、楽天市場、iHerb等）で行われます。商品購入に関する契約は、各ECサイトとお客様の間で成立します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Provider */}
        <section id="provider" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">サービス提供者</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Store className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">サービス名称</div>
                    <div className="font-semibold text-slate-800">
                      サプティア (Suptia)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">運営形態</div>
                    <div className="font-semibold text-slate-800">
                      個人事業主
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">運営責任者</div>
                    <div className="font-semibold text-slate-800">
                      長谷川　亮太
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">所在地</div>
                    <div className="font-semibold text-slate-800">
                      請求があり次第遅滞なく開示します
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">電話番号</div>
                    <div className="font-semibold text-slate-800">
                      請求があり次第遅滞なく開示します
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">メールアドレス</div>
                    <div className="font-semibold text-slate-800">
                      info@suptia.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Globe className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm text-slate-500">URL</div>
                    <div className="font-semibold text-slate-800">
                      https://suptia.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclosure Notice */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">
                      所在地・電話番号の開示について
                    </h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      特定商取引法に基づき、所在地および電話番号については、ご請求があり次第遅滞なく開示いたします。開示をご希望の場合は、メールアドレス（
                      <span className="font-semibold">info@suptia.com</span>
                      ）までお問い合わせください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Content */}
        <section id="service" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">サービス内容</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "サプリメント製品の比較・検索サービスの提供",
                  "科学的根拠に基づく情報の提供",
                  "ユーザーレビュー・評価情報の提供",
                  "外部ECサイトへのリンク提供",
                  "AIを活用したレコメンデーション機能",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600">
                ※
                当サイトは商品の販売を行っておりません。商品の購入は外部ECサイトで行われます。
              </div>
            </div>
          </div>
        </section>

        {/* Service Fee */}
        <section className="mb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800">サービス利用料金</h3>
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                無料
              </div>
              <p className="text-sm text-slate-500">
                当サイトのサービスは無料でご利用いただけます。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-800">お支払い方法</h3>
              </div>
              <div className="text-lg font-semibold text-slate-600 mb-1">
                該当なし
              </div>
              <p className="text-sm text-slate-500">
                外部ECサイトでの購入は各サイトの規約に準じます。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-800">商品の引渡し時期</h3>
              </div>
              <div className="text-lg font-semibold text-slate-600 mb-1">
                該当なし
              </div>
              <p className="text-sm text-slate-500">
                当サイトは商品の販売・配送を行っておりません。
              </p>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  返品・交換・キャンセル
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは商品の販売を行っておりません（該当なし）。
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                外部ECサイトで購入された商品の返品・交換・キャンセルについては、各ECサイトの規約に従ってください。
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate */}
        <section id="affiliate" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Handshake className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  アフィリエイトプログラムについて
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、以下のアフィリエイトプログラムに参加しています：
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "Amazonアソシエイトプログラム",
                  "楽天アフィリエイト",
                  "iHerb アフィリエイトプログラム",
                  "その他提携企業のプログラム",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-violet-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                当サイトのリンクを経由して商品が購入された場合、当サイトは各アフィリエイトプログラムから紹介料を受け取ることがあります。これにより商品価格が変わることはありません。
              </div>

              <div className="mt-4">
                <Link
                  href="/legal/affiliate"
                  className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm font-medium"
                >
                  アフィリエイト開示の詳細を見る
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-3">
                  免責事項
                </h2>
                <div className="space-y-2">
                  {[
                    "当サイトは商品の販売を行っておりません",
                    "商品購入に関する契約は、各ECサイトとお客様の間で成立します",
                    "配送、返品、カスタマーサポートは各ECサイトの責任範囲です",
                    "当サイトは外部ECサイトでの取引に関する一切の責任を負いません",
                    "価格・在庫情報はリアルタイムではない場合があります",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-red-800 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-10 scroll-mt-20">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">お問い合わせ</h2>
                <p className="text-slate-300 mb-4">
                  サービスに関するお問い合わせは、以下の方法でご連絡ください。
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-200 text-sm">
                    <FileText size={14} />
                    お問い合わせフォーム
                  </div>
                  <div className="flex items-center gap-2 text-slate-200 text-sm">
                    <Mail size={14} />
                    info@suptia.com
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  ※ お問い合わせへの回答には数日かかる場合があります。
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                >
                  お問い合わせフォーム
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            関連リンク
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/legal/terms"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 mb-1">
                利用規約
              </h3>
              <p className="text-sm text-slate-500">サービスの利用条件</p>
            </Link>

            <Link
              href="/legal/privacy"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 mb-1">
                プライバシーポリシー
              </h3>
              <p className="text-sm text-slate-500">個人情報の取り扱い</p>
            </Link>

            <Link
              href="/legal/affiliate"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 mb-1">
                アフィリエイト開示
              </h3>
              <p className="text-sm text-slate-500">収益モデルの透明性</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
