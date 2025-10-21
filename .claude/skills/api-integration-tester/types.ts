/**
 * API Integration Tester - 型定義
 */

export type APIProvider = 'amazon' | 'rakuten';

export type TestType = 'auth' | 'fetch' | 'quality' | 'rate-limit' | 'all';

export interface APIConfig {
  provider: APIProvider;
  credentials: {
    accessKey?: string;
    secretKey?: string;
    associateTag?: string;
    applicationId?: string;
    affiliateId?: string;
  };
  endpoint: string;
  region?: string;
}

// 認証テスト結果
export interface AuthTestResult {
  provider: APIProvider;
  success: boolean;
  message: string;
  credentialsValid: boolean;
  timestamp: string;
  error?: string;
}

// データ取得テスト結果
export interface FetchTestResult {
  provider: APIProvider;
  success: boolean;
  productId: string;
  data?: ProductData;
  responseTime: number; // ms
  error?: string;
  timestamp: string;
}

// 商品データ
export interface ProductData {
  id: string;
  title: string;
  price?: {
    amount: number;
    currency: string;
  };
  stock?: {
    available: boolean;
    quantity?: number;
  };
  images?: string[];
  description?: string;
  reviews?: {
    averageRating: number;
    totalReviews: number;
  };
  rawResponse?: any; // 生のAPIレスポンス
}

// データ品質スコア
export interface QualityScore {
  provider: APIProvider;
  productId: string;
  totalScore: number; // 0-100
  breakdown: {
    priceAccuracy: number; // 0-30
    stockAvailability: number; // 0-25
    imageQuality: number; // 0-15
    descriptionCompleteness: number; // 0-15
    reviewData: number; // 0-10
    responseTime: number; // 0-5
  };
  issues: string[];
  recommendations: string[];
}

// レート制限ステータス
export interface RateLimitStatus {
  provider: APIProvider;
  maxRequestsPerSecond: number;
  maxRequestsPerDay: number;
  currentUsage: {
    requestsToday: number;
    remainingToday: number;
  };
  estimatedNextReset: string;
  warning?: string;
}

// テストレポート
export interface TestReport {
  provider: APIProvider;
  timestamp: string;
  testsRun: {
    auth: boolean;
    fetch: boolean;
    quality: boolean;
    rateLimit: boolean;
  };
  results: {
    auth?: AuthTestResult;
    fetch?: FetchTestResult;
    quality?: QualityScore;
    rateLimit?: RateLimitStatus;
  };
  overallStatus: 'pass' | 'fail' | 'warning';
  summary: string;
}

// モックデータ生成設定
export interface MockDataConfig {
  provider: APIProvider;
  count: number;
  productType?: 'supplement' | 'vitamin' | 'protein' | 'all';
}

// モック商品データ
export interface MockProductData extends ProductData {
  isMock: true;
  generatedAt: string;
}
