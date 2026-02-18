/**
 * 楽天API アダプター
 */

import {
  APIConfig,
  AuthTestResult,
  FetchTestResult,
  ProductData,
  RateLimitStatus,
} from '../types';

export class RakutenAdapter {
  private config: APIConfig;

  constructor() {
    this.config = {
      provider: 'rakuten',
      credentials: {
        applicationId: process.env.RAKUTEN_APPLICATION_ID,
        affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
      },
      endpoint: 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601',
    };
  }

  /**
   * 認証テスト
   */
  async testAuth(): Promise<AuthTestResult> {
    const { applicationId, affiliateId } = this.config.credentials;

    // 環境変数チェック
    if (!applicationId) {
      return {
        provider: 'rakuten',
        success: false,
        message: '❌ 楽天API の環境変数が設定されていません',
        credentialsValid: false,
        timestamp: new Date().toISOString(),
        error: 'Missing: RAKUTEN_APPLICATION_ID',
      };
    }

    // アプリケーションIDの形式チェック（通常は数字とハイフン）
    if (applicationId.length < 10) {
      return {
        provider: 'rakuten',
        success: false,
        message: '⚠️ 楽天アプリケーションIDの形式が不正です',
        credentialsValid: false,
        timestamp: new Date().toISOString(),
        error: 'RAKUTEN_APPLICATION_ID は10文字以上である必要があります',
      };
    }

    return {
      provider: 'rakuten',
      success: true,
      message: `✅ 楽天API の認証情報が正しく設定されています${affiliateId ? '（アフィリエイトID設定済み）' : '（アフィリエイトID未設定）'}`,
      credentialsValid: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 商品データ取得テスト（モック）
   */
  async testFetch(itemCode: string): Promise<FetchTestResult> {
    const startTime = Date.now();

    // 認証チェック
    const authResult = await this.testAuth();
    if (!authResult.success) {
      return {
        provider: 'rakuten',
        success: false,
        productId: itemCode,
        responseTime: Date.now() - startTime,
        error: '認証に失敗しました',
        timestamp: new Date().toISOString(),
      };
    }

    // モックデータを返す
    const mockData: ProductData = {
      id: itemCode,
      title: '【楽天1位】NOW Foods ビタミンC 1000mg 250粒',
      price: {
        amount: 1880,
        currency: 'JPY',
      },
      stock: {
        available: true,
      },
      images: [
        'https://thumbnail.image.rakuten.co.jp/example1.jpg',
        'https://thumbnail.image.rakuten.co.jp/example2.jpg',
      ],
      description:
        'NOW Foods社の高品質ビタミンCサプリメント。楽天ランキング1位獲得！ポイント10倍キャンペーン中。',
      reviews: {
        averageRating: 4.6,
        totalReviews: 892,
      },
    };

    const responseTime = Date.now() - startTime;

    return {
      provider: 'rakuten',
      success: true,
      productId: itemCode,
      data: mockData,
      responseTime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * レート制限ステータスを取得
   */
  getRateLimitStatus(): RateLimitStatus {
    // 楽天API の無料プラン制限
    return {
      provider: 'rakuten',
      maxRequestsPerSecond: 1,
      maxRequestsPerDay: 10000, // 無料プラン
      currentUsage: {
        requestsToday: 0,
        remainingToday: 10000,
      },
      estimatedNextReset: new Date(
        new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }

  /**
   * モックデータ生成
   */
  generateMockData(count: number): ProductData[] {
    const mockProducts: ProductData[] = [];

    const supplements = [
      { name: 'ビタミンC', price: 1880, rating: 4.6, reviews: 892 },
      { name: 'ビタミンD3', price: 1150, rating: 4.7, reviews: 654 },
      { name: 'マグネシウム', price: 1450, rating: 4.5, reviews: 432 },
      { name: 'オメガ3', price: 2700, rating: 4.6, reviews: 1123 },
      { name: 'プロテイン', price: 3300, rating: 4.5, reviews: 2345 },
      { name: 'クレアチン', price: 2100, rating: 4.8, reviews: 567 },
      { name: 'BCAA', price: 2400, rating: 4.6, reviews: 789 },
      { name: 'マルチビタミン', price: 1900, rating: 4.7, reviews: 1456 },
      { name: 'コエンザイムQ10', price: 1750, rating: 4.4, reviews: 321 },
      { name: 'アシュワガンダ', price: 1550, rating: 4.8, reviews: 234 },
    ];

    for (let i = 0; i < count; i++) {
      const supplement = supplements[i % supplements.length];
      const itemCode = `rakuten-item-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

      mockProducts.push({
        id: itemCode,
        title: `【楽天${(i % 5) + 1}位】${supplement.name} サプリメント ${250 + i * 10}粒`,
        price: {
          amount: supplement.price + Math.floor(Math.random() * 400),
          currency: 'JPY',
        },
        stock: {
          available: Math.random() > 0.05,
        },
        images: [
          `https://thumbnail.image.rakuten.co.jp/mock-${i}-1.jpg`,
          `https://thumbnail.image.rakuten.co.jp/mock-${i}-2.jpg`,
        ],
        description: `${supplement.name}を配合したサプリメント。楽天ポイント${Math.floor(Math.random() * 10) + 1}倍キャンペーン中！`,
        reviews: {
          averageRating: supplement.rating + (Math.random() - 0.5) * 0.4,
          totalReviews: supplement.reviews + Math.floor(Math.random() * 500),
        },
      });
    }

    return mockProducts;
  }
}
