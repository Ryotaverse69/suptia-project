/**
 * タイトル類似度計算
 */

import { TitleSimilarity } from '../types';

/**
 * タイトルを正規化（ブランド名、容量、記号を除去）
 */
export const normalizeTitle = (title: string): string => {
  // 小文字に変換
  let normalized = title.toLowerCase();

  // ブランド名を除去（一般的なサプリメントブランド）
  const brands = [
    'now foods',
    'nature made',
    'california gold nutrition',
    'solgar',
    'jarrow formulas',
    'life extension',
    'doctor\'s best',
    'natrol',
    'source naturals',
    'nordic naturals',
    'garden of life',
    'mega food',
    'bluebonnet',
    'country life',
    'pure encapsulations',
    'thorne',
    'optimum nutrition',
    'muscletech',
    'bsn',
    'cellucor',
  ];

  brands.forEach((brand) => {
    normalized = normalized.replace(new RegExp(brand, 'gi'), '');
  });

  // 容量を除去（例: 250粒、1000mg、500g）
  normalized = normalized.replace(/\d+\s*(粒|錠|カプセル|粒入り|caps|tablets|capsules)/gi, '');
  normalized = normalized.replace(/\d+\s*(mg|g|ml|mcg|iu|μg)/gi, '');
  normalized = normalized.replace(/\d+\s*x\s*\d+/gi, ''); // 例: 30 x 2

  // 記号・特殊文字を除去
  normalized = normalized.replace(/[【】「」『』［］（）()[\]<>《》〈〉]/g, ' ');
  normalized = normalized.replace(/[！!？?・、,。.]/g, ' ');
  normalized = normalized.replace(/[™®©]/g, '');

  // 連続するスペースを1つに
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
};

/**
 * タイトルをトークン化
 */
export const tokenize = (title: string): string[] => {
  const normalized = normalizeTitle(title);
  // スペースで分割し、空文字列を除去
  return normalized.split(/\s+/).filter((token) => token.length > 0);
};

/**
 * Cosine類似度を計算
 */
export const calculateCosineSimilarity = (title1: string, title2: string): number => {
  const tokens1 = tokenize(title1);
  const tokens2 = tokenize(title2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return 0;
  }

  // 全トークンのユニークセットを作成
  const allTokens = Array.from(new Set([...tokens1, ...tokens2]));

  // ベクトル化
  const vector1 = allTokens.map((token) => (tokens1.includes(token) ? 1 : 0));
  const vector2 = allTokens.map((token) => (tokens2.includes(token) ? 1 : 0));

  // ドット積を計算
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);

  // ベクトルの大きさを計算
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Levenshtein距離を計算
 */
export const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;

  // dpテーブルを初期化
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // dpテーブルを埋める
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // 削除
          dp[i][j - 1] + 1, // 挿入
          dp[i - 1][j - 1] + 1 // 置換
        );
      }
    }
  }

  return dp[m][n];
};

/**
 * 共通トークンを取得
 */
export const getCommonTokens = (title1: string, title2: string): string[] => {
  const tokens1 = tokenize(title1);
  const tokens2 = tokenize(title2);

  return tokens1.filter((token) => tokens2.includes(token));
};

/**
 * タイトル類似度を計算（総合）
 */
export const calculateTitleSimilarity = (title1: string, title2: string): TitleSimilarity => {
  const normalizedTitle1 = normalizeTitle(title1);
  const normalizedTitle2 = normalizeTitle(title2);

  const cosineSimilarity = calculateCosineSimilarity(title1, title2);
  const levenshteinDistance = calculateLevenshteinDistance(normalizedTitle1, normalizedTitle2);
  const commonTokens = getCommonTokens(title1, title2);

  return {
    cosineSimilarity,
    levenshteinDistance,
    normalizedSourceTitle: normalizedTitle1,
    normalizedTargetTitle: normalizedTitle2,
    commonTokens,
  };
};
