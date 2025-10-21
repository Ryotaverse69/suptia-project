/**
 * データ品質バリデーター
 */

import { ProductData, QualityScore, APIProvider } from '../types';

/**
 * 商品データの品質スコアを算出
 */
export const calculateQualityScore = (
  provider: APIProvider,
  productId: string,
  data: ProductData
): QualityScore => {
  const breakdown = {
    priceAccuracy: calculatePriceAccuracy(data),
    stockAvailability: calculateStockAvailability(data),
    imageQuality: calculateImageQuality(data),
    descriptionCompleteness: calculateDescriptionCompleteness(data),
    reviewData: calculateReviewData(data),
    responseTime: 5, // デフォルト値（実際のレスポンスタイムから計算）
  };

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  const issues: string[] = [];
  const recommendations: string[] = [];

  // 問題点と推奨事項を生成
  if (breakdown.priceAccuracy < 20) {
    issues.push('価格情報が不完全です');
    recommendations.push('価格と通貨情報を正確に取得してください');
  }

  if (breakdown.stockAvailability < 15) {
    issues.push('在庫情報が不足しています');
    recommendations.push('在庫状況を定期的に更新してください');
  }

  if (breakdown.imageQuality < 10) {
    issues.push('商品画像が不足しています');
    recommendations.push('2枚以上の高品質な画像を取得してください');
  }

  if (breakdown.descriptionCompleteness < 10) {
    issues.push('商品説明が短すぎます');
    recommendations.push('詳細な商品説明を取得してください（50文字以上推奨）');
  }

  if (breakdown.reviewData < 5) {
    issues.push('レビューデータが不足しています');
    recommendations.push('レビュー評価とレビュー数を取得してください');
  }

  return {
    provider,
    productId,
    totalScore,
    breakdown,
    issues,
    recommendations,
  };
};

/**
 * 価格正確性スコア（0-30点）
 */
const calculatePriceAccuracy = (data: ProductData): number => {
  let score = 0;

  if (data.price) {
    // 価格が存在する: +15点
    score += 15;

    // 価格が正の数: +5点
    if (data.price.amount > 0) {
      score += 5;
    }

    // 通貨が指定されている: +5点
    if (data.price.currency) {
      score += 5;
    }

    // 価格が妥当な範囲（100円〜100,000円）: +5点
    if (data.price.amount >= 100 && data.price.amount <= 100000) {
      score += 5;
    }
  }

  return score;
};

/**
 * 在庫可用性スコア（0-25点）
 */
const calculateStockAvailability = (data: ProductData): number => {
  let score = 0;

  if (data.stock) {
    // 在庫情報が存在する: +10点
    score += 10;

    // 在庫状況が明示されている: +10点
    if (typeof data.stock.available === 'boolean') {
      score += 10;
    }

    // 在庫数が明示されている: +5点
    if (data.stock.quantity !== undefined && data.stock.quantity > 0) {
      score += 5;
    }
  }

  return score;
};

/**
 * 画像品質スコア（0-15点）
 */
const calculateImageQuality = (data: ProductData): number => {
  let score = 0;

  if (data.images && data.images.length > 0) {
    // 画像が1枚以上: +5点
    score += 5;

    // 画像が2枚以上: +5点
    if (data.images.length >= 2) {
      score += 5;
    }

    // 画像URLが有効（https://で始まる）: +5点
    const validImages = data.images.filter((url) => url.startsWith('https://'));
    if (validImages.length === data.images.length) {
      score += 5;
    }
  }

  return score;
};

/**
 * 説明完全性スコア（0-15点）
 */
const calculateDescriptionCompleteness = (data: ProductData): number => {
  let score = 0;

  if (data.description) {
    // 説明が存在する: +5点
    score += 5;

    // 説明が50文字以上: +5点
    if (data.description.length >= 50) {
      score += 5;
    }

    // 説明が100文字以上: +5点
    if (data.description.length >= 100) {
      score += 5;
    }
  }

  return score;
};

/**
 * レビューデータスコア（0-10点）
 */
const calculateReviewData = (data: ProductData): number => {
  let score = 0;

  if (data.reviews) {
    // レビューが存在する: +3点
    score += 3;

    // 平均評価が存在する: +3点
    if (data.reviews.averageRating !== undefined && data.reviews.averageRating > 0) {
      score += 3;
    }

    // レビュー数が存在する: +2点
    if (data.reviews.totalReviews !== undefined && data.reviews.totalReviews > 0) {
      score += 2;
    }

    // レビュー数が10件以上: +2点
    if (data.reviews.totalReviews && data.reviews.totalReviews >= 10) {
      score += 2;
    }
  }

  return score;
};

/**
 * レスポンスタイムスコア（0-5点）
 */
export const calculateResponseTimeScore = (responseTime: number): number => {
  // 500ms以下: 5点
  if (responseTime <= 500) return 5;
  // 1000ms以下: 4点
  if (responseTime <= 1000) return 4;
  // 1500ms以下: 3点
  if (responseTime <= 1500) return 3;
  // 2000ms以下: 2点
  if (responseTime <= 2000) return 2;
  // 2000ms超: 0点
  return 0;
};
