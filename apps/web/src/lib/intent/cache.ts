/**
 * Intent Classification Cache
 *
 * インメモリキャッシュによるAPI呼び出し削減
 *
 * キャッシュキー: `${normalizedInput}:${intentType}`
 * TTL: 1時間（同一入力は1時間キャッシュ）
 */

import type { IntentClassification, CacheEntry } from "./types";

// キャッシュストア（サーバーサイドのインメモリ）
const cache = new Map<string, CacheEntry>();

// キャッシュ設定
const CACHE_TTL_MS = 60 * 60 * 1000; // 1時間
const MAX_CACHE_SIZE = 10000; // 最大エントリ数

/**
 * キャッシュからエントリを取得
 */
export function getCached(key: string): IntentClassification | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  // TTLチェック
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.result;
}

/**
 * キャッシュにエントリを保存
 */
export function setCache(key: string, result: IntentClassification): void {
  // サイズ制限チェック（LRU的に古いものから削除）
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }

  cache.set(key, {
    result,
    timestamp: Date.now(),
  });
}

/**
 * キャッシュをクリア
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * キャッシュ統計を取得
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  ttlMs: number;
} {
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlMs: CACHE_TTL_MS,
  };
}
