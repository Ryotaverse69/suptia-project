/**
 * 商品統計情報表示コンポーネント
 */

import { Trophy, Award, TrendingUp } from "lucide-react";
import {
  BadgeType,
  BADGE_DEFINITIONS,
  isPerfectSupplement,
} from "@/lib/badges";

interface ProductStatsProps {
  products: Array<{
    badges?: BadgeType[];
  }>;
  className?: string;
}

export function ProductStats({ products, className = "" }: ProductStatsProps) {
  // 統計を計算
  const totalProducts = products.length;
  const perfectSupplements = products.filter((p) =>
    isPerfectSupplement(p.badges || []),
  ).length;

  // 各称号の獲得商品数を計算
  const badgeCounts = Object.keys(BADGE_DEFINITIONS).reduce(
    (acc, badgeType) => {
      acc[badgeType as BadgeType] = products.filter((p) =>
        (p.badges || []).includes(badgeType as BadgeType),
      ).length;
      return acc;
    },
    {} as Record<BadgeType, number>,
  );

  // 称号平均数を計算
  const averageBadges =
    products.reduce((sum, p) => sum + (p.badges?.length || 0), 0) /
      totalProducts || 0;

  return (
    <div
      className={`bg-white border border-primary-200 rounded-xl shadow-sm ${className}`}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          商品統計
        </h2>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 全商品数 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">全商品数</p>
            </div>
            <p className="text-3xl font-bold text-blue-700">{totalProducts}</p>
            <p className="text-xs text-blue-600 mt-1">在庫あり商品</p>
          </div>

          {/* 5冠達成商品 */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-yellow-600" />
              <p className="text-sm font-semibold text-yellow-900">
                5冠達成商品
              </p>
            </div>
            <p className="text-3xl font-bold text-yellow-700">
              {perfectSupplements}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              全称号獲得（
              {totalProducts > 0
                ? Math.round((perfectSupplements / totalProducts) * 100)
                : 0}
              %）
            </p>
          </div>

          {/* 平均称号数 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-green-600" />
              <p className="text-sm font-semibold text-green-900">平均称号数</p>
            </div>
            <p className="text-3xl font-bold text-green-700">
              {averageBadges.toFixed(1)}
            </p>
            <p className="text-xs text-green-600 mt-1">商品あたり</p>
          </div>
        </div>

        {/* 称号別獲得商品数 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            称号別獲得商品数
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(BADGE_DEFINITIONS) as BadgeType[]).map(
              (badgeType) => {
                const badge = BADGE_DEFINITIONS[badgeType];
                const count = badgeCounts[badgeType];
                const percentage =
                  totalProducts > 0 ? (count / totalProducts) * 100 : 0;

                return (
                  <div
                    key={badgeType}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{badge.icon}</span>
                        <p className="text-sm font-medium text-gray-800">
                          {badge.label}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {count}
                      </span>
                    </div>
                    {/* プログレスバー */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-right">
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
