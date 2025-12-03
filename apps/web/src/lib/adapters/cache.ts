/**
 * EC API キャッシュ機構
 *
 * インメモリキャッシュを提供し、将来的にRedis/Vercel KVに移行可能な設計。
 * 価格データのAPI呼び出しを削減し、レート制限対策として機能。
 */

import type { PriceData, ProductIdentifier, AdapterResult } from "./types";

/**
 * キャッシュエントリ
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // ミリ秒
}

/**
 * キャッシュ統計
 */
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

/**
 * キャッシュプロバイダーインターフェース
 * 将来的にRedis/Vercel KVに切り替え可能
 */
export interface CacheProvider<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  getStats(): CacheStats;
}

/**
 * デフォルトTTL設定（ミリ秒）
 */
export const DEFAULT_CACHE_TTL = {
  PRICE: 30 * 60 * 1000, // 30分（価格は頻繁に変動しないが、古すぎても問題）
  STOCK: 15 * 60 * 1000, // 15分（在庫は変動しやすい）
  REVIEW: 60 * 60 * 1000, // 1時間（レビューはあまり変動しない）
  SEARCH: 60 * 60 * 1000, // 1時間（検索結果キャッシュ）
} as const;

/**
 * キャッシュキー生成
 */
export function generateCacheKey(
  source: string,
  identifier: ProductIdentifier,
  type: "price" | "stock" | "review",
): string {
  // 優先順位: JAN > ASIN > itemCode > title
  const id =
    identifier.jan ||
    identifier.asin ||
    identifier.ean ||
    identifier.itemCode ||
    identifier.title ||
    "unknown";

  return `${source}:${type}:${id}`;
}

/**
 * インメモリキャッシュ実装
 *
 * シングルトンパターンでアプリケーション全体で共有
 * Vercel Serverless環境では、コールドスタート時にリセットされる点に注意
 */
class InMemoryCache<T> implements CacheProvider<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private stats = { hits: 0, misses: 0 };
  private maxSize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(options: { maxSize?: number; cleanupIntervalMs?: number } = {}) {
    this.maxSize = options.maxSize || 1000;

    // 定期的に期限切れエントリをクリーンアップ
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(
        () => this.cleanup(),
        options.cleanupIntervalMs || 5 * 60 * 1000, // 5分ごと
      );
    }
  }

  async get(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // TTLチェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  async set(
    key: string,
    value: T,
    ttlMs: number = DEFAULT_CACHE_TTL.PRICE,
  ): Promise<void> {
    // キャッシュサイズ制限チェック
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // TTLチェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }

  /**
   * 期限切れエントリを削除
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 最も古いエントリを削除（LRU的な動作）
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * クリーンアップタイマーを停止（テスト用）
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

/**
 * 価格データ用キャッシュのシングルトンインスタンス
 */
let priceCache: InMemoryCache<AdapterResult<PriceData>> | null = null;

export function getPriceCache(): CacheProvider<AdapterResult<PriceData>> {
  if (!priceCache) {
    priceCache = new InMemoryCache<AdapterResult<PriceData>>({
      maxSize: 2000, // 最大2000商品分
      cleanupIntervalMs: 5 * 60 * 1000,
    });
  }
  return priceCache;
}

/**
 * キャッシュ付きでAPI呼び出しを実行
 *
 * @param cacheKey キャッシュキー
 * @param fetchFn データ取得関数
 * @param ttlMs キャッシュTTL（ミリ秒）
 * @returns キャッシュされたデータまたは新規取得データ
 */
export async function withCache<T>(
  cache: CacheProvider<T>,
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = DEFAULT_CACHE_TTL.PRICE,
): Promise<T> {
  // キャッシュチェック
  const cached = await cache.get(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // 新規取得
  const data = await fetchFn();

  // キャッシュに保存（成功時のみ長期キャッシュ、エラー時は短期キャッシュ）
  const isSuccess = (data as { success?: boolean })?.success;
  const actualTtl = isSuccess ? ttlMs : Math.min(ttlMs, 5 * 60 * 1000); // エラーは最大5分
  await cache.set(cacheKey, data, actualTtl);

  return data;
}

/**
 * バッチキャッシュ取得
 * 複数商品の価格を一括でキャッシュチェック
 */
export async function batchGetFromCache<T>(
  cache: CacheProvider<T>,
  keys: string[],
): Promise<Map<string, T>> {
  const results = new Map<string, T>();

  await Promise.all(
    keys.map(async (key) => {
      const cached = await cache.get(key);
      if (cached !== null) {
        results.set(key, cached);
      }
    }),
  );

  return results;
}

/**
 * キャッシュ統計をログ出力
 */
export function logCacheStats(
  cache: CacheProvider<unknown>,
  source: string,
): void {
  const stats = cache.getStats();
  console.log(
    `[Cache:${source}] hits=${stats.hits} misses=${stats.misses} ` +
      `size=${stats.size} hitRate=${(stats.hitRate * 100).toFixed(1)}%`,
  );
}
