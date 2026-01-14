/**
 * mg単価計算機ページ - Apple HIG Design
 */

import { Metadata } from "next";
import { Suspense } from "react";
import { MgCalculator } from "./calculator";
import Link from "next/link";
import {
  ChevronLeft,
  ArrowUpRight,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "サプリのコスパ計算機 - mg単価で本当のお得を知る | サプティア",
  description:
    "サプリメントの1mgあたりの価格（mg単価）を計算して、本当にコスパが良いか確認できる無料ツール。30日分・90日分のコストも自動計算。",
  keywords: ["サプリ", "コスパ", "計算", "mg単価", "比較", "価格"],
  openGraph: {
    title: "サプリのコスパ計算機 | サプティア",
    description: "mg単価を計算して本当にお得なサプリを見つけよう",
    type: "website",
  },
};

// JSON-LD構造化データ
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "サプリのコスパ計算機",
  description: "サプリメントのmg単価を計算するツール",
  url: "https://suptia.com/tools/mg-calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  provider: {
    "@type": "Organization",
    name: "サプティア",
    url: "https://suptia.com",
  },
};

const popularIngredients = [
  { name: "ビタミンC", slug: "vitamin-c" },
  { name: "ビタミンD", slug: "vitamin-d" },
  { name: "マルチビタミン", slug: "multivitamin" },
  { name: "鉄分", slug: "iron" },
  { name: "亜鉛", slug: "zinc" },
  { name: "マグネシウム", slug: "magnesium" },
];

