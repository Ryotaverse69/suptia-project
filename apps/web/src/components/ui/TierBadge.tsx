/**
 * TierBadgeコンポーネント
 *
 * 5つの評価軸（価格・コスパ・含有量・エビデンス・安全性）のTierランクを
 * 横並び1列で表示
 */

import { TierRank, getTierColor } from "@/lib/tier-colors";
import { TierRatings } from "@/lib/tier-ranking";

interface TierBadgeProps {
  ratings: TierRatings;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean; // ラベル表示（デフォルト: false）
}

/**
 * 5つのTierバッジを横並びで表示
 */
export function TierBadgeRow({
  ratings,
  size = "md",
  showLabels = false,
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

  return (
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {badges.map((badge) => {
        const tierColor = getTierColor(badge.rank as TierRank);
        return (
          <div
            key={badge.label}
            className={`flex flex-col items-center p-4 rounded-xl border-2 ${tierColor.className} transition-transform hover:scale-105`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="text-sm font-semibold mb-1">{badge.label}</div>
            <div className="text-3xl font-bold mb-2">{badge.rank}</div>
            <div className="text-xs text-center opacity-75">
              {badge.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 5冠達成バナー（すべてSランク）
 */
export function PerfectProductBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 animate-pulse">
      <span className="text-2xl">🏆</span>
      <span className="font-bold text-lg">5冠達成！すべてSランクの最高品</span>
      <span className="text-2xl">🏆</span>
    </div>
  );
}
