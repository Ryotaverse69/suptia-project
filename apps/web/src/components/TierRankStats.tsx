"use client";

import { TierRatings } from "@/lib/tier-ranking";
import { TierRank } from "@/lib/tier-colors";
import { Info, Crown, Star, Activity, Zap } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  tierColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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

  // Apple HIG式ランクカラー
  const getRankColor = (rank: TierRank): string => {
    return tierColors[rank].border;
  };

  return (
    <div
      className={`relative overflow-hidden ${liquidGlassClasses.light} ${className}`}
      style={{
        fontFamily: fontStack,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
              }}
            >
              <Activity className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2
                className="text-[17px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                市場全体分析
              </h2>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                全商品のランク分布状況
              </p>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-[13px] font-medium"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              color: appleWebColors.textSecondary,
            }}
          >
            {totalProducts}商品
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Key Metrics */}
          <div className="lg:col-span-5 space-y-4">
            {/* S+ Rank Card */}
            <div
              className="relative overflow-hidden rounded-[16px] p-4 border"
              style={{
                background: `linear-gradient(135deg, ${tierColors["S+"].border}15 0%, rgba(255, 255, 255, 0.9) 100%)`,
                borderColor: `${tierColors["S+"].border}30`,
              }}
            >
              <div className="absolute top-2 right-2 opacity-10">
                <Crown
                  className="w-14 h-14"
                  style={{ color: tierColors["S+"].border }}
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tierColors["S+"].border }}
                  />
                  <span
                    className="text-[12px] font-bold uppercase tracking-wider"
                    style={{ color: tierColors["S+"].border }}
                  >
                    最高評価 S+ Tier
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[34px] font-bold"
                    style={{ color: tierColors["S+"].border }}
                  >
                    {rankCounts["S+"]}
                  </span>
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: `${tierColors["S+"].border}99` }}
                  >
                    商品
                  </span>
                </div>
                <div
                  className="text-[13px] mt-1"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  上位{" "}
                  {totalProducts > 0
                    ? Math.round((rankCounts["S+"] / totalProducts) * 100)
                    : 0}
                  % のエリート商品
                </div>
              </div>
            </div>

            {/* High Quality Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-4 rounded-[16px] border"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star
                    className="w-4 h-4"
                    style={{ color: systemColors.green }}
                  />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: appleWebColors.textTertiary }}
                  >
                    高品質
                  </span>
                </div>
                <div
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {rankCounts["S+"] + rankCounts.S + rankCounts.A}
                </div>
                <div
                  className="text-[12px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  推奨ランク以上
                </div>
              </div>
              <div
                className="p-4 rounded-[16px] border"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap
                    className="w-4 h-4"
                    style={{ color: systemColors.blue }}
                  />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: appleWebColors.textTertiary }}
                  >
                    市場シェア
                  </span>
                </div>
                <div
                  className="text-[22px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {totalProducts > 0
                    ? Math.round(
                        ((rankCounts["S+"] + rankCounts.S + rankCounts.A) /
                          totalProducts) *
                          100,
                      )
                    : 0}
                  <span
                    className="text-[15px] font-normal ml-0.5"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    %
                  </span>
                </div>
                <div
                  className="text-[12px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  高品質商品の割合
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Distribution Bars */}
          <div
            className="lg:col-span-7 rounded-[16px] p-4 border"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h3
              className="text-[12px] font-semibold uppercase tracking-wider mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              ランク分布詳細
            </h3>
            <div className="space-y-3">
              {rankPercentages.map(({ rank, count, percentage }) => (
                <div key={rank}>
                  <div className="flex items-end justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[15px] font-bold"
                        style={{ color: getRankColor(rank) }}
                      >
                        {rank}
                      </span>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        TIER
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-[15px] font-semibold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {count}
                      </span>
                      <span
                        className="text-[12px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div
                    className="relative h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                  >
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getRankColor(rank),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div
          className="mt-5 pt-4 border-t flex items-start gap-2"
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <Info
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: appleWebColors.textTertiary }}
          />
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: appleWebColors.textSecondary }}
          >
            総合評価アルゴリズム:
            価格・コスパ・含有量・エビデンス・安全性の5軸解析に基づき算出。
            <span style={{ color: tierColors["S+"].border }}>S+ランク</span>
            は全評価軸において最高水準を満たした「5冠達成」商品にのみ付与されます。
          </p>
        </div>
      </div>
    </div>
  );
}
