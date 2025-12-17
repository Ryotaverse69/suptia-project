/**
 * 埋め込み用mg単価計算機ページ
 * iframe で外部サイトに埋め込むための軽量版
 */

import { Metadata } from "next";
import { Suspense } from "react";
import { EmbedCalculator } from "./embed-calculator";

export const metadata: Metadata = {
  title: "サプリのコスパ計算機 | Suptia",
  description: "サプリメントのmg単価を計算するツール",
  robots: "noindex, nofollow",
};

export default function EmbedMgCalculatorPage() {
  return (
    <main className="bg-[#fbfbfd] p-3 min-h-full">
      <Suspense fallback={<EmbedSkeleton />}>
        <EmbedCalculator />
      </Suspense>

      {/* Suptia へのリンク */}
      <div className="mt-3 pt-2 border-t border-black/[0.06]">
        <a
          href="https://suptia.com/tools/mg-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-[10px] text-[#86868b] hover:text-[#007AFF] transition-colors"
        >
          Powered by <span className="font-semibold">Suptia</span>
        </a>
      </div>
    </main>
  );
}

function EmbedSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-5 bg-[#f5f5f7] rounded w-24" />
      <div className="h-8 bg-[#f5f5f7] rounded" />
      <div className="h-8 bg-[#f5f5f7] rounded" />
      <div className="h-8 bg-[#f5f5f7] rounded" />
    </div>
  );
}
