/**
 * Tierカラーシステム定義
 *
 * Suptiaの5つの評価軸（価格・コスパ・含有量・エビデンス・安全性）で
 * 使用する統一カラーパレット
 */

export type TierRank = "S" | "A" | "B" | "C" | "D";

export interface TierColor {
  rank: TierRank;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  className: string; // Tailwind統合用
  description: string;
}

/**
 * Tierランク別カラー定義
 */
export const TIER_COLORS: Record<TierRank, TierColor> = {
  S: {
    rank: "S",
    label: "Sランク",
    bgColor: "#f3e8ff", // purple-50
    borderColor: "#d8b4fe", // purple-300
    textColor: "#7e22ce", // purple-700
    className: "bg-purple-50 border-purple-300 text-purple-700",
    description: "最高ランク",
  },
  A: {
    rank: "A",
    label: "Aランク",
    bgColor: "#dbeafe", // blue-50
    borderColor: "#93c5fd", // blue-300
    textColor: "#1d4ed8", // blue-700
    className: "bg-blue-50 border-blue-300 text-blue-700",
    description: "優秀",
  },
  B: {
    rank: "B",
    label: "Bランク",
    bgColor: "#dcfce7", // green-50
    borderColor: "#86efac", // green-300
    textColor: "#15803d", // green-700
    className: "bg-green-50 border-green-300 text-green-700",
    description: "良好",
  },
  C: {
    rank: "C",
    label: "Cランク",
    bgColor: "#fef9c3", // yellow-50
    borderColor: "#fde047", // yellow-300
    textColor: "#a16207", // yellow-700
    className: "bg-yellow-50 border-yellow-300 text-yellow-700",
    description: "普通",
  },
  D: {
    rank: "D",
    label: "Dランク",
    bgColor: "#f9fafb", // gray-50
    borderColor: "#d1d5db", // gray-300
    textColor: "#374151", // gray-700
    className: "bg-gray-50 border-gray-300 text-gray-700",
    description: "要改善",
  },
};

/**
 * Tierランクに対応するカラー情報を取得
 */
export function getTierColor(rank: TierRank): TierColor {
  return TIER_COLORS[rank];
}

/**
 * Tierランクのクラス名を取得
 */
export function getTierClassName(rank: TierRank): string {
  return TIER_COLORS[rank].className;
}

/**
 * Tierランクの数値スコアを取得（ソート用）
 */
export function getTierScore(rank: TierRank): number {
  const scores: Record<TierRank, number> = {
    S: 5,
    A: 4,
    B: 3,
    C: 2,
    D: 1,
  };
  return scores[rank];
}

/**
 * 数値スコアからTierランクに変換
 */
export function scoreToTierRank(score: number): TierRank {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}