export default function MgCalculatorPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#fbfbfd]">
        {/* Navigation */}
        <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-0.5 text-[17px] font-normal text-[#0071e3] hover:underline"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
              ツール
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 pb-8 md:pt-16 md:pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] shadow-lg mb-6">
              <span className="text-4xl">💊</span>
            </div>

            {/* Title */}
            <h1
              className="text-[32px] md:text-[48px] font-bold leading-[1.08] tracking-[-0.02em] text-[#1d1d1f] mb-4"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              サプリのコスパ計算機
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] md:text-[19px] leading-[1.47] text-[#515154] max-w-xl mx-auto tracking-[-0.022em]">
              手持ちのサプリメントの「mg単価」を計算して、
              <br className="hidden md:block" />
              本当にお得かどうかを確認しましょう。
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Suspense fallback={<CalculatorSkeleton />}>
              <MgCalculator />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#f5f5f7] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2
                className="text-[24px] md:text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1d1d1f] mb-3"
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                }}
              >
                サプティアで最安値を探す
              </h2>
              <p className="text-[15px] md:text-[17px] text-[#515154] leading-[1.47]">
                476商品以上の中から、mg単価・安全性・エビデンスで比較できます
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {popularIngredients.map((ingredient) => (
                <Link
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  className="
                    inline-flex items-center gap-1.5
                    px-5 py-2.5
                    bg-white
                    border border-black/[0.08]
                    rounded-full
                    text-[15px] font-medium text-[#1d1d1f]
                    shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                    hover:-translate-y-0.5
                    transition-all duration-200
                  "
                >
                  {ingredient.name}
                  <ArrowUpRight size={14} className="text-[#86868b]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* mg単価とは */}
            <ContentBlock
              icon={<Lightbulb size={24} />}
              iconColor="from-[#FF9500] to-[#FFCC00]"
              title="mg単価とは？"
            >
              <p className="text-[17px] leading-[1.65] text-[#1d1d1f] mb-4">
                mg単価とは、サプリメントの有効成分
                <strong>1mgあたりの価格</strong>のことです。
              </p>
              <p className="text-[17px] leading-[1.65] text-[#515154]">
                例えば、1,000mgのビタミンCが入った商品が1,000円なら、mg単価は1円/mgになります。
                この指標を使うことで、内容量や価格が異なる商品同士を公平に比較することができます。
              </p>
            </ContentBlock>

            {/* なぜmg単価で比較するのか */}
            <ContentBlock
              icon={<AlertTriangle size={24} />}
              iconColor="from-[#FF3B30] to-[#FF9500]"
              title="なぜmg単価で比較するのか"
            >
              <p className="text-[17px] leading-[1.65] text-[#515154] mb-6">
                サプリメントのパッケージには「60粒入り」「90日分」などと書かれていますが、
                実際に含まれる成分量は商品によって大きく異なります。
              </p>

              <div className="space-y-4">
                <TrapCard
                  title="粒数の罠"
                  description="60粒入りでも1粒500mgと1粒1000mgでは、実質的な量が2倍違います"
                />
                <TrapCard
                  title="日数の罠"
                  description="「90日分」でも推奨摂取量が少ないと、実際の成分量は少なくなります"
                />
                <TrapCard
                  title="価格の罠"
                  description="安い商品でも成分量が少なければ、mg単価は高くなります"
                />
              </div>
            </ContentBlock>

            {/* サプティアの5つの評価軸 */}
            <ContentBlock
              icon={<CheckCircle2 size={24} />}
              iconColor="from-[#34C759] to-[#00C7BE]"
              title="サプティアの5つの評価軸"
            >
              <p className="text-[17px] leading-[1.65] text-[#515154] mb-6">
                サプティアでは、mg単価（コスパ）だけでなく、以下の5つの軸で商品を評価しています。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EvaluationAxis
                  emoji="💰"
                  label="価格"
                  description="複数ECサイトでの価格比較"
                />
                <EvaluationAxis
                  emoji="📊"
                  label="成分量"
                  description="1日あたり有効成分量（mg正規化）"
                />
                <EvaluationAxis
                  emoji="💡"
                  label="コスパ"
                  description="成分量あたりの価格（¥/mg）"
                />
                <EvaluationAxis
                  emoji="🔬"
                  label="エビデンス"
                  description="S/A/B/C/Dの5段階評価"
                />
                <EvaluationAxis
                  emoji="🛡️"
                  label="安全性"
                  description="0-100点、副作用・相互作用警告"
                />
              </div>
            </ContentBlock>

            {/* FAQ */}
            <ContentBlock
              icon={<HelpCircle size={24} />}
              iconColor="from-[#007AFF] to-[#5856D6]"
              title="よくある質問"
            >
              <div className="space-y-6">
                <FAQItem
                  question="mg単価が低ければ良い商品ですか？"
                  answer="mg単価はコストパフォーマンスの指標であり、品質や安全性は別の観点で評価する必要があります。サプティアでは、mg単価に加えてエビデンスレベルや安全性スコアも確認できます。"
                />
                <FAQItem
                  question="計算結果をシェアできますか？"
                  answer="はい、「URLをコピー」ボタンで結果を含むURLをコピーできます。ブログやSNSでのシェアにご活用ください。"
                />
                <FAQItem
                  question="このツールをブログに埋め込めますか？"
                  answer={
                    <>
                      はい、無料で埋め込み可能です。
                      <Link
                        href="/tools"
                        className="text-[#0071e3] hover:underline ml-1"
                      >
                        ツール一覧ページ
                      </Link>
                      で埋め込みコードを確認できます。
                    </>
                  }
                />
              </div>
            </ContentBlock>
          </div>
        </section>
      </main>
    </>
  );
}

function CalculatorSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-pulse">
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.04] rounded-[20px] p-6 h-[420px]" />
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.04] rounded-[20px] p-6 h-[420px]" />
    </div>
  );
}

function ContentBlock({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-16 last:mb-0">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${iconColor} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
        <h2
          className="text-[24px] md:text-[28px] font-bold text-[#1d1d1f] tracking-[-0.02em]"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}
        >
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-16">{children}</div>
    </div>
  );
}

function TrapCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-black/[0.04] rounded-[14px] p-4">
      <h4 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">{title}</h4>
      <p className="text-[15px] text-[#515154] leading-[1.47]">{description}</p>
    </div>
  );
}

function EvaluationAxis({
  emoji,
  label,
  description,
}: {
  emoji: string;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm border border-black/[0.04] rounded-[14px] p-4">
      <span className="text-2xl">{emoji}</span>
      <div>
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] mb-0.5">
          {label}
        </h4>
        <p className="text-[13px] text-[#86868b] leading-[1.4]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
        Q. {question}
      </h3>
      <p className="text-[15px] text-[#515154] leading-[1.65]">A. {answer}</p>
    </div>
  );
}
