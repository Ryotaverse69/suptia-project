"use client";

import { TierRatings } from "@/lib/tier-ranking";
import { TierRank } from "@/lib/tier-colors";

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
 * - 全商品数
 * - S+ランク（5冠達成）商品数
 * - 各ランクの分布
 */
export function TierRankStats({
  products,
  className = "",
}: TierRankStatsProps) {
  // tierRatingsがある商品のみをカウント
  const productsWithTierRatings = products.filter((p) => p.tierRatings);
  const totalProducts = productsWithTierRatings.length;

  if (totalProducts === 0) {
    return null;
  }

  // 総合評価別の集計
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

  // パーセンテージ計算
  const rankPercentages = Object.entries(rankCounts).map(([rank, count]) => ({
    rank: rank as TierRank,
    count,
    percentage: Math.round((count / totalProducts) * 100),
  }));

  // ランク別の色（ツヤツヤグラデーション付き）
  const rankColors: Record<TierRank, string> = {
    "S+": "bg-gradient-to-br from-purple-500/80 via-pink-500/70 to-yellow-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    S: "bg-gradient-to-br from-purple-500/80 via-purple-500/70 to-purple-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    A: "bg-gradient-to-br from-blue-500/80 via-blue-500/70 to-blue-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    B: "bg-gradient-to-br from-green-500/80 via-green-500/70 to-green-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    C: "bg-gradient-to-br from-yellow-500/80 via-yellow-500/70 to-yellow-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    D: "bg-gradient-to-br from-gray-400/80 via-gray-400/70 to-gray-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
  };

  // ランク別のテキスト色（ツヤツヤ感のため濃く）
  const rankTextColors: Record<TierRank, string> = {
    "S+": "text-purple-800",
    S: "text-purple-800",
    A: "text-blue-800",
    B: "text-green-800",
    C: "text-yellow-800",
    D: "text-gray-800",
  };

  // ガラス光沢シャドウ（ツヤツヤ感強化）
  const glassTextShadow = {
    textShadow:
      "0 2px 0 rgba(255,255,255,1), 0 3px 2px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)",
  } as React.CSSProperties;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        🏆 総合評価の分布
      </h2>

      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">評価済み商品</div>
          <div className="text-3xl font-bold text-gray-900">
            {totalProducts}
          </div>
          <div className="text-xs text-gray-500 mt-1">件</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">S+ランク（5冠達成）</div>
          <div className="text-3xl font-bold text-purple-700">
            {rankCounts["S+"]}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            全体の
            {totalProducts > 0
              ? Math.round((rankCounts["S+"] / totalProducts) * 100)
              : 0}
            %
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">高品質商品（S～A）</div>
          <div className="text-3xl font-bold text-green-700">
            {rankCounts["S+"] + rankCounts.S + rankCounts.A}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            全体の
            {totalProducts > 0
              ? Math.round(
                  ((rankCounts["S+"] + rankCounts.S + rankCounts.A) /
                    totalProducts) *
                    100,
                )
              : 0}
            %
          </div>
        </div>
      </div>

      {/* ランク分布 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">ランク別</h3>
        <div className="space-y-2">
          {rankPercentages.map(({ rank, count, percentage }) => (
            <div key={rank} className="flex items-center gap-2">
              {/* ランクラベル */}
              <div className="relative w-12 h-8">
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded font-black text-sm ${rankColors[rank]} ${rankTextColors[rank]}`}
                >
                  <span style={glassTextShadow}>{rank}</span>
                </div>
                {/* キラキラハイライト（複数レイヤー） */}
                <div className="absolute inset-0 rounded bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              </div>

              {/* プログレスバー */}
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden shadow-inner">
                <div
                  className="relative h-full"
                  style={{ width: `${percentage}%` }}
                >
                  {/* 背景グラデーション */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${rankColors[rank]}`}
                  ></div>
                  {/* キラキラオーバーレイ（複数レイヤー） */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent"></div>
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent"></div>

                  {percentage > 10 && (
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${rankTextColors[rank]} z-10`}
                      style={glassTextShadow}
                    >
                      {count}件 ({percentage}%)
                    </span>
                  )}
                </div>
                {percentage <= 10 && count > 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {count}件
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 説明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          💡 <span className="font-semibold">総合評価</span>
          は、価格・コスパ・含有量・エビデンス・安全性の5つの評価軸を重み付け平均して算出しています。
          <span className="font-semibold text-purple-700">S+ランク</span>
          は、すべての評価軸でSランクを獲得した「5冠達成」商品です。
        </p>
      </div>
    </div>
  );
}
