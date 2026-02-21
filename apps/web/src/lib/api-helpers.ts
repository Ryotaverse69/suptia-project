/**
 * GPT Actions向けAPIレスポンスヘルパー
 *
 * 全v1 APIレスポンスに共通フィールドを付与する
 */

export const GPT_DISCLAIMER =
  "この情報はサプティア独自の5柱評価（価格・成分量・コスパ・エビデンス・安全性）に基づく参考情報です。サプリメントの服用前には必ず医師・薬剤師にご相談ください。This information is based on Suptia's five-pillar evaluation system and is for reference only. Always consult a healthcare professional before taking supplements.";

export const METHODOLOGY_URL = "https://suptia.com/about/methodology";

/**
 * GPT向け共通フィールドを追加
 */
export function withGptFields<T extends Record<string, unknown>>(
  response: T,
  options: {
    summary: string;
    citationPath: string;
  },
): T & { _gpt_summary: string; _disclaimer: string; _citation: string } {
  return {
    ...response,
    _gpt_summary: options.summary,
    _disclaimer: GPT_DISCLAIMER,
    _citation: `https://suptia.com${options.citationPath}`,
  };
}

/**
 * Tier Rankの英語ラベル
 */
export function tierRankLabel(rank: string | null | undefined): string {
  switch (rank) {
    case "S+":
      return "Five Crown (top in all 5 pillars)";
    case "S":
      return "Excellent";
    case "A":
      return "Very Good";
    case "B":
      return "Good";
    case "C":
      return "Average";
    case "D":
      return "Below Average";
    default:
      return "Unrated";
  }
}
