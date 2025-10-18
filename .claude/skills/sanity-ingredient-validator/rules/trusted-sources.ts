/**
 * 信頼できる参考文献ソース
 */

export type TrustTier = 'tier1' | 'tier2' | 'tier3';

export interface TrustedSource {
  domain: string;
  tier: TrustTier;
  score: number;
  description: string;
}

export const TRUSTED_SOURCES: Record<TrustTier, string[]> = {
  tier1: [
    // 最高信頼度
    'pubmed.ncbi.nlm.nih.gov',
    'cochrane.org',
    'mhlw.go.jp', // 厚生労働省
    'nih.gov',
  ],
  tier2: [
    // 高信頼度
    'who.int',
    'scholar.google.com',
    'sciencedirect.com',
    'springer.com',
    'nature.com',
    'science.org',
  ],
  tier3: [
    // 中信頼度
    'researchgate.net',
    'arxiv.org',
    'mdpi.com',
  ],
};

/**
 * URLの信頼度Tierを取得
 */
export const getTrustTier = (hostname: string): TrustTier | null => {
  for (const [tier, domains] of Object.entries(TRUSTED_SOURCES)) {
    if (domains.some((domain) => hostname.includes(domain))) {
      return tier as TrustTier;
    }
  }
  return null;
};

/**
 * Tierに応じたスコアを取得
 */
export const getTierScore = (tier: TrustTier | null): number => {
  const scores: Record<TrustTier, number> = {
    tier1: 3,
    tier2: 2,
    tier3: 1,
  };
  return tier ? scores[tier] : 0;
};
