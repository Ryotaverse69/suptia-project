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
 * TierRankStats（商品一覧ページ）と同じツヤツヤグラデーションデザイン
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

  const sizeClasses = {
    sm: "w-16 h-12",
    md: "w-24 h-16",
    lg: "w-32 h-20",
  };

  const rankSizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  // ランク別のツヤツヤグラデーション背景（TierRankStatsと同じ）
  const rankColors: Record<TierRank, string> = {
    "S+": "bg-gradient-to-br from-purple-500/80 via-pink-500/70 to-yellow-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    S: "bg-gradient-to-br from-purple-500/80 via-purple-500/70 to-purple-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    A: "bg-gradient-to-br from-blue-500/80 via-blue-500/70 to-blue-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    B: "bg-gradient-to-br from-green-500/80 via-green-500/70 to-green-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    C: "bg-gradient-to-br from-yellow-500/80 via-yellow-500/70 to-yellow-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    D: "bg-gradient-to-br from-gray-400/80 via-gray-400/70 to-gray-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
  };

  // ランク別のテキスト色
  const rankTextColors: Record<TierRank, string> = {
    "S+": "text-purple-800",
    S: "text-purple-800",
    A: "text-blue-800",
    B: "text-green-800",
    C: "text-yellow-800",
    D: "text-gray-800",
  };

  // ガラス光沢シャドウ（TierRankStatsと同じ）
  const glassTextShadow = {
    textShadow:
      "0 2px 0 rgba(255,255,255,1), 0 3px 2px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)",
  } as React.CSSProperties;

  return (
    <div
      className={`relative ${sizeClasses[size]} transition-all hover:scale-105`}
      title={`総合評価: ${tierColor.label}`}
    >
      {/* メイン背景 */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded ${rankColors[rank]}`}
      >
        <div className="flex flex-col items-center">
          {showLabel && (
            <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">
              総合
            </span>
          )}
          <span
            className={`${rankSizeClasses[size]} font-black leading-none ${rankTextColors[rank]}`}
            style={glassTextShadow}
          >
            {rank}
          </span>
        </div>
      </div>

      {/* キラキラハイライト（複数レイヤー） */}
      <div className="absolute inset-0 rounded bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
    </div>
  );
}

/**
 * 5冠達成バナー（すべてSランク）
 */
export function PerfectProductBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl px-8 py-4">
      {/* 背景グロウエフェクト（複数レイヤー） */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 opacity-90 blur-md"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400"></div>

      {/* キラキラシマーエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>

      {/* グラデーショングロウ（左右） */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-24 bg-purple-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>

      {/* コンテンツ */}
      <div className="relative flex items-center justify-center gap-4">
        {/* 左側の星 */}
        <div className="flex gap-1">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-bounce-slow">
            ⭐
          </span>
          <span className="text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse">
            ✨
          </span>
        </div>

        {/* メインテキスト */}
        <div className="flex flex-col items-center">
          <div
            className="font-black text-xl tracking-wider uppercase text-white"
            style={{
              textShadow: `
                0 0 10px rgba(255,255,255,0.8),
                0 0 20px rgba(255,215,0,0.6),
                0 0 30px rgba(255,105,180,0.4),
                0 2px 4px rgba(0,0,0,0.3),
                0 4px 8px rgba(0,0,0,0.2)
              `,
            }}
          >
            PERFECT 5 CROWN
          </div>
          <div className="text-xs font-semibold text-white/90 mt-0.5 tracking-wide drop-shadow-md">
            全評価でSランク達成
          </div>
        </div>

        {/* 右側の星 */}
        <div className="flex gap-1">
          <span className="text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse">
            ✨
          </span>
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-bounce-slow">
            ⭐
          </span>
        </div>
      </div>

      {/* トップハイライト */}
      <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

      {/* ボトムリフレクション */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  );
}
