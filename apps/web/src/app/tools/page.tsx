/**
 * ツール一覧ページ - Apple HIG Design
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Scale,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { EmbedCodeSection } from "./embed-code-section";

export const metadata: Metadata = {
  title: "無料ツール | サプティア",
  description:
    "サプリメント選びに役立つ無料ツール。mg単価計算機、サプリ比較ツール、栄養素チェックツールなど。",
};

const tools = [
  {
    id: "mg-calculator",
    title: "サプリのコスパ計算機",
    description: "mg単価を計算して、本当にお得かどうかを確認できます",
    icon: Calculator,
    href: "/tools/mg-calculator",
    status: "available" as const,
    gradient: "from-[#007AFF] to-[#5AC8FA]",
  },
  {
    id: "compare",
    title: "サプリ比較ツール",
    description: "2つの商品を並べて、コスパを直接比較できます",
    icon: Scale,
    href: "/tools/compare",
    status: "coming" as const,
    comingDate: "Coming Soon",
    gradient: "from-[#AF52DE] to-[#FF2D55]",
  },
  {
    id: "nutrition-check",
    title: "栄養素チェック",
    description: "あなたの生活習慣から、関連性の高い栄養素を表示します",
    icon: ClipboardCheck,
    href: "/tools/nutrition-check",
    status: "coming" as const,
    comingDate: "Coming Soon",
    gradient: "from-[#34C759] to-[#00C7BE]",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#007AFF]/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#007AFF]/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 text-[15px] font-medium text-[#0071e3] mb-6 tracking-[-0.01em]">
            <Sparkles size={16} />
            無料で使える
          </p>

          {/* Title */}
          <h1
            className="text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-[-0.02em] text-[#1d1d1f] mb-6"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            サプリ選びを、
            <br className="md:hidden" />
            もっと賢く。
          </h1>

          {/* Subtitle */}
          <p className="text-[19px] md:text-[21px] leading-[1.47] text-[#515154] max-w-2xl mx-auto tracking-[-0.022em]">
            価格だけでは分からない、本当のコスパを計算。
            <br className="hidden md:block" />
            あなたのサプリ選びをサポートする無料ツールです。
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Embed Section */}
      <EmbedCodeSection />
    </main>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[0] }) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available";

  const CardContent = (
    <div
      className={`
        group relative h-full
        bg-white/80 backdrop-blur-xl backdrop-saturate-[180%]
        border border-black/[0.04]
        rounded-[20px]
        p-6 md:p-8
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        transition-all duration-300
        ${
          isAvailable
            ? "hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer"
            : "opacity-60"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-14 h-14 rounded-[16px] mb-6
          flex items-center justify-center
          bg-gradient-to-br ${tool.gradient}
          shadow-lg
        `}
      >
        <Icon size={26} className="text-white" strokeWidth={1.5} />
      </div>

      {/* Status Badge */}
      {isAvailable ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium bg-[#34C759]/10 text-[#34C759] rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-[#34C759] rounded-full animate-pulse" />
          利用可能
        </span>
      ) : (
        <span className="inline-block px-3 py-1 text-[13px] font-medium bg-[#f5f5f7] text-[#86868b] rounded-full mb-4">
          {tool.comingDate}
        </span>
      )}

      {/* Title */}
      <h3
        className="text-[20px] font-semibold text-[#1d1d1f] mb-2 leading-[1.25] tracking-[-0.01em]"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}
      >
        {tool.title}
      </h3>

      {/* Description */}
      <p className="text-[15px] text-[#515154] leading-[1.47] mb-6 tracking-[-0.01em]">
        {tool.description}
      </p>

      {/* CTA */}
      {isAvailable && (
        <div className="flex items-center gap-1 text-[17px] font-semibold text-[#0071e3]">
          使ってみる
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      )}
    </div>
  );

  if (isAvailable) {
    return (
      <Link href={tool.href} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
