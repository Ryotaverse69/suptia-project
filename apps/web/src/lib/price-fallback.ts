/**
 * 価格データフォールバックシステム
 *
 * API障害時に最後の有効な価格データを返す
 * メモリキャッシュとlocalStorage（クライアント）を併用
 */

// キャッシュ有効期限（1時間）
const CACHE_TTL_MS = 60 * 60 * 1000;

// 最大キャッシュエントリ数
const MAX_CACHE_ENTRIES = 500;

interface CachedPrice {
  productId: string;
  prices: Array<{
    source: string;
    amount: number;
    currency: string;
    url: string;
    fetchedAt: string;
  }>;
  cachedAt: number;
}

// サーバーサイドメモリキャッシュ
const memoryCache = new Map<string, CachedPrice>();

/**
 * 価格データをキャッシュに保存
 */
export function cachePrices(
  productId: string,
  prices: CachedPrice["prices"],
): void {
  // キャッシュサイズ制限
  if (memoryCache.size >= MAX_CACHE_ENTRIES) {
    // 最も古いエントリを削除
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, value] of memoryCache.entries()) {
      if (value.cachedAt < oldestTime) {
        oldestTime = value.cachedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      memoryCache.delete(oldestKey);
    }
  }

  memoryCache.set(productId, {
    productId,
    prices,
    cachedAt: Date.now(),
  });
}

/**
 * キャッシュから価格データを取得
 */
export function getCachedPrices(
  productId: string,
): CachedPrice["prices"] | null {
  const cached = memoryCache.get(productId);

  if (!cached) {
    return null;
  }

  // 有効期限チェック
  if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
    memoryCache.delete(productId);
    return null;
  }

  return cached.prices;
}

/**
 * キャッシュの有効期限が切れているかチェック（ただし削除はしない）
 * フォールバック用に古いデータも返す
 */
export function getCachedPricesWithFallback(
  productId: string,
): { prices: CachedPrice["prices"]; isStale: boolean } | null {
  const cached = memoryCache.get(productId);

  if (!cached) {
    return null;
  }

  const isStale = Date.now() - cached.cachedAt > CACHE_TTL_MS;

  return {
    prices: cached.prices,
    isStale,
  };
}

/**
 * 指数バックオフでリトライ
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  } = {},
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        // ジッター追加（0.5〜1.5倍）
        const jitteredDelay = delay * (0.5 + Math.random());
        await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
      }
    }
  }

  throw lastError;
}

/**
 * 複数のソースから価格を取得し、フォールバックを適用
 */
export async function fetchPricesWithFallback(
  productId: string,
  fetchFn: () => Promise<CachedPrice["prices"]>,
): Promise<{
  prices: CachedPrice["prices"];
  source: "fresh" | "cache" | "stale";
}> {
  try {
    // 新しいデータを取得
    const freshPrices = await withRetry(fetchFn, {
      maxRetries: 2,
      baseDelay: 500,
    });

    if (freshPrices.length > 0) {
      // キャッシュを更新
      cachePrices(productId, freshPrices);
      return { prices: freshPrices, source: "fresh" };
    }
  } catch (error) {
    console.warn(
      `[PriceFallback] Failed to fetch fresh prices for ${productId}:`,
      error,
    );
  }

  // フレッシュデータ取得失敗時はキャッシュを使用
  const cachedResult = getCachedPricesWithFallback(productId);

  if (cachedResult) {
    console.log(
      `[PriceFallback] Using ${cachedResult.isStale ? "stale" : ""} cached prices for ${productId}`,
    );
    return {
      prices: cachedResult.prices,
      source: cachedResult.isStale ? "stale" : "cache",
    };
  }

  // キャッシュもない場合は空配列を返す
  return { prices: [], source: "fresh" };
}

/**
 * キャッシュ統計を取得
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  let oldestEntry: number | null = null;
  let newestEntry: number | null = null;

  for (const value of memoryCache.values()) {
    if (oldestEntry === null || value.cachedAt < oldestEntry) {
      oldestEntry = value.cachedAt;
    }
    if (newestEntry === null || value.cachedAt > newestEntry) {
      newestEntry = value.cachedAt;
    }
  }

  return {
    size: memoryCache.size,
    maxSize: MAX_CACHE_ENTRIES,
    oldestEntry,
    newestEntry,
  };
}

/**
 * キャッシュをクリア
 */
export function clearCache(): void {
  memoryCache.clear();
}
