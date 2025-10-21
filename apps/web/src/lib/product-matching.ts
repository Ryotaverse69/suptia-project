// 商品同定ロジック - JAN/ASIN優先マッチング

import type { ProductIdentifier } from "./adapters/types";

/**
 * 商品マッチング結果
 */
export interface ProductMatchResult {
  isMatch: boolean;
  confidence: number; // 0-1の信頼度スコア
  method: MatchMethod;
  details?: string;
}

/**
 * マッチング手法
 */
export type MatchMethod =
  | "jan_exact" // JAN完全一致
  | "asin_exact" // ASIN完全一致
  | "ean_exact" // EAN完全一致
  | "title_similarity" // タイトル類似度
  | "no_match"; // マッチなし

/**
 * 商品同定ロジック（CLAUDE.mdに基づく）
 *
 * 優先順位:
 * 1. JAN一致 → 即同一と判定（信頼度1.0）
 * 2. ASIN一致 → 同一商品とみなす（信頼度0.95）
 * 3. EAN一致 → 同一商品とみなす（信頼度0.95）
 * 4. タイトル正規化 → 類似度計算（cosine > 0.92で候補）
 * 5. 閾値未満 → pendingリストで手動レビュー
 *
 * @param product1 商品1の識別子
 * @param product2 商品2の識別子
 * @returns マッチング結果
 */
export function matchProducts(
  product1: ProductIdentifier,
  product2: ProductIdentifier,
): ProductMatchResult {
  // 1. JAN完全一致チェック（最優先）
  if (product1.jan && product2.jan) {
    const janMatch =
      normalizeCode(product1.jan) === normalizeCode(product2.jan);
    if (janMatch) {
      return {
        isMatch: true,
        confidence: 1.0,
        method: "jan_exact",
        details: `JAN: ${product1.jan}`,
      };
    }
  }

  // 2. ASIN完全一致チェック
  if (product1.asin && product2.asin) {
    const asinMatch =
      normalizeCode(product1.asin) === normalizeCode(product2.asin);
    if (asinMatch) {
      return {
        isMatch: true,
        confidence: 0.95,
        method: "asin_exact",
        details: `ASIN: ${product1.asin}`,
      };
    }
  }

  // 3. EAN完全一致チェック
  if (product1.ean && product2.ean) {
    const eanMatch =
      normalizeCode(product1.ean) === normalizeCode(product2.ean);
    if (eanMatch) {
      return {
        isMatch: true,
        confidence: 0.95,
        method: "ean_exact",
        details: `EAN: ${product1.ean}`,
      };
    }
  }

  // 4. タイトル類似度チェック（フォールバック）
  if (product1.title && product2.title) {
    const similarity = calculateTitleSimilarity(product1, product2);

    if (similarity >= 0.92) {
      return {
        isMatch: true,
        confidence: similarity,
        method: "title_similarity",
        details: `Title similarity: ${(similarity * 100).toFixed(1)}%`,
      };
    }
  }

  // マッチなし
  return {
    isMatch: false,
    confidence: 0,
    method: "no_match",
    details: "No matching identifier found",
  };
}

/**
 * コードを正規化（トリム、大文字化、ハイフン除去）
 */
function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/[-\s]/g, "");
}

/**
 * タイトル類似度を計算（Cosine類似度）
 *
 * NOTE: 簡易実装。本番環境では以下を追加推奨：
 * - ブランド名除去
 * - 容量・単位除去（"1000mg", "60粒"など）
 * - 形態除去（"カプセル", "錠剤"など）
 * - ストップワード除去
 */
function calculateTitleSimilarity(
  product1: ProductIdentifier,
  product2: ProductIdentifier,
): number {
  if (!product1.title || !product2.title) return 0;

  // タイトルを正規化
  const normalized1 = normalizeTitle(product1.title, product1.brand);
  const normalized2 = normalizeTitle(product2.title, product2.brand);

  // 単語ベクトル化（簡易TF-IDF風）
  const words1 = tokenize(normalized1);
  const words2 = tokenize(normalized2);

  // Jaccard係数（簡易的な類似度計算）
  const intersection = words1.filter((word) => words2.includes(word)).length;
  const union = new Set([...words1, ...words2]).size;

  if (union === 0) return 0;

  return intersection / union;
}

/**
 * タイトルを正規化
 * - ブランド名除去
 * - 容量・単位除去
 * - 小文字化
 * - 記号除去
 */
function normalizeTitle(title: string, brand?: string): string {
  let normalized = title.toLowerCase();

  // ブランド名を除去
  if (brand) {
    normalized = normalized.replace(brand.toLowerCase(), "");
  }

  // 容量・単位パターンを除去（例: "1000mg", "60粒", "120 capsules"）
  normalized = normalized.replace(
    /\d+\s?(mg|g|ml|l|粒|錠|カプセル|capsules?|tablets?)/gi,
    "",
  );

  // 記号・数字を除去
  normalized = normalized.replace(/[^\p{L}\s]/gu, "");

  // 連続スペースを1つに
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * テキストをトークン化（単語分割）
 */
function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .filter((word) => !isStopWord(word));
}

/**
 * ストップワード判定（よくある無意味な単語）
 */
function isStopWord(word: string): boolean {
  const stopWords = new Set([
    "の",
    "に",
    "を",
    "は",
    "が",
    "と",
    "で",
    "a",
    "an",
    "the",
    "in",
    "on",
    "at",
    "for",
  ]);
  return stopWords.has(word);
}

/**
 * バッチマッチング - 複数商品の同定候補を見つける
 *
 * @param targetProduct 対象商品
 * @param candidates 候補商品リスト
 * @param minConfidence 最小信頼度（デフォルト: 0.92）
 * @returns マッチ結果の配列（信頼度降順）
 */
export function findMatchingProducts(
  targetProduct: ProductIdentifier,
  candidates: Array<ProductIdentifier & { id: string }>,
  minConfidence: number = 0.92,
): Array<{ id: string; match: ProductMatchResult }> {
  const results = candidates
    .map((candidate) => ({
      id: candidate.id,
      match: matchProducts(targetProduct, candidate),
    }))
    .filter(
      (result) =>
        result.match.isMatch && result.match.confidence >= minConfidence,
    )
    .sort((a, b) => b.match.confidence - a.match.confidence);

  return results;
}

/**
 * 商品リンケージレコード
 * CLAUDE.mdの「商品同定ロジック」に基づく
 */
export interface ProductLinkage {
  masterProductId: string;
  linkedProducts: Array<{
    source: string; // "amazon", "rakuten", etc.
    externalId: string; // ASIN, itemCodeなど
    identifier: ProductIdentifier;
    matchMethod: MatchMethod;
    confidence: number;
    linkedAt: Date;
    verifiedAt?: Date; // 手動検証済みの場合
  }>;
  lastReviewedAt: Date;
  status: "verified" | "pending" | "rejected";
}

/**
 * 商品リンケージを作成
 */
export function createProductLinkage(
  masterProductId: string,
  matches: Array<{
    source: string;
    externalId: string;
    identifier: ProductIdentifier;
    match: ProductMatchResult;
  }>,
): ProductLinkage {
  return {
    masterProductId,
    linkedProducts: matches.map((m) => ({
      source: m.source,
      externalId: m.externalId,
      identifier: m.identifier,
      matchMethod: m.match.method,
      confidence: m.match.confidence,
      linkedAt: new Date(),
    })),
    lastReviewedAt: new Date(),
    status: matches.every((m) => m.match.confidence >= 0.95)
      ? "verified"
      : "pending",
  };
}
