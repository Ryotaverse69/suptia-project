import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  HeartPulse,
  Scale,
  ShoppingCart,
  Brain,
  Users,
  Server,
  FileWarning,
  Beaker,
  RefreshCw,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  Gavel,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "免責事項 - サプティア",
  description:
    "サプティアの免責事項です。医療・健康情報の取り扱い、外部ECサイトでの購入、薬機法遵守について説明しています。",
};

export default function DisclaimerPage() {
  const sections = [
    { id: "medical", label: "医療・健康", icon: HeartPulse },
    { id: "compliance", label: "薬機法遵守", icon: Scale },
    { id: "purchase", label: "購入について", icon: ShoppingCart },
    { id: "liability", label: "損害賠償", icon: FileWarning },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Hero Section */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: systemColors.orange }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 mb-6 text-[15px]"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
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
            <span className="text-white">免責事項</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-[16px] backdrop-blur-sm">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-[34px] md:text-[40px] font-bold text-white leading-tight">
                免責事項
              </h1>
              <p
                className="mt-1 text-[15px]"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Disclaimer
              </p>
            </div>
          </div>

          <p
            className="text-[17px] max-w-2xl"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            サプティアのサービス利用にあたっての重要な免責事項をご確認ください
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-[13px]">
            <RefreshCw size={14} />
            最終更新日: 2025年10月30日
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section
        className={`sticky top-0 z-40 ${liquidGlassClasses.light}`}
        style={{ borderBottom: `1px solid ${appleWebColors.borderSubtle}` }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <span
              className="text-[13px] whitespace-nowrap"
              style={{ color: appleWebColors.textSecondary }}
            >
              クイックアクセス:
            </span>
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full transition-colors whitespace-nowrap hover:bg-[#FF9500] hover:text-white"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  color: appleWebColors.textPrimary,
                }}
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
        {/* Important Disclaimer Banner */}
        <section className="mb-10">
          <div
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: "rgba(255, 149, 0, 0.08)",
              border: `2px solid ${systemColors.orange}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-[16px]"
                style={{ backgroundColor: "rgba(255, 149, 0, 0.15)" }}
              >
                <AlertTriangle
                  className="w-8 h-8"
                  style={{ color: systemColors.orange }}
                />
              </div>
              <div className="flex-1">
                <h2
                  className="text-[22px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  重要な免責事項
                </h2>
                <p
                  className="font-semibold mb-4 text-[17px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サプティアは医療・診断・治療・予防を目的としたサービスではありません。
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "サプリメントの使用前に必ず医師または専門家にご相談ください",
                    "本サイトの情報は参考情報であり、医学的アドバイスではありません",
                    "効果には個人差があり、結果を保証するものではありません",
                    "既往症・服薬中の方は特に注意が必要です",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-3 rounded-[16px] ${liquidGlassClasses.light}`}
                      style={{
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      <CheckCircle
                        size={18}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: systemColors.orange }}
                      />
                      <span
                        className="text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Information Accuracy */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  1. 情報の正確性について
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、掲載する情報の正確性・完全性・有用性について最善の努力を払っていますが、以下の点についていかなる保証も行いません：
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  "掲載情報の正確性、最新性、完全性",
                  "科学的研究結果の解釈",
                  "製品情報の正確性（成分、含有量、価格等）",
                  "外部リンク先の情報",
                  "ユーザー投稿コンテンツ（レビュー、評価等）",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>ご注意：</strong>
                  情報は予告なく変更される場合があります。重要な判断をする際は、必ず公式情報源や専門家にご確認ください。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Medical & Health Disclaimer */}
        <section id="medical" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <HeartPulse className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  2. 医療・健康に関する免責
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Not Medical Advice */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <XCircle size={18} className="text-red-500" />
                  2.1 医療行為ではありません
                </h3>
                <p className="text-slate-600 mb-3">
                  本サイトで提供する情報は、以下の目的ではありません：
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "疾病の診断",
                    "治療方法の提案",
                    "医薬品の処方",
                    "医療行為の代替",
                    "健康状態の評価",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-sm"
                    >
                      <XCircle size={14} className="text-red-500" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consult Professionals */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Users size={18} className="text-slate-500" />
                  2.2 専門家への相談義務
                </h3>
                <p className="text-slate-600 mb-3">
                  以下の場合は、必ず医師または専門家にご相談ください：
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { text: "新しいサプリメントを開始する前", urgent: true },
                    { text: "既往症がある場合", urgent: true },
                    { text: "処方薬を服用中の場合", urgent: true },
                    { text: "妊娠中・授乳中の場合", urgent: true },
                    { text: "アレルギー体質の場合", urgent: false },
                    { text: "手術予定がある場合", urgent: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.urgent
                          ? "bg-rose-50 border border-rose-200"
                          : "bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full flex-shrink-0 ${
                          item.urgent
                            ? "bg-rose-600 text-white"
                            : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* No Guarantee */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  2.3 効果の保証なし
                </h3>
                <p className="text-slate-600 mb-3">
                  当サイトは以下を保証しません：
                </p>
                <div className="space-y-2">
                  {[
                    "サプリメントの効果・効能",
                    "特定の健康状態の改善",
                    "疾病の予防・治療効果",
                    "体質改善の結果",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-500 bg-white rounded-lg p-3 border border-slate-100">
                  効果には個人差があります。同じサプリメントでも、人によって結果は異なります。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pharmaceutical Law Compliance */}
        <section id="compliance" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  3. 薬機法（医薬品医療機器等法）への準拠
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Compliance Commitment */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-2">
                      コンプライアンスへの取り組み
                    </h3>
                    <p className="text-emerald-800">
                      サプティアは、日本の
                      <strong>
                        薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）
                      </strong>
                      を遵守し、すべてのコンテンツを適切に管理しています。
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Guidelines */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-slate-500" />
                  3.1 コンテンツガイドライン
                </h3>
                <p className="text-slate-600 mb-3">
                  当サイトでは、以下のガイドラインに従ってコンテンツを作成しています：
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: "効能効果の表現",
                      desc: "医薬品的な効能効果（「治る」「予防する」等）を標榜しません",
                    },
                    {
                      title: "疾病治療の言及",
                      desc: "特定の疾病の治療・予防を目的とした表現を使用しません",
                    },
                    {
                      title: "科学的根拠の明示",
                      desc: "研究データを引用する際は、出典を明記し、誇大な解釈を避けます",
                    },
                    {
                      title: "表現の適正化",
                      desc: "「〜をサポート」「〜に役立つ可能性」など、適切な表現を使用します",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="flex items-center justify-center w-6 h-6 bg-emerald-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-800">
                          {item.title}：
                        </span>
                        <span className="text-slate-600">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Compliance Check */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Beaker size={18} className="text-slate-500" />
                  3.2 自動コンプライアンスチェック
                </h3>
                <p className="text-slate-600 mb-3">
                  当サイトでは、150以上のルールに基づく自動コンプライアンスチェックシステムを導入しています。
                </p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    チェック項目例：
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      "医薬品的効能効果の表現（8カテゴリ）",
                      "疾病の治療・予防を示唆する表現",
                      "誇大広告に該当する可能性のある表現",
                      "身体の構造機能への影響を示す表現",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span className="text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Comparison */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Brain size={18} className="text-slate-500" />
                  3.3 AI検索との違い
                </h3>
                <p className="text-slate-600 mb-3">
                  一般的なAI検索（ChatGPT、Perplexity等）との重要な違い：
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="font-semibold text-red-800">AI検索の課題</p>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "法的責任を負えない",
                        "薬機法違反表現をそのまま出力するリスク",
                        "情報源の信頼性が不明確な場合がある",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-red-700"
                        >
                          <div className="w-1 h-1 bg-red-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <p className="font-semibold text-emerald-800">
                        サプティアの対応
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "すべてのコンテンツを法令準拠でチェック",
                        "150+ルールによる自動検証",
                        "信頼できる情報源のみを参照",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-emerald-700"
                        >
                          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* External EC Site Purchases */}
        <section id="purchase" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  4. 外部ECサイトでの購入について
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800">
                  当サイトは商品の販売を行っておりません。商品購入は外部ECサイトで行われます。
                </p>
              </div>

              {/* Purchase Contract */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  4.1 購入契約
                </h3>
                <div className="space-y-2">
                  {[
                    "購入契約は各ECサイトとユーザー間で成立します",
                    "当サイトは契約当事者ではありません",
                    "取引条件は各ECサイトの規約に従います",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liability Limitation */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  4.2 責任範囲の限定
                </h3>
                <p className="text-slate-600 mb-3">
                  以下について、当サイトは一切の責任を負いません：
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "商品の品質、安全性、適合性",
                    "配送の遅延、紛失、破損",
                    "返品、交換、返金",
                    "カスタマーサポート",
                    "ECサイトとのトラブル",
                    "決済トラブル",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm"
                    >
                      <XCircle size={14} className="text-slate-400" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Stock Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-semibold text-amber-800 mb-2">
                  4.3 価格・在庫情報について
                </h4>
                <ul className="space-y-1.5">
                  {[
                    "表示価格はリアルタイムではない場合があります",
                    "実際の価格は各ECサイトでご確認ください",
                    "在庫状況は変動する可能性があります",
                    "為替レート、送料、税金は別途かかる場合があります",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-amber-700"
                    >
                      <AlertTriangle size={12} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  5. AIレコメンデーション・データ分析
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトはAI技術を使用していますが、以下の点にご留意ください：
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "AIの提案は参考情報であり、医学的アドバイスではありません",
                  "アルゴリズムには限界があります",
                  "個別の健康状態を考慮していません",
                  "最終的な判断はユーザー自身の責任で行ってください",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg"
                  >
                    <span className="flex items-center justify-center w-6 h-6 bg-violet-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Third Party Content */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  6. 第三者コンテンツ
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  6.1 ユーザー投稿コンテンツ
                </h3>
                <p className="text-slate-600 mb-3">
                  ユーザーレビュー、評価、コメント等は投稿者個人の意見であり、当サイトの見解を代表するものではありません。
                </p>
                <div className="space-y-2">
                  {[
                    "投稿内容の正確性を保証しません",
                    "効果の個人差を考慮してください",
                    "ステマ・アフィリエイト目的の投稿が含まれる可能性があります",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                    >
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  6.2 外部リンク
                </h3>
                <p className="text-slate-600">
                  当サイトから外部サイトへのリンクは情報提供目的です。リンク先の内容について、当サイトは責任を負いません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Changes */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  7. サービスの中断・変更・終了
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、以下の対応を予告なく行う場合があります：
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "サービスの一時中断",
                  "機能の変更・追加・削除",
                  "コンテンツの修正・削除",
                  "サービスの終了",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                これらにより生じたいかなる損害についても、当サイトは責任を負いません。
              </p>
            </div>
          </div>
        </section>

        {/* Liability Limitation */}
        <section id="liability" className="mb-10 scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileWarning className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  8. 損害賠償の制限
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトは、本サービスの利用により生じた以下の損害について、一切の責任を負いません：
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                {[
                  "直接的損害、間接的損害、特別損害",
                  "付随的損害、結果的損害",
                  "逸失利益、事業機会の損失",
                  "データの消失または破損",
                  "健康被害、身体的損害",
                  "精神的苦痛",
                  "第三者からのクレーム",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg text-sm"
                  >
                    <XCircle size={14} className="text-orange-500" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
                ※ 法令により免責が認められない場合を除く
              </p>
            </div>
          </div>
        </section>

        {/* Scientific Research */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  9. 科学的研究の解釈
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                当サイトで引用される科学的研究について：
              </p>
              <div className="space-y-2">
                {[
                  "研究結果は常に更新されます",
                  "研究には限界・バイアスが存在する可能性があります",
                  "動物実験や試験管実験の結果は人間に適用できない場合があります",
                  "サンプルサイズ、研究デザインにより信頼性が異なります",
                  "複数の研究で結果が矛盾する場合があります",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate Disclosure */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                10. アフィリエイト開示
              </h2>
            </div>
            <p className="text-slate-600">
              当サイトはアフィリエイトプログラムに参加しており、商品リンクから紹介料を得る場合があります。
              ただし、これがレビューや評価の中立性に影響を与えることはありません。
            </p>
            <Link
              href="/legal/affiliate"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              アフィリエイト開示の詳細を見る
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>

        {/* Policy Changes */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-800">
                11. 免責事項の変更
              </h2>
            </div>
            <p className="text-slate-600">
              当サイトは、必要に応じて本免責事項を変更することがあります。変更後の免責事項は、本ページに掲載した時点で効力を生じます。
            </p>
          </div>
        </section>

        {/* Final Note */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 mb-2">最後に</h3>
                <p className="text-amber-800">
                  サプリメントは健康補助食品であり、医薬品ではありません。
                  適切な食事、運動、睡眠を基本とし、サプリメントは補助的に使用してください。
                  健康に関する重要な決定をする際は、必ず医師または専門家にご相談ください。
                </p>
              </div>
            </div>
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
                  免責事項に関するご質問は、お問い合わせフォームよりご連絡ください。
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
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-red-600">
                  利用規約
                </h3>
              </div>
              <p className="text-sm text-slate-500">サービスの利用条件</p>
            </Link>

            <Link
              href="/legal/privacy"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-red-600">
                  プライバシーポリシー
                </h3>
              </div>
              <p className="text-sm text-slate-500">個人情報の取り扱い</p>
            </Link>

            <Link
              href="/legal/affiliate"
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Gavel className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-red-600">
                  アフィリエイト開示
                </h3>
              </div>
              <p className="text-sm text-slate-500">収益モデルの透明性</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
