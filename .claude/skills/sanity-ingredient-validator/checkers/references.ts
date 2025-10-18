/**
 * 参考文献チェック: URL有効性と信頼度評価
 */

import { getTrustTier, getTierScore, TrustTier } from '../rules/trusted-sources';

export interface ReferenceDetail {
  url: string;
  valid: boolean;
  tier: TrustTier | null;
  isSecure: boolean;
  reason?: string;
}

export interface ReferencesCheckResult {
  passed: boolean;
  score: number;
  count: number;
  validUrls: number;
  details: ReferenceDetail[];
}

/**
 * 単一の参考文献URLを検証
 */
const validateReference = (url: string): ReferenceDetail => {
  // URLフォーマットチェック
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return {
      url,
      valid: false,
      tier: null,
      isSecure: false,
      reason: 'Invalid URL format',
    };
  }

  // HTTPSチェック
  const isSecure = urlObj.protocol === 'https:';

  // ドメイン信頼度チェック
  const tier = getTrustTier(urlObj.hostname);

  return {
    url,
    valid: tier !== null,
    tier,
    isSecure,
  };
};

/**
 * 参考文献チェックを実行
 */
export const checkReferences = (data: any): ReferencesCheckResult => {
  const details: ReferenceDetail[] = [];

  // referencesフィールドの存在確認
  if (!('references' in data) || !Array.isArray(data.references)) {
    return {
      passed: false,
      score: 0,
      count: 0,
      validUrls: 0,
      details: [],
    };
  }

  // 各参考文献を検証
  for (const ref of data.references) {
    const url = typeof ref === 'string' ? ref : ref?.url || '';
    if (url) {
      const result = validateReference(url);
      details.push(result);
    }
  }

  const count = details.length;
  const validUrls = details.filter((d) => d.valid).length;

  // スコア計算（15点満点）
  let score = 0;

  // 基礎点: 5件以上で満点
  const baseScore = Math.min(5, count);
  score += baseScore;

  // 有効URLの割合（最大5点）
  const validityRatio = count > 0 ? validUrls / count : 0;
  score += validityRatio * 5;

  // 信頼度ボーナス（最大5点）
  const tierScores = details.map((d) => getTierScore(d.tier));
  const avgTierScore = tierScores.length > 0 ? tierScores.reduce((a, b) => a + b, 0) / tierScores.length : 0;
  score += (avgTierScore / 3) * 5; // tier1=3点が最大なので正規化

  // HTTPSボーナス
  const secureRatio = count > 0 ? details.filter((d) => d.isSecure).length / count : 0;
  if (secureRatio === 1) score += 1; // 全てHTTPSなら+1点

  score = Math.min(15, Math.round(score));

  const passed = count >= 5 && validUrls >= 5;

  return {
    passed,
    score,
    count,
    validUrls,
    details,
  };
};
