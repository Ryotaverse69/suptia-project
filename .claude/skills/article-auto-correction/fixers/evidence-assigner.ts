/**
 * エビデンスレベル自動判定ツール
 * 参考文献URLから自動的にエビデンスレベルを判定
 */

interface ReferenceSource {
  domain: string;
  tier: 1 | 2 | 3;
}

const REFERENCE_SOURCES: ReferenceSource[] = [
  // Tier 1: 最高信頼度
  { domain: 'pubmed.ncbi.nlm.nih.gov', tier: 1 },
  { domain: 'cochrane.org', tier: 1 },
  { domain: 'mhlw.go.jp', tier: 1 },
  { domain: 'nih.gov', tier: 1 },

  // Tier 2: 高信頼度
  { domain: 'who.int', tier: 2 },
  { domain: 'scholar.google.com', tier: 2 },
  { domain: 'sciencedirect.com', tier: 2 },
  { domain: 'springer.com', tier: 2 },
  { domain: 'nature.com', tier: 2 },
  { domain: 'science.org', tier: 2 },

  // Tier 3: 中信頼度
  { domain: 'researchgate.net', tier: 3 },
  { domain: 'arxiv.org', tier: 3 },
  { domain: 'mdpi.com', tier: 3 },
];

/**
 * URLから信頼度Tierを取得
 */
const getReferenceTier = (url: string): number => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    for (const source of REFERENCE_SOURCES) {
      if (hostname.includes(source.domain)) {
        return source.tier;
      }
    }
  } catch {
    return 3; // 無効なURLはTier 3として扱う
  }

  return 3; // 未知のソースはTier 3
};

/**
 * 参考文献リストからエビデンスレベルを判定
 */
export const assignEvidenceLevel = (references: any[]): string => {
  if (!references || references.length === 0) {
    return 'D'; // 参考文献なし
  }

  const tiers: number[] = [];

  for (const ref of references) {
    const url = typeof ref === 'string' ? ref : ref?.url || '';
    if (url) {
      tiers.push(getReferenceTier(url));
    }
  }

  if (tiers.length === 0) {
    return 'D';
  }

  // 平均Tier値を計算
  const avgTier = tiers.reduce((a, b) => a + b, 0) / tiers.length;
  const tier1Count = tiers.filter((t) => t === 1).length;
  const tier2Count = tiers.filter((t) => t === 2).length;
  const totalRefs = tiers.length;

  // エビデンスレベル判定ロジック
  if (tier1Count >= 5 && avgTier <= 1.3) {
    return 'S'; // 大規模RCTやメタ解析レベル
  }

  if (tier1Count >= 3 || (tier1Count >= 2 && avgTier <= 1.5)) {
    return 'A'; // 良質な研究で効果が確認
  }

  if (tier1Count >= 1 || tier2Count >= 3 || avgTier <= 2.0) {
    return 'B'; // 限定的研究・条件付きの効果
  }

  if (tier2Count >= 1 || avgTier <= 2.5) {
    return 'C'; // 動物実験・小規模試験レベル
  }

  return 'D'; // 理論・未検証レベル
};

/**
 * 記事にエビデンスレベルを追加
 */
export const addEvidenceLevelToArticle = (data: any): any => {
  if (!data.evidenceLevel && data.references) {
    const level = assignEvidenceLevel(data.references);
    return {
      ...data,
      evidenceLevel: level,
    };
  }

  return data;
};

/**
 * エビデンスレベルの説明を取得
 */
export const getEvidenceLevelDescription = (level: string): string => {
  const descriptions: Record<string, string> = {
    S: '大規模RCTやメタ解析による高い信頼性',
    A: '良質な研究で効果が確認',
    B: '限定的研究・条件付きの効果',
    C: '動物実験・小規模試験レベル',
    D: '理論・未検証レベル',
  };

  return descriptions[level] || descriptions['D'];
};
