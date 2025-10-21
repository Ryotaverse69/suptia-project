/**
 * Amazon PA-API アダプター
 */

import {
  APIConfig,
  AuthTestResult,
  FetchTestResult,
  ProductData,
  RateLimitStatus,
} from '../types';

export class AmazonAdapter {
  private config: APIConfig;

  constructor() {
    this.config = {
      provider: 'amazon',
      credentials: {
        accessKey: process.env.AMAZON_ACCESS_KEY_ID,
        secretKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        associateTag: process.env.AMAZON_ASSOCIATE_TAG,
      },
      endpoint: 'https://webservices.amazon.co.jp/paapi5',
      region: process.env.AMAZON_REGION || 'us-west-2',
    };
  }

  /**
   * 認証テスト
   */
  async testAuth(): Promise<AuthTestResult> {
    const { accessKey, secretKey, associateTag } = this.config.credentials;

    // 環境変数チェック
    if (!accessKey || !secretKey || !associateTag) {
      return {
        provider: 'amazon',
        success: false,
        message: '❌ Amazon PA-API の環境変数が設定されていません',
        credentialsValid: false,
        timestamp: new Date().toISOString(),
        error: `Missing: ${!accessKey ? 'AMAZON_ACCESS_KEY_ID ' : ''}${!secretKey ? 'AMAZON_SECRET_ACCESS_KEY ' : ''}${!associateTag ? 'AMAZON_ASSOCIATE_TAG' : ''}`,
      };
    }

    // 簡易バリデーション（長さチェック）
    if (accessKey.length < 16 || secretKey.length < 30) {
      return {
        provider: 'amazon',
        success: false,
        message: '⚠️ 認証情報の形式が不正です',
        credentialsValid: false,
        timestamp: new Date().toISOString(),
        error: 'ACCESS_KEY_ID は16文字以上、SECRET_ACCESS_KEY は30文字以上である必要があります',
      };
    }

    return {
      provider: 'amazon',
      success: true,
      message: '✅ Amazon PA-API の認証情報が正しく設定されています',
      credentialsValid: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 商品データ取得テスト（モック）
   */
  async testFetch(asin: string): Promise<FetchTestResult> {
    const startTime = Date.now();

    // 認証チェック
    const authResult = await this.testAuth();
    if (!authResult.success) {
      return {
        provider: 'amazon',
        success: false,
        productId: asin,
        responseTime: Date.now() - startTime,
        error: '認証に失敗しました',
        timestamp: new Date().toISOString(),
      };
    }

    // モックデータを返す（実際のAPI呼び出しはフェーズ2.5で実装）
    const mockData: ProductData = {
      id: asin,
      title: 'NOW Foods ビタミンC 1000mg 250粒',
      price: {
        amount: 1980,
        currency: 'JPY',
      },
      stock: {
        available: true,
        quantity: 15,
      },
      images: [
        'https://m.media-amazon.com/images/I/example1.jpg',
        'https://m.media-amazon.com/images/I/example2.jpg',
      ],
      description:
        'NOW Foods社の高品質ビタミンCサプリメント。1粒1000mg配合で、健康維持をサポートします。',
      reviews: {
        averageRating: 4.5,
        totalReviews: 1234,
      },
    };

    const responseTime = Date.now() - startTime;

    return {
      provider: 'amazon',
      success: true,
      productId: asin,
      data: mockData,
      responseTime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * レート制限ステータスを取得
   */
  getRateLimitStatus(): RateLimitStatus {
    // Amazon PA-API 5.0 のデフォルト制限
    return {
      provider: 'amazon',
      maxRequestsPerSecond: 1,
      maxRequestsPerDay: 8640, // 基本アカウント
      currentUsage: {
        requestsToday: 0, // 実際のトラッキングはフェーズ2.5で実装
        remainingToday: 8640,
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
      { name: 'ビタミンC', price: 1980, rating: 4.5 },
      { name: 'ビタミンD3', price: 1200, rating: 4.7 },
      { name: 'マグネシウム', price: 1500, rating: 4.3 },
      { name: 'オメガ3', price: 2800, rating: 4.6 },
      { name: 'プロテイン', price: 3500, rating: 4.4 },
      { name: 'クレアチン', price: 2200, rating: 4.8 },
      { name: 'BCAA', price: 2500, rating: 4.5 },
      { name: 'マルチビタミン', price: 2000, rating: 4.6 },
      { name: 'コエンザイムQ10', price: 1800, rating: 4.4 },
      { name: 'アシュワガンダ', price: 1600, rating: 4.7 },
    ];

    for (let i = 0; i < count; i++) {
      const supplement = supplements[i % supplements.length];
      const asin = `B${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`;

      mockProducts.push({
        id: asin,
        title: `NOW Foods ${supplement.name} サプリメント ${250 + i * 10}粒`,
        price: {
          amount: supplement.price + Math.floor(Math.random() * 500),
          currency: 'JPY',
        },
        stock: {
          available: Math.random() > 0.1,
          quantity: Math.floor(Math.random() * 50) + 1,
        },
        images: [
          `https://m.media-amazon.com/images/I/mock-${i}-1.jpg`,
          `https://m.media-amazon.com/images/I/mock-${i}-2.jpg`,
        ],
        description: `${supplement.name}を配合したサプリメント。健康維持をサポートします。`,
        reviews: {
          averageRating: supplement.rating + (Math.random() - 0.5) * 0.5,
          totalReviews: Math.floor(Math.random() * 2000) + 100,
        },
      });
    }

    return mockProducts;
  }
}
