/**
 * Product Matcher - 型定義
 */

export type MatchStrategy = 'auto' | 'jan-only' | 'asin-only' | 'title-only' | 'all';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

// 商品データ
export interface Product {
  id: string;
  title: string;
  brand?: string;
  jan?: string; // JAN/EANコード
  asin?: string; // Amazon ASIN
  price?: number;
  currency?: string;
  source: 'amazon' | 'rakuten' | 'iherb' | 'other';
  url?: string;
  imageUrl?: string;
}

// マッチング結果
export interface Match {
  sourceProduct: Product;
  targetProduct: Product;
  matchType: 'jan' | 'asin' | 'title';
  confidence: number; // 0.0 - 1.0
  confidenceLevel: ConfidenceLevel;
  similarity?: TitleSimilarity;
}

// タイトル類似度
export interface TitleSimilarity {
  cosineSimilarity: number; // 0.0 - 1.0
  levenshteinDistance: number;
  normalizedSourceTitle: string;
  normalizedTargetTitle: string;
  commonTokens: string[];
}

// 未マッチ商品
export interface UnmatchedProduct {
  product: Product;
  reason: string;
  candidates?: MatchCandidate[];
}

// マッチング候補
export interface MatchCandidate {
  product: Product;
  confidence: number;
  matchType: 'jan' | 'asin' | 'title';
  similarity?: TitleSimilarity;
}

// マッチング統計
export interface MatchStatistics {
  totalSourceProducts: number;
  totalTargetProducts: number;
  matchedCount: number;
  unmatchedCount: number;
  matchRate: number; // 0.0 - 1.0
  matchTypeBreakdown: {
    janMatches: number;
    asinMatches: number;
    titleMatches: number;
  };
  confidenceLevelBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  averageConfidence: number;
}

// マッチングレポート
export interface MatchReport {
  timestamp: string;
  source: string;
  target: string;
  strategy: MatchStrategy;
  threshold: number;
  matches: Match[];
  unmatched: UnmatchedProduct[];
  statistics: MatchStatistics;
  overallStatus: 'excellent' | 'good' | 'needs-review';
}

// マッチング設定
export interface MatchConfig {
  source: string;
  target: string;
  threshold: number;
  strategy: MatchStrategy;
  saveToSanity: boolean;
  generateReviewList: boolean;
}
