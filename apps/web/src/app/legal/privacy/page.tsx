import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  ChevronRight,
  Database,
  Cookie,
  Lock,
  Users,
  Baby,
  Mail,
  Eye,
  Server,
  Share2,
  Brain,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "プライバシーポリシー - サプティア",
  description: "サプティアの個人情報保護方針です。",
};

export default function PrivacyPage() {
  const sections = [
    { id: "collection", label: "収集情報", icon: Database },
    { id: "cookies", label: "Cookie", icon: Cookie },
    { id: "security", label: "セキュリティ", icon: Lock },
    { id: "rights", label: "ユーザー権利", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-6">
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
            <span className="text-white">プライバシーポリシー</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              プライバシーポリシー
            </h1>
          </div>

          <p className="text-emerald-100 text-lg max-w-2xl">
            サプティアにおける個人情報の取り扱いについて説明します
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-full transition-colors whitespace-nowrap"
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
        {/* Basic Policy */}
        <section className="mb-10">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900 mb-2">
                  基本方針
                </h2>
                <p className="text-emerald-800">
                  サプティア（以下「当サイト」といいます）は、ユーザーの個人情報の重要性を認識し、個人情報保護法その他の関連法令を遵守し、適切に取り扱います。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Information Collection */}
        <section id="collection" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">収集する情報</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Automatic Collection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Server size={18} className="text-slate-500" />
                  自動的に収集される情報
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "IPアドレス",
                    "ブラウザの種類・バージョン",
                    "オペレーティングシステム",
                    "アクセス日時",
                    "参照元URL",
                    "閲覧ページ",
                    "デバイス情報",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* User Provided */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Users size={18} className="text-slate-500" />
                  ユーザーが提供する情報
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "お問い合わせ情報（氏名、メールアドレス等）",
                    "レビュー・評価の投稿内容",
                    "検索クエリ",
                    "ユーザー設定（言語、表示設定等）",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cookie Collection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Cookie size={18} className="text-slate-500" />
                  Cookie・類似技術により収集される情報
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "セッションID",
                    "ユーザー識別子",
                    "サイト利用状況",
                    "広告効果測定データ",
                    "アフィリエイトトラッキングデータ",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose of Use */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">情報の利用目的</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                収集した情報は、以下の目的で利用します：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "本サービスの提供・運営・改善",
                  "ユーザーサポート・お問い合わせ対応",
                  "ユーザー体験のパーソナライゼーション",
                  "AIレコメンデーション機能の提供",
                  "サイト利用状況の分析・統計",
                  "不正利用の防止・セキュリティ対策",
                  "マーケティング・広告配信の最適化",
                  "法令遵守・紛争解決",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section id="cookies" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <Cookie className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Cookieの使用について
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-slate-600">
                当サイトでは、ユーザー体験の向上、サイト利用状況の分析、広告配信のために、Cookie及び類似技術を使用しています。
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <h4 className="font-semibold text-slate-800">必須Cookie</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    サイトの基本機能（セッション管理、セキュリティ）に必要なCookie。無効にするとサイトが正常に機能しません。
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <h4 className="font-semibold text-slate-800">分析Cookie</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    Google
                    Analytics等を使用したアクセス解析Cookie。サイト改善のために利用します。
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <h4 className="font-semibold text-slate-800">広告Cookie</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    アフィリエイトプログラム、リターゲティング広告のためのCookie。
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <h4 className="font-semibold text-slate-800">機能Cookie</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    ユーザー設定の保存、パーソナライゼーションのためのCookie。
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Cookie設定の変更
                </h4>
                <p className="text-sm text-amber-700">
                  ブラウザの設定からCookieを無効化できます。また、フッターの「Cookie設定を変更する」リンクから、Cookie同意設定を変更できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Services */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  第三者サービスの利用
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600 mb-4">
                当サイトは以下の第三者サービスを利用しています：
              </p>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">
                      Google Analytics
                    </h4>
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      プライバシーポリシー
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="text-sm text-slate-600">
                    アクセス解析のために使用。Googleのプライバシーポリシーに準拠します。
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">
                    アフィリエイトプログラム
                  </h4>
                  <p className="text-sm text-slate-600">
                    Amazon
                    アソシエイト、楽天アフィリエイト、iHerb等のトラッキングCookieを使用します。
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">
                    CDN・ホスティング
                  </h4>
                  <p className="text-sm text-slate-600">
                    Vercel、その他CDNサービスを使用。各サービスのプライバシーポリシーに準拠します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Disclosure */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                情報の第三者提供
              </h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
              </p>
              <div className="space-y-2">
                {[
                  "ユーザーの同意がある場合",
                  "法令に基づく場合",
                  "人の生命、身体または財産の保護に必要な場合",
                  "公衆衛生の向上または児童の健全な育成の推進に特に必要がある場合",
                  "国の機関等への協力が必要な場合",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="flex items-center justify-center w-6 h-6 bg-slate-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendation */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  AIレコメンデーション・データ処理
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、ユーザー体験向上のためAI技術を使用しています：
              </p>
              <div className="space-y-3 mb-4">
                {[
                  "閲覧履歴、検索履歴に基づくレコメンデーション",
                  "匿名化された統計データの機械学習への利用",
                  "個人を特定できない形での学習データ利用",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-cyan-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-sm text-teal-800">
                  <strong>重要：</strong>
                  AIモデルのトレーニングには、個人を特定できる情報は使用しません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  データの保管・セキュリティ
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、個人情報を適切に管理し、以下の対策を講じています：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Lock, text: "SSL/TLS暗号化通信の使用" },
                  { icon: Users, text: "アクセス制限・認証システム" },
                  { icon: Eye, text: "定期的なセキュリティ監査" },
                  { icon: Shield, text: "不正アクセス対策" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                  >
                    <item.icon className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section id="rights" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">ユーザーの権利</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                ユーザーは以下の権利を有します：
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "個人情報の開示請求",
                  "個人情報の訂正・追加・削除請求",
                  "個人情報の利用停止・消去請求",
                  "第三者提供の停止請求",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg"
                  >
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 text-sm">
                これらの請求は、
                <Link
                  href="/contact"
                  className="text-indigo-600 hover:underline"
                >
                  お問い合わせフォーム
                </Link>
                よりご連絡ください。
              </p>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Baby className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  子供のプライバシー
                </h2>
                <p className="text-amber-800">
                  本サービスは13歳未満の子供を対象としていません。13歳未満の子供の個人情報を故意に収集することはありません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Changes */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                プライバシーポリシーの変更
              </h2>
            </div>
            <p className="text-slate-600">
              当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のポリシーは、本ページに掲載した時点で効力を生じます。
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">お問い合わせ</h2>
                <p className="text-slate-300 mb-4">
                  個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
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
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 mb-1">
                利用規約
              </h3>
              <p className="text-sm text-slate-500">サービスの利用条件</p>
            </Link>

            <Link
              href="/legal/cookies"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 mb-1">
                Cookieポリシー
              </h3>
              <p className="text-sm text-slate-500">Cookieの詳細な使用方法</p>
            </Link>

            <Link
              href="/legal/affiliate"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 mb-1">
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
