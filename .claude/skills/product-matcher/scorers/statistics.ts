/**
 * マッチング統計計算
 */

import { Match, MatchStatistics, Product } from '../types';

/**
 * マッチング統計を計算
 */
export const calculateStatistics = (
  sourceProducts: Product[],
  targetProducts: Product[],
  matches: Match[]
): MatchStatistics => {
  const totalSourceProducts = sourceProducts.length;
  const totalTargetProducts = targetProducts.length;
  const matchedCount = matches.length;
  const unmatchedCount = totalSourceProducts - matchedCount;
  const matchRate = totalSourceProducts > 0 ? matchedCount / totalSourceProducts : 0;

  // マッチタイプ別の集計
  const matchTypeBreakdown = {
    janMatches: matches.filter((m) => m.matchType === 'jan').length,
    asinMatches: matches.filter((m) => m.matchType === 'asin').length,
    titleMatches: matches.filter((m) => m.matchType === 'title').length,
  };

  // 信頼度レベル別の集計
  const confidenceLevelBreakdown = {
    high: matches.filter((m) => m.confidenceLevel === 'high').length,
    medium: matches.filter((m) => m.confidenceLevel === 'medium').length,
    low: matches.filter((m) => m.confidenceLevel === 'low').length,
  };

  // 平均信頼度
  const averageConfidence =
    matches.length > 0
      ? matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length
      : 0;

  return {
    totalSourceProducts,
    totalTargetProducts,
    matchedCount,
    unmatchedCount,
    matchRate,
    matchTypeBreakdown,
    confidenceLevelBreakdown,
    averageConfidence,
  };
};

/**
 * 総合ステータスを判定
 */
export const determineOverallStatus = (
  statistics: MatchStatistics
): 'excellent' | 'good' | 'needs-review' => {
  const { matchRate, averageConfidence, confidenceLevelBreakdown } = statistics;

  // Excellent: マッチ率90%以上、平均信頼度0.9以上
  if (matchRate >= 0.9 && averageConfidence >= 0.9) {
    return 'excellent';
  }

  // Good: マッチ率70%以上、平均信頼度0.85以上
  if (matchRate >= 0.7 && averageConfidence >= 0.85) {
    return 'good';
  }

  // Needs Review: それ以外
  return 'needs-review';
};
