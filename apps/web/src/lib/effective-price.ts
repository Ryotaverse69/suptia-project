/**
 * 実質価格計算ユーティリティ
 *
 * 送料・ポイント還元を考慮した実質価格を計算します。
 * これにより、Amazon送料無料 vs 楽天送料あり の不公平を解消できます。
 */

/**
 * 実質価格の計算結果
 */
export interface EffectivePriceResult {
  /** 実質価格（送料込み - ポイント還元） */
  effectivePrice: number;
  /** ポイント還元額 */
  pointAmount: number;
  /** 内訳 */
  breakdown: {
    /** 商品価格（税込） */
    basePrice: number;
    /** 送料 */
    shipping: number;
    /** ポイント還元 */
    pointDiscount: number;
  };
}

/**
 * 実質価格を計算
 *
 * @param basePrice - 商品価格（税込）
 * @param shippingFee - 送料（送料無料の場合は0）
 * @param pointRate - ポイント還元率（例: 0.10 = 10%）
 * @returns 実質価格の計算結果
 *
 * @example
 * ```typescript
 * // Amazon: ¥1,500、送料無料、ポイントなし
 * calculateEffectivePrice(1500, 0, 0)
 * // => { effectivePrice: 1500, pointAmount: 0, ... }
 *
 * // 楽天: ¥1,200、送料¥500、ポイント10%
 * calculateEffectivePrice(1200, 500, 0.10)
 * // => { effectivePrice: 1580, pointAmount: 120, ... }
 * //    (1200 + 500 - 120 = 1580)
 * ```
 */
export function calculateEffectivePrice(
  basePrice: number,
  shippingFee: number = 0,
  pointRate: number = 0,
): EffectivePriceResult {
  // 入力値検証
  if (basePrice < 0) basePrice = 0;
  if (shippingFee < 0) shippingFee = 0;
  if (pointRate < 0 || pointRate > 1) pointRate = 0;

  // ポイント還元額を計算（商品価格のみが対象、送料は対象外）
  const pointAmount = Math.floor(basePrice * pointRate);

  // 実質価格 = 商品価格 + 送料 - ポイント還元
  const effectivePrice = Math.max(0, basePrice + shippingFee - pointAmount);

  return {
    effectivePrice,
    pointAmount,
    breakdown: {
      basePrice,
      shipping: shippingFee,
      pointDiscount: pointAmount,
    },
  };
}

/**
 * ECサイト別のデフォルト送料を取得
 *
 * @param source - ECサイト名（"rakuten", "yahoo", "amazon", "iherb"）
 * @param basePrice - 商品価格（送料無料条件の判定に使用）
 * @returns 送料（円）
 *
 * 送料無料条件:
 * - Amazon: プライム会員は無料（一般会員は¥410）
 * - 楽天: 店舗により異なるが、多くは¥3,980以上で送料無料
 * - Yahoo!: 店舗により異なるが、多くは¥3,980以上で送料無料
 * - iHerb: $40以上で送料無料（約¥6,000）
 */
export function getDefaultShippingFee(
  source: string,
  basePrice: number,
): number {
  switch (source) {
    case "amazon":
      // Amazonは基本的に送料無料（プライム前提）
      return 0;

    case "rakuten":
    case "yahoo":
      // 楽天・Yahoo!は¥3,980以上で送料無料が多い
      return basePrice >= 3980 ? 0 : 500;

    case "iherb":
      // iHerbは$40以上（約¥6,000）で送料無料
      return basePrice >= 6000 ? 0 : 800;

    default:
      return 0;
  }
}

/**
 * ECサイト別のデフォルトポイント還元率を取得
 *
 * @param source - ECサイト名
 * @returns ポイント還元率（0.0 - 1.0）
 *
 * 標準還元率:
 * - Amazon: 0.5% - 1%（通常商品）
 * - 楽天: 1% - 15%（SPU・キャンペーン込み、平均5%と仮定）
 * - Yahoo!: 1% - 10%（PayPayボーナス、平均3%と仮定）
 * - iHerb: 5% - 10%（ロイヤルティクレジット）
 */
export function getDefaultPointRate(source: string): number {
  switch (source) {
    case "amazon":
      return 0.01; // 1%

    case "rakuten":
      return 0.05; // 5%（SPU込み）

    case "yahoo":
      return 0.03; // 3%（PayPayボーナス）

    case "iherb":
      return 0.05; // 5%（ロイヤルティクレジット）

    default:
      return 0;
  }
}

/**
 * 複数の価格データから最安値の実質価格を見つける
 *
 * @param prices - 価格データの配列
 * @returns 最安値の実質価格（円）
 */
export function findMinEffectivePrice(
  prices: Array<{
    amount: number;
    source: string;
    shippingFee?: number;
    pointRate?: number;
  }>,
): number {
  if (prices.length === 0) return 0;

  const effectivePrices = prices.map((price) => {
    const shipping =
      price.shippingFee ?? getDefaultShippingFee(price.source, price.amount);
    const pointRate = price.pointRate ?? getDefaultPointRate(price.source);
    return calculateEffectivePrice(price.amount, shipping, pointRate)
      .effectivePrice;
  });

  return Math.min(...effectivePrices);
}
