import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  generateHowToStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structured-data";
import {
  CheckCircle2,
  Search,
  FlaskConical,
  ShieldCheck,
  Coins,
  Target,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import {
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "サプリメントの選び方ガイド | 5つのステップで最適なサプリを見つける",
  description:
    "サプリメント選びで失敗しないための5ステップガイド。エビデンス、安全性、コスパ、価格、成分量の5つの観点から、あなたに最適なサプリメントの選び方を科学的根拠に基づいて解説します。",
  keywords: [
    "サプリメント",
    "選び方",
    "比較",
    "エビデンス",
    "安全性",
    "コスパ",
    "サプリ選び",
  ],
  openGraph: {
    title: "サプリメントの選び方ガイド | サプティア",
    description:
      "5つのステップで最適なサプリを見つける。科学的根拠に基づいたサプリメント選びのガイド。",
    type: "article",
  },
};

// HowToステップの定義
const howToSteps = [
  {
    name: "目的を明確にする",
    text: "まず、サプリメントを摂取する目的を明確にしましょう。「疲労回復」「免疫サポート」「美容」など、具体的な目的を決めることで、必要な成分が絞り込めます。目的が曖昧だと、不要なサプリを購入してしまう可能性があります。",
    icon: Target,
    tips: [
      "健康診断の結果を参考にする",
      "生活習慣や食事内容を振り返る",
      "一度に複数の目的を追わない",
    ],
  },
  {
    name: "エビデンスレベルを確認する",
    text: "サプリメントの効果には科学的根拠（エビデンス）の差があります。サプティアでは、大規模臨床試験に基づくS〜理論段階のDまで5段階で評価しています。エビデンスレベルA以上の成分を選ぶことで、効果が期待できる確率が高まります。",
    icon: FlaskConical,
    tips: [
      "メタ解析やRCT（ランダム化比較試験）の有無を確認",
      "単一の研究結果だけを信じない",
      "「効く」と断言する製品は要注意",
    ],
  },
  {
    name: "安全性スコアをチェックする",
    text: "サプリメントは食品ですが、過剰摂取や相互作用のリスクがあります。サプティアの安全性スコア（0-100点）で、副作用リスク、薬との相互作用、添加物の安全性を確認しましょう。特に持病がある方や薬を服用中の方は必ずチェックしてください。",
    icon: ShieldCheck,
    tips: [
      "推奨摂取量を守る",
      "複数のサプリを併用する場合は成分の重複に注意",
      "妊娠中・授乳中は医師に相談",
    ],
  },
  {
    name: "コスパを比較する",
    text: "同じ成分でも製品によって含有量と価格は大きく異なります。「1日あたりのコスト」や「1mgあたりの価格」で比較することで、本当にお得な製品がわかります。安い製品が必ずしもコスパが良いとは限りません。",
    icon: Coins,
    tips: [
      "1日あたりの摂取コストで比較",
      "成分量あたりの価格（¥/mg）を確認",
      "定期購入の割引も考慮",
    ],
  },
  {
    name: "複数ECサイトで価格を比較する",
    text: "同じ製品でもECサイトによって価格が異なります。サプティアでは楽天市場、Yahoo!ショッピング、Amazonの価格を自動比較。ポイント還元や送料も含めた実質価格で最安値を見つけましょう。",
    icon: Search,
    tips: [
      "ポイント還元率を加味した実質価格で比較",
      "送料無料の条件を確認",
      "セール時期を狙う（楽天スーパーセール等）",
    ],
  },
];

// FAQの定義
const faqs = [
  {
    question: "サプリメントは本当に効果がありますか？",
    answer:
      "効果の有無は成分と摂取量によって異なります。科学的研究で効果が確認されている成分（エビデンスレベルS〜A）を、推奨摂取量で継続的に摂取することで効果が期待できます。ただし、サプリメントは医薬品ではないため、「治る」「防ぐ」といった効果を断言することはできません。",
  },
  {
    question: "サプリメントの副作用が心配です",
    answer:
      "一般的に推奨摂取量を守れば安全ですが、過剰摂取や特定の薬との相互作用でリスクが生じる場合があります。サプティアの安全性スコアで事前にリスクを確認し、持病がある方や薬を服用中の方は必ず医師に相談してください。",
  },
  {
    question: "海外製と国産、どちらを選ぶべきですか？",
    answer:
      "品質管理の観点では、GMP認証を取得している製品が安心です。海外製は成分量が多い傾向がありますが、日本人の体格に合わない場合もあります。サプティアでは製造国に関わらず、成分量・価格・エビデンス・安全性を客観的に評価しています。",
  },
  {
    question: "マルチビタミンと単体サプリ、どちらがいいですか？",
    answer:
      "目的によって異なります。全体的な栄養補給ならマルチビタミン、特定の栄養素を集中的に補給したいなら単体サプリが適しています。ただし、マルチビタミンは成分量が少ない製品も多いので、1日あたりの含有量を必ず確認しましょう。",
  },
  {
    question: "サプリメントはいつ飲むのがベストですか？",
    answer:
      "成分によって最適なタイミングが異なります。脂溶性ビタミン（A, D, E, K）は食後に、水溶性ビタミン（B群, C）は食間でも可。鉄分は空腹時の方が吸収率が高いですが、胃に負担がかかる場合は食後に。各製品の推奨に従うのが基本です。",
  },
];

export default async function HowToChoosePage() {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com";

  // HowTo構造化データ
  const howToJsonLd = generateHowToStructuredData({
    name: "サプリメントの選び方 - 5つのステップで最適なサプリを見つける",
    description:
      "エビデンス、安全性、コスパ、価格、成分量の5つの観点から、あなたに最適なサプリメントを選ぶ方法を解説します。",
    image: `${siteUrl}/og-how-to-choose.png`,
    totalTime: "PT10M",
    steps: howToSteps.map((step) => ({
      name: step.name,
      text: step.text,
      url: `${siteUrl}/how-to-choose#step-${howToSteps.indexOf(step) + 1}`,
    })),
  });

  // FAQ構造化データ
  const faqJsonLd = generateFAQStructuredData(faqs);

  // パンくず構造化データ
  const breadcrumbJsonLd = generateBreadcrumbStructuredData([
    { name: "ホーム", url: siteUrl },
    { name: "サプリメントの選び方", url: `${siteUrl}/how-to-choose` },
  ]);

  return (
    <>
      <script
        id="howto-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div
        className="min-h-screen pb-20"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              サプリメントの選び方ガイド
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              5つのステップで、あなたに最適なサプリを見つける
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {["エビデンス", "安全性", "コスパ", "価格", "成分量"].map(
                (item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-white/20 rounded-full backdrop-blur"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <nav
            className="text-sm"
            style={{ color: appleWebColors.textSecondary }}
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:underline"
                  style={{ color: appleWebColors.blue }}
                >
                  ホーム
                </Link>
              </li>
              <li>/</li>
              <li style={{ color: appleWebColors.textPrimary }}>
                サプリメントの選び方
              </li>
            </ol>
          </nav>
        </div>

        {/* Introduction */}
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div
            className={`p-6 rounded-xl border border-amber-200 bg-amber-50 mb-12`}
          >
            <div className="flex gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-amber-800 mb-2">
                  なぜサプリ選びに失敗するのか？
                </h2>
                <p className="text-amber-700 text-sm leading-relaxed">
                  多くの人がサプリ選びで失敗する理由は、「価格」や「口コミ」だけで判断してしまうからです。
                  サプティアでは、科学的エビデンス、安全性、コストパフォーマンス、価格、成分量の
                  <strong>5つの柱</strong>
                  で客観的に評価。この5つのステップに沿って選べば、あなたに本当に合ったサプリが見つかります。
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {howToSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <section
                  key={index}
                  id={`step-${index + 1}`}
                  className={`p-6 rounded-xl border border-slate-200 ${liquidGlassClasses.light}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-indigo-500" />
                        <h2
                          className="text-xl font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {step.name}
                        </h2>
                      </div>
                      <p
                        className="leading-relaxed mb-4"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {step.text}
                      </p>

                      {/* Tips */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ポイント
                        </h3>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="text-sm text-slate-600 flex items-start gap-2"
                            >
                              <span className="text-indigo-400 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <div
              className={`p-8 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50`}
            >
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                サプティアで最適なサプリを見つけよう
              </h2>
              <p
                className="mb-6"
                style={{ color: appleWebColors.textSecondary }}
              >
                476件以上の商品を5つの柱で客観評価。
                <br />
                あなたに合ったサプリがきっと見つかります。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  無料診断を試す
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 transition-colors"
                >
                  商品一覧を見る
                </Link>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-8 p-4 rounded-lg border border-red-200 bg-red-50">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-bold mb-1">ご注意</p>
                <p>
                  サプリメントは医薬品ではありません。疾病の治療や予防を目的としたものではなく、健康的な生活をサポートするものです。
                  持病のある方、妊娠中・授乳中の方、医薬品を服用中の方は、必ず医師にご相談の上でご利用ください。
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-6 h-6 text-indigo-500" />
              <h2
                className="text-2xl font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                よくある質問
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className={`group p-4 rounded-xl border border-slate-200 ${liquidGlassClasses.light}`}
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span
                      className="font-medium pr-4"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p
                    className="mt-3 pt-3 border-t border-slate-100 text-sm leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
