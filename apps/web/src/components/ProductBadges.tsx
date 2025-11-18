/**
 * 商品詳細ページ用の称号表示コンポーネント
 */

import { BadgeType, getBadgeInfo, isPerfectSupplement } from "@/lib/badges";
import { Sparkles, TrendingUp } from "lucide-react";

interface ProductBadgesProps {
  badges: BadgeType[];
  className?: string;
}

export function ProductBadges({ badges, className = "" }: ProductBadgesProps) {
  // nullチェック: badgesがnullまたはundefinedの場合は空配列として扱う
  const safeBadges = badges || [];
  const isPerfect = isPerfectSupplement(safeBadges);

  if (safeBadges.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* 5冠達成バナー */}
      {isPerfect && (
        <div className="mb-6 p-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-white animate-spin" size={32} />
            <h2 className="text-3xl font-bold text-white">
              🏆 5冠達成！完璧なサプリメント
            </h2>
            <Sparkles className="text-white animate-spin" size={32} />
          </div>
          <p className="text-center text-white text-lg font-medium">
            価格・成分量・コスパ・エビデンス・安全性のすべてにおいて最高レベルです
          </p>
        </div>
      )}

      {/* 称号一覧 */}
      <div className="bg-white border border-primary-200 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <TrendingUp size={24} />
          獲得した称号
        </h2>

        <div className="space-y-4">
          {safeBadges.map((badgeType) => {
            const badge = getBadgeInfo(badgeType);
            return (
              <div
                key={badgeType}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 ${badge.color}`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{badge.label}</h3>
                  <p className="text-sm opacity-80">{badge.description}</p>
                  {/* 詳細説明 */}
                  <div className="mt-2 text-xs opacity-70">
                    {getBadgeDetailDescription(badgeType)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isPerfect && safeBadges.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 この商品は<strong>{safeBadges.length}つの称号</strong>
              を獲得しています。
              {safeBadges.length < 5 &&
                `あと${5 - safeBadges.length}つで完璧なサプリメントです！`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 各称号の詳細説明を取得
 */
function getBadgeDetailDescription(badgeType: BadgeType): string {
  const descriptions: Record<BadgeType, string> = {
    "lowest-price":
      "複数のECサイトを比較した結果、最も安い価格で購入できる商品です。",
    "highest-content":
      "同じ成分を含む商品の中で、最も多くの有効成分を含んでいます。",
    "best-value":
      "成分量あたりの価格（コストパフォーマンス）が最も優れています。",
    "evidence-s":
      "大規模なランダム化比較試験（RCT）やメタ解析により、高い効果が実証されています。",
    "high-safety": "第三者機関による検査や安全性評価で高得点を獲得しています。",
  };

  return descriptions[badgeType];
}

/**
 * 称号サマリー（コンパクト版）
 */
interface BadgeSummaryProps {
  badges: BadgeType[];
  className?: string;
}

export function BadgeSummary({ badges, className = "" }: BadgeSummaryProps) {
  // nullチェック: badgesがnullまたはundefinedの場合は空配列として扱う
  const safeBadges = badges || [];
  const isPerfect = isPerfectSupplement(safeBadges);

  if (safeBadges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {isPerfect && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold text-sm">
          <Sparkles size={16} />
          <span>5冠達成</span>
        </div>
      )}

      {safeBadges.map((badgeType) => {
        const badge = getBadgeInfo(badgeType);
        return (
          <div
            key={badgeType}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${badge.color}`}
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}
