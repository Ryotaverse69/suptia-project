/**
 * Structured Data Validator - 型定義
 */

export type SchemaType =
  | 'Product'
  | 'BreadcrumbList'
  | 'ItemList'
  | 'Article'
  | 'Organization'
  | 'WebPage';

export type ValidationMode = 'url' | 'file';

// 構造化データ
export interface StructuredData {
  '@context': string;
  '@type': SchemaType;
  [key: string]: any;
}

// 検証エラー
export interface ValidationError {
  schemaType: SchemaType;
  field: string;
  message: string;
  severity: 'error';
  suggestion?: string;
  path?: string; // ファイルパスまたはURL
}

// 検証警告
export interface ValidationWarning {
  schemaType: SchemaType;
  field: string;
  message: string;
  severity: 'warning';
  suggestion?: string;
  path?: string;
}

// 検証結果
export interface ValidationResult {
  schemaType: SchemaType;
  data: StructuredData;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100
  passed: boolean;
  path?: string;
}

// 検証レポート
export interface ValidationReport {
  timestamp: string;
  targetCount: number;
  results: ValidationResult[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    averageScore: number;
    passedCount: number;
    failedCount: number;
  };
  overallStatus: 'pass' | 'warning' | 'fail';
}

// スキーマ定義
export interface SchemaDefinition {
  type: SchemaType;
  required: string[];
  recommended?: string[];
  properties?: Record<string, SchemaPropertyDefinition>;
}

export interface SchemaPropertyDefinition {
  type: string | string[];
  required?: boolean;
  description?: string;
  example?: any;
}

// Google Rich Results Test結果
export interface GoogleRichResultsTestResult {
  url: string;
  status: 'pass' | 'fail';
  richResultsTypes: string[];
  errors: string[];
  warnings: string[];
  testUrl?: string; // Google Test結果URL
}
