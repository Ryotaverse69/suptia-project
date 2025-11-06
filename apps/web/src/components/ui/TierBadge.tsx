/**
 * TierBadgeコンポーネント
 *
 * 5つの評価軸（価格・コスパ・含有量・エビデンス・安全性）のTierランクを
 * 横並び1列で表示
 * + 総合評価（Overall Rank）の表示機能を追加
 */

import { TierRank, getTierColor } from "@/lib/tier-colors";
import { TierRatings, isPerfectProduct } from "@/lib/tier-ranking";

interface TierBadgeProps {
  ratings: TierRatings;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean; // ラベル表示（デフォルト: false）
  showOverall?: boolean; // 総合評価表示（デフォルト: false）
}

/**
 * 5つのTierバッジを横並びで表示
 * showOverall=trueの場合、総合評価を最初に大きく表示
 */
export function TierBadgeRow({
  ratings,
  size = "md",
  showLabels = false,
  showOverall = false,
}: TierBadgeProps) {
  const badges = [
    { icon: "💰", label: "価格", rank: ratings.priceRank },
    { icon: "💡", label: "コスパ", rank: ratings.costEffectivenessRank },
    { icon: "📊", label: "含有量", rank: ratings.contentRank },
    { icon: "🔬", label: "エビデンス", rank: ratings.evidenceRank },
    { icon: "🛡️", label: "安全性", rank: ratings.safetyRank },
  ];

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px] gap-0.5",
    md: "px-2 py-1 text-xs gap-1",
    lg: "px-3 py-1.5 text-sm gap-1.5",
  };

  const overallRank = ratings.overallRank || "D";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 総合評価（オプション） */}
      {showOverall && (
        <OverallRankBadge rank={overallRank} size={size} showLabel={false} />
      )}

      {/* 区切り線 */}
      {showOverall && (
        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
      )}

      {/* 5つの評価軸バッジ */}
      <div className="flex flex-wrap gap-1.5">
        {badges.map((badge) => {
          const tierColor = getTierColor(badge.rank as TierRank);
          return (
            <div
              key={badge.label}
              className={`flex items-center rounded-md border-2 font-bold ${tierColor.className} ${sizeClasses[size]}`}
              title={`${badge.label}: ${tierColor.label}`}
            >
              <span>{badge.icon}</span>
              {showLabels && (
                <span className="hidden sm:inline">{badge.label}</span>
              )}
              <span>{badge.rank}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 単一のTierバッジ（個別表示用）
 */
export function TierBadge({
  icon,
  label,
  rank,
  size = "md",
}: {
  icon: string;
  label: string;
  rank: TierRank;
  size?: "sm" | "md" | "lg";
}) {
  const tierColor = getTierColor(rank);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border-2 font-semibold ${tierColor.className} ${sizeClasses[size]}`}
      title={`${label}: ${tierColor.label}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      <span className="font-bold text-lg">{rank}</span>
    </div>
  );
}

/**
 * Tierランクの詳細表示（商品詳細ページ用）
 * 総合評価を最初に大きく表示し、その後に5つの評価軸を表示
 */
export function TierBadgeGrid({ ratings }: { ratings: TierRatings }) {
  const badges = [
    {
      icon: "💰",
      label: "価格",
      rank: ratings.priceRank,
      description: "他商品との価格比較",
    },
    {
      icon: "💡",
      label: "コスパ",
      rank: ratings.costEffectivenessRank,
      description: "成分量あたりの価格効率",
    },
    {
      icon: "📊",
      label: "含有量",
      rank: ratings.contentRank,
      description: "主要成分の含有量",
    },
    {
      icon: "🔬",
      label: "エビデンス",
      rank: ratings.evidenceRank,
      description: "科学的根拠の信頼性",
    },
    {
      icon: "🛡️",
      label: "安全性",
      rank: ratings.safetyRank,
      description: "安全性評価スコア",
    },
  ];

  const isPerfect = isPerfectProduct(ratings);
  const overallRank = ratings.overallRank || "D";

  return (
    <div className="space-y-4">
      {/* 5冠達成バナー */}
      {isPerfect && <PerfectProductBanner />}

      {/* 総合評価 - コンパクト＆高級感 */}
      <div className="flex flex-col items-center gap-2.5">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">
          総合評価
        </h3>
        <OverallRankBadge rank={overallRank} size="lg" showLabel={true} />
        <p className="text-xs text-gray-600 text-center max-w-md leading-relaxed">
          5つの評価軸を重み付け平均した総合評価
        </p>
      </div>

      {/* 5つの評価軸 - コンパクト＆高級感 */}
      <div>
        <h4 className="text-base font-semibold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-3 text-center">
          評価軸別スコア
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {badges.map((badge) => {
            const tierColor = getTierColor(badge.rank as TierRank);
            return (
              <div
                key={badge.label}
                className={`group relative flex flex-col items-center p-3 rounded-lg border ${tierColor.className}
                  transition-all duration-300 hover:scale-105 hover:shadow-xl
                  before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  hover:before:opacity-100 before:transition-opacity`}
              >
                <div className="text-2xl mb-1.5 transition-transform group-hover:scale-110">
                  {badge.icon}
                </div>
                <div className="text-xs font-semibold mb-1">{badge.label}</div>
                <div className="text-2xl font-bold mb-1.5 drop-shadow-sm">
                  {badge.rank}
                </div>
                <div className="text-[10px] text-center opacity-70 leading-tight">
                  {badge.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 総合評価バッジ（Overall Rank）
 * S+ランクの場合は特別なグラデーション + アニメーション効果
 */
export function OverallRankBadge({
  rank,
  size = "lg",
  showLabel = true,
}: {
  rank: TierRank;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const tierColor = getTierColor(rank);
  const isSPlus = rank === "S+";

  const sizeClasses = {
    sm: "px-2.5 py-1.5",
    md: "px-4 py-2.5",
    lg: "px-6 py-3",
  };

  const rankSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  // リキッドグラス風の背景スタイル（ツヤツヤグラデーション付き）
  const glassStyle = {
    sm: "backdrop-blur-md bg-gradient-to-br from-white/40 via-white/20 to-white/10 border border-white/40 shadow-lg",
    md: "backdrop-blur-lg bg-gradient-to-br from-white/50 via-white/25 to-white/15 border-2 border-white/50 shadow-xl",
    lg: "backdrop-blur-xl bg-gradient-to-br from-white/60 via-white/30 to-white/20 border-2 border-white/60 shadow-2xl",
  };

  // ランク別の立体感のある色スタイル（ツヤツヤ感のため濃く）
  const textColorClasses: Record<TierRank, string> = {
    "S+": "text-purple-800",
    S: "text-purple-800",
    A: "text-blue-800",
    B: "text-green-800",
    C: "text-yellow-800",
    D: "text-gray-800",
  };

  // ガラスのような光沢を出すtext-shadow（ツヤツヤ感強化）
  const textShadowStyle = {
    textShadow:
      "0 2px 0 rgba(255,255,255,1), 0 3px 2px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)",
  } as React.CSSProperties;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg ${glassStyle[size]} ${sizeClasses[size]} ${isSPlus ? "animate-pulse" : ""} transition-all hover:scale-105 hover:shadow-xl`}
      title={`総合評価: ${tierColor.label}`}
    >
      {showLabel && (
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
            総合
          </span>
          <span
            className={`${rankSizeClasses[size]} font-black leading-none ${textColorClasses[rank]}`}
            style={textShadowStyle}
          >
            {rank}
          </span>
        </div>
      )}
      {!showLabel && (
        <span
          className={`${rankSizeClasses[size]} font-black leading-none ${textColorClasses[rank]}`}
          style={textShadowStyle}
        >
          {rank}
        </span>
      )}
    </div>
  );
}

/**
 * 5冠達成バナー（すべてSランク）
 */
export function PerfectProductBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-2xl px-6 py-3.5
      bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400
      flex items-center justify-center gap-3
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
      before:animate-shimmer
      animate-pulse-slow"
    >
      <span className="text-2xl drop-shadow-lg animate-bounce-slow">🏆</span>
      <span className="font-bold text-base text-white drop-shadow-md tracking-wide">
        5冠達成！すべてSランクの最高品質
      </span>
      <span className="text-2xl drop-shadow-lg animate-bounce-slow">🏆</span>
    </div>
  );
}
