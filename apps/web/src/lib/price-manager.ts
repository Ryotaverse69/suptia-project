/**
 * 価格データ管理ライブラリ
 *
 * API取得した価格データをSanityに保存・管理します。
 */

import { sanityServer } from "./sanityServer";

/**
 * 価格データ（Sanity保存用）
 */
export interface PriceDataForSanity {
  source: "rakuten" | "amazon" | "iherb";
  amount: number;
  currency: string;
  url: string;
  fetchedAt: string; // ISO 8601 datetime
  confidence?: number;
}

/**
 * 価格履歴エントリ
 */
export interface PriceHistoryEntry {
  source: string;
  amount: number;
  recordedAt: string; // ISO 8601 datetime
}

/**
 * 価格データ保存オプション
 */
export interface SavePriceOptions {
  /** 価格履歴を記録するか（デフォルト: true） */
  recordHistory?: boolean;
  /** 価格履歴の最大保存件数（デフォルト: 100） */
  maxHistoryEntries?: number;
  /** 価格変動閾値（この値以上変動した場合のみ履歴に記録、デフォルト: 0.05 = 5%） */
  priceChangeThreshold?: number;
}

/**
 * 商品の価格データを更新
 *
 * @param productId Sanity商品ID
 * @param priceData 価格データ配列
 * @param options 保存オプション
 */
export async function savePriceData(
  productId: string,
  priceData: PriceDataForSanity[],
  options: SavePriceOptions = {},
): Promise<void> {
  const {
    recordHistory = true,
    maxHistoryEntries = 100,
    priceChangeThreshold = 0.05,
  } = options;

  if (priceData.length === 0) {
    console.warn(`[PriceManager] No price data to save for ${productId}`);
    return;
  }

  try {
    // 現在の価格データと価格履歴を取得
    const currentProduct = await sanityServer.fetch(
      `*[_id == $id][0]{ priceData, priceHistory }`,
      { id: productId },
    );

    // 新しい価格履歴エントリを作成
    let newHistoryEntries: PriceHistoryEntry[] = [];

    if (recordHistory && currentProduct?.priceData) {
      // 既存の価格データと比較して、変動があれば履歴に記録
      for (const newPrice of priceData) {
        const oldPrice = currentProduct.priceData.find(
          (p: PriceDataForSanity) => p.source === newPrice.source,
        );

        if (oldPrice) {
          const priceChange = Math.abs(
            (newPrice.amount - oldPrice.amount) / oldPrice.amount,
          );

          if (priceChange >= priceChangeThreshold) {
            newHistoryEntries.push({
              source: newPrice.source,
              amount: oldPrice.amount,
              recordedAt: oldPrice.fetchedAt,
            });
          }
        }
      }
    }

    // 価格履歴を更新（最大件数を超えた場合は古いものを削除）
    let updatedHistory: PriceHistoryEntry[] = [
      ...(currentProduct?.priceHistory || []),
      ...newHistoryEntries,
    ];

    // ソースごとに最新のN件のみ保持
    const historyBySource: Record<string, PriceHistoryEntry[]> = {};
    for (const entry of updatedHistory) {
      if (!historyBySource[entry.source]) {
        historyBySource[entry.source] = [];
      }
      historyBySource[entry.source].push(entry);
    }

    // 各ソースごとに最新maxHistoryEntries件のみ保持
    updatedHistory = [];
    for (const source in historyBySource) {
      const entries = historyBySource[source]
        .sort(
          (a, b) =>
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
        )
        .slice(0, maxHistoryEntries);
      updatedHistory.push(...entries);
    }

    // Sanityに保存
    await sanityServer
      .patch(productId)
      .set({
        priceData: priceData.map((p) => ({
          _type: "object",
          ...p,
        })),
        priceHistory: updatedHistory.map((h) => ({
          _type: "object",
          ...h,
        })),
      })
      .commit();

    console.log(
      `[PriceManager] Saved ${priceData.length} price(s) for ${productId}${newHistoryEntries.length > 0 ? `, recorded ${newHistoryEntries.length} history entries` : ""}`,
    );
  } catch (error) {
    console.error(
      `[PriceManager] Error saving price data for ${productId}:`,
      error,
    );
    throw error;
  }
}

/**
 * 複数商品の価格データを一括保存
 *
 * @param updates 商品IDと価格データのマップ
 * @param options 保存オプション
 */
export async function saveBulkPriceData(
  updates: Array<{
    productId: string;
    priceData: PriceDataForSanity[];
  }>,
  options: SavePriceOptions = {},
): Promise<{
  successCount: number;
  failureCount: number;
  errors: Array<{ productId: string; error: string }>;
}> {
  let successCount = 0;
  let failureCount = 0;
  const errors: Array<{ productId: string; error: string }> = [];

  for (const update of updates) {
    try {
      await savePriceData(update.productId, update.priceData, options);
      successCount++;
    } catch (error) {
      failureCount++;
      errors.push({
        productId: update.productId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  console.log(
    `[PriceManager] Bulk save completed: ${successCount} success, ${failureCount} failure`,
  );

  return { successCount, failureCount, errors };
}

/**
 * 商品の最新価格を取得
 *
 * @param productId Sanity商品ID
 * @returns 価格データ配列
 */
export async function getLatestPrices(
  productId: string,
): Promise<PriceDataForSanity[]> {
  const product = await sanityServer.fetch(`*[_id == $id][0]{ priceData }`, {
    id: productId,
  });

  return product?.priceData || [];
}

/**
 * 商品の価格履歴を取得
 *
 * @param productId Sanity商品ID
 * @param source ソースフィルター（オプション）
 * @returns 価格履歴配列
 */
export async function getPriceHistory(
  productId: string,
  source?: string,
): Promise<PriceHistoryEntry[]> {
  const product = await sanityServer.fetch(`*[_id == $id][0]{ priceHistory }`, {
    id: productId,
  });

  const history = product?.priceHistory || [];

  if (source) {
    return history.filter((h: PriceHistoryEntry) => h.source === source);
  }

  return history;
}

/**
 * 価格アラート条件をチェック
 *
 * 指定した商品の価格が目標価格以下になった場合にtrueを返します。
 *
 * @param productId Sanity商品ID
 * @param targetPrice 目標価格
 * @param source ソース（オプション）
 * @returns 条件を満たす場合true
 */
export async function checkPriceAlert(
  productId: string,
  targetPrice: number,
  source?: string,
): Promise<boolean> {
  const prices = await getLatestPrices(productId);

  const relevantPrices = source
    ? prices.filter((p) => p.source === source)
    : prices;

  return relevantPrices.some((p) => p.amount <= targetPrice);
}
