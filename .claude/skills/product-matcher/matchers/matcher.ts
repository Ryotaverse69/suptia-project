/**
 * 商品マッチングロジック
 */

import {
  Product,
  Match,
  UnmatchedProduct,
  MatchCandidate,
  MatchStrategy,
  ConfidenceLevel,
} from '../types';
import { calculateTitleSimilarity } from './similarity';

/**
 * JAN一致でマッチング
 */
export const matchByJAN = (
  sourceProducts: Product[],
  targetProducts: Product[]
): Match[] => {
  const matches: Match[] = [];

  for (const sourceProduct of sourceProducts) {
    if (!sourceProduct.jan) continue;

    const targetProduct = targetProducts.find(
      (p) => p.jan && p.jan === sourceProduct.jan
    );

    if (targetProduct) {
      matches.push({
        sourceProduct,
        targetProduct,
        matchType: 'jan',
        confidence: 1.0,
        confidenceLevel: 'high',
      });
    }
  }

  return matches;
};

/**
 * ASIN一致でマッチング
 */
export const matchByASIN = (
  sourceProducts: Product[],
  targetProducts: Product[]
): Match[] => {
  const matches: Match[] = [];

  for (const sourceProduct of sourceProducts) {
    if (!sourceProduct.asin) continue;

    const targetProduct = targetProducts.find(
      (p) => p.asin && p.asin === sourceProduct.asin
    );

    if (targetProduct) {
      matches.push({
        sourceProduct,
        targetProduct,
        matchType: 'asin',
        confidence: 0.95,
        confidenceLevel: 'high',
      });
    }
  }

  return matches;
};

/**
 * タイトル類似度でマッチング
 */
export const matchByTitle = (
  sourceProducts: Product[],
  targetProducts: Product[],
  threshold: number = 0.92
): Match[] => {
  const matches: Match[] = [];

  for (const sourceProduct of sourceProducts) {
    let bestMatch: Match | null = null;
    let bestSimilarity = 0;

    for (const targetProduct of targetProducts) {
      const similarity = calculateTitleSimilarity(
        sourceProduct.title,
        targetProduct.title
      );

      if (similarity.cosineSimilarity > bestSimilarity) {
        bestSimilarity = similarity.cosineSimilarity;
        bestMatch = {
          sourceProduct,
          targetProduct,
          matchType: 'title',
          confidence: similarity.cosineSimilarity,
          confidenceLevel: getConfidenceLevel(similarity.cosineSimilarity),
          similarity,
        };
      }
    }

    if (bestMatch && bestSimilarity >= threshold) {
      matches.push(bestMatch);
    }
  }

  return matches;
};

/**
 * 信頼度レベルを取得
 */
export const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= 0.92) return 'high';
  if (confidence >= 0.85) return 'medium';
  return 'low';
};

/**
 * 自動マッチング（優先順位: JAN > ASIN > Title）
 */
export const matchProducts = (
  sourceProducts: Product[],
  targetProducts: Product[],
  threshold: number = 0.92,
  strategy: MatchStrategy = 'auto'
): Match[] => {
  let matches: Match[] = [];
  const matchedSourceIds = new Set<string>();
  const matchedTargetIds = new Set<string>();

  // フィルタリング用のヘルパー
  const filterUnmatched = (products: Product[], matchedIds: Set<string>) =>
    products.filter((p) => !matchedIds.has(p.id));

  // JAN一致
  if (strategy === 'auto' || strategy === 'jan-only' || strategy === 'all') {
    const janMatches = matchByJAN(sourceProducts, targetProducts);
    janMatches.forEach((match) => {
      matches.push(match);
      matchedSourceIds.add(match.sourceProduct.id);
      matchedTargetIds.add(match.targetProduct.id);
    });
  }

  // ASIN一致（未マッチのみ）
  if (strategy === 'auto' || strategy === 'asin-only' || strategy === 'all') {
    const unmatchedSource = filterUnmatched(sourceProducts, matchedSourceIds);
    const unmatchedTarget = filterUnmatched(targetProducts, matchedTargetIds);

    const asinMatches = matchByASIN(unmatchedSource, unmatchedTarget);
    asinMatches.forEach((match) => {
      matches.push(match);
      matchedSourceIds.add(match.sourceProduct.id);
      matchedTargetIds.add(match.targetProduct.id);
    });
  }

  // タイトル類似度（未マッチのみ）
  if (strategy === 'auto' || strategy === 'title-only' || strategy === 'all') {
    const unmatchedSource = filterUnmatched(sourceProducts, matchedSourceIds);
    const unmatchedTarget = filterUnmatched(targetProducts, matchedTargetIds);

    const titleMatches = matchByTitle(unmatchedSource, unmatchedTarget, threshold);
    titleMatches.forEach((match) => {
      matches.push(match);
      matchedSourceIds.add(match.sourceProduct.id);
      matchedTargetIds.add(match.targetProduct.id);
    });
  }

  return matches;
};

/**
 * 未マッチ商品を取得
 */
export const getUnmatchedProducts = (
  sourceProducts: Product[],
  targetProducts: Product[],
  matches: Match[],
  threshold: number = 0.92
): UnmatchedProduct[] => {
  const matchedSourceIds = new Set(matches.map((m) => m.sourceProduct.id));

  const unmatched: UnmatchedProduct[] = [];

  for (const sourceProduct of sourceProducts) {
    if (matchedSourceIds.has(sourceProduct.id)) continue;

    // 候補を探す（閾値未満の類似商品）
    const candidates: MatchCandidate[] = [];

    for (const targetProduct of targetProducts) {
      const similarity = calculateTitleSimilarity(
        sourceProduct.title,
        targetProduct.title
      );

      // 閾値未満だが一定以上の類似度がある場合、候補として追加
      if (similarity.cosineSimilarity >= 0.75 && similarity.cosineSimilarity < threshold) {
        candidates.push({
          product: targetProduct,
          confidence: similarity.cosineSimilarity,
          matchType: 'title',
          similarity,
        });
      }
    }

    // 候補をconfidenceでソート
    candidates.sort((a, b) => b.confidence - a.confidence);

    const reason = candidates.length > 0
      ? `類似度が閾値（${threshold}）未満（最高: ${candidates[0].confidence.toFixed(2)}）`
      : 'マッチング候補が見つかりません';

    unmatched.push({
      product: sourceProduct,
      reason,
      candidates: candidates.slice(0, 3), // 上位3件のみ
    });
  }

  return unmatched;
};
