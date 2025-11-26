"use client";

import { TierRatings } from "@/lib/tier-ranking";
import { TierRank } from "@/lib/tier-colors";
import { Trophy, Info, Crown, Award, Star, Activity, Zap } from "lucide-react";

interface Product {
  _id: string;
  tierRatings?: TierRatings;
}

interface TierRankStatsProps {
  products: Product[];
  className?: string;
}

/**
 * Tierランク統計情報を表示するコンポーネント
 * Futuristic / HUD Style
 */
export function TierRankStats({
  products,
  className = "",
}: TierRankStatsProps) {
  const productsWithTierRatings = products.filter((p) => p.tierRatings);
  const totalProducts = productsWithTierRatings.length;

  if (totalProducts === 0) {
    return null;
  }

  const rankCounts: Record<TierRank, number> = {
    "S+": 0,
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  productsWithTierRatings.forEach((product) => {
    const overallRank = product.tierRatings?.overallRank as TierRank;
    if (overallRank && overallRank in rankCounts) {
      rankCounts[overallRank]++;
    }
  });

  const rankPercentages = Object.entries(rankCounts).map(([rank, count]) => ({
    rank: rank as TierRank,
    count,
    percentage: Math.round((count / totalProducts) * 100),
  }));

  // Futuristic Color Palette & Glows
  const rankStyles: Record<
    TierRank,
    { bg: string; text: string; glow: string; border: string }
  > = {
    "S+": {
      bg: "bg-purple-500/10",
      text: "text-purple-600",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
      border: "border-purple-500/30",
    },
    S: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-600",
      glow: "shadow-[0_0_10px_rgba(99,102,241,0.3)]",
      border: "border-indigo-500/30",
    },
    A: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      glow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
      border: "border-blue-500/30",
    },
    B: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]",
      border: "border-emerald-500/30",
    },
    C: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      glow: "shadow-none",
      border: "border-amber-500/30",
    },
    D: {
      bg: "bg-slate-500/10",
      text: "text-slate-600",
      glow: "shadow-none",
      border: "border-slate-500/30",
    },
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl ${className}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm">
              <Activity className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                市場全体分析
              </h2>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                全商品のランク分布状況
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-mono text-slate-600">
            分析対象: {totalProducts}商品
          </div>
        </div>

        {/* HUD Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Key Metrics */}
          <div className="lg:col-span-5 space-y-3">
            {/* S+ Rank Card (Hero) */}
            <div className="relative group overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-md transition-all hover:shadow-purple-200/50">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Crown className="w-16 h-16 text-purple-600 rotate-12" />
              </div>
              <div className="p-3 relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">
                    最高評価 S+ Tier
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    {rankCounts["S+"]}
                  </span>
                  <span className="text-sm font-medium text-purple-600/70">
                    商品
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  上位{" "}
                  {totalProducts > 0
                    ? Math.round((rankCounts["S+"] / totalProducts) * 100)
                    : 0}
                  % のエリート商品
                </div>
              </div>
              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-50" />
            </div>

            {/* High Quality Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-white/60 border border-slate-200 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    高品質 (S+/S/A)
                  </span>
                </div>
                <div className="text-xl font-bold text-slate-800">
                  {rankCounts["S+"] + rankCounts.S + rankCounts.A}
                </div>
                <div className="text-[10px] text-slate-400">推奨ランク以上</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/60 border border-slate-200 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    市場シェア
                  </span>
                </div>
                <div className="text-xl font-bold text-slate-800">
                  {totalProducts > 0
                    ? Math.round(
                        ((rankCounts["S+"] + rankCounts.S + rankCounts.A) /
                          totalProducts) *
                          100,
                      )
                    : 0}
                  <span className="text-sm font-normal text-slate-400 ml-0.5">
                    %
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  高品質商品の割合
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Distribution Bars */}
          <div className="lg:col-span-7 bg-white/40 rounded-lg border border-white/60 p-3 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              ランク分布詳細
            </h3>
            <div className="space-y-2.5">
              {rankPercentages.map(({ rank, count, percentage }) => (
                <div key={rank} className="group">
                  <div className="flex items-end justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono text-sm font-bold ${rankStyles[rank].text}`}
                      >
                        {rank}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        TIER
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-sm font-bold text-slate-700">
                        {count}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${rankStyles[rank].bg.replace("/10", "")} ${rankStyles[rank].glow}`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            総合評価アルゴリズム v2.0:
            価格・コスパ・含有量・エビデンス・安全性の5軸解析に基づき算出。
            <span className="text-purple-600/80">S+ランク</span>
            は全評価軸において最高水準を満たした「5冠達成」商品にのみ付与されます。
          </p>
        </div>
      </div>
    </div>
  );
}
