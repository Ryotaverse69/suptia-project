"use client";

import { TierRatings } from "@/lib/tier-ranking";
import { TierRank } from "@/lib/tier-colors";
import {
  DollarSign,
  Zap,
  Beaker,
  FileText,
  ShieldCheck,
  Trophy,
  Info,
} from "lucide-react";

interface TierEvaluationDetailProps {
  tierRatings: TierRatings;
  className?: string;
}

/**
 * 個別商品のTier評価詳細を表示するコンポーネント
 * 5つの評価軸ごとのランクと総合評価を表示
 */
export function TierEvaluationDetail({
  tierRatings,
  className = "",
}: TierEvaluationDetailProps) {
  const rankStyles: Record<
    TierRank,
    { bg: string; text: string; glow: string; border: string }
  > = {
    "S+": {
      bg: "bg-purple-500",
      text: "text-purple-600",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
      border: "border-purple-500/30",
    },
    S: {
      bg: "bg-indigo-500",
      text: "text-indigo-600",
      glow: "shadow-[0_0_15px_rgba(99,102,241,0.4)]",
      border: "border-indigo-500/30",
    },
    A: {
      bg: "bg-blue-500",
      text: "text-blue-600",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      border: "border-blue-500/30",
    },
    B: {
      bg: "bg-emerald-500",
      text: "text-emerald-600",
      glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]",
      border: "border-emerald-500/30",
    },
    C: {
      bg: "bg-amber-500",
      text: "text-amber-600",
      glow: "shadow-none",
      border: "border-amber-500/30",
    },
    D: {
      bg: "bg-slate-500",
      text: "text-slate-600",
      glow: "shadow-none",
      border: "border-slate-500/30",
    },
  };

  const evaluationAxes = [
    {
      icon: DollarSign,
      label: "価格評価",
      description: "同カテゴリ商品との価格比較",
      rank: tierRatings.priceRank as TierRank,
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      icon: Zap,
      label: "コスパ評価",
      description: "成分量あたりの価格効率",
      rank: tierRatings.costEffectivenessRank as TierRank,
      iconBg: "bg-purple-50",
      iconText: "text-purple-600",
    },
    {
      icon: Beaker,
      label: "含有量評価",
      description: "主要成分の配合量",
      rank: tierRatings.contentRank as TierRank,
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    {
      icon: FileText,
      label: "エビデンス評価",
      description: "科学的根拠の信頼性",
      rank: tierRatings.evidenceRank as TierRank,
      iconBg: "bg-indigo-50",
      iconText: "text-indigo-600",
    },
    {
      icon: ShieldCheck,
      label: "安全性評価",
      description: "添加物・副作用リスク",
      rank: tierRatings.safetyRank as TierRank,
      iconBg: "bg-teal-50",
      iconText: "text-teal-600",
    },
  ];

  const overallRank = tierRatings.overallRank as TierRank;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl ${className}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
              <Trophy className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                総合評価詳細
              </h2>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                5軸評価アルゴリズム v2.0
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-mono text-slate-600">
            個別商品評価
          </div>
        </div>

        {/* Overall Rank Card */}
        <div className="mb-6 sm:mb-8 relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-20 sm:w-32 h-20 sm:h-32 text-purple-600 rotate-12" />
          </div>
          <div className="p-5 sm:p-8 relative z-10">
            <div className="flex items-center justify-center flex-col">
              <span className="text-[10px] sm:text-xs font-bold text-purple-600 tracking-wider uppercase mb-3 sm:mb-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                総合評価ランク
              </span>
              <div className="text-[5rem] sm:text-[8rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-indigo-600 drop-shadow-2xl mb-3 sm:mb-4">
                {overallRank}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                全5項目を総合的に評価
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-50" />
        </div>

        {/* Evaluation Axes Grid */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            評価軸別ランク
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluationAxes.map((axis, idx) => {
              const Icon = axis.icon;
              const style = rankStyles[axis.rank];
              return (
                <div
                  key={idx}
                  className={`relative p-4 rounded-xl border ${style.border} bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all group`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${axis.iconBg} ${axis.iconText}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {axis.label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {axis.description}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${style.border} ${style.bg.replace("500", "50")} ${style.glow}`}
                    >
                      <span className="text-xs font-bold text-slate-500">
                        RANK
                      </span>
                      <span
                        className={`text-2xl font-black leading-none ${style.text}`}
                      >
                        {axis.rank}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
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
